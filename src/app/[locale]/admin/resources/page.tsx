import { Suspense } from "react";
import AdminResourcesClient from "@/features/admin/AdminResourcesClient";

export default function AdminResourcesPage() {
  return (
    <Suspense fallback={<p className="text-ink-500">...</p>}>
      <AdminResourcesClient />
    </Suspense>
  );
}
