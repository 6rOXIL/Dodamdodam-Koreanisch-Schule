"use client";

import { useEffect, useState } from "react";
import AdminMembersClient from "@/features/admin/AdminMembersClient";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/supabase/database.types";

export default function AdminMembersPageClient() {
  const { t } = useLanguage();
  const [members, setMembers] = useState<Profile[] | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setMembers((data as Profile[]) ?? []);
      });
  }, []);

  if (!members) {
    return <p className="text-ink-500">{t("auth.loading")}</p>;
  }

  return <AdminMembersClient initialMembers={members} />;
}
