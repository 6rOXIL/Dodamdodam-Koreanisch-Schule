import { createClient } from "@/lib/supabase/client";
import type { PublicNotice } from "@/lib/types/publicNotice";

export const PUBLIC_NOTICE_LIMIT = 10;

export async function fetchPublicNotices(): Promise<PublicNotice[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("public_notices")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(PUBLIC_NOTICE_LIMIT);

  if (error) {
    console.error("fetchPublicNotices:", error.message);
    return [];
  }

  return (data as PublicNotice[]) ?? [];
}

export async function fetchPublicNoticeByBoardNo(
  boardNo: string
): Promise<PublicNotice | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("public_notices")
    .select("*")
    .eq("board_no", boardNo)
    .maybeSingle();

  if (error) {
    console.error("fetchPublicNoticeByBoardNo:", error.message);
    return null;
  }

  return (data as PublicNotice) ?? null;
}

export function formatPublicNoticeDate(iso: string, locale: string) {
  const tag = locale === "ko" ? "ko-KR" : locale === "de" ? "de-DE" : "en-GB";
  return new Date(iso).toLocaleDateString(tag, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function publicNoticeHref(locale: string, boardNo: string) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}/${locale}/events/detail/?no=${encodeURIComponent(boardNo)}`;
}
