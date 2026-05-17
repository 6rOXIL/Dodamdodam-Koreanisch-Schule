"use client";

import { adultsClass } from "@/lib/data/classContent";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function AdultsSection() {
  const { t } = useLanguage();

  return (
    <section className="space-y-8" aria-labelledby="page-heading">
      <h2
        id="page-heading"
        className="border-b border-amber-200/80 pb-2 font-serif text-2xl font-bold text-slate-900"
      >
        {t("classes.links.adults")}
      </h2>
      <div className="space-y-6 text-[15px] leading-relaxed text-slate-700 sm:text-base">
        <p className="font-medium text-slate-800">{adultsClass.title}</p>
        <div className="grid gap-4">
          {adultsClass.tiers.map((tier) => (
            <article
              key={tier.name}
              className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5"
            >
              <h3 className="text-lg font-semibold text-amber-900">{tier.name}</h3>
              <dl className="mt-4 space-y-3 border-l-2 border-amber-200 pl-4">
                <div>
                  <dt className="text-sm font-medium text-slate-500">{t("classes.adults.schedule")}</dt>
                  <dd className="mt-0.5 text-slate-800">{tier.schedule}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-500">{t("classes.adults.tuition")}</dt>
                  <dd className="mt-0.5 text-slate-800">{tier.tuition}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-500">{t("classes.adults.textbook")}</dt>
                  <dd className="mt-0.5 text-slate-800">{tier.textbook}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
