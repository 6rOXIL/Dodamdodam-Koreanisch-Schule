"use client";

import { useRouter, usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import { getLocaleFromPathname, getPathWithoutLocalePrefix } from "@/lib/i18n/pathname";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = getLocaleFromPathname(pathname);
  const pathRest = getPathWithoutLocalePrefix(pathname);

  const languages: { code: Locale; short: string; name: string }[] = [
    { code: "ko", short: "KO", name: "한국어" },
    { code: "en", short: "EN", name: "English" },
    { code: "de", short: "DE", name: "Deutsch" },
  ];

  const switchTo = (code: Locale) => {
    const suffix = pathRest === "/" ? "/" : pathRest;
    router.push(`/${code}${suffix}`);
  };

  return (
    <div className="flex gap-0.5 rounded-lg border border-ink-200 bg-surface p-0.5 shadow-sm">
      {languages.map((lang) => (
        <button
          key={lang.code}
          type="button"
          onClick={() => switchTo(lang.code)}
          className={`min-h-9 min-w-9 rounded-md px-1.5 text-xs font-medium transition-colors sm:min-h-0 sm:min-w-0 sm:px-3 sm:text-sm ${
            currentLocale === lang.code
              ? "bg-brand-600 text-surface"
              : "text-ink-600 hover:bg-ink-100"
          }`}
          aria-pressed={currentLocale === lang.code}
        >
          <span className="sm:hidden">{lang.short}</span>
          <span className="hidden sm:inline">{lang.name}</span>
        </button>
      ))}
    </div>
  );
}
