"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { createClient } from "@/lib/supabase/client";
import { canUploadResources, isAdmin } from "@/lib/supabase/auth";
import type { Profile, Resource, ResourceCategory } from "@/lib/supabase/database.types";
import { getResourceCategoryLabel } from "@/lib/resources/categoryLabel";
import {
  RESOURCE_COMMON_CLASS,
  type ResourceClassFilter,
} from "@/lib/resources/classSlugs";
import ResourceFormDialog from "@/features/resources/ResourceFormDialog";
import ResourceFolderNav from "@/features/resources/ResourceFolderNav";

interface ResourcesClientProps {
  profile: Profile;
  initialResources: Resource[];
  categories: ResourceCategory[];
}

function canManageResource(resource: Resource, profile: Profile, canUpload: boolean, admin: boolean) {
  return admin || (canUpload && resource.uploaded_by === profile.id);
}

export default function ResourcesClient({
  profile,
  initialResources,
  categories,
}: ResourcesClientProps) {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [resources, setResources] = useState(initialResources);
  const [error, setError] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Resource | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<ResourceClassFilter>("all");
  const deleteDialogRef = useRef<HTMLDialogElement>(null);

  const canUpload = canUploadResources(profile);
  const admin = isAdmin(profile);

  const sortedResources = useMemo(
    () => [...resources].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    [resources]
  );

  const filteredResources = useMemo(() => {
    let result = sortedResources;

    if (selectedClass === RESOURCE_COMMON_CLASS) {
      result = result.filter((resource) => !resource.class_slug);
    } else if (selectedClass !== "all") {
      result = result.filter((resource) => resource.class_slug === selectedClass);
    }

    if (selectedCategoryId) {
      result = result.filter((resource) => resource.category_id === selectedCategoryId);
    }

    return result;
  }, [sortedResources, selectedClass, selectedCategoryId]);

  const classFilteredResources = useMemo(() => {
    if (selectedClass === RESOURCE_COMMON_CLASS) {
      return sortedResources.filter((resource) => !resource.class_slug);
    }
    if (selectedClass !== "all") {
      return sortedResources.filter((resource) => resource.class_slug === selectedClass);
    }
    return sortedResources;
  }, [sortedResources, selectedClass]);

  const classCounts = useMemo(() => {
    const counts = {
      all: resources.length,
      common: 0,
      kindergarten: 0,
      elementary: 0,
      adults: 0,
    };

    for (const resource of resources) {
      if (!resource.class_slug) {
        counts.common += 1;
      } else if (resource.class_slug in counts) {
        counts[resource.class_slug as keyof Omit<typeof counts, "all" | "common">] += 1;
      }
    }

    return counts;
  }, [resources]);

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const resource of classFilteredResources) {
      if (!resource.category_id) continue;
      counts.set(resource.category_id, (counts.get(resource.category_id) ?? 0) + 1);
    }
    return counts;
  }, [classFilteredResources]);

  const selectedClassLabel = useMemo(() => {
    if (selectedClass === "all") return t("resources.allClassesFolder");
    if (selectedClass === RESOURCE_COMMON_CLASS) return t("resources.commonClass");
    return t(`classes.links.${selectedClass}`);
  }, [selectedClass, t]);

  function getEmptyMessage() {
    if (selectedCategoryId && selectedClass !== "all") return t("resources.emptyFilter");
    if (selectedCategoryId) return t("resources.emptyCategory");
    if (selectedClass !== "all") return t("resources.emptyClass");
    return t("resources.empty");
  }

  useEffect(() => {
    const dialog = deleteDialogRef.current;
    if (!dialog) return;
    if (deleteTarget) dialog.showModal();
    else dialog.close();
  }, [deleteTarget]);

  async function removeStorageFile(storagePath: string) {
    const supabase = createClient();
    await supabase.storage.from("class-materials").remove([storagePath]);
  }

  async function handleDownload(storagePath: string) {
    const supabase = createClient();
    const { data, error: urlError } = await supabase.storage
      .from("class-materials")
      .createSignedUrl(storagePath, 60);

    if (urlError || !data?.signedUrl) {
      setError(urlError?.message ?? t("resources.downloadError"));
      return;
    }

    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  async function handleUploadSuccess(resource: Resource) {
    setResources((prev) => [resource, ...prev]);
    setUploadOpen(false);
    setError(null);
    router.refresh();
  }

  async function handleEditSuccess(resource: Resource, replacedStoragePath?: string) {
    if (replacedStoragePath) {
      await removeStorageFile(replacedStoragePath);
    }
    setResources((prev) => prev.map((r) => (r.id === resource.id ? resource : r)));
    setEditingResource(null);
    setError(null);
    router.refresh();
  }

  async function togglePublish(resource: Resource) {
    if (!canManageResource(resource, profile, canUpload, admin)) return;

    const supabase = createClient();
    const { data, error: updateError } = await supabase
      .from("resources")
      .update({ is_published: !resource.is_published })
      .eq("id", resource.id)
      .select("*")
      .single();

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setResources((prev) => prev.map((r) => (r.id === resource.id ? (data as Resource) : r)));
  }

  async function handleDelete() {
    if (!deleteTarget) return;

    setDeleting(true);
    setError(null);

    const supabase = createClient();
    const storagePath = deleteTarget.storage_path;

    const { error: dbError } = await supabase.from("resources").delete().eq("id", deleteTarget.id);

    if (dbError) {
      setDeleting(false);
      setError(dbError.message);
      return;
    }

    const { error: storageError } = await supabase.storage.from("class-materials").remove([storagePath]);

    setResources((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    setDeleteTarget(null);
    setDeleting(false);

    if (storageError) {
      setError(storageError.message);
    }

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
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-secondary-600">{t("resources.label")}</p>
          <h1 className="mt-1 text-3xl font-bold text-ink-900">{t("resources.title")}</h1>
          <p className="mt-2 text-ink-600">{t("resources.lead")}</p>
          <p className="mt-1 text-sm text-ink-500">
            {t("auth.role")}: {t(`auth.roles.${profile.role}`)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {admin && (
            <Link
              href={`/${language}/admin/members/`}
              className="rounded-lg border border-ink-200 px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50"
            >
              {t("auth.membersTitle")}
            </Link>
          )}
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="rounded-lg border border-ink-200 px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50"
          >
            {t("auth.logout")}
          </button>
        </div>
      </div>

      {profile.role === "general" && (
        <p className="mt-6 rounded-lg bg-brand-50 px-4 py-3 text-sm text-brand-900">
          {t("resources.pendingApproval")}
        </p>
      )}

      {error && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        <aside className="lg:w-56 shrink-0">
          <ResourceFolderNav
            selectedClass={selectedClass}
            onSelectClass={(value) => {
              setSelectedClass(value);
              setSelectedCategoryId(null);
            }}
            classCounts={classCounts}
          />
        </aside>

        <section className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-ink-900">{t("resources.listTitle")}</h2>
            <p className="mt-0.5 text-sm text-ink-500">{selectedClassLabel}</p>
          </div>
          {canUpload && (
            <button
              type="button"
              onClick={() => setUploadOpen(true)}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-on-inverse hover:bg-brand-800"
            >
              {t("resources.uploadOpenButton")}
            </button>
          )}
        </div>

        {categories.length > 0 && (
          <nav
            className="mt-4 flex flex-wrap gap-2"
            aria-label={t("resources.filterByCategory")}
          >
            <button
              type="button"
              onClick={() => setSelectedCategoryId(null)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition sm:text-sm ${
                selectedCategoryId === null
                  ? "border-brand-600 bg-brand-100 text-brand-950"
                  : "border-ink-200 bg-ink-50 text-ink-700 hover:border-brand-300 hover:bg-brand-50"
              }`}
            >
              {t("resources.allCategories")}
              <span className="ml-1.5 text-[0.7rem] opacity-70">({classFilteredResources.length})</span>
            </button>
            {categories.map((category) => {
              const count = categoryCounts.get(category.id) ?? 0;
              const active = selectedCategoryId === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategoryId(category.id)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition sm:text-sm ${
                    active
                      ? "border-brand-600 bg-brand-100 text-brand-950"
                      : "border-ink-200 bg-ink-50 text-ink-700 hover:border-brand-300 hover:bg-brand-50"
                  }`}
                >
                  {getResourceCategoryLabel(category, t)}
                  <span className="ml-1.5 text-[0.7rem] opacity-70">({count})</span>
                </button>
              );
            })}
          </nav>
        )}

        {filteredResources.length === 0 ? (
          <p className="mt-4 text-ink-500">{getEmptyMessage()}</p>
        ) : (
          <ul className="mt-4 divide-y divide-ink-200 rounded-xl border border-ink-200 bg-surface">
            {filteredResources.map((resource) => {
              const category = categories.find((c) => c.id === resource.category_id);
              const manageable = canManageResource(resource, profile, canUpload, admin);

              return (
                <li key={resource.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-ink-900">{resource.title}</p>
                    {resource.description && (
                      <p className="mt-1 text-sm text-ink-600">{resource.description}</p>
                    )}
                    <p className="mt-1 text-xs text-ink-500">
                      {category ? getResourceCategoryLabel(category, t) : "—"}
                      {resource.class_slug ? ` · ${t(`classes.links.${resource.class_slug}`)}` : ""}
                      {resource.file_name ? ` · ${resource.file_name}` : ""}
                      {!resource.is_published ? ` · ${t("resources.draft")}` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    {(resource.is_published || resource.uploaded_by === profile.id || admin) && (
                      <button
                        type="button"
                        onClick={() => handleDownload(resource.storage_path)}
                        className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-on-inverse hover:bg-brand-800"
                      >
                        {t("resources.download")}
                      </button>
                    )}
                    {manageable && (
                      <>
                        <button
                          type="button"
                          onClick={() => setEditingResource(resource)}
                          className="rounded-lg border border-ink-200 px-3 py-1.5 text-sm font-medium text-ink-700 hover:bg-ink-50"
                        >
                          {t("resources.editButton")}
                        </button>
                        <button
                          type="button"
                          onClick={() => togglePublish(resource)}
                          className="rounded-lg border border-ink-200 px-3 py-1.5 text-sm font-medium text-ink-700 hover:bg-ink-50"
                        >
                          {resource.is_published ? t("resources.unpublish") : t("resources.publish")}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(resource)}
                          className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
                        >
                          {t("resources.deleteButton")}
                        </button>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        </section>
      </div>

      <ResourceFormDialog
        open={uploadOpen}
        mode="upload"
        categories={categories}
        onClose={() => setUploadOpen(false)}
        onSuccess={handleUploadSuccess}
        onError={setError}
      />

      <ResourceFormDialog
        open={!!editingResource}
        mode="edit"
        resource={editingResource}
        categories={categories}
        onClose={() => setEditingResource(null)}
        onSuccess={handleEditSuccess}
        onError={setError}
      />

      <dialog
        ref={deleteDialogRef}
        onClose={() => !deleting && setDeleteTarget(null)}
        className="fixed inset-0 z-[100] m-0 h-full max-h-none w-full max-w-none border-0 bg-transparent p-0 backdrop:bg-ink-900/50 open:flex open:items-center open:justify-center"
        onClick={(e) => {
          if (e.target === deleteDialogRef.current && !deleting) setDeleteTarget(null);
        }}
      >
        <div
          role="document"
          className="mx-4 w-full max-w-md rounded-xl border border-ink-200 bg-surface p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-lg font-semibold text-ink-900">{t("resources.deleteConfirmTitle")}</h2>
          <p className="mt-3 text-sm text-ink-600">{t("resources.deleteConfirmMessage")}</p>
          {deleteTarget && (
            <p className="mt-2 text-sm font-medium text-ink-900">{deleteTarget.title}</p>
          )}
          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
              className="rounded-lg border border-ink-200 px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50 disabled:opacity-60"
            >
              {t("resources.cancelButton")}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
            >
              {deleting ? t("auth.loading") : t("resources.deleteConfirmButton")}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
