"use client";

import Link from "next/link";
import NoticePostTable from "@/components/NoticePostTable";
import SiteRichHtml from "@/components/SiteRichHtml";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { useResourceCategorySlugForPath } from "@/lib/hooks/useResourceBoards";
import { NOTICE_CATEGORY_SLUG } from "@/lib/resources/navBoards";
import { getHeadingTag, type HeadingLevel } from "@/features/shared/sectionHeading";

export function ScheduleSection({
  id,
  headingLevel = 2,
  preview = false,
  className = "border-t border-ink-100 bg-surface py-14 sm:py-20 md:py-28",
}: {
  id?: string;
  headingLevel?: HeadingLevel;
  /** 홈 등: 요약만 보이고 상세는 /schedule/ 로 이동 */
  preview?: boolean;
  className?: string;
}) {
  const { t, language } = useLanguage();
  const HeadingTag = getHeadingTag(headingLevel);
  const { categorySlug } = useResourceCategorySlugForPath("/schedule/", NOTICE_CATEGORY_SLUG);

  const summaryCards = [
    {
      title: t("schedule.class1Title"),
      time: t("schedule.class1Time"),
      note: t("schedule.class1Note"),
    },
    {
      title: t("schedule.class2Title"),
      time: t("schedule.class2Time"),
      note: t("schedule.class2Note"),
    },
  ];

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

        {preview ? (
          <div className="mt-10 sm:mt-12">
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              {summaryCards.map((card) => (
                <article
                  key={card.title}
                  className="rounded-2xl border border-ink-200/80 bg-surface-muted/50 px-5 py-6 text-center sm:px-6"
                >
                  <h3 className="text-lg font-semibold text-ink-900">{card.title}</h3>
                  <p className="mt-2 text-sm font-medium text-brand-800">{card.time}</p>
                  <p className="mt-2 text-sm text-ink-600">{card.note}</p>
                </article>
              ))}
            </div>
            <p className="mt-6 text-center text-sm text-ink-500">{t("schedule.note")}</p>
            <div className="mt-8 flex justify-center">
              <Link
                href={`/${language}/schedule/`}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand-800 px-7 py-2.5 text-sm font-semibold text-surface transition hover:bg-brand-900"
              >
                {t("schedule.viewDetail")}
              </Link>
            </div>
          </div>
        ) : (
          <NoticePostTable
            categorySlug={categorySlug}
            colDate={t("legacy.colDate")}
            colTitle={t("legacy.colTitle")}
            emptyMessage={t("schedule.boardEmpty")}
            downloadErrorMessage={t("resources.downloadError")}
          />
        )}
      </div>
    </section>
  );
}
