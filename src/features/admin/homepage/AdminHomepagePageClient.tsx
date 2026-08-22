"use client";

import { Suspense } from "react";
import AdminHomepageClient from "@/features/admin/homepage/AdminHomepageClient";
import { useLanguage } from "@/lib/contexts/LanguageContext";

function Fallback() {
  const { t } = useLanguage();
  return <p className="text-ink-500">{t("auth.loading")}</p>;
}

export default function AdminHomepagePageClient() {
  return (
    <Suspense fallback={<Fallback />}>
      <AdminHomepageClient />
    </Suspense>
  );
}
