import type { Locale } from "@/lib/i18n/config";
import { classesDe } from "./de";
import { classesEn } from "./en";
import { classesKo } from "./ko";
import type { ClassesContent } from "./types";

export type {
  AdultClassTier,
  ClassLevelBlock,
  ClassesContent,
  ClassScheduleRow,
} from "./types";

const classesByLocale: Record<Locale, ClassesContent> = {
  ko: classesKo,
  en: classesEn,
  de: classesDe,
};

export function getClassesContent(locale: Locale): ClassesContent {
  return classesByLocale[locale] ?? classesKo;
}
