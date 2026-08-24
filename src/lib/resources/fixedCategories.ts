/** @deprecated Import from `@/lib/resources/navBoards` instead. */
export {
  ANNOUNCEMENT_CATEGORY_SLUG,
  NOTICE_CATEGORY_SLUG,
  defaultBoardOpenPath,
  getLinkedResourceCategorySlugs,
  getResourceBoardHref,
  isLinkedResourceCategory,
  isResourcesContentKind,
  parseResourcesContentKind,
  toResourcesContentKind,
} from "@/lib/resources/navBoards";

import {
  ANNOUNCEMENT_CATEGORY_SLUG,
  NOTICE_CATEGORY_SLUG,
} from "@/lib/resources/navBoards";

export const FIXED_RESOURCE_CATEGORY_SLUGS = [
  NOTICE_CATEGORY_SLUG,
  ANNOUNCEMENT_CATEGORY_SLUG,
] as const;

export type FixedResourceCategorySlug = (typeof FIXED_RESOURCE_CATEGORY_SLUGS)[number];

/** 레거시 폴백: 메뉴 조회 전 기본 경로 */
export function getFixedCategoryPagePath(slug: string, language: string): string | null {
  if (slug === NOTICE_CATEGORY_SLUG) return `/${language}/schedule/`;
  if (slug === ANNOUNCEMENT_CATEGORY_SLUG) return `/${language}/events/`;
  return `/${language}/board/open/?category=${encodeURIComponent(slug)}`;
}

export function isFixedResourceCategorySlug(slug: string): slug is FixedResourceCategorySlug {
  return (FIXED_RESOURCE_CATEGORY_SLUGS as readonly string[]).includes(slug);
}
