"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { defaultLocale } from "@/lib/i18n/config";
import { resolveAuthNextPath } from "@/lib/supabase/authPaths";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    async function handleCallback() {
      const supabase = createClient();
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const next = resolveAuthNextPath(url.searchParams.get("next"));

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
          router.replace(next);
          return;
        }
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.replace(next);
        return;
      }

      router.replace(`/${defaultLocale}/login/?login_error=callback`);
    }

    handleCallback();
  }, [router]);

  return (
    <main className="flex min-h-[50vh] items-center justify-center bg-surface text-ink-600">
      <p>로그인 처리 중…</p>
    </main>
  );
}
