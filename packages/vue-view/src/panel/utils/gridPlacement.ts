import type { PanelElement } from "../types";
import {
  canonicalMappingFamilyRootId,
  concreteGridParentIdForLayer,
  logicalGridParentIdFromConcrete,
} from "./mappingLayerOps";

export function getGridBorderWidth(grid: PanelElement) {
  const raw = grid.style?.borderWidth;
  const n = typeof raw === "number" ? raw : Number(raw);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/**
 * 槽位几何与 border-box 内容区对齐：节点 width/height 含边框时，先扣 border 再算 padding/cell。
 * 子节点绝对坐标、占位格、吸附共用此函数。
 */
export function getGridSlotLayout(grid: PanelElement) {
  const rows = Math.max(1, Math.floor(grid.gridRows ?? 2));
  const cols = Math.max(1, Math.floor(grid.gridCols ?? 3));
  const gap = Math.max(0, grid.gridGap ?? 8);
  const padding = Math.max(0, grid.gridPadding ?? 10);
  const border = getGridBorderWidth(grid);
  const contentWidth = Math.max(1, grid.width - border * 2);
  const contentHeight = Math.max(1, grid.height - border * 2);
  const innerWidth = Math.max(1, contentWidth - padding * 2);
  const innerHeight = Math.max(1, contentHeight - padding * 2);
  const cellWidth = Math.max(1, (innerWidth - gap * (cols - 1)) / cols);
  const cellHeight = Math.max(1, (innerHeight - gap * (rows - 1)) / rows);
  const slots: Array<{ index: number; x: number; y: number; width: number; height: number }> = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = grid.x + border + padding + c * (cellWidth + gap);
      const y = grid.y + border + padding + r * (cellHeight + gap);
      slots.push({
        index: r * cols + c,
        x,
        y,
        width: cellWidth,
        height: cellHeight,
      });
    }
  }
  return { slots, rows, cols, cellWidth, cellHeight, gap, padding, border };
}

export function getGridChildSpanRect(grid: PanelElement, slotIndex: number, colSpan: number, rowSpan: number) {
  const { rows, cols, cellWidth, cellHeight, gap, slots } = getGridSlotLayout(grid);
  const total = rows * cols;
  const safeIndex = Math.max(0, Math.min(total - 1, Math.floor(slotIndex || 0)));
  const baseRow = Math.floor(safeIndex / cols);
  const baseCol = safeIndex % cols;
  const safeColSpan = Math.max(1, Math.min(cols - baseCol, Math.floor(colSpan || 1)));
  const safeRowSpan = Math.max(1, Math.min(rows - baseRow, Math.floor(rowSpan || 1)));
  const baseSlot = slots[safeIndex];
  const width = safeColSpan * cellWidth + (safeColSpan - 1) * gap;
  const height = safeRowSpan * cellHeight + (safeRowSpan - 1) * gap;
  return {
    index: safeIndex,
    x: baseSlot?.x ?? grid.x,
    y: baseSlot?.y ?? grid.y,
    width: Math.max(1, width),
    height: Math.max(1, height),
    colSpan: safeColSpan,
    rowSpan: safeRowSpan,
  };
}

export function inferSpanBySize(size: number, cellSize: number, gap: number, maxSpan: number) {
  const safeMax = Math.max(1, Math.floor(maxSpan));
  const unit = Math.max(1, cellSize + gap);
  const ratio = (Math.max(1, size) + gap) / unit;
  const whole = Math.floor(ratio);
  const fraction = ratio - whole;
  const promoted = fraction >= 0.72 ? whole + 1 : Math.max(1, whole);
  return Math.max(1, Math.min(safeMax, promoted));
}

export function getGridSpanCellsForSnap(
  rows: number,
  cols: number,
  slotIndex: number,
  colSpan: number,
  rowSpan: number
) {
  const total = rows * cols;
  const safeIndex = Math.max(0, Math.min(total - 1, Math.floor(slotIndex || 0)));
  const startRow = Math.floor(safeIndex / cols);
  const startCol = safeIndex % cols;
  const safeColSpan = Math.max(1, Math.min(cols - startCol, Math.floor(colSpan || 1)));
  const safeRowSpan = Math.max(1, Math.min(rows - startRow, Math.floor(rowSpan || 1)));
  const indices: number[] = [];
  for (let r = startRow; r < startRow + safeRowSpan; r++) {
    for (let c = startCol; c < startCol + safeColSpan; c++) {
      indices.push(r * cols + c);
    }
  }
  return {
    safeIndex,
    startRow,
    startCol,
    colSpan: safeColSpan,
    rowSpan: safeRowSpan,
    indices,
  };
}

/**
 * 子节点是否属于该网格：精确 parentGridId，或同层同源映射网格 id（容错脏数据）。
 */
