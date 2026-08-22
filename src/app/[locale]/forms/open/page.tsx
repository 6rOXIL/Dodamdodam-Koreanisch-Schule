"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PublicFormLoader from "@/features/forms/PublicFormLoader";
import { useLanguage } from "@/lib/contexts/LanguageContext";

function FormByQuery() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") || "enrollment";
  return <PublicFormLoader slug={slug} />;
}

export default function FormsOpenPage() {
  const { t } = useLanguage();
  return (
    <Suspense
      fallback={
        <main className="px-4 py-20 text-center text-ink-500">{t("auth.loading")}</main>
      }
    >
      <FormByQuery />
    </Suspense>
  );
}
