"use client";

import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import { LanguageProvider, useLanguage } from "@/lib/contexts/LanguageContext";
import { getPathWithoutLocalePrefix } from "@/lib/i18n/pathname";
import Navigation from "./Navigation";
import SiteFooter from "./SiteFooter";

function HtmlLangSync() {
  const { language } = useLanguage();
  useEffect(() => {
    const lang =
      language === "ko" ? "ko" : language === "de" ? "de" : "en";
    document.documentElement.lang = lang;
  }, [language]);
  return null;
}

function HomeHashScroll() {
  const pathname = usePathname();
  const pathWithoutLocale = getPathWithoutLocalePrefix(pathname);
  const isHome = pathWithoutLocale === "/" || pathWithoutLocale === "";

  useEffect(() => {
    if (!isHome) return;
    const hash = window.location.hash?.replace(/^#/, "");
    if (!hash) return;
    const id = document.getElementById(hash);
    if (!id) return;
    const timer = window.setTimeout(() => {
      id.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    return () => window.clearTimeout(timer);
  }, [pathname, isHome]);

  return null;
}

export default function ClientWrapper({
  children,
  locale,
}: {
  children: ReactNode;
  locale: Locale;
}) {
  return (
    <LanguageProvider locale={locale}>
      <HtmlLangSync />
      <HomeHashScroll />
      <Navigation />
      <div className="min-h-[100dvh] pt-[calc(4rem+env(safe-area-inset-top,0px))] pb-[env(safe-area-inset-bottom,0px)]">
        {children}
      </div>
      <SiteFooter />
    </LanguageProvider>
  );
}
