import { useCallback, type ChangeEvent } from "react";
import { Input } from "@arronqzy/ui";
import type { ClockNodeConfig } from "@arronqzy/blueprint-dsl";
import { useI18n } from "@arronqzy/i18n/react";

import type { BlueprintGraphNode } from "../graph/document";
import { resolveNodeClockConfig } from "../graph/document";

export type ClockNodeConfigPanelProps = {
  node: BlueprintGraphNode;
  onUpdateNode: (
    nodeId: string,
    patch: Partial<Pick<BlueprintGraphNode, "clockConfig" | "configSource">>
  ) => void;
};

function patchClockConfig(
  node: BlueprintGraphNode,
  patch: Partial<ClockNodeConfig>
) {
  return {
    clockConfig: { ...resolveNodeClockConfig(node), ...patch },
    configSource: "clock" as const,
  };
}

export function ClockNodeConfigPanel({
  node,
  onUpdateNode,
}: ClockNodeConfigPanelProps) {
  const { t } = useI18n();
  const clockConfig = resolveNodeClockConfig(node);

  const handleIntervalChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const raw = Number(e.target.value);
      const intervalSeconds =
        Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 0;
      onUpdateNode(node.id, patchClockConfig(node, { intervalSeconds }));
    },
    [node, onUpdateNode]
  );

  const handleOutputCountChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const raw = Number(e.target.value);
      const outputCount =
        Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 1;
      onUpdateNode(node.id, patchClockConfig(node, { outputCount }));
    },
    [node, onUpdateNode]
  );

  const handleFormatChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onUpdateNode(
        node.id,
        patchClockConfig(node, { timeFormat: e.target.value })
      );
    },
    [node, onUpdateNode]
  );

  const handleEmitImmediatelyChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onUpdateNode(
        node.id,
        patchClockConfig(node, { emitImmediately: e.target.checked })
      );
    },
    [node, onUpdateNode]
  );

  return (
    <div className="space-y-2 rounded-md border border-border/70 bg-muted/20 p-2.5">
      <div className="font-medium text-foreground">
        {t("blueprint.config.clockTitle")}
      </div>
      <p className="text-[11px] text-muted-foreground">
        {t("blueprint.config.clockHint")}
      </p>

      <label className="block space-y-1">
        <span className="text-muted-foreground">
          {t("blueprint.config.clockIntervalSeconds")}
        </span>
        <Input
          type="number"
          min={0}
          step={1}
          value={clockConfig.intervalSeconds}
          onChange={handleIntervalChange}
          className="h-8"
        />
        <p className="text-[11px] text-muted-foreground">
          {t("blueprint.config.clockIntervalHint")}
        </p>
      </label>

      <label className="block space-y-1">
        <span className="text-muted-foreground">
          {t("blueprint.config.outputCount")}
        </span>
        <Input
          type="number"
          min={1}
          step={1}
          value={clockConfig.outputCount}
          onChange={handleOutputCountChange}
          className="h-8"
        />
        <p className="text-[11px] text-muted-foreground">
          {t("blueprint.config.outputCountHint")}
        </p>
      </label>

      <label className="flex items-start gap-2">
        <input
          type="checkbox"
          checked={clockConfig.emitImmediately}
          onChange={handleEmitImmediatelyChange}
          className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border border-input"
        />
        <span className="text-[11px] leading-relaxed text-muted-foreground">
          {t("blueprint.config.emitImmediately")}
        </span>
      </label>

      <label className="block space-y-1">
        <span className="text-muted-foreground">
          {t("blueprint.config.timeFormat")}
        </span>
        <Input
          value={clockConfig.timeFormat}
          onChange={handleFormatChange}
          spellCheck={false}
          className="h-8 font-mono text-[11px]"
          placeholder="YYYY-MM-DD HH:mm:ss"
        />
        <p className="text-[11px] text-muted-foreground">
          {t("blueprint.config.timeFormatHint")}
        </p>
      </label>
    </div>
  );
}
