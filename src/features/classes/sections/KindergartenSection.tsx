"use client";

import { useClassesContent } from "@/lib/hooks/useClassesContent";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import ClassDetailBlock from "../components/ClassDetailBlock";
import ClassScheduleTable from "../components/ClassScheduleTable";

export default function KindergartenSection() {
  const { t, language } = useLanguage();
  const data = useClassesContent().kindergarten;

  return (
    <section className="space-y-8" aria-labelledby="page-heading">
      <h2
        id="page-heading"
        className="border-b border-brand-200/80 pb-2 font-sans text-2xl font-bold text-ink-900"
      >
        {t("classes.links.kindergarten")}
      </h2>
      <div className="space-y-8 text-[15px] leading-relaxed text-ink-700 sm:text-base">
        {data.schedule && (
          <ClassScheduleTable
            title={data.scheduleTitle}
            rows={data.schedule}
            fixedGroupLabel={data.scheduleGroupLabel}
            colGroup={t("classes.table.group")}
            colClass={t("classes.table.class")}
            colTime={t("classes.table.time")}
          />
        )}
        <ClassDetailBlock
          title={data.title}
          location={data.location}
          locationLabel={t("classes.location")}
          lead={data.lead}
          paragraphs={data.paragraphs}
          bullets={data.bullets}
          textbooks={data.textbooks}
          note={data.note}
          koOnlyImage={
            language === "ko"
              ? {
                  afterParagraphIndex: 1,
                  src: "/images/class_ kindergarten.png",
                  alt: "유치반 수업 활동 사진",
                }
              : undefined
          }
        />
      </div>
    </section>
  );
}
