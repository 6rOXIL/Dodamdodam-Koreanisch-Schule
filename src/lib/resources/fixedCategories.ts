/** 수업 안내 페이지(`/schedule`)와 연결된 고정 분류 */
export const NOTICE_CATEGORY_SLUG = "notice";

/** 학교 소식 페이지(`/events`)와 연결된 고정 분류 */
export const ANNOUNCEMENT_CATEGORY_SLUG = "announcement";

export const FIXED_RESOURCE_CATEGORY_SLUGS = [
  NOTICE_CATEGORY_SLUG,
  ANNOUNCEMENT_CATEGORY_SLUG,
] as const;

export type FixedResourceCategorySlug = (typeof FIXED_RESOURCE_CATEGORY_SLUGS)[number];

export function isFixedResourceCategorySlug(slug: string): slug is FixedResourceCategorySlug {
  return (FIXED_RESOURCE_CATEGORY_SLUGS as readonly string[]).includes(slug);
}

export function getFixedCategoryPagePath(slug: string, language: string): string | null {
  if (slug === NOTICE_CATEGORY_SLUG) return `/${language}/schedule/`;
  if (slug === ANNOUNCEMENT_CATEGORY_SLUG) return `/${language}/events/`;
  return null;
}
