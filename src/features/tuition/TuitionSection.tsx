"use client";

import SiteRichHtml from "@/components/SiteRichHtml";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { getHeadingTag, type HeadingLevel } from "@/features/shared/sectionHeading";

export function TuitionSection({
  id,
  headingLevel = 2,
  className = "border-b border-ink-100 bg-surface py-14 sm:py-20 md:py-28",
}: {
  id?: string;
  headingLevel?: HeadingLevel;
  className?: string;
}) {
  const { t } = useLanguage();
  const HeadingTag = getHeadingTag(headingLevel);

  const feeRows = [
    { label: t("tuition.kindergartenLabel"), fee: t("tuition.kindergartenFee") },
    { label: t("tuition.elementaryLabel"), fee: t("tuition.elementaryFee") },
    { label: t("tuition.adultsLabel"), fee: t("tuition.adultsFee") },
  ];

  return (
    <section id={id} className={className}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 md:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-secondary-600/80">
            {t("tuition.label")}
          </p>
          <HeadingTag className="mt-3 font-sans text-2xl font-bold text-ink-900 sm:text-3xl md:text-4xl">
            {t("tuition.title")}
          </HeadingTag>
          <SiteRichHtml
            text={t("tuition.lead")}
            className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-600 sm:text-base"
          />
        </div>

        <div className="mt-10 overflow-x-auto sm:mt-12">
          <table className="w-full min-w-[20rem] border-collapse text-left text-sm text-ink-800">
            <caption className="sr-only">{t("tuition.tableCaption")}</caption>
            <thead>
              <tr className="border-b border-ink-200">
                <th className="py-3 pr-4 font-semibold text-ink-900">{t("tuition.colGroup")}</th>
                <th className="py-3 font-semibold text-ink-900">{t("tuition.colFee")}</th>
              </tr>
            </thead>
            <tbody>
              {feeRows.map((row) => (
                <tr key={row.label} className="border-b border-ink-100 align-top">
                  <td className="py-3.5 pr-4 text-ink-700">{row.label}</td>
                  <td className="py-3.5 font-medium text-ink-900">{row.fee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 space-y-8 sm:mt-12">
          <div>
            <h3 className="text-base font-semibold text-ink-900">{t("tuition.policyTitle")}</h3>
            <SiteRichHtml
              text={t("tuition.policyBody")}
              className="mt-3 text-[15px] leading-relaxed text-ink-600"
            />
          </div>
          <div>
            <h3 className="text-base font-semibold text-ink-900">{t("tuition.trialTitle")}</h3>
            <SiteRichHtml
              text={t("tuition.trialBody")}
              className="mt-3 text-[15px] leading-relaxed text-ink-600"
            />
          </div>
          <div>
            <h3 className="text-base font-semibold text-ink-900">{t("tuition.admissionTitle")}</h3>
            <SiteRichHtml
              text={t("tuition.admissionBody")}
              className="mt-3 text-[15px] leading-relaxed text-ink-600"
            />
          </div>
          <p className="text-[15px] leading-relaxed text-ink-600">{t("tuition.paymentNote")}</p>
        </div>

        <div className="mt-10 rounded-2xl border border-ink-100 bg-ink-50/60 p-5 sm:mt-12 sm:p-6">
          <h3 className="text-base font-semibold text-ink-900">{t("tuition.bankTitle")}</h3>
          <dl className="mt-4 space-y-3 text-sm text-ink-800">
            <div>
              <dt className="text-ink-500">{t("tuition.bankNameLabel")}</dt>
              <dd className="mt-0.5 font-medium">{t("tuition.bankName")}</dd>
            </div>
            <div>
              <dt className="text-ink-500">{t("tuition.ibanLabel")}</dt>
              <dd className="mt-0.5 break-all font-medium tracking-wide">{t("tuition.iban")}</dd>
            </div>
            <div>
              <dt className="text-ink-500">{t("tuition.bicLabel")}</dt>
              <dd className="mt-0.5 font-medium tracking-wide">{t("tuition.bic")}</dd>
            </div>
            <div>
              <dt className="text-ink-500">{t("tuition.accountHolderLabel")}</dt>
              <dd className="mt-0.5 font-medium">{t("tuition.accountHolder")}</dd>
            </div>
            <div>
              <dt className="text-ink-500">{t("tuition.transferPurposeLabel")}</dt>
              <dd className="mt-0.5 font-medium">{t("tuition.transferPurpose")}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
