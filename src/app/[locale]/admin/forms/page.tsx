import { Suspense } from "react";
import AdminFormsClient from "@/features/admin/AdminFormsClient";

export default function AdminFormsPage() {
  return (
    <Suspense fallback={<p className="text-ink-500">...</p>}>
      <AdminFormsClient />
    </Suspense>
  );
}
