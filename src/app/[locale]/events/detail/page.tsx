"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import NoticeDetailPageClient from "@/features/events/NoticeDetailPageClient";

function NoticeDetailInner() {
  const searchParams = useSearchParams();
  const boardNo = searchParams.get("no");

  if (!boardNo) {
    return <NoticeDetailPageClient boardNo="" missingParam />;
  }

  return <NoticeDetailPageClient boardNo={boardNo} />;
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="bg-surface px-4 py-16 text-center text-ink-500">...</main>
      }
    >
      <NoticeDetailInner />
    </Suspense>
  );
}
