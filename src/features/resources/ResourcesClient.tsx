"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { createClient } from "@/lib/supabase/client";
import { canUploadResources, isAdmin } from "@/lib/supabase/auth";
import type { Profile, Resource, ResourceCategory, ResourceClass } from "@/lib/supabase/database.types";
import { getResourceCategoryLabel } from "@/lib/resources/categoryLabel";
import { getResourceClassLabel } from "@/lib/resources/classLabel";
import { sortResourceCategories } from "@/lib/resources/sortTaxonomy";
import {
  RESOURCE_COMMON_CLASS,
  type ResourceClassFilter,
} from "@/lib/resources/classSlugs";
import ResourceDescription from "@/components/ResourceDescription";
import ResourceFormDialog from "@/features/resources/ResourceFormDialog";
import ResourceFolderNav from "@/features/resources/ResourceFolderNav";
import ResourceCategoryNav from "@/features/resources/ResourceCategoryNav";
import ResourceTaxonomySheet, { type TaxonomyTab } from "@/features/resources/ResourceTaxonomySheet";

interface ResourcesClientProps {
  profile: Profile;
  initialResources: Resource[];
  initialCategories: ResourceCategory[];
  initialResourceClasses: ResourceClass[];
}

function canManageResource(resource: Resource, profile: Profile, canUpload: boolean, admin: boolean) {
  return admin || (canUpload && resource.uploaded_by === profile.id);
}

export default function ResourcesClient({
  profile,
  initialResources,
  initialCategories,
  initialResourceClasses,
}: ResourcesClientProps) {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [resources, setResources] = useState(initialResources);
  const [categories, setCategories] = useState(initialCategories);
  const [resourceClasses, setResourceClasses] = useState(initialResourceClasses);
  const [error, setError] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Resource | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<ResourceClassFilter>("all");
  const [taxonomyOpen, setTaxonomyOpen] = useState(false);
  const [taxonomyTab, setTaxonomyTab] = useState<TaxonomyTab>("categories");
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
    const bySlug: Record<string, number> = {};
    let common = 0;

    for (const resource of resources) {
      if (!resource.class_slug) {
        common += 1;
      } else {
        bySlug[resource.class_slug] = (bySlug[resource.class_slug] ?? 0) + 1;
      }
    }

    return {
      all: resources.length,
      common,
      bySlug,
    };
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
    const resourceClass = resourceClasses.find((c) => c.slug === selectedClass);
    if (resourceClass) return getResourceClassLabel(resourceClass, t);
    return selectedClass;
  }, [selectedClass, resourceClasses, t]);

  const defaultUploadClassSlug = useMemo(() => {
    if (selectedClass === "all" || selectedClass === RESOURCE_COMMON_CLASS) return "";
    return selectedClass;
  }, [selectedClass]);

  const sortedCategories = useMemo(() => sortResourceCategories(categories), [categories]);

  function openTaxonomy(tab: TaxonomyTab) {
    setTaxonomyTab(tab);
    setTaxonomyOpen(true);
  }

  function handleCategoryDeleted(categoryId: string) {
    setResources((prev) =>
      prev.map((r) => (r.category_id === categoryId ? { ...r, category_id: null } : r))
    );
    if (selectedCategoryId === categoryId) {
      setSelectedCategoryId(null);
    }
    setError(null);
  }

  function handleClassDeleted(classSlug: string) {
    setResources((prev) =>
      prev.map((r) => (r.class_slug === classSlug ? { ...r, class_slug: null } : r))
    );
    if (selectedClass === classSlug) {
      setSelectedClass("all");
    }
    setError(null);
  }

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
            resourceClasses={resourceClasses}
            isAdmin={admin}
            onManage={() => openTaxonomy("folders")}
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

        <ResourceCategoryNav
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
          categoryCounts={categoryCounts}
          totalCount={classFilteredResources.length}
          language={language}
          isAdmin={admin}
          onManage={() => openTaxonomy("categories")}
        />

        {filteredResources.length === 0 ? (
          <p className="mt-4 text-ink-500">{getEmptyMessage()}</p>
        ) : (
          <ul className="mt-4 divide-y divide-ink-200 rounded-xl border border-ink-200 bg-surface">
            {filteredResources.map((resource) => {
              const category = categories.find((c) => c.id === resource.category_id);
              const resourceClass = resourceClasses.find((c) => c.slug === resource.class_slug);
              const manageable = canManageResource(resource, profile, canUpload, admin);

              return (
                <li key={resource.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-ink-900">{resource.title}</p>
                    <ResourceDescription content={resource.description ?? ""} />
                    <p className="mt-1 text-xs text-ink-500">
                      {category ? getResourceCategoryLabel(category, t) : "—"}
                      {resourceClass
                        ? ` · ${getResourceClassLabel(resourceClass, t)}`
                        : resource.class_slug
                          ? ` · ${resource.class_slug}`
                          : ""}
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
        categories={sortedCategories}
        resourceClasses={resourceClasses}
        defaultClassSlug={defaultUploadClassSlug}
        onClose={() => setUploadOpen(false)}
        onSuccess={handleUploadSuccess}
        onError={setError}
      />

      <ResourceFormDialog
        open={!!editingResource}
        mode="edit"
        resource={editingResource}
        categories={sortedCategories}
        resourceClasses={resourceClasses}
        onClose={() => setEditingResource(null)}
        onSuccess={handleEditSuccess}
        onError={setError}
      />

      {admin && (
        <ResourceTaxonomySheet
          open={taxonomyOpen}
          tab={taxonomyTab}
          onTabChange={setTaxonomyTab}
          onClose={() => setTaxonomyOpen(false)}
          categories={categories}
          resourceClasses={resourceClasses}
          categoryCounts={categoryCounts}
          classCounts={classCounts}
          language={language}
          onCategoriesChange={setCategories}
          onClassesChange={setResourceClasses}
          onCategoryDeleted={handleCategoryDeleted}
          onClassDeleted={handleClassDeleted}
          onError={setError}
        />
      )}

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
