import { createClient } from "@/lib/supabase/client";
import type { GalleryImage } from "@/lib/supabase/database.types";

const BUCKET = "gallery";

function sanitizeFileName(name: string) {
  return name.replace(/[^\w.\-()+ ]+/g, "_").slice(0, 120);
}

export function getGalleryPublicUrl(storagePath: string): string {
  const supabase = createClient();
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}

export async function fetchPublishedGalleryImages(): Promise<GalleryImage[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("gallery_images")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error || !data) return [];
  return data as GalleryImage[];
}

export async function fetchAllGalleryImages(): Promise<GalleryImage[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("gallery_images")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error || !data) return [];
  return data as GalleryImage[];
}

export async function uploadGalleryImage(file: File): Promise<{ image?: GalleryImage; error?: string }> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "not_logged_in" };

  const { data: maxRow } = await supabase
    .from("gallery_images")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextOrder = (maxRow?.sort_order ?? -1) + 1;
  const safeName = sanitizeFileName(file.name);
  const storagePath = `${user.id}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, file, { upsert: false, contentType: file.type || undefined });

  if (uploadError) return { error: uploadError.message };

  const { data, error } = await supabase
    .from("gallery_images")
    .insert({
      storage_path: storagePath,
      file_name: file.name,
      alt_text: "",
      sort_order: nextOrder,
      is_published: true,
      uploaded_by: user.id,
    })
    .select("*")
    .single();

  if (error) {
    await supabase.storage.from(BUCKET).remove([storagePath]);
    return { error: error.message };
  }

  return { image: data as GalleryImage };
}

export async function deleteGalleryImage(image: GalleryImage): Promise<{ error?: string }> {
  const supabase = createClient();
  const { error: dbError } = await supabase.from("gallery_images").delete().eq("id", image.id);
  if (dbError) return { error: dbError.message };

  const { error: storageError } = await supabase.storage.from(BUCKET).remove([image.storage_path]);
  if (storageError) return { error: storageError.message };
  return {};
}

export async function updateGalleryImage(
  id: string,
  patch: Partial<Pick<GalleryImage, "alt_text" | "is_published" | "sort_order">>
): Promise<{ error?: string }> {
  const supabase = createClient();
  const { error } = await supabase.from("gallery_images").update(patch).eq("id", id);
  if (error) return { error: error.message };
  return {};
}

export async function reorderGalleryImages(orderedIds: string[]): Promise<{ error?: string }> {
  const results = await Promise.all(
    orderedIds.map((id, index) => updateGalleryImage(id, { sort_order: index }))
  );
  const failed = results.find((r) => r.error);
  return failed?.error ? { error: failed.error } : {};
}
