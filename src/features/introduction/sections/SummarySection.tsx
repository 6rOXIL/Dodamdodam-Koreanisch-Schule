"use client";

import {
  educationGoalsIntro,
  historyEntries,
  schoolOrganization,
} from "@/lib/data/introductionContent";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function SummarySection() {
  const { t } = useLanguage();

  return (
    <section className="space-y-8" aria-labelledby="page-heading">
      <h2
        id="page-heading"
        className="border-b border-amber-200/80 pb-2 font-serif text-2xl font-bold text-slate-900"
      >
        {t("introduction.links.summary")}
      </h2>
      <div className="space-y-8 text-[15px] leading-relaxed text-slate-700 sm:text-base">
        <div>
          <h3 className="mb-2 font-semibold text-slate-900">{t("introduction.schoolOrgTitle")}</h3>
          <dl className="space-y-2 border-l-2 border-amber-200 pl-4">
            <div>
              <dt className="text-sm font-medium text-slate-500">{t("introduction.schoolName")}</dt>
              <dd className="mt-0.5 font-medium text-slate-900">{schoolOrganization.nameKo}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">{t("introduction.principal")}</dt>
              <dd className="mt-0.5">{schoolOrganization.principal}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">{t("introduction.address")}</dt>
              <dd className="mt-0.5 whitespace-pre-line">
                {schoolOrganization.officeAddress}
                {"\n"}
                {schoolOrganization.elementaryAddress}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">{t("introduction.phone")}</dt>
              <dd className="mt-0.5">
                <a
                  href={`tel:${schoolOrganization.phone.replace(/\s/g, "")}`}
                  className="text-amber-900 underline-offset-2 hover:underline"
                >
                  {schoolOrganization.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">E-Mail</dt>
              <dd className="mt-0.5">
                <a
                  href={`mailto:${schoolOrganization.email}`}
                  className="text-amber-900 underline-offset-2 hover:underline"
                >
                  {schoolOrganization.email}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div className="whitespace-pre-line text-slate-700">{educationGoalsIntro}</div>

        <div>
          <h3 className="mb-4 font-semibold text-slate-900">{t("introduction.historyTitle")}</h3>
          <ul className="space-y-4">
            {historyEntries.map((h) => (
              <li key={h.period} className="border-b border-slate-100 pb-4 last:border-0">
                <p className="font-semibold text-amber-900">{h.period}</p>
                <ul className="mt-2 list-inside list-disc space-y-1 text-slate-700">
                  {h.lines.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
