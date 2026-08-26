import type { Locale } from "@/lib/i18n/config";
import ko from "@/lib/locales/ko.json";
import en from "@/lib/locales/en.json";
import de from "@/lib/locales/de.json";

export type CopyPageSlug = "home" | "gallery" | "location" | "schedule" | "events" | "tuition";

export type CopyField = {
  path: string;
  label: string;
  multiline?: boolean;
};

/** 어드민에서 편집하는 섹션별 카피 필드 */
export const COPY_FIELDS_BY_PAGE: Record<CopyPageSlug, CopyField[]> = {
  home: [
    { path: "hero.welcome", label: "히어로 · welcome" },
    { path: "hero.title", label: "히어로 · 제목" },
    { path: "hero.subtitle", label: "히어로 · 부제" },
    { path: "hero.cta", label: "히어로 · CTA" },
    { path: "about.title", label: "소개 · 제목" },
    { path: "about.body", label: "소개 · 본문", multiline: true },
    { path: "about.consultCta", label: "소개 · 입학상담문의 버튼" },
    { path: "vision.title", label: "비전 · 제목" },
    { path: "vision.lead", label: "비전 · 리드", multiline: true },
    { path: "vision.card1Title", label: "비전 카드1 · 제목" },
    { path: "vision.card1Subtitle", label: "비전 카드1 · 부제" },
    { path: "vision.card1Body", label: "비전 카드1 · 본문", multiline: true },
    { path: "vision.card2Title", label: "비전 카드2 · 제목" },
    { path: "vision.card2Subtitle", label: "비전 카드2 · 부제" },
    { path: "vision.card2Body", label: "비전 카드2 · 본문", multiline: true },
    { path: "vision.card3Title", label: "비전 카드3 · 제목" },
    { path: "vision.card3Subtitle", label: "비전 카드3 · 부제" },
    { path: "vision.card3Body", label: "비전 카드3 · 본문", multiline: true },
    { path: "enrollment.title", label: "입학안내 · 제목" },
    { path: "enrollment.lead", label: "입학안내 · 본문", multiline: true },
    { path: "enrollment.cta", label: "입학안내 · 신청 버튼" },
  ],
  gallery: [
    { path: "gallery.title", label: "제목" },
    { path: "gallery.lead", label: "리드", multiline: true },
    { path: "gallery.legacyNote", label: "안내 문구", multiline: true },
  ],
  location: [
    { path: "location.title", label: "제목" },
    { path: "location.addressLabel1", label: "주소1 라벨" },
    { path: "location.address1", label: "주소1", multiline: true },
    { path: "location.addressLabel2", label: "주소2 라벨" },
    { path: "location.address2", label: "주소2", multiline: true },
    { path: "location.addressLabel3", label: "주소3 라벨" },
    { path: "location.address3", label: "주소3", multiline: true },
    { path: "location.contactLabel", label: "연락처 라벨" },
    { path: "location.phone", label: "전화" },
    { path: "location.email", label: "이메일" },
  ],
  schedule: [
    { path: "schedule.title", label: "제목" },
    { path: "schedule.lead", label: "리드", multiline: true },
  ],
  events: [
    { path: "events.title", label: "제목" },
    { path: "events.lead", label: "리드", multiline: true },
  ],
  tuition: [
    { path: "tuition.title", label: "제목" },
    { path: "tuition.lead", label: "리드", multiline: true },
    { path: "tuition.kindergartenLabel", label: "유치반 · 구분" },
    { path: "tuition.kindergartenFee", label: "유치반 · 수업료" },
    { path: "tuition.elementaryLabel", label: "초등/중등 · 구분" },
    { path: "tuition.elementaryFee", label: "초등/중등 · 수업료" },
    { path: "tuition.adultsLabel", label: "성인반 · 구분" },
    { path: "tuition.adultsFee", label: "성인반 · 수업료" },
    { path: "tuition.policyTitle", label: "납부 안내 · 제목" },
    { path: "tuition.policyBody", label: "납부 안내 · 본문", multiline: true },
    { path: "tuition.trialTitle", label: "참관료 · 제목" },
    { path: "tuition.trialBody", label: "참관료 · 본문", multiline: true },
    { path: "tuition.admissionTitle", label: "입학금 · 제목" },
    { path: "tuition.admissionBody", label: "입학금 · 본문", multiline: true },
    { path: "tuition.paymentNote", label: "결제 불가 안내", multiline: true },
    { path: "tuition.bankName", label: "은행" },
    { path: "tuition.iban", label: "IBAN" },
    { path: "tuition.bic", label: "BIC" },
    { path: "tuition.accountHolder", label: "계좌주" },
    { path: "tuition.transferPurpose", label: "송금용도" },
  ],
};

const localeFiles: Record<Locale, Record<string, unknown>> = {
  ko: ko as Record<string, unknown>,
  en: en as Record<string, unknown>,
  de: de as Record<string, unknown>,
};

function getByPath(obj: unknown, path: string): string {
  const parts = path.split(".");
  let cur: unknown = obj;
  for (const p of parts) {
    if (!cur || typeof cur !== "object" || !(p in cur)) return "";
    cur = (cur as Record<string, unknown>)[p];
  }
  return typeof cur === "string" ? cur : "";
}

export function getDefaultCopyPayload(pageSlug: CopyPageSlug, locale: Locale): Record<string, string> {
  const source = localeFiles[locale] ?? localeFiles.ko;
  const fields = COPY_FIELDS_BY_PAGE[pageSlug];
  const payload: Record<string, string> = {};
  for (const field of fields) {
    payload[field.path] = getByPath(source, field.path);
  }
  return payload;
}

export function isCopyPageSlug(slug: string): slug is CopyPageSlug {
  return slug in COPY_FIELDS_BY_PAGE;
}

/** nav slug → page content slug */
export function navSlugToPageSlug(navSlug: string, contentKind: string): string {
  if (contentKind === "pages:introduction" || navSlug === "about") return "introduction";
  if (contentKind === "pages:classes" || navSlug === "classes") return "classes";
  if (navSlug === "home") return "home";
  if (navSlug === "gallery") return "gallery";
  if (navSlug === "location") return "location";
  if (navSlug === "tuition") return "tuition";
  if (navSlug === "schedule" || contentKind === "resources:notice") return "schedule";
  if (navSlug === "events" || contentKind === "resources:announcement") return "events";
  if (contentKind.startsWith("resources:")) return navSlug;
  return navSlug;
}
