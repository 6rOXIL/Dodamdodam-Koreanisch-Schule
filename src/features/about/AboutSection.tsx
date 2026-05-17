"use client";

import { useLanguage } from "@/lib/contexts/LanguageContext";
import { getHeadingTag, type HeadingLevel } from "@/features/shared/sectionHeading";

export function AboutSection({
  id,
  headingLevel = 2,
  className = "border-b border-slate-100 bg-white py-14 sm:py-20 md:py-28",
}: {
  id?: string;
  headingLevel?: HeadingLevel;
  className?: string;
}) {
  const { t } = useLanguage();
  const HeadingTag = getHeadingTag(headingLevel);

  return (
    <section id={id} className={className}>
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 md:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-800/80">
          {t("about.label")}
        </p>
        <HeadingTag className="mt-3 font-sans text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">
          {t("about.title")}
        </HeadingTag>
        <p className="mt-6 text-[15px] leading-relaxed text-slate-600 sm:mt-8 sm:text-base md:text-lg">
          {t("about.body")}
        </p>
      </div>
    </section>
  );
}
