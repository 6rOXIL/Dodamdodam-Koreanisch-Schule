"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { ClassesContent } from "@/lib/data/classes";
import type { IntroductionContent } from "@/lib/data/introduction";
import ClassesContentEditor from "@/features/admin/homepage/ClassesContentEditor";
import IntroductionContentEditor from "@/features/admin/homepage/IntroductionContentEditor";
import SimpleCopyEditor from "@/features/admin/homepage/SimpleCopyEditor";
import { Field, TextInput } from "@/features/admin/homepage/FormFields";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import type { Locale } from "@/lib/i18n/config";
import {
  fetchAllSiteNav,
  fetchPageContent,
  fetchTopNavItems,
  getDefaultPageContent,
  type SiteCategoryWithSubs,
  updateSiteCategory,
  updateSiteSubcategory,
  upsertPageContent,
} from "@/lib/siteContent/api";
import {
  COPY_FIELDS_BY_PAGE,
  getDefaultCopyPayload,
  isCopyPageSlug,
  navSlugToPageSlug,
  type CopyPageSlug,
} from "@/lib/siteContent/copyFields";
import { createClient } from "@/lib/supabase/client";
import type { SiteLocale, SiteNavItem, SiteSubcategory } from "@/lib/supabase/database.types";

const LOCALES: SiteLocale[] = ["ko", "en", "de"];
const INTRO_SEGMENTS = ["greeting", "summary", "calendar", "directions"] as const;
const CLASS_SEGMENTS = ["kindergarten", "elementary", "adults"] as const;

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export default function AdminPagesClient() {
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();
  const sectionParam = searchParams.get("section");

  const [navItems, setNavItems] = useState<SiteNavItem[]>([]);
  const [selectedNavId, setSelectedNavId] = useState<string | null>(null);
  const [pageCategories, setPageCategories] = useState<SiteCategoryWithSubs[]>([]);
  const [segment, setSegment] = useState("greeting");
  const [locale, setLocale] = useState<SiteLocale>("ko");
  const [introContent, setIntroContent] = useState<IntroductionContent | null>(null);
  const [classesContent, setClassesContent] = useState<ClassesContent | null>(null);
  const [copyContent, setCopyContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedNav = useMemo(
    () => navItems.find((item) => item.id === selectedNavId) ?? navItems[0] ?? null,
    [navItems, selectedNavId]
  );

  const pageSlug = selectedNav
    ? navSlugToPageSlug(selectedNav.slug, selectedNav.content_kind)
    : "introduction";

  const pageCategory = useMemo(
    () => pageCategories.find((c) => c.slug === pageSlug) ?? null,
    [pageCategories, pageSlug]
  );

  const loadNav = useCallback(async () => {
    const [top, cats] = await Promise.all([fetchTopNavItems(), fetchAllSiteNav()]);
    setNavItems(top);
    setPageCategories(cats);
    return { top, cats };
  }, []);

  const loadContent = useCallback(
    async (slug: string, loc: SiteLocale) => {
      if (slug === "introduction") {
        const remote = await fetchPageContent<IntroductionContent>(slug, loc);
        setIntroContent(clone(remote ?? (getDefaultPageContent("introduction", loc as Locale) as IntroductionContent)));
        return;
      }
      if (slug === "classes") {
        const remote = await fetchPageContent<ClassesContent>(slug, loc);
        setClassesContent(clone(remote ?? (getDefaultPageContent("classes", loc as Locale) as ClassesContent)));
        return;
      }
      if (isCopyPageSlug(slug)) {
        const remote = await fetchPageContent<Record<string, string>>(slug, loc);
        setCopyContent(clone(remote ?? getDefaultCopyPayload(slug, loc as Locale)));
      }
    },
    []
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { top } = await loadNav();
      if (cancelled) return;

      let initial =
        top.find((item) => {
          const mapped = navSlugToPageSlug(item.slug, item.content_kind);
          return mapped === sectionParam || item.slug === sectionParam;
        }) ?? top[0];

      if (sectionParam === "introduction") {
        initial = top.find((i) => navSlugToPageSlug(i.slug, i.content_kind) === "introduction") ?? initial;
      }
      if (sectionParam === "classes") {
        initial = top.find((i) => navSlugToPageSlug(i.slug, i.content_kind) === "classes") ?? initial;
      }

      if (initial) {
        setSelectedNavId(initial.id);
        const slug = navSlugToPageSlug(initial.slug, initial.content_kind);
        await loadContent(slug, "ko");
        const cat = (await fetchAllSiteNav()).find((c) => c.slug === slug);
        if (cat?.subcategories[0]) setSegment(cat.subcategories[0].slug);
      }
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [loadNav, loadContent, sectionParam]);

  useEffect(() => {
    if (loading || !selectedNav) return;
    loadContent(pageSlug, locale);
  }, [pageSlug, locale, loading, selectedNav, loadContent]);

  useEffect(() => {
    if (!pageCategory) return;
    if (!pageCategory.subcategories.some((s) => s.slug === segment)) {
      setSegment(pageCategory.subcategories[0]?.slug ?? "");
    }
  }, [pageCategory, segment]);

  async function handleSaveContent() {
    setError(null);
    setMessage(null);
    setSaving(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setSaving(false);
      setError(t("auth.notLoggedIn"));
      return;
    }

    let payload: IntroductionContent | ClassesContent | Record<string, string> | null = null;
    if (pageSlug === "introduction") payload = introContent;
    else if (pageSlug === "classes") payload = classesContent;
    else if (isCopyPageSlug(pageSlug)) payload = copyContent;

    if (!payload) {
      setSaving(false);
      setError(t("adminHomepage.loadError"));
      return;
    }

    const { error: saveError } = await upsertPageContent(pageSlug, locale, payload, user.id);
    setSaving(false);
    if (saveError) {
      setError(saveError);
      return;
    }
    setMessage(t("adminHomepage.saveSuccess"));
  }

  async function handleResetDefaults() {
    if (pageSlug === "introduction") {
      setIntroContent(clone(getDefaultPageContent("introduction", locale as Locale) as IntroductionContent));
    } else if (pageSlug === "classes") {
      setClassesContent(clone(getDefaultPageContent("classes", locale as Locale) as ClassesContent));
    } else if (isCopyPageSlug(pageSlug)) {
      setCopyContent(clone(getDefaultCopyPayload(pageSlug, locale as Locale)));
    }
    setMessage(t("adminHomepage.resetHint"));
  }

  async function handleSaveCategoryLabels() {
    if (!pageCategory) return;
    setError(null);
    setSaving(true);
    const { error: catError } = await updateSiteCategory(pageCategory.id, {
      label_ko: pageCategory.label_ko,
      label_en: pageCategory.label_en,
      label_de: pageCategory.label_de,
      sort_order: pageCategory.sort_order,
      is_visible: pageCategory.is_visible,
    });
    if (catError) {
      setSaving(false);
      setError(catError);
      return;
    }
    for (const sub of pageCategory.subcategories) {
      const { error: subError } = await updateSiteSubcategory(sub.id, {
        label_ko: sub.label_ko,
        label_en: sub.label_en,
        label_de: sub.label_de,
        sort_order: sub.sort_order,
        is_visible: sub.is_visible,
      });
      if (subError) {
        setSaving(false);
        setError(subError);
        return;
      }
    }
    setSaving(false);
    setMessage(t("adminHomepage.navSaveSuccess"));
    await loadNav();
  }

  function patchPageCategory(patch: Partial<SiteCategoryWithSubs>) {
    setPageCategories((prev) =>
      prev.map((c) => (c.id === pageCategory?.id ? { ...c, ...patch } : c))
    );
  }

  function patchSubcategory(subId: string, patch: Partial<SiteSubcategory>) {
    setPageCategories((prev) =>
      prev.map((c) =>
        c.id === pageCategory?.id
          ? {
              ...c,
              subcategories: c.subcategories.map((s) =>
                s.id === subId ? { ...s, ...patch } : s
              ),
            }
          : c
      )
    );
  }

  const introLabels = {
    paragraphs: t("adminHomepage.fields.paragraphs"),
    addItem: t("adminHomepage.addItem"),
    schoolName: t("introduction.schoolName"),
    principal: t("introduction.principal"),
    officeAddress: t("adminHomepage.fields.officeAddress"),
    elementaryAddress: t("adminHomepage.fields.elementaryAddress"),
    phone: t("introduction.phone"),
    email: t("adminHomepage.fields.email"),
    purposeTitle: t("adminHomepage.fields.purposeTitle"),
    purposeText: t("adminHomepage.fields.purposeText"),
    goalsTitle: t("adminHomepage.fields.goalsTitle"),
    goalsItems: t("adminHomepage.fields.goalsItems"),
    directionTitle: t("adminHomepage.fields.directionTitle"),
    directionParagraphs: t("adminHomepage.fields.directionParagraphs"),
    quoteIntro: t("adminHomepage.fields.quoteIntro"),
    quote: t("adminHomepage.fields.quote"),
    closingBefore: t("adminHomepage.fields.closingBefore"),
    closingHighlight: t("adminHomepage.fields.closingHighlight"),
    closingAfter: t("adminHomepage.fields.closingAfter"),
    historyPeriod: t("adminHomepage.fields.historyPeriod"),
    historyLines: t("adminHomepage.fields.historyLines"),
    addHistory: t("adminHomepage.addHistory"),
    calendarTitle: t("adminHomepage.fields.calendarTitle"),
    monthWeekHeader: t("adminHomepage.fields.monthWeekHeader"),
    month: t("adminHomepage.fields.month"),
    week: t("adminHomepage.fields.week"),
    footnotes: t("adminHomepage.fields.footnotes"),
    schoolHolidaysTitle: t("adminHomepage.fields.schoolHolidaysTitle"),
    holidayLabel: t("adminHomepage.fields.holidayLabel"),
    holidayRange: t("adminHomepage.fields.holidayRange"),
    addHoliday: t("adminHomepage.addHoliday"),
    publicHolidaysTitle: t("adminHomepage.fields.publicHolidaysTitle"),
    holidayName: t("adminHomepage.fields.holidayName"),
    holidayDate: t("adminHomepage.fields.holidayDate"),
    holidayNote: t("adminHomepage.fields.holidayNote"),
    addPublicHoliday: t("adminHomepage.addPublicHoliday"),
    titlePrimary: t("adminHomepage.fields.titlePrimary"),
    titleSecondary: t("adminHomepage.fields.titleSecondary"),
    teachingSitesLabel: t("adminHomepage.fields.teachingSitesLabel"),
    lines: t("adminHomepage.fields.lines"),
    phones: t("adminHomepage.fields.phones"),
    emailLine: t("adminHomepage.fields.emailLine"),
    mapLabel: t("adminHomepage.fields.mapLabel"),
    mapPangea: t("adminHomepage.fields.mapPangea"),
    mapRuppin: t("adminHomepage.fields.mapRuppin"),
  };

  const classLabels = {
    addItem: t("adminHomepage.addItem"),
    scheduleTitle: t("adminHomepage.fields.scheduleTitle"),
    scheduleGroupLabel: t("adminHomepage.fields.scheduleGroupLabel"),
    className: t("classes.table.class"),
    time: t("classes.table.time"),
    group: t("classes.table.group"),
    addScheduleRow: t("adminHomepage.addScheduleRow"),
    title: t("adminHomepage.fields.blockTitle"),
    location: t("classes.location"),
    lead: t("adminHomepage.fields.lead"),
    paragraphs: t("adminHomepage.fields.paragraphs"),
    bullets: t("adminHomepage.fields.bullets"),
    textbooks: t("adminHomepage.fields.textbooks"),
    note: t("adminHomepage.fields.note"),
    petalSection: t("adminHomepage.fields.petalSection"),
    fruitSection: t("adminHomepage.fields.fruitSection"),
    tierName: t("adminHomepage.fields.tierName"),
    tierSchedule: t("classes.adults.schedule"),
    tierTuition: t("classes.adults.tuition"),
    tierTextbook: t("classes.adults.textbook"),
    addTier: t("adminHomepage.addTier"),
  };

  if (loading) {
    return <p className="text-ink-500">{t("auth.loading")}</p>;
  }

  if (navItems.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-ink-900">{t("admin.pages.title")}</h2>
        <p className="rounded-xl border border-dashed border-ink-200 bg-surface px-4 py-8 text-center text-sm text-ink-500">
          {t("admin.menu.empty")}
        </p>
        <Link href={`/${language}/admin/menu/`} className="text-sm font-medium text-brand-700">
          {t("admin.dashboard.editMenu")} →
        </Link>
      </div>
    );
  }

  const isResource = Boolean(selectedNav?.content_kind?.startsWith("resources:"));
  const resourceCategorySlug = isResource
    ? selectedNav!.content_kind.slice("resources:".length)
    : null;
  const resourcesHref = resourceCategorySlug
    ? `/${language}/admin/resources/?focus=${encodeURIComponent(resourceCategorySlug)}`
    : `/${language}/admin/resources/`;
  const isForm = Boolean(selectedNav?.content_kind?.startsWith("form:"));
  const formManageSlug = isForm
    ? selectedNav!.content_kind.slice("form:".length) || selectedNav!.slug
    : null;
  const formManageHref = formManageSlug
    ? `/${language}/admin/forms/?slug=${encodeURIComponent(formManageSlug)}`
    : `/${language}/admin/forms/`;

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-ink-900">{t("admin.pages.title")}</h2>
        <p className="mt-1 text-ink-600">{t("admin.pages.lead")}</p>
      </header>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="rounded-lg bg-brand-50 px-4 py-3 text-sm text-brand-900" role="status">
          {message}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setSelectedNavId(item.id);
              setMessage(null);
              setError(null);
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              selectedNav?.id === item.id
                ? "bg-brand-600 text-white"
                : "border border-ink-200 bg-surface text-ink-700 hover:bg-ink-50"
            }`}
          >
            {item.label_ko}
          </button>
        ))}
      </div>

      {pageCategory && (pageSlug === "introduction" || pageSlug === "classes") && (
        <section className="rounded-2xl border border-ink-200 bg-surface p-4 shadow-sm md:p-6">
          <h3 className="text-lg font-semibold text-ink-900">{t("adminHomepage.navSection")}</h3>
          <p className="mt-1 text-sm text-ink-500">{t("adminHomepage.navHint")}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Field label="한국어">
              <TextInput
                value={pageCategory.label_ko}
                onChange={(label_ko) => patchPageCategory({ label_ko })}
              />
            </Field>
            <Field label="English">
              <TextInput
                value={pageCategory.label_en}
                onChange={(label_en) => patchPageCategory({ label_en })}
              />
            </Field>
            <Field label="Deutsch">
              <TextInput
                value={pageCategory.label_de}
                onChange={(label_de) => patchPageCategory({ label_de })}
              />
            </Field>
          </div>

          <div className="mt-6 space-y-3">
            <h4 className="text-sm font-semibold text-ink-800">{t("adminHomepage.subcategories")}</h4>
            {pageCategory.subcategories.map((sub) => (
              <div key={sub.id} className="rounded-lg border border-ink-100 bg-surface-muted/40 p-3">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-ink-500">{sub.slug}</p>
                  <label className="flex items-center gap-2 text-sm text-ink-700">
                    <input
                      type="checkbox"
                      checked={sub.is_visible}
                      onChange={(e) => patchSubcategory(sub.id, { is_visible: e.target.checked })}
                    />
                    {t("adminHomepage.visible")}
                  </label>
                </div>
                <div className="grid gap-2 sm:grid-cols-4">
                  <Field label="한국어">
                    <TextInput
                      value={sub.label_ko}
                      onChange={(label_ko) => patchSubcategory(sub.id, { label_ko })}
                    />
                  </Field>
                  <Field label="English">
                    <TextInput
                      value={sub.label_en}
                      onChange={(label_en) => patchSubcategory(sub.id, { label_en })}
                    />
                  </Field>
                  <Field label="Deutsch">
                    <TextInput
                      value={sub.label_de}
                      onChange={(label_de) => patchSubcategory(sub.id, { label_de })}
                    />
                  </Field>
                  <Field label={t("adminHomepage.sortOrder")}>
                    <TextInput
                      value={String(sub.sort_order)}
                      onChange={(value) =>
                        patchSubcategory(sub.id, { sort_order: Number(value) || 0 })
                      }
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleSaveCategoryLabels}
            disabled={saving}
            className="mt-4 rounded-lg bg-ink-900 px-4 py-2 text-sm font-medium text-white hover:bg-ink-800 disabled:opacity-60"
          >
            {t("adminHomepage.saveNav")}
          </button>
        </section>
      )}

      <section className="rounded-2xl border border-ink-200 bg-surface p-4 shadow-sm md:p-6">
        <h3 className="text-lg font-semibold text-ink-900">{t("adminHomepage.contentSection")}</h3>
        <p className="mt-1 text-sm text-ink-500">{t("adminHomepage.contentHint")}</p>

        {isForm ? (
          <div className="mt-4 rounded-lg border border-ink-200 bg-surface-muted/50 px-4 py-3 text-sm text-ink-700">
            <p>{t("admin.pages.formHint")}</p>
            <Link
              href={formManageHref}
              className="mt-2 inline-block font-medium text-brand-700 hover:text-brand-900"
            >
              {t("admin.nav.forms")} →
            </Link>
          </div>
        ) : null}

        {!isForm && (pageSlug === "introduction" || pageSlug === "classes") && pageCategory && (
          <div className="mt-4 flex flex-wrap gap-2">
            {pageCategory.subcategories.map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => setSegment(sub.slug)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium sm:text-sm ${
                  segment === sub.slug
                    ? "border-brand-600 bg-brand-100 text-brand-950"
                    : "border-ink-200 bg-ink-50 text-ink-700 hover:bg-brand-50"
                }`}
              >
                {sub.label_ko}
              </button>
            ))}
          </div>
        )}

        {!isForm ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {LOCALES.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setLocale(loc)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                  locale === loc
                    ? "bg-secondary-600 text-white"
                    : "border border-ink-200 text-ink-700 hover:bg-ink-50"
                }`}
              >
                {loc.toUpperCase()}
              </button>
            ))}
          </div>
        ) : null}

        <div className="mt-6">
          {!isForm && pageSlug === "introduction" &&
          introContent &&
          INTRO_SEGMENTS.includes(segment as (typeof INTRO_SEGMENTS)[number]) ? (
            <IntroductionContentEditor
              content={introContent}
              segment={segment as (typeof INTRO_SEGMENTS)[number]}
              labels={introLabels}
              onChange={setIntroContent}
            />
          ) : null}

          {!isForm && pageSlug === "classes" &&
          classesContent &&
          CLASS_SEGMENTS.includes(segment as (typeof CLASS_SEGMENTS)[number]) ? (
            <ClassesContentEditor
              content={classesContent}
              segment={segment as (typeof CLASS_SEGMENTS)[number]}
              labels={classLabels}
              onChange={setClassesContent}
            />
          ) : null}

          {!isForm && isCopyPageSlug(pageSlug) ? (
            <div className="space-y-4">
              {isResource && (
                <div className="rounded-lg border border-ink-200 bg-surface-muted/50 px-4 py-3 text-sm text-ink-700">
                  <p>{t("admin.pages.resourceHint")}</p>
                  <Link
                    href={resourcesHref}
                    className="mt-2 inline-block font-medium text-brand-700 hover:text-brand-900"
                  >
                    {t("admin.nav.resources")} →
                  </Link>
                </div>
              )}
              <SimpleCopyEditor
                fields={COPY_FIELDS_BY_PAGE[pageSlug as CopyPageSlug]}
                values={copyContent}
                onChange={setCopyContent}
              />
            </div>
          ) : null}
        </div>

        {!isForm &&
          (pageSlug === "introduction" ||
            pageSlug === "classes" ||
            isCopyPageSlug(pageSlug)) && (
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleSaveContent}
              disabled={saving}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {saving ? t("auth.loading") : t("adminHomepage.saveContent")}
            </button>
            <button
              type="button"
              onClick={handleResetDefaults}
              disabled={saving}
              className="rounded-lg border border-ink-200 px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50"
            >
              {t("adminHomepage.resetDefaults")}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
