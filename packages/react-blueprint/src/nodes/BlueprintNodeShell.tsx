import { Handle, Position } from "@xyflow/react";
import { cn } from "@arron/ui";

import type { BlueprintNodeExecutionTone } from "../runtime/execution-overlay";
import { BlueprintNodeCard, type BlueprintNodeCardProps } from "./BlueprintNodeCard";

export type BlueprintNodeShellProps = BlueprintNodeCardProps & {
  /** 用户在画布上点选的配置节点 */
  selected?: boolean;
  /** 调试执行中当前节点的信号高亮（与用户选中独立） */
  executionTone?: BlueprintNodeExecutionTone | null;
};

/** 左进右出的标准节点连线布局 */
export function BlueprintNodeShell({
  selected = false,
  executionTone = null,
  ...cardProps
}: BlueprintNodeShellProps) {
  return (
    <div
      className={cn(
        "bp-node",
        executionTone === "success" && "bp-node--execution-true",
        executionTone === "error" && "bp-node--execution-false"
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="in"
        className="bp-flow-handle bp-flow-handle--target"
        title="真/假信号输入"
      />
      <BlueprintNodeCard {...cardProps} selected={selected} />
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        className="bp-flow-handle bp-flow-handle--source"
        title="真/假信号输出"
      />
    </div>
  );
}
