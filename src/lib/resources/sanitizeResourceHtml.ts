import DOMPurify from "isomorphic-dompurify";

const ALLOWED_TAGS = ["p", "br", "strong", "b", "em", "i", "u", "ul", "ol", "li", "a"] as const;
const ALLOWED_ATTR = ["href", "target", "rel"] as const;

export function isResourceHtml(content: string) {
  return /<[a-z][\s\S]*>/i.test(content);
}

/** Node(SSG)에는 DOMParser가 없으므로 문자열로 앵커 속성을 보정한다. */
function ensureSafeAnchorAttrs(html: string) {
  return html.replace(/<a\b([^>]*)>/gi, (_match, rawAttrs: string) => {
    let attrs = rawAttrs;
    if (/\btarget\s*=/i.test(attrs)) {
      attrs = attrs.replace(/\btarget\s*=\s*(["']).*?\1/i, 'target="_blank"');
    } else {
      attrs += ' target="_blank"';
    }
    if (/\brel\s*=/i.test(attrs)) {
      attrs = attrs.replace(/\brel\s*=\s*(["']).*?\1/i, 'rel="noopener noreferrer"');
    } else {
      attrs += ' rel="noopener noreferrer"';
    }
    return `<a${attrs}>`;
  });
}

export function sanitizeResourceHtml(html: string) {
  const sanitized = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [...ALLOWED_TAGS],
    ALLOWED_ATTR: [...ALLOWED_ATTR],
  });

  // Static export / Node prerender: DOMParser is browser-only.
  if (typeof DOMParser === "undefined") {
    return ensureSafeAnchorAttrs(sanitized);
  }

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
