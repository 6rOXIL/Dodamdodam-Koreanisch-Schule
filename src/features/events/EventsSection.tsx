"use client";

import LegacyPostTable from "@/components/LegacyPostTable";
import { LEGACY_BOARDS, LEGACY_NOTICES } from "@/lib/data/legacySite";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { getHeadingTag, type HeadingLevel } from "@/features/shared/sectionHeading";

export function EventsSection({
  id,
  headingLevel = 2,
  className = "bg-surface py-14 sm:py-20 md:py-28",
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
            {t("events.label")}
          </p>
          <HeadingTag className="mt-3 font-sans text-2xl font-bold text-ink-900 sm:text-3xl md:text-4xl">
            {t("events.title")}
          </HeadingTag>
          <p className="mt-4 text-ink-600">{t("events.lead")}</p>
        </div>
        <LegacyPostTable
          posts={LEGACY_NOTICES}
          colDate={t("legacy.colDate")}
          colTitle={t("legacy.colTitle")}
          externalHint={t("legacy.externalHint")}
        />
        <p className="mt-6 text-center">
          <a
            href={LEGACY_BOARDS.noticeList}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-ink-700 underline-offset-2 hover:text-ink-900 hover:underline"
          >
            {t("legacy.boardFullNotice")}
          </a>
        </p>
      </div>
    </section>
  );
}
