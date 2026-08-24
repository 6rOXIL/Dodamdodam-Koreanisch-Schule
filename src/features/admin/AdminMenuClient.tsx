"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { Field, TextInput } from "@/features/admin/homepage/FormFields";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import {
  canToggleResourceBoard,
  defaultBoardOpenPath,
  parseResourcesContentKind,
  toResourcesContentKind,
} from "@/lib/resources/navBoards";
import {
  createTopNavItem,
  deleteTopNavItem,
  fetchTopNavItems,
  getAdminManagePath,
  updateTopNavItem,
} from "@/lib/siteContent/api";
import { createClient } from "@/lib/supabase/client";
import type { ResourceCategory, SiteNavItem } from "@/lib/supabase/database.types";

function nextSortOrder(items: SiteNavItem[]) {
  if (items.length === 0) return 1;
  return Math.max(...items.map((item) => item.sort_order)) + 1;
}

function slugify(raw: string) {
  const cleaned = raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return cleaned || `nav-${crypto.randomUUID().slice(0, 8)}`;
}

function normalizeHref(path: string) {
  const trimmed = path.trim() || "/";
  if (trimmed === "/") return "/";
  const withSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  if (withSlash.includes("?")) return withSlash;
  return withSlash.endsWith("/") ? withSlash : `${withSlash}/`;
}

type Draft = {
  label_ko: string;
  label_en: string;
  label_de: string;
  href_path: string;
  slug: string;
  useResources: boolean;
  resourceCategorySlug: string;
};

const emptyDraft = (): Draft => ({
  label_ko: "",
  label_en: "",
  label_de: "",
  href_path: "/",
  slug: "",
  useResources: false,
  resourceCategorySlug: "",
});

