"use client";

import { Suspense, type ReactNode } from "react";
import AdminShell from "@/features/admin/AdminShell";
import { useLanguage } from "@/lib/contexts/LanguageContext";

function AdminShellFallback() {
  const { t } = useLanguage();
  return (
    <div className="flex min-h-[50vh] items-center justify-center text-ink-500">
      {t("auth.loading")}
    </div>
  );
}

export default function AdminLayoutClient({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<AdminShellFallback />}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}
