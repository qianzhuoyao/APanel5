import type { XYPosition } from "@xyflow/react";

import {
  BP_FLOW_NODE_HEIGHT,
  BP_FLOW_NODE_WIDTH,
} from "./graph/react-flow-adapter";

/** 屏幕坐标 → 流程坐标，落点以节点中心对齐光标 */
export function clientToFlowNodePosition(
  screenToFlowPosition: (position: XYPosition) => XYPosition,
  clientX: number,
  clientY: number
): XYPosition {
  const flow = screenToFlowPosition({ x: clientX, y: clientY });
  return {
    x: flow.x - BP_FLOW_NODE_WIDTH / 2,
    y: flow.y - BP_FLOW_NODE_HEIGHT / 2,
  };
}
