"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { getIntroductionContent } from "@/lib/data/introduction";
import type { IntroductionContent } from "@/lib/data/introduction";
import { fetchPageContent } from "@/lib/siteContent/api";

export function useIntroductionContent(): IntroductionContent {
  const { language } = useLanguage();
  const [content, setContent] = useState<IntroductionContent>(() => getIntroductionContent(language));

  useEffect(() => {
    const fallback = getIntroductionContent(language);
    setContent(fallback);

    let cancelled = false;
    fetchPageContent<IntroductionContent>("introduction", language).then((remote) => {
      if (!cancelled && remote) setContent(remote);
    });

    return () => {
      cancelled = true;
    };
  }, [language]);

  return content;
}
