"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Field, TextInput } from "@/features/admin/homepage/FormFields";
import {
  deleteForm,
  deleteFormSubmission,
  fetchAllForms,
  fetchFormSubmissions,
  newEmptyField,
  upsertForm,
} from "@/lib/forms/api";
import type { SiteForm, SiteFormField, SiteFormFieldType, SiteFormSubmission } from "@/lib/forms/types";
import { createTopNavItem, fetchTopNavItems } from "@/lib/siteContent/api";
import { useLanguage } from "@/lib/contexts/LanguageContext";

const FIELD_TYPES: SiteFormFieldType[] = [
  "text",
  "email",
  "tel",
  "textarea",
  "date",
  "radio",
  "select",
];

export default function AdminFormsClient() {
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();
  const focusSlug = searchParams.get("slug");

  const [forms, setForms] = useState<SiteForm[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<SiteForm | null>(null);
  const [submissions, setSubmissions] = useState<SiteFormSubmission[]>([]);
  const [tab, setTab] = useState<"edit" | "submissions">("edit");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const list = await fetchAllForms();
    setForms(list);
    return list;
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const list = await load();
      if (cancelled) return;
      const focused =
        (focusSlug && list.find((f) => f.slug === focusSlug)) || list[0] || null;
      if (focused) {
        setSelectedId(focused.id);
        setDraft(JSON.parse(JSON.stringify(focused)) as SiteForm);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [load, focusSlug]);

  useEffect(() => {
    if (!selectedId || tab !== "submissions") return;
    fetchFormSubmissions(selectedId).then(setSubmissions);
  }, [selectedId, tab]);

  const publicUrl = useMemo(() => {
    if (!draft) return "";
    if (draft.slug === "enrollment") return `/${language}/apply/`;
    return `/${language}/forms/open/?slug=${encodeURIComponent(draft.slug)}`;
  }, [draft, language]);

  function selectForm(form: SiteForm) {
    setSelectedId(form.id);
    setDraft(JSON.parse(JSON.stringify(form)) as SiteForm);
    setTab("edit");
    setMessage(null);
    setError(null);
    setConfirmDeleteId(null);
  }

  function startCreate() {
    const blank: SiteForm = {
      id: "",
      slug: `form-${Date.now()}`,
      title_ko: t("admin.forms.newTitle"),
      title_en: "New form",
      title_de: "Neues Formular",
      description_ko: "",
      description_en: "",
      description_de: "",
      success_message_ko: "신청이 접수되었습니다. 감사합니다.",
      success_message_en: "Your application has been received. Thank you.",
      success_message_de: "Ihre Anmeldung ist eingegangen. Vielen Dank.",
      fields: [
        {
          ...newEmptyField(),
          name: "name",
          label_ko: "이름",
          label_en: "Name",
          label_de: "Name",
          required: true,
        },
      ],
      is_published: true,
      sort_order: forms.length + 1,
      created_at: "",
      updated_at: "",
    };
    setSelectedId(null);
    setDraft(blank);
    setTab("edit");
  }

  function patchDraft(patch: Partial<SiteForm>) {
    setDraft((prev) => (prev ? { ...prev, ...patch } : prev));
  }

  function patchField(index: number, patch: Partial<SiteFormField>) {
    if (!draft) return;
    const fields = [...draft.fields];
    fields[index] = { ...fields[index], ...patch };
    patchDraft({ fields });
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!draft) return;
    setError(null);
    setMessage(null);

    if (!draft.slug.trim() || !draft.title_ko.trim()) {
      setError(t("admin.forms.validationRequired"));
      return;
    }

    setSaving(true);
    const { data, error: saveError } = await upsertForm({
      id: draft.id || undefined,
      slug: draft.slug.trim(),
      title_ko: draft.title_ko.trim(),
      title_en: draft.title_en,
      title_de: draft.title_de,
      description_ko: draft.description_ko,
      description_en: draft.description_en,
      description_de: draft.description_de,
      success_message_ko: draft.success_message_ko,
      success_message_en: draft.success_message_en,
      success_message_de: draft.success_message_de,
      fields: draft.fields,
      is_published: draft.is_published,
      sort_order: draft.sort_order,
    });
    setSaving(false);

    if (saveError || !data) {
      setError(saveError ?? t("admin.forms.saveFailed"));
      return;
    }

    setMessage(t("admin.forms.saveSuccess"));
    const list = await load();
    setForms(list);
    setSelectedId(data.id);
    setDraft(JSON.parse(JSON.stringify(data)) as SiteForm);
  }

  async function handleDeleteForm() {
    if (!draft?.id) return;
    if (confirmDeleteId !== draft.id) {
      setConfirmDeleteId(draft.id);
      return;
    }
    setSaving(true);
    const { error: delError } = await deleteForm(draft.id);
    setSaving(false);
    setConfirmDeleteId(null);
    if (delError) {
      setError(delError);
      return;
    }
    setMessage(t("admin.forms.deleteSuccess"));
    const list = await load();
    setForms(list);
    if (list[0]) selectForm(list[0]);
    else {
      setDraft(null);
      setSelectedId(null);
    }
  }

  async function handleDeleteSubmission(id: string) {
    const { error: delError } = await deleteFormSubmission(id);
    if (delError) {
      setError(delError);
      return;
    }
    if (selectedId) setSubmissions(await fetchFormSubmissions(selectedId));
  }

  async function handleAddToMenu() {
    if (!draft?.id || !draft.slug.trim()) return;
    setError(null);
    setMessage(null);
    const nav = await fetchTopNavItems();
    const formKind = `form:${draft.slug}` as const;
    if (nav.some((item) => item.content_kind === formKind || item.slug === draft.slug)) {
      setMessage(t("admin.forms.menuAlreadyExists"));
      return;
    }
    const href_path =
      draft.slug === "enrollment"
        ? "/apply/"
        : `/forms/open/?slug=${encodeURIComponent(draft.slug)}`;
    setSaving(true);
    const { error: createError } = await createTopNavItem({
      slug: draft.slug,
      href_path,
      label_ko: draft.title_ko,
      label_en: draft.title_en || draft.title_ko,
      label_de: draft.title_de || draft.title_ko,
      sort_order: (nav.at(-1)?.sort_order ?? 0) + 1,
      is_visible: true,
      content_kind: formKind,
    });
    setSaving(false);
    if (createError) {
      setError(createError);
      return;
    }
    setMessage(t("admin.forms.addToMenuSuccess"));
  }

  if (loading) {
    return <p className="text-ink-500">{t("auth.loading")}</p>;
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-ink-900">{t("admin.forms.title")}</h2>
          <p className="mt-1 text-ink-600">{t("admin.forms.lead")}</p>
        </div>
        <button
          type="button"
          onClick={startCreate}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          {t("admin.forms.create")}
        </button>
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

      <div className="flex flex-wrap gap-2">
        {forms.map((form) => (
          <button
            key={form.id}
            type="button"
            onClick={() => selectForm(form)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              selectedId === form.id
                ? "bg-brand-600 text-white"
                : "border border-ink-200 bg-surface text-ink-700 hover:bg-ink-50"
            }`}
          >
            {form.title_ko}
          </button>
        ))}
      </div>

      {!draft ? (
        <p className="rounded-xl border border-dashed border-ink-200 px-4 py-10 text-center text-sm text-ink-500">
          {t("admin.forms.empty")}
        </p>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setTab("edit")}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                tab === "edit" ? "bg-ink-900 text-white" : "border border-ink-200 text-ink-700"
              }`}
            >
              {t("admin.forms.tabEdit")}
            </button>
            {draft.id ? (
              <button
                type="button"
                onClick={() => setTab("submissions")}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                  tab === "submissions"
                    ? "bg-ink-900 text-white"
                    : "border border-ink-200 text-ink-700"
                }`}
              >
                {t("admin.forms.tabSubmissions")}
              </button>
            ) : null}
            <Link
              href={publicUrl}
              className="rounded-lg border border-ink-200 px-3 py-1.5 text-sm font-medium text-brand-700 hover:bg-brand-50"
            >
              {t("admin.forms.openPublic")} →
            </Link>
            {draft.id ? (
              <button
                type="button"
                onClick={handleAddToMenu}
                disabled={saving}
                className="rounded-lg border border-ink-200 px-3 py-1.5 text-sm font-medium text-ink-700 hover:bg-ink-50 disabled:opacity-60"
              >
                {t("admin.forms.addToMenu")}
              </button>
            ) : null}
          </div>

          {tab === "edit" ? (
            <form onSubmit={handleSave} className="space-y-6 rounded-2xl border border-ink-200 bg-surface p-4 md:p-6">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label={t("admin.forms.slug")}>
                  <TextInput
                    value={draft.slug}
                    onChange={(slug) => patchDraft({ slug })}
                  />
                </Field>
                <Field label={t("adminHomepage.sortOrder")}>
                  <TextInput
                    value={String(draft.sort_order)}
                    onChange={(v) => patchDraft({ sort_order: Number(v) || 0 })}
                  />
                </Field>
                <Field label={`${t("admin.forms.formTitle")} (KO)`}>
                  <TextInput
                    value={draft.title_ko}
                    onChange={(title_ko) => patchDraft({ title_ko })}
                  />
                </Field>
                <Field label={`${t("admin.forms.formTitle")} (EN)`}>
                  <TextInput
                    value={draft.title_en}
                    onChange={(title_en) => patchDraft({ title_en })}
                  />
                </Field>
                <Field label={`${t("admin.forms.formTitle")} (DE)`}>
                  <TextInput
                    value={draft.title_de}
                    onChange={(title_de) => patchDraft({ title_de })}
                  />
                </Field>
                <label className="flex items-center gap-2 text-sm text-ink-700 sm:mt-7">
                  <input
                    type="checkbox"
                    checked={draft.is_published}
                    onChange={(e) => patchDraft({ is_published: e.target.checked })}
                  />
                  {t("admin.forms.published")}
                </label>
              </div>

              <Field label={`${t("admin.forms.description")} (KO)`}>
                <TextInput
                  multiline
                  value={draft.description_ko}
                  onChange={(description_ko) => patchDraft({ description_ko })}
                />
              </Field>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-ink-900">{t("admin.forms.fields")}</h3>
                  <button
                    type="button"
                    onClick={() => patchDraft({ fields: [...draft.fields, newEmptyField()] })}
                    className="rounded-md border border-ink-200 px-2 py-1 text-xs font-medium text-ink-700 hover:bg-ink-50"
                  >
                    {t("admin.forms.addField")}
                  </button>
                </div>

                {draft.fields.map((field, index) => (
                  <div key={field.id} className="space-y-2 rounded-xl border border-ink-100 bg-surface-muted/40 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-medium uppercase text-ink-500">
                        {t("admin.forms.field")} {index + 1}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          patchDraft({ fields: draft.fields.filter((_, i) => i !== index) })
                        }
                        className="text-xs text-red-600 hover:underline"
                      >
                        {t("admin.menu.delete")}
                      </button>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                      <Field label={t("admin.forms.fieldName")}>
                        <TextInput
                          value={field.name}
                          onChange={(name) => patchField(index, { name })}
                        />
                      </Field>
                      <Field label={t("admin.forms.fieldType")}>
                        <select
                          value={field.type}
                          onChange={(e) =>
                            patchField(index, { type: e.target.value as SiteFormFieldType })
                          }
                          className="w-full rounded-lg border border-ink-200 bg-surface px-3 py-2 text-sm"
                        >
                          {FIELD_TYPES.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <label className="flex items-center gap-2 text-sm text-ink-700 sm:mt-7">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => patchField(index, { required: e.target.checked })}
                        />
                        {t("admin.forms.required")}
                      </label>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-3">
                      <Field label="라벨 KO">
                        <TextInput
                          value={field.label_ko}
                          onChange={(label_ko) => patchField(index, { label_ko })}
                        />
                      </Field>
                      <Field label="라벨 EN">
                        <TextInput
                          value={field.label_en}
                          onChange={(label_en) => patchField(index, { label_en })}
                        />
                      </Field>
                      <Field label="라벨 DE">
                        <TextInput
                          value={field.label_de}
                          onChange={(label_de) => patchField(index, { label_de })}
                        />
                      </Field>
                    </div>
                    {(field.type === "radio" || field.type === "select") && (
                      <Field label={t("admin.forms.optionsHint")}>
                        <TextInput
                          multiline
                          rows={3}
                          value={(field.options ?? [])
                            .map((o) => `${o.value}|${o.label_ko}|${o.label_en}|${o.label_de}`)
                            .join("\n")}
                          onChange={(raw) => {
                            const options = raw
                              .split("\n")
                              .map((line) => line.trim())
                              .filter(Boolean)
                              .map((line) => {
                                const [value, label_ko, label_en, label_de] = line.split("|");
                                return {
                                  value: value?.trim() || "option",
                                  label_ko: label_ko?.trim() || value?.trim() || "",
                                  label_en: label_en?.trim() || label_ko?.trim() || "",
                                  label_de: label_de?.trim() || label_ko?.trim() || "",
                                };
                              });
                            patchField(index, { options });
                          }}
                        />
                      </Field>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
                >
                  {saving ? t("auth.loading") : t("admin.forms.save")}
                </button>
                {draft.id ? (
                  <button
                    type="button"
                    onClick={handleDeleteForm}
                    disabled={saving}
                    className={`rounded-lg px-4 py-2 text-sm font-medium ${
                      confirmDeleteId === draft.id
                        ? "bg-red-600 text-white"
                        : "border border-red-200 text-red-700 hover:bg-red-50"
                    }`}
                  >
                    {confirmDeleteId === draft.id
                      ? t("admin.menu.deleteConfirm")
                      : t("admin.menu.delete")}
                  </button>
                ) : null}
              </div>
              <p className="text-xs text-ink-500">
                {t("admin.forms.publicUrlHint")}: <code className="text-ink-700">{publicUrl}</code>
              </p>
            </form>
          ) : (
            <div className="space-y-3 rounded-2xl border border-ink-200 bg-surface p-4 md:p-6">
              <h3 className="text-base font-semibold text-ink-900">
                {t("admin.forms.submissionsTitle")} ({submissions.length})
              </h3>
              {submissions.length === 0 ? (
                <p className="text-sm text-ink-500">{t("admin.forms.submissionsEmpty")}</p>
              ) : (
                <ul className="space-y-3">
                  {submissions.map((sub) => (
                    <li key={sub.id} className="rounded-xl border border-ink-100 p-3">
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                        <p className="text-xs text-ink-500">
                          {new Date(sub.created_at).toLocaleString(
                            language === "ko" ? "ko-KR" : language === "de" ? "de-DE" : "en-GB"
                          )}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleDeleteSubmission(sub.id)}
                          className="text-xs text-red-600 hover:underline"
                        >
                          {t("admin.menu.delete")}
                        </button>
                      </div>
                      <dl className="grid gap-1 text-sm sm:grid-cols-2">
                        {Object.entries(sub.payload).map(([key, value]) => (
                          <div key={key}>
                            <dt className="text-xs font-medium text-ink-500">{key}</dt>
                            <dd className="whitespace-pre-wrap text-ink-800">{value || "—"}</dd>
                          </div>
                        ))}
                      </dl>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