export function elementBelongsToGrid(
  el: PanelElement,
  gridId: string,
  byId: Map<string, PanelElement>
): boolean {
  if (!el.parentGridId) return false;
  if (el.parentGridId === gridId) return true;
  const grid = byId.get(gridId);
  if (!grid || grid.materialType !== "grid") return false;
  if (el.layerId !== grid.layerId) return false;
  const logicalParent = logicalGridParentIdFromConcrete(el.parentGridId, byId);
  if (logicalParent === undefined) return false;
  return canonicalMappingFamilyRootId(byId, gridId) === logicalParent;
}

/** 把可能跨层/脏的 parentGridId 归一到本图层具体网格 id */
export function resolveConcreteParentGridId(
  el: PanelElement,
  byId: Map<string, PanelElement>,
  allElements?: Iterable<PanelElement>
): string | undefined {
  if (!el.parentGridId) return undefined;
  const direct = byId.get(el.parentGridId);
  if (direct?.materialType === "grid" && direct.layerId === el.layerId) {
    return el.parentGridId;
  }
  const logical = logicalGridParentIdFromConcrete(el.parentGridId, byId);
  if (logical === undefined) return undefined;
  const pool = allElements ?? byId.values();
  return concreteGridParentIdForLayer(logical, el.layerId, pool);
}

export function getOccupiedSlotsForGrid(
  elementsById: Map<string, PanelElement>,
  gridId: string,
  excludeId: string | undefined,
  layerId: string
) {
  const occupied = new Set<number>();
  const grid = elementsById.get(gridId);
  if (!grid || grid.materialType !== "grid") return occupied;
  const { rows, cols } = getGridSlotLayout(grid);
  for (const el of elementsById.values()) {
    if (excludeId && el.id === excludeId) continue;
    if (el.layerId !== layerId) continue;
    if (!elementBelongsToGrid(el, gridId, elementsById)) continue;
    if (el.gridSlotIndex === undefined) continue;
    const span = getGridSpanCellsForSnap(rows, cols, el.gridSlotIndex, el.gridColSpan ?? 1, el.gridRowSpan ?? 1);
    span.indices.forEach((idx) => occupied.add(idx));
  }
  return occupied;
}

function isDescendantGrid(
  elementsById: Map<string, PanelElement>,
  possibleDescendantGridId: string,
  ancestorGridId: string
) {
  let current = elementsById.get(possibleDescendantGridId);
  const visited = new Set<string>();
  while (current?.parentGridId) {
    // 环视为「在祖先之下」，禁止互吸形成更糟的结构
    if (visited.has(current.id)) return true;
    visited.add(current.id);
    if (elementBelongsToGrid(current, ancestorGridId, elementsById)) return true;
    const parentConcrete =
      resolveConcreteParentGridId(current, elementsById) ?? current.parentGridId;
    if (parentConcrete === ancestorGridId) return true;
    current = elementsById.get(parentConcrete);
  }
  return false;
}

/** 清空网格 membership（脱离或父网格被删） */
export function clearGridMembershipFields(el: PanelElement): void {
  el.parentGridId = undefined;
  el.gridSlotIndex = undefined;
  el.gridColSpan = undefined;
  el.gridRowSpan = undefined;
}

/** 节点是否落在「正在删除的网格集合」之下（含 remap） */
export function elementParentInGridIdSet(
  el: PanelElement,
  deletingGridIds: Set<string>,
  byId: Map<string, PanelElement>
): boolean {
  if (!el.parentGridId || deletingGridIds.size === 0) return false;
  if (deletingGridIds.has(el.parentGridId)) return true;
  const concrete = resolveConcreteParentGridId(el, byId);
  return !!concrete && deletingGridIds.has(concrete);
}

type SnapNearest = {
  gridId: string;
  slotIndex: number;
  slotX: number;
  slotY: number;
  width: number;
  height: number;
  colSpan: number;
  rowSpan: number;
  distance: number;
};

