"use client";

import { elementaryClass } from "@/lib/data/classContent";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import ClassDetailBlock from "../components/ClassDetailBlock";
import ClassScheduleTable from "../components/ClassScheduleTable";

export default function ElementarySection() {
  const { t } = useLanguage();
  const { petalSection, fruitSection } = elementaryClass;

  return (
    <section className="space-y-8" aria-labelledby="page-heading">
      <h2
        id="page-heading"
        className="border-b border-amber-200/80 pb-2 font-serif text-2xl font-bold text-slate-900"
      >
        {t("classes.links.elementary")}
      </h2>
      <div className="space-y-8 text-[15px] leading-relaxed text-slate-700 sm:text-base">
        <ClassScheduleTable
          title={elementaryClass.scheduleTitle}
          rows={elementaryClass.schedule}
          colGroup={t("classes.table.group")}
          colClass={t("classes.table.class")}
          colTime={t("classes.table.time")}
        />
        <ClassDetailBlock
          title={petalSection.title}
          location={petalSection.location}
          locationLabel={t("classes.location")}
          lead={petalSection.lead}
          paragraphs={petalSection.paragraphs}
          bullets={petalSection.bullets}
          textbooks={petalSection.textbooks}
          note={petalSection.note}
          koOnlyImage={{
            afterParagraphIndex: 1,
            src: "/images/class_ elementary.png",
            alt: "초등반 수업 활동 사진",
          }}
        />
        <ClassDetailBlock
          title={fruitSection.title}
          location={fruitSection.location}
          locationLabel={t("classes.location")}
          paragraphs={fruitSection.paragraphs}
          bullets={fruitSection.bullets}
          textbooks={fruitSection.textbooks}
          note={fruitSection.note}
        />
      </div>
    </section>
  );
}
