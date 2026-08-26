"use client";

import NoticePostTable from "@/components/NoticePostTable";
import SiteRichHtml from "@/components/SiteRichHtml";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { useResourceCategorySlugForPath } from "@/lib/hooks/useResourceBoards";
import { NOTICE_CATEGORY_SLUG } from "@/lib/resources/navBoards";
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
  const { categorySlug } = useResourceCategorySlugForPath("/schedule/", NOTICE_CATEGORY_SLUG);

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
          <SiteRichHtml
            text={t("schedule.lead")}
            className="mx-auto mt-4 max-w-2xl text-ink-600"
          />
        </div>

        <NoticePostTable
          categorySlug={categorySlug}
          colDate={t("legacy.colDate")}
          colTitle={t("legacy.colTitle")}
          emptyMessage={t("schedule.boardEmpty")}
          downloadErrorMessage={t("resources.downloadError")}
        />
      </div>
    </section>
  );
}
