"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  getFieldLabel,
  getFieldPlaceholder,
  getFormDescription,
  getFormSuccessMessage,
  getFormTitle,
  getOptionLabel,
  submitForm,
} from "@/lib/forms/api";
import type { SiteForm } from "@/lib/forms/types";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import type { Locale } from "@/lib/i18n/config";

type Props = {
  form: SiteForm;
};

export default function PublicFormClient({ form }: Props) {
  const { t, language } = useLanguage();
  const locale = language as Locale;
  const [values, setValues] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const title = useMemo(() => getFormTitle(form, locale), [form, locale]);
  const description = useMemo(() => getFormDescription(form, locale), [form, locale]);

  function setValue(name: string, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    for (const field of form.fields) {
      if (!field.required) continue;
      const v = (values[field.name] ?? "").trim();
      if (!v) {
        setError(t("forms.requiredError").replace("{{field}}", getFieldLabel(field, locale)));
        return;
      }
    }

    setSubmitting(true);
    const { error: submitError } = await submitForm(form.id, values);
    setSubmitting(false);

    if (submitError) {
      setError(submitError);
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-ink-900">{title}</h1>
        <p className="mt-6 rounded-xl bg-brand-50 px-5 py-4 text-brand-900">
          {getFormSuccessMessage(form, locale)}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:px-6 md:py-16">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-ink-900 md:text-3xl">{title}</h1>
        {description ? <p className="mt-3 text-ink-600">{description}</p> : null}
      </header>

      {error && (
        <p className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {form.fields.map((field) => {
          const label = getFieldLabel(field, locale);
          const placeholder = getFieldPlaceholder(field, locale);
          const id = `field-${field.id}`;

          if (field.type === "radio" && field.options?.length) {
            return (
              <fieldset key={field.id} className="space-y-2">
                <legend className="text-sm font-medium text-ink-800">
                  {label}
                  {field.required ? " *" : ""}
                </legend>
                <div className="flex flex-wrap gap-4">
                  {field.options.map((opt) => (
                    <label key={opt.value} className="inline-flex items-center gap-2 text-sm text-ink-700">
                      <input
                        type="radio"
                        name={field.name}
                        value={opt.value}
                        checked={values[field.name] === opt.value}
                        onChange={() => setValue(field.name, opt.value)}
                        required={field.required}
                      />
                      {getOptionLabel(opt, locale)}
                    </label>
                  ))}
                </div>
              </fieldset>
            );
          }

          if (field.type === "select") {
            return (
              <label key={field.id} className="block space-y-1.5">
                <span className="text-sm font-medium text-ink-800">
                  {label}
                  {field.required ? " *" : ""}
                </span>
                <select
                  id={id}
                  required={field.required}
                  value={values[field.name] ?? ""}
                  onChange={(e) => setValue(field.name, e.target.value)}
                  className="w-full rounded-lg border border-ink-200 bg-surface px-3 py-2.5 text-sm text-ink-900"
                >
                  <option value="">{t("forms.selectPlaceholder")}</option>
                  {(field.options ?? []).map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {getOptionLabel(opt, locale)}
                    </option>
                  ))}
                </select>
              </label>
            );
          }

          if (field.type === "textarea") {
            return (
              <label key={field.id} className="block space-y-1.5">
                <span className="text-sm font-medium text-ink-800">
                  {label}
                  {field.required ? " *" : ""}
                </span>
                <textarea
                  id={id}
                  required={field.required}
                  rows={5}
                  placeholder={placeholder}
                  value={values[field.name] ?? ""}
                  onChange={(e) => setValue(field.name, e.target.value)}
                  className="w-full rounded-lg border border-ink-200 bg-surface px-3 py-2.5 text-sm text-ink-900"
                />
              </label>
            );
          }

          return (
            <label key={field.id} className="block space-y-1.5">
              <span className="text-sm font-medium text-ink-800">
                {label}
                {field.required ? " *" : ""}
              </span>
              <input
                id={id}
                type={field.type === "date" ? "text" : field.type}
                required={field.required}
                placeholder={placeholder}
                value={values[field.name] ?? ""}
                onChange={(e) => setValue(field.name, e.target.value)}
                className="w-full rounded-lg border border-ink-200 bg-surface px-3 py-2.5 text-sm text-ink-900"
              />
            </label>
          );
        })}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60 sm:w-auto sm:min-w-[8rem]"
        >
          {submitting ? t("auth.loading") : t("forms.submit")}
        </button>
      </form>
    </div>
  );
}
