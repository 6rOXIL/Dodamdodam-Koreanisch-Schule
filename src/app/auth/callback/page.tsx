"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { defaultLocale } from "@/lib/i18n/config";
import { resolveAuthNextPath } from "@/lib/supabase/authPaths";
import { createClient } from "@/lib/supabase/client";
import {
  establishSessionFromUrl,
  stripAuthParamsFromUrl,
  waitForAuthSession,
} from "@/lib/supabase/establishSessionFromUrl";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    async function handleCallback() {
      const supabase = createClient();
      const url = new URL(window.location.href);
      const next = resolveAuthNextPath(url.searchParams.get("next"));

      await establishSessionFromUrl(supabase, url);
      const hasSession = await waitForAuthSession(supabase);

      if (hasSession) {
        stripAuthParamsFromUrl();
        router.replace(next);
        return;
      }

      router.replace(`/${defaultLocale}/login/?login_error=callback`);
    }

    void handleCallback();
  }, [router]);

  return (
    <main className="flex min-h-[50vh] items-center justify-center bg-surface text-ink-600">
      <p>로그인 처리 중…</p>
    </main>
  );
}
