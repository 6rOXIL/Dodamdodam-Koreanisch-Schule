"use client";

import { useLanguage } from "../contexts/LanguageContext";

type Language = "ko" | "en" | "de";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; short: string; name: string }[] = [
    { code: "ko", short: "KO", name: "한국어" },
    { code: "en", short: "EN", name: "English" },
    { code: "de", short: "DE", name: "Deutsch" },
  ];

  return (
    <div className="flex gap-0.5 rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm">
      {languages.map((lang) => (
        <button
          key={lang.code}
          type="button"
          onClick={() => setLanguage(lang.code)}
          className={`min-h-9 min-w-9 rounded-md px-1.5 text-xs font-medium transition-colors sm:min-h-0 sm:min-w-0 sm:px-3 sm:text-sm ${
            language === lang.code
              ? "bg-amber-600 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
          aria-pressed={language === lang.code}
        >
          <span className="sm:hidden">{lang.short}</span>
          <span className="hidden sm:inline">{lang.name}</span>
        </button>
      ))}
    </div>
  );
}
