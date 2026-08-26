/** 입학·수강 신청 — Google Forms */
export const ENROLLMENT_GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSd5xa0qtvVhwSifMHICr79-Q14xHCf4ZD9giZGnmjd-U3afSQ/viewform";

export function isEnrollmentApplyPath(hrefPath: string) {
  return hrefPath === "/apply" || hrefPath === "/apply/";
}

export function isExternalHref(hrefPath: string) {
  return /^https?:\/\//i.test(hrefPath);
}
