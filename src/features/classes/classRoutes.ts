/** 학급 소개 하위 페이지 (trailingSlash 대응) */
export const CLASS_SUBPAGES = [
  { segment: "kindergarten", labelKey: "classes.links.kindergarten" },
  { segment: "elementary", labelKey: "classes.links.elementary" },
  { segment: "adults", labelKey: "classes.links.adults" },
] as const;

export type ClassSegment = (typeof CLASS_SUBPAGES)[number]["segment"];
