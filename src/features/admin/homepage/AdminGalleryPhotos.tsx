"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GALLERY_PAGE_SIZE } from "@/components/PhotoGallery";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import {
  deleteGalleryImage,
  fetchAllGalleryImages,
  getGalleryPublicUrl,
  reorderGalleryImages,
  updateGalleryImage,
  uploadGalleryImage,
} from "@/lib/gallery/api";
import type { GalleryImage } from "@/lib/supabase/database.types";

export default function AdminGalleryPhotos() {
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(images.length / GALLERY_PAGE_SIZE));
  const pageStart = page * GALLERY_PAGE_SIZE;
  const pageImages = useMemo(
    () => images.slice(pageStart, pageStart + GALLERY_PAGE_SIZE),
    [images, pageStart]
  );

  const load = useCallback(async () => {
    setLoading(true);
    const rows = await fetchAllGalleryImages();
    setImages(rows);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages - 1));
  }, [totalPages]);

  async function handleUpload(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setError(null);
    setMessage(null);

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        setError(t("admin.gallery.invalidType"));
        continue;
      }
      const result = await uploadGalleryImage(file);
      if (result.error) {
        setError(result.error === "not_logged_in" ? t("auth.notLoggedIn") : result.error);
        setBusy(false);
        return;
      }
    }

    await load();
    setMessage(t("admin.gallery.uploadSuccess"));
    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleDelete(image: GalleryImage) {
    if (!window.confirm(t("admin.gallery.deleteConfirm"))) return;
    setBusy(true);
    setError(null);
    const result = await deleteGalleryImage(image);
    if (result.error) {
      setError(result.error);
      setBusy(false);
      return;
    }
    await load();
    setMessage(t("admin.gallery.deleteSuccess"));
    setBusy(false);
  }

  async function handleTogglePublish(image: GalleryImage) {
    setBusy(true);
    setError(null);
    const result = await updateGalleryImage(image.id, { is_published: !image.is_published });
    if (result.error) {
      setError(result.error);
      setBusy(false);
      return;
    }
    await load();
    setBusy(false);
  }

  async function move(globalIndex: number, direction: -1 | 1) {
    const target = globalIndex + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    const [item] = next.splice(globalIndex, 1);
    next.splice(target, 0, item);
    setImages(next);
    setBusy(true);
    setError(null);
    const result = await reorderGalleryImages(next.map((row) => row.id));
    if (result.error) {
      setError(result.error);
      await load();
    }
    setBusy(false);
  }

  return (
    <div className="rounded-xl border border-ink-200 bg-surface-muted/40 p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-ink-900">{t("admin.gallery.title")}</h3>
          <p className="mt-1 text-sm text-ink-600">{t("admin.gallery.lead")}</p>
        </div>
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={(e) => void handleUpload(e.target.files)}
          />
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60"
          >
            {busy ? t("auth.loading") : t("admin.gallery.upload")}
          </button>
        </div>
      </div>

      {message ? <p className="mt-3 text-sm text-brand-800">{message}</p> : null}
      {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}

      {loading ? (
        <p className="mt-4 text-sm text-ink-500">{t("auth.loading")}</p>
      ) : images.length === 0 ? (
        <p className="mt-4 text-sm text-ink-500">{t("admin.gallery.empty")}</p>
      ) : (
        <>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {pageImages.map((image, index) => {
              const globalIndex = pageStart + index;
              return (
                <li
                  key={image.id}
                  className="overflow-hidden rounded-xl border border-ink-200 bg-surface"
                >
                  <div className="relative aspect-square bg-ink-100">
                    <Image
                      src={getGalleryPublicUrl(image.storage_path)}
                      alt={image.alt_text || image.file_name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    {!image.is_published ? (
                      <span className="absolute left-2 top-2 rounded bg-ink-900/75 px-2 py-0.5 text-xs text-surface">
                        {t("admin.gallery.hidden")}
                      </span>
                    ) : null}
                  </div>
                  <div className="space-y-2 p-3">
                    <p className="truncate text-xs text-ink-500">{image.file_name}</p>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        disabled={busy || globalIndex === 0}
                        onClick={() => void move(globalIndex, -1)}
                        className="rounded border border-ink-200 px-2 py-1 text-xs text-ink-700 hover:bg-ink-50 disabled:opacity-40"
                      >
                        {t("admin.gallery.moveUp")}
                      </button>
                      <button
                        type="button"
                        disabled={busy || globalIndex === images.length - 1}
                        onClick={() => void move(globalIndex, 1)}
                        className="rounded border border-ink-200 px-2 py-1 text-xs text-ink-700 hover:bg-ink-50 disabled:opacity-40"
                      >
                        {t("admin.gallery.moveDown")}
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void handleTogglePublish(image)}
                        className="rounded border border-ink-200 px-2 py-1 text-xs text-ink-700 hover:bg-ink-50 disabled:opacity-40"
                      >
                        {image.is_published ? t("admin.gallery.hide") : t("admin.gallery.show")}
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void handleDelete(image)}
                        className="rounded border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50 disabled:opacity-40"
                      >
                        {t("admin.gallery.delete")}
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {totalPages > 1 ? (
            <nav
              className="mt-4 flex flex-wrap items-center justify-center gap-2"
              aria-label={t("gallery.paginationLabel")}
            >
              <button
                type="button"
                disabled={page === 0 || busy}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="rounded-lg border border-ink-200 bg-surface px-3 py-2 text-sm font-medium text-ink-800 transition hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {t("gallery.prevPage")}
              </button>
              <span className="px-2 text-sm text-ink-600">
                {t("gallery.pageStatus")
                  .replace("{{current}}", String(page + 1))
                  .replace("{{total}}", String(totalPages))}
              </span>
              <button
                type="button"
                disabled={page >= totalPages - 1 || busy}
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                className="rounded-lg border border-ink-200 bg-surface px-3 py-2 text-sm font-medium text-ink-800 transition hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {t("gallery.nextPage")}
              </button>
            </nav>
          ) : null}
        </>
      )}
    </div>
  );
}
