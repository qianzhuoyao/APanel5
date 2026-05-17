import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Moveable from "react-moveable";

import type { PanelElement } from "../types";
import { uniformViewportZoom } from "../viewportZoom";

function LockGlyph({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
      <circle cx="12" cy="15.5" r="1.2" />
    </svg>
  );
}

export type MoveableLayerProps = {
  zoomX: number;
  zoomY: number;
  /** 带 scale 的画布根节点（data-panel-canvas），与节点同一坐标系 */
  canvasContainer: HTMLElement | null;
  /** 滚动视口，用于拖拽/框选指针坐标 */
  dragContainer?: HTMLElement | null;
  selectedTargets: HTMLElement[];
  elementsById: Map<string, PanelElement>;
  updateElement: (
    id: string,
    patch: Partial<PanelElement>,
    options?: { batchId?: string; meta?: Record<string, unknown> }
  ) => void;
  /** 画布平移/缩放等视口变化时递增或变化，用于触发控制框重算 */
  refreshToken?: number | string;
  /** InfiniteViewer 虚拟滚动位置（无原生 scroll 事件） */
  viewportScroll?: { left: number; top: number };
};

function getGridSlotLayout(grid: PanelElement) {
  const rows = Math.max(1, Math.floor(grid.gridRows ?? 2));
  const cols = Math.max(1, Math.floor(grid.gridCols ?? 3));
  const gap = Math.max(0, grid.gridGap ?? 8);
  const padding = Math.max(0, grid.gridPadding ?? 10);
  const innerWidth = Math.max(1, grid.width - padding * 2);
  const innerHeight = Math.max(1, grid.height - padding * 2);
  const cellWidth = Math.max(1, (innerWidth - gap * (cols - 1)) / cols);
  const cellHeight = Math.max(1, (innerHeight - gap * (rows - 1)) / rows);
  const slots: Array<{ index: number; row: number; col: number; centerX: number; centerY: number; x: number; y: number }> = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = grid.x + padding + c * (cellWidth + gap);
      const y = grid.y + padding + r * (cellHeight + gap);
      slots.push({
        index: r * cols + c,
        row: r,
        col: c,
        x,
        y,
        centerX: x + cellWidth / 2,
        centerY: y + cellHeight / 2,
      });
    }
  }
  return { slots, cellWidth, cellHeight, rows, cols, gap };
}

function inferSpanBySize(size: number, cellSize: number, gap: number, maxSpan: number) {
  const safeMax = Math.max(1, Math.floor(maxSpan));
  const unit = Math.max(1, cellSize + gap);
  const ratio = (Math.max(1, size) + gap) / unit;
  const whole = Math.floor(ratio);
  const fraction = ratio - whole;
  const promoted = fraction >= 0.72 ? whole + 1 : Math.max(1, whole);
  return Math.max(1, Math.min(safeMax, promoted));
}

