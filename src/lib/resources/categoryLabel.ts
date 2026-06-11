import type { ResourceCategory } from "@/lib/supabase/database.types";

export function getResourceCategoryLabel(
  category: Pick<ResourceCategory, "slug" | "name_ko">,
  t: (key: string) => string
) {
  const key = `resources.categories.${category.slug}`;
  const translated = t(key);
  return translated !== key ? translated : category.name_ko;
}
