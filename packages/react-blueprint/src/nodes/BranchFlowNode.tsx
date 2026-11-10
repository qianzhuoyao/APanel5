import { useI18nOptional as useI18n } from "@arronqzy/i18n/react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { cn } from "@arronqzy/ui";

import { resolveBlueprintNodeTypeLabel } from "../graph/document";
import { resolveBlueprintNodeSummary } from "../graph/node-summary";
import { useBlueprintNodeSelect } from "../BlueprintCanvasContext";
import { resolveBlueprintNodeExecutionTone } from "../runtime/execution-overlay";
import type { BlueprintFlowNodeData } from "../types";
import { BlueprintNodeCard } from "./BlueprintNodeCard";

/** 分支节点：单输入；条件满足走 outTrue，否则走 outFalse */
export function BranchFlowNode({ id, data }: NodeProps) {
  const { t } = useI18n();
  const nodeData = data as BlueprintFlowNodeData;
  const onSelect = useBlueprintNodeSelect();
  const executionTone = resolveBlueprintNodeExecutionTone(nodeData);

  return (
    <div
      className={cn(
        "bp-node bp-node--branch",
        nodeData.isSelected && "bp-node--selected",
        executionTone === "success" && "bp-node--execution-true",
        executionTone === "error" && "bp-node--execution-false"
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="in"
        className="bp-flow-handle bp-flow-handle--target"
        title={t("blueprint.node.branchIn")}
      />
      <BlueprintNodeCard
        nodeId={id}
        label={nodeData.label}
        meta={resolveBlueprintNodeTypeLabel(nodeData, t)}
        subtitle={resolveBlueprintNodeSummary(nodeData, t)}
        variant="branch"
        selected={Boolean(nodeData.isSelected)}
        onSelect={onSelect}
      />
      <span
        className="bp-branch-port-label bp-branch-port-label--true"
        style={{ top: "32%" }}
        aria-hidden
      >
        {t("blueprint.node.branchOutTrueShort")}
      </span>
      <Handle
        type="source"
        position={Position.Right}
        id="outTrue"
        className="bp-flow-handle bp-flow-handle--source bp-flow-handle--branch-true"
        style={{ top: "32%" }}
        title={t("blueprint.node.branchOutTrue")}
      />
      <span
        className="bp-branch-port-label bp-branch-port-label--false"
        style={{ top: "68%" }}
        aria-hidden
      >
        {t("blueprint.node.branchOutFalseShort")}
      </span>
      <Handle
        type="source"
        position={Position.Right}
        id="outFalse"
        className="bp-flow-handle bp-flow-handle--source bp-flow-handle--branch-false"
        style={{ top: "68%" }}
        title={t("blueprint.node.branchOutFalse")}
      />
    </div>
  );
}
