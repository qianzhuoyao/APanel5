import type { PanelElement } from "../types";

export function getGridSlotLayout(grid: PanelElement) {
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
  return { slots, rows, cols, cellWidth, cellHeight, gap };
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
    if (el.parentGridId !== gridId) continue;
    if (el.gridSlotIndex === undefined) continue;
    const span = getGridSpanCellsForSnap(rows, cols, el.gridSlotIndex, el.gridColSpan ?? 1, el.gridRowSpan ?? 1);
    span.indices.forEach((idx) => occupied.add(idx));
  }
  return occupied;
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
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  let nearest: {
    gridId: string;
    slotIndex: number;
    slotX: number;
    slotY: number;
    width: number;
    height: number;
    colSpan: number;
    rowSpan: number;
    distance: number;
  } | null = null;

  for (const [, el] of elementsById.entries()) {
    if (el.materialType !== "grid" || el.layerId !== layerId) continue;
    const layout = getGridSlotLayout(el);
    const { slots, cellWidth, cellHeight, rows, cols, gap } = layout;
    const occupiedSlots = getOccupiedSlotsForGrid(elementsById, el.id, excludeElementId, layerId);
    const threshold = Math.max(8, el.gridSnapThreshold ?? 36);
    const inferredColSpan = inferSpanBySize(width, cellWidth, gap, cols);
    const inferredRowSpan = inferSpanBySize(height, cellHeight, gap, rows);
    const movingColSpan = Math.max(1, inferredColSpan);
    const movingRowSpan = Math.max(1, inferredRowSpan);
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
      const slotCenterX = slot.x + cellWidth / 2;
      const slotCenterY = slot.y + cellHeight / 2;
      const distance = Math.hypot(slotCenterX - centerX, slotCenterY - centerY);
      if (!insideGridBounds && distance > threshold) continue;
      if (!nearest || distance < nearest.distance) {
        const spanWidth = spanCells.colSpan * cellWidth + (spanCells.colSpan - 1) * gap;
        const spanHeight = spanCells.rowSpan * cellHeight + (spanCells.rowSpan - 1) * gap;
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
