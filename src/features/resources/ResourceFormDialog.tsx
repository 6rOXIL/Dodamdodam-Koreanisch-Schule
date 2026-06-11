"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import {
  RESOURCE_ACCEPT_ATTRIBUTE,
  RESOURCE_MAX_FILE_SIZE_MB,
  formatResourceFileSize,
  validateResourceFile,
} from "@/lib/resources/fileConstraints";
import { RESOURCE_CLASS_SLUGS } from "@/lib/resources/classSlugs";
import { createClient } from "@/lib/supabase/client";
import type { Resource, ResourceCategory } from "@/lib/supabase/database.types";

type ResourceFormDialogProps = {
  open: boolean;
  mode: "upload" | "edit";
  resource?: Resource | null;
  categories: ResourceCategory[];
  onClose: () => void;
  onSuccess: (resource: Resource, replacedStoragePath?: string) => void;
  onError: (message: string) => void;
};

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export default function ResourceFormDialog({
  open,
  mode,
  resource,
  categories,
  onClose,
  onSuccess,
  onError,
}: ResourceFormDialogProps) {
  const { t } = useLanguage();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [classSlug, setClassSlug] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [publish, setPublish] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      if (mode === "edit" && resource) {
        setTitle(resource.title);
        setDescription(resource.description ?? "");
        setCategoryId(resource.category_id ?? categories[0]?.id ?? "");
        setClassSlug(resource.class_slug ?? "");
        setPublish(resource.is_published);
      } else {
        setTitle("");
        setDescription("");
        setCategoryId(categories[0]?.id ?? "");
        setClassSlug("");
        setPublish(false);
      }
      setFile(null);
      setFileError(null);
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open, mode, resource, categories]);

  function handleClose() {
    if (submitting) return;
    onClose();
  }

  function handleFileChange(nextFile: File | null) {
    setFile(nextFile);
    if (!nextFile) {
      setFileError(null);
      return;
    }

    const validation = validateResourceFile(nextFile);
    if (!validation.valid) {
      setFileError(
        validation.error === "size"
          ? t("resources.fileTooLarge").replace("{{max}}", String(RESOURCE_MAX_FILE_SIZE_MB))
          : t("resources.fileTypeNotAllowed")
      );
      return;
    }

    setFileError(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (mode === "upload" && !file) return;
    if (mode === "edit" && !resource) return;

    if (file) {
      const validation = validateResourceFile(file);
      if (!validation.valid) {
        setFileError(
          validation.error === "size"
            ? t("resources.fileTooLarge").replace("{{max}}", String(RESOURCE_MAX_FILE_SIZE_MB))
            : t("resources.fileTypeNotAllowed")
        );
        return;
      }
    }

    setSubmitting(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSubmitting(false);
      onError(t("auth.notLoggedIn"));
      return;
    }

    let storagePath = resource?.storage_path ?? "";
    let fileName = resource?.file_name ?? "";
    let fileSize = resource?.file_size ?? null;
    let mimeType = resource?.mime_type ?? null;
    const previousStoragePath = resource?.storage_path;

    if (file) {
      const safeName = sanitizeFileName(file.name);
      storagePath = `${user.id}/${Date.now()}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from("class-materials")
        .upload(storagePath, file, { upsert: false });

      if (uploadError) {
        setSubmitting(false);
        onError(uploadError.message);
        return;
      }

      fileName = file.name;
      fileSize = file.size;
      mimeType = file.type || null;
    }

    if (mode === "upload") {
      const { data: inserted, error: insertError } = await supabase
        .from("resources")
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          category_id: categoryId || null,
          class_slug: classSlug || null,
          storage_path: storagePath,
          file_name: fileName,
          file_size: fileSize,
          mime_type: mimeType,
          uploaded_by: user.id,
          is_published: publish,
        })
        .select("*")
        .single();

      setSubmitting(false);

      if (insertError) {
        await supabase.storage.from("class-materials").remove([storagePath]);
        onError(insertError.message);
        return;
      }

      onSuccess(inserted as Resource);
      return;
    }

    const { data: updated, error: updateError } = await supabase
      .from("resources")
      .update({
        title: title.trim(),
        description: description.trim() || null,
        category_id: categoryId || null,
        class_slug: classSlug || null,
        storage_path: storagePath,
        file_name: fileName,
        file_size: fileSize,
        mime_type: mimeType,
        is_published: publish,
      })
      .eq("id", resource!.id)
      .select("*")
      .single();

    setSubmitting(false);

    if (updateError) {
      if (file && storagePath !== previousStoragePath) {
        await supabase.storage.from("class-materials").remove([storagePath]);
      }
      onError(updateError.message);
      return;
    }

    onSuccess(
      updated as Resource,
      file && previousStoragePath && previousStoragePath !== storagePath ? previousStoragePath : undefined
    );
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      className="fixed inset-0 z-[100] m-0 h-full max-h-none w-full max-w-none border-0 bg-transparent p-0 backdrop:bg-ink-900/50 open:flex open:items-center open:justify-center"
      onClick={(e) => {
        if (e.target === dialogRef.current) handleClose();
      }}
    >
      <div
        role="document"
        className="mx-4 w-full max-w-lg rounded-xl border border-ink-200 bg-surface p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-semibold text-ink-900">
            {mode === "upload" ? t("resources.uploadTitle") : t("resources.editTitle")}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="rounded-lg p-1 text-ink-500 hover:bg-ink-100 hover:text-ink-800 disabled:opacity-60"
            aria-label={t("resources.cancelButton")}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="resource-dialog-title" className="mb-1 block text-sm font-medium text-ink-700">
              {t("resources.fieldTitle")}
            </label>
            <input
              id="resource-dialog-title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-ink-200 bg-surface px-3 py-2 text-ink-900"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="resource-dialog-category" className="mb-1 block text-sm font-medium text-ink-700">
                {t("resources.fieldCategory")}
              </label>
              <select
                id="resource-dialog-category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-lg border border-ink-200 bg-surface px-3 py-2 text-ink-900"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name_ko}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="resource-dialog-class" className="mb-1 block text-sm font-medium text-ink-700">
                {t("resources.fieldClass")}
              </label>
              <select
                id="resource-dialog-class"
                value={classSlug}
                onChange={(e) => setClassSlug(e.target.value)}
                className="w-full rounded-lg border border-ink-200 bg-surface px-3 py-2 text-ink-900"
              >
                <option value="">{t("resources.allClasses")}</option>
                {RESOURCE_CLASS_SLUGS.map((slug) => (
                  <option key={slug} value={slug}>
                    {t(`classes.links.${slug}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="resource-dialog-description" className="mb-1 block text-sm font-medium text-ink-700">
              {t("resources.fieldDescription")}
            </label>
            <textarea
              id="resource-dialog-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-ink-200 bg-surface px-3 py-2 text-ink-900"
            />
          </div>

          <div>
            <label htmlFor="resource-dialog-file" className="mb-1 block text-sm font-medium text-ink-700">
              {mode === "edit" ? t("resources.replaceFile") : t("resources.fieldFile")}
            </label>
            {mode === "edit" && resource && (
              <p className="mb-2 text-xs text-ink-500">
                {t("resources.currentFile")}: {resource.file_name}
              </p>
            )}
            <p className="mb-2 text-xs text-ink-500">{t("resources.fileConstraintsHelp")}</p>
            <input
              id="resource-dialog-file"
              type="file"
              required={mode === "upload"}
              accept={RESOURCE_ACCEPT_ATTRIBUTE}
              onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
              className={`block w-full text-sm text-ink-700 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-100 file:px-4 file:py-2 file:font-medium file:text-brand-900 ${
                fileError ? "rounded-lg border border-red-300 bg-red-50/50 p-2" : ""
              }`}
              aria-invalid={!!fileError}
              aria-describedby="resource-dialog-file-help"
            />
            {file && !fileError && (
              <p id="resource-dialog-file-help" className="mt-2 text-xs text-ink-500">
                {file.name} · {formatResourceFileSize(file.size)}
              </p>
            )}
            {fileError && (
              <p id="resource-dialog-file-help" className="mt-2 text-sm text-red-700" role="alert">
                {fileError}
              </p>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm text-ink-700">
            <input
              type="checkbox"
              checked={publish}
              onChange={(e) => setPublish(e.target.checked)}
              className="rounded border-ink-300"
            />
            {t("resources.publishNow")}
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="rounded-lg border border-ink-200 px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50 disabled:opacity-60"
            >
              {t("resources.cancelButton")}
            </button>
            <button
              type="submit"
              disabled={submitting || !!fileError || (mode === "upload" && !file)}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-on-inverse hover:bg-brand-800 disabled:opacity-60"
            >
              {submitting
                ? t("auth.loading")
                : mode === "upload"
                  ? t("resources.uploadButton")
                  : t("resources.saveButton")}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
