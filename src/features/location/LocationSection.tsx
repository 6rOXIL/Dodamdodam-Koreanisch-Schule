"use client";

import { useLanguage } from "@/lib/contexts/LanguageContext";
import { getHeadingTag, type HeadingLevel } from "@/features/shared/sectionHeading";
import { LocationMapEmbed } from "@/features/location/LocationMapEmbed";

export function LocationSection({
  id,
  headingLevel = 2,
  className = "bg-ink-900 py-14 text-surface sm:py-20 md:py-28",
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
          <p className="text-xs font-semibold uppercase tracking-widest text-secondary-300/90">
            {t("location.label")}
          </p>
          <HeadingTag className="mt-3 font-sans text-2xl font-bold sm:text-3xl md:text-4xl">
            {t("location.title")}
          </HeadingTag>
        </div>
        <div className="mt-10 grid gap-8 sm:mt-12 md:grid-cols-2 md:gap-16">
          <div>
            <h3 className="text-sm font-semibold text-brand-200/95">{t("location.addressLabel1")}</h3>
            <p className="mt-2 mb-6 break-words whitespace-pre-line text-surface/90">{t("location.address1")}</p>

            <h3 className="text-sm font-semibold text-brand-200/95">{t("location.addressLabel2")}</h3>
            <p className="mt-2 break-words whitespace-pre-line text-surface/90">{t("location.address2")}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-brand-200/95">{t("location.contactLabel")}</h3>
            <p className="mt-2 text-surface/90">{t("location.phone")}</p>
            <a
              href={`mailto:${t("location.email")}`}
              className="mt-1 inline-block text-brand-200 underline-offset-4 hover:underline"
            >
              {t("location.email")}
            </a>

            <h3 className="mt-6 text-sm font-semibold text-brand-200/95">{t("location.addressLabel3")}</h3>
            <p className="mt-2 break-words whitespace-pre-line text-surface/90">{t("location.address3")}</p>
          </div>
        </div>
        <div className="mt-10">
          <LocationMapEmbed variant="dark" />
        </div>
      </div>
    </section>
  );
}
