import { useEffect, useState } from "react";

import { useScopeConfig } from "./ScopeConfigContext";

const WARNINGS_COLLAPSE_STORAGE_KEY = "panel:config-scope-warnings-collapsed";

export function ScopeTemplateWarningsPanel() {
  const ctx = useScopeConfig();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(WARNINGS_COLLAPSE_STORAGE_KEY);
    if (stored === "1") setIsCollapsed(true);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      WARNINGS_COLLAPSE_STORAGE_KEY,
      isCollapsed ? "1" : "0"
    );
  }, [isCollapsed]);

  if (!ctx || ctx.warnings.length === 0) return null;

  return (
    <div className="mt-2 border-t border-border/50 pt-2">
      <div className="flex items-center justify-between gap-2">
        <div className="text-[11px] font-medium text-amber-700 dark:text-amber-300">
          异常调用警告
          <span className="ml-1.5 rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold">
            {ctx.warnings.length}
          </span>
        </div>
        <button
          type="button"
          className="rounded border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground hover:bg-accent"
          onClick={() => setIsCollapsed((prev) => !prev)}
        >
          {isCollapsed ? "展开警告" : "收起警告"}
        </button>
      </div>
      {!isCollapsed ? (
        <ul className="mt-2 max-h-[200px] space-y-1 overflow-auto text-[10px] leading-relaxed">
          {ctx.warnings.map((warning) => (
            <li key={`${warning.fieldId}-${warning.kind}-${warning.missingPath}-${warning.expression}`}>
              <button
                type="button"
                className="w-full rounded border border-amber-500/30 bg-amber-500/10 px-2 py-1.5 text-left text-amber-800 hover:bg-amber-500/15 dark:text-amber-200"
                onClick={() => ctx.scrollToField(warning.fieldId)}
              >
                {warning.message}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