function pickNearestSnapSlot(params: {
  elementsById: Map<string, PanelElement>;
  layerId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  excludeElementId?: string;
  /** 正在拖动的网格：禁止吸附到其子孙网格 */
  movingGridId?: string;
}): SnapNearest | null {
  const { elementsById, layerId, x, y, width, height, excludeElementId, movingGridId } = params;
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  let nearest: SnapNearest | null = null;

  for (const [, el] of elementsById.entries()) {
    if (el.materialType !== "grid" || el.layerId !== layerId) continue;
    if (excludeElementId && el.id === excludeElementId) continue;
    if (movingGridId && isDescendantGrid(elementsById, el.id, movingGridId)) continue;

    const layout = getGridSlotLayout(el);
    const { slots, cellWidth, cellHeight, rows, cols, gap } = layout;
    const occupiedSlots = getOccupiedSlotsForGrid(
      elementsById,
      el.id,
      excludeElementId,
      layerId
    );
    const threshold = Math.max(8, el.gridSnapThreshold ?? 36);
    const movingColSpan = Math.max(1, inferSpanBySize(width, cellWidth, gap, cols));
    const movingRowSpan = Math.max(1, inferSpanBySize(height, cellHeight, gap, rows));
    const insideGridBounds =
      centerX >= el.x &&
      centerX <= el.x + Math.max(1, el.width) &&
      centerY >= el.y &&
      centerY <= el.y + Math.max(1, el.height);

    for (const slot of slots) {
      const spanCells = getGridSpanCellsForSnap(rows, cols, slot.index, movingColSpan, movingRowSpan);
      if (spanCells.colSpan !== movingColSpan || spanCells.rowSpan !== movingRowSpan) continue;
      const blocked = spanCells.indices.some((idx) => occupiedSlots.has(idx));
      if (blocked) continue;
      const spanWidth = spanCells.colSpan * cellWidth + (spanCells.colSpan - 1) * gap;
      const spanHeight = spanCells.rowSpan * cellHeight + (spanCells.rowSpan - 1) * gap;
      // 用整块 span 中心距离，避免跨格节点偏向左上单格
      const spanCenterX = slot.x + spanWidth / 2;
      const spanCenterY = slot.y + spanHeight / 2;
      const distance = Math.hypot(spanCenterX - centerX, spanCenterY - centerY);
      if (!insideGridBounds && distance > threshold) continue;
      if (!nearest || distance < nearest.distance) {
        nearest = {
          gridId: el.id,
          slotIndex: spanCells.safeIndex,
          slotX: slot.x,
          slotY: slot.y,
          width: spanWidth,
          height: spanHeight,
          colSpan: spanCells.colSpan,
          rowSpan: spanCells.rowSpan,
          distance,
        };
      }
    }
  }
  return nearest;
}

/** 新建节点落点吸附到指定图层上的网格（与 Moveable 吸附规则对齐） */
export function computeSnapPatchForNewElementOnLayer(
  elementsById: Map<string, PanelElement>,
  layerId: string,
  x: number,
  y: number,
  width: number,
  height: number,
  excludeElementId?: string
): Partial<PanelElement> {
  const nearest = pickNearestSnapSlot({
    elementsById,
    layerId,
    x,
    y,
    width,
    height,
    excludeElementId,
  });
  if (!nearest) return {};
  return {
    x: nearest.slotX,
    y: nearest.slotY,
    parentGridId: nearest.gridId,
    gridSlotIndex: nearest.slotIndex,
    gridColSpan: nearest.colSpan,
    gridRowSpan: nearest.rowSpan,
    width: nearest.width,
    height: nearest.height,
  };
}

/** Moveable 拖放/缩放结束时的网格吸附（含脱离与防环） */
export function computeSnapPatchForMovingElement(
  elementsById: Map<string, PanelElement>,
  movingId: string,
  x: number,
  y: number,
  width: number,
  height: number
): Partial<PanelElement> {
  const moving = elementsById.get(movingId);
  if (!moving) return {};
  const nearest = pickNearestSnapSlot({
    elementsById,
    layerId: moving.layerId,
    x,
    y,
    width,
    height,
    excludeElementId: movingId,
    movingGridId: moving.materialType === "grid" ? movingId : undefined,
  });
  if (!nearest) {
    if (moving.parentGridId || moving.gridSlotIndex !== undefined) {
      return {
        parentGridId: undefined,
        gridSlotIndex: undefined,
        gridColSpan: undefined,
        gridRowSpan: undefined,
      };
    }
    return {};
  }
  return {
    x: nearest.slotX,
    y: nearest.slotY,
    parentGridId: nearest.gridId,
    gridSlotIndex: nearest.slotIndex,
    gridColSpan: nearest.colSpan,
    gridRowSpan: nearest.rowSpan,
    width: nearest.width,
    height: nearest.height,
  };
}

function isGridAncestorOf(
  ancestorId: string,
  el: PanelElement,
  byId: Map<string, PanelElement>
): boolean {
  let current: PanelElement | undefined = el;
  const seen = new Set<string>();
  while (current?.parentGridId && !seen.has(current.id)) {
    if (current.parentGridId === ancestorId) return true;
    if (elementBelongsToGrid(current, ancestorId, byId)) return true;
    seen.add(current.id);
    current = byId.get(current.parentGridId);
  }
  return false;
}

/** 父网格先于格子内子节点绘制，避免网格占位层盖住内容 */
export function comparePanelElementsPaintOrder(
  a: PanelElement,
  b: PanelElement,
  byId: Map<string, PanelElement>
): number {
  if (isGridAncestorOf(a.id, b, byId)) return -1;
  if (isGridAncestorOf(b.id, a, byId)) return 1;
  const za = a.zIndex ?? 1;
  const zb = b.zIndex ?? 1;
  if (za !== zb) return za - zb;
  return a.id.localeCompare(b.id);
}
