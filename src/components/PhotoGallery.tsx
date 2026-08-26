"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export const GALLERY_PAGE_SIZE = 12;

export type GalleryPhotoItem = {
  src: string;
  alt?: string;
};

interface PhotoGalleryProps {
  photos: GalleryPhotoItem[];
  /** e.g. "Gallery image" → "Gallery image 1" when alt is empty */
  altPrefix?: string;
  pageSize?: number;
}

export default function PhotoGallery({
  photos,
  altPrefix = "Photo",
  pageSize = GALLERY_PAGE_SIZE,
}: PhotoGalleryProps) {
  const { t } = useLanguage();
  const [page, setPage] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const totalPages = Math.max(1, Math.ceil(photos.length / pageSize));

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages - 1));
  }, [totalPages]);

  const pageStart = page * pageSize;
  const pagePhotos = useMemo(
    () => photos.slice(pageStart, pageStart + pageSize),
    [photos, pageStart, pageSize]
  );

  const goToPrevious = useCallback(() => {
    setSelectedIndex((currentIndex) => {
      if (currentIndex === null) return null;
      return currentIndex > 0 ? currentIndex - 1 : photos.length - 1;
    });
  }, [photos.length]);

  const goToNext = useCallback(() => {
    setSelectedIndex((currentIndex) => {
      if (currentIndex === null) return null;
      return currentIndex < photos.length - 1 ? currentIndex + 1 : 0;
    });
  }, [photos.length]);

  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goToNext();
      } else if (e.key === "Escape") {
        e.preventDefault();
        setSelectedIndex(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, goToPrevious, goToNext]);

  if (photos.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {pagePhotos.map((photo, index) => {
          const globalIndex = pageStart + index;
          return (
            <div
              key={`${photo.src}-${globalIndex}`}
              className="relative aspect-square cursor-pointer overflow-hidden rounded-md shadow-md transition-all duration-300 group hover:shadow-xl sm:rounded-lg image-container"
              onClick={() => setSelectedIndex(globalIndex)}
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            >
              <Image
                src={photo.src}
                alt={photo.alt?.trim() || `${altPrefix} ${globalIndex + 1}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300 select-none"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            </div>
          );
        })}
      </div>

      {totalPages > 1 ? (
        <nav
          className="mt-8 flex flex-wrap items-center justify-center gap-2"
          aria-label={t("gallery.paginationLabel")}
        >
          <button
            type="button"
            disabled={page === 0}
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
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            className="rounded-lg border border-ink-200 bg-surface px-3 py-2 text-sm font-medium text-ink-800 transition hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t("gallery.nextPage")}
          </button>
        </nav>
      ) : null}

      {selectedIndex !== null && photos[selectedIndex] ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-2 sm:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedIndex(null);
            }
          }}
        >
          <div className="relative max-h-[90dvh] w-full max-w-6xl">
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute right-4 top-[max(0.5rem,env(safe-area-inset-top))] z-20 flex h-11 min-w-11 items-center justify-center rounded-full bg-black/50 text-3xl font-bold text-surface transition-colors hover:bg-black/70 hover:text-gray-200"
              aria-label="닫기"
            >
              ×
            </button>

            {photos.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-1 top-1/2 z-20 flex h-12 min-w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-3xl font-bold text-surface transition-colors hover:bg-black/70 sm:left-4 sm:text-4xl"
                aria-label="이전 사진"
              >
                ‹
              </button>
            )}

            {photos.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-1 top-1/2 z-20 flex h-12 min-w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-3xl font-bold text-surface transition-colors hover:bg-black/70 sm:right-4 sm:text-4xl"
                aria-label="다음 사진"
              >
                ›
              </button>
            )}

            {photos.length > 1 && (
              <div className="absolute bottom-[max(0.5rem,env(safe-area-inset-bottom))] left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-sm text-surface">
                {selectedIndex + 1} / {photos.length}
              </div>
            )}

            <div
              className="relative flex h-full w-full items-center justify-center image-container"
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            >
              <Image
                src={photos[selectedIndex].src}
                alt={photos[selectedIndex].alt?.trim() || `${altPrefix} ${selectedIndex + 1}`}
                width={1200}
                height={1200}
                className="max-h-[85dvh] max-w-full select-none rounded-md object-contain sm:max-h-[90vh] sm:rounded-lg"
                priority
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
