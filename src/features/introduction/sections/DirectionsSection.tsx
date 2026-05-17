"use client";

import { mapUrls } from "@/lib/data/introduction";
import { useIntroductionContent } from "@/lib/hooks/useIntroductionContent";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function DirectionsSection() {
  const { t } = useLanguage();
  const { directions, schoolOrganization } = useIntroductionContent();

  return (
    <section className="space-y-6" aria-labelledby="page-heading">
      <h2
        id="page-heading"
        className="border-b border-amber-200/80 pb-2 font-sans text-2xl font-bold text-slate-900"
      >
        {t("introduction.links.map")}
      </h2>
      <div className="space-y-6 text-[15px] leading-relaxed text-slate-700 sm:text-base">
        <div>
          <p className="font-sans text-xl font-bold text-slate-900">{directions.titlePrimary}</p>
          <p className="mt-1 text-slate-600">{directions.titleSecondary}</p>
        </div>

        <div>
          <p className="font-semibold text-slate-900">{directions.teachingSitesLabel}</p>
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
              className="text-amber-900 underline-offset-2 hover:underline"
            >
              {directions.emailLine}
            </a>
          </li>
        </ul>

        <div className="flex flex-wrap gap-3">
          <a
            href={mapUrls.pangea}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-amber-800/30 bg-amber-50 px-5 py-2.5 text-sm font-semibold text-amber-950 transition hover:bg-amber-100"
          >
            {directions.mapPangea}
          </a>
          <a
            href={mapUrls.ruppin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-amber-800/30 bg-amber-50 px-5 py-2.5 text-sm font-semibold text-amber-950 transition hover:bg-amber-100"
          >
            {directions.mapRuppin}
          </a>
        </div>
      </div>
    </section>
  );
}
