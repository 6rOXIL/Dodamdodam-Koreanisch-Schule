"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ResourcesAccessPending from "@/features/resources/ResourcesAccessPending";
import ResourcesClient from "@/features/resources/ResourcesClient";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { canAccessResources } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/client";
import { useProfile } from "@/lib/supabase/useProfile";
import type { Resource, ResourceCategory, ResourceClass } from "@/lib/supabase/database.types";

function ResourcesPageInner() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const { user, profile, loading: profileLoading } = useProfile();
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [resourceClasses, setResourceClasses] = useState<ResourceClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (profileLoading || signingOut) return;

    if (!user) {
      router.replace(`/${language}/login/?next=${encodeURIComponent(`/${language}/resources/`)}`);
      return;
    }

    if (!profile) {
      setSigningOut(true);
      createClient()
        .auth.signOut()
        .finally(() => {
          router.replace(`/${language}/login/?login_error=account`);
        });
      return;
    }

    if (!canAccessResources(profile)) {
      setLoading(false);
      return;
    }

    const supabase = createClient();
    Promise.all([
      supabase.from("resources").select("*").order("created_at", { ascending: false }),
      supabase.from("resource_categories").select("*").order("sort_order"),
      supabase.from("resource_classes").select("*").order("sort_order"),
    ]).then(([resourcesRes, categoriesRes, classesRes]) => {
      setResources((resourcesRes.data as Resource[]) ?? []);
      setCategories((categoriesRes.data as ResourceCategory[]) ?? []);
      setResourceClasses((classesRes.data as ResourceClass[]) ?? []);
      setLoading(false);
    });
  }, [user, profile, profileLoading, signingOut, language, router]);

  if (profileLoading || signingOut || (profile && canAccessResources(profile) && loading)) {
    return (
      <main className="bg-surface px-4 py-16 text-center text-ink-500">
        {t("auth.loading")}
      </main>
    );
  }

  if (!user || !profile) return null;

  if (!canAccessResources(profile)) {
    return (
      <main className="bg-surface text-ink-900">
        <ResourcesAccessPending />
      </main>
    );
  }

  return (
    <main className="bg-surface text-ink-900">
      <ResourcesClient
        profile={profile}
        initialResources={resources}
        initialCategories={categories}
        initialResourceClasses={resourceClasses}
      />
    </main>
  );
}

export default function ResourcesPageClient() {
  return (
    <Suspense fallback={<main className="bg-surface px-4 py-16 text-center text-ink-500">...</main>}>
      <ResourcesPageInner />
    </Suspense>
  );
}
