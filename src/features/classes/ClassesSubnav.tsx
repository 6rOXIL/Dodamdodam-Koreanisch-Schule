"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { useSiteSubnav } from "@/lib/hooks/useSiteSubnav";
import { getPathWithoutLocalePrefix } from "@/lib/i18n/pathname";

export default function ClassesSubnav() {
  const pathname = usePathname();
  const { t, language } = useLanguage();
  const { links } = useSiteSubnav("classes");
  const pathRest = getPathWithoutLocalePrefix(pathname);

  return (
    <nav
      className="mb-8 flex flex-wrap justify-center gap-2"
      aria-label={t("classes.sectionNav")}
    >
      {links.map(({ segment, label }) => {
        const target = `/classes/${segment}/`;
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
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
