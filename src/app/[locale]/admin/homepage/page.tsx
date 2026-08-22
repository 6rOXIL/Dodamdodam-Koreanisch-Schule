"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/contexts/LanguageContext";

/** 이전 /admin/homepage → /admin/pages 로 이동 */
export default function AdminHomepageRedirect() {
  const router = useRouter();
  const { language, t } = useLanguage();

  useEffect(() => {
    router.replace(`/${language}/admin/pages/`);
  }, [language, router]);

  return <p className="text-ink-500">{t("auth.loading")}</p>;
}
