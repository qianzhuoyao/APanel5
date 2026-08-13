import { useI18n } from "@arronqzy/i18n/react";
import type { NodeProps } from "@xyflow/react";
import { cn } from "@arronqzy/ui";

import { resolveBlueprintNodeTypeLabel } from "../graph/document";
import { resolveBlueprintNodeSummary } from "../graph/node-summary";
import {
  useBlueprintClockAbort,
  useBlueprintNodeSelect,
  useClockNodeCanAbort,
} from "../BlueprintCanvasContext";
import { resolveBlueprintNodeExecutionTone } from "../runtime/execution-overlay";
import type { BlueprintFlowNodeData } from "../types";
import { BlueprintNodeShell } from "./BlueprintNodeShell";

function ClockAbortIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <rect x="6" y="6" width="12" height="12" rx="1.5" fill="currentColor" />
    </svg>
  );
}

/** 时钟节点：收到真信号后按配置间隔输出含当前时间的真信号 */
export function ClockFlowNode({ id, data }: NodeProps) {
  const { t } = useI18n();
  const nodeData = data as BlueprintFlowNodeData;
  const onSelect = useBlueprintNodeSelect();
  const onAbortClock = useBlueprintClockAbort();
  const canAbort = useClockNodeCanAbort(id);
  const progress = nodeData.clockEmitProgress;
  const progressLabel = progress
    ? `${progress.current}/${progress.total}`
    : undefined;

  return (
    <div className="relative">
      <BlueprintNodeShell
        nodeId={id}
        label={nodeData.label}
        meta={resolveBlueprintNodeTypeLabel(nodeData, t)}
        subtitle={resolveBlueprintNodeSummary(nodeData, t)}
        progressLabel={progressLabel}
        variant="clock"
        selected={Boolean(nodeData.isSelected)}
        executionTone={resolveBlueprintNodeExecutionTone(nodeData)}
        onSelect={onSelect}
      />
      {canAbort ? (
        <button
          type="button"
          className={cn(
            "nodrag nopan absolute right-1.5 top-1.5 z-10 flex h-5 w-5 items-center justify-center",
            "rounded border border-rose-500/50 bg-rose-500/15 text-rose-600 shadow-sm",
            "hover:bg-rose-500/25 dark:text-rose-300"
          )}
          title={t("blueprint.node.abortClock")}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onAbortClock(id);
          }}
        >
          <ClockAbortIcon className="h-3 w-3" />
        </button>
      ) : null}
    </div>
  );
}
