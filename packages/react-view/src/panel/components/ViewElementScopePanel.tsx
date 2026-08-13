import { useEffect, useRef, useState } from "react";
import { useI18n } from "@arronqzy/i18n/react";

import { formatViewElementScope } from "../utils/scope-template";
import { ConfigHintIcon } from "./ConfigHintIcon";
import { ScopeTemplateUsageHint } from "./scope-config/ScopeTemplateUsageHint";

const SCOPE_COLLAPSE_STORAGE_KEY = "panel:config-scope-collapsed";

export type ViewElementScopePanelProps = {
  scope: unknown;
};

export function ViewElementScopePanel({
  scope,
}: ViewElementScopePanelProps) {
  const { t } = useI18n();
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
          <div className="text-[11px] font-medium text-foreground">{t("panel.scope.dataTitle")}</div>
          <ConfigHintIcon label={t("panel.scope.templateHintLabel")} contentClassName="max-w-[380px]">
            <ScopeTemplateUsageHint />
          </ConfigHintIcon>
          {scopeUpdated ? (
            <span className="shrink-0 rounded bg-sky-500/15 px-1.5 py-0.5 text-[10px] font-medium text-sky-700 dark:text-sky-300">
              {t("panel.scope.updated")}
            </span>
          ) : null}
        </div>
        <button
          type="button"
          className="rounded border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground hover:bg-accent"
          onClick={() => setIsCollapsed((prev) => !prev)}
        >
          {isCollapsed ? t("panel.scope.expand") : t("panel.scope.collapse")}
        </button>
      </div>
      {!isCollapsed ? (
        <>
          <pre
            className={`mt-2 max-h-[200px] overflow-auto rounded-md border border-border/70 bg-muted/30 p-2 font-mono text-[10px] leading-relaxed text-foreground ${themedScrollbarClass}`}
          >
            {formatViewElementScope(scope)}
          </pre>
        </>
      ) : null}
    </div>
  );
}
