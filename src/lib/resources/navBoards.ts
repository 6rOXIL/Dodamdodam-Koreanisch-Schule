import type { SiteNavContentKind, SiteNavItem } from "@/lib/supabase/database.types";

/** 레거시 기본 연동 (시드·폴백용) */
export const NOTICE_CATEGORY_SLUG = "notice";
export const ANNOUNCEMENT_CATEGORY_SLUG = "announcement";

export function isResourcesContentKind(
  kind: string
): kind is `resources:${string}` {
  return kind.startsWith("resources:") && kind.length > "resources:".length;
}

export function parseResourcesContentKind(kind: string): string | null {
  if (!isResourcesContentKind(kind)) return null;
  return kind.slice("resources:".length);
}

export function toResourcesContentKind(categorySlug: string): SiteNavContentKind {
  return `resources:${categorySlug}`;
}

/** 자료실 연동 토글 가능한 메뉴인지 (학교/학급 소개·폼 제외) */
export function canToggleResourceBoard(contentKind: string): boolean {
  if (contentKind.startsWith("form:")) return false;
  if (contentKind === "pages:introduction" || contentKind === "pages:classes") return false;
  return true;
}

export function getResourceBoardHref(
  categorySlug: string,
  language: string,
  navItems: Pick<SiteNavItem, "content_kind" | "href_path">[]
): string | null {
  const linked = navItems.find(
    (item) => parseResourcesContentKind(item.content_kind) === categorySlug
  );
  if (!linked) return null;
  const path = linked.href_path.startsWith("/") ? linked.href_path : `/${linked.href_path}`;
  if (path.startsWith("http")) return path;
  return `/${language}${path}`;
}

/** 메뉴에 자료실로 연동된 분류 슬러그 목록 */
export function getLinkedResourceCategorySlugs(
  navItems: Pick<SiteNavItem, "content_kind">[]
): string[] {
  const slugs = new Set<string>();
  for (const item of navItems) {
    const slug = parseResourcesContentKind(item.content_kind);
    if (slug) slugs.add(slug);
  }
  return [...slugs];
}

export function isLinkedResourceCategory(
  categorySlug: string,
  navItems: Pick<SiteNavItem, "content_kind">[]
): boolean {
  return getLinkedResourceCategorySlugs(navItems).includes(categorySlug);
}

/** 공개 게시판 기본 경로 (전용 페이지가 없을 때) */
export function defaultBoardOpenPath(categorySlug: string): string {
  return `/board/open/?category=${encodeURIComponent(categorySlug)}`;
}

/** href로 연동된 자료실 분류 찾기 */
export function findResourceCategorySlugForHref(
  hrefPath: string,
  navItems: Pick<SiteNavItem, "content_kind" | "href_path" | "slug">[],
  fallbackSlug?: string
): string {
  const normalized = hrefPath.endsWith("/") || hrefPath.includes("?")
    ? hrefPath
    : `${hrefPath}/`;
  const byHref = navItems.find((item) => {
    const itemPath = item.href_path.endsWith("/") || item.href_path.includes("?")
      ? item.href_path
      : `${item.href_path}/`;
    return itemPath === normalized || itemPath.split("?")[0] === normalized.split("?")[0];
  });
  if (byHref) {
    const slug = parseResourcesContentKind(byHref.content_kind);
    if (slug) return slug;
  }
  return fallbackSlug ?? NOTICE_CATEGORY_SLUG;
}
