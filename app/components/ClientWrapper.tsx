"use client";

import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import { LanguageProvider } from "../contexts/LanguageContext";
import Navigation from "./Navigation";
import SiteFooter from "./SiteFooter";

function HomeHashScroll() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname !== "/" && pathname !== "") return;
    const hash = window.location.hash?.replace(/^#/, "");
    if (!hash) return;
    const id = document.getElementById(hash);
    if (!id) return;
    const timer = window.setTimeout(() => {
      id.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    return () => window.clearTimeout(timer);
  }, [pathname]);
  return null;
}

export default function ClientWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <LanguageProvider>
      <HomeHashScroll />
      <Navigation />
      <div className="min-h-[100dvh] pt-[calc(4rem+env(safe-area-inset-top,0px))] pb-[env(safe-area-inset-bottom,0px)]">
        {children}
      </div>
      <SiteFooter />
    </LanguageProvider>
  );
}
