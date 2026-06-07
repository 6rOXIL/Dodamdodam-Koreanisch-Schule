import { Suspense } from "react";
import AdminMembersPageClient from "@/features/admin/AdminMembersPageClient";

export default function AdminMembersPage() {
  return (
    <Suspense fallback={<main className="bg-surface px-4 py-16 text-center text-ink-500">...</main>}>
      <AdminMembersPageClient />
    </Suspense>
  );
}
