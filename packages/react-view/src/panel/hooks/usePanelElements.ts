import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";
import { store } from "../../../../rx-store/src/store";
import type { Node, State } from "../../../../rx-store/src/types";
import type { PanelChartConfig, PanelElement, ReferenceCopyMode } from "../types";

export type PanelLayer = {
  id: string;
  name: string;
  locked: boolean;
  editable: boolean;
  isMapping?: boolean;
  mappingBaseLayerId?: string;
  mergeSelected?: boolean;
};

export type PanelHistoryItem = {
  index: number;
  timestamp: number;
  label: string;
  active: boolean;
};
export type PanelActionResult = { ok: true } | { ok: false; reason: string };

const DEFAULT_LAYER_ID = "layer-1";

const DEFAULT_NODE_NAME_MAP: Record<string, string> = {
  bar: "柱状图",
  line: "折线图",
  pie: "饼图",
  area: "面积图",
  scatter: "散点图",
  radar: "雷达图",
  gauge: "仪表盘",
  funnel: "漏斗图",
  text: "文本",
  grid: "网格布局",
  image: "图片",
  video: "视频",
  audio: "音频",
  reference: "引用组件",
};

function getDefaultNodeName(materialType: string): string {
  return DEFAULT_NODE_NAME_MAP[materialType] ?? materialType;
}
const DEFAULT_LAYER: PanelLayer = {
  id: DEFAULT_LAYER_ID,
  name: "图层1",
  locked: false,
  editable: false,
  isMapping: false,
  mappingBaseLayerId: undefined,
};

function randomId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function getDefaultSizeByMaterial(materialType: string) {
  switch (materialType) {
    case "text":
      return { width: 180, height: 56 };
    case "rect":
      return { width: 180, height: 120 };
    case "grid":
      return { width: 320, height: 220 };
    case "image":
      return { width: 220, height: 140 };
    case "video":
      return { width: 260, height: 150 };
    case "audio":
      return { width: 260, height: 90 };
    case "gauge":
      return { width: 260, height: 180 };
    case "reference":
      return { width: 280, height: 180 };
    default:
      return { width: 220, height: 130 };
  }
}

function getDefaultTextContent(materialType: string) {
  if (materialType !== "text") return {};
  return {
    textHtml: "<p>双击输入文本</p>",
    textAllowInput: true,
    textFontSize: 14,
    textFontWeight: "400",
    textLineHeight: 1.6,
    textAlign: "left",
  } as const;
}

function getDefaultGridConfig(materialType: string) {
  if (materialType !== "grid") return {};
  return {
    gridRows: 2,
    gridCols: 3,
    gridGap: 8,
    gridPadding: 10,
    gridSnapThreshold: 36,
  } as const;
}

function getDefaultChartConfig(materialType: string): PanelChartConfig | undefined {
  if (!["bar", "line", "pie", "area", "scatter", "radar", "gauge", "funnel"].includes(materialType)) return undefined;
  const common = {
    color: "#3b82f6",
    renderMode: "canvas" as const,
    labels: ["A", "B", "C", "D"],
    values: [12, 18, 9, 24],
  };
  if (materialType === "bar") {
    return {
      title: "柱状图",
      ...common,
      barWidth: 24,
    };
  }
  if (materialType === "line") {
    return {
      title: "折线图",
      ...common,
      smooth: true,
    };
  }
  if (materialType === "area") {
    return {
      title: "面积图",
      ...common,
      smooth: true,
    };
  }
  if (materialType === "scatter") {
    return {
      title: "散点图",
      ...common,
    };
  }
  if (materialType === "radar") {
    return {
      title: "雷达图",
      ...common,
    };
  }
  if (materialType === "gauge") {
    return {
      title: "仪表盘",
      color: "#3b82f6",
      renderMode: "canvas",
      values: [68],
    };
  }
  if (materialType === "funnel") {
    return {
      title: "漏斗图",
      ...common,
    };
  }
  return {
    title: "饼图",
    ...common,
    pieInnerRadius: 30,
    pieOuterRadius: 65,
  };
}

function isPanelElementNode(node: Node): boolean {
  const props = node.props as Partial<PanelElement> | undefined;
  return (
    !!props &&
    typeof props.id === "string" &&
    typeof props.layerId === "string"
  );
}

function clonePanelElement(el: PanelElement): PanelElement {
  return {
    ...el,
    chart: el.chart ? { ...el.chart, option: el.chart.option ? { ...el.chart.option } : undefined } : undefined,
    style: el.style ? { ...el.style } : undefined,
    refSnapshot: el.refSnapshot ? el.refSnapshot.map(clonePanelElement) : undefined,
  };
}

function buildDeepReferenceSnapshot(
  allElements: PanelElement[],
  layerId: string,
  visitedLayers = new Set<string>()
): PanelElement[] {
  if (visitedLayers.has(layerId)) return [];
  const nextVisited = new Set(visitedLayers);
  nextVisited.add(layerId);
  const layerNodes = allElements.filter((el) => el.layerId === layerId);
  return layerNodes.map((el) => {
    const cloned = clonePanelElement(el);
    if (cloned.materialType === "reference" && cloned.refLayerId) {
      cloned.refCopyMode = "deep";
      cloned.refSnapshot = buildDeepReferenceSnapshot(allElements, cloned.refLayerId, nextVisited);
    }
    return cloned;
  });
}

