"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SignupForm from "@/features/auth/SignupForm";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { createClient } from "@/lib/supabase/client";

export default function SignupPageClient() {
  const router = useRouter();
  const { language } = useLanguage();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace(`/${language}/resources/`);
    });
  }, [language, router]);

  return (
    <main className="bg-surface text-ink-900">
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <SignupForm />
      </section>
    </main>
  );
}
