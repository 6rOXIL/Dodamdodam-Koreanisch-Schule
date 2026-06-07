"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { defaultLocale } from "@/lib/i18n/config";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    async function handleCallback() {
      const supabase = createClient();
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const next = url.searchParams.get("next") ?? `/${defaultLocale}/resources/`;
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
          router.replace(next.startsWith("/") ? `${basePath}${next}` : `${basePath}/${defaultLocale}/resources/`);
          return;
        }
      }

      router.replace(`${basePath}/${defaultLocale}/login/?error=auth`);
    }

    handleCallback();
  }, [router]);

  return (
    <main className="flex min-h-[50vh] items-center justify-center bg-surface text-ink-600">
      <p>로그인 처리 중…</p>
    </main>
  );
}
