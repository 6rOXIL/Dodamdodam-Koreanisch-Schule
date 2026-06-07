"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/features/auth/LoginForm";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { createClient } from "@/lib/supabase/client";

function LoginPageInner() {
  const router = useRouter();
  const { language } = useLanguage();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace(`/${language}/resources/`);
    });
  }, [language, router]);

  return <LoginForm />;
}

export default function LoginPageClient() {
  return (
    <main className="bg-surface text-ink-900">
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <Suspense fallback={<div className="mx-auto max-w-md text-ink-500">...</div>}>
          <LoginPageInner />
        </Suspense>
      </section>
    </main>
  );
}
