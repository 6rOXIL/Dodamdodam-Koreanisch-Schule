"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { defaultLocale } from "@/lib/i18n/config";

export default function RootPageRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/${defaultLocale}/`);
  }, [router]);

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-surface text-sm text-ink-500">
      Redirecting...
    </div>
  );
}
