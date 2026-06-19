import type { ResourceCategory, ResourceClass } from "@/lib/supabase/database.types";
import {
  ANNOUNCEMENT_CATEGORY_SLUG,
  NOTICE_CATEGORY_SLUG,
} from "@/lib/resources/fixedCategories";

/** 학교소식(1) → 수업안내(2) → 나머지 sort_order */
const FIXED_CATEGORY_SORT: Record<string, number> = {
  [ANNOUNCEMENT_CATEGORY_SLUG]: 1,
  [NOTICE_CATEGORY_SLUG]: 2,
};

export function compareResourceCategories(a: ResourceCategory, b: ResourceCategory) {
  const aOrder = FIXED_CATEGORY_SORT[a.slug] ?? a.sort_order + 100;
  const bOrder = FIXED_CATEGORY_SORT[b.slug] ?? b.sort_order + 100;
  if (aOrder !== bOrder) return aOrder - bOrder;
  return a.name_ko.localeCompare(b.name_ko, "ko");
}

export function sortResourceCategories(categories: ResourceCategory[]) {
  return [...categories].sort(compareResourceCategories);
}

export function sortResourceClasses(classes: ResourceClass[]) {
  return [...classes].sort((a, b) => a.sort_order - b.sort_order || a.name_ko.localeCompare(b.name_ko, "ko"));
}

export function nextTaxonomySortOrder<T extends { sort_order: number }>(items: T[]) {
  if (items.length === 0) return 1;
  return Math.max(...items.map((item) => item.sort_order)) + 1;
}
