"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { LEGACY_BOARDS } from "@/lib/data/legacySite";

export default function SiteFooter() {
  const { t, language } = useLanguage();

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] md:px-8 md:py-12">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="font-semibold text-slate-900">{t("site.name")}</p>
            <p className="mt-1 text-sm text-slate-600">{t("site.nameEn")}</p>
            <p className="mt-6 text-sm font-medium text-slate-800">
              {t("footer.addressTitle")}
            </p>
            <p className="mt-1 text-sm text-slate-600 whitespace-pre-line">
              {t("location.address")}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800">
              {t("footer.quickTitle")}
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <Link
                  href={`/${language}/#gallery`}
                  className="-mx-1 inline-block rounded-md px-1 py-2.5 text-slate-600 underline-offset-4 hover:text-amber-800 hover:underline"
                >
                  {t("footer.linkGallery")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${language}/#schedule`}
                  className="-mx-1 inline-block rounded-md px-1 py-2.5 text-slate-600 underline-offset-4 hover:text-amber-800 hover:underline"
                >
                  {t("footer.linkSchedule")}
                </Link>
              </li>
              <li>
                <a
                  href={LEGACY_BOARDS.noticeList}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="-mx-1 inline-block rounded-md px-1 py-2.5 text-slate-600 underline-offset-4 hover:text-amber-800 hover:underline"
                >
                  {t("footer.linkLegacyNotice")}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-10 border-t border-slate-200 pt-8 text-center text-xs text-slate-500">
          {t("site.copyright")}
        </p>
      </div>
    </footer>
  );
}
