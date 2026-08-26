"use client";

import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import type { Locale } from "@/lib/i18n/config";
import { fetchTopNavItems, getLocalizedLabel } from "@/lib/siteContent/api";
import type { SiteNavItem } from "@/lib/supabase/database.types";

const FALLBACK_NAV: { id: string; labelKey: string; hrefPath: string }[] = [
  { id: "about", labelKey: "nav.about", hrefPath: "/introduction/" },
  { id: "classes", labelKey: "nav.classes", hrefPath: "/classes/" },
  { id: "schedule", labelKey: "nav.schedule", hrefPath: "/schedule/" },
  { id: "gallery", labelKey: "nav.gallery", hrefPath: "/gallery/" },
  { id: "events", labelKey: "nav.events", hrefPath: "/events/" },
  { id: "enrollment", labelKey: "nav.enrollment", hrefPath: "/apply/" },
  { id: "tuition", labelKey: "nav.tuition", hrefPath: "/tuition/" },
  { id: "location", labelKey: "nav.location", hrefPath: "/location/" },
];

export type TopNavLink = {
  id: string;
  label: string;
  hrefPath: string;
};

export function useTopNav(): TopNavLink[] {
  const { language, t } = useLanguage();
  const [items, setItems] = useState<SiteNavItem[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchTopNavItems().then((data) => {
      if (!cancelled) setItems(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return useMemo(() => {
    if (items && items.length > 0) {
      return items
        .filter((item) => item.is_visible)
        .map((item) => ({
          id: item.slug,
          label: getLocalizedLabel(item, language as Locale),
          hrefPath: item.href_path,
        }));
    }

    return FALLBACK_NAV.map(({ id, labelKey, hrefPath }) => ({
      id,
      label: t(labelKey),
      hrefPath,
    }));
  }, [items, language, t]);
}
