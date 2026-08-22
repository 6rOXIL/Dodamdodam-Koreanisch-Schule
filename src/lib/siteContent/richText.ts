import {
  isResourceHtml,
  sanitizeResourceHtml,
  toEditorHtml,
} from "@/lib/resources/sanitizeResourceHtml";

export function paragraphsToHtml(paragraphs: string[]): string {
  if (!paragraphs.length) return "";
  return paragraphs
    .map((p) => {
      const escaped = p
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
      return `<p>${escaped.replace(/\n/g, "<br>")}</p>`;
    })
    .join("");
}

/** paragraphs / html / plain text → 에디터·표시용 HTML */
export function getBodyHtml(source: {
  html?: string;
  bodyHtml?: string;
  paragraphs?: readonly string[];
  text?: string;
}): string {
  const html = source.html ?? source.bodyHtml;
  if (html?.trim()) {
    return isResourceHtml(html) ? sanitizeResourceHtml(html) : toEditorHtml(html);
  }
  if (source.paragraphs?.length) return paragraphsToHtml([...source.paragraphs]);
  if (source.text?.trim()) {
    return isResourceHtml(source.text)
      ? sanitizeResourceHtml(source.text)
      : toEditorHtml(source.text);
  }
  return "";
}

export function emptyToStoredHtml(html: string): string {
  return html.trim() ? sanitizeResourceHtml(html) : "";
}
