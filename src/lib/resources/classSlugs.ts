/** class_slug가 없는 공통 자료 */
export const RESOURCE_COMMON_CLASS = "__common__" as const;

export type ResourceClassFilter = "all" | typeof RESOURCE_COMMON_CLASS | string;
