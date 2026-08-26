"use client";

import { useLanguage } from "@/lib/contexts/LanguageContext";
import { getImagePath } from "@/lib/utils/imagePath";
import { AboutSection } from "@/features/about/AboutSection";
import { VisionSection } from "@/features/vision/VisionSection";
import { ClassesSection } from "@/features/classes/ClassesSection";
import { EnrollmentSection } from "@/features/enrollment/EnrollmentSection";
import { TuitionSection } from "@/features/tuition/TuitionSection";
import { LocationSection } from "@/features/location/LocationSection";

const scrollMt =
  "scroll-mt-[calc(var(--site-header-height)+env(safe-area-inset-top,0px))]";

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <main className="bg-surface text-ink-900">
      {/* Hero — full-bleed welcome */}
      <section
        id="home"
        className="relative flex min-h-[min(100dvh,900px)] items-center justify-center overflow-hidden sm:min-h-[85vh]"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={getImagePath("/video/dodamdodam-video.mp4")} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900/65 via-ink-900/50 to-ink-900/75" aria-hidden />
        <div className="relative z-10 mx-auto max-w-4xl px-4 py-16 text-center text-surface sm:px-6 sm:py-24">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-secondary-300/95 sm:text-xs sm:tracking-[0.35em]">
            {t("hero.welcome")}
          </p>
          <h1 className="mt-3 font-sans text-2xl font-bold leading-snug sm:mt-4 sm:text-4xl sm:leading-tight md:text-5xl">
            {t("hero.title")}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-surface/90 sm:mt-6 sm:text-lg md:text-xl">
            {t("hero.subtitle")}
          </p>
          <a
            href="#about"
            className="mt-8 inline-flex min-h-12 w-full max-w-xs items-center justify-center rounded-full border border-surface/40 bg-surface/10 px-8 py-3 text-sm font-semibold backdrop-blur-sm transition hover:bg-surface/20 sm:mt-10 sm:w-auto"
          >
            {t("hero.cta")}
          </a>
        </div>
      </section>

      <AboutSection
        id="about"
        className={`${scrollMt} border-b border-ink-100 bg-surface py-14 sm:py-20 md:py-28`}
      />
      <VisionSection
        id="vision"
        className={`${scrollMt} bg-surface-muted py-14 sm:py-20 md:py-28`}
      />
      <ClassesSection
        id="classes"
        className={`${scrollMt} border-b border-ink-100 bg-surface py-14 sm:py-20 md:py-28`}
      />
      <EnrollmentSection
        id="enrollment"
        className={`${scrollMt} border-b border-ink-100 bg-surface-muted py-14 sm:py-20 md:py-28`}
      />
      <TuitionSection
        id="tuition"
        className={`${scrollMt} border-b border-ink-100 bg-surface py-14 sm:py-20 md:py-28`}
      />
      <LocationSection
        id="location"
        className={`${scrollMt} bg-ink-900 py-14 text-surface sm:py-20 md:py-28`}
      />
    </main>
  );
}
