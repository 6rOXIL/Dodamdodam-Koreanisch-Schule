"use client";

import SiteRichHtml from "@/components/SiteRichHtml";
import {
  LEAVE_OF_ABSENCE_GOOGLE_FORM_URL,
  REGULATIONS_PDF_PATH,
  WITHDRAWAL_GOOGLE_FORM_URL,
} from "@/lib/forms/academic";
import { useSubcategoryLabel } from "@/lib/hooks/useSiteSubnav";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { getImagePath } from "@/lib/utils/imagePath";

const FORM_LINKS = [
  {
    key: "withdrawal",
    href: WITHDRAWAL_GOOGLE_FORM_URL,
    titleKey: "introduction.regulations.withdrawalTitle",
    ctaKey: "introduction.regulations.withdrawalCta",
  },
  {
    key: "leave",
    href: LEAVE_OF_ABSENCE_GOOGLE_FORM_URL,
    titleKey: "introduction.regulations.leaveTitle",
    ctaKey: "introduction.regulations.leaveCta",
  },
] as const;

export default function RegulationsSection() {
  const title = useSubcategoryLabel("introduction", "regulations");
  const { t } = useLanguage();
  const pdfHref = getImagePath(REGULATIONS_PDF_PATH);

  return (
    <section className="space-y-10" aria-labelledby="page-heading">
      <h2
        id="page-heading"
        className="border-b border-brand-200/80 pb-2 font-sans text-2xl font-bold text-ink-900"
      >
        {title}
      </h2>

      <article className="rounded-2xl border border-ink-200 bg-surface p-6 shadow-sm sm:p-8">
        <h3 className="font-sans text-lg font-bold text-ink-900">
          {t("introduction.regulations.pdfTitle")}
        </h3>
        <SiteRichHtml
          text={t("introduction.regulations.pdfLead")}
          className="mt-3 text-[15px] leading-relaxed text-ink-700 sm:text-base"
        />
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={pdfHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand-800 px-5 py-2.5 text-sm font-semibold text-surface transition hover:bg-brand-900"
          >
            {t("introduction.regulations.viewPdf")}
          </a>
          <a
            href={pdfHref}
            download
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-brand-300 bg-brand-50 px-5 py-2.5 text-sm font-semibold text-brand-950 transition hover:bg-brand-100"
          >
            {t("introduction.regulations.downloadPdf")}
          </a>
        </div>
      </article>

      <div>
        <h3 className="font-sans text-lg font-bold text-ink-900">
          {t("introduction.regulations.applicationsTitle")}
        </h3>
        <SiteRichHtml
          text={t("introduction.regulations.applicationsLead")}
          className="mt-2 text-[15px] leading-relaxed text-ink-600 sm:text-base"
        />
        <ul className="mt-4 space-y-3">
          {FORM_LINKS.map(({ key, href, titleKey, ctaKey }) => (
            <li key={key}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col gap-1 rounded-xl border border-ink-200 bg-surface px-4 py-3 transition hover:border-brand-300 hover:bg-brand-50 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
              >
                <span className="font-medium text-ink-900">{t(titleKey)}</span>
                <span className="text-sm font-semibold text-brand-800">
                  {t(ctaKey)}
                  <span className="sr-only"> ({t("introduction.regulations.externalHint")})</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
