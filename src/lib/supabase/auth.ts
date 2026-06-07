import { ROLE_RANK, type Profile, type UserRole } from "@/lib/supabase/database.types";

export function hasRoleAtLeast(role: UserRole | null | undefined, required: UserRole): boolean {
  if (!role) return false;
  return ROLE_RANK[role] >= ROLE_RANK[required];
}

export function canAccessResources(profile: Profile | null): boolean {
  return hasRoleAtLeast(profile?.role, "member");
}

export function canUploadResources(profile: Profile | null): boolean {
  return hasRoleAtLeast(profile?.role, "teacher");
}

export function isAdmin(profile: Profile | null): boolean {
  return hasRoleAtLeast(profile?.role, "admin");
}
