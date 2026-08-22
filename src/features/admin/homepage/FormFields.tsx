"use client";

import type { ReactNode } from "react";

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-ink-700">{label}</span>
      {children}
      {hint ? <span className="block text-xs text-ink-500">{hint}</span> : null}
    </label>
  );
}

export function TextInput({
  value,
  onChange,
  multiline,
  rows = 3,
}: {
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  rows?: number;
}) {
  const className =
    "w-full rounded-lg border border-ink-200 bg-surface px-3 py-2 text-sm text-ink-900 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100";
  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className={className}
      />
    );
  }
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
    />
  );
}

export function StringListEditor({
  label,
  values,
  onChange,
  addLabel,
  multiline,
}: {
  label: string;
  values: string[];
  onChange: (next: string[]) => void;
  addLabel: string;
  multiline?: boolean;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-ink-700">{label}</p>
        <button
          type="button"
          onClick={() => onChange([...values, ""])}
          className="rounded-md border border-ink-200 px-2 py-1 text-xs font-medium text-ink-700 hover:bg-ink-50"
        >
          {addLabel}
        </button>
      </div>
      <div className="space-y-2">
        {values.map((item, index) => (
          <div key={index} className="flex gap-2">
            <div className="min-w-0 flex-1">
              <TextInput
                value={item}
                multiline={multiline}
                rows={multiline ? 3 : undefined}
                onChange={(value) => {
                  const next = [...values];
                  next[index] = value;
                  onChange(next);
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => onChange(values.filter((_, i) => i !== index))}
              className="shrink-0 rounded-md border border-ink-200 px-2 py-1 text-xs text-ink-600 hover:bg-red-50 hover:text-red-700"
              aria-label="remove"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
