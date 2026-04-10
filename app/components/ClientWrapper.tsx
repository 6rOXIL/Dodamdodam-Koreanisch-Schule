"use client";

import { ReactNode } from "react";
import { LanguageProvider } from "../contexts/LanguageContext";
import Navigation from "./Navigation";
import SiteFooter from "./SiteFooter";

export default function ClientWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <LanguageProvider>
      <Navigation />
      <div className="min-h-[100dvh] pt-[calc(4rem+env(safe-area-inset-top,0px))] pb-[env(safe-area-inset-bottom,0px)]">
        {children}
      </div>
      <SiteFooter />
    </LanguageProvider>
  );
}
