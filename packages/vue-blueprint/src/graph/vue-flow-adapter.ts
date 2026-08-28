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
  viewElementIds?: string[];
  parentId?: string;
  nestedBlueprintId?: string;
  libraryBlueprintId?: string;
  libraryBlueprintLabel?: string;
  lifecyclePhase?: BlueprintGraphNode["lifecyclePhase"];
  fetchConfig?: BlueprintGraphNode["fetchConfig"];
  jsonConfig?: BlueprintGraphNode["jsonConfig"];
  storageConfig?: BlueprintGraphNode["storageConfig"];
  clockConfig?: BlueprintGraphNode["clockConfig"];
  eventConfig?: BlueprintGraphNode["eventConfig"];
  logicConfig?: BlueprintGraphNode["logicConfig"];
  /** 调试执行时时钟节点已发送次数 */
  clockEmitProgress?: { current: number; total: number } | null;
  /** 由画布注入，勿写入图数据 */
  isSelected?: boolean;
  /** 调试执行时高亮当前执行到的节点 */
  isExecutionActive?: boolean;
  /** 调试执行时当前节点主输出信号类型 */
  executionSignalKind?: "true" | "false" | null;
};

/** 与 BlueprintNodeCard 固定宽度一致，供 RF 在 measured 前计算连线路径 */
export const BP_FLOW_NODE_WIDTH = 168;
export const BP_FLOW_NODE_HEIGHT = 92;

export type VueFlowNodeView = {
  id: string;
  type: string;
  position: { x: number; y: number };
  width?: number;
  height?: number;
  dragHandle?: string;
  data: BlueprintFlowNodeData;
};

export type VueFlowEdgeView = {
  id: string;
  type?: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
};

export function toVueFlowNodes(document: BlueprintDocument): VueFlowNodeView[] {
  return document.nodes.map((n) => ({
    id: n.id,
    type:
      n.role === "blueprint"
        ? "blueprint"
        : n.role === "lifecycle"
          ? "lifecycle"
          : n.role === "clock"
            ? "clock"
          : n.role === "and"
            ? "and"
        : n.role === "fetch"
          ? "fetch"
          : n.role === "json"
            ? "json"
            : n.role === "storage"
              ? "storage"
            : n.role === "event"
              ? "event"
            : "logic",
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
      viewElementIds: n.viewElementIds,
      parentId: n.parentId,
      nestedBlueprintId: n.nestedBlueprintId,
      libraryBlueprintId: n.libraryBlueprintId,
      lifecyclePhase: n.lifecyclePhase,
      fetchConfig: n.fetchConfig,
      jsonConfig: n.jsonConfig,
      storageConfig: n.storageConfig,
      clockConfig: n.clockConfig,
      eventConfig: n.eventConfig,
      logicConfig: n.logicConfig,
    },
  }));
}

export function toVueFlowEdges(document: BlueprintDocument): VueFlowEdgeView[] {
  return document.edges.map((e) => ({
    id: e.id,
    type: "smoothstep",
    source: e.source,
    target: e.target,
    sourceHandle: e.sourceHandle ?? "out",
    targetHandle: e.targetHandle ?? "in",
  }));
}

export function syncEdgesFromFlow(flowEdges: VueFlowEdgeView[]): BlueprintGraphEdge[] {
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
