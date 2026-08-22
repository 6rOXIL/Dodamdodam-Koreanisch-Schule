"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import koTranslations from "@/lib/locales/ko.json";
import enTranslations from "@/lib/locales/en.json";
import deTranslations from "@/lib/locales/de.json";
import type { Locale } from "@/lib/i18n/config";
import { createClient } from "@/lib/supabase/client";
import type { CopyPageSlug } from "@/lib/siteContent/copyFields";
import { COPY_FIELDS_BY_PAGE } from "@/lib/siteContent/copyFields";

const translationsMap = {
  ko: koTranslations,
  en: enTranslations,
  de: deTranslations,
};

const COPY_PAGE_SLUGS = Object.keys(COPY_FIELDS_BY_PAGE) as CopyPageSlug[];

type Language = Locale;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function lookupStatic(translations: unknown, key: string): string {
  const keys = key.split(".");
  let value: unknown = translations;
  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }
  return typeof value === "string" ? value : key;
}

export function LanguageProvider({
  children,
  locale,
}: {
  children: ReactNode;
  locale: Locale;
}) {
  const [language, setLanguageState] = useState<Language>(locale);
  const [overlays, setOverlays] = useState<Record<string, string>>({});

  useEffect(() => {
    setLanguageState(locale);
  }, [locale]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("language", locale);
    }
  }, [locale]);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    supabase
      .from("site_page_contents")
      .select("page_slug, payload")
      .eq("locale", language)
      .in("page_slug", COPY_PAGE_SLUGS)
      .then(({ data }) => {
        if (cancelled || !data) return;
        const next: Record<string, string> = {};
        for (const row of data) {
          const payload = row.payload as Record<string, unknown> | null;
          if (!payload) continue;
          for (const [path, value] of Object.entries(payload)) {
            if (typeof value === "string" && value.trim()) {
              next[path] = value;
            }
          }
        }
        setOverlays(next);
      });

    return () => {
      cancelled = true;
    };
  }, [language]);

  const translations = useMemo(() => {
    return translationsMap[language] ?? translationsMap.en;
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState((current) => (current === lang ? current : lang));
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang);
    }
  }, []);

  const t = useCallback(
    (key: string): string => {
      if (overlays[key]) return overlays[key];
      return lookupStatic(translations, key);
    },
    [translations, overlays]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
