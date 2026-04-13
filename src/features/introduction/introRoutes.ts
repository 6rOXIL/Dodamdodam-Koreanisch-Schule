/** 학교 소개 하위 페이지 (trailingSlash 대응) */
export const INTRO_SUBPAGES = [
  { segment: "greeting", labelKey: "introduction.links.greeting" },
  { segment: "summary", labelKey: "introduction.links.summary" },
  { segment: "calendar", labelKey: "introduction.links.calendar" },
  { segment: "directions", labelKey: "introduction.links.map" },
] as const;

export type IntroSegment = (typeof INTRO_SUBPAGES)[number]["segment"];
