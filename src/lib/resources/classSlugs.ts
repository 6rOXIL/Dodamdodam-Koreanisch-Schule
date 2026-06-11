/** 자료실 학급 분류 (classRoutes와 동일) */
export const RESOURCE_CLASS_SLUGS = ["kindergarten", "elementary", "adults"] as const;

export type ResourceClassSlug = (typeof RESOURCE_CLASS_SLUGS)[number];

/** class_slug가 없는 공통 자료 */
export const RESOURCE_COMMON_CLASS = "__common__" as const;

export type ResourceClassFilter = "all" | ResourceClassSlug | typeof RESOURCE_COMMON_CLASS;

export function isResourceClassSlug(value: string): value is ResourceClassSlug {
  return (RESOURCE_CLASS_SLUGS as readonly string[]).includes(value);
}
