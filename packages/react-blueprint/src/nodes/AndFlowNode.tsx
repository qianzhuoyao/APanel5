import { useI18n } from "@arronqzy/i18n/react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { cn } from "@arronqzy/ui";

import { resolveBlueprintNodeTypeLabel } from "../graph/document";
import { resolveBlueprintNodeSummary } from "../graph/node-summary";
import { useBlueprintNodeSelect } from "../BlueprintCanvasContext";
import { resolveBlueprintNodeExecutionTone } from "../runtime/execution-overlay";
import type { BlueprintFlowNodeData } from "../types";
import { BlueprintNodeCard } from "./BlueprintNodeCard";

/** 并运算节点：两路输入均为真时输出真信号；单端口多连线按「或」合并 */
export function AndFlowNode({ id, data }: NodeProps) {
  const { t } = useI18n();
  const nodeData = data as BlueprintFlowNodeData;
  const onSelect = useBlueprintNodeSelect();
  const executionTone = resolveBlueprintNodeExecutionTone(nodeData);

  return (
    <div
      className={cn(
        "bp-node bp-node--and",
        executionTone === "success" && "bp-node--execution-true",
        executionTone === "error" && "bp-node--execution-false"
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="inA"
        className="bp-flow-handle bp-flow-handle--target"
        style={{ top: "35%" }}
        title={t("blueprint.node.andInA")}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="inB"
        className="bp-flow-handle bp-flow-handle--target"
        style={{ top: "65%" }}
        title={t("blueprint.node.andInB")}
      />
      <BlueprintNodeCard
        nodeId={id}
        label={nodeData.label}
        meta={resolveBlueprintNodeTypeLabel(nodeData, t)}
        subtitle={resolveBlueprintNodeSummary(nodeData, t)}
        variant="and"
        selected={Boolean(nodeData.isSelected)}
        onSelect={onSelect}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        className="bp-flow-handle bp-flow-handle--source"
        title={t("blueprint.node.andOut")}
      />
    </div>
  );
}
