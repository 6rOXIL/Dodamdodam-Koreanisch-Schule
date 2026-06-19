"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { createClient } from "@/lib/supabase/client";
import type { Resource } from "@/lib/supabase/database.types";
import { fetchPublishedResourcesByCategorySlug, formatResourcePostDate } from "@/lib/resources/categoryResources";

type NoticePostTableProps = {
  categorySlug: string;
  colDate: string;
  colTitle: string;
  emptyMessage: string;
  downloadErrorMessage: string;
};

export default function NoticePostTable({
  categorySlug,
  colDate,
  colTitle,
  emptyMessage,
  downloadErrorMessage,
}: NoticePostTableProps) {
  const { t, language } = useLanguage();
  const [posts, setPosts] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchPublishedResourcesByCategorySlug(categorySlug).then((data) => {
      if (!cancelled) {
        setPosts(data);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [categorySlug]);

  async function handleDownload(resource: Resource) {
    setDownloadingId(resource.id);
    setError(null);

    const supabase = createClient();
    const { data, error: urlError } = await supabase.storage
      .from("class-materials")
      .createSignedUrl(resource.storage_path, 60);

    setDownloadingId(null);

    if (urlError || !data?.signedUrl) {
      setError(urlError?.message ?? downloadErrorMessage);
      return;
    }

    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  if (loading) {
    return (
      <p className="mt-8 text-center text-sm text-ink-500" aria-live="polite">
        {t("auth.loading")}
      </p>
    );
  }

  if (posts.length === 0) {
    return <p className="mt-8 text-center text-sm text-ink-500">{emptyMessage}</p>;
  }

  return (
    <>
      {error && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
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
            {posts.map((post) => (
              <tr
                key={post.id}
                className="border-b border-ink-100 last:border-b-0 hover:bg-brand-50/40"
              >
                <td className="whitespace-nowrap px-3 py-3 align-top text-ink-500 sm:px-4">
                  {formatResourcePostDate(post.created_at, language)}
                </td>
                <td className="px-3 py-3 sm:px-4">
                  <button
                    type="button"
                    onClick={() => handleDownload(post)}
                    disabled={downloadingId === post.id}
                    className="text-left font-medium text-brand-900 underline-offset-2 hover:underline disabled:opacity-60"
                  >
                    {post.title}
                  </button>
                  {post.description && (
                    <p className="mt-1 text-xs text-ink-600">{post.description}</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
