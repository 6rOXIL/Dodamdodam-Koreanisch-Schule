"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { ClassesContent } from "@/lib/data/classes";
import type { IntroductionContent } from "@/lib/data/introduction";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import type { Locale } from "@/lib/i18n/config";
import {
  fetchAllSiteNav,
  fetchPageContent,
  getDefaultPageContent,
  type SiteCategoryWithSubs,
  updateSiteCategory,
  updateSiteSubcategory,
  upsertPageContent,
} from "@/lib/siteContent/api";
import { createClient } from "@/lib/supabase/client";
import type { SiteLocale, SitePageSlug, SiteSubcategory } from "@/lib/supabase/database.types";
import ClassesContentEditor from "./ClassesContentEditor";
import IntroductionContentEditor from "./IntroductionContentEditor";
import { Field, TextInput } from "./FormFields";

const LOCALES: SiteLocale[] = ["ko", "en", "de"];
const INTRO_SEGMENTS = ["greeting", "summary", "calendar", "directions"] as const;
const CLASS_SEGMENTS = ["kindergarten", "elementary", "adults"] as const;

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export default function AdminHomepageClient() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const sectionParam = searchParams.get("section");

  const [nav, setNav] = useState<SiteCategoryWithSubs[]>([]);
  const [pageSlug, setPageSlug] = useState<SitePageSlug>(
    sectionParam === "classes" ? "classes" : "introduction"
  );
  const [segment, setSegment] = useState<string>("greeting");
  const [locale, setLocale] = useState<SiteLocale>("ko");
  const [introContent, setIntroContent] = useState<IntroductionContent | null>(null);
  const [classesContent, setClassesContent] = useState<ClassesContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const activeCategory = useMemo(
    () => nav.find((c) => c.slug === pageSlug) ?? null,
    [nav, pageSlug]
  );

  const loadNav = useCallback(async () => {
    const data = await fetchAllSiteNav();
    setNav(data);
    return data;
  }, []);

  const loadContent = useCallback(async (slug: SitePageSlug, loc: SiteLocale) => {
    const remote = await fetchPageContent(slug, loc);
    const payload = remote ?? getDefaultPageContent(slug, loc as Locale);
    if (slug === "introduction") {
      setIntroContent(clone(payload as IntroductionContent));
    } else {
      setClassesContent(clone(payload as ClassesContent));
    }
  }, []);

  useEffect(() => {
    if (sectionParam === "classes" || sectionParam === "introduction") {
      setPageSlug(sectionParam);
    }
  }, [sectionParam]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const categories = await loadNav();
      if (cancelled) return;
      const initialSlug =
        sectionParam === "classes" || sectionParam === "introduction"
          ? sectionParam
          : categories[0]?.slug ?? "introduction";
      const cat = categories.find((c) => c.slug === initialSlug) ?? categories[0];
      if (cat) {
        setPageSlug(cat.slug);
        setSegment(cat.subcategories[0]?.slug ?? "");
      }
      await loadContent(initialSlug as SitePageSlug, "ko");
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [loadNav, loadContent, sectionParam]);

  useEffect(() => {
    if (loading) return;
    loadContent(pageSlug, locale);
  }, [pageSlug, locale, loading, loadContent]);

  useEffect(() => {
    const cat = nav.find((c) => c.slug === pageSlug);
    if (!cat) return;
    if (!cat.subcategories.some((s) => s.slug === segment)) {
      setSegment(cat.subcategories[0]?.slug ?? "");
    }
  }, [nav, pageSlug, segment]);

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

    const payload = pageSlug === "introduction" ? introContent : classesContent;
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
    const defaults = getDefaultPageContent(pageSlug, locale as Locale);
    if (pageSlug === "introduction") {
      setIntroContent(clone(defaults as IntroductionContent));
    } else {
      setClassesContent(clone(defaults as ClassesContent));
    }
    setMessage(t("adminHomepage.resetHint"));
  }

  async function handleSaveCategoryLabels() {
    if (!activeCategory) return;
    setError(null);
    setSaving(true);
    const { error: catError } = await updateSiteCategory(activeCategory.id, {
      label_ko: activeCategory.label_ko,
      label_en: activeCategory.label_en,
      label_de: activeCategory.label_de,
      sort_order: activeCategory.sort_order,
      is_visible: activeCategory.is_visible,
    });
    if (catError) {
      setSaving(false);
      setError(catError);
      return;
    }
    for (const sub of activeCategory.subcategories) {
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

  function patchCategory(patch: Partial<SiteCategoryWithSubs>) {
    setNav((prev) =>
      prev.map((c) => (c.id === activeCategory?.id ? { ...c, ...patch } : c))
    );
  }

  function patchSubcategory(subId: string, patch: Partial<SiteSubcategory>) {
    setNav((prev) =>
      prev.map((c) =>
        c.id === activeCategory?.id
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

  if (loading || (!introContent && pageSlug === "introduction") || (!classesContent && pageSlug === "classes")) {
    return <p className="text-ink-500">{t("auth.loading")}</p>;
  }

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
        {nav.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => {
              setPageSlug(cat.slug);
              setSegment(cat.subcategories[0]?.slug ?? "");
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              pageSlug === cat.slug
                ? "bg-brand-600 text-white"
                : "border border-ink-200 bg-surface text-ink-700 hover:bg-ink-50"
            }`}
          >
            {cat.label_ko}
          </button>
        ))}
      </div>

      {activeCategory && (
        <section className="rounded-2xl border border-ink-200 bg-surface p-4 shadow-sm md:p-6">
          <h3 className="text-lg font-semibold text-ink-900">{t("adminHomepage.navSection")}</h3>
          <p className="mt-1 text-sm text-ink-500">{t("adminHomepage.navHint")}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Field label="한국어">
              <TextInput
                value={activeCategory.label_ko}
                onChange={(label_ko) => patchCategory({ label_ko })}
              />
            </Field>
            <Field label="English">
              <TextInput
                value={activeCategory.label_en}
                onChange={(label_en) => patchCategory({ label_en })}
              />
            </Field>
            <Field label="Deutsch">
              <TextInput
                value={activeCategory.label_de}
                onChange={(label_de) => patchCategory({ label_de })}
              />
            </Field>
          </div>

          <div className="mt-6 space-y-3">
            <h4 className="text-sm font-semibold text-ink-800">{t("adminHomepage.subcategories")}</h4>
            {activeCategory.subcategories.map((sub) => (
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

        <div className="mt-4 flex flex-wrap gap-2">
          {(activeCategory?.subcategories ?? []).map((sub) => (
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

        <div className="mt-6">
          {pageSlug === "introduction" &&
          introContent &&
          INTRO_SEGMENTS.includes(segment as (typeof INTRO_SEGMENTS)[number]) ? (
            <IntroductionContentEditor
              content={introContent}
              segment={segment as (typeof INTRO_SEGMENTS)[number]}
              labels={introLabels}
              onChange={setIntroContent}
            />
          ) : null}
          {pageSlug === "classes" &&
          classesContent &&
          CLASS_SEGMENTS.includes(segment as (typeof CLASS_SEGMENTS)[number]) ? (
            <ClassesContentEditor
              content={classesContent}
              segment={segment as (typeof CLASS_SEGMENTS)[number]}
              labels={classLabels}
              onChange={setClassesContent}
            />
          ) : null}
        </div>

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
      </section>
    </div>
  );
}
