"use client";

import { useEffect, useMemo, useState } from "react";
import InstagramFeed from "@/components/InstagramFeed";
import PhotoGallery from "@/components/PhotoGallery";
import SiteRichHtml from "@/components/SiteRichHtml";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import instagramFeedJson from "@/lib/data/instagramFeed.json";
import type { InstagramFeedFile } from "@/lib/types/instagramFeed";
import { getHeadingTag, type HeadingLevel } from "@/features/shared/sectionHeading";
import {
  fetchPublishedGalleryImages,
  getGalleryPublicUrl,
} from "@/lib/gallery/api";
import { getImagePath } from "@/lib/utils/imagePath";

const FALLBACK_PHOTOS = Array.from({ length: 12 }, (_, i) => ({
  src: getImagePath(`/images/photo-${i + 1}.jpg`),
  alt: "",
}));

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
  const [remotePhotos, setRemotePhotos] = useState<{ src: string; alt: string }[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchPublishedGalleryImages().then((rows) => {
      if (cancelled) return;
      if (rows.length === 0) {
        setRemotePhotos([]);
        return;
      }
      setRemotePhotos(
        rows.map((row) => ({
          src: getGalleryPublicUrl(row.storage_path),
          alt: row.alt_text,
        }))
      );
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const photos = useMemo(() => {
    if (remotePhotos === null) return [];
    if (remotePhotos.length > 0) return remotePhotos;
    return FALLBACK_PHOTOS;
  }, [remotePhotos]);

  return (
    <section id={id} className={className}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-secondary-600/80">
            {t("gallery.label")}
          </p>
          <HeadingTag className="mt-3 font-sans text-2xl font-bold text-ink-900 sm:text-3xl md:text-4xl">
            {t("gallery.title")}
          </HeadingTag>
          <SiteRichHtml
            text={t("gallery.lead")}
            className="mx-auto mt-4 max-w-2xl text-ink-600"
          />
          <SiteRichHtml
            text={t("gallery.legacyNote")}
            className="mx-auto mt-4 max-w-2xl text-left text-sm leading-relaxed text-ink-500 sm:text-center"
          />
        </div>
        <div className="mt-12">
          <PhotoGallery photos={photos} altPrefix={t("gallery.alt")} />
        </div>
        <InstagramFeed feed={instagramFeed} />
      </div>
    </section>
  );
}
