"use client";

import type { LegacyPost } from "@/lib/data/legacySite";

type Props = {
  posts: LegacyPost[];
  colDate: string;
  colTitle: string;
  externalHint: string;
};

export default function LegacyPostTable({
  posts,
  colDate,
  colTitle,
  externalHint,
}: Props) {
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
          {posts.map((row) => (
            <tr
              key={row.url}
              className="border-b border-ink-100 last:border-b-0 hover:bg-brand-50/40"
            >
              <td className="whitespace-nowrap px-3 py-3 align-top text-ink-500 sm:px-4">
                {row.date}
              </td>
              <td className="px-3 py-3 sm:px-4">
                <a
                  href={row.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-brand-900 underline-offset-2 hover:underline"
                >
                  {row.title}
                </a>
                <span className="sr-only"> ({externalHint})</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
