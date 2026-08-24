"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import NoticePostTable from "@/components/NoticePostTable";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import type { Locale } from "@/lib/i18n/config";
import { useSiteNavItems } from "@/lib/hooks/useResourceBoards";
import { parseResourcesContentKind } from "@/lib/resources/navBoards";
import { getLocalizedLabel } from "@/lib/siteContent/api";
import { createClient } from "@/lib/supabase/client";
import type { ResourceCategory } from "@/lib/supabase/database.types";

function BoardByQuery() {
  const searchParams = useSearchParams();
  const { t, language } = useLanguage();
  const categorySlug = searchParams.get("category") || "";
  const { items } = useSiteNavItems();
  const [category, setCategory] = useState<ResourceCategory | null>(null);

  const navItem = useMemo(
    () =>
      items.find((item) => parseResourcesContentKind(item.content_kind) === categorySlug) ?? null,
    [items, categorySlug]
  );

  useEffect(() => {
    if (!categorySlug) {
      setCategory(null);
      return;
    }
    let cancelled = false;
    createClient()
      .from("resource_categories")
      .select("*")
      .eq("slug", categorySlug)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setCategory((data as ResourceCategory) ?? null);
      });
    return () => {
      cancelled = true;
    };
  }, [categorySlug]);

  const title =
    (navItem ? getLocalizedLabel(navItem, language as Locale) : null) ||
    category?.name_ko ||
    categorySlug ||
    t("board.fallbackTitle");

  if (!categorySlug) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-ink-900">{t("board.missingCategory")}</h1>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20 md:px-8">
      <div className="text-center">
        <h1 className="font-sans text-2xl font-bold text-ink-900 sm:text-3xl md:text-4xl">
          {title}
        </h1>
        <p className="mt-4 text-ink-600">{t("board.lead")}</p>
      </div>

      <NoticePostTable
        categorySlug={categorySlug}
        colDate={t("legacy.colDate")}
        colTitle={t("legacy.colTitle")}
        emptyMessage={t("board.empty")}
        downloadErrorMessage={t("resources.downloadError")}
      />
    </main>
  );
}

export default function BoardOpenPage() {
  const { t } = useLanguage();
  return (
    <Suspense
      fallback={
        <main className="px-4 py-20 text-center text-ink-500">{t("auth.loading")}</main>
      }
    >
      <BoardByQuery />
    </Suspense>
  );
}
