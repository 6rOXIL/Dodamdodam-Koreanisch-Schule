"use client";

import { useLanguage } from "@/lib/contexts/LanguageContext";
import { getClassesContent } from "@/lib/data/classes";

export function useClassesContent() {
  const { language } = useLanguage();
  return getClassesContent(language);
}
