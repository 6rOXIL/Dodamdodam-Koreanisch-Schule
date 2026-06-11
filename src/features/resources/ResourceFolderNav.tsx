"use client";

import { useLanguage } from "@/lib/contexts/LanguageContext";
import {
  RESOURCE_CLASS_SLUGS,
  RESOURCE_COMMON_CLASS,
  type ResourceClassFilter,
} from "@/lib/resources/classSlugs";

type ResourceFolderNavProps = {
  selectedClass: ResourceClassFilter;
  onSelectClass: (value: ResourceClassFilter) => void;
  classCounts: {
    all: number;
    common: number;
    kindergarten: number;
    elementary: number;
    adults: number;
  };
};

function FolderIcon({ open }: { open: boolean }) {
  return (
    <svg
      className="h-4 w-4 shrink-0"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden
    >
      {open ? (
        <path d="M2 6a2 2 0 0 1 2-2h3.172a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 11.828 6H16a2 2 0 0 1 2 2v1H2V6Zm0 4h16v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4Z" />
      ) : (
        <path d="M2 6a2 2 0 0 1 2-2h3.172a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 11.828 6H16a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6Z" />
      )}
    </svg>
  );
}

function NavItem({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition ${
        active
          ? "bg-brand-100 font-semibold text-brand-950"
          : "text-ink-700 hover:bg-ink-100"
      }`}
    >
      <FolderIcon open={active} />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      <span className={`shrink-0 text-xs ${active ? "text-brand-800/80" : "text-ink-400"}`}>
        {count}
      </span>
    </button>
  );
}

export default function ResourceFolderNav({
  selectedClass,
  onSelectClass,
  classCounts,
}: ResourceFolderNavProps) {
  const { t } = useLanguage();

  const items: { id: ResourceClassFilter; label: string; count: number }[] = [
    { id: "all", label: t("resources.allClassesFolder"), count: classCounts.all },
    ...RESOURCE_CLASS_SLUGS.map((slug) => ({
      id: slug,
      label: t(`classes.links.${slug}`),
      count: classCounts[slug],
    })),
    { id: RESOURCE_COMMON_CLASS, label: t("resources.commonClass"), count: classCounts.common },
  ];

  return (
    <nav
      aria-label={t("resources.folderNavLabel")}
      className="rounded-xl border border-ink-200 bg-surface-muted p-3 lg:sticky lg:top-[calc(4rem+env(safe-area-inset-top,0px)+1.5rem)]"
    >
      <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-ink-500">
        {t("resources.filterByClass")}
      </p>
      <ul className="space-y-0.5">
        {items.map(({ id, label, count }) => (
          <li key={id}>
            <NavItem
              active={selectedClass === id}
              label={label}
              count={count}
              onClick={() => onSelectClass(id)}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
