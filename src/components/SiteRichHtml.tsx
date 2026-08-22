"use client";

import ResourceDescription from "@/components/ResourceDescription";
import { getBodyHtml } from "@/lib/siteContent/richText";

type Props = {
  html?: string;
  paragraphs?: readonly string[];
  text?: string;
  className?: string;
};

/** 본문 HTML 또는 레거시 문단 배열을 안전하게 렌더 */
export default function SiteRichHtml({ html, paragraphs, text, className = "" }: Props) {
  const content = getBodyHtml({ html, paragraphs, text });
  if (!content) return null;
  return <ResourceDescription content={content} className={className} />;
}
