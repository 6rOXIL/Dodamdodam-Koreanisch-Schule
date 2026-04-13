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

const translationsMap = {
  ko: koTranslations,
  en: enTranslations,
  de: deTranslations,
};

type Language = Locale;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
  children,
  locale,
}: {
  children: ReactNode;
  locale: Locale;
}) {
  const [language, setLanguageState] = useState<Language>(locale);

  useEffect(() => {
    setLanguageState(locale);
  }, [locale]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("language", locale);
    }
  }, [locale]);

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
    },
    [translations]
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
