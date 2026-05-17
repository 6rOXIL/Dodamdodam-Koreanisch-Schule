import Image from "next/image";
import { Fragment } from "react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { getImagePath } from "@/lib/utils/imagePath";

export type KoOnlyParagraphImage = {
  afterParagraphIndex: number;
  src: string;
  alt: string;
};

type Props = {
  title: string;
  location?: string;
  locationLabel: string;
  lead?: string;
  paragraphs?: readonly string[];
  bullets?: readonly string[];
  textbooks?: readonly string[];
  note?: string;
  koOnlyImage?: KoOnlyParagraphImage;
};

export default function ClassDetailBlock({
  title,
  location,
  locationLabel,
  lead,
  paragraphs,
  bullets,
  textbooks,
  note,
  koOnlyImage,
}: Props) {
  const { language } = useLanguage();
  return (
    <article className="space-y-4 rounded-xl border border-ink-200 bg-surface p-4 sm:p-5">
      <h3 className="font-semibold text-ink-900">{title}</h3>
      {location && (
        <div className="rounded-lg border-l-4 border-brand-300 bg-brand-50/40 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-900">
            {locationLabel}
          </p>
          <p className="mt-1 whitespace-pre-line text-sm text-ink-800">{location}</p>
        </div>
      )}
      {lead && <p className="font-medium text-ink-800">{lead}</p>}
      {paragraphs?.map((p, i) => (
        <Fragment key={i}>
          <p className="leading-relaxed text-ink-700">{p}</p>
          {language === "ko" &&
            koOnlyImage &&
            koOnlyImage.afterParagraphIndex === i && (
              <figure className="my-2 w-1/2 max-w-full overflow-hidden rounded-xl border border-ink-200 bg-ink-50 shadow-sm">
                <Image
                  src={getImagePath(koOnlyImage.src)}
                  alt={koOnlyImage.alt}
                  width={800}
                  height={500}
                  className="h-auto w-full"
                  sizes="(max-width: 768px) 50vw, 336px"
                />
              </figure>
            )}
        </Fragment>
      ))}
      {bullets && bullets.length > 0 && (
        <ul className="list-none space-y-2 border-l-2 border-brand-200 pl-4">
          {bullets.map((item, i) => (
            <li key={i} className="flex gap-2 text-ink-700">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
      {textbooks && textbooks.length > 0 && (
        <ul className="space-y-1 text-sm text-ink-600">
          {textbooks.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      )}
      {note && <p className="text-sm text-ink-500">{note}</p>}
    </article>
  );
}
