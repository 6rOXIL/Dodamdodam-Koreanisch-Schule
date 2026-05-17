"use client";

import { useIntroductionContent } from "@/lib/hooks/useIntroductionContent";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function GreetingSection() {
  const { t } = useLanguage();
  const { greeting } = useIntroductionContent();

  return (
    <section className="space-y-4" aria-labelledby="page-heading">
      <h2
        id="page-heading"
        className="border-b border-amber-200/80 pb-2 font-sans text-2xl font-bold text-slate-900"
      >
        {t("introduction.links.greeting")}
      </h2>
      <div className="space-y-4 text-[15px] leading-relaxed text-slate-700 sm:text-base">
        {greeting.paragraphs.map((p, i) => (
          <p key={i} className="whitespace-pre-line">
            {p}
          </p>
        ))}
      </div>
    </section>
  );
}
