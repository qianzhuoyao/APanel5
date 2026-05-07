import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";
import { store } from "../../../../rx-store/src/store";
import type { Node, State } from "../../../../rx-store/src/types";
import type { PanelChartConfig, PanelElement, ReferenceCopyMode } from "../types";

export type PanelLayer = {
  id: string;
  name: string;
  locked: boolean;
  editable: boolean;
  mergeSelected?: boolean;
};

export type PanelHistoryItem = {
  index: number;
  timestamp: number;
  label: string;
  active: boolean;
};

const DEFAULT_LAYER_ID = "layer-1";
const DEFAULT_LAYER: PanelLayer = {
  id: DEFAULT_LAYER_ID,
  name: "图层1",
  locked: false,
  editable: false,
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

function getDefaultChartConfig(materialType: string): PanelChartConfig | undefined {
  if (!["bar", "line", "pie", "area", "scatter", "radar", "gauge", "funnel"].includes(materialType)) return undefined;
  const common = {
    color: "#3b82f6",
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
      .map((n) => n.props as PanelElement);
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
    store.update(
      (draft) => {
        draft.root.children = (draft.root.children ?? []).filter(
          (n) => !(isPanelElementNode(n) && n.id === id)
        );
      },
      { meta: { type: "node.delete", id } }
    );
  }, []);

  const deleteElements = useCallback((ids: string[]) => {
    const idSet = new Set(ids.filter(Boolean));
    if (idSet.size === 0) return;
    store.update(
      (draft) => {
        draft.root.children = (draft.root.children ?? []).filter(
          (n) => !(isPanelElementNode(n) && idSet.has(n.id))
        );
      },
      { meta: { type: "node.batch-delete", ids: Array.from(idSet) } }
    );
  }, []);

  const bringElementsToFront = useCallback((ids: string[]) => {
    const idSet = new Set(ids.filter(Boolean));
    if (idSet.size === 0) return;
    store.update(
      (draft) => {
        const list = draft.root.children ?? [];
        const selected: Node[] = [];
        const rest: Node[] = [];
        for (const n of list) {
          if (isPanelElementNode(n) && idSet.has(n.id)) {
            selected.push(n);
          } else {
            rest.push(n);
          }
        }
        draft.root.children = [...rest, ...selected];
      },
      { meta: { type: "node.z.front", ids: Array.from(idSet) } }
    );
  }, []);

  const sendElementsToBack = useCallback((ids: string[]) => {
    const idSet = new Set(ids.filter(Boolean));
    if (idSet.size === 0) return;
    store.update(
      (draft) => {
        const list = draft.root.children ?? [];
        const selected: Node[] = [];
        const rest: Node[] = [];
        for (const n of list) {
          if (isPanelElementNode(n) && idSet.has(n.id)) {
            selected.push(n);
          } else {
            rest.push(n);
          }
        }
        draft.root.children = [...selected, ...rest];
      },
      { meta: { type: "node.z.back", ids: Array.from(idSet) } }
    );
  }, []);

  const bringElementsForward = useCallback((ids: string[]) => {
    const idSet = new Set(ids.filter(Boolean));
    if (idSet.size === 0) return;
    store.update(
      (draft) => {
        const list = draft.root.children ?? [];
        for (let i = list.length - 2; i >= 0; i--) {
          const cur = list[i];
          const next = list[i + 1];
          const curSelected = isPanelElementNode(cur) && idSet.has(cur.id);
          const nextSelected = isPanelElementNode(next) && idSet.has(next.id);
          if (curSelected && !nextSelected) {
            list[i] = next;
            list[i + 1] = cur;
          }
        }
      },
      { meta: { type: "node.z.up", ids: Array.from(idSet) } }
    );
  }, []);

  const sendElementsBackward = useCallback((ids: string[]) => {
    const idSet = new Set(ids.filter(Boolean));
    if (idSet.size === 0) return;
    store.update(
      (draft) => {
        const list = draft.root.children ?? [];
        for (let i = 1; i < list.length; i++) {
          const cur = list[i];
          const prev = list[i - 1];
          const curSelected = isPanelElementNode(cur) && idSet.has(cur.id);
          const prevSelected = isPanelElementNode(prev) && idSet.has(prev.id);
          if (curSelected && !prevSelected) {
            list[i] = prev;
            list[i - 1] = cur;
          }
        }
      },
      { meta: { type: "node.z.down", ids: Array.from(idSet) } }
    );
  }, []);

  const duplicateElement = useCallback(
    (
      id: string,
      options?: { referenceCopyMode?: ReferenceCopyMode }
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
      x: Math.round((node.props.x ?? 0) + 20),
      y: Math.round((node.props.y ?? 0) + 20),
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
      materialType,
      refCopyMode: materialType === "reference" ? "shallow" : undefined,
      chart: getDefaultChartConfig(materialType),
      x: Math.round(x - size.width / 2),
      y: Math.round(y - size.height / 2),
      width: size.width,
      height: size.height,
      rotate: 0,
    };
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
          mergeSelected: false,
        };
        draft.variables.layers = [...list, next];
        draft.variables.activeLayerId = nextId;
      },
      { meta: { type: "layer.add" } }
    );
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
    ) => {
      const mode = options?.mode ?? "remove";
      const targetLayerId = options?.targetLayerId;

      store.update(
        (draft) => {
          const list = (draft.variables?.layers as PanelLayer[] | undefined) ?? [];
          const target = list.find((l) => l.id === layerId);
          if (!target || !target.editable) return;

          const remainingLayers = list.filter((l) => l.id !== layerId);
          const moveTarget = remainingLayers.find((l) => l.id === targetLayerId);

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
            draft.root.children = (draft.root.children ?? []).filter(
              (n) => !isPanelElementNode(n) || n.props?.layerId !== layerId
            );
          }

          if (draft.variables!.activeLayerId === layerId) {
            draft.variables!.activeLayerId =
              moveTarget?.id ?? remainingLayers[0]?.id ?? DEFAULT_LAYER_ID;
          }
        },
        { meta: { type: "layer.delete", layerId, mode } }
      );
    },
    []
  );

  const toggleLayerMergeSelected = useCallback((layerId: string) => {
    store.update(
      (draft) => {
        const list = (draft.variables?.layers as PanelLayer[] | undefined) ?? [];
        const target = list.find((l) => l.id === layerId);
        if (!target) return;
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
        const selected = list.filter((l) => l.mergeSelected);
        if (selected.length < 2) return;

        const nextId = randomId("layer");
        const nextLayer: PanelLayer = {
          id: nextId,
          name: name?.trim() || `图层-${Math.random().toString(36).slice(2, 6)}`,
          locked: false,
          editable: true,
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
    renameLayer,
    toggleLayerLock,
    deleteLayer,
    toggleLayerMergeSelected,
    mergeSelectedLayers,
    undo,
    redo,
    canUndo,
    canRedo,
    historyCursor,
    history,
    exportPanelData,
    importPanelData,
  };
}

