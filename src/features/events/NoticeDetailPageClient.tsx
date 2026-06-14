"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import {
  fetchPublicNoticeByBoardNo,
  formatPublicNoticeDate,
} from "@/lib/notices/publicNotices";
import type { PublicNotice } from "@/lib/types/publicNotice";

export default function NoticeDetailPageClient({
  boardNo,
  missingParam = false,
}: {
  boardNo: string;
  missingParam?: boolean;
}) {
  const { t, language } = useLanguage();
  const [notice, setNotice] = useState<PublicNotice | null>(null);
  const [loading, setLoading] = useState(!missingParam);
  const [missing, setMissing] = useState(missingParam);

  useEffect(() => {
    if (missingParam || !boardNo) return;

    let cancelled = false;

    fetchPublicNoticeByBoardNo(boardNo).then((data) => {
      if (cancelled) return;
      setNotice(data);
      setMissing(!data);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [boardNo, missingParam]);

  if (missingParam) {
    return (
      <main className="bg-surface px-4 py-16 text-center text-ink-600">
        <p>{t("events.notFound")}</p>
        <Link
          href={`/${language}/events/`}
          className="mt-4 inline-block text-sm font-semibold text-brand-900 underline-offset-2 hover:underline"
        >
          {t("events.backToList")}
        </Link>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="bg-surface px-4 py-16 text-center text-ink-500">
        {t("auth.loading")}
      </main>
    );
  }

  if (missing || !notice) {
    return (
      <main className="bg-surface px-4 py-16 text-center text-ink-600">
        <p>{t("events.notFound")}</p>
        <Link
          href={`/${language}/events/`}
          className="mt-4 inline-block text-sm font-semibold text-brand-900 underline-offset-2 hover:underline"
        >
          {t("events.backToList")}
        </Link>
      </main>
    );
  }

  return (
    <main className="bg-surface text-ink-900">
      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 md:py-20">
        <Link
          href={`/${language}/events/`}
          className="text-sm font-semibold text-ink-600 underline-offset-2 hover:text-ink-900 hover:underline"
        >
          {t("events.backToList")}
        </Link>

        <header className="mt-6 border-b border-ink-200 pb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-secondary-600/80">
            {t("events.label")}
          </p>
          <h1 className="mt-3 font-sans text-2xl font-bold leading-snug text-ink-900 sm:text-3xl">
            {notice.title}
          </h1>
          <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-ink-500">
            <div className="flex gap-2">
              <dt>{t("events.metaDate")}</dt>
              <dd>{formatPublicNoticeDate(notice.published_at, language)}</dd>
            </div>
            {notice.author && (
              <div className="flex gap-2">
                <dt>{t("events.metaAuthor")}</dt>
                <dd>{notice.author}</dd>
              </div>
            )}
          </dl>
        </header>

        {notice.body_html ? (
          <div
            className="notice-body prose prose-sm mt-8 max-w-none text-ink-800 sm:prose-base [&_a]:text-brand-900 [&_a]:underline [&_caption]:hidden [&_img]:h-auto [&_img]:max-w-full [&_p]:leading-relaxed [&_table]:max-w-full [&_table]:table-auto"
            dangerouslySetInnerHTML={{ __html: notice.body_html }}
          />
        ) : (
          <p className="mt-8 text-sm text-ink-500">{t("events.emptyBody")}</p>
        )}

        {notice.attachments.length > 0 && (
          <section className="mt-10 rounded-xl border border-ink-200 bg-ink-50/60 p-5">
            <h2 className="text-sm font-semibold text-ink-900">{t("events.attachments")}</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {notice.attachments.map((file) => (
                <li key={file.attachNo}>
                  <span className="text-ink-700">{file.name}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-ink-500">{t("events.attachmentsHint")}</p>
          </section>
        )}

        <p className="mt-10">
          <Link
            href={`/${language}/events/`}
            className="text-sm font-semibold text-brand-900 underline-offset-2 hover:underline"
          >
            {t("events.backToList")}
          </Link>
        </p>
      </article>
    </main>
  );
}