export default function AdminMenuClient() {
  const { t, language } = useLanguage();
  const [items, setItems] = useState<SiteNavItem[]>([]);
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const [nav, catsRes] = await Promise.all([
        fetchTopNavItems(),
        supabase.from("resource_categories").select("*").order("sort_order"),
      ]);
      if (cancelled) return;
      setItems(nav);
      setCategories((catsRes.data as ResourceCategory[]) ?? []);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function patchItem(id: string, patch: Partial<SiteNavItem>) {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function setResourceLink(item: SiteNavItem, enabled: boolean, categorySlug?: string) {
    if (!enabled) {
      patchItem(item.id, { content_kind: "static" });
      return;
    }
    const slug =
      categorySlug ||
      parseResourcesContentKind(item.content_kind) ||
      categories[0]?.slug ||
      item.slug;
    const nextKind = toResourcesContentKind(slug);
    const keepHref =
      item.href_path === "/schedule/" ||
      item.href_path === "/events/" ||
      item.href_path.includes("/board/open/");
    patchItem(item.id, {
      content_kind: nextKind,
      href_path: keepHref ? item.href_path : defaultBoardOpenPath(slug),
    });
  }

  async function handleSave() {
    setError(null);
    setMessage(null);
    setSaving(true);

    for (const item of items) {
      const slug = item.slug.trim();
      const href_path = normalizeHref(item.href_path);
      if (!slug || !item.label_ko.trim()) {
        setSaving(false);
        setError(t("admin.menu.validationRequired"));
        return;
      }

      if (isResourcesContentKindSafe(item.content_kind)) {
        const catSlug = parseResourcesContentKind(item.content_kind);
        if (!catSlug || !categories.some((c) => c.slug === catSlug)) {
          setSaving(false);
          setError(t("admin.menu.resourceCategoryRequired"));
          return;
        }
      }

      const { error: saveError } = await updateTopNavItem(item.id, {
        label_ko: item.label_ko.trim(),
        label_en: item.label_en.trim() || item.label_ko.trim(),
        label_de: item.label_de.trim() || item.label_ko.trim(),
        sort_order: item.sort_order,
        is_visible: item.is_visible,
        href_path,
        slug,
        content_kind: item.content_kind,
      });
      if (saveError) {
        setSaving(false);
        setError(saveError);
        return;
      }
    }

    setSaving(false);
    setMessage(t("admin.menu.saveSuccess"));
    const refreshed = await fetchTopNavItems();
    setItems(refreshed);
  }

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const label_ko = draft.label_ko.trim();
    if (!label_ko) {
      setError(t("admin.menu.validationRequired"));
      return;
    }

    const slug = slugify(draft.slug || draft.label_en || draft.label_ko);
    if (items.some((item) => item.slug === slug)) {
      setError(t("admin.menu.slugDuplicate"));
      return;
    }

    let content_kind: SiteNavItem["content_kind"] = "static";
    let href_path = normalizeHref(draft.href_path);
    if (draft.useResources) {
      const catSlug = draft.resourceCategorySlug || categories[0]?.slug;
      if (!catSlug) {
        setError(t("admin.menu.resourceCategoryRequired"));
        return;
      }
      content_kind = toResourcesContentKind(catSlug);
      if (href_path === "/") href_path = defaultBoardOpenPath(catSlug);
    }

    setSaving(true);
    const { data, error: createError } = await createTopNavItem({
      slug,
      href_path,
      label_ko,
      label_en: draft.label_en.trim() || label_ko,
      label_de: draft.label_de.trim() || label_ko,
      sort_order: nextSortOrder(items),
      is_visible: true,
      content_kind,
    });
    setSaving(false);

    if (createError || !data) {
      setError(createError ?? t("admin.menu.addFailed"));
      return;
    }

    setItems((prev) => [...prev, data].sort((a, b) => a.sort_order - b.sort_order));
    setDraft(emptyDraft());
    setAdding(false);
    setMessage(t("admin.menu.addSuccess"));
  }

  async function handleDelete(id: string) {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id);
      return;
    }

    setError(null);
    setMessage(null);
    setSaving(true);
    const { error: deleteError } = await deleteTopNavItem(id);
    setSaving(false);
    setConfirmDeleteId(null);

    if (deleteError) {
      setError(deleteError);
      return;
    }

    setItems((prev) => prev.filter((item) => item.id !== id));
    setMessage(t("admin.menu.deleteSuccess"));
  }

  if (loading) {
    return <p className="text-ink-500">{t("auth.loading")}</p>;
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-ink-900">{t("admin.menu.title")}</h2>
          <p className="mt-1 text-ink-600">{t("admin.menu.lead")}</p>
        </div>
        {!adding && (
          <button
            type="button"
            onClick={() => {
              setAdding(true);
              setConfirmDeleteId(null);
              setDraft({
                ...emptyDraft(),
                resourceCategorySlug: categories[0]?.slug ?? "",
              });
            }}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            {t("admin.menu.add")}
          </button>
        )}
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

      {adding && (
        <form
          onSubmit={handleAdd}
          className="space-y-4 rounded-2xl border border-brand-200 bg-brand-50/40 p-4 md:p-5"
        >
          <h3 className="text-base font-semibold text-ink-900">{t("admin.menu.addTitle")}</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="한국어 *">
              <TextInput
                value={draft.label_ko}
                onChange={(label_ko) => setDraft((d) => ({ ...d, label_ko }))}
              />
            </Field>
            <Field label="English">
              <TextInput
                value={draft.label_en}
                onChange={(label_en) => setDraft((d) => ({ ...d, label_en }))}
              />
            </Field>
            <Field label="Deutsch">
              <TextInput
                value={draft.label_de}
                onChange={(label_de) => setDraft((d) => ({ ...d, label_de }))}
              />
            </Field>
            <Field label={t("admin.menu.hrefPath")} hint={t("admin.menu.hrefHint")}>
              <TextInput
                value={draft.href_path}
                onChange={(href_path) => setDraft((d) => ({ ...d, href_path }))}
              />
            </Field>
            <Field label={t("admin.menu.slug")} hint={t("admin.menu.slugHint")}>
              <TextInput
                value={draft.slug}
                onChange={(slug) => setDraft((d) => ({ ...d, slug }))}
              />
            </Field>
          </div>
          <div className="space-y-2 rounded-xl border border-ink-200 bg-surface px-3 py-3">
            <label className="flex items-center gap-2 text-sm font-medium text-ink-800">
              <input
                type="checkbox"
                checked={draft.useResources}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    useResources: e.target.checked,
                    href_path:
                      e.target.checked && (d.href_path === "/" || !d.href_path)
                        ? defaultBoardOpenPath(d.resourceCategorySlug || categories[0]?.slug || "board")
                        : d.href_path,
                  }))
                }
              />
              {t("admin.menu.useResources")}
            </label>
            <p className="text-xs text-ink-500">{t("admin.menu.useResourcesHint")}</p>
            {draft.useResources && (
              <Field label={t("admin.menu.resourceCategory")}>
                <select
                  value={draft.resourceCategorySlug}
                  onChange={(e) => {
                    const resourceCategorySlug = e.target.value;
                    setDraft((d) => ({
                      ...d,
                      resourceCategorySlug,
                      href_path:
                        d.href_path.includes("/board/open/") || d.href_path === "/"
                          ? defaultBoardOpenPath(resourceCategorySlug)
                          : d.href_path,
                    }));
                  }}
                  className="w-full rounded-lg border border-ink-200 bg-surface px-3 py-2 text-sm"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name_ko} ({cat.slug})
                    </option>
                  ))}
                </select>
              </Field>
            )}
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setAdding(false);
                setDraft(emptyDraft());
              }}
              className="rounded-lg border border-ink-200 px-4 py-2 text-sm text-ink-700 hover:bg-ink-50"
            >
              {t("resources.cancelButton")}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {saving ? t("auth.loading") : t("admin.menu.addConfirm")}
            </button>
          </div>
        </form>
      )}

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-ink-200 bg-surface px-4 py-8 text-center text-sm text-ink-500">
          {t("admin.menu.empty")}
        </p>
      ) : (
        <ul className="space-y-4">
          {items.map((item, index) => {
            const managePath = getAdminManagePath(item.content_kind, language, item.slug);
            const canResources = canToggleResourceBoard(item.content_kind);
            const linkedSlug = parseResourcesContentKind(item.content_kind);
            const useResources = Boolean(linkedSlug);

            return (
              <li
                key={item.id}
                className="rounded-2xl border border-ink-200 bg-surface p-4 shadow-sm md:p-5"
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-ink-100 text-xs font-semibold text-ink-600">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-ink-900">
                        {item.label_ko || t("admin.menu.untitled")}
                      </p>
                      <p className="text-xs text-ink-500">
                        {item.slug} · {item.href_path}
                        {linkedSlug ? ` · resources:${linkedSlug}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="flex items-center gap-2 text-sm text-ink-700">
                      <input
                        type="checkbox"
                        checked={item.is_visible}
                        onChange={(e) => patchItem(item.id, { is_visible: e.target.checked })}
                      />
                      {t("adminHomepage.visible")}
                    </label>
                    {managePath && (
                      <Link
                        href={managePath}
                        className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700"
                      >
                        {t("admin.dashboard.manageContent")}
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      disabled={saving}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                        confirmDeleteId === item.id
                          ? "bg-red-600 text-white"
                          : "border border-red-200 text-red-700 hover:bg-red-50"
                      }`}
                    >
                      {confirmDeleteId === item.id
                        ? t("admin.menu.deleteConfirm")
                        : t("admin.menu.delete")}
                    </button>
                  </div>
                </div>

                {confirmDeleteId === item.id && (
                  <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
                    {t("admin.menu.deleteHint")}
                  </p>
                )}

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <Field label="한국어">
                    <TextInput
                      value={item.label_ko}
                      onChange={(label_ko) => patchItem(item.id, { label_ko })}
                    />
                  </Field>
                  <Field label="English">
                    <TextInput
                      value={item.label_en}
                      onChange={(label_en) => patchItem(item.id, { label_en })}
                    />
                  </Field>
                  <Field label="Deutsch">
                    <TextInput
                      value={item.label_de}
                      onChange={(label_de) => patchItem(item.id, { label_de })}
                    />
                  </Field>
                  <Field label={t("admin.menu.hrefPath")}>
                    <TextInput
                      value={item.href_path}
                      onChange={(href_path) => patchItem(item.id, { href_path })}
                    />
                  </Field>
                  <Field label={t("admin.menu.slug")}>
                    <TextInput
                      value={item.slug}
                      onChange={(slug) => patchItem(item.id, { slug })}
                    />
                  </Field>
                  <Field label={t("adminHomepage.sortOrder")}>
                    <TextInput
                      value={String(item.sort_order)}
                      onChange={(value) =>
                        patchItem(item.id, { sort_order: Number(value) || 0 })
                      }
                    />
                  </Field>
                </div>

                {canResources && (
                  <div className="mt-4 space-y-2 rounded-xl border border-ink-100 bg-surface-muted/40 px-3 py-3">
                    <label className="flex items-center gap-2 text-sm font-medium text-ink-800">
                      <input
                        type="checkbox"
                        checked={useResources}
                        onChange={(e) => setResourceLink(item, e.target.checked)}
                      />
                      {t("admin.menu.useResources")}
                    </label>
                    <p className="text-xs text-ink-500">{t("admin.menu.useResourcesHint")}</p>
                    {useResources && (
                      <Field label={t("admin.menu.resourceCategory")}>
                        <select
                          value={linkedSlug ?? ""}
                          onChange={(e) => setResourceLink(item, true, e.target.value)}
                          className="w-full rounded-lg border border-ink-200 bg-surface px-3 py-2 text-sm"
                        >
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.slug}>
                              {cat.name_ko} ({cat.slug})
                            </option>
                          ))}
                        </select>
                      </Field>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving || items.length === 0}
        className="rounded-lg bg-ink-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-ink-800 disabled:opacity-60"
      >
        {saving ? t("auth.loading") : t("admin.menu.save")}
      </button>
    </div>
  );
}

function isResourcesContentKindSafe(kind: string) {
  return kind.startsWith("resources:") && kind.length > "resources:".length;
}
