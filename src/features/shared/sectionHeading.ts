export type HeadingLevel = 1 | 2;

export function getHeadingTag(level: HeadingLevel): "h1" | "h2" {
  return level === 1 ? "h1" : "h2";
}
