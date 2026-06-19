"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import PasswordInput from "@/components/PasswordInput";
import { createClient } from "@/lib/supabase/client";
import {
  establishSessionFromUrl,
  stripAuthParamsFromUrl,
  waitForAuthSession,
} from "@/lib/supabase/establishSessionFromUrl";

export default function ResetPasswordForm() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    async function initRecoverySession() {
      await establishSessionFromUrl(supabase);
      const hasSession = await waitForAuthSession(supabase);

      if (cancelled) return;

      if (hasSession) {
        stripAuthParamsFromUrl();
        setHasSession(true);
      }
      setCheckingSession(false);
    }

    void initRecoverySession();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError(t("auth.passwordHint"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("auth.passwordMismatch"));
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setLoading(false);
      setError(updateError.message);
      return;
    }

    await supabase.auth.signOut();
    router.replace(`/${language}/login/?reset=success`);
  }

  if (checkingSession) {
    return (
      <div className="mx-auto w-full max-w-md text-center text-ink-500">
        {t("auth.loading")}
      </div>
    );
  }

  if (!hasSession) {
    return (
      <div className="mx-auto w-full max-w-md">
        <h1 className="text-2xl font-bold text-ink-900">{t("auth.resetPasswordTitle")}</h1>
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {t("auth.resetPasswordInvalidLink")}
        </p>
        <p className="mt-6 text-center text-sm text-ink-600">
          <Link
            href={`/${language}/forgot-password/`}
            className="font-semibold text-brand-800 hover:underline"
          >
            {t("auth.forgotPasswordLink")}
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <h1 className="text-2xl font-bold text-ink-900">{t("auth.resetPasswordTitle")}</h1>
      <p className="mt-2 text-sm text-ink-600">{t("auth.resetPasswordLead")}</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="new-password" className="mb-1 block text-sm font-medium text-ink-700">
            {t("auth.newPassword")}
          </label>
          <PasswordInput
            id="new-password"
            required
            minLength={6}
            autoComplete="new-password"
            value={password}
            onChange={setPassword}
          />
          <p className="mt-1 text-xs text-ink-500">{t("auth.passwordHint")}</p>
        </div>

        <div>
          <label htmlFor="confirm-password" className="mb-1 block text-sm font-medium text-ink-700">
            {t("auth.confirmPassword")}
          </label>
          <PasswordInput
            id="confirm-password"
            required
            minLength={6}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={setConfirmPassword}
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
          {loading ? t("auth.loading") : t("auth.resetPasswordButton")}
        </button>
      </form>
    </div>
  );
}
