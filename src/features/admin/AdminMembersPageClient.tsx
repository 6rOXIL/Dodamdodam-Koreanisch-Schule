"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminMembersClient from "@/features/admin/AdminMembersClient";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { isAdmin } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/client";
import { useProfile } from "@/lib/supabase/useProfile";
import type { Profile } from "@/lib/supabase/database.types";

export default function AdminMembersPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language, t } = useLanguage();
  const { profile, loading: profileLoading } = useProfile();
  const [members, setMembers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profileLoading) return;

    if (!profile) {
      const next = searchParams.get("next") ?? `/${language}/admin/members/`;
      router.replace(`/${language}/login/?next=${encodeURIComponent(next)}`);
      return;
    }

    if (!isAdmin(profile)) {
      router.replace(`/${language}/resources/`);
      return;
    }

    const supabase = createClient();
    supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setMembers((data as Profile[]) ?? []);
        setLoading(false);
      });
  }, [profile, profileLoading, language, router, searchParams]);

  if (profileLoading || loading) {
    return (
      <main className="bg-surface px-4 py-16 text-center text-ink-500">
        {t("auth.loading")}
      </main>
    );
  }

  return (
    <main className="bg-surface text-ink-900">
      <AdminMembersClient initialMembers={members} />
    </main>
  );
}
