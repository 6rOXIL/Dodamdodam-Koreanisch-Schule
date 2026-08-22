"use client";

import ResourceRichTextEditor from "@/components/ResourceRichTextEditor";
import type { CalendarRow, IntroductionContent } from "@/lib/data/introduction";
import { emptyToStoredHtml, getBodyHtml } from "@/lib/siteContent/richText";
import { Field, StringListEditor, TextInput } from "./FormFields";

type Props = {
  content: IntroductionContent;
  onChange: (next: IntroductionContent) => void;
  segment: "greeting" | "summary" | "calendar" | "directions";
  labels: {
    paragraphs: string;
    addItem: string;
    schoolName: string;
    principal: string;
    officeAddress: string;
    elementaryAddress: string;
    phone: string;
    email: string;
    purposeTitle: string;
    purposeText: string;
    goalsTitle: string;
    goalsItems: string;
    directionTitle: string;
    directionParagraphs: string;
    quoteIntro: string;
    quote: string;
    closingBefore: string;
    closingHighlight: string;
    closingAfter: string;
    historyPeriod: string;
    historyLines: string;
    addHistory: string;
    calendarTitle: string;
    monthWeekHeader: string;
    month: string;
    week: string;
    footnotes: string;
    schoolHolidaysTitle: string;
    holidayLabel: string;
    holidayRange: string;
    addHoliday: string;
    publicHolidaysTitle: string;
    holidayName: string;
    holidayDate: string;
    holidayNote: string;
    addPublicHoliday: string;
    titlePrimary: string;
    titleSecondary: string;
    teachingSitesLabel: string;
    lines: string;
    phones: string;
    emailLine: string;
    mapLabel: string;
    mapPangea: string;
    mapRuppin: string;
  };
};

