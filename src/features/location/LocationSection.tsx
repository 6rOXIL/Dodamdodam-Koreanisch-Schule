"use client";

import { LEGACY_MAPS_SEARCH_URL } from "@/lib/data/legacySite";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { getHeadingTag, type HeadingLevel } from "@/features/shared/sectionHeading";

export function LocationSection({
  id,
  headingLevel = 2,
  className = "bg-slate-900 py-14 text-white sm:py-20 md:py-28",
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
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-200/90">
            {t("location.label")}
          </p>
          <HeadingTag className="mt-3 font-serif text-2xl font-bold sm:text-3xl md:text-4xl">
            {t("location.title")}
          </HeadingTag>
        </div>
        <div className="mt-10 grid gap-8 sm:mt-12 md:grid-cols-2 md:gap-16">
          <div>
            <h3 className="text-sm font-semibold text-amber-200/95">{t("location.addressLabel")}</h3>
            <p className="mt-2 break-words whitespace-pre-line text-white/90">{t("location.address")}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-amber-200/95">{t("location.contactLabel")}</h3>
            <p className="mt-2 text-white/90">{t("location.phone")}</p>
            <a
              href={`mailto:${t("location.email")}`}
              className="mt-1 inline-block text-amber-200 underline-offset-4 hover:underline"
            >
              {t("location.email")}
            </a>
          </div>
        </div>
        <div className="mt-10 flex justify-center">
          <a
            href={LEGACY_MAPS_SEARCH_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 min-w-[12rem] items-center justify-center rounded-full border border-white/30 bg-white/10 px-8 py-3 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/20"
          >
            {t("location.mapCta")}
          </a>
        </div>
      </div>
    </section>
  );
}
