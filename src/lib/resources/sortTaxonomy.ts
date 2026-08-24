import type { ResourceCategory, ResourceClass } from "@/lib/supabase/database.types";

export function compareResourceCategories(a: ResourceCategory, b: ResourceCategory) {
  if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
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
