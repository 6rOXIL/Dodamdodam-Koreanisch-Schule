import { createClient } from "@/lib/supabase/client";
import type { Resource } from "@/lib/supabase/database.types";

export async function fetchPublishedResourcesByCategorySlug(slug: string): Promise<Resource[]> {
  const supabase = createClient();

  const { data: category, error: categoryError } = await supabase
    .from("resource_categories")
    .select("id")
    .eq("slug", slug)
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
    console.error(`fetchPublishedResourcesByCategorySlug(${slug}):`, error.message);
    return [];
  }

  return (data as Resource[]) ?? [];
}

export function formatResourcePostDate(iso: string, locale: string) {
  const tag = locale === "ko" ? "ko-KR" : locale === "de" ? "de-DE" : "en-GB";
  return new Date(iso).toLocaleDateString(tag, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}
