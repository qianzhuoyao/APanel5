import { useMemo, useRef, type ChangeEvent } from "react";
import {
  renderJsonWithErrorHighlights,
  type JsonErrorRange,
} from "@arronqzy/blueprint-dsl";
import { useI18nOptional as useI18n } from "@arronqzy/i18n/react";
import { cn } from "@arronqzy/ui";

export function JsonLintTextarea({
  value,
  onChange,
  ranges,
  placeholder,
  rows = 12,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  ranges: JsonErrorRange[];
  placeholder?: string;
  rows?: number;
  className?: string;
}) {
  const { t } = useI18n();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const highlightedHtml = useMemo(
    () => renderJsonWithErrorHighlights(value, ranges),
    [ranges, value]
  );

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const jumpToFirstError = () => {
    const ta = textareaRef.current;
    const first = ranges[0];
    if (!ta || !first) return;
    ta.focus();
    const start = Math.max(0, first.start);
    const end = Math.max(start, Math.min(value.length, first.end));
    ta.setSelectionRange(start, end);
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        rows={rows}
        spellCheck={false}
        placeholder={placeholder}
        className={cn(
          "w-full resize-y rounded-md border border-input bg-background px-2 py-1.5 font-mono text-[11px] leading-relaxed text-foreground shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-primary",
          ranges.length > 0 && "border-destructive/60"
        )}
      />
      {ranges.length > 0 ? (
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] text-destructive">
              {t("blueprint.config.jsonErrorPreviewHint")}
            </span>
            <button
              type="button"
              className="shrink-0 text-[10px] text-destructive underline-offset-2 hover:underline"
              onClick={jumpToFirstError}
            >
              {t("blueprint.config.jsonJumpToError")}
            </button>
          </div>
          <pre
            aria-hidden
            className="max-h-40 overflow-auto whitespace-pre-wrap break-words rounded-md border border-destructive/30 bg-destructive/5 px-2 py-1.5 font-mono text-[11px] leading-relaxed text-foreground"
            dangerouslySetInnerHTML={{ __html: highlightedHtml || "\n" }}
          />
          <style>{`
            .json-lint-error {
              margin: 0;
              padding: 0;
              border: 0;
              font: inherit;
              line-height: inherit;
              color: hsl(var(--destructive));
              background: color-mix(in oklab, hsl(var(--destructive)) 22%, transparent);
              border-radius: 2px;
              text-decoration: underline wavy hsl(var(--destructive));
              text-underline-offset: 2px;
            }
          `}</style>
        </div>
      ) : null}
    </div>
  );
}
