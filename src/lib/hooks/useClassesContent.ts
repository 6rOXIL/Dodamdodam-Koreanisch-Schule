"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { getClassesContent } from "@/lib/data/classes";
import type { ClassesContent } from "@/lib/data/classes";
import { fetchPageContent } from "@/lib/siteContent/api";

export function useClassesContent(): ClassesContent {
  const { language } = useLanguage();
  const [content, setContent] = useState<ClassesContent>(() => getClassesContent(language));

  useEffect(() => {
    const fallback = getClassesContent(language);
    setContent(fallback);

    let cancelled = false;
    fetchPageContent<ClassesContent>("classes", language).then((remote) => {
      if (!cancelled && remote) setContent(remote);
    });

    return () => {
      cancelled = true;
    };
  }, [language]);

  return content;
}
