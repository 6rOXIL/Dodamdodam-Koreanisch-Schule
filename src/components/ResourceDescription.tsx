"use client";

import {
  getResourceHtmlText,
  isResourceHtml,
  sanitizeResourceHtml,
} from "@/lib/resources/sanitizeResourceHtml";

const descriptionClassName =
  "resource-description mt-1 text-sm text-ink-600 [&_a]:text-brand-900 [&_a]:underline [&_li]:ml-4 [&_ol]:list-decimal [&_p+p]:mt-2 [&_ul]:list-disc";

type ResourceDescriptionProps = {
  content: string;
  className?: string;
};

export default function ResourceDescription({ content, className = "" }: ResourceDescriptionProps) {
  if (!content || !getResourceHtmlText(isResourceHtml(content) ? content : content)) {
    return null;
  }

  if (!isResourceHtml(content)) {
    return <p className={`mt-1 text-sm text-ink-600 ${className}`.trim()}>{content}</p>;
  }

  const safeHtml = sanitizeResourceHtml(content);
  if (!getResourceHtmlText(safeHtml)) return null;

  return (
    <div
      className={`${descriptionClassName} ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
