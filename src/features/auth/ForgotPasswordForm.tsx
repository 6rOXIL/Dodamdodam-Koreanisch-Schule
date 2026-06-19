"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { passwordResetCallbackUrl } from "@/lib/supabase/authPaths";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordForm() {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: passwordResetCallbackUrl(language),
    });

    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <div className="mx-auto w-full max-w-md">
        <h1 className="text-2xl font-bold text-ink-900">{t("auth.forgotPasswordTitle")}</h1>
        <p className="mt-4 rounded-lg bg-brand-50 px-4 py-3 text-sm text-brand-900">
          {t("auth.forgotPasswordSuccess")}
        </p>
        <p className="mt-6 text-center text-sm text-ink-600">
          <Link href={`/${language}/login/`} className="font-semibold text-brand-800 hover:underline">
            {t("auth.backToLogin")}
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <h1 className="text-2xl font-bold text-ink-900">{t("auth.forgotPasswordTitle")}</h1>
      <p className="mt-2 text-sm text-ink-600">{t("auth.forgotPasswordLead")}</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="forgot-email" className="mb-1 block text-sm font-medium text-ink-700">
            {t("auth.email")}
          </label>
          <input
            id="forgot-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-ink-200 bg-surface px-3 py-2.5 text-ink-900 outline-none ring-brand-600 focus:ring-2"
          />
        </div>

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
          {loading ? t("auth.loading") : t("auth.forgotPasswordButton")}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-600">
        <Link href={`/${language}/login/`} className="font-semibold text-brand-800 hover:underline">
          {t("auth.backToLogin")}
        </Link>
      </p>
    </div>
  );
}
