"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import {
  googleMapsEmbedUrl,
  SCHOOL_LOCATION_IDS,
  SCHOOL_LOCATIONS,
  type SchoolLocationId,
} from "@/lib/data/locations";

type LocationMapVariant = "light" | "dark";

type LocationMapEmbedProps = {
  variant?: LocationMapVariant;
  collapsible?: boolean;
  defaultLocation?: SchoolLocationId;
};

const variantStyles: Record<
  LocationMapVariant,
  {
    toggle: string;
    tabActive: string;
    tabInactive: string;
    frame: string;
  }
> = {
  light: {
    toggle:
      "inline-flex min-h-12 min-w-[12rem] items-center justify-center rounded-full border border-brand-800/30 bg-brand-50 px-8 py-3 text-sm font-semibold text-brand-950 transition hover:bg-brand-100",
    tabActive: "border-brand-800 bg-brand-100 text-brand-950",
    tabInactive:
      "border-brand-800/25 bg-surface text-brand-900 hover:border-brand-800/40 hover:bg-brand-50",
    frame: "border border-ink-200/80 bg-surface",
  },
  dark: {
    toggle:
      "inline-flex min-h-12 min-w-[12rem] items-center justify-center rounded-full border border-on-inverse/30 bg-on-inverse/10 px-8 py-3 text-sm font-semibold backdrop-blur-sm transition hover:bg-on-inverse/20",
    tabActive: "border-on-inverse/50 bg-on-inverse/20 text-on-inverse",
    tabInactive:
      "border-on-inverse/25 bg-on-inverse/5 text-on-inverse/90 hover:border-on-inverse/40 hover:bg-on-inverse/10",
    frame: "border border-on-inverse/20 bg-on-inverse/5",
  },
};

export function LocationMapEmbed({
  variant = "light",
  collapsible = true,
  defaultLocation = "pangea",
}: LocationMapEmbedProps) {
  const { t, language } = useLanguage();
  const [open, setOpen] = useState(!collapsible);
  const [activeLocation, setActiveLocation] = useState<SchoolLocationId>(defaultLocation);
  const styles = variantStyles[variant];

  const mapSrc = googleMapsEmbedUrl(SCHOOL_LOCATIONS[activeLocation].query, language);

  return (
    <div className="w-full">
      {collapsible && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-controls="location-map-panel"
            className={styles.toggle}
          >
            {open ? t("location.mapHide") : t("location.mapCta")}
          </button>
        </div>
      )}

      {open && (
        <div
          id="location-map-panel"
          className={collapsible ? "mt-6 space-y-4" : "space-y-4"}
        >
          <div
            className="flex flex-wrap justify-center gap-2"
            role="tablist"
            aria-label={t("location.mapTabsLabel")}
          >
            {SCHOOL_LOCATION_IDS.map((id) => {
              const selected = activeLocation === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveLocation(id)}
                  className={`inline-flex items-center justify-center rounded-full border px-5 py-2.5 text-sm font-semibold transition ${selected ? styles.tabActive : styles.tabInactive}`}
                >
                  {t(`location.map${id === "pangea" ? "Pangea" : "Ruppin"}`)}
                </button>
              );
            })}
          </div>

          <div className={`overflow-hidden rounded-2xl shadow-sm ${styles.frame}`}>
            <iframe
              key={activeLocation}
              title={t(`location.map${activeLocation === "pangea" ? "Pangea" : "Ruppin"}`)}
              src={mapSrc}
              className="aspect-[4/3] h-auto min-h-[16rem] w-full sm:aspect-video sm:min-h-[20rem]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}
