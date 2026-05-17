"use client";

import { useLanguage } from "@/lib/contexts/LanguageContext";
import { getIntroductionContent } from "@/lib/data/introduction";

export function useIntroductionContent() {
  const { language } = useLanguage();
  return getIntroductionContent(language);
}
