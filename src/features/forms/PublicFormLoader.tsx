"use client";

import { useEffect, useState } from "react";
import PublicFormClient from "@/features/forms/PublicFormClient";
import { fetchPublishedFormBySlug } from "@/lib/forms/api";
import type { SiteForm } from "@/lib/forms/types";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function PublicFormLoader({ slug }: { slug: string }) {
  const { t } = useLanguage();
  const [form, setForm] = useState<SiteForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchPublishedFormBySlug(slug).then((data) => {
      if (cancelled) return;
      setForm(data);
      setMissing(!data);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="px-4 py-20 text-center text-ink-500">
        {t("auth.loading")}
      </main>
    );
  }

  if (missing || !form) {
    return (
      <main className="px-4 py-20 text-center">
        <h1 className="text-xl font-semibold text-ink-900">{t("forms.notFound")}</h1>
        <p className="mt-2 text-ink-600">{t("forms.notFoundLead")}</p>
      </main>
    );
  }

  return (
    <main className="bg-surface text-ink-900">
      <PublicFormClient form={form} />
    </main>
  );
}
