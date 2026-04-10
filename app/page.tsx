"use client";

import Image from "next/image";
import PhotoGallery from "./components/PhotoGallery";
import { useLanguage } from "./contexts/LanguageContext";
import { getImagePath } from "./utils/imagePath";

const GALLERY_PHOTOS = Array.from({ length: 12 }, (_, i) => `photo-${i + 1}.jpg`);

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="bg-white text-slate-900">
      {/* Hero — full-bleed welcome (참고: berlin-vision.de 스타일) */}
      <section
        id="home"
        className="relative flex min-h-[min(100dvh,900px)] items-center justify-center overflow-hidden sm:min-h-[85vh]"
      >
        <Image
          src={getImagePath("/images/photo-1.jpg")}
          alt={t("hero.title")}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/65 via-slate-900/50 to-slate-900/75" aria-hidden />
        <div className="relative z-10 mx-auto max-w-4xl px-4 py-16 text-center text-white sm:px-6 sm:py-24">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-amber-200/95 sm:text-xs sm:tracking-[0.35em]">
            {t("hero.welcome")}
          </p>
          <h1 className="mt-3 font-serif text-2xl font-bold leading-snug sm:mt-4 sm:text-4xl sm:leading-tight md:text-5xl">
            {t("hero.title")}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-white/90 sm:mt-6 sm:text-lg md:text-xl">
            {t("hero.subtitle")}
          </p>
          <button
            type="button"
            onClick={() =>
              document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
            }
            className="mt-8 inline-flex min-h-12 w-full max-w-xs items-center justify-center rounded-full border border-white/40 bg-white/10 px-8 py-3 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/20 sm:mt-10 sm:w-auto"
          >
            {t("hero.cta")}
          </button>
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="scroll-mt-[calc(4rem+env(safe-area-inset-top,0px))] border-b border-slate-100 bg-white py-14 sm:py-20 md:py-28"
      >
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 md:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-800/80">
            {t("about.label")}
          </p>
          <h2 className="mt-3 font-serif text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">
            {t("about.title")}
          </h2>
          <p className="mt-6 text-[15px] leading-relaxed text-slate-600 sm:mt-8 sm:text-base md:text-lg">
            {t("about.body")}
          </p>
        </div>
      </section>

      {/* Vision — 3 cards */}
      <section
        id="vision"
        className="scroll-mt-[calc(4rem+env(safe-area-inset-top,0px))] bg-slate-50 py-14 sm:py-20 md:py-28"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-800/80">
              {t("vision.label")}
            </p>
            <h2 className="mt-3 font-serif text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">
              {t("vision.title")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] text-slate-600 sm:text-base">
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
                className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:shadow-md sm:p-8"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-amber-800/90">
                  {card.sub}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">{card.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">{card.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Teachers */}
      <section
        id="teachers"
        className="scroll-mt-[calc(4rem+env(safe-area-inset-top,0px))] border-b border-slate-100 bg-white py-14 sm:py-20 md:py-28"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-800/80">
              {t("teachers.label")}
            </p>
            <h2 className="mt-3 font-serif text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">
              {t("teachers.title")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600">{t("teachers.lead")}</p>
          </div>
          <div className="mt-12 flex justify-center">
            <div className="max-w-md rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 px-5 py-12 text-center text-sm text-slate-500 sm:px-8 sm:py-14 sm:text-base">
              {t("teachers.placeholder")}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section
        id="gallery"
        className="scroll-mt-[calc(4rem+env(safe-area-inset-top,0px))] bg-white py-14 sm:py-20 md:py-28"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-800/80">
              {t("gallery.label")}
            </p>
            <h2 className="mt-3 font-serif text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">
              {t("gallery.title")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600">{t("gallery.lead")}</p>
          </div>
          <div className="mt-12">
            <PhotoGallery photos={GALLERY_PHOTOS} altPrefix={t("gallery.alt")} />
          </div>
        </div>
      </section>

      {/* Events / news */}
      <section
        id="events"
        className="scroll-mt-[calc(4rem+env(safe-area-inset-top,0px))] bg-slate-50 py-14 sm:py-20 md:py-28"
      >
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 md:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-800/80">
            {t("events.label")}
          </p>
          <h2 className="mt-3 font-serif text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">
            {t("events.title")}
          </h2>
          <p className="mt-4 text-slate-600">{t("events.lead")}</p>
          <p className="mt-10 rounded-2xl border border-slate-200 bg-white px-6 py-12 text-slate-500 shadow-sm">
            {t("events.empty")}
          </p>
        </div>
      </section>

      {/* Schedule */}
      <section
        id="schedule"
        className="scroll-mt-[calc(4rem+env(safe-area-inset-top,0px))] border-t border-slate-100 bg-white py-14 sm:py-20 md:py-28"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-800/80">
              {t("schedule.label")}
            </p>
            <h2 className="mt-3 font-serif text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">
              {t("schedule.title")}
            </h2>
            <p className="mt-4 text-slate-600">{t("schedule.lead")}</p>
          </div>
          <div className="mt-10 grid gap-4 sm:mt-12 sm:gap-6 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-slate-900">{t("schedule.class1Title")}</h3>
              <p className="mt-2 break-words text-xl font-bold text-amber-900 sm:text-2xl">
                {t("schedule.class1Time")}
              </p>
              <p className="mt-3 text-sm text-slate-600">{t("schedule.class1Note")}</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-slate-900">{t("schedule.class2Title")}</h3>
              <p className="mt-2 break-words text-xl font-bold text-amber-900 sm:text-2xl">
                {t("schedule.class2Time")}
              </p>
              <p className="mt-3 text-sm text-slate-600">{t("schedule.class2Note")}</p>
            </article>
          </div>
          <p className="mt-8 text-center text-sm text-slate-500">{t("schedule.note")}</p>
        </div>
      </section>

      {/* Location */}
      <section
        id="location"
        className="scroll-mt-[calc(4rem+env(safe-area-inset-top,0px))] bg-slate-900 py-14 text-white sm:py-20 md:py-28"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-200/90">
              {t("location.label")}
            </p>
            <h2 className="mt-3 font-serif text-2xl font-bold sm:text-3xl md:text-4xl">
              {t("location.title")}
            </h2>
          </div>
          <div className="mt-10 grid gap-8 sm:mt-12 md:grid-cols-2 md:gap-16">
            <div>
              <h3 className="text-sm font-semibold text-amber-200/95">{t("location.addressLabel")}</h3>
              <p className="mt-2 break-words whitespace-pre-line text-white/90">{t("location.address")}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-amber-200/95">{t("location.contactLabel")}</h3>
              <p className="mt-2 text-white/90">{t("location.phone")}</p>
              <a
                href={`mailto:${t("location.email")}`}
                className="mt-1 inline-block text-amber-200 underline-offset-4 hover:underline"
              >
                {t("location.email")}
              </a>
            </div>
          </div>
          <div className="mt-10 flex justify-center">
            <a
              href="https://www.google.com/maps"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 min-w-[12rem] items-center justify-center rounded-full border border-white/30 bg-white/10 px-8 py-3 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/20"
            >
              {t("location.mapCta")}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
