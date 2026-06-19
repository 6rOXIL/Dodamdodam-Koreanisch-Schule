"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { getResourceCategoryLabel } from "@/lib/resources/categoryLabel";
import { getResourceClassLabel } from "@/lib/resources/classLabel";
import {
  getFixedCategoryPagePath,
  isFixedResourceCategorySlug,
} from "@/lib/resources/fixedCategories";
import {
  nextTaxonomySortOrder,
  sortResourceCategories,
  sortResourceClasses,
} from "@/lib/resources/sortTaxonomy";
import { createClient } from "@/lib/supabase/client";
import type { ResourceCategory, ResourceClass } from "@/lib/supabase/database.types";
import type { ResourceClassCounts } from "@/features/resources/ResourceFolderNav";

export type TaxonomyTab = "categories" | "folders";

type ResourceTaxonomySheetProps = {
  open: boolean;
  tab: TaxonomyTab;
  onTabChange: (tab: TaxonomyTab) => void;
  onClose: () => void;
  categories: ResourceCategory[];
  resourceClasses: ResourceClass[];
  categoryCounts: Map<string, number>;
  classCounts: ResourceClassCounts;
  language: string;
  onCategoriesChange: (categories: ResourceCategory[]) => void;
  onClassesChange: (classes: ResourceClass[]) => void;
  onCategoryDeleted: (categoryId: string) => void;
  onClassDeleted: (classSlug: string) => void;
  onError: (message: string) => void;
};

type EditTarget =
  | { type: "category"; item: ResourceCategory }
  | { type: "folder"; item: ResourceClass }
  | null;

function LockIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  );
}

