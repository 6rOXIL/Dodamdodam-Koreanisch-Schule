"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { createClient } from "@/lib/supabase/client";
import type { Profile, UserRole } from "@/lib/supabase/database.types";

const ROLES: UserRole[] = ["general", "member", "teacher", "admin"];

interface AdminMembersClientProps {
  initialMembers: Profile[];
}

export default function AdminMembersClient({ initialMembers }: AdminMembersClientProps) {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [members, setMembers] = useState(initialMembers);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleRoleChange(userId: string, newRole: UserRole) {
    setError(null);
    setPendingId(userId);

    const supabase = createClient();
    const { data, error: rpcError } = await supabase.rpc("admin_set_user_role", {
      target_user_id: userId,
      new_role: newRole,
    });

    setPendingId(null);

    if (rpcError) {
      setError(rpcError.message);
      return;
    }

    const updated = data as Profile;
    setMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    router.refresh();
  }

  async function handleLogout() {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(`/${language}/login/`);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-secondary-600">{t("auth.adminLabel")}</p>
          <h1 className="mt-1 text-3xl font-bold text-ink-900">{t("auth.membersTitle")}</h1>
          <p className="mt-2 text-ink-600">{t("auth.membersLead")}</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="rounded-lg border border-ink-200 px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50"
        >
          {t("auth.logout")}
        </button>
      </div>

      {error && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <div className="mt-8 overflow-x-auto rounded-xl border border-ink-200">
        <table className="min-w-full divide-y divide-ink-200 text-sm">
          <thead className="bg-surface-muted">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-ink-700">{t("auth.displayName")}</th>
              <th className="px-4 py-3 text-left font-semibold text-ink-700">{t("auth.email")}</th>
              <th className="px-4 py-3 text-left font-semibold text-ink-700">{t("auth.role")}</th>
              <th className="px-4 py-3 text-left font-semibold text-ink-700">{t("auth.joinedAt")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-200 bg-surface">
            {members.map((member) => (
              <tr key={member.id}>
                <td className="px-4 py-3 text-ink-900">{member.display_name || "—"}</td>
                <td className="px-4 py-3 text-ink-700">{member.email || "—"}</td>
                <td className="px-4 py-3">
                  <select
                    value={member.role}
                    disabled={pendingId === member.id}
                    onChange={(e) => handleRoleChange(member.id, e.target.value as UserRole)}
                    className="rounded-lg border border-ink-200 bg-surface px-2 py-1.5 text-ink-900"
                    aria-label={`${t("auth.role")}: ${member.email}`}
                  >
                    {ROLES.map((role) => (
                      <option key={role} value={role}>
                        {t(`auth.roles.${role}`)}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-ink-600">
                  {new Date(member.created_at).toLocaleDateString(language === "ko" ? "ko-KR" : language === "de" ? "de-DE" : "en-GB")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {members.length === 0 && (
        <p className="mt-6 text-center text-ink-500">{t("auth.membersEmpty")}</p>
      )}
    </div>
  );
}
