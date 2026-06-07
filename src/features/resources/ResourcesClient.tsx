"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { createClient } from "@/lib/supabase/client";
import { canUploadResources, isAdmin } from "@/lib/supabase/auth";
import type { Profile, Resource, ResourceCategory } from "@/lib/supabase/database.types";

const CLASS_SLUGS = ["kindergarten", "elementary", "adults"] as const;

interface ResourcesClientProps {
  profile: Profile;
  initialResources: Resource[];
  categories: ResourceCategory[];
}

export default function ResourcesClient({
  profile,
  initialResources,
  categories,
}: ResourcesClientProps) {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [resources, setResources] = useState(initialResources);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [classSlug, setClassSlug] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [publish, setPublish] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const canUpload = canUploadResources(profile);
  const admin = isAdmin(profile);

  const sortedResources = useMemo(
    () => [...resources].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    [resources]
  );

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

  async function handleUpload(e: FormEvent) {
    e.preventDefault();
    if (!file || !canUpload) return;

    setError(null);
    setUploading(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setUploading(false);
      setError(t("auth.notLoggedIn"));
      return;
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storagePath = `${user.id}/${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("class-materials")
      .upload(storagePath, file, { upsert: false });

    if (uploadError) {
      setUploading(false);
      setError(uploadError.message);
      return;
    }

    const { data: inserted, error: insertError } = await supabase
      .from("resources")
      .insert({
        title: title.trim(),
        description: description.trim() || null,
        category_id: categoryId || null,
        class_slug: classSlug || null,
        storage_path: storagePath,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type || null,
        uploaded_by: user.id,
        is_published: publish,
      })
      .select("*")
      .single();

    setUploading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setResources((prev) => [inserted as Resource, ...prev]);
    setTitle("");
    setDescription("");
    setFile(null);
    setPublish(false);
    router.refresh();
  }

  async function togglePublish(resource: Resource) {
    if (!canUpload && !admin) return;

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

  async function handleLogout() {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(`/${language}/login/`);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-brand-800">{t("resources.label")}</p>
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

      {canUpload && (
        <section className="mt-10 rounded-xl border border-ink-200 bg-surface-muted p-6">
          <h2 className="text-lg font-semibold text-ink-900">{t("resources.uploadTitle")}</h2>
          <form onSubmit={handleUpload} className="mt-4 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="resource-title" className="mb-1 block text-sm font-medium text-ink-700">
                  {t("resources.fieldTitle")}
                </label>
                <input
                  id="resource-title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-ink-200 bg-surface px-3 py-2 text-ink-900"
                />
              </div>
              <div>
                <label htmlFor="resource-category" className="mb-1 block text-sm font-medium text-ink-700">
                  {t("resources.fieldCategory")}
                </label>
                <select
                  id="resource-category"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full rounded-lg border border-ink-200 bg-surface px-3 py-2 text-ink-900"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name_ko}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="resource-class" className="mb-1 block text-sm font-medium text-ink-700">
                {t("resources.fieldClass")}
              </label>
              <select
                id="resource-class"
                value={classSlug}
                onChange={(e) => setClassSlug(e.target.value)}
                className="w-full rounded-lg border border-ink-200 bg-surface px-3 py-2 text-ink-900 md:max-w-xs"
              >
                <option value="">{t("resources.allClasses")}</option>
                {CLASS_SLUGS.map((slug) => (
                  <option key={slug} value={slug}>
                    {t(`classes.links.${slug}`)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="resource-description" className="mb-1 block text-sm font-medium text-ink-700">
                {t("resources.fieldDescription")}
              </label>
              <textarea
                id="resource-description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg border border-ink-200 bg-surface px-3 py-2 text-ink-900"
              />
            </div>

            <div>
              <label htmlFor="resource-file" className="mb-1 block text-sm font-medium text-ink-700">
                {t("resources.fieldFile")}
              </label>
              <input
                id="resource-file"
                type="file"
                required
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-ink-700 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-100 file:px-4 file:py-2 file:font-medium file:text-brand-900"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-ink-700">
              <input
                type="checkbox"
                checked={publish}
                onChange={(e) => setPublish(e.target.checked)}
                className="rounded border-ink-300"
              />
              {t("resources.publishNow")}
            </label>

            <button
              type="submit"
              disabled={uploading}
              className="rounded-lg bg-brand-600 px-5 py-2.5 font-semibold text-on-inverse hover:bg-brand-800 disabled:opacity-60"
            >
              {uploading ? t("auth.loading") : t("resources.uploadButton")}
            </button>
          </form>
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-ink-900">{t("resources.listTitle")}</h2>

        {sortedResources.length === 0 ? (
          <p className="mt-4 text-ink-500">{t("resources.empty")}</p>
        ) : (
          <ul className="mt-4 divide-y divide-ink-200 rounded-xl border border-ink-200">
            {sortedResources.map((resource) => {
              const category = categories.find((c) => c.id === resource.category_id);
              return (
                <li key={resource.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-ink-900">{resource.title}</p>
                    {resource.description && (
                      <p className="mt-1 text-sm text-ink-600">{resource.description}</p>
                    )}
                    <p className="mt-1 text-xs text-ink-500">
                      {category?.name_ko ?? "—"}
                      {resource.class_slug ? ` · ${t(`classes.links.${resource.class_slug}`)}` : ""}
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
                    {(canUpload && resource.uploaded_by === profile.id) || admin ? (
                      <button
                        type="button"
                        onClick={() => togglePublish(resource)}
                        className="rounded-lg border border-ink-200 px-3 py-1.5 text-sm font-medium text-ink-700 hover:bg-ink-50"
                      >
                        {resource.is_published ? t("resources.unpublish") : t("resources.publish")}
                      </button>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