export default function ResourceTaxonomySheet({
  open,
  tab,
  onTabChange,
  onClose,
  categories,
  resourceClasses,
  categoryCounts,
  classCounts,
  language,
  onCategoriesChange,
  onClassesChange,
  onCategoryDeleted,
  onClassDeleted,
  onError,
}: ResourceTaxonomySheetProps) {
  const { t } = useLanguage();
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [editTarget, setEditTarget] = useState<EditTarget>(null);
  const [editName, setEditName] = useState("");
  const [editSortOrder, setEditSortOrder] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const sortedCategories = sortResourceCategories(categories);
  const sortedClasses = sortResourceClasses(resourceClasses);

  useEffect(() => {
    if (!open) {
      setAdding(false);
      setNewName("");
      setEditTarget(null);
      setConfirmDeleteId(null);
      setDeletingId(null);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, submitting, onClose]);

  if (!open) return null;

  function startEdit(target: EditTarget) {
    if (!target) return;
    setAdding(false);
    setNewName("");
    setConfirmDeleteId(null);
    setEditTarget(target);
    if (target.type === "category") {
      setEditName(target.item.name_ko);
      setEditSortOrder(target.item.sort_order);
    } else {
      setEditName(target.item.name_ko);
      setEditSortOrder(target.item.sort_order);
    }
  }

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) return;

    setSubmitting(true);
    const supabase = createClient();

    if (tab === "categories") {
      const { data, error } = await supabase
        .from("resource_categories")
        .insert({
          slug: crypto.randomUUID(),
          name_ko: trimmed,
          sort_order: nextTaxonomySortOrder(sortedCategories),
        })
        .select("*")
        .single();

      setSubmitting(false);
      if (error) {
        onError(error.message);
        return;
      }
      onCategoriesChange(sortResourceCategories([...categories, data as ResourceCategory]));
    } else {
      const { data, error } = await supabase
        .from("resource_classes")
        .insert({
          slug: crypto.randomUUID(),
          name_ko: trimmed,
          sort_order: nextTaxonomySortOrder(sortedClasses),
        })
        .select("*")
        .single();

      setSubmitting(false);
      if (error) {
        onError(error.message);
        return;
      }
      onClassesChange(sortResourceClasses([...resourceClasses, data as ResourceClass]));
    }

    setNewName("");
    setAdding(false);
  }

  async function handleSaveEdit(e: FormEvent) {
    e.preventDefault();
    if (!editTarget) return;

    const trimmed = editName.trim();
    if (!trimmed) return;

    setSubmitting(true);
    const supabase = createClient();

    if (editTarget.type === "category") {
      const { data, error } = await supabase
        .from("resource_categories")
        .update({ name_ko: trimmed, sort_order: editSortOrder })
        .eq("id", editTarget.item.id)
        .select("*")
        .single();

      setSubmitting(false);
      if (error) {
        onError(error.message);
        return;
      }
      onCategoriesChange(
        sortResourceCategories(categories.map((c) => (c.id === editTarget.item.id ? (data as ResourceCategory) : c)))
      );
    } else {
      const { data, error } = await supabase
        .from("resource_classes")
        .update({ name_ko: trimmed, sort_order: editSortOrder })
        .eq("id", editTarget.item.id)
        .select("*")
        .single();

      setSubmitting(false);
      if (error) {
        onError(error.message);
        return;
      }
      onClassesChange(
        sortResourceClasses(resourceClasses.map((c) => (c.id === editTarget.item.id ? (data as ResourceClass) : c)))
      );
    }

    setEditTarget(null);
  }

  async function handleDelete(id: string, type: "category" | "folder") {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id);
      return;
    }

    setDeletingId(id);
    setSubmitting(true);
    const supabase = createClient();

    if (type === "category") {
      const { error } = await supabase.from("resource_categories").delete().eq("id", id);
      setSubmitting(false);
      setDeletingId(null);
      setConfirmDeleteId(null);
      if (error) {
        onError(error.message);
        return;
      }
      onCategoriesChange(sortResourceCategories(categories.filter((c) => c.id !== id)));
      onCategoryDeleted(id);
    } else {
      const folder = resourceClasses.find((c) => c.id === id);
      if (!folder) {
        setSubmitting(false);
        setDeletingId(null);
        return;
      }
      const { error } = await supabase.from("resource_classes").delete().eq("id", id);
      setSubmitting(false);
      setDeletingId(null);
      setConfirmDeleteId(null);
      if (error) {
        onError(error.message);
        return;
      }
      onClassesChange(sortResourceClasses(resourceClasses.filter((c) => c.id !== id)));
      onClassDeleted(folder.slug);
    }

    setEditTarget(null);
  }

  const tabClass = (active: boolean) =>
    `flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
      active ? "bg-surface text-ink-900 shadow-sm" : "text-ink-500 hover:text-ink-800"
    }`;

  return (
    <div className="fixed inset-0 z-[120] flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-ink-900/40 backdrop-blur-[2px]"
        onClick={() => !submitting && onClose()}
        aria-label={t("resources.cancelButton")}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="taxonomy-sheet-title"
        className="relative flex h-full w-full max-w-md flex-col border-l border-ink-200 bg-surface-muted shadow-2xl"
      >
        <header className="border-b border-ink-200 bg-surface px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
                {t("resources.taxonomySheetLabel")}
              </p>
              <h2 id="taxonomy-sheet-title" className="mt-1 text-lg font-semibold text-ink-900">
                {t("resources.taxonomySheetTitle")}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg p-2 text-ink-400 hover:bg-ink-100 hover:text-ink-700 disabled:opacity-60"
              aria-label={t("resources.cancelButton")}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mt-4 flex gap-1 rounded-xl bg-ink-100/80 p-1">
            <button type="button" className={tabClass(tab === "categories")} onClick={() => onTabChange("categories")}>
              {t("resources.taxonomyTabCategories")}
            </button>
            <button type="button" className={tabClass(tab === "folders")} onClick={() => onTabChange("folders")}>
              {t("resources.taxonomyTabFolders")}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {tab === "categories" ? (
            <ul className="space-y-2">
              {sortedCategories.map((category) => {
                const fixed = isFixedResourceCategorySlug(category.slug);
                const pagePath = getFixedCategoryPagePath(category.slug, language);
                const isEditing = editTarget?.type === "category" && editTarget.item.id === category.id;
                const count = categoryCounts.get(category.id) ?? 0;

                return (
                  <li
                    key={category.id}
                    className="overflow-hidden rounded-xl border border-ink-200 bg-surface shadow-sm"
                  >
                    {isEditing ? (
                      <form onSubmit={handleSaveEdit} className="space-y-3 p-4">
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-900"
                          required
                          autoFocus
                        />
                        <input
                          type="number"
                          min={0}
                          value={editSortOrder}
                          onChange={(e) => setEditSortOrder(Number(e.target.value))}
                          className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-900"
                          required
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditTarget(null)}
                            className="rounded-lg px-3 py-1.5 text-sm text-ink-600 hover:bg-ink-50"
                          >
                            {t("resources.cancelButton")}
                          </button>
                          <button
                            type="submit"
                            disabled={submitting}
                            className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-on-inverse hover:bg-brand-800 disabled:opacity-60"
                          >
                            {t("resources.saveButton")}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex items-center gap-3 p-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium text-ink-900">{getResourceCategoryLabel(category, t)}</p>
                            {fixed && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-ink-100 px-2 py-0.5 text-[0.65rem] font-medium text-ink-600">
                                <LockIcon />
                                {t("resources.taxonomyFixedBadge")}
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-xs text-ink-500">
                            {t("resources.taxonomySortOrder")} {category.sort_order} · {count}
                            {t("resources.taxonomyItemCountSuffix")}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-1">
                          {fixed && pagePath && (
                            <Link
                              href={pagePath}
                              className="rounded-lg p-2 text-ink-400 hover:bg-brand-50 hover:text-brand-700"
                              title={t("resources.categoryPageLink")}
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </Link>
                          )}
                          {!fixed && (
                            <>
                              <button
                                type="button"
                                onClick={() => startEdit({ type: "category", item: category })}
                                className="rounded-lg p-2 text-ink-400 hover:bg-ink-100 hover:text-ink-700"
                                aria-label={t("resources.taxonomyEdit")}
                              >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(category.id, "category")}
                                disabled={submitting && deletingId === category.id}
                                className={`rounded-lg p-2 hover:bg-red-50 ${
                                  confirmDeleteId === category.id ? "text-red-700" : "text-ink-400 hover:text-red-600"
                                }`}
                                aria-label={t("resources.categoryDeleteButton")}
                              >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                    {confirmDeleteId === category.id && !fixed && (
                      <p className="border-t border-red-100 bg-red-50 px-4 py-2 text-xs text-red-700">
                        {t("resources.categoryDeleteConfirmMessage")}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <ul className="space-y-2">
              {sortedClasses.map((resourceClass) => {
                const isEditing = editTarget?.type === "folder" && editTarget.item.id === resourceClass.id;
                const count = classCounts.bySlug[resourceClass.slug] ?? 0;

                return (
                  <li key={resourceClass.id} className="overflow-hidden rounded-xl border border-ink-200 bg-surface shadow-sm">
                    {isEditing ? (
                      <form onSubmit={handleSaveEdit} className="space-y-3 p-4">
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-900"
                          required
                          autoFocus
                        />
                        <input
                          type="number"
                          min={0}
                          value={editSortOrder}
                          onChange={(e) => setEditSortOrder(Number(e.target.value))}
                          className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-900"
                          required
                        />
                        <div className="flex justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => handleDelete(resourceClass.id, "folder")}
                            disabled={submitting}
                            className={`rounded-lg px-3 py-1.5 text-sm ${
                              confirmDeleteId === resourceClass.id
                                ? "bg-red-600 text-white"
                                : "text-red-600 hover:bg-red-50"
                            }`}
                          >
                            {confirmDeleteId === resourceClass.id
                              ? t("resources.categoryDeleteConfirmButton")
                              : t("resources.categoryDeleteButton")}
                          </button>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setEditTarget(null)}
                              className="rounded-lg px-3 py-1.5 text-sm text-ink-600 hover:bg-ink-50"
                            >
                              {t("resources.cancelButton")}
                            </button>
                            <button
                              type="submit"
                              disabled={submitting}
                              className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-on-inverse hover:bg-brand-800 disabled:opacity-60"
                            >
                              {t("resources.saveButton")}
                            </button>
                          </div>
                        </div>
                      </form>
                    ) : (
                      <div className="flex items-center gap-3 p-4">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-ink-900">{getResourceClassLabel(resourceClass, t)}</p>
                          <p className="mt-0.5 text-xs text-ink-500">
                            {t("resources.taxonomySortOrder")} {resourceClass.sort_order} · {count}
                            {t("resources.taxonomyItemCountSuffix")}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-1">
                          <button
                            type="button"
                            onClick={() => startEdit({ type: "folder", item: resourceClass })}
                            className="rounded-lg p-2 text-ink-400 hover:bg-ink-100 hover:text-ink-700"
                            aria-label={t("resources.taxonomyEdit")}
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(resourceClass.id, "folder")}
                            disabled={submitting && deletingId === resourceClass.id}
                            className={`rounded-lg p-2 hover:bg-red-50 ${
                              confirmDeleteId === resourceClass.id ? "text-red-700" : "text-ink-400 hover:text-red-600"
                            }`}
                            aria-label={t("resources.categoryDeleteButton")}
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                    {confirmDeleteId === resourceClass.id && !isEditing && (
                      <p className="border-t border-red-100 bg-red-50 px-4 py-2 text-xs text-red-700">
                        {t("resources.folderDeleteConfirmMessage")}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <footer className="border-t border-ink-200 bg-surface px-5 py-4">
          {adding ? (
            <form onSubmit={handleAdd} className="space-y-3">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={
                  tab === "categories" ? t("resources.categoryName") : t("resources.folderName")
                }
                className="w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm text-ink-900 placeholder:text-ink-400"
                required
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAdding(false);
                    setNewName("");
                  }}
                  className="rounded-lg px-3 py-2 text-sm text-ink-600 hover:bg-ink-50"
                >
                  {t("resources.cancelButton")}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-on-inverse hover:bg-brand-800 disabled:opacity-60"
                >
                  {submitting ? t("auth.loading") : t("resources.saveButton")}
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => {
                setEditTarget(null);
                setConfirmDeleteId(null);
                setAdding(true);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-ink-300 bg-surface-muted px-4 py-3 text-sm font-medium text-ink-600 transition hover:border-brand-400 hover:bg-brand-50 hover:text-brand-800"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {tab === "categories" ? t("resources.taxonomyAddCategory") : t("resources.taxonomyAddFolder")}
            </button>
          )}
        </footer>
      </aside>
    </div>
  );
}
