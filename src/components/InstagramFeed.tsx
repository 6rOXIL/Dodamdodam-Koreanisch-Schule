"use client";

import { useLanguage } from "@/lib/contexts/LanguageContext";
import type { InstagramFeedFile } from "@/lib/types/instagramFeed";

type Props = {
  feed: InstagramFeedFile;
};

export default function InstagramFeed({ feed }: Props) {
  const { t } = useLanguage();
  const { posts, username } = feed;
  if (!posts?.length) return null;

  const profileHref = username
    ? `https://www.instagram.com/${encodeURIComponent(username)}/`
    : null;

  return (
    <div className="mt-14 border-t border-ink-200 pt-12">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-secondary-600/80">
          {t("gallery.instagramLabel")}
        </p>
        <h3 className="mt-2 font-sans text-xl font-bold text-ink-900 sm:text-2xl">
          {t("gallery.instagramTitle")}
        </h3>
        <p className="mx-auto mt-2 max-w-xl text-sm text-ink-500">
          {t("gallery.instagramHint")}
        </p>
        {username && profileHref && (
          <p className="mt-3">
            <a
              href={profileHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-brand-900 underline-offset-2 hover:underline"
            >
              {t("gallery.instagramProfile")} @{username}
            </a>
          </p>
        )}
      </div>

      <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <li
            key={post.id}
            className="overflow-hidden rounded-2xl border border-ink-200 bg-surface shadow-sm transition hover:shadow-md"
          >
            <a
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <div className="relative aspect-square w-full bg-ink-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.imageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              {post.caption ? (
                <p className="line-clamp-4 px-4 py-3 text-left text-sm leading-relaxed text-ink-700">
                  {post.caption}
                </p>
              ) : (
                <p className="px-4 py-3 text-sm text-brand-800">
                  {t("gallery.instagramViewPost")}
                </p>
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
