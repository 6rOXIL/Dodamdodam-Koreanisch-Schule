"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getLocaleFromPathname, getPathWithoutLocalePrefix } from "@/lib/i18n/pathname";

export default function ClassesIndexRedirect() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const pathRest = getPathWithoutLocalePrefix(pathname);
    if (pathRest !== "/classes/") return;
    const loc = getLocaleFromPathname(pathname);
    router.replace(`/${loc}/classes/kindergarten/`);
  }, [router, pathname]);

  return null;
}
