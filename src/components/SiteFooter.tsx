"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import {
  ENROLLMENT_GOOGLE_FORM_URL,
  isEnrollmentApplyPath,
} from "@/lib/forms/enrollment";

const FOOTER_LINKS = [
  { labelKey: "nav.classes", hrefPath: "/classes/" },
  { labelKey: "nav.enrollment", hrefPath: "/apply/" },
  { labelKey: "nav.tuition", hrefPath: "/tuition/" },
  { labelKey: "nav.location", hrefPath: "/location/" },
] as const;

const linkClass =
  "-mx-1 inline-block rounded-md px-1 py-2.5 text-ink-600 underline-offset-4 hover:text-brand-800 hover:underline";

export default function SiteFooter() {
  const { t, language } = useLanguage();

  return (
    <footer className="border-t border-ink-200 bg-ink-50">
      <div className="mx-auto max-w-6xl px-4 py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] md:px-8 md:py-12">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="font-semibold text-ink-900">{t("site.name")}</p>
            <p className="mt-1 text-sm text-ink-600">{t("site.nameEn")}</p>
            <p className="mt-6 text-sm font-medium text-ink-800">
              {t("footer.addressTitle")}
            </p>
            <div className="mt-2 space-y-3 text-sm text-ink-600">
              <div>
                <p className="mt-0.5 break-words whitespace-pre-line">{t("location.address1")}</p>
              </div>
              <div>
                <p className="mt-0.5 break-words whitespace-pre-line">{t("location.address2")}</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-ink-800">
              {t("footer.quickTitle")}
            </p>
            <ul className="mt-3 text-sm">
              {FOOTER_LINKS.map(({ labelKey, hrefPath }) => {
                const enrollment = isEnrollmentApplyPath(hrefPath);
                if (enrollment) {
                  return (
                    <li key={labelKey}>
                      <a
                        href={ENROLLMENT_GOOGLE_FORM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkClass}
                      >
                        {t(labelKey)}
                      </a>
                    </li>
                  );
                }
                return (
                  <li key={labelKey}>
                    <Link href={`/${language}${hrefPath}`} className={linkClass}>
                      {t(labelKey)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <p className="mt-10 border-t border-ink-200 pt-8 text-center text-xs text-ink-500">
          {t("site.copyright")}
        </p>
      </div>
    </footer>
  );
}
