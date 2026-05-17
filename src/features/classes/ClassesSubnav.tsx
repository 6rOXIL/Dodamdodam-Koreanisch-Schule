"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CLASS_SUBPAGES } from "./classRoutes";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { getPathWithoutLocalePrefix } from "@/lib/i18n/pathname";

export default function ClassesSubnav() {
  const pathname = usePathname();
  const { t, language } = useLanguage();
  const pathRest = getPathWithoutLocalePrefix(pathname);

  return (
    <nav
      className="mb-8 flex flex-wrap justify-center gap-2"
      aria-label={t("classes.sectionNav")}
    >
      {CLASS_SUBPAGES.map(({ segment, labelKey }) => {
        const target = `/classes/${segment}/`;
        const active = pathRest === target;
        return (
          <Link
            key={segment}
            href={`/${language}${target}`}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition sm:text-sm ${
              active
                ? "border-amber-600 bg-amber-100 text-amber-950"
                : "border-slate-200 bg-slate-50 text-slate-700 hover:border-amber-300 hover:bg-amber-50"
            }`}
          >
            {t(labelKey)}
          </Link>
        );
      })}
    </nav>
  );
}