export default function IntroductionContentEditor({ content, onChange, segment, labels }: Props) {
  function patch(partial: Partial<IntroductionContent>) {
    onChange({ ...content, ...partial });
  }

  function updateRow(index: number, row: CalendarRow) {
    const rows = [...content.calendar.rows];
    rows[index] = row;
    patch({ calendar: { ...content.calendar, rows } });
  }

  if (segment === "greeting") {
    return (
      <ResourceRichTextEditor
        id="intro-greeting-body"
        label={labels.paragraphs}
        value={getBodyHtml(content.greeting)}
        editorClassName="min-h-[16rem]"
        onChange={(html) =>
          patch({
            greeting: {
              ...content.greeting,
              html: emptyToStoredHtml(html),
              paragraphs: undefined,
            },
          })
        }
      />
    );
  }

  if (segment === "summary") {
    const org = content.schoolOrganization;
    const goals = content.educationGoals;
    return (
      <div className="space-y-8">
        <section className="space-y-3">
          <h3 className="text-base font-semibold text-ink-900">{labels.schoolName}</h3>
          <Field label={labels.schoolName}>
            <TextInput
              value={org.name}
              onChange={(name) => patch({ schoolOrganization: { ...org, name } })}
            />
          </Field>
          <Field label={labels.principal}>
            <TextInput
              value={org.principal}
              onChange={(principal) => patch({ schoolOrganization: { ...org, principal } })}
            />
          </Field>
          <Field label={labels.officeAddress}>
            <TextInput
              multiline
              value={org.officeAddress}
              onChange={(officeAddress) => patch({ schoolOrganization: { ...org, officeAddress } })}
            />
          </Field>
          <Field label={labels.elementaryAddress}>
            <TextInput
              multiline
              value={org.elementaryAddress}
              onChange={(elementaryAddress) =>
                patch({ schoolOrganization: { ...org, elementaryAddress } })
              }
            />
          </Field>
          <Field label={labels.phone}>
            <TextInput
              value={org.phone}
              onChange={(phone) => patch({ schoolOrganization: { ...org, phone } })}
            />
          </Field>
          <Field label={labels.email}>
            <TextInput
              value={org.email}
              onChange={(email) => patch({ schoolOrganization: { ...org, email } })}
            />
          </Field>
        </section>

        <section className="space-y-3">
          <h3 className="text-base font-semibold text-ink-900">{labels.goalsTitle}</h3>
          <Field label={labels.purposeTitle}>
            <TextInput
              value={goals.purpose.title}
              onChange={(title) =>
                patch({ educationGoals: { ...goals, purpose: { ...goals.purpose, title } } })
              }
            />
          </Field>
          <ResourceRichTextEditor
            id="intro-purpose-body"
            label={labels.purposeText}
            value={getBodyHtml({ html: goals.purpose.html, text: goals.purpose.text })}
            editorClassName="min-h-[8rem]"
            onChange={(html) =>
              patch({
                educationGoals: {
                  ...goals,
                  purpose: {
                    ...goals.purpose,
                    html: emptyToStoredHtml(html),
                    text: goals.purpose.text,
                  },
                },
              })
            }
          />
          <Field label={labels.goalsTitle}>
            <TextInput
              value={goals.goals.title}
              onChange={(title) =>
                patch({ educationGoals: { ...goals, goals: { ...goals.goals, title } } })
              }
            />
          </Field>
          <ResourceRichTextEditor
            id="intro-goals-body"
            label={labels.goalsItems}
            value={getBodyHtml({
              html: goals.goals.html,
              paragraphs: goals.goals.items,
            })}
            editorClassName="min-h-[10rem]"
            onChange={(html) =>
              patch({
                educationGoals: {
                  ...goals,
                  goals: {
                    ...goals.goals,
                    html: emptyToStoredHtml(html),
                    items: goals.goals.items,
                  },
                },
              })
            }
          />
          <Field label={labels.directionTitle}>
            <TextInput
              value={goals.direction.title}
              onChange={(title) =>
                patch({
                  educationGoals: { ...goals, direction: { ...goals.direction, title } },
                })
              }
            />
          </Field>
          <ResourceRichTextEditor
            id="intro-direction-body"
            label={labels.directionParagraphs}
            value={getBodyHtml({
              html: goals.direction.html,
              paragraphs: goals.direction.paragraphs,
            })}
            editorClassName="min-h-[12rem]"
            onChange={(html) =>
              patch({
                educationGoals: {
                  ...goals,
                  direction: {
                    ...goals.direction,
                    html: emptyToStoredHtml(html),
                    paragraphs: undefined,
                  },
                },
              })
            }
          />
          <Field label={labels.quoteIntro}>
            <TextInput
              value={goals.direction.quoteIntro}
              onChange={(quoteIntro) =>
                patch({
                  educationGoals: { ...goals, direction: { ...goals.direction, quoteIntro } },
                })
              }
            />
          </Field>
          <Field label={labels.quote}>
            <TextInput
              multiline
              value={goals.direction.quote}
              onChange={(quote) =>
                patch({
                  educationGoals: { ...goals, direction: { ...goals.direction, quote } },
                })
              }
            />
          </Field>
          <Field label={labels.closingBefore}>
            <TextInput
              value={goals.direction.closing.before}
              onChange={(before) =>
                patch({
                  educationGoals: {
                    ...goals,
                    direction: {
                      ...goals.direction,
                      closing: { ...goals.direction.closing, before },
                    },
                  },
                })
              }
            />
          </Field>
          <Field label={labels.closingHighlight}>
            <TextInput
              value={goals.direction.closing.highlight}
              onChange={(highlight) =>
                patch({
                  educationGoals: {
                    ...goals,
                    direction: {
                      ...goals.direction,
                      closing: { ...goals.direction.closing, highlight },
                    },
                  },
                })
              }
            />
          </Field>
          <Field label={labels.closingAfter}>
            <TextInput
              value={goals.direction.closing.after}
              onChange={(after) =>
                patch({
                  educationGoals: {
                    ...goals,
                    direction: {
                      ...goals.direction,
                      closing: { ...goals.direction.closing, after },
                    },
                  },
                })
              }
            />
          </Field>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-ink-900">{labels.historyPeriod}</h3>
            <button
              type="button"
              onClick={() =>
                patch({ history: [...content.history, { period: "", lines: [], html: "" }] })
              }
              className="rounded-md border border-ink-200 px-2 py-1 text-xs font-medium text-ink-700 hover:bg-ink-50"
            >
              {labels.addHistory}
            </button>
          </div>
          {content.history.map((item, index) => (
            <div key={index} className="space-y-2 rounded-lg border border-ink-200 p-3">
              <div className="flex justify-between gap-2">
                <Field label={labels.historyPeriod}>
                  <TextInput
                    value={item.period}
                    onChange={(period) => {
                      const history = [...content.history];
                      history[index] = { ...item, period };
                      patch({ history });
                    }}
                  />
                </Field>
                <button
                  type="button"
                  onClick={() => patch({ history: content.history.filter((_, i) => i !== index) })}
                  className="mt-6 h-9 rounded-md border border-ink-200 px-2 text-xs text-ink-600 hover:bg-red-50"
                >
                  ×
                </button>
              </div>
              <ResourceRichTextEditor
                id={`intro-history-${index}`}
                label={labels.historyLines}
                value={getBodyHtml({ html: item.html, paragraphs: item.lines })}
                editorClassName="min-h-[6rem]"
                onChange={(html) => {
                  const history = [...content.history];
                  history[index] = {
                    ...item,
                    html: emptyToStoredHtml(html),
                    lines: item.lines,
                  };
                  patch({ history });
                }}
              />
            </div>
          ))}
        </section>
      </div>
    );
  }

  if (segment === "calendar") {
    const cal = content.calendar;
    return (
      <div className="space-y-6">
        <Field label={labels.calendarTitle}>
          <TextInput
            multiline
            rows={4}
            value={cal.title}
            onChange={(title) => patch({ calendar: { ...cal, title } })}
          />
        </Field>
        <Field label={labels.monthWeekHeader}>
          <TextInput
            value={cal.monthWeekHeader}
            onChange={(monthWeekHeader) => patch({ calendar: { ...cal, monthWeekHeader } })}
          />
        </Field>
        <div className="space-y-3">
          <p className="text-sm font-medium text-ink-700">월별 일정</p>
          {cal.rows.map((row, index) => (
            <div key={index} className="grid gap-2 rounded-lg border border-ink-200 p-3 sm:grid-cols-2">
              <Field label={labels.month}>
                <TextInput
                  value={row.month}
                  onChange={(month) => updateRow(index, { ...row, month })}
                />
              </Field>
              {(["w1", "w2", "w3", "w4", "w5"] as const).map((key, weekIndex) => (
                <Field key={key} label={`${labels.week} ${weekIndex + 1}`}>
                  <TextInput
                    multiline
                    rows={2}
                    value={row[key]}
                    onChange={(value) => updateRow(index, { ...row, [key]: value })}
                  />
                </Field>
              ))}
            </div>
          ))}
        </div>
        <StringListEditor
          label={labels.footnotes}
          values={cal.footnotes}
          addLabel={labels.addItem}
          multiline
          onChange={(footnotes) => patch({ calendar: { ...cal, footnotes } })}
        />
        <Field label={labels.schoolHolidaysTitle}>
          <TextInput
            value={cal.schoolHolidaysTitle}
            onChange={(schoolHolidaysTitle) => patch({ calendar: { ...cal, schoolHolidaysTitle } })}
          />
        </Field>
        <div className="space-y-2">
          <div className="flex justify-between">
            <p className="text-sm font-medium text-ink-700">방학</p>
            <button
              type="button"
              onClick={() =>
                patch({
                  calendar: {
                    ...cal,
                    schoolHolidays: [...cal.schoolHolidays, { label: "", range: "" }],
                  },
                })
              }
              className="rounded-md border border-ink-200 px-2 py-1 text-xs font-medium text-ink-700 hover:bg-ink-50"
            >
              {labels.addHoliday}
            </button>
          </div>
          {cal.schoolHolidays.map((item, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 rounded-lg border border-ink-200 p-3 sm:flex-row"
            >
              <Field label={labels.holidayLabel}>
                <TextInput
                  value={item.label}
                  onChange={(label) => {
                    const schoolHolidays = [...cal.schoolHolidays];
                    schoolHolidays[index] = { ...item, label };
                    patch({ calendar: { ...cal, schoolHolidays } });
                  }}
                />
              </Field>
              <Field label={labels.holidayRange}>
                <TextInput
                  value={item.range}
                  onChange={(range) => {
                    const schoolHolidays = [...cal.schoolHolidays];
                    schoolHolidays[index] = { ...item, range };
                    patch({ calendar: { ...cal, schoolHolidays } });
                  }}
                />
              </Field>
              <button
                type="button"
                onClick={() =>
                  patch({
                    calendar: {
                      ...cal,
                      schoolHolidays: cal.schoolHolidays.filter((_, i) => i !== index),
                    },
                  })
                }
                className="self-end rounded-md border border-ink-200 px-2 py-1 text-xs text-ink-600 hover:bg-red-50"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <Field label={labels.publicHolidaysTitle}>
          <TextInput
            value={cal.publicHolidaysTitle}
            onChange={(publicHolidaysTitle) =>
              patch({ calendar: { ...cal, publicHolidaysTitle } })
            }
          />
        </Field>
        <div className="space-y-2">
          <div className="flex justify-between">
            <p className="text-sm font-medium text-ink-700">공휴일</p>
            <button
              type="button"
              onClick={() =>
                patch({
                  calendar: {
                    ...cal,
                    publicHolidays: [...cal.publicHolidays, { name: "", date: "" }],
                  },
                })
              }
              className="rounded-md border border-ink-200 px-2 py-1 text-xs font-medium text-ink-700 hover:bg-ink-50"
            >
              {labels.addPublicHoliday}
            </button>
          </div>
          {cal.publicHolidays.map((item, index) => (
            <div
              key={index}
              className="grid gap-2 rounded-lg border border-ink-200 p-3 sm:grid-cols-3"
            >
              <Field label={labels.holidayName}>
                <TextInput
                  value={item.name}
                  onChange={(name) => {
                    const publicHolidays = [...cal.publicHolidays];
                    publicHolidays[index] = { ...item, name };
                    patch({ calendar: { ...cal, publicHolidays } });
                  }}
                />
              </Field>
              <Field label={labels.holidayDate}>
                <TextInput
                  value={item.date}
                  onChange={(date) => {
                    const publicHolidays = [...cal.publicHolidays];
                    publicHolidays[index] = { ...item, date };
                    patch({ calendar: { ...cal, publicHolidays } });
                  }}
                />
              </Field>
              <Field label={labels.holidayNote}>
                <TextInput
                  value={item.note ?? ""}
                  onChange={(note) => {
                    const publicHolidays = [...cal.publicHolidays];
                    publicHolidays[index] = { ...item, note: note || undefined };
                    patch({ calendar: { ...cal, publicHolidays } });
                  }}
                />
              </Field>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const dir = content.directions;
  return (
    <div className="space-y-3">
      <Field label={labels.titlePrimary}>
        <TextInput
          value={dir.titlePrimary}
          onChange={(titlePrimary) => patch({ directions: { ...dir, titlePrimary } })}
        />
      </Field>
      <Field label={labels.titleSecondary}>
        <TextInput
          value={dir.titleSecondary}
          onChange={(titleSecondary) => patch({ directions: { ...dir, titleSecondary } })}
        />
      </Field>
      <Field label={labels.teachingSitesLabel}>
        <TextInput
          value={dir.teachingSitesLabel}
          onChange={(teachingSitesLabel) => patch({ directions: { ...dir, teachingSitesLabel } })}
        />
      </Field>
      <ResourceRichTextEditor
        id="intro-directions-body"
        label={labels.lines}
        value={getBodyHtml({ html: dir.html, paragraphs: dir.lines })}
        editorClassName="min-h-[10rem]"
        onChange={(html) =>
          patch({
            directions: {
              ...dir,
              html: emptyToStoredHtml(html),
              lines: dir.lines,
            },
          })
        }
      />
      <StringListEditor
        label={labels.phones}
        values={dir.phones}
        addLabel={labels.addItem}
        onChange={(phones) => patch({ directions: { ...dir, phones } })}
      />
      <Field label={labels.emailLine}>
        <TextInput
          value={dir.emailLine}
          onChange={(emailLine) => patch({ directions: { ...dir, emailLine } })}
        />
      </Field>
      <Field label={labels.mapLabel}>
        <TextInput
          value={dir.mapLabel}
          onChange={(mapLabel) => patch({ directions: { ...dir, mapLabel } })}
        />
      </Field>
      <Field label={labels.mapPangea}>
        <TextInput
          value={dir.mapPangea}
          onChange={(mapPangea) => patch({ directions: { ...dir, mapPangea } })}
        />
      </Field>
      <Field label={labels.mapRuppin}>
        <TextInput
          value={dir.mapRuppin}
          onChange={(mapRuppin) => patch({ directions: { ...dir, mapRuppin } })}
        />
      </Field>
    </div>
  );
}
