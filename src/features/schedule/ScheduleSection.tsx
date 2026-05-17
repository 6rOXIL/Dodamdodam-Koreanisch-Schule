"use client";

import LegacyPostTable from "@/components/LegacyPostTable";
import { LEGACY_BOARDS, LEGACY_CURRICULUM } from "@/lib/data/legacySite";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { getHeadingTag, type HeadingLevel } from "@/features/shared/sectionHeading";

export function ScheduleSection({
  id,
  headingLevel = 2,
  className = "border-t border-slate-100 bg-white py-14 sm:py-20 md:py-28",
}: {
  id?: string;
  headingLevel?: HeadingLevel;
  className?: string;
}) {
  const { t } = useLanguage();
  const HeadingTag = getHeadingTag(headingLevel);

  return (
    <section id={id} className={className}>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-800/80">
            {t("schedule.label")}
          </p>
          <HeadingTag className="mt-3 font-serif text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">
            {t("schedule.title")}
          </HeadingTag>
          <p className="mt-4 text-slate-600">{t("schedule.lead")}</p>
        </div>

        <div className="mt-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-800/80">
            {t("schedule.curriculumLabel")}
          </p>
          <h3 className="mt-2 font-serif text-xl font-bold text-slate-900 sm:text-2xl">
            {t("schedule.curriculumTitle")}
          </h3>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
            {t("schedule.curriculumLead")}
          </p>
        </div>
        <LegacyPostTable
          posts={LEGACY_CURRICULUM}
          colDate={t("legacy.colDate")}
          colTitle={t("legacy.colTitle")}
          externalHint={t("legacy.externalHint")}
        />
        <p className="mt-6 text-center">
          <a
            href={LEGACY_BOARDS.curriculumList}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-amber-900 underline-offset-2 hover:underline"
          >
            {t("schedule.curriculumMore")}
          </a>
        </p>

        {/* <div className="mt-14 grid gap-4 sm:gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-slate-900">{t("schedule.class1Title")}</h3>
            <p className="mt-2 break-words text-xl font-bold text-amber-900 sm:text-2xl">
              {t("schedule.class1Time")}
            </p>
            <p className="mt-3 text-sm text-slate-600">{t("schedule.class1Note")}</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-slate-900">{t("schedule.class2Title")}</h3>
            <p className="mt-2 break-words text-xl font-bold text-amber-900 sm:text-2xl">
              {t("schedule.class2Time")}
            </p>
            <p className="mt-3 text-sm text-slate-600">{t("schedule.class2Note")}</p>
          </article>
        </div>
        <p className="mt-8 text-center text-sm text-slate-500">{t("schedule.note")}</p> */}
      </div>
    </section>
  );
}
