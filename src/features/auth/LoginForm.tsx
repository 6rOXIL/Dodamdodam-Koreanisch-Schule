"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function LoginForm() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? `/${language}/resources/`;
  const authError = searchParams.get("error");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push(nextPath.startsWith("/") ? nextPath : `/${language}/resources/`);
    router.refresh();
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <h1 className="text-2xl font-bold text-ink-900">{t("auth.loginTitle")}</h1>
      <p className="mt-2 text-sm text-ink-600">{t("auth.loginLead")}</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink-700">
            {t("auth.email")}
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-ink-200 bg-surface px-3 py-2.5 text-ink-900 outline-none ring-brand-600 focus:ring-2"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-ink-700">
            {t("auth.password")}
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-ink-200 bg-surface px-3 py-2.5 text-ink-900 outline-none ring-brand-600 focus:ring-2"
          />
        </div>

        {authError === "auth" && (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900" role="alert">
            {t("auth.callbackError")}
          </p>
        )}

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-brand-600 px-4 py-2.5 font-semibold text-on-inverse transition hover:bg-brand-800 disabled:opacity-60"
        >
          {loading ? t("auth.loading") : t("auth.loginButton")}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-600">
        {t("auth.noAccount")}{" "}
        <Link href={`/${language}/signup/`} className="font-semibold text-brand-800 hover:underline">
          {t("auth.signupLink")}
        </Link>
      </p>
    </div>
  );
}
