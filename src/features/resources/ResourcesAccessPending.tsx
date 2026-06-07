"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function ResourcesAccessPending() {
  const { t, language } = useLanguage();

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center md:px-6">
      <h1 className="text-2xl font-bold text-ink-900">{t("resources.title")}</h1>
      <p className="mt-4 text-ink-600">{t("resources.pendingApproval")}</p>
      <Link
        href={`/${language}/`}
        className="mt-6 inline-block text-sm font-semibold text-brand-800 hover:underline"
      >
        {t("introduction.backHome")}
      </Link>
    </div>
  );
}
