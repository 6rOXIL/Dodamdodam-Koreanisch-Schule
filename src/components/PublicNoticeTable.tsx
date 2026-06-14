"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import {
  fetchPublicNotices,
  formatPublicNoticeDate,
  publicNoticeHref,
} from "@/lib/notices/publicNotices";
import type { PublicNotice } from "@/lib/types/publicNotice";

type PublicNoticeTableProps = {
  colDate: string;
  colTitle: string;
  emptyMessage: string;
};

export default function PublicNoticeTable({
  colDate,
  colTitle,
  emptyMessage,
}: PublicNoticeTableProps) {
  const { t, language } = useLanguage();
  const [notices, setNotices] = useState<PublicNotice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetchPublicNotices().then((data) => {
      if (!cancelled) {
        setNotices(data);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <p className="mt-8 text-center text-sm text-ink-500" aria-live="polite">
        {t("auth.loading")}
      </p>
    );
  }

  if (notices.length === 0) {
    return <p className="mt-8 text-center text-sm text-ink-500">{emptyMessage}</p>;
  }

  return (
    <div className="mt-8 w-full overflow-x-auto rounded-xl border border-ink-200 bg-surface text-left shadow-sm">
      <table className="w-full min-w-[280px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-ink-200 bg-ink-50 text-left text-xs font-semibold uppercase tracking-wide text-ink-600">
            <th scope="col" className="whitespace-nowrap px-3 py-3 sm:px-4">
              {colDate}
            </th>
            <th scope="col" className="px-3 py-3 sm:px-4">
              {colTitle}
            </th>
          </tr>
        </thead>
        <tbody>
          {notices.map((notice) => (
            <tr
              key={notice.board_no}
              className="border-b border-ink-100 last:border-b-0 hover:bg-brand-50/40"
            >
              <td className="whitespace-nowrap px-3 py-3 align-top text-ink-500 sm:px-4">
                {formatPublicNoticeDate(notice.published_at, language)}
              </td>
              <td className="px-3 py-3 sm:px-4">
                <Link
                  href={publicNoticeHref(language, notice.board_no)}
                  className="font-medium text-brand-900 underline-offset-2 hover:underline"
                >
                  {notice.title}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
