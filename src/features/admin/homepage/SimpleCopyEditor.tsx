"use client";

import ResourceRichTextEditor from "@/components/ResourceRichTextEditor";
import { Field, TextInput } from "@/features/admin/homepage/FormFields";
import type { CopyField } from "@/lib/siteContent/copyFields";
import { emptyToStoredHtml } from "@/lib/siteContent/richText";

export default function SimpleCopyEditor({
  fields,
  values,
  onChange,
}: {
  fields: CopyField[];
  values: Record<string, string>;
  onChange: (next: Record<string, string>) => void;
}) {
  return (
    <div className="space-y-4">
      {fields.map((field) =>
        field.multiline ? (
          <ResourceRichTextEditor
            key={field.path}
            id={`copy-${field.path}`}
            label={field.label}
            value={values[field.path] ?? ""}
            editorClassName="min-h-[8rem]"
            onChange={(html) =>
              onChange({ ...values, [field.path]: emptyToStoredHtml(html) })
            }
          />
        ) : (
          <Field key={field.path} label={field.label}>
            <TextInput
              value={values[field.path] ?? ""}
              onChange={(value) => onChange({ ...values, [field.path]: value })}
            />
          </Field>
        )
      )}
    </div>
  );
}
