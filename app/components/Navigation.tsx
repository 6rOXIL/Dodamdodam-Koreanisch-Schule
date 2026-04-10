"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "../contexts/LanguageContext";
import { useEffect, useState } from "react";
import { SECTION_IDS, type SectionId } from "../navConfig";
import LanguageSwitcher from "./LanguageSwitcher";

const NAV_KEYS: { id: SectionId; labelKey: string }[] = [
  { id: "home", labelKey: "nav.home" },
  { id: "about", labelKey: "nav.about" },
  { id: "vision", labelKey: "nav.vision" },
  { id: "teachers", labelKey: "nav.teachers" },
  { id: "schedule", labelKey: "nav.schedule" },
  { id: "gallery", labelKey: "nav.gallery" },
  { id: "events", labelKey: "nav.events" },
  { id: "location", labelKey: "nav.location" },
];

const INTRO_HREF = "/introduction/greeting/";

function isHomePath(pathname: string | null) {
  return pathname === "/" || pathname === "";
}

function isIntroductionPath(pathname: string | null) {
  if (!pathname) return false;
  return pathname.includes("/introduction");
}

export default function Navigation() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState<SectionId>("home");
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHome = isHomePath(pathname);
  const isIntro = isIntroductionPath(pathname);

  useEffect(() => {
    if (!isHome) return;

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
  }, [isHome]);

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

  const navItemClass = (active: boolean) =>
    `whitespace-nowrap rounded-md px-2 py-2 text-sm transition-colors md:px-3 ${
      active ? "bg-amber-100 font-semibold text-amber-950" : "text-slate-700 hover:bg-slate-100"
    }`;

  const isAboutActive = isIntro || (isHome && activeSection === "about");

  const renderNavItem = (id: SectionId, labelKey: string, mobile = false) => {
    const baseClass = mobile
      ? `w-full rounded-xl px-4 py-4 text-left text-base ${
          (id === "about" ? isAboutActive : isHome && activeSection === id)
            ? "bg-amber-100 font-semibold text-amber-950"
            : "text-slate-800 active:bg-slate-100"
        }`
      : navItemClass(
          id === "about" ? isAboutActive : isHome && activeSection === id
        );

    if (id === "about") {
      return (
        <Link
          key={id}
          href={INTRO_HREF}
          className={baseClass}
          onClick={() => setMobileOpen(false)}
        >
          {t(labelKey)}
        </Link>
      );
    }

    if (isHome) {
      return (
        <button
          key={id}
          type="button"
          onClick={() => scrollToSection(id)}
          className={baseClass}
        >
          {t(labelKey)}
        </button>
      );
    }

    return (
      <Link
        key={id}
        href={`/#${id}`}
        className={baseClass}
        onClick={() => setMobileOpen(false)}
      >
        {t(labelKey)}
      </Link>
    );
  };

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

          {isHome ? (
            <button
              type="button"
              onClick={() => scrollToSection("home")}
              className="min-w-0 flex-1 text-left md:flex-none"
            >
              <span className="block truncate font-semibold text-slate-900 sm:text-base md:text-lg">
                {t("site.nameShort")}
              </span>
              <span className="hidden text-xs text-slate-500 sm:block">{t("site.nameEn")}</span>
            </button>
          ) : (
            <Link href="/" className="min-w-0 flex-1 text-left md:flex-none" onClick={() => setMobileOpen(false)}>
              <span className="block truncate font-semibold text-slate-900 sm:text-base md:text-lg">
                {t("site.nameShort")}
              </span>
              <span className="hidden text-xs text-slate-500 sm:block">{t("site.nameEn")}</span>
            </Link>
          )}
          <nav className="hidden flex-1 items-center justify-center gap-0.5 overflow-x-auto md:flex lg:gap-1">
            {NAV_KEYS.map(({ id, labelKey }) => renderNavItem(id, labelKey, false))}
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
            className="flex h-full max-h-[calc(100dvh-4rem-env(safe-area-inset-top,0px))] flex-col gap-0 overflow-y-auto overscroll-contain px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
            aria-label="모바일 메뉴"
          >
            {NAV_KEYS.map(({ id, labelKey }) => renderNavItem(id, labelKey, true))}
          </nav>
        </div>
      )}
    </>
  );
}
