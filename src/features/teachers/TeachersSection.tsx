"use client";

import { useLanguage } from "@/lib/contexts/LanguageContext";
import { getHeadingTag, type HeadingLevel } from "@/features/shared/sectionHeading";

export function TeachersSection({
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
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-800/80">
            {t("teachers.label")}
          </p>
          <HeadingTag className="mt-3 font-serif text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">
            {t("teachers.title")}
          </HeadingTag>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">{t("teachers.lead")}</p>
        </div>
        <div className="mt-12 flex justify-center">
          <div className="max-w-md rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 px-5 py-12 text-center text-sm text-slate-500 sm:px-8 sm:py-14 sm:text-base">
            {t("teachers.placeholder")}
          </div>
        </div>
      </div>
    </section>
  );
}
