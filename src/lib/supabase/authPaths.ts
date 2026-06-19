import { defaultLocale } from "@/lib/i18n/config";
import { stripBasePath } from "@/lib/i18n/pathname";

/** Next.js router path (basePath omitted; trailing slash). */
export function resolveAuthNextPath(next: string | null): string {
  const fallback = `/${defaultLocale}/resources/`;
  if (!next) return fallback;

  let path = next.startsWith("/") ? next : `/${next}`;
  path = stripBasePath(path);
  if (!path.startsWith("/")) path = `/${path}`;
  if (!path.endsWith("/")) path = `${path}/`;
  return path;
}

export function authCallbackUrl(nextPath: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const next = encodeURIComponent(nextPath.startsWith("/") ? nextPath : `/${nextPath}`);
  return `${window.location.origin}${basePath}/auth/callback/?next=${next}`;
}

/** 비밀번호 재설정 이메일 redirectTo — reset-password 페이지에서 토큰을 직접 처리 */
export function passwordResetCallbackUrl(locale: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${window.location.origin}${basePath}/${locale}/reset-password/`;
}
