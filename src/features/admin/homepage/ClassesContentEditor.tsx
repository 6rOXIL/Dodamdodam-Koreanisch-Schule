"use client";

import ResourceRichTextEditor from "@/components/ResourceRichTextEditor";
import type {
  AdultClassTier,
  ClassLevelBlock,
  ClassScheduleRow,
  ClassesContent,
} from "@/lib/data/classes";
import { emptyToStoredHtml, getBodyHtml } from "@/lib/siteContent/richText";
import { Field, StringListEditor, TextInput } from "./FormFields";

type Props = {
  content: ClassesContent;
  onChange: (next: ClassesContent) => void;
  segment: "kindergarten" | "elementary" | "adults";
  labels: {
    addItem: string;
    scheduleTitle: string;
    scheduleGroupLabel: string;
    className: string;
    time: string;
    group: string;
    addScheduleRow: string;
    title: string;
    location: string;
    lead: string;
    paragraphs: string;
    bullets: string;
    textbooks: string;
    note: string;
    petalSection: string;
    fruitSection: string;
    tierName: string;
    tierSchedule: string;
    tierTuition: string;
    tierTextbook: string;
    addTier: string;
  };
};

function ScheduleEditor({
  rows,
  onChange,
  showGroup,
  labels,
}: {
  rows: ClassScheduleRow[];
  onChange: (rows: ClassScheduleRow[]) => void;
  showGroup?: boolean;
  labels: Props["labels"];
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <p className="text-sm font-medium text-ink-700">시간표</p>
        <button
          type="button"
          onClick={() =>
            onChange([...rows, showGroup ? { group: "", className: "", time: "" } : { className: "", time: "" }])
          }
          className="rounded-md border border-ink-200 px-2 py-1 text-xs font-medium text-ink-700 hover:bg-ink-50"
        >
          {labels.addScheduleRow}
        </button>
      </div>
      {rows.map((row, index) => (
        <div key={index} className="grid gap-2 rounded-lg border border-ink-200 p-3 sm:grid-cols-3">
          {showGroup ? (
            <Field label={labels.group}>
              <TextInput
                value={row.group ?? ""}
                onChange={(group) => {
                  const next = [...rows];
                  next[index] = { ...row, group };
                  onChange(next);
                }}
              />
            </Field>
          ) : null}
          <Field label={labels.className}>
            <TextInput
              value={row.className}
              onChange={(className) => {
                const next = [...rows];
                next[index] = { ...row, className };
                onChange(next);
              }}
            />
          </Field>
          <Field label={labels.time}>
            <TextInput
              value={row.time}
              onChange={(time) => {
                const next = [...rows];
                next[index] = { ...row, time };
                onChange(next);
              }}
            />
          </Field>
          <button
            type="button"
            onClick={() => onChange(rows.filter((_, i) => i !== index))}
            className="justify-self-start rounded-md border border-ink-200 px-2 py-1 text-xs text-ink-600 hover:bg-red-50 sm:col-span-3"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

function LevelBlockEditor({
  block,
  onChange,
  labels,
}: {
  block: ClassLevelBlock;
  onChange: (block: ClassLevelBlock) => void;
  labels: Props["labels"];
}) {
  return (
    <div className="space-y-3">
      <Field label={labels.title}>
        <TextInput value={block.title} onChange={(title) => onChange({ ...block, title })} />
      </Field>
      <Field label={labels.location}>
        <TextInput
          multiline
          value={block.location ?? ""}
          onChange={(location) => onChange({ ...block, location })}
        />
      </Field>
      <Field label={labels.lead}>
        <TextInput
          multiline
          value={block.lead ?? ""}
          onChange={(lead) => onChange({ ...block, lead })}
        />
      </Field>
      <ResourceRichTextEditor
        id={`class-body-${block.title}`}
        label={labels.paragraphs}
        value={getBodyHtml({ html: block.bodyHtml, paragraphs: block.paragraphs })}
        editorClassName="min-h-[12rem]"
        onChange={(html) =>
          onChange({
            ...block,
            bodyHtml: emptyToStoredHtml(html),
            paragraphs: undefined,
          })
        }
      />
      <StringListEditor
        label={labels.bullets}
        values={block.bullets ?? []}
        addLabel={labels.addItem}
        onChange={(bullets) => onChange({ ...block, bullets })}
      />
      <StringListEditor
        label={labels.textbooks}
        values={block.textbooks ?? []}
        addLabel={labels.addItem}
        onChange={(textbooks) => onChange({ ...block, textbooks })}
      />
      <Field label={labels.note}>
        <TextInput
          multiline
          value={block.note ?? ""}
          onChange={(note) => onChange({ ...block, note })}
        />
      </Field>
    </div>
  );
}

export default function ClassesContentEditor({ content, onChange, segment, labels }: Props) {
  if (segment === "kindergarten") {
    const k = content.kindergarten;
    return (
      <div className="space-y-4">
        <Field label={labels.scheduleTitle}>
          <TextInput
            value={k.scheduleTitle}
            onChange={(scheduleTitle) => onChange({ ...content, kindergarten: { ...k, scheduleTitle } })}
          />
        </Field>
        <Field label={labels.scheduleGroupLabel}>
          <TextInput
            value={k.scheduleGroupLabel}
            onChange={(scheduleGroupLabel) =>
              onChange({ ...content, kindergarten: { ...k, scheduleGroupLabel } })
            }
          />
        </Field>
        <ScheduleEditor
          rows={k.schedule ?? []}
          labels={labels}
          onChange={(schedule) => onChange({ ...content, kindergarten: { ...k, schedule } })}
        />
        <LevelBlockEditor
          block={k}
          labels={labels}
          onChange={(block) =>
            onChange({
              ...content,
              kindergarten: {
                ...block,
                scheduleTitle: k.scheduleTitle,
                scheduleGroupLabel: k.scheduleGroupLabel,
                schedule: k.schedule,
              },
            })
          }
        />
      </div>
    );
  }

  if (segment === "elementary") {
    const e = content.elementary;
    return (
      <div className="space-y-6">
        <Field label={labels.scheduleTitle}>
          <TextInput
            value={e.scheduleTitle}
            onChange={(scheduleTitle) => onChange({ ...content, elementary: { ...e, scheduleTitle } })}
          />
        </Field>
        <ScheduleEditor
          rows={e.schedule}
          showGroup
          labels={labels}
          onChange={(schedule) => onChange({ ...content, elementary: { ...e, schedule } })}
        />
        <section className="space-y-3">
          <h3 className="text-base font-semibold text-ink-900">{labels.petalSection}</h3>
          <LevelBlockEditor
            block={e.petalSection}
            labels={labels}
            onChange={(petalSection) => onChange({ ...content, elementary: { ...e, petalSection } })}
          />
        </section>
        <section className="space-y-3">
          <h3 className="text-base font-semibold text-ink-900">{labels.fruitSection}</h3>
          <LevelBlockEditor
            block={e.fruitSection}
            labels={labels}
            onChange={(fruitSection) => onChange({ ...content, elementary: { ...e, fruitSection } })}
          />
        </section>
      </div>
    );
  }

  const adults = content.adults;
  return (
    <div className="space-y-4">
      <Field label={labels.title}>
        <TextInput
          value={adults.title}
          onChange={(title) => onChange({ ...content, adults: { ...adults, title } })}
        />
      </Field>
      <div className="flex justify-between">
        <p className="text-sm font-medium text-ink-700">반 구성</p>
        <button
          type="button"
          onClick={() =>
            onChange({
              ...content,
              adults: {
                ...adults,
                tiers: [...adults.tiers, { name: "", schedule: "", tuition: "", textbook: "" }],
              },
            })
          }
          className="rounded-md border border-ink-200 px-2 py-1 text-xs font-medium text-ink-700 hover:bg-ink-50"
        >
          {labels.addTier}
        </button>
      </div>
      {adults.tiers.map((tier: AdultClassTier, index) => (
        <div key={index} className="space-y-2 rounded-lg border border-ink-200 p-3">
          <Field label={labels.tierName}>
            <TextInput
              value={tier.name}
              onChange={(name) => {
                const tiers = [...adults.tiers];
                tiers[index] = { ...tier, name };
                onChange({ ...content, adults: { ...adults, tiers } });
              }}
            />
          </Field>
          <Field label={labels.tierSchedule}>
            <TextInput
              value={tier.schedule}
              onChange={(schedule) => {
                const tiers = [...adults.tiers];
                tiers[index] = { ...tier, schedule };
                onChange({ ...content, adults: { ...adults, tiers } });
              }}
            />
          </Field>
          <Field label={labels.tierTuition}>
            <TextInput
              value={tier.tuition}
              onChange={(tuition) => {
                const tiers = [...adults.tiers];
                tiers[index] = { ...tier, tuition };
                onChange({ ...content, adults: { ...adults, tiers } });
              }}
            />
          </Field>
          <Field label={labels.tierTextbook}>
            <TextInput
              value={tier.textbook}
              onChange={(textbook) => {
                const tiers = [...adults.tiers];
                tiers[index] = { ...tier, textbook };
                onChange({ ...content, adults: { ...adults, tiers } });
              }}
            />
          </Field>
          <button
            type="button"
            onClick={() =>
              onChange({
                ...content,
                adults: { ...adults, tiers: adults.tiers.filter((_, i) => i !== index) },
              })
            }
            className="rounded-md border border-ink-200 px-2 py-1 text-xs text-ink-600 hover:bg-red-50"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
