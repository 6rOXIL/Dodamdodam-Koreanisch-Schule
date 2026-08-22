"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import type { Locale } from "@/lib/i18n/config";
import {
  fetchTopNavItems,
  getAdminManagePath,
  getLocalizedLabel,
} from "@/lib/siteContent/api";
import type { SiteNavItem } from "@/lib/supabase/database.types";

const QUICK_LINKS = [
  {
    href: "/admin/menu/",
    titleKey: "admin.nav.menu",
    leadKey: "admin.dashboard.menuLead",
  },
  {
    href: "/admin/pages/",
    titleKey: "admin.nav.pages",
    leadKey: "admin.dashboard.pagesLead",
  },
  {
    href: "/admin/forms/",
    titleKey: "admin.nav.forms",
    leadKey: "admin.dashboard.formsLead",
  },
  {
    href: "/admin/resources/",
    titleKey: "admin.nav.resources",
    leadKey: "admin.dashboard.resourcesLead",
  },
  {
    href: "/admin/members/",
    titleKey: "admin.nav.members",
    leadKey: "admin.dashboard.membersLead",
  },
] as const;

export default function AdminDashboardClient() {
  const { t, language } = useLanguage();
  const [items, setItems] = useState<SiteNavItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchTopNavItems().then((data) => {
      if (cancelled) return;
      setItems(data);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-2xl font-bold text-ink-900">{t("admin.dashboard.title")}</h2>
        <p className="mt-1 text-ink-600">{t("admin.dashboard.lead")}</p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2">
        {QUICK_LINKS.map((link) => (
          <Link
            key={link.href}
            href={`/${language}${link.href}`}
            className="rounded-2xl border border-ink-200 bg-surface p-5 shadow-sm transition hover:border-brand-300 hover:bg-brand-50/40"
          >
            <h3 className="text-base font-semibold text-ink-900">{t(link.titleKey)}</h3>
            <p className="mt-1 text-sm text-ink-600">{t(link.leadKey)}</p>
          </Link>
        ))}
      </section>

      <section className="rounded-2xl border border-ink-200 bg-surface p-5 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-ink-900">{t("admin.dashboard.menuPreview")}</h3>
            <p className="mt-1 text-sm text-ink-500">{t("admin.dashboard.menuPreviewLead")}</p>
          </div>
          <Link
            href={`/${language}/admin/menu/`}
            className="text-sm font-medium text-brand-700 hover:text-brand-900"
          >
            {t("admin.dashboard.editMenu")} →
          </Link>
        </div>

        {loading ? (
          <p className="mt-4 text-sm text-ink-500">{t("auth.loading")}</p>
        ) : items.length === 0 ? (
          <p className="mt-4 text-sm text-ink-500">{t("admin.menu.empty")}</p>
        ) : (
          <ol className="mt-4 divide-y divide-ink-100">
            {items.map((item) => {
              const managePath = getAdminManagePath(item.content_kind, language, item.slug);
              return (
                <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <div className="min-w-0">
                    <p className="font-medium text-ink-900">
                      {getLocalizedLabel(item, language as Locale)}
                      {!item.is_visible && (
                        <span className="ml-2 text-xs font-normal text-ink-400">
                          ({t("adminHomepage.visible")} off)
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-ink-500">{item.href_path}</p>
                  </div>
                  {managePath ? (
                    <Link
                      href={managePath}
                      className="shrink-0 rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-medium text-ink-700 hover:bg-ink-50"
                    >
                      {t("admin.dashboard.manageContent")}
                    </Link>
                  ) : null}
                </li>
              );
            })}
          </ol>
        )}
      </section>
    </div>
  );
}
