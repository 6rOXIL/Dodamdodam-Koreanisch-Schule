import type { SupabaseClient } from "@supabase/supabase-js";
import type { Profile } from "@/lib/supabase/database.types";

type Translate = (key: string) => string;

export function getLoginErrorMessage(message: string | undefined, t: Translate): string {
  if (!message) return t("auth.loginInvalid");

  const lower = message.toLowerCase();
  if (lower.includes("invalid login credentials")) return t("auth.loginInvalid");
  if (lower.includes("email not confirmed")) return t("auth.emailNotConfirmed");

  return message;
}

export async function fetchProfileForUser(
  supabase: SupabaseClient,
  userId: string
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("fetchProfileForUser:", error.message);
    return null;
  }

  return (data as Profile | null) ?? null;
}
