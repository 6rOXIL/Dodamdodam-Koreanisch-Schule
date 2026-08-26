"use client";

import SiteRichHtml from "@/components/SiteRichHtml";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { getHeadingTag, type HeadingLevel } from "@/features/shared/sectionHeading";
import { ENROLLMENT_GOOGLE_FORM_URL } from "@/lib/forms/enrollment";

export function EnrollmentSection({
  id,
  headingLevel = 2,
  className = "border-b border-ink-100 bg-surface-muted py-14 sm:py-20 md:py-28",
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
        <p className="text-xs font-semibold uppercase tracking-widest text-secondary-600/80">
          {t("enrollment.label")}
        </p>
        <HeadingTag className="mt-3 font-sans text-2xl font-bold text-ink-900 sm:text-3xl md:text-4xl">
          {t("enrollment.title")}
        </HeadingTag>
        <SiteRichHtml
          text={t("enrollment.lead")}
          className="mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-600 sm:mt-8 sm:text-base"
        />
        <a
          href={ENROLLMENT_GOOGLE_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full bg-brand-800 px-7 py-2.5 text-sm font-semibold text-surface transition hover:bg-brand-900 sm:mt-10"
        >
          {t("enrollment.cta")}
        </a>
      </div>
    </section>
  );
}
