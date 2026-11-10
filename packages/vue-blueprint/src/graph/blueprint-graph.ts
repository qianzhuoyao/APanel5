import {
  createBlueprintDocument,
  createNodeId,
  defaultBlueprintNodeLabel,
  filterInvalidBlueprintEdges,
  isDefaultBlueprintNodeLabel,
  patchNodeConfigSource,
  resolveNodeClockConfig,
  resolveNodeEventConfig,
  resolveNodeFetchConfig,
  resolveNodeJsonConfig,
  resolveNodeStorageConfig,
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
import {
  defaultLifecycleEnabledForNewNode,
  reconcileLifecycleEnabled,
  resolveLifecyclePhase,
  type PageLifecyclePhase,
} from "@arronqzy/blueprint-dsl";

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

    const lifecycleEnabled = defaultLifecycleEnabledForNewNode(
      this.document.nodes,
      lifecyclePhase,
      LIFECYCLE_NODE_TYPE
    )
      ? true
      : false;

    const node: BlueprintGraphNode = {
      id: createNodeId("lifecycle"),
      role: "lifecycle",
      nodeType: LIFECYCLE_NODE_TYPE,
      label: label ?? defaultBlueprintNodeLabel("lifecycle"),
      position: { ...position },
      parentId: parentBlueprintId,
      lifecyclePhase,
      lifecycleEnabled,
      configSource: "lifecycle",
    };

    return this.withDocument({
      ...this.document,
      nodes: reconcileLifecycleEnabled(
        [...this.document.nodes, node],
        node.id,
        lifecycleEnabled,
        LIFECYCLE_NODE_TYPE
      ),
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
        | "lifecycleEnabled"
        | "fetchConfig"
        | "jsonConfig"
        | "storageConfig"
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

    const mapped = this.document.nodes.map((n) => {
      if (n.id !== nodeId) return n;
      const nextNode = { ...n, ...configPatch, ...patch };
      if (
        patch.configSource &&
        patch.configSource !== exists.configSource &&
        patch.label === undefined &&
        isDefaultBlueprintNodeLabel(exists.label)
      ) {
        nextNode.label = defaultBlueprintNodeLabel(patch.configSource);
      }
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
      if (patch.storageConfig) {
        nextNode.storageConfig = {
          ...resolveNodeStorageConfig(n),
          ...patch.storageConfig,
          read: {
            ...resolveNodeStorageConfig(n).read,
            ...patch.storageConfig.read,
          },
          set: {
            ...resolveNodeStorageConfig(n).set,
            ...patch.storageConfig.set,
          },
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
      if (
        patch.lifecycleEnabled === undefined &&
        (patch.configSource === "lifecycle" ||
          patch.lifecyclePhase !== undefined) &&
        (nextNode.role === "lifecycle" ||
          nextNode.nodeType === LIFECYCLE_NODE_TYPE)
      ) {
        const phase = resolveLifecyclePhase(nextNode);
        const peerCount = this.document.nodes.filter(
          (peer) =>
            peer.id !== nodeId &&
            (peer.role === "lifecycle" ||
              peer.nodeType === LIFECYCLE_NODE_TYPE) &&
            resolveLifecyclePhase(peer) === phase
        ).length;
        if (peerCount > 0) {
          nextNode.lifecycleEnabled = false;
        }
      }
      return {
        ...nextNode,
        nodeType: resolveRunnableNodeType(nextNode),
      };
    });

    const lifecycleTouched =
      patch.lifecycleEnabled !== undefined ||
      patch.lifecyclePhase !== undefined ||
      patch.configSource === "lifecycle" ||
      Boolean(
        (configPatch as Partial<BlueprintGraphNode>).lifecyclePhase !==
          undefined
      );

    const nodes = lifecycleTouched
      ? reconcileLifecycleEnabled(
          mapped,
          nodeId,
          patch.lifecycleEnabled,
          LIFECYCLE_NODE_TYPE
        )
      : mapped;

    return this.withDocument({
      ...this.document,
      nodes,
    });
  }

  withDocument(document: BlueprintDocument) {
    return new BlueprintGraph(document);
  }
}
