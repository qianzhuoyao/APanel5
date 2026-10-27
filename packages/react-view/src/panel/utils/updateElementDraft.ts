import type { Node, State } from "@arronqzy/rx-store";
import type { PanelElement } from "../types";
import {
  getGridChildSpanRect,
  getGridSlotLayout,
  resolveConcreteParentGridId,
} from "./gridPlacement";
import {
  canonicalMappingFamilyRootId,
  concreteGridParentIdForLayer,
  logicalGridParentIdFromConcrete,
} from "./mappingLayerOps";
import { isPanelElementNode } from "./panelElementNodes";

const GRID_MEMBERSHIP_KEYS = [
  "parentGridId",
  "gridSlotIndex",
  "gridColSpan",
  "gridRowSpan",
] as const;

/** 布局 patch 不得携带 membership，避免某一层 concrete parentGridId 污染整族 */
function stripGridMembershipFields(patch: Partial<PanelElement>): Partial<PanelElement> {
  const next = { ...patch } as Partial<PanelElement>;
  for (const key of GRID_MEMBERSHIP_KEYS) {
    delete next[key];
  }
  return next;
}

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

function buildChildrenByConcreteParent(
  nodes: Node[],
  byIdPre: Map<string, PanelElement>
): Map<string, PanelElement[]> {
  const allFlat = [...byIdPre.values()];
  const byParent = new Map<string, PanelElement[]>();
  nodes.forEach((n) => {
    if (!isPanelElementNode(n) || !n.props) return;
    const p = n.props as PanelElement;
    if (!p.parentGridId) return;
    // 仅用 concrete 作索引键，纠正写回放在 reflow 里，避免读路径副作用
    const concrete = resolveConcreteParentGridId(p, byIdPre, allFlat) ?? p.parentGridId;
    const list = byParent.get(concrete) ?? [];
    list.push(p);
    byParent.set(concrete, list);
  });
  return byParent;
}

function reflowGridDescendants(
  grid: PanelElement,
  byParent: Map<string, PanelElement[]>,
  byIdNode: Map<string, Node>
) {
  const { slots } = getGridSlotLayout(grid);
  if (slots.length === 0) return;
  const directChildren = byParent.get(grid.id) ?? [];
  directChildren.forEach((child) => {
    const slotIndex =
      child.gridSlotIndex !== undefined ? Math.max(0, Math.floor(child.gridSlotIndex)) : 0;
    // 交给 getGridChildSpanRect 钳位，勿用 %（缩格时会把末槽映到错误起点）
    const spanRect = getGridChildSpanRect(
      grid,
      slotIndex,
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
    if (child.parentGridId !== grid.id) {
      child.parentGridId = grid.id;
    }
    const childNode = byIdNode.get(child.id);
    if (childNode) childNode.props = child;
    if (child.materialType === "grid") {
      reflowGridDescendants(child, byParent, byIdNode);
    }
  });
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

  const safePatch = stripGridMembershipFields(patch);
  const byParent = buildChildrenByConcreteParent(nodes, byIdPre);
  const byIdNode = new Map<string, Node>();
  nodes.forEach((n) => {
    if (!isPanelElementNode(n) || !n.props) return;
    byIdNode.set((n.props as PanelElement).id, n);
  });

  gridTargets.forEach((targetNode) => {
    if (!targetNode.props) return;
    const nextGrid = {
      ...(targetNode.props as PanelElement),
      ...safePatch,
    } as PanelElement;
    targetNode.props = nextGrid;
    reflowGridDescendants(nextGrid, byParent, byIdNode);
  });
}

/**
 * 仅按当前几何 reflow 同源网格族的子节点（不改网格自身 x/y/w/h）。
 * 用于网格刚被吸附进父格、membership 已由 sync 写好之后。
 */
export function reflowMappingFamilyGridChildren(
  draft: State,
  logicalGridSourceId: string
): void {
  applyGridLayoutPatchAcrossMappingFamily(draft, logicalGridSourceId, {});
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
      merged.gridColSpan = undefined;
      merged.gridRowSpan = undefined;
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

export function patchHasGridMembership(patch: Partial<PanelElement>): boolean {
  return GRID_MEMBERSHIP_KEYS.some((key) => key in patch);
}
