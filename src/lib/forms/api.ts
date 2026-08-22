import type { Locale } from "@/lib/i18n/config";
import { createClient } from "@/lib/supabase/client";
import type { SiteForm, SiteFormField, SiteFormSubmission } from "@/lib/forms/types";

function localize(
  row: Record<string, string>,
  base: string,
  locale: Locale
): string {
  if (locale === "en") return row[`${base}_en`] || row[`${base}_ko`] || "";
  if (locale === "de") return row[`${base}_de`] || row[`${base}_ko`] || "";
  return row[`${base}_ko`] || "";
}

export function getFormTitle(form: SiteForm, locale: Locale) {
  return localize(form as unknown as Record<string, string>, "title", locale);
}

export function getFormDescription(form: SiteForm, locale: Locale) {
  return localize(form as unknown as Record<string, string>, "description", locale);
}

export function getFormSuccessMessage(form: SiteForm, locale: Locale) {
  return localize(form as unknown as Record<string, string>, "success_message", locale);
}

export function getFieldLabel(field: SiteFormField, locale: Locale) {
  if (locale === "en") return field.label_en || field.label_ko;
  if (locale === "de") return field.label_de || field.label_ko;
  return field.label_ko;
}

export function getFieldPlaceholder(field: SiteFormField, locale: Locale) {
  if (locale === "en") return field.placeholder_en || field.placeholder_ko || "";
  if (locale === "de") return field.placeholder_de || field.placeholder_ko || "";
  return field.placeholder_ko || "";
}

export function getOptionLabel(
  option: { label_ko: string; label_en: string; label_de: string },
  locale: Locale
) {
  if (locale === "en") return option.label_en || option.label_ko;
  if (locale === "de") return option.label_de || option.label_ko;
  return option.label_ko;
}

function mapForm(row: Record<string, unknown>): SiteForm {
  return {
    ...(row as Omit<SiteForm, "fields">),
    fields: Array.isArray(row.fields) ? (row.fields as SiteFormField[]) : [],
  };
}

export async function fetchPublishedFormBySlug(slug: string): Promise<SiteForm | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("site_forms")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error || !data) return null;
  return mapForm(data as Record<string, unknown>);
}

export async function fetchAllForms(): Promise<SiteForm[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("site_forms")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return data.map((row) => mapForm(row as Record<string, unknown>));
}

export async function fetchFormById(id: string): Promise<SiteForm | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from("site_forms").select("*").eq("id", id).maybeSingle();
  if (error || !data) return null;
  return mapForm(data as Record<string, unknown>);
}

export async function upsertForm(
  form: Partial<SiteForm> & { slug: string; title_ko: string; fields: SiteFormField[] }
): Promise<{ data: SiteForm | null; error: string | null }> {
  const supabase = createClient();
  const payload = {
    slug: form.slug,
    title_ko: form.title_ko,
    title_en: form.title_en ?? "",
    title_de: form.title_de ?? "",
    description_ko: form.description_ko ?? "",
    description_en: form.description_en ?? "",
    description_de: form.description_de ?? "",
    success_message_ko: form.success_message_ko,
    success_message_en: form.success_message_en,
    success_message_de: form.success_message_de,
    fields: form.fields,
    is_published: form.is_published ?? true,
    sort_order: form.sort_order ?? 0,
  };

  const query = form.id
    ? supabase.from("site_forms").update(payload).eq("id", form.id)
    : supabase.from("site_forms").insert(payload);

  const { data, error } = await query.select("*").single();
  if (error) return { data: null, error: error.message };
  return { data: mapForm(data as Record<string, unknown>), error: null };
}

export async function deleteForm(id: string): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from("site_forms").delete().eq("id", id);
  return { error: error?.message ?? null };
}

export async function submitForm(
  formId: string,
  payload: Record<string, string>
): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from("site_form_submissions").insert({
    form_id: formId,
    payload,
  });
  return { error: error?.message ?? null };
}

export async function fetchFormSubmissions(formId: string): Promise<SiteFormSubmission[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("site_form_submissions")
    .select("*")
    .eq("form_id", formId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as SiteFormSubmission[];
}

export async function deleteFormSubmission(id: string): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from("site_form_submissions").delete().eq("id", id);
  return { error: error?.message ?? null };
}

export function newEmptyField(): SiteFormField {
  return {
    id: crypto.randomUUID(),
    name: `field_${Date.now()}`,
    type: "text",
    required: false,
    label_ko: "",
    label_en: "",
    label_de: "",
    options: [],
  };
}
