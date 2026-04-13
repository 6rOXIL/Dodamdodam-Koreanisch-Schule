"use client";

import { greetingParagraphs } from "@/lib/data/introductionContent";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function GreetingSection() {
  const { t } = useLanguage();

  return (
    <section className="space-y-4" aria-labelledby="page-heading">
      <h2
        id="page-heading"
        className="border-b border-amber-200/80 pb-2 font-serif text-2xl font-bold text-slate-900"
      >
        {t("introduction.links.greeting")}
      </h2>
      <div className="space-y-4 text-[15px] leading-relaxed text-slate-700 sm:text-base">
        {greetingParagraphs.map((p, i) => (
          <p key={i} className="whitespace-pre-line">
            {p}
          </p>
        ))}
      </div>
    </section>
  );
}
