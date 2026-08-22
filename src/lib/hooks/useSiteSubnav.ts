"use client";

import { useEffect, useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import {
  fetchSiteNav,
  getLocalizedLabel,
  type SiteCategoryWithSubs,
} from "@/lib/siteContent/api";
import type { SitePageSlug } from "@/lib/supabase/database.types";
import { INTRO_SUBPAGES } from "@/features/introduction/introRoutes";
import { CLASS_SUBPAGES } from "@/features/classes/classRoutes";

export type NavSubLink = {
  segment: string;
  label: string;
  isVisible: boolean;
};

function fallbackLinks(
  categorySlug: SitePageSlug,
  t: (key: string) => string
): NavSubLink[] {
  if (categorySlug === "introduction") {
    return INTRO_SUBPAGES.map(({ segment, labelKey }) => ({
      segment,
      label: t(labelKey),
      isVisible: true,
    }));
  }
  return CLASS_SUBPAGES.map(({ segment, labelKey }) => ({
    segment,
    label: t(labelKey),
    isVisible: true,
  }));
}

export function useSiteSubnav(categorySlug: SitePageSlug): {
  categoryLabel: string | null;
  links: NavSubLink[];
  loading: boolean;
} {
  const { language, t } = useLanguage();
  const [nav, setNav] = useState<SiteCategoryWithSubs | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchSiteNav(categorySlug).then((data) => {
      if (cancelled) return;
      setNav(data);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [categorySlug]);

  const links = useMemo(() => {
    if (!nav) return fallbackLinks(categorySlug, t).filter((l) => l.isVisible);
    return nav.subcategories
      .filter((s) => s.is_visible)
      .map((s) => ({
        segment: s.slug,
        label: getLocalizedLabel(s, language as Locale),
        isVisible: s.is_visible,
      }));
  }, [nav, categorySlug, language, t]);

  const categoryLabel = nav ? getLocalizedLabel(nav, language as Locale) : null;

  return { categoryLabel, links, loading };
}

/** 하위 카테고리 표시명 (DB 우선, 없으면 i18n 폴백) */
export function useSubcategoryLabel(categorySlug: SitePageSlug, segment: string): string {
  const { links } = useSiteSubnav(categorySlug);
  return links.find((l) => l.segment === segment)?.label ?? segment;
}
