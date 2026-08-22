import { Suspense } from "react";
import AdminMembersPageClient from "@/features/admin/AdminMembersPageClient";

export default function AdminMembersPage() {
  return (
    <Suspense fallback={<p className="text-ink-500">...</p>}>
      <AdminMembersPageClient />
    </Suspense>
  );
}
