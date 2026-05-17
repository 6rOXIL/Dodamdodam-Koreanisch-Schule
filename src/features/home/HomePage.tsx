"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { getImagePath } from "@/lib/utils/imagePath";
import { AboutSection } from "@/features/about/AboutSection";
import { VisionSection } from "@/features/vision/VisionSection";
import { ScheduleSection } from "@/features/schedule/ScheduleSection";
import { GallerySection } from "@/features/gallery/GallerySection";
import { EventsSection } from "@/features/events/EventsSection";
import { LocationSection } from "@/features/location/LocationSection";

export default function HomePage() {
  const { t, language } = useLanguage();

  return (
    <main className="bg-surface text-ink-900">
      {/* Hero — full-bleed welcome (참고: berlin-vision.de 스타일) */}
      <section
        id="home"
        className="relative flex min-h-[min(100dvh,900px)] items-center justify-center overflow-hidden sm:min-h-[85vh]"
      >
        <Image
          src={getImagePath("/images/main.jpg")}
          alt={t("hero.title")}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900/65 via-ink-900/50 to-ink-900/75" aria-hidden />
        <div className="relative z-10 mx-auto max-w-4xl px-4 py-16 text-center text-white sm:px-6 sm:py-24">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-brand-200/95 sm:text-xs sm:tracking-[0.35em]">
            {t("hero.welcome")}
          </p>
          <h1 className="mt-3 font-sans text-2xl font-bold leading-snug sm:mt-4 sm:text-4xl sm:leading-tight md:text-5xl">
            {t("hero.title")}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-white/90 sm:mt-6 sm:text-lg md:text-xl">
            {t("hero.subtitle")}
          </p>
          <Link
            href={`/${language}/introduction/greeting/`}
            className="mt-8 inline-flex min-h-12 w-full max-w-xs items-center justify-center rounded-full border border-surface/40 bg-surface/10 px-8 py-3 text-sm font-semibold backdrop-blur-sm transition hover:bg-surface/20 sm:mt-10 sm:w-auto"
          >
            {t("hero.cta")}
          </Link>
        </div>
      </section>

      <AboutSection
        id="about"
        className="scroll-mt-[calc(4rem+env(safe-area-inset-top,0px))] border-b border-ink-100 bg-surface py-14 sm:py-20 md:py-28"
      />
      <VisionSection
        id="vision"
        className="scroll-mt-[calc(4rem+env(safe-area-inset-top,0px))] bg-ink-50 py-14 sm:py-20 md:py-28"
      />
      <ScheduleSection
        id="schedule"
        className="scroll-mt-[calc(4rem+env(safe-area-inset-top,0px))] border-t border-ink-100 bg-surface py-14 sm:py-20 md:py-28"
      />
      <GallerySection
        id="gallery"
        className="scroll-mt-[calc(4rem+env(safe-area-inset-top,0px))] bg-ink-50 py-14 sm:py-20 md:py-28"
      />
      <EventsSection
        id="events"
        className="scroll-mt-[calc(4rem+env(safe-area-inset-top,0px))] bg-surface py-14 sm:py-20 md:py-28"
      />
      <LocationSection
        id="location"
        className="scroll-mt-[calc(4rem+env(safe-area-inset-top,0px))] bg-ink-900 py-14 text-white sm:py-20 md:py-28"
      />
    </main>
  );
}