function getGridSpanCells(
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

function getOccupiedSlotSet(
  elementsById: Map<string, PanelElement>,
  gridId: string,
  selfId: string,
  layerId?: string
) {
  const occupied = new Set<number>();
  const grid = elementsById.get(gridId);
  if (!grid || grid.materialType !== "grid") return occupied;
  const { rows, cols } = getGridSlotLayout(grid);
  for (const el of elementsById.values()) {
    if (el.id === selfId) continue;
    if (layerId && el.layerId !== layerId) continue;
    if (el.parentGridId !== gridId) continue;
    if (el.gridSlotIndex === undefined) continue;
    const span = getGridSpanCells(
      rows,
      cols,
      el.gridSlotIndex,
      el.gridColSpan ?? 1,
      el.gridRowSpan ?? 1
    );
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
    if (visited.has(current.id)) return false;
    visited.add(current.id);
    if (current.parentGridId === ancestorGridId) return true;
    current = elementsById.get(current.parentGridId);
  }
  return false;
}

export function MoveableLayer({
  zoomX,
  zoomY,
  canvasContainer,
  dragContainer,
  selectedTargets,
  elementsById,
  updateElement,
  refreshToken,
  viewportScroll,
}: MoveableLayerProps) {
  const moveableRef = useRef<any>(null);
  const targets = useMemo(() => {
    const validTargets = selectedTargets.filter(
      (target) =>
        !!target &&
        target.isConnected &&
        !!target.closest("[data-panel-canvas]")
    );
    return validTargets.length ? validTargets : null;
  }, [selectedTargets]);

  const getId = useCallback((target: HTMLElement) => {
    const el = target.closest<HTMLElement>(".rv-selectable");
    return el?.dataset.elementId ?? null;
  }, []);
  const selectedIds = useMemo(
    () =>
      (targets ?? [])
        .map((target) => getId(target))
        .filter((id): id is string => !!id),
    [getId, targets]
  );
  const lockedSelected = useMemo(
    () => selectedIds.filter((id) => elementsById.get(id)?.locked),
    [elementsById, selectedIds]
  );
  const hasLockedSelected = lockedSelected.length > 0;
  const movableTargets = useMemo(() => {
    if (!targets) return null;
    const unlocked = targets.filter((target) => {
      const id = getId(target);
      if (!id) return false;
      return !elementsById.get(id)?.locked;
    });
    return unlocked.length ? unlocked : null;
  }, [elementsById, getId, targets]);
  const movableIds = useMemo(
    () =>
      (movableTargets ?? [])
        .map((target) => getId(target))
        .filter((id): id is string => !!id),
    [getId, movableTargets]
  );
  const moveableRenderKey = useMemo(() => movableIds.join(","), [movableIds]);
  const canvasScale = useMemo(
    () => uniformViewportZoom({ x: zoomX, y: zoomY }),
    [zoomX, zoomY]
  );
  /** 控制框在 scale 画布内渲染，用倒数保持屏幕像素尺寸 */
  const moveableControlZoom = useMemo(
    () => 1 / Math.max(0.0001, canvasScale),
    [canvasScale]
  );
  const pointerRoot = dragContainer ?? canvasContainer;
  const resolveSingleEventId = useCallback(
    (target: HTMLElement | undefined | null) => {
      const id = target ? getId(target) : null;
      if (id) return id;
      // 过滤锁定后只剩一个可移动节点时，Moveable 某些事件 target 可能不是节点本身
      if (movableIds.length === 1) return movableIds[0] ?? null;
      return null;
    },
    [getId, movableIds]
  );
  const toCanvasDeltaX = useCallback(
    (value: number) => value / Math.max(0.0001, canvasScale),
    [canvasScale]
  );
  const toCanvasDeltaY = useCallback(
    (value: number) => value / Math.max(0.0001, canvasScale),
    [canvasScale]
  );
  const readClientPoint = useCallback((eventLike: any) => {
    const x =
      typeof eventLike?.clientX === "number"
        ? eventLike.clientX
        : typeof eventLike?.inputEvent?.clientX === "number"
          ? eventLike.inputEvent.clientX
          : null;
    const y =
      typeof eventLike?.clientY === "number"
        ? eventLike.clientY
        : typeof eventLike?.inputEvent?.clientY === "number"
          ? eventLike.inputEvent.clientY
          : null;
    if (x === null || y === null) return null;
    return { x, y };
  }, []);
  const readTargetCanvasSize = useCallback(
    (target: HTMLElement | null | undefined, fallback: { width: number; height: number }) => {
      const rect = target?.getBoundingClientRect?.();
      if (rect && rect.width > 0 && rect.height > 0) {
        return {
          width: Math.max(1, toCanvasDeltaX(rect.width)),
          height: Math.max(1, toCanvasDeltaY(rect.height)),
        };
      }
      return { width: Math.max(1, fallback.width), height: Math.max(1, fallback.height) };
    },
    [toCanvasDeltaX, toCanvasDeltaY]
  );
  const [lockBadgeScreen, setLockBadgeScreen] = useState<{ x: number; y: number } | null>(
    null
  );
  useEffect(() => {
    const id = lockedSelected[0];
    if (!id || !canvasContainer) {
      setLockBadgeScreen(null);
      return;
    }
    const target = selectedTargets.find(
      (node) => node.closest<HTMLElement>(".rv-selectable")?.dataset.elementId === id
    );
    if (!target) {
      setLockBadgeScreen(null);
      return;
    }
    const sync = () => {
      const rect = target.getBoundingClientRect();
      const rootRect = canvasContainer.getBoundingClientRect();
      setLockBadgeScreen({
        x: rect.left - rootRect.left,
        y: rect.top - rootRect.top,
      });
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(target);
    ro.observe(canvasContainer);
    canvasContainer.addEventListener("scroll", sync, { passive: true });
    return () => {
      ro.disconnect();
      canvasContainer.removeEventListener("scroll", sync);
    };
  }, [canvasContainer, lockedSelected, selectedTargets, viewportScroll, zoomX, zoomY]);

  const updateRectNextFrame = useCallback(() => {
    // InfiniteViewer 用 transform 平移，需等视口与节点布局提交后再 updateRect
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        moveableRef.current?.updateRect?.();
      });
    });
  }, []);
  const getGridDirectChildren = useCallback(
    (gridId: string) => {
      const result: PanelElement[] = [];
      for (const el of elementsById.values()) {
        if (el.parentGridId !== gridId) continue;
        result.push(el);
      }
      return result;
    },
    [elementsById]
  );
  const getSnapPatch = useCallback(
    (movingId: string, x: number, y: number, width: number, height: number): Partial<PanelElement> => {
      const moving = elementsById.get(movingId);
      if (!moving) return {};
      const centerX = x + width / 2;
      const centerY = y + height / 2;
      let nearest:
        | {
            gridId: string;
            slotIndex: number;
            slotX: number;
            slotY: number;
            width: number;
            height: number;
            colSpan: number;
            rowSpan: number;
            distance: number;
          }
        | null = null;
      for (const [id, el] of elementsById.entries()) {
        if (id === movingId || el.materialType !== "grid") continue;
        if (el.layerId !== moving.layerId) continue;
        if (
          moving.materialType === "grid" &&
          isDescendantGrid(elementsById, id, movingId)
        ) {
          // 防止把父 grid 吸附到自己的子孙 grid，形成循环父子关系
          continue;
        }
        const { slots, cellWidth, cellHeight, rows, cols, gap } = getGridSlotLayout(el);
        const occupiedSlots = getOccupiedSlotSet(elementsById, el.id, movingId, moving.layerId);
        const threshold = Math.max(8, el.gridSnapThreshold ?? 36);
        // 跨格优先采用显式 span，同时根据当前节点尺寸推断期望 span，避免“视觉占两格但逻辑仍是一格”
        const inferredColSpan = inferSpanBySize(width, cellWidth, gap, cols);
        const inferredRowSpan = inferSpanBySize(height, cellHeight, gap, rows);
        // span 应该由当前尺寸主导，允许从大格回退到小格
        const movingColSpan = Math.max(1, inferredColSpan);
        const movingRowSpan = Math.max(1, inferredRowSpan);
        const insideGridBounds =
          centerX >= el.x &&
          centerX <= el.x + Math.max(1, el.width) &&
          centerY >= el.y &&
          centerY <= el.y + Math.max(1, el.height);
        for (const slot of slots) {
          const spanCells = getGridSpanCells(
            rows,
            cols,
            slot.index,
            movingColSpan,
            movingRowSpan
          );
          // 只接受能完整容纳目标 span 的槽位，避免“想占满但被起点裁剪”。
          if (spanCells.colSpan !== movingColSpan || spanCells.rowSpan !== movingRowSpan) {
            continue;
          }
          const blocked = spanCells.indices.some((idx) => occupiedSlots.has(idx));
          if (blocked) continue;
          const distance = Math.hypot(slot.centerX - centerX, slot.centerY - centerY);
          // 当节点中心已经进入网格区域时，允许吸附到任意空槽位（不受阈值限制）
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
      if (!nearest) {
        if (moving.parentGridId || moving.gridSlotIndex !== undefined) {
          return { parentGridId: undefined, gridSlotIndex: undefined };
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
    },
    [elementsById]
  );

  useEffect(() => {
    if (!targets) return;
    updateRectNextFrame();
  }, [targets, updateRectNextFrame]);

  useEffect(() => {
    if (!targets) return;
    updateRectNextFrame();
  }, [refreshToken, targets, updateRectNextFrame]);

  useEffect(() => {
    if (!targets) return;
    updateRectNextFrame();
  }, [targets, updateRectNextFrame, viewportScroll?.left, viewportScroll?.top]);

  useEffect(() => {
    if (!targets) return;
    updateRectNextFrame();
  }, [targets, updateRectNextFrame, zoomX, zoomY]);

  if (!canvasContainer) return null;

  const lockBadgeOnly =
    lockBadgeScreen && hasLockedSelected && !movableTargets ? (
      <div
        className="pointer-events-none absolute z-[80] inline-flex select-none items-center gap-1 rounded border border-border bg-background/95 px-1.5 py-0.5 text-[11px] text-foreground shadow-sm"
        style={{ left: lockBadgeScreen.x + 6, top: lockBadgeScreen.y - 22 }}
        title="节点已锁定"
      >
        <LockGlyph />
        <span>已锁定</span>
      </div>
    ) : null;

  if (!targets) {
    return lockBadgeOnly ? createPortal(lockBadgeOnly, canvasContainer) : null;
  }

  if (!movableTargets) {
    return lockBadgeOnly ? createPortal(lockBadgeOnly, canvasContainer) : null;
  }

  const layer = (
    <>
      <Moveable
        key={moveableRenderKey}
        ref={moveableRef}
      // Moveable 支持单个 HTMLElement 或 HTMLElement[]
      target={movableTargets as unknown as HTMLElement[]}
      rootContainer={canvasContainer}
      container={canvasContainer}
      dragContainer={pointerRoot ?? canvasContainer}
      className="rv-moveable-layer"
      zoom={moveableControlZoom}
      // 允许在控制框内部区域拖动（不必必须点到某个节点本体）
      dragArea
      draggable
      resizable
      rotatable
      origin={false}
      throttleDrag={0}
      throttleResize={0}
      throttleRotate={0}
      onDragStart={(e: any) => {
        const id = resolveSingleEventId(e.target as HTMLElement | null);
        if (!id) return;
        const data = elementsById.get(id);
        if (!data) return;
        e.set([0, 0]);
        e.datas.__startX = data.x;
        e.datas.__startY = data.y;
        const point = readClientPoint(e);
        e.datas.__startClientX = point?.x ?? null;
        e.datas.__startClientY = point?.y ?? null;
      }}
      onDrag={(e: any) => {
        if (!e?.target?.style) return;
        if (e.datas.__startX === undefined || e.datas.__startY === undefined) return;
        const sx = e.datas.__startX ?? 0;
        const sy = e.datas.__startY ?? 0;
        const point = readClientPoint(e);
        const hasClient =
          typeof e.datas.__startClientX === "number" &&
          typeof e.datas.__startClientY === "number" &&
          !!point;
        const tx = hasClient
          ? toCanvasDeltaX(point.x - e.datas.__startClientX)
          : toCanvasDeltaX(e.beforeTranslate?.[0] ?? 0);
        const ty = hasClient
          ? toCanvasDeltaY(point.y - e.datas.__startClientY)
          : toCanvasDeltaY(e.beforeTranslate?.[1] ?? 0);
        e.target.style.left = `${sx + tx}px`;
        e.target.style.top = `${sy + ty}px`;
      }}
      onDragGroupStart={(e: any) => {
        e.events.forEach((ev: any) => {
          const id = ev.target ? getId(ev.target) : null;
          if (!id) return;
          const data = elementsById.get(id);
          if (!data) return;
          ev.set([0, 0]);
          ev.datas.__startX = data.x;
          ev.datas.__startY = data.y;
          const point = readClientPoint(ev) ?? readClientPoint(e);
          ev.datas.__startClientX = point?.x ?? null;
          ev.datas.__startClientY = point?.y ?? null;
        });
      }}
      onDragGroup={(e: any) => {
        e.events.forEach((ev: any) => {
          if (!ev?.target?.style) return;
          const sx = ev.datas.__startX ?? 0;
          const sy = ev.datas.__startY ?? 0;
          const point = readClientPoint(ev) ?? readClientPoint(e);
          const hasClient =
            typeof ev.datas.__startClientX === "number" &&
            typeof ev.datas.__startClientY === "number" &&
            !!point;
          const tx = hasClient
            ? toCanvasDeltaX(point.x - ev.datas.__startClientX)
            : toCanvasDeltaX(ev.beforeTranslate?.[0] ?? 0);
          const ty = hasClient
            ? toCanvasDeltaY(point.y - ev.datas.__startClientY)
            : toCanvasDeltaY(ev.beforeTranslate?.[1] ?? 0);
          ev.target.style.left = `${sx + tx}px`;
          ev.target.style.top = `${sy + ty}px`;
        });
      }}
      onResizeStart={(e: any) => {
        const id = resolveSingleEventId(e.target as HTMLElement | null);
        if (!id) return;
        const data = elementsById.get(id);
        if (!data) return;
        e.setOrigin(["%", "%"]);
        e.dragStart?.set([0, 0]);
        e.datas.__startX = data.x;
        e.datas.__startY = data.y;
        e.datas.__startClientX = e.inputEvent?.clientX ?? null;
        e.datas.__startClientY = e.inputEvent?.clientY ?? null;
      }}
      onResize={(e: any) => {
        if (!e?.target?.style) return;
        if (e.datas.__startX === undefined || e.datas.__startY === undefined) return;
        e.target.style.width = `${e.width}px`;
        e.target.style.height = `${e.height}px`;
        const sx = e.datas.__startX ?? 0;
        const sy = e.datas.__startY ?? 0;
        // resize 场景下位移应以 moveable 的 drag 偏移为准，避免 client 坐标换算导致漂移
        const tx = toCanvasDeltaX(e.drag.beforeTranslate?.[0] ?? 0);
        const ty = toCanvasDeltaY(e.drag.beforeTranslate?.[1] ?? 0);
        e.target.style.left = `${sx + tx}px`;
        e.target.style.top = `${sy + ty}px`;
      }}
      onResizeGroupStart={(e: any) => {
        e.events.forEach((ev: any) => {
          const id = ev.target ? getId(ev.target) : null;
          if (!id) return;
          const data = elementsById.get(id);
          if (!data) return;
          ev.setOrigin(["%", "%"]);
          ev.dragStart?.set([0, 0]);
          ev.datas.__startX = data.x;
          ev.datas.__startY = data.y;
          const input = ev.inputEvent ?? e.inputEvent;
          ev.datas.__startClientX = input?.clientX ?? null;
          ev.datas.__startClientY = input?.clientY ?? null;
        });
      }}
      onResizeGroup={(e: any) => {
        e.events.forEach((ev: any) => {
          if (!ev?.target?.style) return;
          ev.target.style.width = `${ev.width}px`;
          ev.target.style.height = `${ev.height}px`;
          const sx = ev.datas.__startX ?? 0;
          const sy = ev.datas.__startY ?? 0;
          const tx = toCanvasDeltaX(ev.drag.beforeTranslate?.[0] ?? 0);
          const ty = toCanvasDeltaY(ev.drag.beforeTranslate?.[1] ?? 0);
          ev.target.style.left = `${sx + tx}px`;
          ev.target.style.top = `${sy + ty}px`;
        });
      }}
      onRotateStart={(e: any) => {
        const id = resolveSingleEventId(e.target as HTMLElement | null);
        if (!id) return;
        const data = elementsById.get(id);
        if (!data) return;
        e.set(data.rotate ?? 0);
      }}
      onRotate={(e: any) => {
        if (!e?.target?.style) return;
        e.target.style.transform = `rotate(${e.beforeRotate}deg)`;
      }}
      onRotateGroup={(e: any) => {
        e.events.forEach((ev: any) => {
          if (!ev?.target?.style) return;
          ev.target.style.transform = `rotate(${ev.beforeRotate}deg)`;
        });
      }}
      onDragEnd={(e: any) => {
        const id = resolveSingleEventId(e.target as HTMLElement | null);
        if (!id) return;
        const data = elementsById.get(id);
        if (!data) return;
        const sx = e.datas.__startX ?? data.x;
        const sy = e.datas.__startY ?? data.y;
        const point = readClientPoint(e);
        const hasClient =
          typeof e.datas.__startClientX === "number" &&
          typeof e.datas.__startClientY === "number" &&
          !!point;
        const tx = hasClient
          ? toCanvasDeltaX(point.x - e.datas.__startClientX)
          : toCanvasDeltaX(e.lastEvent?.beforeTranslate?.[0] ?? 0);
        const ty = hasClient
          ? toCanvasDeltaY(point.y - e.datas.__startClientY)
          : toCanvasDeltaY(e.lastEvent?.beforeTranslate?.[1] ?? 0);
        const nextX = sx + tx;
        const nextY = sy + ty;
        const size = readTargetCanvasSize(e.target as HTMLElement | null, {
          width: data.width,
          height: data.height,
        });
        const patch = getSnapPatch(id, nextX, nextY, size.width, size.height);
        updateElement(id, { x: nextX, y: nextY, ...patch });
        if (data.materialType === "grid") {
          const dx = nextX - data.x;
          const dy = nextY - data.y;
          if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) {
            const children = getGridDirectChildren(id);
            const batchId = `move-grid-children-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
            children.forEach((child) => {
              updateElement(
                child.id,
                { x: child.x + dx, y: child.y + dy },
                { batchId, meta: { type: "node.group-drag" } }
              );
            });
          }
        }
        updateRectNextFrame();
      }}
      onDragGroupEnd={(e: any) => {
        const batchId = `move-group-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const selectedSet = new Set(
          e.events
            .map((ev: any) => (ev.target ? getId(ev.target) : null))
            .filter((id: string | null): id is string => !!id)
        );
        const gridDeltaMap = new Map<string, { dx: number; dy: number }>();
        e.events.forEach((ev: any) => {
          const id = ev.target ? getId(ev.target) : null;
          if (!id) return;
          const data = elementsById.get(id);
          if (!data) return;
          const sx = ev.datas.__startX ?? data.x;
          const sy = ev.datas.__startY ?? data.y;
          const point = readClientPoint(ev) ?? readClientPoint(e);
          const hasClient =
            typeof ev.datas.__startClientX === "number" &&
            typeof ev.datas.__startClientY === "number" &&
            !!point;
          const tx = hasClient
            ? toCanvasDeltaX(point.x - ev.datas.__startClientX)
            : toCanvasDeltaX(ev.lastEvent?.beforeTranslate?.[0] ?? 0);
          const ty = hasClient
            ? toCanvasDeltaY(point.y - ev.datas.__startClientY)
            : toCanvasDeltaY(ev.lastEvent?.beforeTranslate?.[1] ?? 0);
          const nextX = sx + tx;
          const nextY = sy + ty;
          const size = readTargetCanvasSize(ev.target as HTMLElement | null, {
            width: data.width,
            height: data.height,
          });
          const patch = getSnapPatch(id, nextX, nextY, size.width, size.height);
          updateElement(
            id,
            { x: nextX, y: nextY, ...patch },
            { batchId, meta: { type: "node.group-drag" } }
          );
          if (data.materialType === "grid") {
            const dx = nextX - data.x;
            const dy = nextY - data.y;
            if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) {
              gridDeltaMap.set(id, { dx, dy });
            }
          }
        });
        for (const [gridId, delta] of gridDeltaMap.entries()) {
          const children = getGridDirectChildren(gridId);
          children.forEach((child) => {
            if (selectedSet.has(child.id)) return;
            updateElement(
              child.id,
              { x: child.x + delta.dx, y: child.y + delta.dy },
              { batchId, meta: { type: "node.group-drag" } }
            );
          });
        }
        updateRectNextFrame();
      }}
      onResizeEnd={(e: any) => {
        const id = resolveSingleEventId(e.target as HTMLElement | null);
        if (!id) return;
        const data = elementsById.get(id);
        if (!data) return;
        const width = e.lastEvent?.width ?? data.width;
        const height = e.lastEvent?.height ?? data.height;
        const tx = toCanvasDeltaX(e.lastEvent?.drag?.beforeTranslate?.[0] ?? 0);
        const ty = toCanvasDeltaY(e.lastEvent?.drag?.beforeTranslate?.[1] ?? 0);
        const sx = e.datas.__startX ?? data.x;
        const sy = e.datas.__startY ?? data.y;
        const nextX = sx + tx;
        const nextY = sy + ty;
        const size = readTargetCanvasSize(e.target as HTMLElement | null, { width, height });
        const snapPatch = getSnapPatch(id, nextX, nextY, size.width, size.height);
        updateElement(id, { width, height, x: nextX, y: nextY, ...snapPatch });
        updateRectNextFrame();
      }}
      onResizeGroupEnd={(e: any) => {
        const batchId = `resize-group-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        e.events.forEach((ev: any) => {
          const id = ev.target ? getId(ev.target) : null;
          if (!id) return;
          const data = elementsById.get(id);
          if (!data) return;
          const width = ev.lastEvent?.width ?? data.width;
          const height = ev.lastEvent?.height ?? data.height;
          const tx = toCanvasDeltaX(ev.lastEvent?.drag?.beforeTranslate?.[0] ?? 0);
          const ty = toCanvasDeltaY(ev.lastEvent?.drag?.beforeTranslate?.[1] ?? 0);
          const sx = ev.datas.__startX ?? data.x;
          const sy = ev.datas.__startY ?? data.y;
          const nextX = sx + tx;
          const nextY = sy + ty;
          const size = readTargetCanvasSize(ev.target as HTMLElement | null, { width, height });
          const snapPatch = getSnapPatch(id, nextX, nextY, size.width, size.height);
          updateElement(
            id,
            { width, height, x: nextX, y: nextY, ...snapPatch },
            { batchId, meta: { type: "node.group-resize" } }
          );
        });
        updateRectNextFrame();
      }}
      onRotateEnd={(e: any) => {
        const id = resolveSingleEventId(e.target as HTMLElement | null);
        if (!id) return;
        const data = elementsById.get(id);
        if (!data) return;
        const rotate = e.lastEvent?.beforeRotate ?? data.rotate ?? 0;
        updateElement(id, { rotate });
        updateRectNextFrame();
      }}
      onRotateGroupEnd={(e: any) => {
        const batchId = `rotate-group-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        e.events.forEach((ev: any) => {
          const id = ev.target ? getId(ev.target) : null;
          if (!id) return;
          const data = elementsById.get(id);
          if (!data) return;
          const rotate = ev.lastEvent?.beforeRotate ?? data.rotate ?? 0;
          updateElement(id, { rotate }, { batchId, meta: { type: "node.group-rotate" } });
        });
        updateRectNextFrame();
      }}
      />
      {hasLockedSelected && lockBadgeScreen ? (
        <div
          className="pointer-events-none absolute z-[80] inline-flex select-none items-center gap-1 rounded border border-border bg-background/95 px-1.5 py-0.5 text-[11px] text-foreground shadow-sm"
          style={{ left: lockBadgeScreen.x + 6, top: lockBadgeScreen.y - 22 }}
          title="部分节点已锁定，已自动排除"
        >
          <LockGlyph />
          <span>锁定节点已排除</span>
        </div>
      ) : null}
    </>
  );

  return createPortal(layer, canvasContainer);
}

