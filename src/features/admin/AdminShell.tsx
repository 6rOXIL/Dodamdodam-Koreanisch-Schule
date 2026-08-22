"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { getPathWithoutLocalePrefix } from "@/lib/i18n/pathname";
import { isAdmin } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/client";
import { useProfile } from "@/lib/supabase/useProfile";

const ADMIN_NAV = [
  { href: "/admin/", key: "admin.nav.dashboard", match: "exact" as const },
  { href: "/admin/menu/", key: "admin.nav.menu", match: "prefix" as const },
  { href: "/admin/pages/", key: "admin.nav.pages", match: "prefix" as const },
  { href: "/admin/forms/", key: "admin.nav.forms", match: "prefix" as const },
  { href: "/admin/resources/", key: "admin.nav.resources", match: "prefix" as const },
  { href: "/admin/members/", key: "admin.nav.members", match: "prefix" as const },
] as const;

function isActive(pathRest: string, href: string, match: "exact" | "prefix") {
  const normalized = pathRest.endsWith("/") && pathRest !== "/" ? pathRest : `${pathRest}/`;
  if (match === "exact") return normalized === href || pathRest === "/admin";
  return normalized.startsWith(href);
}

export default function AdminShell({ children }: { children: ReactNode }) {
  const { t, language } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const { profile, loading } = useProfile();
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const pathRest = getPathWithoutLocalePrefix(pathname) || "/";

  useEffect(() => {
    if (loading) return;
    if (!profile) {
      router.replace(`/${language}/login/?next=${encodeURIComponent(`/${language}/admin/`)}`);
      return;
    }
    if (!isAdmin(profile)) {
      router.replace(`/${language}/resources/`);
    }
  }, [profile, loading, language, router]);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  async function handleLogout() {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(`/${language}/login/`);
    router.refresh();
  }

  if (loading || !profile || !isAdmin(profile)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-ink-500">
        {t("auth.loading")}
      </div>
    );
  }

  const navLinkClass = (active: boolean) =>
    `flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
      active
        ? "bg-brand-100 text-brand-950"
        : "text-ink-600 hover:bg-ink-100 hover:text-ink-900"
    }`;

  const sidebar = (
    <nav className="flex flex-col gap-1" aria-label={t("admin.shellNavLabel")}>
      {ADMIN_NAV.map((item) => {
        const active = isActive(pathRest, item.href, item.match);
        return (
          <Link
            key={item.href}
            href={`/${language}${item.href}`}
            className={navLinkClass(active)}
            aria-current={active ? "page" : undefined}
          >
            {t(item.key)}
          </Link>
        );
      })}
      <div className="my-3 border-t border-ink-200" />
      <Link href={`/${language}/resources/`} className={navLinkClass(false)}>
        {t("admin.nav.openResources")}
      </Link>
      <Link href={`/${language}/`} className={navLinkClass(false)}>
        {t("admin.nav.viewSite")}
      </Link>
    </nav>
  );

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-surface-muted/40">
      <div className="border-b border-ink-200 bg-surface">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              className="inline-flex rounded-lg border border-ink-200 p-2 text-ink-700 lg:hidden"
              onClick={() => setMobileNavOpen((o) => !o)}
              aria-expanded={mobileNavOpen}
              aria-label={t("admin.toggleNav")}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
                {t("auth.adminLabel")}
              </p>
              <h1 className="truncate text-lg font-bold text-ink-900 md:text-xl">
                {t("admin.consoleTitle")}
              </h1>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden text-sm text-ink-500 sm:inline">
              {profile.display_name || profile.email}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="rounded-lg border border-ink-200 px-3 py-1.5 text-sm font-medium text-ink-700 hover:bg-ink-50 disabled:opacity-60"
            >
              {t("auth.logout")}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl gap-0 lg:gap-8 lg:px-6 lg:py-8">
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-[calc(4rem+1rem)] rounded-2xl border border-ink-200 bg-surface p-3 shadow-sm">
            {sidebar}
          </div>
        </aside>

        {mobileNavOpen && (
          <div className="fixed inset-0 z-[60] lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-ink-900/40"
              aria-label={t("resources.cancelButton")}
              onClick={() => setMobileNavOpen(false)}
            />
            <aside className="relative h-full w-72 max-w-[85vw] border-r border-ink-200 bg-surface p-4 shadow-xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-500">
                {t("admin.shellNavLabel")}
              </p>
              {sidebar}
            </aside>
          </div>
        )}

        <div className="min-w-0 flex-1 px-4 py-6 lg:px-0 lg:py-0">{children}</div>
      </div>
    </div>
  );
}
