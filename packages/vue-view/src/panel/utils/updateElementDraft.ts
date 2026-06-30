import type { Node, State } from "@arronqzy/rx-store";
import type { PanelElement } from "../types";
import { getGridChildSpanRect, getGridSlotLayout } from "./gridPlacement";
import {
  canonicalMappingFamilyRootId,
  concreteGridParentIdForLayer,
  logicalGridParentIdFromConcrete,
} from "./mappingLayerOps";
import { isPanelElementNode } from "./panelElementNodes";

/** 防止同源合并把「映射层上的网格 id」泄露到其它图层，保证节点树 parentGridId 只指向本图层网格 */
function fixCrossLayerParentGrid(
  merged: PanelElement,
  propsBefore: PanelElement,
  byId: Map<string, PanelElement>,
  allFlat: PanelElement[]
): void {
  const layerId = propsBefore.layerId;
  const pg = merged.parentGridId;
  if (!pg) return;

  const parentNode = byId.get(pg);
  const validHere =
    !!parentNode &&
    parentNode.materialType === "grid" &&
    parentNode.layerId === layerId;

  if (validHere) return;

  const logical =
    logicalGridParentIdFromConcrete(pg, byId) ??
    (propsBefore.parentGridId !== undefined
      ? logicalGridParentIdFromConcrete(propsBefore.parentGridId, byId)
      : undefined);

  if (logical !== undefined) {
    const cp = concreteGridParentIdForLayer(logical, layerId, allFlat);
    const gridEl = cp ? byId.get(cp) : undefined;
    if (gridEl?.materialType === "grid") {
      merged.parentGridId = cp;
      const spanRect = getGridChildSpanRect(
        gridEl,
        merged.gridSlotIndex ?? 0,
        merged.gridColSpan ?? 1,
        merged.gridRowSpan ?? 1
      );
      merged.gridSlotIndex = spanRect.index;
      merged.gridColSpan = spanRect.colSpan;
      merged.gridRowSpan = spanRect.rowSpan;
      merged.x = spanRect.x;
      merged.y = spanRect.y;
      merged.width = spanRect.width;
      merged.height = spanRect.height;
      return;
    }
  }

  merged.parentGridId = propsBefore.parentGridId;
  merged.gridSlotIndex = propsBefore.gridSlotIndex;
  merged.gridColSpan = propsBefore.gridColSpan;
  merged.gridRowSpan = propsBefore.gridRowSpan;
  merged.x = propsBefore.x;
  merged.y = propsBefore.y;
  merged.width = propsBefore.width;
  merged.height = propsBefore.height;
}

/** 同源映射：外层网格布局改动时，同源簇内每张网格实例一并 reflow 其子节点几何 */
export function applyGridLayoutPatchAcrossMappingFamily(
  draft: State,
  logicalGridSourceId: string,
  patch: Partial<PanelElement>
): void {
  const nodes = draft.root.children ?? [];
  const byIdPre = new Map<string, PanelElement>();
  nodes.forEach((n) => {
    if (!isPanelElementNode(n) || !n.props) return;
    const p = n.props as PanelElement;
    byIdPre.set(p.id, p);
  });
  const gridTargets = nodes.filter((n) => {
    if (!isPanelElementNode(n) || !n.props) return false;
    const p = n.props as PanelElement;
    if (p.materialType !== "grid") return false;
    return canonicalMappingFamilyRootId(byIdPre, p.id) === logicalGridSourceId;
  });
  if (gridTargets.length === 0) return;
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
        child.gridSlotIndex !== undefined ? Math.max(0, Math.floor(child.gridSlotIndex)) : 0;
      const spanRect = getGridChildSpanRect(
        grid,
        slotIndex % slots.length,
        child.gridColSpan ?? 1,
        child.gridRowSpan ?? 1
      );
      child.gridSlotIndex = spanRect.index;
      child.gridColSpan = spanRect.colSpan;
      child.gridRowSpan = spanRect.rowSpan;
      child.x = spanRect.x;
      child.y = spanRect.y;
      child.width = spanRect.width;
      child.height = spanRect.height;
      const childNode = byIdNode.get(child.id);
      if (childNode) childNode.props = child;
      if (child.materialType === "grid") {
        reflowGridDescendants(child);
      }
    });
  };
  gridTargets.forEach((targetNode) => {
    if (!targetNode.props) return;
    const nextGrid = {
      ...(targetNode.props as PanelElement),
      ...patch,
    } as PanelElement;
    targetNode.props = nextGrid;
    reflowGridDescendants(nextGrid);
  });
}

/** 同源节点簇在非网格独占分支下的批量合并（含跨图层 parentGridId remap） */
export function applyMappingFamilySyncPatch(
  draft: State,
  syncSourceId: string,
  syncPatch: Partial<PanelElement>,
  patch: Partial<PanelElement>
): void {
  const nodes = draft.root.children ?? [];
  const byId = new Map<string, PanelElement>();
  nodes.forEach((n) => {
    if (!isPanelElementNode(n) || !n.props) return;
    const p = n.props as PanelElement;
    byId.set(p.id, p);
  });
  const allFlat = [...byId.values()];
  nodes.forEach((n) => {
    if (!isPanelElementNode(n) || !n.props) return;
    const props = n.props as PanelElement;
    const sameFamily = canonicalMappingFamilyRootId(byId, props.id) === syncSourceId;
    if (!sameFamily) return;

    const merged = { ...props, ...syncPatch } as PanelElement;

    if ("parentGridId" in patch && patch.parentGridId === undefined) {
      merged.parentGridId = undefined;
      merged.gridSlotIndex = undefined;
      n.props = merged;
      byId.set(merged.id, merged);
      return;
    }

    const logicalParent =
      patch.parentGridId !== undefined
        ? logicalGridParentIdFromConcrete(patch.parentGridId, byId)
        : props.parentGridId !== undefined
          ? logicalGridParentIdFromConcrete(props.parentGridId, byId)
          : undefined;

    const touchesGridPlacement =
      ("parentGridId" in patch && patch.parentGridId !== undefined) ||
      "gridSlotIndex" in patch ||
      "gridColSpan" in patch ||
      "gridRowSpan" in patch;

    if (touchesGridPlacement && logicalParent !== undefined) {
      const concreteParent = concreteGridParentIdForLayer(logicalParent, props.layerId, allFlat);
      if (concreteParent) {
        const parentEl = byId.get(concreteParent);
        if (parentEl?.materialType === "grid") {
          merged.parentGridId = concreteParent;
          const spanRect = getGridChildSpanRect(
            parentEl,
            merged.gridSlotIndex ?? 0,
            merged.gridColSpan ?? 1,
            merged.gridRowSpan ?? 1
          );
          merged.gridSlotIndex = spanRect.index;
          merged.gridColSpan = spanRect.colSpan;
          merged.gridRowSpan = spanRect.rowSpan;
          merged.x = spanRect.x;
          merged.y = spanRect.y;
          merged.width = spanRect.width;
          merged.height = spanRect.height;
        }
      } else {
        merged.parentGridId = props.parentGridId;
        merged.gridSlotIndex = props.gridSlotIndex;
        merged.gridColSpan = props.gridColSpan;
        merged.gridRowSpan = props.gridRowSpan;
        merged.x = props.x;
        merged.y = props.y;
        merged.width = props.width;
        merged.height = props.height;
      }
    }

    fixCrossLayerParentGrid(merged, props, byId, allFlat);

    n.props = merged;
    byId.set(merged.id, merged);
  });
}
