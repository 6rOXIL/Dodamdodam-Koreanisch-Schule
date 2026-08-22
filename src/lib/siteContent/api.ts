import type { ClassesContent } from "@/lib/data/classes";
import { getClassesContent } from "@/lib/data/classes";
import type { IntroductionContent } from "@/lib/data/introduction";
import { getIntroductionContent } from "@/lib/data/introduction";
import type { Locale } from "@/lib/i18n/config";
import { createClient } from "@/lib/supabase/client";
import type {
  SiteCategory,
  SiteLocale,
  SiteNavItem,
  SitePageContent,
  SitePageSlug,
  SiteSubcategory,
} from "@/lib/supabase/database.types";

export type SiteCategoryWithSubs = SiteCategory & {
  subcategories: SiteSubcategory[];
};

function labelForLocale(
  row: Pick<SiteCategory, "label_ko" | "label_en" | "label_de">,
  locale: Locale
): string {
  if (locale === "en") return row.label_en;
  if (locale === "de") return row.label_de;
  return row.label_ko;
}

export function getLocalizedLabel(
  row: Pick<SiteCategory, "label_ko" | "label_en" | "label_de">,
  locale: Locale
): string {
  return labelForLocale(row, locale);
}

/** 상단 사이트 메뉴 (홈 ~ 오시는 길) */
export async function fetchTopNavItems(): Promise<SiteNavItem[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("site_nav_items")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return data as SiteNavItem[];
}

export async function updateTopNavItem(
  id: string,
  patch: Partial<
    Pick<
      SiteNavItem,
      "label_ko" | "label_en" | "label_de" | "sort_order" | "is_visible" | "href_path" | "slug"
    >
  >
): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from("site_nav_items").update(patch).eq("id", id);
  return { error: error?.message ?? null };
}

export async function createTopNavItem(input: {
  slug: string;
  href_path: string;
  label_ko: string;
  label_en: string;
  label_de: string;
  sort_order: number;
  is_visible?: boolean;
  content_kind?: SiteNavItem["content_kind"];
}): Promise<{ data: SiteNavItem | null; error: string | null }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("site_nav_items")
    .insert({
      slug: input.slug,
      href_path: input.href_path,
      label_ko: input.label_ko,
      label_en: input.label_en,
      label_de: input.label_de,
      sort_order: input.sort_order,
      is_visible: input.is_visible ?? true,
      content_kind: input.content_kind ?? "static",
    })
    .select("*")
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as SiteNavItem, error: null };
}

export async function deleteTopNavItem(id: string): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from("site_nav_items").delete().eq("id", id);
  return { error: error?.message ?? null };
}

export async function fetchSiteNav(categorySlug: SitePageSlug): Promise<SiteCategoryWithSubs | null> {
  const supabase = createClient();
  const { data: category, error } = await supabase
    .from("site_categories")
    .select("*")
    .eq("slug", categorySlug)
    .maybeSingle();

  if (error || !category) return null;

  const { data: subcategories, error: subError } = await supabase
    .from("site_subcategories")
    .select("*")
    .eq("category_id", category.id)
    .order("sort_order", { ascending: true });

  if (subError) return null;

  return {
    ...(category as SiteCategory),
    subcategories: (subcategories as SiteSubcategory[]) ?? [],
  };
}

export async function fetchAllSiteNav(): Promise<SiteCategoryWithSubs[]> {
  const supabase = createClient();
  const { data: categories, error } = await supabase
    .from("site_categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !categories?.length) return [];

  const { data: subcategories, error: subError } = await supabase
    .from("site_subcategories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (subError) return [];

  const byCategory = new Map<string, SiteSubcategory[]>();
  for (const sub of (subcategories as SiteSubcategory[]) ?? []) {
    const list = byCategory.get(sub.category_id) ?? [];
    list.push(sub);
    byCategory.set(sub.category_id, list);
  }

  return (categories as SiteCategory[]).map((cat) => ({
    ...cat,
    subcategories: byCategory.get(cat.id) ?? [],
  }));
}

export async function fetchPageContent<T = Record<string, unknown>>(
  pageSlug: string,
  locale: Locale
): Promise<T | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("site_page_contents")
    .select("payload")
    .eq("page_slug", pageSlug)
    .eq("locale", locale)
    .maybeSingle();

  if (error || !data?.payload) return null;
  return data.payload as T;
}

export function getDefaultPageContent(
  pageSlug: SitePageSlug,
  locale: Locale
): IntroductionContent | ClassesContent {
  if (pageSlug === "introduction") return getIntroductionContent(locale);
  return getClassesContent(locale);
}

export async function upsertPageContent(
  pageSlug: string,
  locale: SiteLocale,
  payload: IntroductionContent | ClassesContent | Record<string, unknown>,
  userId: string
): Promise<{ data: SitePageContent | null; error: string | null }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("site_page_contents")
    .upsert(
      {
        page_slug: pageSlug,
        locale,
        payload,
        updated_by: userId,
      },
      { onConflict: "page_slug,locale" }
    )
    .select("*")
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as SitePageContent, error: null };
}

export async function updateSiteCategory(
  id: string,
  patch: Partial<Pick<SiteCategory, "label_ko" | "label_en" | "label_de" | "sort_order" | "is_visible">>
): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from("site_categories").update(patch).eq("id", id);
  return { error: error?.message ?? null };
}

export async function updateSiteSubcategory(
  id: string,
  patch: Partial<
    Pick<SiteSubcategory, "label_ko" | "label_en" | "label_de" | "sort_order" | "is_visible">
  >
): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from("site_subcategories").update(patch).eq("id", id);
  return { error: error?.message ?? null };
}

/** 어드민에서 content_kind / slug → 관리 화면 경로 */
export function getAdminManagePath(
  contentKind: string,
  language: string,
  navSlug?: string
): string | null {
  if (contentKind.startsWith("form:")) {
    const formSlug = contentKind.slice("form:".length) || navSlug || "enrollment";
    return `/${language}/admin/forms/?slug=${encodeURIComponent(formSlug)}`;
  }
  switch (contentKind) {
    case "pages:introduction":
      return `/${language}/admin/pages/?section=introduction`;
    case "pages:classes":
      return `/${language}/admin/pages/?section=classes`;
    case "resources:notice":
      return `/${language}/admin/pages/?section=schedule`;
    case "resources:announcement":
      return `/${language}/admin/pages/?section=events`;
    case "static":
      if (navSlug === "home" || navSlug === "gallery" || navSlug === "location") {
        return `/${language}/admin/pages/?section=${navSlug}`;
      }
      return `/${language}/admin/pages/`;
    default:
      return `/${language}/admin/pages/`;
  }
}
