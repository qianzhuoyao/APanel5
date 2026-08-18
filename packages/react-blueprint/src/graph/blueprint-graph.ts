import {
  createBlueprintDocument,
  createNodeId,
  defaultBlueprintNodeLabel,
  filterInvalidBlueprintEdges,
  patchNodeConfigSource,
  resolveNodeClockConfig,
  resolveNodeEventConfig,
  resolveNodeFetchConfig,
  resolveNodeJsonConfig,
  resolveNodeLogicConfig,
  resolveRunnableNodeType,
  sanitizeBlueprintDocument,
  type BlueprintDocument,
  type BlueprintGraphEdge,
  type BlueprintGraphNode,
} from "./document";
import {
  BLUEPRINT_NODE_TYPE,
  DEFAULT_LOGIC_NODE_TYPE,
  LIFECYCLE_NODE_TYPE,
} from "./node-types";
import type { PageLifecyclePhase } from "@arronqzy/blueprint-dsl";

export class BlueprintGraph {
  readonly document: BlueprintDocument;

  constructor(document: BlueprintDocument = createBlueprintDocument()) {
    this.document = sanitizeBlueprintDocument(document);
  }

  static empty(id?: string) {
    return new BlueprintGraph(sanitizeBlueprintDocument(createBlueprintDocument(id)));
  }

  static fromDocument(document: BlueprintDocument) {
    return new BlueprintGraph(document);
  }

  getNode(nodeId: string): BlueprintGraphNode | undefined {
    return this.document.nodes.find((n) => n.id === nodeId);
  }

  addBlueprintNode(position: { x: number; y: number }, label?: string) {
    const node: BlueprintGraphNode = {
      id: createNodeId("bp"),
      role: "blueprint",
      nodeType: BLUEPRINT_NODE_TYPE,
      label: label ?? defaultBlueprintNodeLabel("blueprint"),
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
    label?: string
  ) {
    const parent = this.getNode(parentBlueprintId);
    if (!parent || parent.role !== "blueprint") {
      throw new Error(`Parent blueprint node not found: ${parentBlueprintId}`);
    }

    const node: BlueprintGraphNode = {
      id: createNodeId("logic"),
      role: "logic",
      nodeType: DEFAULT_LOGIC_NODE_TYPE,
      label: label ?? defaultBlueprintNodeLabel("logic"),
      position: { ...position },
      parentId: parentBlueprintId,
    };

    return this.withDocument({
      ...this.document,
      nodes: [...this.document.nodes, node],
    });
  }

  addLifecycleNode(
    parentBlueprintId: string,
    position: { x: number; y: number },
    lifecyclePhase: PageLifecyclePhase = "mounted",
    label?: string
  ) {
    const parent = this.getNode(parentBlueprintId);
    if (!parent || parent.role !== "blueprint") {
      throw new Error(`Parent blueprint node not found: ${parentBlueprintId}`);
    }

    const node: BlueprintGraphNode = {
      id: createNodeId("lifecycle"),
      role: "lifecycle",
      nodeType: LIFECYCLE_NODE_TYPE,
      label: label ?? defaultBlueprintNodeLabel("lifecycle"),
      position: { ...position },
      parentId: parentBlueprintId,
      lifecyclePhase,
      configSource: "lifecycle",
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
    if (!this.document.edges.some((e) => e.id === edgeId)) return this;
    return this.withDocument({
      ...this.document,
      edges: this.document.edges.filter((e) => e.id !== edgeId),
    });
  }

  replaceEdges(edges: BlueprintGraphEdge[]) {
    return this.withDocument({
      ...this.document,
      edges: filterInvalidBlueprintEdges(this.document, edges),
    });
  }

  updateNode(
    nodeId: string,
    patch: Partial<
      Pick<
        BlueprintGraphNode,
        | "label"
        | "role"
        | "nodeType"
        | "configSource"
        | "viewElementId"
        | "viewElementIds"
        | "nestedBlueprintId"
        | "libraryBlueprintId"
        | "lifecyclePhase"
        | "fetchConfig"
        | "jsonConfig"
        | "logicConfig"
        | "clockConfig"
        | "eventConfig"
      >
    >
  ) {
    const exists = this.getNode(nodeId);
    if (!exists) return this;

    const configPatch =
      patch.configSource && patch.configSource !== exists.configSource
        ? patchNodeConfigSource(exists, patch.configSource)
        : {};

    return this.withDocument({
      ...this.document,
      nodes: this.document.nodes.map((n) => {
        if (n.id !== nodeId) return n;
        const nextNode = { ...n, ...configPatch, ...patch };
        if (
          patch.viewElementIds !== undefined ||
          patch.viewElementId !== undefined
        ) {
          const ids =
            patch.viewElementIds !== undefined
              ? [...new Set(patch.viewElementIds.filter(Boolean))]
              : patch.viewElementId
                ? [patch.viewElementId]
                : [];
          nextNode.viewElementIds = ids.length > 0 ? ids : undefined;
          nextNode.viewElementId = undefined;
        }
        if (patch.fetchConfig) {
          nextNode.fetchConfig = {
            ...resolveNodeFetchConfig(n),
            ...patch.fetchConfig,
          };
        }
        if (patch.jsonConfig) {
          nextNode.jsonConfig = {
            ...resolveNodeJsonConfig(n),
            ...patch.jsonConfig,
          };
        }
        if (patch.logicConfig) {
          nextNode.logicConfig = {
            ...resolveNodeLogicConfig(n),
            ...patch.logicConfig,
          };
        }
        if (patch.clockConfig) {
          nextNode.clockConfig = {
            ...resolveNodeClockConfig(n),
            ...patch.clockConfig,
          };
        }
        if (patch.eventConfig) {
          nextNode.eventConfig = {
            ...resolveNodeEventConfig(n),
            ...patch.eventConfig,
          };
        }
        return {
          ...nextNode,
          nodeType: resolveRunnableNodeType(nextNode),
        };
      }),
    });
  }

  withDocument(document: BlueprintDocument) {
    return new BlueprintGraph(document);
  }
}
