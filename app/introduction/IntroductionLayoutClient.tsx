"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import IntroductionSubnav from "./IntroductionSubnav";
import { useLanguage } from "../contexts/LanguageContext";

export default function IntroductionLayoutClient({ children }: { children: ReactNode }) {
  const { t } = useLanguage();

  return (
    <main className="bg-white text-slate-900">
      <div className="mx-auto max-w-3xl px-4 pb-24 pt-12 sm:px-6 sm:pt-14 md:max-w-4xl md:px-8">

        <header className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-800/80">
            {t("introduction.label")}
          </p>
          <h1 className="mt-3 font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
            {t("introduction.title")}
          </h1>
          <p className="mx-auto mt-4 mb-8 max-w-xl text-slate-600">
            {/* {t("introduction.lead")} */}
            </p>
        </header>

        <IntroductionSubnav />

        {children}
      </div>
    </main>
  );
}
