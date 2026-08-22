"use client";

import SiteRichHtml from "@/components/SiteRichHtml";
import { useIntroductionContent } from "@/lib/hooks/useIntroductionContent";
import { useSubcategoryLabel } from "@/lib/hooks/useSiteSubnav";

export default function GreetingSection() {
  const title = useSubcategoryLabel("introduction", "greeting");
  const { greeting } = useIntroductionContent();

  return (
    <section className="space-y-4" aria-labelledby="page-heading">
      <h2
        id="page-heading"
        className="border-b border-brand-200/80 pb-2 font-sans text-2xl font-bold text-ink-900"
      >
        {title}
      </h2>
      <SiteRichHtml
        html={greeting.html}
        paragraphs={greeting.paragraphs}
        className="space-y-4 text-[15px] leading-relaxed text-ink-700 sm:text-base [&_p]:mb-4 [&_p:last-child]:mb-0"
      />
    </section>
  );
}
