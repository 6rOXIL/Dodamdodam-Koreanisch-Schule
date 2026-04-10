/** 학교 소개 하위 페이지 (trailingSlash 대응) */
export const INTRO_SUBPAGES = [
  { path: "/introduction/greeting/", segment: "greeting", labelKey: "introduction.links.greeting" },
  { path: "/introduction/summary/", segment: "summary", labelKey: "introduction.links.summary" },
  { path: "/introduction/calendar/", segment: "calendar", labelKey: "introduction.links.calendar" },
  { path: "/introduction/directions/", segment: "directions", labelKey: "introduction.links.map" },
] as const;

export type IntroSegment = (typeof INTRO_SUBPAGES)[number]["segment"];
