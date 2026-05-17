/** Single-page section ids — keep Navigation and scroll spy in sync */
export const SECTION_IDS = [
  "home",
  "about",
  "classes",
  "vision",
  "schedule",
  "gallery",
  "events",
  "location",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];
