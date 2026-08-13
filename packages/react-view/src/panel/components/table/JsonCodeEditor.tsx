import React, { useMemo, useRef } from "react";
import { Button } from "@arronqzy/ui";
import { useI18n } from "@arronqzy/i18n/react";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function highlightJson(source: string): string {
  const escaped = escapeHtml(source);
  return escaped.replace(
    /("(?:\\.|[^"\\])*")\s*(:)?|\b(true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g,
    (match, str, colon, boolNull) => {
      if (str != null) {
        if (colon != null) {
          return `<span class="jt-key">${str}</span>${colon}`;
        }
        return `<span class="jt-str">${str}</span>`;
      }
      if (boolNull != null) return `<span class="jt-bool">${boolNull}</span>`;
      return `<span class="jt-num">${match}</span>`;
    }
  );
}

export function JsonCodeEditor({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (next: string) => void;
  className?: string;
}) {
  const { t } = useI18n();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const preRef = useRef<HTMLPreElement | null>(null);
  const gutterRef = useRef<HTMLDivElement | null>(null);
  const lines = useMemo(() => Math.max(1, value.split("\n").length), [value]);
  const highlighted = useMemo(() => highlightJson(value || " "), [value]);

  const syncScroll = () => {
    const ta = textareaRef.current;
    const pre = preRef.current;
    const gutter = gutterRef.current;
    if (!ta) return;
    if (pre) {
      pre.scrollTop = ta.scrollTop;
      pre.scrollLeft = ta.scrollLeft;
    }
    if (gutter) gutter.scrollTop = ta.scrollTop;
  };

  const formatJson = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    try {
      onChange(JSON.stringify(JSON.parse(trimmed), null, 2));
    } catch {
      // keep as-is; parent validates on save
    }
  };

  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="text-[11px] text-muted-foreground">{t("panel.config.tableRowsEditEditorHint")}</div>
        <Button type="button" variant="outline" size="sm" className="h-7 px-2 text-[11px]" onClick={formatJson}>
          {t("panel.config.tableRowsEditFormat")}
        </Button>
      </div>
      <div className="overflow-hidden rounded-lg border border-zinc-700/80 bg-[#0f1419] shadow-inner">
        <div className="flex max-h-[min(62vh,560px)] min-h-[420px]">
          <div
            ref={gutterRef}
            aria-hidden
            className="select-none overflow-hidden border-r border-zinc-800 bg-[#0b1015] px-2 py-3 text-right font-mono text-[12px] leading-5 text-zinc-600"
            style={{ minWidth: 36 }}
          >
            {Array.from({ length: lines }, (_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <div className="relative min-w-0 flex-1">
            <pre
              ref={preRef}
              className="pointer-events-none absolute inset-0 m-0 overflow-auto whitespace-pre p-3 font-mono text-[12.5px] leading-5 text-zinc-200"
              dangerouslySetInnerHTML={{ __html: highlighted + "\n" }}
            />
            <textarea
              ref={textareaRef}
              value={value}
              spellCheck={false}
              onScroll={syncScroll}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key !== "Tab") return;
                e.preventDefault();
                const el = e.currentTarget;
                const start = el.selectionStart;
                const end = el.selectionEnd;
                const next = `${value.slice(0, start)}  ${value.slice(end)}`;
                onChange(next);
                requestAnimationFrame(() => {
                  el.selectionStart = el.selectionEnd = start + 2;
                });
              }}
              className="absolute inset-0 h-full w-full resize-none overflow-auto bg-transparent p-3 font-mono text-[12.5px] leading-5 text-transparent caret-sky-300 outline-none"
              style={{ WebkitTextFillColor: "transparent" }}
              aria-label={t("panel.config.tableRowsEditTitle")}
            />
          </div>
        </div>
      </div>
      <style>{`
        .jt-key { color: #7dd3fc; }
        .jt-str { color: #86efac; }
        .jt-num { color: #fcd34d; }
        .jt-bool { color: #f9a8d4; }
      `}</style>
    </div>
  );
}
