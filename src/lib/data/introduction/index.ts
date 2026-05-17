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

export const mapUrls = {
  pangea:
    "https://www.google.com/maps/search/?api=1&query=Trautenaustra%C3%9Fe+5,+10717+Berlin",
  ruppin:
    "https://www.google.com/maps/search/?api=1&query=Offenbacher+Str.+5A,+14197+Berlin",
} as const;
