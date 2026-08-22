import { Suspense } from "react";
import AdminPagesClient from "@/features/admin/AdminPagesClient";

export default function AdminPagesPage() {
  return (
    <Suspense fallback={<p className="text-ink-500">...</p>}>
      <AdminPagesClient />
    </Suspense>
  );
}
