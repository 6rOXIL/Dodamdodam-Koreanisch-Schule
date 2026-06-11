export const SCHOOL_LOCATIONS = {
  pangea: {
    query: "Trautenaustraße 5, 10717 Berlin",
  },
  ruppin: {
    query: "Offenbacher Str. 5A, 14197 Berlin",
  },
} as const;

export type SchoolLocationId = keyof typeof SCHOOL_LOCATIONS;

export const SCHOOL_LOCATION_IDS = Object.keys(SCHOOL_LOCATIONS) as SchoolLocationId[];

export function googleMapsEmbedUrl(query: string, language: string): string {
  const q = encodeURIComponent(query);
  const hl = language === "ko" ? "ko" : language === "de" ? "de" : "en";
  return `https://maps.google.com/maps?q=${q}&hl=${hl}&z=16&output=embed`;
}

export const mapSearchUrls = {
  pangea:
    "https://www.google.com/maps/search/?api=1&query=Trautenaustra%C3%9Fe+5,+10717+Berlin",
  ruppin:
    "https://www.google.com/maps/search/?api=1&query=Offenbacher+Str.+5A,+14197+Berlin",
} as const;
