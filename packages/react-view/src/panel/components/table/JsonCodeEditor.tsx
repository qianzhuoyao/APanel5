import React, { useMemo } from "react";
import { Button } from "@arronqzy/ui";
import { useI18n } from "@arronqzy/i18n/react";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view";

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
  const extensions = useMemo(
    () => [
      json(),
      EditorView.lineWrapping,
      EditorView.theme({
        "&": {
          height: "100%",
          maxHeight: "100%",
          fontSize: "13px",
          backgroundColor: "transparent",
        },
        "&.cm-editor": {
          height: "100%",
          maxHeight: "100%",
          backgroundColor: "transparent",
        },
        ".cm-scroller": {
          overflow: "auto",
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          lineHeight: "1.55",
        },
        ".cm-content": { padding: "8px 0", caretColor: "#e2e8f0" },
        ".cm-gutters": {
          backgroundColor: "transparent",
          borderRight: "1px solid rgba(148,163,184,0.12)",
          color: "#64748b",
        },
        ".cm-activeLineGutter": { backgroundColor: "rgba(148,163,184,0.08)" },
        ".cm-activeLine": { backgroundColor: "rgba(148,163,184,0.06)" },
      }),
    ],
    []
  );

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
    <div
      className={[
        "flex h-full min-h-0 max-h-full flex-col overflow-hidden rounded-xl border border-slate-700/60 bg-[#0c1220] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-white/5 px-2.5 py-1.5">
        <div className="flex min-w-0 items-center gap-2">
          <span className="rounded-md bg-sky-500/15 px-1.5 py-0.5 font-mono text-[10px] font-medium tracking-wide text-sky-300">
            JSON
          </span>
          <span className="truncate text-[11px] text-slate-400">
            {t("panel.config.tableRowsEditEditorHint")}
          </span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 shrink-0 rounded-md px-2 text-[11px] text-slate-300 hover:bg-white/10 hover:text-white"
          onClick={formatJson}
        >
          {t("panel.config.tableRowsEditFormat")}
        </Button>
      </div>
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <CodeMirror
            value={value}
            height="100%"
            maxHeight="100%"
            theme={oneDark}
            extensions={extensions}
            basicSetup={{
              lineNumbers: true,
              foldGutter: true,
              highlightActiveLine: true,
              bracketMatching: true,
              autocompletion: true,
            }}
            onChange={(next) => onChange(next)}
            className="h-full max-h-full [&_.cm-editor]:h-full [&_.cm-editor]:max-h-full [&_.cm-editor]:outline-none"
            aria-label={t("panel.config.tableRowsEditTitle")}
          />
        </div>
      </div>
    </div>
  );
}
