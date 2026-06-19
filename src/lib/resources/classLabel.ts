import type { ResourceClass } from "@/lib/supabase/database.types";

export function getResourceClassLabel(
  resourceClass: Pick<ResourceClass, "slug" | "name_ko">,
  t: (key: string) => string
) {
  const key = `classes.links.${resourceClass.slug}`;
  const translated = t(key);
  return translated !== key ? translated : resourceClass.name_ko;
}
