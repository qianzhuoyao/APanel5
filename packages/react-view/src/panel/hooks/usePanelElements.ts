import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";
import { store } from "../../../../rx-store/src/store";
import type { Node, State } from "../../../../rx-store/src/types";
import type { PanelElement } from "../types";

export type PanelLayer = {
  id: string;
  name: string;
  locked: boolean;
  editable: boolean;
  mergeSelected?: boolean;
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
    default:
      return { width: 220, height: 130 };
  }
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
          {
            id: "el-1",
            layerId: DEFAULT_LAYER_ID,
            materialType: "bar",
            x: 80,
            y: 80,
            width: 160,
            height: 96,
            rotate: 0,
          },
          {
            id: "el-2",
            layerId: DEFAULT_LAYER_ID,
            materialType: "line",
            x: 300,
            y: 140,
            width: 220,
            height: 120,
            rotate: 0,
          },
          {
            id: "el-3",
            layerId: DEFAULT_LAYER_ID,
            materialType: "rect",
            x: 180,
            y: 300,
            width: 140,
            height: 140,
            rotate: 0,
          },
        ];
        draft.root.children = seed.map(
          (el): Node => ({
            id: el.id,
            type: "panel-element",
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
      .filter((n) => n.type === "panel-element" && n.props)
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

  const updateElement = useCallback((id: string, patch: Partial<PanelElement>) => {
    const current = store.getState();
    const list = (current.variables?.layers as PanelLayer[] | undefined) ?? [DEFAULT_LAYER];
    const target = current.root.children?.find((n) => n.id === id);
    const layerId = target?.props?.layerId as string | undefined;
    const layer = list.find((l) => l.id === layerId);
    if (layer?.locked) return;

    store.updateById(id, (node) => {
      node.props = { ...(node.props ?? {}), ...patch };
    });
  }, []);

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
      x: Math.round(x),
      y: Math.round(y),
      width: size.width,
      height: size.height,
      rotate: 0,
    };
    store.update((draft) => {
      draft.root.children = draft.root.children ?? [];
      draft.root.children.push({
        id,
        type: "panel-element",
        props: next,
        children: [],
      });
    });
  }, []);

  const setActiveLayer = useCallback((layerId: string) => {
    store.update((draft) => {
      draft.variables = draft.variables ?? {};
      draft.variables.activeLayerId = layerId;
    });
  }, []);

  const addLayer = useCallback(() => {
    store.update((draft) => {
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
    });
  }, []);

  const renameLayer = useCallback((layerId: string, name: string) => {
    store.update((draft) => {
      const list = (draft.variables?.layers as PanelLayer[] | undefined) ?? [];
      const target = list.find((l) => l.id === layerId);
      if (!target || !target.editable) return;
      target.name = name.trim() || target.name;
    });
  }, []);

  const toggleLayerLock = useCallback((layerId: string) => {
    store.update((draft) => {
      const list = (draft.variables?.layers as PanelLayer[] | undefined) ?? [];
      const target = list.find((l) => l.id === layerId);
      if (!target || !target.editable) return;
      target.locked = !target.locked;
    });
  }, []);

  const deleteLayer = useCallback(
    (
      layerId: string,
      options?: { mode?: "remove" | "move"; targetLayerId?: string }
    ) => {
      const mode = options?.mode ?? "remove";
      const targetLayerId = options?.targetLayerId;

      store.update((draft) => {
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
            if (n.type === "panel-element" && n.props?.layerId === layerId) {
              n.props = { ...(n.props ?? {}), layerId: moveTarget.id };
            }
            return n;
          });
        } else {
          draft.root.children = (draft.root.children ?? []).filter(
            (n) => n.type !== "panel-element" || n.props?.layerId !== layerId
          );
        }

        if (draft.variables!.activeLayerId === layerId) {
          draft.variables!.activeLayerId =
            moveTarget?.id ?? remainingLayers[0]?.id ?? DEFAULT_LAYER_ID;
        }
      });
    },
    []
  );

  const toggleLayerMergeSelected = useCallback((layerId: string) => {
    store.update((draft) => {
      const list = (draft.variables?.layers as PanelLayer[] | undefined) ?? [];
      const target = list.find((l) => l.id === layerId);
      if (!target) return;
      target.mergeSelected = !target.mergeSelected;
    });
  }, []);

  const mergeSelectedLayers = useCallback((name?: string) => {
    store.update((draft) => {
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
        if (n.type === "panel-element" && selectedSet.has(n.props?.layerId)) {
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
    });
  }, []);

  return {
    elements,
    byId,
    layers,
    activeLayerId,
    updateElement,
    addElementFromMaterial,
    setActiveLayer,
    addLayer,
    renameLayer,
    toggleLayerLock,
    deleteLayer,
    toggleLayerMergeSelected,
    mergeSelectedLayers,
  };
}

