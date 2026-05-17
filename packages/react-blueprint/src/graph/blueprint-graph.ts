import {
  createBlueprintDocument,
  createNodeId,
  type BlueprintDocument,
  type BlueprintGraphEdge,
  type BlueprintGraphNode,
} from "./document";
import { BLUEPRINT_NODE_TYPE, DEFAULT_LOGIC_NODE_TYPE } from "./node-types";

export class BlueprintGraph {
  readonly document: BlueprintDocument;

  constructor(document: BlueprintDocument = createBlueprintDocument()) {
    this.document = document;
  }

  static empty(id?: string) {
    return new BlueprintGraph(createBlueprintDocument(id));
  }

  getNode(nodeId: string): BlueprintGraphNode | undefined {
    return this.document.nodes.find((n) => n.id === nodeId);
  }

  addBlueprintNode(position: { x: number; y: number }, label = "蓝图") {
    const node: BlueprintGraphNode = {
      id: createNodeId("bp"),
      role: "blueprint",
      nodeType: BLUEPRINT_NODE_TYPE,
      label,
      position: { ...position },
      nestedBlueprintId: createNodeId("nested_bp"),
    };
    return this.withDocument({
      ...this.document,
      nodes: [...this.document.nodes, node],
    });
  }

  addLogicNode(
    parentBlueprintId: string,
    position: { x: number; y: number },
    label = "逻辑"
  ) {
    const parent = this.getNode(parentBlueprintId);
    if (!parent || parent.role !== "blueprint") {
      throw new Error(`Parent blueprint node not found: ${parentBlueprintId}`);
    }

    const node: BlueprintGraphNode = {
      id: createNodeId("logic"),
      role: "logic",
      nodeType: DEFAULT_LOGIC_NODE_TYPE,
      label,
      position: { ...position },
      parentId: parentBlueprintId,
    };

    return this.withDocument({
      ...this.document,
      nodes: [...this.document.nodes, node],
    });
  }

  removeNode(nodeId: string) {
    const target = this.getNode(nodeId);
    if (!target) return this;

    const removeIds = new Set<string>([nodeId]);
    if (target.role === "blueprint") {
      for (const n of this.document.nodes) {
        if (n.parentId === nodeId) removeIds.add(n.id);
      }
    }

    return this.withDocument({
      ...this.document,
      nodes: this.document.nodes.filter((n) => !removeIds.has(n.id)),
      edges: this.document.edges.filter(
        (e) => !removeIds.has(e.source) && !removeIds.has(e.target)
      ),
    });
  }

  updateNodePosition(nodeId: string, position: { x: number; y: number }) {
    return this.withDocument({
      ...this.document,
      nodes: this.document.nodes.map((n) =>
        n.id === nodeId ? { ...n, position: { ...position } } : n
      ),
    });
  }

  applyNodePositions(
    updates: Array<{ id: string; position: { x: number; y: number } }>
  ) {
    if (updates.length === 0) return this;
    const positionById = new Map(updates.map((u) => [u.id, u.position]));
    return this.withDocument({
      ...this.document,
      nodes: this.document.nodes.map((n) => {
        const position = positionById.get(n.id);
        return position ? { ...n, position: { ...position } } : n;
      }),
    });
  }

  addEdge(edge: Omit<BlueprintGraphEdge, "id"> & { id?: string }) {
    const nextEdge: BlueprintGraphEdge = {
      id: edge.id ?? createNodeId("edge"),
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
    };
    return this.withDocument({
      ...this.document,
      edges: [...this.document.edges, nextEdge],
    });
  }

  removeEdge(edgeId: string) {
    return this.withDocument({
      ...this.document,
      edges: this.document.edges.filter((e) => e.id !== edgeId),
    });
  }

  replaceEdges(edges: BlueprintGraphEdge[]) {
    return this.withDocument({ ...this.document, edges });
  }

  updateNode(
    nodeId: string,
    patch: Partial<
      Pick<
        BlueprintGraphNode,
        "label" | "nodeType" | "configSource" | "viewElementId" | "nestedBlueprintId"
      >
    >
  ) {
    const exists = this.getNode(nodeId);
    if (!exists) return this;
    return this.withDocument({
      ...this.document,
      nodes: this.document.nodes.map((n) =>
        n.id === nodeId ? { ...n, ...patch } : n
      ),
    });
  }

  withDocument(document: BlueprintDocument) {
    return new BlueprintGraph(document);
  }
}
