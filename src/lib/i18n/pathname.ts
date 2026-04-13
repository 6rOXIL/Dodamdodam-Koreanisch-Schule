import { defaultLocale, isLocale, type Locale } from "./config";

/** pathname에 basePath가 포함된 경우 제거 (usePathname 반환값 기준) */
export function stripBasePath(pathname: string): string {
  const raw = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const base = raw.replace(/\/$/, "");
  if (!base) {
    return pathname.startsWith("/") ? pathname : `/${pathname}`;
  }
  if (pathname === base || pathname === `${base}/`) return "/";
  const prefix = `${base}/`;
  if (pathname.startsWith(prefix)) {
    const rest = pathname.slice(prefix.length);
    return rest.startsWith("/") ? rest : `/${rest}`;
  }
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

/** URL에서 로케일 세그먼트 파싱 */
export function getLocaleFromPathname(pathname: string | null): Locale {
  if (!pathname) return defaultLocale;
  const stripped = stripBasePath(pathname);
  const parts = stripped.split("/").filter(Boolean);
  const first = parts[0];
  if (first && isLocale(first)) return first;
  return defaultLocale;
}

/**
 * 로케일 접두사 제거 후 경로 (항상 trailingSlash 스타일: `/` 또는 `/introduction/greeting/`)
 */
export function getPathWithoutLocalePrefix(pathname: string | null): string {
  if (!pathname) return "/";
  const stripped = stripBasePath(pathname);
  const parts = stripped.split("/").filter(Boolean);
  let i = 0;
  if (parts[i] && isLocale(parts[i])) i += 1;
  const rest = parts.slice(i);
  if (rest.length === 0) return "/";
  return `/${rest.join("/")}/`;
}
