"use client";

import { useLanguage } from "../contexts/LanguageContext";
import { useEffect, useState } from "react";
import { SECTION_IDS, type SectionId } from "../navConfig";
import LanguageSwitcher from "./LanguageSwitcher";

const NAV_KEYS: { id: SectionId; labelKey: string }[] = [
  { id: "home", labelKey: "nav.home" },
  { id: "about", labelKey: "nav.about" },
  { id: "vision", labelKey: "nav.vision" },
  { id: "gallery", labelKey: "nav.gallery" },
  { id: "teachers", labelKey: "nav.teachers" },
  { id: "events", labelKey: "nav.events" },
  { id: "schedule", labelKey: "nav.schedule" },
  { id: "location", labelKey: "nav.location" },
];

export default function Navigation() {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState<SectionId>("home");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      let current: SectionId = "home";
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el) {
          const { offsetTop, offsetHeight } = el;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            current = id;
            break;
          }
        }
      }
      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const prev = document.body.style.overflow;
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = prev || "";
    }
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [mobileOpen]);

  const scrollToSection = (sectionId: SectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(sectionId);
    }
    setMobileOpen(false);
  };

  const navButtonClass = (id: SectionId) =>
    `whitespace-nowrap rounded-md px-2 py-2 text-sm transition-colors md:px-3 ${
      activeSection === id
        ? "bg-amber-100 font-semibold text-amber-950"
        : "text-slate-700 hover:bg-slate-100"
    }`;

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md pt-[env(safe-area-inset-top,0px)]">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-3 md:gap-4 md:px-6">
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg p-2 text-slate-800 md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("home")}
            className="min-w-0 flex-1 text-left md:flex-none"
          >
            <span className="block truncate font-semibold text-slate-900 sm:text-base md:text-lg">
              {t("site.nameShort")}
            </span>
            <span className="hidden text-xs text-slate-500 sm:block">
              {t("site.nameEn")}
            </span>
          </button>

          <nav className="hidden flex-1 items-center justify-center gap-0.5 overflow-x-auto md:flex lg:gap-1">
            {NAV_KEYS.map(({ id, labelKey }) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollToSection(id)}
                className={navButtonClass(id)}
              >
                {t(labelKey)}
              </button>
            ))}
          </nav>

          <div className="shrink-0">
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-white md:hidden"
          style={{
            paddingTop: "calc(4rem + env(safe-area-inset-top, 0px))",
          }}
        >
          <nav
            className="flex h-full max-h-[calc(100dvh-4rem-env(safe-area-inset-top,0px))] flex-col gap-0 overflow-y-auto overscroll-contain px-4 pb-[max(1.5rem,env(safe-area-inset-bottom)]"
            aria-label="모바일 메뉴"
          >
            {NAV_KEYS.map(({ id, labelKey }) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollToSection(id)}
                className={`w-full rounded-xl px-4 py-4 text-left text-base ${
                  activeSection === id
                    ? "bg-amber-100 font-semibold text-amber-950"
                    : "text-slate-800 active:bg-slate-100"
                }`}
              >
                {t(labelKey)}
              </button>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
