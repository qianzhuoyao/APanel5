import type {
  BlueprintDocument,
  BlueprintGraphEdge,
  BlueprintGraphNode,
} from "./document";
import { createNodeId } from "./document";

export type BlueprintFlowNodeData = {
  label: string;
  role: BlueprintGraphNode["role"];
  nodeType: string;
  configSource?: BlueprintGraphNode["configSource"];
  viewElementId?: string;
  parentId?: string;
  nestedBlueprintId?: string;
  /** 由画布注入，勿写入图数据 */
  isSelected?: boolean;
};

/** 与 BlueprintNodeCard 固定宽度一致，供 RF 在 measured 前计算连线路径 */
export const BP_FLOW_NODE_WIDTH = 168;
export const BP_FLOW_NODE_HEIGHT = 72;

export type ReactFlowNodeView = {
  id: string;
  type: string;
  position: { x: number; y: number };
  width?: number;
  height?: number;
  dragHandle?: string;
  data: BlueprintFlowNodeData;
};

export type ReactFlowEdgeView = {
  id: string;
  type?: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
};

export function toReactFlowNodes(document: BlueprintDocument): ReactFlowNodeView[] {
  return document.nodes.map((n) => ({
    id: n.id,
    type: n.role === "blueprint" ? "blueprint" : "logic",
    position: { ...n.position },
    width: BP_FLOW_NODE_WIDTH,
    height: BP_FLOW_NODE_HEIGHT,
    zIndex: 0,
    connectable: true,
    dragHandle: ".bp-flow-drag-handle",
    data: {
      label: n.label,
      role: n.role,
      nodeType: n.nodeType,
      configSource: n.configSource,
      viewElementId: n.viewElementId,
      parentId: n.parentId,
      nestedBlueprintId: n.nestedBlueprintId,
    },
  }));
}

export function toReactFlowEdges(document: BlueprintDocument): ReactFlowEdgeView[] {
  return document.edges.map((e) => ({
    id: e.id,
    type: "smoothstep",
    source: e.source,
    target: e.target,
    sourceHandle: e.sourceHandle ?? "out",
    targetHandle: e.targetHandle ?? "in",
  }));
}

export function syncEdgesFromFlow(flowEdges: ReactFlowEdgeView[]): BlueprintGraphEdge[] {
  return flowEdges.map((e) => ({
    id: e.id || createNodeId("edge"),
    source: e.source,
    target: e.target,
    sourceHandle: e.sourceHandle ?? undefined,
    targetHandle: e.targetHandle ?? undefined,
  }));
}

export function collectPositionUpdates(
  nodes: Array<{ id: string; position: { x: number; y: number } }>
): Array<{ id: string; position: { x: number; y: number } }> {
  return nodes.map((n) => ({
    id: n.id,
    position: { x: n.position.x, y: n.position.y },
  }));
}
