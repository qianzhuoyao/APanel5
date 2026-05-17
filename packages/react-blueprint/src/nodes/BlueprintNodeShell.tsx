import { Handle, Position } from "@xyflow/react";
import { cn } from "@arron/ui";

import { BlueprintNodeCard, type BlueprintNodeCardProps } from "./BlueprintNodeCard";

export type BlueprintNodeShellProps = BlueprintNodeCardProps & {
  selected?: boolean;
};

/** 左进右出的标准节点连线布局 */
export function BlueprintNodeShell({
  selected = false,
  ...cardProps
}: BlueprintNodeShellProps) {
  return (
    <div className={cn("bp-node", selected && "bp-node--selected")}>
      <Handle
        type="target"
        position={Position.Left}
        id="in"
        className="bp-flow-handle bp-flow-handle--target"
      />
      <BlueprintNodeCard {...cardProps} selected={selected} />
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        className="bp-flow-handle bp-flow-handle--source"
      />
    </div>
  );
}
