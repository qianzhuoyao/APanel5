import { computed, onMounted } from "vue";
import { store, type Node, type State } from "@arronqzy/rx-store";
import { useStoreRef } from "@arronqzy/vue-rx-store";
import { useI18nOptional } from "@arronqzy/i18n/vue";
import type {
  PanelActionResult,
  PanelElement,
  PanelHistoryItem,
  PanelLayer,
  ReferenceCopyMode,
} from "../types";
import { getPanelMessages } from "../constants/messages";
import {
  DEFAULT_LAYER,
  DEFAULT_LAYER_ID,
  getDefaultChartConfig,
  getDefaultGridConfig,
  getDefaultNodeName,
  getDefaultSizeByMaterial,
  getDefaultTextContent,
  normalizePrimaryLayer,
  randomId,
} from "../utils/panelElementDefaults";
import {
  buildDeepReferenceSnapshot,
  clonePanelElement,
  isPanelElementNode,
} from "../utils/panelElementNodes";
import {
  computeSnapPatchForNewElementOnLayer,
  getGridChildSpanRect,
  getGridSlotLayout,
  inferSpanBySize,
} from "../utils/gridPlacement";
import {
  canonicalMappingFamilyRootId,
  expandMappingSeedsWithGridDescendants,
  findCloneIdForSourceNodeOnMappingLayer,
  getMaxZIndexByLayer,
  removeMappingLayersBySourceIds,
} from "../utils/mappingLayerOps";
import {
  applyGridLayoutPatchAcrossMappingFamily,
  applyMappingFamilySyncPatch,
} from "../utils/updateElementDraft";

export type { PanelActionResult, PanelHistoryItem, PanelLayer } from "../types";

const HISTORY_LABEL_KEYS: Record<string, string> = {
  initial: "panel.history.initial",
  "node.update": "panel.history.nodeUpdate",
  "node.group-drag": "panel.history.nodeGroupDrag",
  "node.group-resize": "panel.history.nodeGroupResize",
  "node.group-rotate": "panel.history.nodeGroupRotate",
  "node.delete": "panel.history.nodeDelete",
  "node.batch-delete": "panel.history.nodeBatchDelete",
  "node.z.front": "panel.history.nodeZFront",
  "node.z.back": "panel.history.nodeZBack",
  "node.z.up": "panel.history.nodeZUp",
  "node.z.down": "panel.history.nodeZDown",
  "node.duplicate": "panel.history.nodeDuplicate",
  "node.ref-copy-mode": "panel.history.nodeRefCopyMode",
  "node.add": "panel.history.nodeAdd",
  "layer.activate": "panel.history.layerActivate",
  "layer.add": "panel.history.layerAdd",
  "layer.rename": "panel.history.layerRename",
  "layer.toggle-lock": "panel.history.layerToggleLock",
  "layer.open-selected-mapping": "panel.history.layerOpenSelectedMapping",
  "layer.delete": "panel.history.layerDelete",
  "layer.toggle-merge": "panel.history.layerToggleMerge",
  "layer.merge": "panel.history.layerMerge",
  "layer.set-primary": "panel.history.layerSetPrimary",
  "panel.import": "panel.history.panelImport",
};

