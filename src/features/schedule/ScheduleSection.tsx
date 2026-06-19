"use client";

import NoticePostTable from "@/components/NoticePostTable";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { NOTICE_CATEGORY_SLUG } from "@/lib/resources/fixedCategories";
import { getHeadingTag, type HeadingLevel } from "@/features/shared/sectionHeading";

export function ScheduleSection({
  id,
  headingLevel = 2,
  className = "border-t border-ink-100 bg-surface py-14 sm:py-20 md:py-28",
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
          <p className="text-xs font-semibold uppercase tracking-widest text-secondary-600/80">
            {t("schedule.label")}
          </p>
          <HeadingTag className="mt-3 font-sans text-2xl font-bold text-ink-900 sm:text-3xl md:text-4xl">
            {t("schedule.title")}
          </HeadingTag>
          <p className="mt-4 text-ink-600">{t("schedule.lead")}</p>
        </div>

        <div className="mt-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-secondary-600/80">
            {t("schedule.boardLabel")}
          </p>
          <h3 className="mt-2 font-sans text-xl font-bold text-ink-900 sm:text-2xl">
            {t("schedule.boardTitle")}
          </h3>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-ink-600 sm:text-base">
            {t("schedule.boardLead")}
          </p>
        </div>

        <NoticePostTable
          categorySlug={NOTICE_CATEGORY_SLUG}
          colDate={t("legacy.colDate")}
          colTitle={t("legacy.colTitle")}
          emptyMessage={t("schedule.boardEmpty")}
          downloadErrorMessage={t("resources.downloadError")}
        />
      </div>
    </section>
  );
}
