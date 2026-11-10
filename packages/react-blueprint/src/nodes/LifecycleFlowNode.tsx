import { useI18nOptional as useI18n } from "@arronqzy/i18n/react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { cn } from "@arronqzy/ui";

import { resolveBlueprintNodeTypeLabel } from "../graph/document";
import { resolveBlueprintNodeSummary } from "../graph/node-summary";
import { useBlueprintNodeSelect } from "../BlueprintCanvasContext";
import { resolveBlueprintNodeExecutionTone } from "../runtime/execution-overlay";
import type { BlueprintFlowNodeData } from "../types";
import { BlueprintNodeCard } from "./BlueprintNodeCard";

/** 生命周期节点：无输入口，仅在对应生命周期触发时从右侧输出口发出信号 */
export function LifecycleFlowNode({ id, data }: NodeProps) {
  const { t } = useI18n();
  const nodeData = data as BlueprintFlowNodeData;
  const onSelect = useBlueprintNodeSelect();
  const executionTone = resolveBlueprintNodeExecutionTone(nodeData);
  const showExclusiveStatus = Boolean(nodeData.lifecycleExclusive);
  const isEnabled = nodeData.lifecycleEnabled !== false;

  return (
    <div
      className={cn(
        "bp-node bp-node--lifecycle relative",
        nodeData.isSelected && "bp-node--selected",
        executionTone === "success" && "bp-node--execution-true",
        executionTone === "error" && "bp-node--execution-false",
        showExclusiveStatus && !isEnabled && "opacity-70"
      )}
    >
      <BlueprintNodeCard
        nodeId={id}
        label={nodeData.label}
        meta={resolveBlueprintNodeTypeLabel(nodeData, t)}
        subtitle={resolveBlueprintNodeSummary(nodeData, t)}
        variant="lifecycle"
        selected={Boolean(nodeData.isSelected)}
        hideLeadingDot
        onSelect={onSelect}
      />
      {showExclusiveStatus ? (
        <span
          className={cn(
            "pointer-events-none absolute right-1.5 top-1.5 rounded px-1 py-0.5 text-[10px] font-medium leading-none",
            isEnabled
              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
              : "bg-muted text-muted-foreground"
          )}
        >
          {isEnabled
            ? t("blueprint.config.lifecycleStatusEnabled")
            : t("blueprint.config.lifecycleStatusDisabled")}
        </span>
      ) : null}
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        className="bp-flow-handle bp-flow-handle--source"
        title={t("blueprint.node.lifecycleOut")}
      />
    </div>
  );
}
