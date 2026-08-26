"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { useSiteSubnav } from "@/lib/hooks/useSiteSubnav";
import { getHeadingTag, type HeadingLevel } from "@/features/shared/sectionHeading";

export function ClassesSection({
  id,
  headingLevel = 2,
  className = "border-b border-ink-100 bg-surface py-14 sm:py-20 md:py-28",
}: {
  id?: string;
  headingLevel?: HeadingLevel;
  className?: string;
}) {
  const { t, language } = useLanguage();
  const { links } = useSiteSubnav("classes");
  const HeadingTag = getHeadingTag(headingLevel);

  return (
    <section id={id} className={className}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-secondary-600/80">
            {t("classes.label")}
          </p>
          <HeadingTag className="mt-3 font-sans text-2xl font-bold text-ink-900 sm:text-3xl md:text-4xl">
            {t("classes.title")}
          </HeadingTag>
          <p className="mx-auto mt-4 max-w-2xl text-ink-600">{t("classes.lead")}</p>
        </div>

        <ul className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-3 sm:gap-6">
          {links.map(({ segment, label }) => (
            <li key={segment}>
              <Link
                href={`/${language}/classes/${segment}/`}
                className="flex h-full flex-col justify-between rounded-2xl border border-ink-200/80 bg-surface px-5 py-6 transition hover:border-brand-300 hover:bg-brand-50/40 sm:px-6 sm:py-8"
              >
                <span className="text-lg font-semibold text-ink-900 sm:text-xl">{label}</span>
                <span className="mt-4 text-sm font-medium text-brand-800">
                  {t("classes.viewDetail")} →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
