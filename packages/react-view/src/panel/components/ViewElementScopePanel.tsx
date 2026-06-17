import { useEffect, useRef, useState } from "react";

import { formatViewElementScope } from "../utils/scope-template";

const SCOPE_COLLAPSE_STORAGE_KEY = "panel:config-scope-collapsed";

export type ViewElementScopePanelProps = {
  scope: unknown;
};

export function ViewElementScopePanel({ scope }: ViewElementScopePanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [scopeUpdated, setScopeUpdated] = useState(false);
  const prevScopeSerializedRef = useRef<string | null>(null);
  const themedScrollbarClass =
    "scrollbar-thin [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-muted/40 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border/80 [&::-webkit-scrollbar-thumb]:hover:bg-border";

  useEffect(() => {
    const stored = window.localStorage.getItem(SCOPE_COLLAPSE_STORAGE_KEY);
    if (stored === "1") setIsCollapsed(true);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      SCOPE_COLLAPSE_STORAGE_KEY,
      isCollapsed ? "1" : "0"
    );
  }, [isCollapsed]);

  useEffect(() => {
    const serialized = formatViewElementScope(scope);
    if (
      prevScopeSerializedRef.current !== null &&
      prevScopeSerializedRef.current !== serialized
    ) {
      setScopeUpdated(true);
    }
    prevScopeSerializedRef.current = serialized;
  }, [scope]);

  return (
    <div className="mt-2 border-t border-border/50 pt-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <div className="text-[11px] font-medium text-foreground">Scope 数据</div>
          {scopeUpdated ? (
            <span className="shrink-0 rounded bg-sky-500/15 px-1.5 py-0.5 text-[10px] font-medium text-sky-700 dark:text-sky-300">
              已更新
            </span>
          ) : null}
        </div>
        <button
          type="button"
          className="rounded border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground hover:bg-accent"
          onClick={() => setIsCollapsed((prev) => !prev)}
        >
          {isCollapsed ? "展开 Scope" : "收起 Scope"}
        </button>
      </div>
      {!isCollapsed ? (
        <>
          <pre
            className={`mt-2 max-h-[200px] overflow-auto rounded-md border border-border/70 bg-muted/30 p-2 font-mono text-[10px] leading-relaxed text-foreground ${themedScrollbarClass}`}
          >
            {formatViewElementScope(scope)}
          </pre>
          <p className="mt-1.5 text-[10px] leading-relaxed text-muted-foreground">
            表单中可使用模版字符串引用 scope，例如{" "}
            <code className="rounded bg-muted px-1">{`{scope?.a||0}`}</code>
            、
            <code className="rounded bg-muted px-1">{`{scope?.name||''}`}</code>
            。支持 <code className="rounded bg-muted px-1">?.</code> 与{" "}
            <code className="rounded bg-muted px-1">||</code> 占位。
          </p>
        </>
      ) : null}
    </div>
  );
}
