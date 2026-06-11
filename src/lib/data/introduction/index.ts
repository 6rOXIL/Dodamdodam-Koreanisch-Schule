import type { Locale } from "@/lib/i18n/config";
import { introductionDe } from "./de";
import { introductionEn } from "./en";
import { introductionKo } from "./ko";
import type { IntroductionContent } from "./types";

export type { CalendarRow, IntroductionContent } from "./types";

const introductionByLocale: Record<Locale, IntroductionContent> = {
  ko: introductionKo,
  en: introductionEn,
  de: introductionDe,
};

export function getIntroductionContent(locale: Locale): IntroductionContent {
  return introductionByLocale[locale] ?? introductionKo;
}

export { mapSearchUrls as mapUrls } from "@/lib/data/locations";
