"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getLocaleFromPathname, getPathWithoutLocalePrefix } from "@/lib/i18n/pathname";

export default function IntroIndexRedirect() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const pathRest = getPathWithoutLocalePrefix(pathname);
    if (pathRest !== "/introduction/") return;
    const loc = getLocaleFromPathname(pathname);
    router.replace(`/${loc}/introduction/greeting/`);
  }, [router, pathname]);

  return null;
}
