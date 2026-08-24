"use client";

import { useEffect, useMemo, useState } from "react";
import {
  findResourceCategorySlugForHref,
  getLinkedResourceCategorySlugs,
  getResourceBoardHref,
} from "@/lib/resources/navBoards";
import { fetchTopNavItems } from "@/lib/siteContent/api";
import type { SiteNavItem } from "@/lib/supabase/database.types";

export function useSiteNavItems() {
  const [items, setItems] = useState<SiteNavItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchTopNavItems().then((data) => {
      if (cancelled) return;
      setItems(data);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { items, loading };
}

export function useLinkedResourceCategorySlugs() {
  const { items, loading } = useSiteNavItems();
  const slugs = useMemo(() => getLinkedResourceCategorySlugs(items), [items]);
  return { slugs, items, loading };
}

export function useResourceCategorySlugForPath(hrefPath: string, fallbackSlug: string) {
  const { items, loading } = useSiteNavItems();
  const categorySlug = useMemo(
    () => findResourceCategorySlugForHref(hrefPath, items, fallbackSlug),
    [hrefPath, items, fallbackSlug]
  );
  return { categorySlug, loading, items };
}

export function useCategoryBoardHref(categorySlug: string, language: string) {
  const { items } = useSiteNavItems();
  return useMemo(
    () => getResourceBoardHref(categorySlug, language, items),
    [categorySlug, language, items]
  );
}
