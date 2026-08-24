"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { useLinkedResourceCategorySlugs } from "@/lib/hooks/useResourceBoards";
import { getResourceCategoryLabel } from "@/lib/resources/categoryLabel";
import { getResourceClassLabel } from "@/lib/resources/classLabel";
import { getResourceBoardHref } from "@/lib/resources/navBoards";
import {
  nextTaxonomySortOrder,
  sortResourceCategories,
  sortResourceClasses,
} from "@/lib/resources/sortTaxonomy";
import { createClient } from "@/lib/supabase/client";
import type { Resource, ResourceCategory, ResourceClass } from "@/lib/supabase/database.types";

type Tab = "categories" | "folders";

export default function AdminResourcesClient() {
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();
  const focus = searchParams.get("focus");
  const tabParam = searchParams.get("tab");

  const [tab, setTab] = useState<Tab>(tabParam === "folders" ? "folders" : "categories");
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [resourceClasses, setResourceClasses] = useState<ResourceClass[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSortOrder, setEditSortOrder] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const sortedCategories = useMemo(() => sortResourceCategories(categories), [categories]);
  const sortedClasses = useMemo(() => sortResourceClasses(resourceClasses), [resourceClasses]);
  const { slugs: linkedSlugs, items: navItems } = useLinkedResourceCategorySlugs();

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const resource of resources) {
      if (!resource.category_id) continue;
      counts.set(resource.category_id, (counts.get(resource.category_id) ?? 0) + 1);
    }
    return counts;
  }, [resources]);

  const classCounts = useMemo(() => {
    const bySlug: Record<string, number> = {};
    for (const resource of resources) {
      if (!resource.class_slug) continue;
      bySlug[resource.class_slug] = (bySlug[resource.class_slug] ?? 0) + 1;
    }
    return bySlug;
  }, [resources]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const [catRes, classRes, resourceRes] = await Promise.all([
        supabase.from("resource_categories").select("*").order("sort_order"),
        supabase.from("resource_classes").select("*").order("sort_order"),
        supabase.from("resources").select("id, category_id, class_slug"),
      ]);

      if (cancelled) return;
      if (catRes.error || classRes.error || resourceRes.error) {
        setError(catRes.error?.message || classRes.error?.message || resourceRes.error?.message || "");
        setLoading(false);
        return;
      }

      setCategories((catRes.data as ResourceCategory[]) ?? []);
      setResourceClasses((classRes.data as ResourceClass[]) ?? []);
      setResources((resourceRes.data as Resource[]) ?? []);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (tabParam === "folders" || tabParam === "categories") {
      setTab(tabParam);
    }
  }, [tabParam]);

  useEffect(() => {
    if (!focus) return;
    setTab("categories");
    setMessage(t("admin.resources.focusLinked").replace("{{slug}}", focus));
  }, [focus, t]);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) return;

    setSubmitting(true);
    setError(null);
    const supabase = createClient();

    if (tab === "categories") {
      const { data, error: insertError } = await supabase
        .from("resource_categories")
        .insert({
          slug: crypto.randomUUID(),
          name_ko: trimmed,
          sort_order: nextTaxonomySortOrder(sortedCategories),
        })
        .select("*")
        .single();
      setSubmitting(false);
      if (insertError) {
        setError(insertError.message);
        return;
      }
      setCategories(sortResourceCategories([...categories, data as ResourceCategory]));
    } else {
      const { data, error: insertError } = await supabase
        .from("resource_classes")
        .insert({
          slug: crypto.randomUUID(),
          name_ko: trimmed,
          sort_order: nextTaxonomySortOrder(sortedClasses),
        })
        .select("*")
        .single();
      setSubmitting(false);
      if (insertError) {
        setError(insertError.message);
        return;
      }
      setResourceClasses(sortResourceClasses([...resourceClasses, data as ResourceClass]));
    }

    setNewName("");
    setAdding(false);
    setMessage(t("admin.resources.saved"));
  }

  async function handleSaveEdit(e: FormEvent) {
    e.preventDefault();
    if (!editId) return;
    const trimmed = editName.trim();
    if (!trimmed) return;

    setSubmitting(true);
    setError(null);
    const supabase = createClient();
    const table = tab === "categories" ? "resource_categories" : "resource_classes";
    const { data, error: updateError } = await supabase
      .from(table)
      .update({ name_ko: trimmed, sort_order: editSortOrder })
      .eq("id", editId)
      .select("*")
      .single();

    setSubmitting(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }

    if (tab === "categories") {
      setCategories(
        sortResourceCategories(
          categories.map((c) => (c.id === editId ? (data as ResourceCategory) : c))
        )
      );
    } else {
      setResourceClasses(
        sortResourceClasses(
          resourceClasses.map((c) => (c.id === editId ? (data as ResourceClass) : c))
        )
      );
    }
    setEditId(null);
    setMessage(t("admin.resources.saved"));
  }

  async function handleDelete(id: string, linked: boolean) {
    if (linked) return;
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id);
      return;
    }

    setSubmitting(true);
    setError(null);
    const supabase = createClient();
    const table = tab === "categories" ? "resource_categories" : "resource_classes";
    const { error: deleteError } = await supabase.from(table).delete().eq("id", id);
    setSubmitting(false);
    setConfirmDeleteId(null);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    if (tab === "categories") {
      setCategories(sortResourceCategories(categories.filter((c) => c.id !== id)));
    } else {
      setResourceClasses(sortResourceClasses(resourceClasses.filter((c) => c.id !== id)));
    }
    setEditId(null);
    setMessage(t("admin.resources.deleted"));
  }

  const tabClass = (active: boolean) =>
    `flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
      active ? "bg-surface text-ink-900 shadow-sm" : "text-ink-500 hover:text-ink-800"
    }`;

  const highlightedSlug = focus || null;

  if (loading) {
    return <p className="text-ink-500">{t("auth.loading")}</p>;
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-ink-900">{t("admin.resources.title")}</h2>
          <p className="mt-1 text-ink-600">{t("admin.resources.lead")}</p>
        </div>
        <Link
          href={`/${language}/resources/`}
          className="rounded-lg border border-ink-200 bg-surface px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50"
        >
          {t("admin.nav.openResources")}
        </Link>
      </header>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="rounded-lg bg-brand-50 px-4 py-3 text-sm text-brand-900" role="status">
          {message}
        </p>
      )}

      <div className="flex gap-1 rounded-xl bg-ink-100/80 p-1">
        <button type="button" className={tabClass(tab === "categories")} onClick={() => setTab("categories")}>
          {t("resources.taxonomyTabCategories")}
        </button>
        <button type="button" className={tabClass(tab === "folders")} onClick={() => setTab("folders")}>
          {t("resources.taxonomyTabFolders")}
        </button>
      </div>

      <ul className="space-y-2">
        {tab === "categories"
          ? sortedCategories.map((category) => {
              const linked = linkedSlugs.includes(category.slug);
              const pagePath = getResourceBoardHref(category.slug, language, navItems);
              const isEditing = editId === category.id;
              const highlighted = highlightedSlug === category.slug;
              const count = categoryCounts.get(category.id) ?? 0;

              return (
                <li
                  key={category.id}
                  className={`overflow-hidden rounded-xl border bg-surface shadow-sm ${
                    highlighted ? "border-brand-400 ring-2 ring-brand-100" : "border-ink-200"
                  }`}
                >
                  {isEditing ? (
                    <form onSubmit={handleSaveEdit} className="space-y-3 p-4">
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm"
                        required
                        autoFocus
                      />
                      <input
                        type="number"
                        min={0}
                        value={editSortOrder}
                        onChange={(e) => setEditSortOrder(Number(e.target.value))}
                        className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm"
                        required
                      />
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setEditId(null)} className="rounded-lg px-3 py-1.5 text-sm text-ink-600 hover:bg-ink-50">
                          {t("resources.cancelButton")}
                        </button>
                        <button type="submit" disabled={submitting} className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-60">
                          {t("resources.saveButton")}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex items-center gap-3 p-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium text-ink-900">{getResourceCategoryLabel(category, t)}</p>
                          {linked && (
                            <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[0.65rem] font-medium text-brand-800">
                              {t("resources.taxonomyBoardBadge")}
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-ink-500">
                          {t("resources.taxonomySortOrder")} {category.sort_order} · {count}
                          {t("resources.taxonomyItemCountSuffix")}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        {linked && pagePath && (
                          <Link href={pagePath} className="rounded-lg px-2 py-1.5 text-xs font-medium text-brand-700 hover:bg-brand-50">
                            {t("resources.categoryPageLink")}
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setEditId(category.id);
                            setEditName(category.name_ko);
                            setEditSortOrder(category.sort_order);
                            setConfirmDeleteId(null);
                          }}
                          className="rounded-lg px-2 py-1.5 text-xs font-medium text-ink-600 hover:bg-ink-50"
                        >
                          {t("resources.taxonomyEdit")}
                        </button>
                        {!linked && (
                          <button
                            type="button"
                            onClick={() => handleDelete(category.id, false)}
                            className="rounded-lg px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                          >
                            {confirmDeleteId === category.id
                              ? t("resources.categoryDeleteConfirmButton")
                              : t("resources.categoryDeleteButton")}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </li>
              );
            })
          : sortedClasses.map((resourceClass) => {
              const isEditing = editId === resourceClass.id;
              const count = classCounts[resourceClass.slug] ?? 0;
              return (
                <li key={resourceClass.id} className="overflow-hidden rounded-xl border border-ink-200 bg-surface shadow-sm">
                  {isEditing ? (
                    <form onSubmit={handleSaveEdit} className="space-y-3 p-4">
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm"
                        required
                        autoFocus
                      />
                      <input
                        type="number"
                        min={0}
                        value={editSortOrder}
                        onChange={(e) => setEditSortOrder(Number(e.target.value))}
                        className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm"
                        required
                      />
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setEditId(null)} className="rounded-lg px-3 py-1.5 text-sm text-ink-600 hover:bg-ink-50">
                          {t("resources.cancelButton")}
                        </button>
                        <button type="submit" disabled={submitting} className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-60">
                          {t("resources.saveButton")}
                        </button>
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
                      <div className="flex shrink-0 gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditId(resourceClass.id);
                            setEditName(resourceClass.name_ko);
                            setEditSortOrder(resourceClass.sort_order);
                            setConfirmDeleteId(null);
                          }}
                          className="rounded-lg px-2 py-1.5 text-xs font-medium text-ink-600 hover:bg-ink-50"
                        >
                          {t("resources.taxonomyEdit")}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(resourceClass.id, false)}
                          className="rounded-lg px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                        >
                          {confirmDeleteId === resourceClass.id
                            ? t("resources.categoryDeleteConfirmButton")
                            : t("resources.categoryDeleteButton")}
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
      </ul>

      {adding ? (
        <form onSubmit={handleAdd} className="rounded-xl border border-ink-200 bg-surface p-4">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={tab === "categories" ? t("resources.categoryName") : t("resources.folderName")}
            className="w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm"
            required
            autoFocus
          />
          <div className="mt-3 flex justify-end gap-2">
            <button type="button" onClick={() => setAdding(false)} className="rounded-lg px-3 py-2 text-sm text-ink-600 hover:bg-ink-50">
              {t("resources.cancelButton")}
            </button>
            <button type="submit" disabled={submitting} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
              {t("resources.saveButton")}
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => {
            setEditId(null);
            setAdding(true);
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-ink-300 bg-surface px-4 py-3 text-sm font-medium text-ink-600 hover:border-brand-400 hover:bg-brand-50 hover:text-brand-800"
        >
          {tab === "categories" ? t("resources.taxonomyAddCategory") : t("resources.taxonomyAddFolder")}
        </button>
      )}
    </div>
  );
}
