"use client";

import {
  educationGoals,
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

        <div>
          <h3 className="mb-4 font-semibold text-slate-900">
            {t("introduction.educationGoalsTitle")}
          </h3>
          <div className="space-y-6">
            <div className="rounded-lg border border-amber-100 bg-amber-50/50 px-4 py-3 sm:px-5 sm:py-4">
              <h4 className="text-sm font-semibold tracking-wide text-amber-900 uppercase">
                {educationGoals.purpose.title}
              </h4>
              <p className="mt-2 text-[15px] leading-relaxed font-medium text-slate-800 sm:text-base">
                {educationGoals.purpose.text}
              </p>
            </div>

            <div>
              <h4 className="mb-3 font-semibold text-slate-900">{educationGoals.goals.title}</h4>
              <ol className="list-none space-y-3 border-l-2 border-amber-200 pl-4">
                {educationGoals.goals.items.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-900">
                      {i + 1}
                    </span>
                    <span className="pt-0.5">{item}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h4 className="mb-3 font-semibold text-slate-900">{educationGoals.direction.title}</h4>
              <div className="space-y-4">
                {educationGoals.direction.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                <p className="text-slate-600">{educationGoals.direction.quoteIntro}</p>
                <blockquote className="border-l-4 border-amber-300 bg-slate-50 px-4 py-3 italic text-slate-800">
                  &ldquo;{educationGoals.direction.quote}&rdquo;
                </blockquote>
                <p>
                  {educationGoals.direction.closing.before}
                  <strong className="font-semibold text-amber-900">
                    {educationGoals.direction.closing.highlight}
                  </strong>
                  {educationGoals.direction.closing.after}
                </p>
              </div>
            </div>
          </div>
        </div>

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
