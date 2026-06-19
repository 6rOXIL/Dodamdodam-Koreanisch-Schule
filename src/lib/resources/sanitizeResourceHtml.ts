import DOMPurify from "isomorphic-dompurify";

const ALLOWED_TAGS = ["p", "br", "strong", "b", "em", "i", "u", "ul", "ol", "li", "a"] as const;
const ALLOWED_ATTR = ["href", "target", "rel"] as const;

export function isResourceHtml(content: string) {
  return /<[a-z][\s\S]*>/i.test(content);
}

export function sanitizeResourceHtml(html: string) {
  const sanitized = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [...ALLOWED_TAGS],
    ALLOWED_ATTR: [...ALLOWED_ATTR],
  });

  const doc = new DOMParser().parseFromString(sanitized, "text/html");
  doc.querySelectorAll("a").forEach((anchor) => {
    anchor.setAttribute("target", "_blank");
    anchor.setAttribute("rel", "noopener noreferrer");
  });
  return doc.body.innerHTML;
}

export function getResourceHtmlText(html: string) {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS: [] }).replace(/\s+/g, " ").trim();
}

export function normalizeDescriptionForStorage(html: string): string | null {
  const sanitized = sanitizeResourceHtml(html);
  if (!getResourceHtmlText(sanitized)) return null;
  return sanitized;
}

export function toEditorHtml(value: string) {
  if (!value) return "";
  if (isResourceHtml(value)) return sanitizeResourceHtml(value);
  const escaped = value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  return `<p>${escaped.replace(/\n/g, "<br>")}</p>`;
}
