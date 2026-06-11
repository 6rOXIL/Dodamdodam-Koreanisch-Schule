"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { useEffect, useState } from "react";
import type { SectionId } from "@/lib/navConfig";
import { getPathWithoutLocalePrefix } from "@/lib/i18n/pathname";
import { createClient } from "@/lib/supabase/client";
import { useProfile } from "@/lib/supabase/useProfile";
import LanguageSwitcher from "./LanguageSwitcher";

const NAV_KEYS: { id: SectionId; labelKey: string }[] = [
  { id: "home", labelKey: "nav.home" },
  { id: "about", labelKey: "nav.about" },
  { id: "classes", labelKey: "nav.classes" },
  { id: "schedule", labelKey: "nav.schedule" },
  { id: "gallery", labelKey: "nav.gallery" },
  { id: "events", labelKey: "nav.events" },
  { id: "location", labelKey: "nav.location" },
];

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, language } = useLanguage();
  const { user, loading: profileLoading } = useProfile();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const pathWithoutLocale = getPathWithoutLocalePrefix(pathname) || "/";
  const normalizedPath =
    pathWithoutLocale !== "/" && pathWithoutLocale.endsWith("/")
      ? pathWithoutLocale.slice(0, -1)
      : pathWithoutLocale;

  useEffect(() => {
    if (typeof document === "undefined") return;
    const prev = document.body.style.overflow;
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = prev || "";
    }
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [mobileOpen]);

  async function handleLogout() {
    setLoggingOut(true);
    setMobileOpen(false);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(`/${language}/`);
    router.refresh();
    setLoggingOut(false);
  }

  const navItemClass = (active: boolean) =>
    `whitespace-nowrap rounded-md px-2 py-2 text-sm transition-colors md:px-3 ${
      active ? "bg-brand-100 font-semibold text-brand-950" : "text-ink-700 hover:bg-ink-100"
    }`;

  const renderNavItem = (id: SectionId, labelKey: string, mobile = false) => {
    const targetPath =
      id === "home" ? "/" : id === "about" ? "/introduction" : id === "classes" ? "/classes" : `/${id}`;
    const href =
      id === "home"
        ? `/${language}/`
        : id === "about"
          ? `/${language}/introduction/`
          : id === "classes"
            ? `/${language}/classes/`
            : `/${language}/${id}/`;
    const active = normalizedPath === targetPath;
    const baseClass = mobile
      ? `w-full rounded-xl px-4 py-4 text-left text-base ${
          active ? "bg-brand-100 font-semibold text-brand-950" : "text-ink-800 active:bg-ink-100"
        }`
      : navItemClass(active);

    return (
      <Link
        key={id}
        href={href}
        className={baseClass}
        onClick={() => setMobileOpen(false)}
      >
        {t(labelKey)}
      </Link>
    );
  };

  const authLinks = (mobile = false) => {
    if (profileLoading) return null;

    if (user) {
      const resourcesHref = `/${language}/resources/`;
      const resourcesActive = normalizedPath === "/resources";

      if (mobile) {
        return (
          <div className="mt-4 flex flex-col gap-3 border-t border-ink-200 pt-4">
            <Link
              href={resourcesHref}
              className={`w-full rounded-xl px-4 py-4 text-left text-base ${
                resourcesActive
                  ? "bg-brand-100 font-semibold text-brand-950"
                  : "text-ink-800 active:bg-ink-100"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              {t("resources.title")}
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full rounded-xl border border-ink-200 px-4 py-4 text-center text-base text-ink-800 active:bg-ink-100 disabled:opacity-60"
            >
              {loggingOut ? t("auth.loading") : t("auth.logout")}
            </button>
          </div>
        );
      }

      return (
        <div className="hidden items-center gap-1 md:flex">
          <Link
            href={resourcesHref}
            className={`whitespace-nowrap rounded-md px-2 py-2 text-sm transition-colors md:px-3 ${
              resourcesActive
                ? "bg-brand-100 font-semibold text-brand-950"
                : "text-ink-700 hover:bg-ink-100"
            }`}
          >
            {t("resources.title")}
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="whitespace-nowrap rounded-md border border-ink-200 px-2.5 py-1.5 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-50 disabled:opacity-60 md:px-3"
          >
            {loggingOut ? t("auth.loading") : t("auth.logout")}
          </button>
        </div>
      );
    }

    const loginHref = `/${language}/login/`;
    const signupHref = `/${language}/signup/`;
    const loginActive = normalizedPath === "/login";
    const signupActive = normalizedPath === "/signup";

    if (mobile) {
      return (
        <div className="mt-4 flex flex-col gap-3 border-t border-ink-200 pt-4">
          <Link
            href={loginHref}
            className={`w-full rounded-xl px-4 py-4 text-center text-base ${
              loginActive
                ? "bg-brand-100 font-semibold text-brand-950"
                : "border border-ink-200 text-ink-800 active:bg-ink-100"
            }`}
            onClick={() => setMobileOpen(false)}
          >
            {t("auth.loginLink")}
          </Link>
          <Link
            href={signupHref}
            className={`w-full rounded-xl px-4 py-4 text-center text-base font-semibold ${
              signupActive
                ? "bg-brand-800 text-surface"
                : "bg-brand-600 text-on-inverse active:bg-brand-800"
            }`}
            onClick={() => setMobileOpen(false)}
          >
            {t("auth.signupLink")}
          </Link>
        </div>
      );
    }

    return (
      <div className="hidden items-center gap-1 md:flex">
        <Link
          href={loginHref}
          className={`whitespace-nowrap rounded-md px-2 py-2 text-sm transition-colors md:px-3 ${
            loginActive
              ? "bg-brand-100 font-semibold text-brand-950"
              : "text-ink-700 hover:bg-ink-100"
          }`}
        >
          {t("auth.loginLink")}
        </Link>
        <Link
          href={signupHref}
          className={`whitespace-nowrap rounded-md px-2.5 py-1.5 text-sm font-semibold transition-colors md:px-3 ${
            signupActive
              ? "bg-brand-800 text-surface"
              : "bg-brand-600 text-on-inverse hover:bg-brand-800"
          }`}
        >
          {t("auth.signupLink")}
        </Link>
      </div>
    );
  };

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-ink-200/80 bg-surface/95 backdrop-blur-md pt-[env(safe-area-inset-top,0px)]">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-3 md:gap-4 md:px-6">
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg p-2 text-ink-800 md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <Link
            href={`/${language}/`}
            className="min-w-0 flex-1 text-left md:flex-none"
            onClick={() => setMobileOpen(false)}
          >
            <span className="block truncate font-semibold text-ink-900 sm:text-base md:text-lg">
              {t("site.nameShort")}
            </span>
            <span className="hidden text-xs text-ink-500 sm:block">{t("site.nameEn")}</span>
          </Link>
          <nav className="hidden flex-1 items-center justify-center gap-0.5 overflow-x-auto md:flex lg:gap-1">
            {NAV_KEYS.map(({ id, labelKey }) => renderNavItem(id, labelKey, false))}
          </nav>

          <div className="flex shrink-0 items-center gap-8">
          <LanguageSwitcher />
          {authLinks()}
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-surface md:hidden"
          style={{
            paddingTop: "calc(4rem + env(safe-area-inset-top, 0px))",
          }}
        >
          <nav
            className="flex h-full max-h-[calc(100dvh-4rem-env(safe-area-inset-top,0px))] flex-col gap-0 overflow-y-auto overscroll-contain px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
            aria-label="모바일 메뉴"
          >
            {NAV_KEYS.map(({ id, labelKey }) => renderNavItem(id, labelKey, true))}
            {authLinks(true)}
          </nav>
        </div>
      )}
    </>
  );
}
