"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from "react";
import koTranslations from "../locales/ko.json";
import enTranslations from "../locales/en.json";
import deTranslations from "../locales/de.json";

const translationsMap = {
  ko: koTranslations,
  en: enTranslations,
  de: deTranslations,
};

type Language = "ko" | "en" | "de";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function getDefaultLanguage(): Language {
  if (typeof window === "undefined") {
    return "en"; // 서버 사이드에서는 영어 기본값
  }

  // 1. localStorage에 저장된 언어가 있으면 우선 사용
  const savedLanguage = localStorage.getItem("language") as Language;
  if (savedLanguage && ["ko", "en", "de"].includes(savedLanguage)) {
    return savedLanguage;
  }

  // 2. 브라우저 언어 감지
  const browserLang = navigator.language.split("-")[0].toLowerCase();
  
  // 3. 지원하는 언어인지 확인
  if (browserLang === "ko" || browserLang === "en" || browserLang === "de") {
    return browserLang as Language;
  }

  // 4. 기본값은 영어
  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en"); // 초기값은 영어
  const [isInitialized, setIsInitialized] = useState(false);

  // 초기 언어 설정
  useEffect(() => {
    if (typeof window !== "undefined" && !isInitialized) {
      const defaultLang = getDefaultLanguage();
      setLanguageState(defaultLang);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // 현재 언어에 맞는 번역 가져오기
  const translations = useMemo(() => {
    return translationsMap[language] || translationsMap.en;
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState((currentLang) => {
      if (currentLang === lang) return currentLang; // 같은 언어면 변경하지 않음
      if (typeof window !== "undefined") {
        localStorage.setItem("language", lang);
      }
      return lang;
    });
  }, []);

  const t = useCallback((key: string): string => {
    const keys = key.split(".");
    let value: any = translations;
    
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }
    
    return typeof value === "string" ? value : key;
  }, [translations]);

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
