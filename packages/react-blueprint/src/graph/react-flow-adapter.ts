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

export type ReactFlowNodeView = {
  id: string;
  type: string;
  position: { x: number; y: number };
  dragHandle?: string;
  data: BlueprintFlowNodeData;
};

export type ReactFlowEdgeView = {
  id: string;
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
    source: e.source,
    target: e.target,
    sourceHandle: e.sourceHandle,
    targetHandle: e.targetHandle,
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
