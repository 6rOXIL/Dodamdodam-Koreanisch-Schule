"use client";

import SiteRichHtml from "@/components/SiteRichHtml";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { getHeadingTag, type HeadingLevel } from "@/features/shared/sectionHeading";

export function VisionSection({
  id,
  headingLevel = 2,
  className = "bg-ink-50 py-14 sm:py-20 md:py-28",
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
          <p className="text-xs font-semibold uppercase tracking-widest text-secondary-600/80">
            {t("vision.label")}
          </p>
          <HeadingTag className="mt-3 font-sans text-2xl font-bold text-ink-900 sm:text-3xl md:text-4xl">
            {t("vision.title")}
          </HeadingTag>
          <SiteRichHtml
            text={t("vision.lead")}
            className="mx-auto mt-4 max-w-2xl text-[15px] text-ink-600 sm:text-base"
          />
        </div>
        <div className="mt-10 grid gap-6 sm:mt-14 sm:gap-8 md:grid-cols-3">
          {[
            {
              title: t("vision.card1Title"),
              sub: t("vision.card1Subtitle"),
              body: t("vision.card1Body"),
            },
            {
              title: t("vision.card2Title"),
              sub: t("vision.card2Subtitle"),
              body: t("vision.card2Body"),
            },
            {
              title: t("vision.card3Title"),
              sub: t("vision.card3Subtitle"),
              body: t("vision.card3Body"),
            },
          ].map((card) => (
            <article
              key={card.title}
              className="rounded-2xl border border-ink-200/80 bg-surface p-6 shadow-sm transition hover:shadow-md sm:p-8"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-secondary-600/90">
                {card.sub}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-ink-900">{card.title}</h3>
              <SiteRichHtml
                text={card.body}
                className="mt-4 text-sm leading-relaxed text-ink-600"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
