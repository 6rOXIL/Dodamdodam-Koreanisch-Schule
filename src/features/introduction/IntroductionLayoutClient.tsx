"use client";

import type { ReactNode } from "react";
import IntroductionSubnav from "./IntroductionSubnav";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function IntroductionLayoutClient({ children }: { children: ReactNode }) {
  const { t } = useLanguage();

  return (
    <main className="bg-surface text-ink-900">
      <div className="mx-auto max-w-3xl px-4 pb-24 pt-12 sm:px-6 sm:pt-14 md:max-w-4xl md:px-8">
        <header className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-secondary-600/80">
            {t("introduction.label")}
          </p>
          <h1 className="mt-3 font-sans text-3xl font-bold text-ink-900 sm:text-4xl">
            {t("introduction.title")}
          </h1>
        </header>

        <IntroductionSubnav />

        {children}
      </div>
    </main>
  );
}
