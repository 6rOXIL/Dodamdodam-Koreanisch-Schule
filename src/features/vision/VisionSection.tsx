"use client";

import { useLanguage } from "@/lib/contexts/LanguageContext";
import { getHeadingTag, type HeadingLevel } from "@/features/shared/sectionHeading";

export function VisionSection({
  id,
  headingLevel = 2,
  className = "bg-slate-50 py-14 sm:py-20 md:py-28",
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
            {t("vision.label")}
          </p>
          <HeadingTag className="mt-3 font-sans text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">
            {t("vision.title")}
          </HeadingTag>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] text-slate-600 sm:text-base">
            {t("vision.lead")}
          </p>
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
              className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:shadow-md sm:p-8"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-amber-800/90">
                {card.sub}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">{card.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">{card.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
