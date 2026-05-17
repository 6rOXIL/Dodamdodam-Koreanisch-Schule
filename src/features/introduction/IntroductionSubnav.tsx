"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { getPathWithoutLocalePrefix } from "@/lib/i18n/pathname";
import { INTRO_SUBPAGES } from "./introRoutes";

export default function IntroductionSubnav() {
  const pathname = usePathname();
  const { t, language } = useLanguage();

  const pathRest = getPathWithoutLocalePrefix(pathname);

  return (
    <nav
      aria-label={t("introduction.sectionNav")}
      className="mb-10 flex flex-wrap justify-center gap-2 border-b border-ink-200 pb-12 sm:pb-14"
    >
      {INTRO_SUBPAGES.map(({ segment, labelKey }) => {
        const target = `/introduction/${segment}/`;
        const active = pathRest === target;
        return (
          <Link
            key={segment}
            href={`/${language}${target}`}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition sm:text-sm ${
              active
                ? "border-brand-600 bg-brand-100 text-brand-950"
                : "border-ink-200 bg-ink-50 text-ink-700 hover:border-brand-300 hover:bg-brand-50"
            }`}
          >
            {t(labelKey)}
          </Link>
        );
      })}
    </nav>
  );
}
