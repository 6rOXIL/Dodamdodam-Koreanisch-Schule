"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { normalizeDescriptionForStorage, toEditorHtml } from "@/lib/resources/sanitizeResourceHtml";

type ResourceRichTextEditorProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

type ToolbarButton = {
  label: string;
  command: string;
  value?: string;
  className?: string;
};

export default function ResourceRichTextEditor({
  id,
  label,
  value,
  onChange,
  disabled = false,
}: ResourceRichTextEditorProps) {
  const { t } = useLanguage();
  const editorRef = useRef<HTMLDivElement>(null);
  const lastSyncedValue = useRef(value);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || value === lastSyncedValue.current) return;
    lastSyncedValue.current = value;
    editor.innerHTML = toEditorHtml(value);
  }, [value]);

  function emitChange() {
    const editor = editorRef.current;
    if (!editor) return;
    const next = normalizeDescriptionForStorage(editor.innerHTML) ?? "";
    lastSyncedValue.current = next;
    onChange(next);
  }

  function runCommand(command: string, commandValue?: string) {
    if (disabled) return;
    editorRef.current?.focus();
    document.execCommand(command, false, commandValue);
    emitChange();
  }

  function handleLink() {
    if (disabled) return;
    const url = window.prompt(t("resources.editorLinkPrompt"));
    if (!url?.trim()) return;
    runCommand("createLink", url.trim());
  }

  const buttons: ToolbarButton[] = [
    { label: t("resources.editorBold"), command: "bold", className: "font-bold" },
    { label: t("resources.editorItalic"), command: "italic", className: "italic" },
    { label: t("resources.editorUnderline"), command: "underline", className: "underline" },
    { label: t("resources.editorBulletList"), command: "insertUnorderedList" },
    { label: t("resources.editorNumberedList"), command: "insertOrderedList" },
  ];

  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-ink-700">
        {label}
      </label>
      <div className="overflow-hidden rounded-lg border border-ink-200 bg-surface focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100">
        <div
          className="flex flex-wrap gap-0.5 border-b border-ink-100 bg-ink-50/80 px-2 py-1.5"
          role="toolbar"
          aria-label={t("resources.editorToolbarLabel")}
        >
          {buttons.map(({ label: buttonLabel, command, className }) => (
            <button
              key={command}
              type="button"
              disabled={disabled}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => runCommand(command)}
              className={`min-w-8 rounded-md px-2 py-1 text-sm text-ink-700 transition hover:bg-surface disabled:opacity-50 ${className ?? ""}`}
              aria-label={buttonLabel}
              title={buttonLabel}
            >
              {command === "bold"
                ? "B"
                : command === "italic"
                  ? "I"
                  : command === "underline"
                    ? "U"
                    : command === "insertUnorderedList"
                      ? "•"
                      : "1."}
            </button>
          ))}
          <button
            type="button"
            disabled={disabled}
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleLink}
            className="rounded-md px-2 py-1 text-sm text-ink-700 transition hover:bg-surface disabled:opacity-50"
            aria-label={t("resources.editorLink")}
            title={t("resources.editorLink")}
          >
            ↗
          </button>
        </div>
        <div
          id={id}
          ref={editorRef}
          contentEditable={!disabled}
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          onInput={emitChange}
          className="min-h-[7rem] px-3 py-2 text-sm leading-relaxed text-ink-900 outline-none [&_ol]:ml-5 [&_ol]:list-decimal [&_ul]:ml-5 [&_ul]:list-disc"
          data-placeholder={t("resources.editorPlaceholder")}
        />
      </div>
      <p className="mt-1 text-xs text-ink-500">{t("resources.editorHelp")}</p>
    </div>
  );
}
