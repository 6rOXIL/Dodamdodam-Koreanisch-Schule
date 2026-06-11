"use client";

import { LocationMapEmbed } from "@/features/location/LocationMapEmbed";
import { useIntroductionContent } from "@/lib/hooks/useIntroductionContent";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function DirectionsSection() {
  const { t } = useLanguage();
  const { directions, schoolOrganization } = useIntroductionContent();

  return (
    <section className="space-y-6" aria-labelledby="page-heading">
      <h2
        id="page-heading"
        className="border-b border-brand-200/80 pb-2 font-sans text-2xl font-bold text-ink-900"
      >
        {t("introduction.links.map")}
      </h2>
      <div className="space-y-6 text-[15px] leading-relaxed text-ink-700 sm:text-base">
        <div>
          <p className="font-sans text-xl font-bold text-ink-900">{directions.titlePrimary}</p>
          <p className="mt-1 text-ink-600">{directions.titleSecondary}</p>
        </div>

        <div>
          <p className="font-semibold text-ink-900">{directions.teachingSitesLabel}</p>
          <ul className="mt-2 space-y-1">
            {directions.lines.map((line, i) => (
              <li key={i}>{line || "\u00A0"}</li>
            ))}
          </ul>
        </div>

        <ul className="space-y-1">
          {directions.phones.map((p) => (
            <li key={p}>{p}</li>
          ))}
          <li>
            <a
              href={`mailto:${schoolOrganization.email}`}
              className="text-brand-900 underline-offset-2 hover:underline"
            >
              {directions.emailLine}
            </a>
          </li>
        </ul>

        <LocationMapEmbed collapsible={false} />
      </div>
    </section>
  );
}