function getGridSlotLayout(grid: PanelElement) {
  const rows = Math.max(1, Math.floor(grid.gridRows ?? 2));
  const cols = Math.max(1, Math.floor(grid.gridCols ?? 3));
  const gap = Math.max(0, grid.gridGap ?? 8);
  const padding = Math.max(0, grid.gridPadding ?? 10);
  const innerWidth = Math.max(1, grid.width - padding * 2);
  const innerHeight = Math.max(1, grid.height - padding * 2);
  const cellWidth = Math.max(1, (innerWidth - gap * (cols - 1)) / cols);
  const cellHeight = Math.max(1, (innerHeight - gap * (rows - 1)) / rows);
  const slots: Array<{ index: number; x: number; y: number; width: number; height: number }> = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = grid.x + padding + c * (cellWidth + gap);
      const y = grid.y + padding + r * (cellHeight + gap);
      slots.push({
        index: r * cols + c,
        x,
        y,
        width: cellWidth,
        height: cellHeight,
      });
    }
  }
  return { slots, rows, cols };
}

function removeMappingLayersBySourceIds(
  draft: State,
  sourceIds: Set<string>,
  fallbackActiveLayerId: string = DEFAULT_LAYER_ID
) {
  if (sourceIds.size === 0) return;
  const nodes = draft.root.children ?? [];
  const mappingLayerIds = new Set<string>();
  nodes.forEach((n) => {
    if (!isPanelElementNode(n) || !n.props) return;
    const props = n.props as PanelElement;
    if (!props.mappingSourceNodeId) return;
    if (!sourceIds.has(props.mappingSourceNodeId)) return;
    mappingLayerIds.add(props.layerId);
  });
  if (mappingLayerIds.size === 0) return;
  removeLayersByIds(draft, mappingLayerIds, fallbackActiveLayerId);
}

function removeLayersByIds(
  draft: State,
  layerIds: Set<string>,
  fallbackActiveLayerId: string = DEFAULT_LAYER_ID
) {
  if (layerIds.size === 0) return;
  const nodes = draft.root.children ?? [];

  draft.root.children = nodes.filter((n) => {
    if (!isPanelElementNode(n) || !n.props) return true;
    const props = n.props as PanelElement;
    return !layerIds.has(props.layerId);
  });

  draft.variables = draft.variables ?? {};
  const layers = (draft.variables.layers as PanelLayer[] | undefined) ?? [DEFAULT_LAYER];
  draft.variables.layers = layers.filter((layer) => !layerIds.has(layer.id));
  const activeLayerId = (draft.variables.activeLayerId as string | undefined) ?? fallbackActiveLayerId;
  if (layerIds.has(activeLayerId)) {
    draft.variables.activeLayerId =
      (draft.variables.layers[0] as PanelLayer | undefined)?.id ?? fallbackActiveLayerId;
  }
}

function getMaxZIndexByLayer(nodes: Node[], layerId: string): number {
  let maxZ = 0;
  nodes.forEach((n) => {
    if (!isPanelElementNode(n) || !n.props) return;
    const props = n.props as PanelElement;
    if (props.layerId !== layerId) return;
    const z = typeof props.zIndex === "number" ? props.zIndex : 1;
    if (z > maxZ) maxZ = z;
  });
  return maxZ;
}

