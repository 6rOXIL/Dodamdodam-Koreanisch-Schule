"use client";

import { Suspense } from "react";
import LoginForm from "@/features/auth/LoginForm";

export default function LoginPageClient() {
  return (
    <main className="bg-surface text-ink-900">
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <Suspense fallback={<div className="mx-auto max-w-md text-ink-500">...</div>}>
          <LoginForm />
        </Suspense>
      </section>
    </main>
  );
}
