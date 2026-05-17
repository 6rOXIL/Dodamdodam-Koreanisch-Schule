"use client";

import InstagramFeed from "@/components/InstagramFeed";
import PhotoGallery from "@/components/PhotoGallery";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import instagramFeedJson from "@/lib/data/instagramFeed.json";
import type { InstagramFeedFile } from "@/lib/types/instagramFeed";
import { getHeadingTag, type HeadingLevel } from "@/features/shared/sectionHeading";

const GALLERY_PHOTOS = Array.from({ length: 12 }, (_, i) => `photo-${i + 1}.jpg`);
const instagramFeed = instagramFeedJson as InstagramFeedFile;

export function GallerySection({
  id,
  headingLevel = 2,
  className = "bg-ink-50 py-14 sm:py-20 md:py-28",
}: {
  id?: string;
  headingLevel?: HeadingLevel;
  className?: string;
}) {
  const { t } = useLanguage();
  const HeadingTag = getHeadingTag(headingLevel);

  return (
    <section id={id} className={className}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-800/80">
            {t("gallery.label")}
          </p>
          <HeadingTag className="mt-3 font-sans text-2xl font-bold text-ink-900 sm:text-3xl md:text-4xl">
            {t("gallery.title")}
          </HeadingTag>
          <p className="mx-auto mt-4 max-w-2xl text-ink-600">{t("gallery.lead")}</p>
          <p className="mx-auto mt-4 max-w-2xl text-left text-sm leading-relaxed text-ink-500 sm:text-center">
            {t("gallery.legacyNote")}
          </p>
        </div>
        <div className="mt-12">
          <PhotoGallery photos={GALLERY_PHOTOS} altPrefix={t("gallery.alt")} />
        </div>
        <InstagramFeed feed={instagramFeed} />
      </div>
    </section>
  );
}