export function usePanelElements() {
  const { t, locale } = useI18nOptional();
  const messages = computed(() => {
    void locale.value;
    return getPanelMessages(t);
  });
  const stateRef = useStoreRef();

  onMounted(() => {
    const vars = store.getState().variables ?? {};
    const hasLayers = Array.isArray(vars.layers);
    const hasActive = typeof vars.activeLayerId === "string";
    const hasNodes = (store.getState().root.children?.length ?? 0) > 0;
    if (hasLayers && hasActive && hasNodes) return;

    store.update((draft) => {
      draft.variables = draft.variables ?? {};
      draft.variables.layers = hasLayers
        ? normalizePrimaryLayer((draft.variables.layers as PanelLayer[] | undefined) ?? [DEFAULT_LAYER])
        : [DEFAULT_LAYER];
      draft.variables.activeLayerId = hasActive
        ? draft.variables.activeLayerId
        : DEFAULT_LAYER_ID;

      if (!hasNodes) {
        const seed: PanelElement[] = [];
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
  });

  const layers = computed(() => {
    const rawLayers =
      (stateRef.value.variables?.layers as PanelLayer[] | undefined) ?? [DEFAULT_LAYER];
    return normalizePrimaryLayer(rawLayers);
  });

  const activeLayerId = computed(
    () =>
      (stateRef.value.variables?.activeLayerId as string | undefined) ?? DEFAULT_LAYER_ID
  );

  const allElements = computed(() => {
    const nodes = stateRef.value.root.children ?? [];
    return nodes
      .filter((n) => isPanelElementNode(n) && n.props)
      .map((n) => {
        const props = n.props as PanelElement;
        return { ...props, zIndex: typeof props.zIndex === "number" ? props.zIndex : 1 };
      });
  });

  const elements = computed(() =>
    allElements.value.filter((el) => el.layerId === activeLayerId.value)
  );

  const byId = computed(() => {
    const map = new Map<string, PanelElement>();
    for (const el of allElements.value) map.set(el.id, el);
    return map;
  });

  const layerById = computed(() => {
    const map = new Map<string, PanelLayer>();
    for (const layer of layers.value) map.set(layer.id, layer);
    return map;
  });

  const canUndo = computed(() => {
    void stateRef.value;
    return store.getHistoryCursorIndex() > 0;
  });

  const canRedo = computed(() => {
    void stateRef.value;
    return store.getHistoryCursorIndex() < store.getHistoryEntries().length - 1;
  });

  const historyCursor = computed(() => {
    void stateRef.value;
    return store.getHistoryCursorIndex();
  });

  const history = computed<PanelHistoryItem[]>(() => {
    void stateRef.value;
    const entries = store.getHistoryEntries();
    const cursor = store.getHistoryCursorIndex();
    return entries.map((entry, index) => {
      const type = entry.meta?.type as string | undefined;
      return {
        index,
        timestamp: entry.timestamp,
        label: (type && HISTORY_LABEL_KEYS[type] ? t(HISTORY_LABEL_KEYS[type]) : t("panel.history.fallback")),
        active: index === cursor,
      };
    });
  });

  function updateElement(
    id: string,
    patch: Partial<PanelElement>,
    options?: { batchId?: string; meta?: Record<string, unknown> }
  ) {
    const current = store.getState();
    const list = (current.variables?.layers as PanelLayer[] | undefined) ?? [DEFAULT_LAYER];
    const target = current.root.children?.find((n) => n.id === id);
    const layerId = target?.props?.layerId as string | undefined;
    const layer = list.find((l) => l.id === layerId);
    if (layer?.locked) return;
    const currentElement = (target?.props ?? {}) as PanelElement;
    const elementByIdSnapshot = new Map<string, PanelElement>();
    for (const n of current.root.children ?? []) {
      if (!isPanelElementNode(n) || !n.props) continue;
      const p = n.props as PanelElement;
      elementByIdSnapshot.set(p.id, p);
    }
    const mappingFamilyRootId = canonicalMappingFamilyRootId(elementByIdSnapshot, id);
    const parentGrid =
      currentElement.parentGridId
        ? (current.root.children ?? [])
            .filter((n) => isPanelElementNode(n) && n.props)
            .map((n) => n.props as PanelElement)
            .find((el) => el.id === currentElement.parentGridId && el.materialType === "grid")
        : undefined;
    const detachFromGrid = "parentGridId" in patch && patch.parentGridId === undefined;
    const hasResizePatch = "width" in patch || "height" in patch;
    if (parentGrid && hasResizePatch && !detachFromGrid) {
      const parentLayout = getGridSlotLayout(parentGrid);
      const nextWidth =
        typeof patch.width === "number" ? patch.width : currentElement.width;
      const nextHeight =
        typeof patch.height === "number" ? patch.height : currentElement.height;
      const inferredColSpan = inferSpanBySize(
        nextWidth,
        parentLayout.cellWidth,
        parentLayout.gap,
        parentLayout.cols
      );
      const inferredRowSpan = inferSpanBySize(
        nextHeight,
        parentLayout.cellHeight,
        parentLayout.gap,
        parentLayout.rows
      );
      const total = parentLayout.rows * parentLayout.cols;
      const baseSlot = Math.max(
        0,
        Math.min(
          total - 1,
          Math.floor(
            patch.gridSlotIndex !== undefined
              ? patch.gridSlotIndex
              : currentElement.gridSlotIndex ?? 0
          )
        )
      );
      const currentRow = Math.floor(baseSlot / parentLayout.cols);
      const currentCol = baseSlot % parentLayout.cols;
      const nextStartCol = Math.max(
        0,
        Math.min(parentLayout.cols - inferredColSpan, currentCol)
      );
      const nextStartRow = Math.max(
        0,
        Math.min(parentLayout.rows - inferredRowSpan, currentRow)
      );
      const nextSlotIndex = nextStartRow * parentLayout.cols + nextStartCol;
      patch = {
        ...patch,
        gridSlotIndex: nextSlotIndex,
        gridColSpan: inferredColSpan,
        gridRowSpan: inferredRowSpan,
      };
    }
    const hasGridChildSlotPatch =
      "gridSlotIndex" in patch || "gridColSpan" in patch || "gridRowSpan" in patch;
    if (currentElement.parentGridId && hasGridChildSlotPatch && !detachFromGrid) {
      if (parentGrid) {
        const nextSlotIndex =
          patch.gridSlotIndex !== undefined
            ? patch.gridSlotIndex
            : currentElement.gridSlotIndex ?? 0;
        const nextColSpan =
          patch.gridColSpan !== undefined ? patch.gridColSpan : currentElement.gridColSpan ?? 1;
        const nextRowSpan =
          patch.gridRowSpan !== undefined ? patch.gridRowSpan : currentElement.gridRowSpan ?? 1;
        const spanRect = getGridChildSpanRect(parentGrid, nextSlotIndex, nextColSpan, nextRowSpan);
        patch = {
          ...patch,
          gridSlotIndex: spanRect.index,
          gridColSpan: spanRect.colSpan,
          gridRowSpan: spanRect.rowSpan,
          x: spanRect.x,
          y: spanRect.y,
          width: spanRect.width,
          height: spanRect.height,
        };
      }
    }
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
          applyGridLayoutPatchAcrossMappingFamily(draft, mappingFamilyRootId, patch);
        },
        {
          batchId: options?.batchId,
          meta: { type: "node.update", id, ...(options?.meta ?? {}) },
        }
      );
      return;
    }

    const syncPatch = { ...patch } as Partial<PanelElement>;
    delete (syncPatch as Partial<PanelElement> & { id?: string }).id;
    delete (syncPatch as Partial<PanelElement> & { layerId?: string }).layerId;
    delete (syncPatch as Partial<PanelElement> & { mappingSourceNodeId?: string }).mappingSourceNodeId;
    delete (syncPatch as Partial<PanelElement> & { mappingSourceLayerId?: string }).mappingSourceLayerId;
    if (Object.keys(syncPatch).length > 0) {
      store.update(
        (draft) => {
          applyMappingFamilySyncPatch(draft, mappingFamilyRootId, syncPatch, patch);
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
  }

  function deleteElement(id: string) {
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
        const deleting = (draft.root.children ?? []).find(
          (n) => isPanelElementNode(n) && n.id === id
        );
        if (deleting && isPanelElementNode(deleting) && deleting.props?.id) {
          const props = deleting.props as PanelElement;
          deletedSourceIds.add(props.mappingSourceNodeId ?? props.id);
        }
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
      },
      { meta: { type: "node.delete", id } }
    );
  }

  function deleteElements(ids: string[]) {
    const unlockedIds = ids.filter((id) => {
      const el = byId.value.get(id);
      if (!id || !el) return false;
      if (el.locked) return false;
      const layer = layerById.value.get(el.layerId);
      return !layer?.locked;
    });
    const idSet = new Set(unlockedIds);
    if (idSet.size === 0) return;
    store.update(
      (draft) => {
        const deletedSourceIds = new Set<string>();
        (draft.root.children ?? []).forEach((n) => {
          if (!isPanelElementNode(n) || !n.props) return;
          if (!idSet.has(n.id)) return;
          const props = n.props as PanelElement;
          deletedSourceIds.add(props.mappingSourceNodeId ?? props.id);
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
      },
      { meta: { type: "node.batch-delete", ids: Array.from(idSet) } }
    );
  }

  function bringElementsToFront(ids: string[]) {
    const unlocked = ids.filter((id) => {
      const el = byId.value.get(id);
      if (!id || !el || el.locked) return false;
      const layer = layerById.value.get(el.layerId);
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
  }

  function sendElementsToBack(ids: string[]) {
    const unlocked = ids.filter((id) => {
      const el = byId.value.get(id);
      if (!id || !el || el.locked) return false;
      const layer = layerById.value.get(el.layerId);
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
  }

  function bringElementsForward(ids: string[]) {
    const unlocked = ids.filter((id) => {
      const el = byId.value.get(id);
      if (!id || !el || el.locked) return false;
      const layer = layerById.value.get(el.layerId);
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
  }

  function sendElementsBackward(ids: string[]) {
    const unlocked = ids.filter((id) => {
      const el = byId.value.get(id);
      if (!id || !el || el.locked) return false;
      const layer = layerById.value.get(el.layerId);
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
  }

  function duplicateElement(
    id: string,
    options?: { referenceCopyMode?: ReferenceCopyMode; position?: { x: number; y: number } }
  ) {
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
  }

  function addElementFromMaterial(materialType: string, x: number, y: number) {
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
      name: getDefaultNodeName(materialType, t),
      ...getDefaultTextContent(materialType, t),
      ...getDefaultGridConfig(materialType),
      refCopyMode: materialType === "reference" ? "shallow" : undefined,
      chart: getDefaultChartConfig(materialType, t),
      geometryShape: materialType === "geometry" ? "rect" : undefined,
      geometryColor: materialType === "geometry" ? "#3b82f6" : undefined,
      geometryScript: undefined,
      x: Math.round(x - size.width / 2),
      y: Math.round(y - size.height / 2),
      width: size.width,
      height: size.height,
      rotate: 0,
    };
    if (layer.isMapping && layer.mappingBaseLayerId) {
      const fullById = new Map<string, PanelElement>();
      for (const n of current.root.children ?? []) {
        if (!isPanelElementNode(n) || !n.props) continue;
        const p = n.props as PanelElement;
        fullById.set(p.id, p);
      }
      const snapPatch = computeSnapPatchForNewElementOnLayer(
        fullById,
        layer.mappingBaseLayerId,
        next.x,
        next.y,
        next.width,
        next.height,
        undefined
      );
      const sourceId = randomId("el");
      const sourceNode: PanelElement = {
        ...next,
        ...snapPatch,
        id: sourceId,
        layerId: layer.mappingBaseLayerId,
      };
      const siblingMappings = currentLayers.filter(
        (l) => l.isMapping && l.mappingBaseLayerId === layer.mappingBaseLayerId && !l.locked
      );
      const clones = siblingMappings.map((mappingLayer) => {
        const cloneId = randomId("el");
        const mappedParentGridId =
          sourceNode.parentGridId !== undefined
            ? findCloneIdForSourceNodeOnMappingLayer(
                sourceNode.parentGridId,
                mappingLayer.id,
                fullById
              )
            : undefined;
        return {
          id: cloneId,
          type: materialType,
          props: {
            ...clonePanelElement(sourceNode),
            id: cloneId,
            layerId: mappingLayer.id,
            mappingSourceNodeId: sourceId,
            mappingSourceLayerId: layer.mappingBaseLayerId,
            parentGridId:
              sourceNode.parentGridId === undefined
                ? undefined
                : mappedParentGridId ?? sourceNode.parentGridId,
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
  }

  function setReferenceCopyMode(id: string, mode: ReferenceCopyMode) {
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
  }

  function setActiveLayer(layerId: string) {
    store.update(
      (draft) => {
        draft.variables = draft.variables ?? {};
        draft.variables.activeLayerId = layerId;
      },
      { meta: { type: "layer.activate", layerId } }
    );
  }

  function addLayer() {
    store.update(
      (draft) => {
        draft.variables = draft.variables ?? {};
        const list = (draft.variables.layers as PanelLayer[] | undefined) ?? [DEFAULT_LAYER];
        const nextId = randomId("layer");
        const next: PanelLayer = {
          id: nextId,
          name: t("panel.defaults.layerN", { n: list.length + 1 }),
          locked: false,
          editable: true,
          isPrimary: false,
          isMapping: false,
          mappingBaseLayerId: undefined,
          mergeSelected: false,
        };
        draft.variables.layers = [...list, next];
        draft.variables.activeLayerId = nextId;
      },
      { meta: { type: "layer.add" } }
    );
  }

  function openElementsInNewLayer(ids: string[]): PanelActionResult {
    const filtered = ids.filter(Boolean);
    if (filtered.length === 0) return { ok: false, reason: messages.value.noNodesSelected };
    const current = store.getState();
    const currentLayers =
      (current.variables?.layers as PanelLayer[] | undefined) ?? [DEFAULT_LAYER];
    const nodeById = new Map(
      (current.root.children ?? [])
        .filter((n) => isPanelElementNode(n) && n.props)
        .map((n) => [n.id, n.props as PanelElement])
    );
    const expandedIds = expandMappingSeedsWithGridDescendants(nodeById, filtered);
    const selected = expandedIds
      .map((id) => nodeById.get(id))
      .filter((el): el is PanelElement => !!el);
    if (selected.length === 0) return { ok: false, reason: messages.value.noMigratableNodes };
    const anchorEl = nodeById.get(filtered[0]!) ?? selected[0];
    const hasLocked = selected.some((el) => {
      if (el.locked) return true;
      const layer = currentLayers.find((l) => l.id === el.layerId);
      return !!layer?.locked;
    });
    if (hasLocked) return { ok: false, reason: messages.value.lockedCannotOpenMapping };

    const selectedSet = new Set(selected.map((el) => el.id));
    const idMap = new Map<string, string>();
    selected.forEach((el) => idMap.set(el.id, randomId("el")));
    const nextLayerId = randomId("layer");
    const nextLayer: PanelLayer = {
      id: nextLayerId,
      name: t("panel.defaults.mappingLayerN", { n: currentLayers.length + 1 }),
      locked: false,
      editable: true,
      isPrimary: false,
      isMapping: true,
      mappingBaseLayerId:
        anchorEl?.mappingSourceLayerId ??
        anchorEl?.layerId ??
        (current.variables?.activeLayerId as string | undefined) ??
        DEFAULT_LAYER_ID,
      mergeSelected: false,
    };
    store.update(
      (draft) => {
        draft.variables = draft.variables ?? {};
        const draftLayers = (draft.variables.layers as PanelLayer[] | undefined) ?? [DEFAULT_LAYER];
        draft.variables.layers = normalizePrimaryLayer([...draftLayers, nextLayer]);
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
  }

  function renameLayer(layerId: string, name: string) {
    store.update(
      (draft) => {
        const list = (draft.variables?.layers as PanelLayer[] | undefined) ?? [];
        const target = list.find((l) => l.id === layerId);
        if (!target || !target.editable) return;
        target.name = name.trim() || target.name;
      },
      { meta: { type: "layer.rename", layerId } }
    );
  }

  function toggleLayerLock(layerId: string) {
    store.update(
      (draft) => {
        const list = (draft.variables?.layers as PanelLayer[] | undefined) ?? [];
        const target = list.find((l) => l.id === layerId);
        if (!target || !target.editable) return;
        target.locked = !target.locked;
      },
      { meta: { type: "layer.toggle-lock", layerId } }
    );
  }

  function deleteLayer(
    layerId: string,
    options?: { mode?: "remove" | "move"; targetLayerId?: string }
  ): PanelActionResult {
    const mode = options?.mode ?? "remove";
    const targetLayerId = options?.targetLayerId;
    const current = store.getState();
    const list = (current.variables?.layers as PanelLayer[] | undefined) ?? [];
    const target = list.find((l) => l.id === layerId);
    if (!target) return { ok: false, reason: messages.value.layerNotFound };
    if (!target.editable) return { ok: false, reason: messages.value.defaultLayerCannotDelete };
    if (target.locked) return { ok: false, reason: messages.value.lockedLayerCannotDelete };
    if (mode === "move" && !targetLayerId) {
      return { ok: false, reason: messages.value.selectTargetLayer };
    }
    const remainingLayers = list.filter((l) => l.id !== layerId);
    const moveTarget = remainingLayers.find((l) => l.id === targetLayerId);
    if (mode === "move" && !moveTarget) {
      return { ok: false, reason: messages.value.targetLayerNotFound };
    }
    const allPanelElements = (current.root.children ?? [])
      .filter((n) => isPanelElementNode(n) && n.props)
      .map((n) => n.props as PanelElement);
    const hasBlockingRef = allPanelElements.some((el) => {
      if (target.isMapping) return false;
      const willBeDeleted = mode === "remove" && el.layerId === layerId;
      if (willBeDeleted) return false;
      if (el.materialType !== "reference") return false;
      if (el.refLayerId !== layerId) return false;
      return (el.refCopyMode ?? "shallow") !== "deep";
    });
    if (hasBlockingRef) {
      return { ok: false, reason: messages.value.shallowRefBlockingDelete };
    }

    store.update(
      (draft) => {
        draft.variables!.layers = normalizePrimaryLayer(remainingLayers.map((l) => ({
          ...l,
          mergeSelected: false,
        })));

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
  }

  function toggleLayerMergeSelected(layerId: string) {
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
  }

  function mergeSelectedLayers(name?: string) {
    store.update(
      (draft) => {
        draft.variables = draft.variables ?? {};
        const list = ((draft.variables.layers as PanelLayer[] | undefined) ?? []).slice();
        const selected = list.filter((l) => l.mergeSelected && !l.isMapping);
        if (selected.length < 2) return;

        const nextId = randomId("layer");
        const nextLayer: PanelLayer = {
          id: nextId,
          name:
            name?.trim() ||
            t("panel.defaults.layerRandom", {
              id: Math.random().toString(36).slice(2, 6),
            }),
          locked: false,
          editable: true,
          isPrimary: false,
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

        draft.variables.layers = normalizePrimaryLayer([
          ...list
            .filter((l) => !selectedSet.has(l.id))
            .map((l) => ({ ...l, mergeSelected: false })),
          nextLayer,
        ]);
        draft.variables.activeLayerId = nextId;
      },
      { meta: { type: "layer.merge", name } }
    );
  }

  function setPrimaryLayer(layerId: string) {
    store.update(
      (draft) => {
        const list = (draft.variables?.layers as PanelLayer[] | undefined) ?? [];
        if (list.length === 0) return;
        draft.variables!.layers = list.map((layer) => ({
          ...layer,
          isPrimary: layer.id === layerId,
        }));
      },
      { meta: { type: "layer.set-primary", layerId } }
    );
  }

  function undo() {
    store.undo();
  }

  function redo() {
    store.redo();
  }

  function goToHistory(index: number) {
    store.goToHistory(index);
  }

  function exportPanelData() {
    const current = store.getState();
    return JSON.parse(JSON.stringify(current)) as State;
  }

  function importPanelData(nextState: State) {
    if (!nextState || typeof nextState !== "object") return false;
    if (!nextState.root || typeof nextState.root !== "object") return false;
    if (!nextState.root.id || !nextState.root.type) return false;
    if (!Array.isArray(nextState.root.children)) nextState.root.children = [];
    nextState.variables = nextState.variables ?? {};
    if (!Array.isArray(nextState.variables.layers)) {
      nextState.variables.layers = [DEFAULT_LAYER];
    }
    nextState.variables.layers = normalizePrimaryLayer(nextState.variables.layers as PanelLayer[]);
    if (typeof nextState.variables.activeLayerId !== "string") {
      nextState.variables.activeLayerId =
        (nextState.variables.layers[0] as PanelLayer | undefined)?.id ?? DEFAULT_LAYER_ID;
    }
    store.replaceState(nextState, { type: "panel.import" });
    return true;
  }

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
    setPrimaryLayer,
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
