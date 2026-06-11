import { createClient } from "@/lib/supabase/client";
import type { Resource } from "@/lib/supabase/database.types";

export const NOTICE_CATEGORY_SLUG = "notice";

export async function fetchPublishedNoticeResources(): Promise<Resource[]> {
  const supabase = createClient();

  const { data: category, error: categoryError } = await supabase
    .from("resource_categories")
    .select("id")
    .eq("slug", NOTICE_CATEGORY_SLUG)
    .maybeSingle();

  if (categoryError || !category) {
    return [];
  }

  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .eq("category_id", category.id)
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("fetchPublishedNoticeResources:", error.message);
    return [];
  }

  return (data as Resource[]) ?? [];
}

export function formatNoticeDate(iso: string, locale: string) {
  const tag = locale === "ko" ? "ko-KR" : locale === "de" ? "de-DE" : "en-GB";
  return new Date(iso).toLocaleDateString(tag, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}
