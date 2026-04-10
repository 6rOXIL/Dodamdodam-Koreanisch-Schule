"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "../contexts/LanguageContext";
import { INTRO_SUBPAGES } from "./introRoutes";

export default function IntroductionSubnav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const normalize = (p: string) => (p.endsWith("/") ? p : `${p}/`);

  return (
    <nav
      aria-label={t("introduction.sectionNav")}
      className="mb-10 flex flex-wrap justify-center gap-2 border-b border-slate-200 pb-12 sm:pb-14"
    >
      {INTRO_SUBPAGES.map(({ path, segment, labelKey }) => {
        const p = normalize(pathname || "");
        const target = normalize(path);
        const active =
          p === target || p.endsWith(`/introduction/${segment}`) || p.includes(`/introduction/${segment}/`);
        return (
          <Link
            key={path}
            href={path}
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
