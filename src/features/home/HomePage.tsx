"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { getImagePath } from "@/lib/utils/imagePath";
import { LEGACY_MAPS_SEARCH_URL } from "@/lib/data/legacySite";
import { AboutSection } from "@/features/about/AboutSection";
import { ScheduleSection } from "@/features/schedule/ScheduleSection";
import { GallerySection } from "@/features/gallery/GallerySection";
import { EventsSection } from "@/features/events/EventsSection";

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
        <div className="relative z-10 mx-auto max-w-4xl px-4 py-16 text-center text-surface sm:px-6 sm:py-24">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-brand-200/95 sm:text-xs sm:tracking-[0.35em]">
            {t("hero.welcome")}
          </p>
          <h1 className="mt-3 font-sans text-2xl font-bold leading-snug sm:mt-4 sm:text-4xl sm:leading-tight md:text-5xl">
            {t("hero.title")}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-surface/90 sm:mt-6 sm:text-lg md:text-xl">
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
      <section
        id="vision"
        className="scroll-mt-[calc(4rem+env(safe-area-inset-top,0px))] bg-surface-muted py-14 sm:py-20 md:py-28"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-600/80">
              {t("vision.label")}
            </p>
            <h2 className="mt-3 font-serif text-2xl font-bold text-ink-900 sm:text-3xl md:text-4xl">
              {t("vision.title")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] text-ink-600 sm:text-base">
              {t("vision.lead")}
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:mt-14 sm:gap-8 md:grid-cols-3">
            {[
              {
                title: t("vision.card1Title"),
                sub: t("vision.card1Subtitle"),
                body: t("vision.card1Body"),
              },
              {
                title: t("vision.card2Title"),
                sub: t("vision.card2Subtitle"),
                body: t("vision.card2Body"),
              },
              {
                title: t("vision.card3Title"),
                sub: t("vision.card3Subtitle"),
                body: t("vision.card3Body"),
              },
            ].map((card) => (
              <article
                key={card.title}
                className="rounded-2xl border border-ink-200/80 bg-surface p-6 shadow-sm transition hover:shadow-md sm:p-8"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-brand-600/90">
                  {card.sub}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-ink-900">{card.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-ink-600">{card.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Class */}
      <section
        id="classes"
        className="scroll-mt-[calc(4rem+env(safe-area-inset-top,0px))] border-b border-ink-100 bg-surface py-14 sm:py-20 md:py-28"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-600/80">
              {t("classes.label")}
            </p>
            <h2 className="mt-3 font-serif text-2xl font-bold text-ink-900 sm:text-3xl md:text-4xl">
              {t("classes.title")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-ink-600">{t("classes.lead")}</p>
          </div>
          <div className="mt-12 flex justify-center">
            <div className="max-w-md rounded-2xl border border-dashed border-ink-200 bg-surface-muted px-5 py-12 text-center text-sm text-ink-500 sm:px-8 sm:py-14 sm:text-base">
              {t("classes.placeholder")}
            </div>
          </div>
        </div>
      </section>

      {/* Schedule: 커리큘럼 게시판 + 요약 카드 */}
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
      <section
        id="location"
        className="scroll-mt-[calc(4rem+env(safe-area-inset-top,0px))] bg-surface-inverse py-14 text-on-inverse sm:py-20 md:py-28"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-300/90">
              {t("location.label")}
            </p>
            <h2 className="mt-3 font-serif text-2xl font-bold sm:text-3xl md:text-4xl">
              {t("location.title")}
            </h2>
          </div>
          <div className="mt-10 grid gap-8 sm:mt-12 md:grid-cols-2 md:gap-16">
            <div>
              <h3 className="text-sm font-semibold text-brand-300/95">{t("location.addressLabel1")}</h3>
              <p className="mt-2 mb-6 break-words whitespace-pre-line text-on-inverse/90">{t("location.address1")}</p>
              
              <h3 className="text-sm font-semibold text-brand-300/95">{t("location.addressLabel2")}</h3>
              <p className="mt-2 break-words whitespace-pre-line text-on-inverse/90">{t("location.address2")}</p>

            </div>
            <div>
              <h3 className="text-sm font-semibold text-brand-300/95">{t("location.contactLabel")}</h3>
              <p className="mt-2 text-on-inverse/90">{t("location.phone")}</p>
              <a
                href={`mailto:${t("location.email")}`}
                className="mt-1 inline-block text-brand-300 underline-offset-4 hover:underline"
              >
                {t("location.email")}
              </a>

              <h3 className="text-sm mt-6 font-semibold text-brand-300/95">{t("location.addressLabel3")}</h3>
              <p className="mt-2 break-words whitespace-pre-line text-on-inverse/90">{t("location.address3")}</p>

            </div>
          </div>
          <div className="mt-10 flex justify-center">
            <a
              href={LEGACY_MAPS_SEARCH_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 min-w-[12rem] items-center justify-center rounded-full border border-on-inverse/30 bg-on-inverse/10 px-8 py-3 text-sm font-semibold backdrop-blur-sm transition hover:bg-on-inverse/20"
            >
              {t("location.mapCta")}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
