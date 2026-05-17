"use client";

import { useIntroductionContent } from "@/lib/hooks/useIntroductionContent";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function CalendarSection() {
  const { t } = useLanguage();
  const { calendar } = useIntroductionContent();

  return (
    <section className="space-y-6" aria-labelledby="page-heading">
      <h2
        id="page-heading"
        className="border-b border-brand-200/80 pb-2 font-sans text-2xl font-bold text-ink-900"
      >
        {t("introduction.links.calendar")}
      </h2>
      <div className="space-y-8">
        <p className="whitespace-pre-line text-center text-sm font-medium text-ink-800 sm:text-base">
          {calendar.title}
        </p>

        <div className="overflow-x-auto rounded-xl border border-ink-200 shadow-sm">
          <table className="w-full min-w-[640px] border-collapse text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-ink-200 bg-ink-50">
                <th scope="col" className="whitespace-nowrap px-2 py-3 font-semibold text-ink-800 sm:px-3">
                  {calendar.monthWeekHeader}
                </th>
                {[1, 2, 3, 4, 5].map((n) => (
                  <th
                    key={n}
                    scope="col"
                    className="w-[18%] px-1 py-3 text-center font-semibold text-ink-800 sm:px-2"
                  >
                    {n}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {calendar.rows.map((row) => (
                <tr key={row.month} className="border-b border-ink-100 last:border-0">
                  <th
                    scope="row"
                    className="whitespace-nowrap bg-ink-50/80 px-2 py-2 font-medium text-ink-900 sm:px-3"
                  >
                    {row.month}
                  </th>
                  {[row.w1, row.w2, row.w3, row.w4, row.w5].map((cell, i) => (
                    <td key={i} className="align-top px-1 py-2 text-ink-700 sm:px-2">
                      {cell ? <span className="whitespace-pre-line leading-snug">{cell}</span> : "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="space-y-2 text-sm text-ink-600">
          {calendar.footnotes.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>

        <div>
          <h3 className="mb-3 font-semibold text-ink-900">{calendar.schoolHolidaysTitle}</h3>
          <ul className="space-y-2 text-sm text-ink-700">
            {calendar.schoolHolidays.map((s) => (
              <li key={s.label}>
                <span className="font-medium text-ink-800">{s.label}</span> {s.range}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-semibold text-ink-900">{calendar.publicHolidaysTitle}</h3>
          <div className="overflow-x-auto rounded-lg border border-ink-200">
            <table className="w-full min-w-[320px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-ink-200 bg-ink-50">
                  <th className="px-3 py-2 font-semibold">{calendar.holidayNameHeader}</th>
                  <th className="px-3 py-2 font-semibold">{calendar.holidayDateHeader}</th>
                </tr>
              </thead>
              <tbody>
                {calendar.publicHolidays.map((row, i) => (
                  <tr key={i} className="border-b border-ink-100 last:border-0">
                    <td className="px-3 py-2 text-ink-800">
                      {row.name}
                      {row.note ? <span className="block text-xs text-ink-500">{row.note}</span> : null}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-ink-700">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