export function usePanelElements() {
  const state = useSyncExternalStore(
    (cb) => {
      const sub = store.select().subscribe(cb);
      return () => sub.unsubscribe();
    },
    () => store.getState(),
    () => store.getState()
  ) as State;
  const layers = (state.variables?.layers as PanelLayer[] | undefined) ?? [DEFAULT_LAYER];
  const activeLayerId =
    (state.variables?.activeLayerId as string | undefined) ?? DEFAULT_LAYER_ID;
  const canUndo = store.getHistoryCursorIndex() > 0;
  const canRedo = store.getHistoryCursorIndex() < store.getHistoryEntries().length - 1;
  const historyCursor = store.getHistoryCursorIndex();

  useEffect(() => {
    const vars = store.getState().variables ?? {};
    const hasLayers = Array.isArray(vars.layers);
    const hasActive = typeof vars.activeLayerId === "string";
    const hasNodes = (store.getState().root.children?.length ?? 0) > 0;
    if (hasLayers && hasActive && hasNodes) return;

    store.update((draft) => {
      draft.variables = draft.variables ?? {};
      draft.variables.layers = hasLayers ? draft.variables.layers : [DEFAULT_LAYER];
      draft.variables.activeLayerId = hasActive
        ? draft.variables.activeLayerId
        : DEFAULT_LAYER_ID;

      if (!hasNodes) {
        const seed: PanelElement[] = [
          // {
          //   id: "el-1",
          //   layerId: DEFAULT_LAYER_ID,
          //   materialType: "bar",
          //   chart: getDefaultChartConfig("bar"),
          //   x: 80,
          //   y: 80,
          //   width: 160,
          //   height: 96,
          //   rotate: 0,
          // },
          // {
          //   id: "el-2",
          //   layerId: DEFAULT_LAYER_ID,
          //   materialType: "line",
          //   chart: getDefaultChartConfig("line"),
          //   x: 300,
          //   y: 140,
          //   width: 220,
          //   height: 120,
          //   rotate: 0,
          // },
          // {
          //   id: "el-3",
          //   layerId: DEFAULT_LAYER_ID,
          //   materialType: "rect",
          //   x: 180,
          //   y: 300,
          //   width: 140,
          //   height: 140,
          //   rotate: 0,
          // },
        ];
        draft.root.children = seed.map(
          (el): Node => ({
            id: el.id,
            type: el.materialType ?? "unknown",
            props: el,
            children: [],
          })
        );
      }
    });
  }, []);

  const allElements = useMemo(() => {
    const nodes = state.root.children ?? [];
    return nodes
      .filter((n) => isPanelElementNode(n) && n.props)
      .map((n) => {
        const props = n.props as PanelElement;
        return { ...props, zIndex: typeof props.zIndex === "number" ? props.zIndex : 1 };
      });
  }, [state.root.children]);

  const elements = useMemo(
    () => allElements.filter((el) => el.layerId === activeLayerId),
    [activeLayerId, allElements]
  );

  const byId = useMemo(() => {
    const map = new Map<string, PanelElement>();
    for (const el of allElements) map.set(el.id, el);
    return map;
  }, [allElements]);
  const layerById = useMemo(() => {
    const map = new Map<string, PanelLayer>();
    for (const layer of layers) map.set(layer.id, layer);
    return map;
  }, [layers]);

  const updateElement = useCallback(
    (
      id: string,
      patch: Partial<PanelElement>,
      options?: { batchId?: string; meta?: Record<string, unknown> }
    ) => {
      const current = store.getState();
      const list = (current.variables?.layers as PanelLayer[] | undefined) ?? [DEFAULT_LAYER];
      const target = current.root.children?.find((n) => n.id === id);
      const layerId = target?.props?.layerId as string | undefined;
      const layer = list.find((l) => l.id === layerId);
      if (layer?.locked) return;
      const currentElement = (target?.props ?? {}) as PanelElement;
      const hasTransformPatch =
        "x" in patch ||
        "y" in patch ||
        "width" in patch ||
        "height" in patch ||
        "rotate" in patch ||
        "layerId" in patch;
      if (currentElement.locked && hasTransformPatch) return;
      const isGridNode = currentElement.materialType === "grid";
      const hasGridLayoutPatch =
        "gridRows" in patch ||
        "gridCols" in patch ||
        "gridGap" in patch ||
        "gridPadding" in patch ||
        "width" in patch ||
        "height" in patch ||
        "x" in patch ||
        "y" in patch;
      if (isGridNode && hasGridLayoutPatch) {
        store.update(
          (draft) => {
            const nodes = draft.root.children ?? [];
            const targetNode = nodes.find((n) => isPanelElementNode(n) && n.id === id);
            if (!targetNode?.props) return;
            const byParent = new Map<string, PanelElement[]>();
            nodes.forEach((n) => {
              if (!isPanelElementNode(n) || !n.props) return;
              const p = n.props as PanelElement;
              if (!p.parentGridId) return;
              const list = byParent.get(p.parentGridId) ?? [];
              list.push(p);
              byParent.set(p.parentGridId, list);
            });
            const byIdNode = new Map<string, Node>();
            nodes.forEach((n) => {
              if (!isPanelElementNode(n) || !n.props) return;
              byIdNode.set((n.props as PanelElement).id, n);
            });
            const reflowGridDescendants = (grid: PanelElement) => {
              const { slots } = getGridSlotLayout(grid);
              if (slots.length === 0) return;
              const directChildren = byParent.get(grid.id) ?? [];
              directChildren.forEach((child) => {
                const slotIndex =
                  child.gridSlotIndex !== undefined
                    ? Math.max(0, Math.floor(child.gridSlotIndex))
                    : 0;
                const slot = slots[slotIndex % slots.length];
                if (!slot) return;
                child.gridSlotIndex = slot.index;
                child.x = slot.x;
                child.y = slot.y;
                child.width = slot.width;
                child.height = slot.height;
                const childNode = byIdNode.get(child.id);
                if (childNode) childNode.props = child;
                if (child.materialType === "grid") {
                  reflowGridDescendants(child);
                }
              });
            };
            const nextGrid = { ...(targetNode.props as PanelElement), ...patch } as PanelElement;
            targetNode.props = nextGrid;
            reflowGridDescendants(nextGrid);
          },
          {
            batchId: options?.batchId,
            meta: { type: "node.update", id, ...(options?.meta ?? {}) },
          }
        );
        return;
      }

      const syncSourceId = currentElement.mappingSourceNodeId ?? currentElement.id;
      const syncPatch = { ...patch } as Partial<PanelElement>;
      delete (syncPatch as any).id;
      delete (syncPatch as any).layerId;
      delete (syncPatch as any).mappingSourceNodeId;
      delete (syncPatch as any).mappingSourceLayerId;
      if (Object.keys(syncPatch).length > 0) {
        store.update(
          (draft) => {
            const nodes = draft.root.children ?? [];
            nodes.forEach((n) => {
              if (!isPanelElementNode(n) || !n.props) return;
              const props = n.props as PanelElement;
              const sameFamily =
                props.id === syncSourceId || props.mappingSourceNodeId === syncSourceId;
              if (!sameFamily) return;
              n.props = { ...props, ...syncPatch };
            });
          },
          {
            batchId: options?.batchId,
            meta: { type: "node.update", id, ...(options?.meta ?? {}) },
          }
        );
        return;
      }

      store.updateById(
        id,
        (node) => {
          node.props = { ...(node.props ?? {}), ...patch };
        },
        {
          batchId: options?.batchId,
          meta: { type: "node.update", id, ...(options?.meta ?? {}) },
        }
      );
    },
    []
  );

  const deleteElement = useCallback((id: string) => {
    const current = store.getState();
    const target = current.root.children?.find((n) => isPanelElementNode(n) && n.id === id);
    if (!target?.props) return;
    const currentLayers =
      (current.variables?.layers as PanelLayer[] | undefined) ?? [DEFAULT_LAYER];
    const targetLayer = currentLayers.find((l) => l.id === target.props?.layerId);
    if ((target.props as PanelElement).locked) return;
    if (targetLayer?.locked) return;
    store.update(
      (draft) => {
        const deletedSourceIds = new Set<string>();
        const impactedMappingLayerIds = new Set<string>();
        const deleting = (draft.root.children ?? []).find(
          (n) => isPanelElementNode(n) && n.id === id
        );
        if (deleting && isPanelElementNode(deleting) && deleting.props?.id) {
          const props = deleting.props as PanelElement;
          deletedSourceIds.add(props.mappingSourceNodeId ?? props.id);
        }
        (draft.root.children ?? []).forEach((n) => {
          if (!isPanelElementNode(n) || !n.props) return;
          const props = n.props as PanelElement;
          if (!props.mappingSourceNodeId) return;
          if (!deletedSourceIds.has(props.mappingSourceNodeId)) return;
          impactedMappingLayerIds.add(props.layerId);
        });
        const familyIds = new Set<string>();
        (draft.root.children ?? []).forEach((n) => {
          if (!isPanelElementNode(n) || !n.props) return;
          const props = n.props as PanelElement;
          const sourceId = props.mappingSourceNodeId ?? props.id;
          if (deletedSourceIds.has(sourceId)) familyIds.add(props.id);
        });
        draft.root.children = (draft.root.children ?? []).filter(
          (n) => !(isPanelElementNode(n) && familyIds.has(n.id))
        );
        removeLayersByIds(draft, impactedMappingLayerIds);
      },
      { meta: { type: "node.delete", id } }
    );
  }, []);

  const deleteElements = useCallback((ids: string[]) => {
    const unlockedIds = ids.filter((id) => {
      const el = byId.get(id);
      if (!id || !el) return false;
      if (el.locked) return false;
      const layer = layerById.get(el.layerId);
      return !layer?.locked;
    });
    const idSet = new Set(unlockedIds);
    if (idSet.size === 0) return;
    store.update(
      (draft) => {
        const deletedSourceIds = new Set<string>();
        const impactedMappingLayerIds = new Set<string>();
        (draft.root.children ?? []).forEach((n) => {
          if (!isPanelElementNode(n) || !n.props) return;
          if (!idSet.has(n.id)) return;
          const props = n.props as PanelElement;
          deletedSourceIds.add(props.mappingSourceNodeId ?? props.id);
        });
        (draft.root.children ?? []).forEach((n) => {
          if (!isPanelElementNode(n) || !n.props) return;
          const props = n.props as PanelElement;
          if (!props.mappingSourceNodeId) return;
          if (!deletedSourceIds.has(props.mappingSourceNodeId)) return;
          impactedMappingLayerIds.add(props.layerId);
        });
        const familyIds = new Set<string>();
        (draft.root.children ?? []).forEach((n) => {
          if (!isPanelElementNode(n) || !n.props) return;
          const props = n.props as PanelElement;
          const sourceId = props.mappingSourceNodeId ?? props.id;
          if (deletedSourceIds.has(sourceId)) familyIds.add(props.id);
        });
        draft.root.children = (draft.root.children ?? []).filter(
          (n) => !(isPanelElementNode(n) && familyIds.has(n.id))
        );
        removeLayersByIds(draft, impactedMappingLayerIds);
      },
      { meta: { type: "node.batch-delete", ids: Array.from(idSet) } }
    );
  }, [byId, layerById]);

  const bringElementsToFront = useCallback((ids: string[]) => {
    const unlocked = ids.filter((id) => {
      const el = byId.get(id);
      if (!id || !el || el.locked) return false;
      const layer = layerById.get(el.layerId);
      return !layer?.locked;
    });
    const idSet = new Set(unlocked);
    if (idSet.size === 0) return;
    store.update(
      (draft) => {
        const list = draft.root.children ?? [];
        const selectedByLayer = new Map<string, PanelElement[]>();
        list.forEach((n) => {
          if (!isPanelElementNode(n) || !n.props || !idSet.has(n.id)) return;
          const props = n.props as PanelElement;
          const group = selectedByLayer.get(props.layerId) ?? [];
          group.push({
            ...props,
            zIndex: typeof props.zIndex === "number" ? props.zIndex : 1,
          });
          selectedByLayer.set(props.layerId, group);
        });
        selectedByLayer.forEach((selected, layerId) => {
          const maxZ = getMaxZIndexByLayer(list, layerId);
          selected
            .sort((a, b) => (a.zIndex ?? 1) - (b.zIndex ?? 1))
            .forEach((node, offset) => {
              const target = list.find((n) => n.id === node.id);
              if (!target?.props) return;
              target.props = { ...(target.props as PanelElement), zIndex: maxZ + offset + 1 };
            });
        });
      },
      { meta: { type: "node.z.front", ids: Array.from(idSet) } }
    );
  }, [byId, layerById]);

  const sendElementsToBack = useCallback((ids: string[]) => {
    const unlocked = ids.filter((id) => {
      const el = byId.get(id);
      if (!id || !el || el.locked) return false;
      const layer = layerById.get(el.layerId);
      return !layer?.locked;
    });
    const idSet = new Set(unlocked);
    if (idSet.size === 0) return;
    store.update(
      (draft) => {
        const list = draft.root.children ?? [];
        const selectedByLayer = new Map<string, PanelElement[]>();
        list.forEach((n) => {
          if (!isPanelElementNode(n) || !n.props || !idSet.has(n.id)) return;
          const props = n.props as PanelElement;
          const group = selectedByLayer.get(props.layerId) ?? [];
          group.push({
            ...props,
            zIndex: typeof props.zIndex === "number" ? props.zIndex : 1,
          });
          selectedByLayer.set(props.layerId, group);
        });
        selectedByLayer.forEach((selected, layerId) => {
          let minZ = Number.POSITIVE_INFINITY;
          list.forEach((n) => {
            if (!isPanelElementNode(n) || !n.props) return;
            const props = n.props as PanelElement;
            if (props.layerId !== layerId) return;
            const z = typeof props.zIndex === "number" ? props.zIndex : 1;
            if (z < minZ) minZ = z;
          });
          if (!Number.isFinite(minZ)) minZ = 1;
          const start = minZ - selected.length;
          selected
            .sort((a, b) => (a.zIndex ?? 1) - (b.zIndex ?? 1))
            .forEach((node, offset) => {
              const target = list.find((n) => n.id === node.id);
              if (!target?.props) return;
              target.props = { ...(target.props as PanelElement), zIndex: start + offset };
            });
        });
      },
      { meta: { type: "node.z.back", ids: Array.from(idSet) } }
    );
  }, [byId, layerById]);

  const bringElementsForward = useCallback((ids: string[]) => {
    const unlocked = ids.filter((id) => {
      const el = byId.get(id);
      if (!id || !el || el.locked) return false;
      const layer = layerById.get(el.layerId);
      return !layer?.locked;
    });
    const idSet = new Set(unlocked);
    if (idSet.size === 0) return;
    store.update(
      (draft) => {
        const list = draft.root.children ?? [];
        list.forEach((n) => {
          if (!isPanelElementNode(n) || !n.props || !idSet.has(n.id)) return;
          const props = n.props as PanelElement;
          const z = typeof props.zIndex === "number" ? props.zIndex : 1;
          n.props = { ...props, zIndex: z + 1 };
        });
      },
      { meta: { type: "node.z.up", ids: Array.from(idSet) } }
    );
  }, [byId, layerById]);

  const sendElementsBackward = useCallback((ids: string[]) => {
    const unlocked = ids.filter((id) => {
      const el = byId.get(id);
      if (!id || !el || el.locked) return false;
      const layer = layerById.get(el.layerId);
      return !layer?.locked;
    });
    const idSet = new Set(unlocked);
    if (idSet.size === 0) return;
    store.update(
      (draft) => {
        const list = draft.root.children ?? [];
        list.forEach((n) => {
          if (!isPanelElementNode(n) || !n.props || !idSet.has(n.id)) return;
          const props = n.props as PanelElement;
          const z = typeof props.zIndex === "number" ? props.zIndex : 1;
          n.props = { ...props, zIndex: z - 1 };
        });
      },
      { meta: { type: "node.z.down", ids: Array.from(idSet) } }
    );
  }, [byId, layerById]);

  const duplicateElement = useCallback(
    (
      id: string,
      options?: { referenceCopyMode?: ReferenceCopyMode; position?: { x: number; y: number } }
    ) => {
    const current = store.getState();
    const node = current.root.children?.find((n) => isPanelElementNode(n) && n.id === id);
    if (!node?.props) return;
    const layerId = node.props.layerId as string | undefined;
    const currentLayers =
      (current.variables?.layers as PanelLayer[] | undefined) ?? [DEFAULT_LAYER];
    const layer = currentLayers.find((l) => l.id === layerId);
    if (layer?.locked) return;

    const nextId = randomId("el");
    const nextProps: PanelElement = {
      ...(node.props as PanelElement),
      id: nextId,
      x: Math.round(options?.position?.x ?? ((node.props.x ?? 0) + 20)),
      y: Math.round(options?.position?.y ?? ((node.props.y ?? 0) + 20)),
      zIndex: 1,
    };
    const all = (current.root.children ?? [])
      .filter((n) => isPanelElementNode(n) && n.props)
      .map((n) => n.props as PanelElement);
    const desiredMode = options?.referenceCopyMode;
    if (nextProps.materialType === "reference" && desiredMode) {
      if (desiredMode === "deep" && nextProps.refLayerId) {
        nextProps.refCopyMode = "deep";
        nextProps.refSnapshot = buildDeepReferenceSnapshot(all, nextProps.refLayerId);
      } else {
        nextProps.refCopyMode = "shallow";
        nextProps.refSnapshot = undefined;
      }
    }
    store.update(
      (draft) => {
        draft.root.children = draft.root.children ?? [];
        draft.root.children.push({
          id: nextId,
          type: node.type,
          props: nextProps,
          children: [],
        });
      },
      { meta: { type: "node.duplicate", sourceId: id, id: nextId } }
    );
    },
    []
  );

  const addElementFromMaterial = useCallback((materialType: string, x: number, y: number) => {
    const current = store.getState();
    const currentLayers =
      (current.variables?.layers as PanelLayer[] | undefined) ?? [DEFAULT_LAYER];
    const currentLayerId =
      (current.variables?.activeLayerId as string | undefined) ?? DEFAULT_LAYER_ID;
    const layer = currentLayers.find((l) => l.id === currentLayerId);
    if (!layer || layer.locked) return;

    const size = getDefaultSizeByMaterial(materialType);
    const id = randomId("el");
    const next: PanelElement = {
      id,
      layerId: currentLayerId,
      zIndex: 1,
      materialType,
      name: getDefaultNodeName(materialType),
      ...getDefaultTextContent(materialType),
      ...getDefaultGridConfig(materialType),
      refCopyMode: materialType === "reference" ? "shallow" : undefined,
      chart: getDefaultChartConfig(materialType),
      x: Math.round(x - size.width / 2),
      y: Math.round(y - size.height / 2),
      width: size.width,
      height: size.height,
      rotate: 0,
    };
    if (layer.isMapping && layer.mappingBaseLayerId) {
      const sourceId = randomId("el");
      const sourceNode: PanelElement = {
        ...next,
        id: sourceId,
        layerId: layer.mappingBaseLayerId,
      };
      const siblingMappings = currentLayers.filter(
        (l) => l.isMapping && l.mappingBaseLayerId === layer.mappingBaseLayerId && !l.locked
      );
      const clones = siblingMappings.map((mappingLayer) => {
        const cloneId = randomId("el");
        return {
          id: cloneId,
          type: materialType,
          props: {
            ...clonePanelElement(sourceNode),
            id: cloneId,
            layerId: mappingLayer.id,
            mappingSourceNodeId: sourceId,
            mappingSourceLayerId: layer.mappingBaseLayerId,
          } as PanelElement,
          children: [] as Node[],
        };
      });
      store.update(
        (draft) => {
          draft.root.children = draft.root.children ?? [];
          draft.root.children.push({
            id: sourceId,
            type: materialType,
            props: sourceNode,
            children: [],
          });
          clones.forEach((clone) => draft.root.children!.push(clone as unknown as Node));
        },
        { meta: { type: "node.add", materialType, id: sourceId } }
      );
      return;
    }
    store.update(
      (draft) => {
        draft.root.children = draft.root.children ?? [];
        draft.root.children.push({
          id,
          type: materialType,
          props: next,
          children: [],
        });
      },
      { meta: { type: "node.add", materialType, id } }
    );
  }, []);

  const setReferenceCopyMode = useCallback(
    (id: string, mode: ReferenceCopyMode) => {
      const current = store.getState();
      const all = (current.root.children ?? [])
        .filter((n) => isPanelElementNode(n) && n.props)
        .map((n) => n.props as PanelElement);
      const target = all.find((el) => el.id === id);
      if (!target || target.materialType !== "reference") return;
      const currentLayers =
        (current.variables?.layers as PanelLayer[] | undefined) ?? [DEFAULT_LAYER];
      const layer = currentLayers.find((l) => l.id === target.layerId);
      if (layer?.locked) return;
      store.updateById(
        id,
        (node) => {
          const props = (node.props ?? {}) as PanelElement;
          if (mode === "deep" && props.refLayerId) {
            props.refCopyMode = "deep";
            props.refSnapshot = buildDeepReferenceSnapshot(all, props.refLayerId);
          } else {
            props.refCopyMode = "shallow";
            props.refSnapshot = undefined;
          }
          node.props = props;
        },
        { meta: { type: "node.ref-copy-mode", id, mode } }
      );
    },
    []
  );

  const setActiveLayer = useCallback((layerId: string) => {
    store.update(
      (draft) => {
        draft.variables = draft.variables ?? {};
        draft.variables.activeLayerId = layerId;
      },
      { meta: { type: "layer.activate", layerId } }
    );
  }, []);

  const addLayer = useCallback(() => {
    store.update(
      (draft) => {
        draft.variables = draft.variables ?? {};
        const list = (draft.variables.layers as PanelLayer[] | undefined) ?? [DEFAULT_LAYER];
        const nextId = randomId("layer");
        const next: PanelLayer = {
          id: nextId,
          name: `图层${list.length + 1}`,
          locked: false,
          editable: true,
          isMapping: false,
          mappingBaseLayerId: undefined,
          mergeSelected: false,
        };
        draft.variables.layers = [...list, next];
        draft.variables.activeLayerId = nextId;
      },
      { meta: { type: "layer.add" } }
    );
  }, []);

  const openElementsInNewLayer = useCallback((ids: string[]): PanelActionResult => {
    const filtered = ids.filter(Boolean);
    if (filtered.length === 0) return { ok: false, reason: "未选择节点" };
    const current = store.getState();
    const currentLayers =
      (current.variables?.layers as PanelLayer[] | undefined) ?? [DEFAULT_LAYER];
    const nodeById = new Map(
      (current.root.children ?? [])
        .filter((n) => isPanelElementNode(n) && n.props)
        .map((n) => [n.id, n.props as PanelElement])
    );
    const selected = filtered
      .map((id) => nodeById.get(id))
      .filter((el): el is PanelElement => !!el);
    if (selected.length === 0) return { ok: false, reason: "未找到可迁移节点" };
    const hasLocked = selected.some((el) => {
      if (el.locked) return true;
      const layer = currentLayers.find((l) => l.id === el.layerId);
      return !!layer?.locked;
    });
    if (hasLocked) return { ok: false, reason: "选中节点包含锁定内容，无法在新图层打开" };

    const selectedSet = new Set(selected.map((el) => el.id));
    const idMap = new Map<string, string>();
    selected.forEach((el) => idMap.set(el.id, randomId("el")));
    const nextLayerId = randomId("layer");
    const nextLayer: PanelLayer = {
      id: nextLayerId,
      name: `映射图层${currentLayers.length + 1}`,
      locked: false,
      editable: true,
      isMapping: true,
      mappingBaseLayerId:
        selected[0]?.mappingSourceLayerId ??
        selected[0]?.layerId ??
        (current.variables?.activeLayerId as string | undefined) ??
        DEFAULT_LAYER_ID,
      mergeSelected: false,
    };
    store.update(
      (draft) => {
        draft.variables = draft.variables ?? {};
        const layers = (draft.variables.layers as PanelLayer[] | undefined) ?? [DEFAULT_LAYER];
        draft.variables.layers = [...layers, nextLayer];
        draft.variables.activeLayerId = nextLayerId;
        const clones: Node[] = [];
        const all = draft.root.children ?? [];
        all.forEach((n) => {
          if (!isPanelElementNode(n) || !n.props || !selectedSet.has(n.id)) return;
          const props = n.props as PanelElement;
          const nextId = idMap.get(props.id);
          if (!nextId) return;
          const remappedParentGridId = props.parentGridId
            ? idMap.get(props.parentGridId) ?? props.parentGridId
            : undefined;
          const nextProps: PanelElement = {
            ...clonePanelElement(props),
            id: nextId,
            layerId: nextLayerId,
            parentGridId: remappedParentGridId,
            mappingSourceNodeId: props.mappingSourceNodeId ?? props.id,
            mappingSourceLayerId: props.mappingSourceLayerId ?? props.layerId,
          };
          clones.push({
            id: nextId,
            type: n.type,
            props: nextProps,
            children: [],
          });
        });
        draft.root.children = [...all, ...clones];
      },
      {
        meta: {
          type: "layer.open-selected-mapping",
          layerId: nextLayerId,
          nodeCount: selectedSet.size,
        },
      }
    );
    return { ok: true };
  }, []);

  const renameLayer = useCallback((layerId: string, name: string) => {
    store.update(
      (draft) => {
        const list = (draft.variables?.layers as PanelLayer[] | undefined) ?? [];
        const target = list.find((l) => l.id === layerId);
        if (!target || !target.editable) return;
        target.name = name.trim() || target.name;
      },
      { meta: { type: "layer.rename", layerId } }
    );
  }, []);

  const toggleLayerLock = useCallback((layerId: string) => {
    store.update(
      (draft) => {
        const list = (draft.variables?.layers as PanelLayer[] | undefined) ?? [];
        const target = list.find((l) => l.id === layerId);
        if (!target || !target.editable) return;
        target.locked = !target.locked;
      },
      { meta: { type: "layer.toggle-lock", layerId } }
    );
  }, []);

  const deleteLayer = useCallback(
    (
      layerId: string,
      options?: { mode?: "remove" | "move"; targetLayerId?: string }
    ): PanelActionResult => {
      const mode = options?.mode ?? "remove";
      const targetLayerId = options?.targetLayerId;
      const current = store.getState();
      const list = (current.variables?.layers as PanelLayer[] | undefined) ?? [];
      const target = list.find((l) => l.id === layerId);
      if (!target) return { ok: false, reason: "图层不存在" };
      if (!target.editable) return { ok: false, reason: "默认图层不可删除" };
      if (target.locked) return { ok: false, reason: "锁定图层不可删除" };
      if (mode === "move" && !targetLayerId) {
        return { ok: false, reason: "请选择目标图层" };
      }
      const remainingLayers = list.filter((l) => l.id !== layerId);
      const moveTarget = remainingLayers.find((l) => l.id === targetLayerId);
      if (mode === "move" && !moveTarget) {
        return { ok: false, reason: "目标图层不存在" };
      }
      const allElements = (current.root.children ?? [])
        .filter((n) => isPanelElementNode(n) && n.props)
        .map((n) => n.props as PanelElement);
      const hasBlockingRef = allElements.some((el) => {
        if (target.isMapping) return false;
        const willBeDeleted = mode === "remove" && el.layerId === layerId;
        if (willBeDeleted) return false;
        if (el.materialType !== "reference") return false;
        if (el.refLayerId !== layerId) return false;
        return (el.refCopyMode ?? "shallow") !== "deep";
      });
      if (hasBlockingRef) {
        return { ok: false, reason: "该图层仍被浅拷贝引用，请先删除引用节点或改为深拷贝" };
      }

      store.update(
        (draft) => {
          draft.variables!.layers = remainingLayers.map((l) => ({
            ...l,
            mergeSelected: false,
          }));

          if (mode === "move" && moveTarget) {
            draft.root.children = (draft.root.children ?? []).map((n) => {
              if (isPanelElementNode(n) && n.props?.layerId === layerId) {
                n.props = { ...(n.props ?? {}), layerId: moveTarget.id };
              }
              return n;
            });
          } else {
            const deletedSourceIds = new Set<string>();
            (draft.root.children ?? []).forEach((n) => {
              if (!isPanelElementNode(n) || !n.props) return;
              if (n.props?.layerId !== layerId) return;
              deletedSourceIds.add((n.props as PanelElement).id);
            });
            draft.root.children = (draft.root.children ?? []).filter(
              (n) => !isPanelElementNode(n) || n.props?.layerId !== layerId
            );
            removeMappingLayersBySourceIds(draft, deletedSourceIds);
          }

          if (draft.variables!.activeLayerId === layerId) {
            draft.variables!.activeLayerId =
              moveTarget?.id ?? remainingLayers[0]?.id ?? DEFAULT_LAYER_ID;
          }
        },
        { meta: { type: "layer.delete", layerId, mode } }
      );
      return { ok: true };
    },
    []
  );

  const toggleLayerMergeSelected = useCallback((layerId: string) => {
    store.update(
      (draft) => {
        const list = (draft.variables?.layers as PanelLayer[] | undefined) ?? [];
        const target = list.find((l) => l.id === layerId);
        if (!target) return;
        if (target.isMapping) return;
        target.mergeSelected = !target.mergeSelected;
      },
      { meta: { type: "layer.toggle-merge", layerId } }
    );
  }, []);

  const mergeSelectedLayers = useCallback((name?: string) => {
    store.update(
      (draft) => {
        draft.variables = draft.variables ?? {};
        const list = ((draft.variables.layers as PanelLayer[] | undefined) ?? []).slice();
        const selected = list.filter((l) => l.mergeSelected && !l.isMapping);
        if (selected.length < 2) return;

        const nextId = randomId("layer");
        const nextLayer: PanelLayer = {
          id: nextId,
          name: name?.trim() || `图层-${Math.random().toString(36).slice(2, 6)}`,
          locked: false,
          editable: true,
          isMapping: false,
          mappingBaseLayerId: undefined,
          mergeSelected: false,
        };
        const selectedSet = new Set(selected.map((l) => l.id));

        draft.root.children = (draft.root.children ?? []).map((n) => {
          if (isPanelElementNode(n) && selectedSet.has(n.props?.layerId)) {
            n.props = { ...(n.props ?? {}), layerId: nextId };
          }
          return n;
        });

        draft.variables.layers = [
          ...list
            .filter((l) => !selectedSet.has(l.id))
            .map((l) => ({ ...l, mergeSelected: false })),
          nextLayer,
        ];
        draft.variables.activeLayerId = nextId;
      },
      { meta: { type: "layer.merge", name } }
    );
  }, []);

  const undo = useCallback(() => {
    store.undo();
  }, []);

  const redo = useCallback(() => {
    store.redo();
  }, []);
  const goToHistory = useCallback((index: number) => {
    store.goToHistory(index);
  }, []);

  const history = useMemo<PanelHistoryItem[]>(() => {
    const entries = store.getHistoryEntries();
    const cursor = store.getHistoryCursorIndex();
    const labelByType: Record<string, string> = {
      initial: "初始化",
      "node.update": "更新节点",
      "node.group-drag": "批量移动节点",
      "node.group-resize": "批量缩放节点",
      "node.group-rotate": "批量旋转节点",
      "node.delete": "删除节点",
      "node.batch-delete": "批量删除节点",
      "node.z.front": "节点置顶",
      "node.z.back": "节点置底",
      "node.z.up": "节点上移一层",
      "node.z.down": "节点下移一层",
      "node.duplicate": "复制节点",
      "node.ref-copy-mode": "设置引用拷贝模式",
      "node.add": "添加节点",
      "layer.activate": "切换图层",
      "layer.add": "新增图层",
      "layer.rename": "重命名图层",
      "layer.toggle-lock": "切换图层锁定",
      "layer.open-selected-mapping": "映射图层打开选中节点",
      "layer.delete": "删除图层",
      "layer.toggle-merge": "勾选合并图层",
      "layer.merge": "合并图层",
      "panel.import": "导入面板",
    };
    return entries.map((entry, index) => {
      const type = entry.meta?.type as string | undefined;
      return {
        index,
        timestamp: entry.timestamp,
        label: (type && labelByType[type]) || "编辑",
        active: index === cursor,
      };
    });
  }, [state]);

  const exportPanelData = useCallback(() => {
    const current = store.getState();
    return JSON.parse(JSON.stringify(current)) as State;
  }, []);

  const importPanelData = useCallback((nextState: State) => {
    if (!nextState || typeof nextState !== "object") return false;
    if (!nextState.root || typeof nextState.root !== "object") return false;
    if (!nextState.root.id || !nextState.root.type) return false;
    if (!Array.isArray(nextState.root.children)) nextState.root.children = [];
    nextState.variables = nextState.variables ?? {};
    if (!Array.isArray(nextState.variables.layers)) {
      nextState.variables.layers = [DEFAULT_LAYER];
    }
    if (typeof nextState.variables.activeLayerId !== "string") {
      nextState.variables.activeLayerId =
        (nextState.variables.layers[0] as PanelLayer | undefined)?.id ?? DEFAULT_LAYER_ID;
    }
    store.replaceState(nextState, { type: "panel.import" });
    return true;
  }, []);

  return {
    allElements,
    elements,
    byId,
    layers,
    activeLayerId,
    updateElement,
    deleteElement,
    deleteElements,
    bringElementsToFront,
    sendElementsToBack,
    bringElementsForward,
    sendElementsBackward,
    duplicateElement,
    setReferenceCopyMode,
    addElementFromMaterial,
    setActiveLayer,
    addLayer,
    openElementsInNewLayer,
    renameLayer,
    toggleLayerLock,
    deleteLayer,
    toggleLayerMergeSelected,
    mergeSelectedLayers,
    undo,
    redo,
    goToHistory,
    canUndo,
    canRedo,
    historyCursor,
    history,
    exportPanelData,
    importPanelData,
  };
}

