"use client";

import { useMemo } from "react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { getResourceClassLabel } from "@/lib/resources/classLabel";
import { RESOURCE_COMMON_CLASS, type ResourceClassFilter } from "@/lib/resources/classSlugs";
import { sortResourceClasses } from "@/lib/resources/sortTaxonomy";
import type { ResourceClass } from "@/lib/supabase/database.types";

export type ResourceClassCounts = {
  all: number;
  common: number;
  bySlug: Record<string, number>;
};

type ResourceFolderNavProps = {
  selectedClass: ResourceClassFilter;
  onSelectClass: (value: ResourceClassFilter) => void;
  classCounts: ResourceClassCounts;
  resourceClasses: ResourceClass[];
  isAdmin: boolean;
  onManage: () => void;
};

function FolderIcon({ open }: { open: boolean }) {
  return (
    <svg className="h-4 w-4 shrink-0 opacity-80" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      {open ? (
        <path d="M2 6a2 2 0 0 1 2-2h3.172a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 11.828 6H16a2 2 0 0 1 2 2v1H2V6Zm0 4h16v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4Z" />
      ) : (
        <path d="M2 6a2 2 0 0 1 2-2h3.172a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 11.828 6H16a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6Z" />
      )}
    </svg>
  );
}

export default function ResourceFolderNav({
  selectedClass,
  onSelectClass,
  classCounts,
  resourceClasses,
  isAdmin,
  onManage,
}: ResourceFolderNavProps) {
  const { t } = useLanguage();

  const sortedClasses = useMemo(() => sortResourceClasses(resourceClasses), [resourceClasses]);

  const items: { id: ResourceClassFilter; label: string; count: number }[] = [
    { id: "all", label: t("resources.allClassesFolder"), count: classCounts.all },
    ...sortedClasses.map((resourceClass) => ({
      id: resourceClass.slug,
      label: getResourceClassLabel(resourceClass, t),
      count: classCounts.bySlug[resourceClass.slug] ?? 0,
    })),
    { id: RESOURCE_COMMON_CLASS, label: t("resources.commonClass"), count: classCounts.common },
  ];

  return (
    <nav
      aria-label={t("resources.folderNavLabel")}
      className="rounded-2xl border border-ink-200/80 bg-surface p-2 shadow-sm lg:sticky lg:top-[calc(4rem+env(safe-area-inset-top,0px)+1.5rem)]"
    >
      <div className="mb-1 flex items-center justify-between gap-2 px-2 py-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
          {t("resources.filterByClass")}
        </p>
        {isAdmin && (
          <button
            type="button"
            onClick={onManage}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-ink-500 transition hover:bg-ink-100 hover:text-ink-800"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {t("resources.taxonomyManage")}
          </button>
        )}
      </div>
      <ul className="space-y-0.5">
        {items.map(({ id, label, count }) => {
          const active = selectedClass === id;
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => onSelectClass(id)}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                  active
                    ? "bg-brand-600 font-medium text-on-inverse shadow-sm"
                    : "text-ink-700 hover:bg-ink-100/80"
                }`}
              >
                <FolderIcon open={active} />
                <span className="min-w-0 flex-1 truncate">{label}</span>
                <span className={`shrink-0 text-xs tabular-nums ${active ? "text-on-inverse/80" : "text-ink-400"}`}>
                  {count}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
