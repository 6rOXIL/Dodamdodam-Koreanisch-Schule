"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { getResourceCategoryLabel } from "@/lib/resources/categoryLabel";
import {
  getFixedCategoryPagePath,
  isFixedResourceCategorySlug,
} from "@/lib/resources/fixedCategories";
import { sortResourceCategories } from "@/lib/resources/sortTaxonomy";
import type { ResourceCategory } from "@/lib/supabase/database.types";

type ResourceCategoryNavProps = {
  categories: ResourceCategory[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  categoryCounts: Map<string, number>;
  totalCount: number;
  language: string;
  isAdmin: boolean;
  onManage: () => void;
};

export default function ResourceCategoryNav({
  categories,
  selectedCategoryId,
  onSelectCategory,
  categoryCounts,
  totalCount,
  language,
  isAdmin,
  onManage,
}: ResourceCategoryNavProps) {
  const { t } = useLanguage();
  const sortedCategories = sortResourceCategories(categories);

  if (sortedCategories.length === 0 && !isAdmin) return null;

  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
          {t("resources.filterByCategory")}
        </p>
        {isAdmin && (
          <button
            type="button"
            onClick={onManage}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-ink-500 transition hover:bg-ink-100 hover:text-ink-800"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {t("resources.taxonomyManage")}
          </button>
        )}
      </div>
      <nav className="flex flex-wrap gap-2" aria-label={t("resources.filterByCategory")}>
        <button
          type="button"
          onClick={() => onSelectCategory(null)}
          className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition sm:text-sm ${
            selectedCategoryId === null
              ? "bg-brand-600 text-on-inverse shadow-sm"
              : "bg-surface text-ink-600 ring-1 ring-inset ring-ink-200 hover:bg-ink-50"
          }`}
        >
          {t("resources.allCategories")}
          <span className="ml-1.5 opacity-70">({totalCount})</span>
        </button>
        {sortedCategories.map((category) => {
          const count = categoryCounts.get(category.id) ?? 0;
          const active = selectedCategoryId === category.id;
          const fixed = isFixedResourceCategorySlug(category.slug);
          const pagePath = getFixedCategoryPagePath(category.slug, language);

          return (
            <span key={category.id} className="inline-flex items-center">
              <button
                type="button"
                onClick={() => onSelectCategory(category.id)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition sm:text-sm ${
                  active
                    ? "bg-brand-600 text-on-inverse shadow-sm"
                    : "bg-surface text-ink-600 ring-1 ring-inset ring-ink-200 hover:bg-ink-50"
                } ${fixed && pagePath ? "rounded-r-none" : ""}`}
              >
                {getResourceCategoryLabel(category, t)}
                <span className="ml-1.5 opacity-70">({count})</span>
              </button>
              {fixed && pagePath && (
                <Link
                  href={pagePath}
                  className={`inline-flex items-center rounded-full rounded-l-none px-2 py-1.5 ring-1 ring-inset transition sm:text-sm ${
                    active
                      ? "bg-brand-700 text-on-inverse ring-brand-700 hover:bg-brand-800"
                      : "bg-surface text-ink-400 ring-ink-200 hover:bg-ink-50 hover:text-brand-700"
                  }`}
                  aria-label={t("resources.categoryPageLink")}
                  title={t("resources.categoryPageLink")}
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </Link>
              )}
            </span>
          );
        })}
      </nav>
    </div>
  );
}
