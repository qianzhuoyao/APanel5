import { useI18n } from "@arronqzy/i18n/react";
import { Handle, Position } from "@xyflow/react";
import { cn } from "@arronqzy/ui";

import type { BlueprintNodeExecutionTone } from "../runtime/execution-overlay";
import { BlueprintNodeCard, type BlueprintNodeCardProps } from "./BlueprintNodeCard";

export type BlueprintNodeShellProps = BlueprintNodeCardProps & {
  /** 用户在画布上点选的配置节点 */
  selected?: boolean;
  /** 调试执行中当前节点的信号高亮（与用户选中独立） */
  executionTone?: BlueprintNodeExecutionTone | null;
  targetTitle?: string;
  sourceTitle?: string;
};

/** 左进右出的标准节点连线布局 */
export function BlueprintNodeShell({
  selected = false,
  executionTone = null,
  targetTitle,
  sourceTitle,
  ...cardProps
}: BlueprintNodeShellProps) {
  const { t } = useI18n();
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
        title={targetTitle ?? t("blueprint.node.signalIn")}
      />
      <BlueprintNodeCard {...cardProps} selected={selected} />
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        className="bp-flow-handle bp-flow-handle--source"
        title={sourceTitle ?? t("blueprint.node.signalOut")}
      />
    </div>
  );
}
