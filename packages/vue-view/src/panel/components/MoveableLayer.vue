<script setup lang="ts">
import { useI18n } from "@arronqzy/i18n/vue";
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  shallowRef,
  watch,
} from "vue";
import Moveable from "moveable";
import type { PanelElement } from "../types";
import { uniformViewportZoom } from "../viewportZoom";
import { notifyPreviewLayoutChanged } from "../utils/panelStateIO";

const { t, locale } = useI18n();

const props = defineProps<{
  zoomX: number;
  zoomY: number;
  canvasContainer: HTMLElement | null;
  dragContainer?: HTMLElement | null;
  selectedTargets: HTMLElement[];
  elementsById: Map<string, PanelElement>;
  updateElement: (
    id: string,
    patch: Partial<PanelElement>,
    options?: { batchId?: string; meta?: Record<string, unknown> }
  ) => void;
  refreshToken?: number | string;
  viewportSyncRef?: { current: (() => void) | null };
}>();

function getGridSlotLayout(grid: PanelElement) {
  const rows = Math.max(1, Math.floor(grid.gridRows ?? 2));
  const cols = Math.max(1, Math.floor(grid.gridCols ?? 3));
  const gap = Math.max(0, grid.gridGap ?? 8);
  const padding = Math.max(0, grid.gridPadding ?? 10);
  const innerWidth = Math.max(1, grid.width - padding * 2);
  const innerHeight = Math.max(1, grid.height - padding * 2);
  const cellWidth = Math.max(1, (innerWidth - gap * (cols - 1)) / cols);
  const cellHeight = Math.max(1, (innerHeight - gap * (rows - 1)) / rows);
  const slots: Array<{
    index: number;
    row: number;
    col: number;
    centerX: number;
    centerY: number;
    x: number;
    y: number;
  }> = [];
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

function readLiveCanvasScale(canvasContainer: HTMLElement | null, fallback: number): number {
  if (!canvasContainer) return fallback;
  const raw = canvasContainer.dataset.canvasScale;
  if (!raw) return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const moveableRef = shallowRef<Moveable | null>(null);
const lockBadgeScreen = ref<{ x: number; y: number } | null>(null);
const syncRafRef = ref<number | null>(null);

const targets = computed(() => {
  const validTargets = props.selectedTargets.filter(
    (target) =>
      !!target && target.isConnected && !!target.closest("[data-panel-canvas]")
  );
  return validTargets.length ? validTargets : null;
});

function getId(target: HTMLElement) {
  const el = target.closest<HTMLElement>(".rv-selectable");
  return el?.dataset.elementId ?? null;
}

const selectedIds = computed(() =>
  (targets.value ?? [])
    .map((target) => getId(target))
    .filter((id): id is string => !!id)
);

const lockedSelected = computed(() =>
  selectedIds.value.filter((id) => props.elementsById.get(id)?.locked)
);

const hasLockedSelected = computed(() => lockedSelected.value.length > 0);

const movableTargets = computed(() => {
  if (!targets.value) return null;
  const unlocked = targets.value.filter((target) => {
    const id = getId(target);
    if (!id) return false;
    return !props.elementsById.get(id)?.locked;
  });
  return unlocked.length ? unlocked : null;
});

const movableIds = computed(() =>
  (movableTargets.value ?? [])
    .map((target) => getId(target))
    .filter((id): id is string => !!id)
);

const propCanvasScale = computed(() =>
  uniformViewportZoom({ x: props.zoomX, y: props.zoomY })
);

const canvasScale = computed(() =>
  readLiveCanvasScale(props.canvasContainer, propCanvasScale.value)
);

const moveableControlZoom = computed(() => 1 / Math.max(0.0001, canvasScale.value));

const pointerRoot = computed(() => props.dragContainer ?? props.canvasContainer);

function toCanvasDeltaX(value: number) {
  return value / Math.max(0.0001, canvasScale.value);
}

function toCanvasDeltaY(value: number) {
  return value / Math.max(0.0001, canvasScale.value);
}

function readClientPoint(eventLike: {
  clientX?: number;
  clientY?: number;
  inputEvent?: { clientX?: number; clientY?: number };
}) {
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
}

function resolveSingleEventId(target: HTMLElement | undefined | null) {
  const id = target ? getId(target) : null;
  if (id) return id;
  if (movableIds.value.length === 1) return movableIds.value[0] ?? null;
  return null;
}

function readTargetCanvasSize(
  target: HTMLElement | null | undefined,
  fallback: { width: number; height: number }
) {
  const rect = target?.getBoundingClientRect?.();
  if (rect && rect.width > 0 && rect.height > 0) {
    return {
      width: Math.max(1, toCanvasDeltaX(rect.width)),
      height: Math.max(1, toCanvasDeltaY(rect.height)),
    };
  }
  return { width: Math.max(1, fallback.width), height: Math.max(1, fallback.height) };
}

function getGridDirectChildren(gridId: string) {
  const result: PanelElement[] = [];
  for (const el of props.elementsById.values()) {
    if (el.parentGridId !== gridId) continue;
    result.push(el);
  }
  return result;
}

function getSnapPatch(
  movingId: string,
  x: number,
  y: number,
  width: number,
  height: number
): Partial<PanelElement> {
  const moving = props.elementsById.get(movingId);
  if (!moving) return {};
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

  for (const [id, el] of props.elementsById.entries()) {
    if (id === movingId || el.materialType !== "grid") continue;
    if (el.layerId !== moving.layerId) continue;
    if (moving.materialType === "grid" && isDescendantGrid(props.elementsById, id, movingId)) {
      continue;
    }
    const { slots, cellWidth, cellHeight, rows, cols, gap } = getGridSlotLayout(el);
    const occupiedSlots = getOccupiedSlotSet(
      props.elementsById,
      el.id,
      movingId,
      moving.layerId
    );
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
      const spanCells = getGridSpanCells(
        rows,
        cols,
        slot.index,
        movingColSpan,
        movingRowSpan
      );
      if (spanCells.colSpan !== movingColSpan || spanCells.rowSpan !== movingRowSpan) {
        continue;
      }
      const blocked = spanCells.indices.some((idx) => occupiedSlots.has(idx));
      if (blocked) continue;
      const distance = Math.hypot(slot.centerX - centerX, slot.centerY - centerY);
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
}

function syncLockBadge() {
  const id = lockedSelected.value[0];
  const root = pointerRoot.value;
  if (!id || !root) {
    lockBadgeScreen.value = null;
    return;
  }
  const target = props.selectedTargets.find(
    (node) => node.closest<HTMLElement>(".rv-selectable")?.dataset.elementId === id
  );
  if (!target) {
    lockBadgeScreen.value = null;
    return;
  }
  const rect = target.getBoundingClientRect();
  const rootRect = root.getBoundingClientRect();
  lockBadgeScreen.value = {
    x: rect.left - rootRect.left,
    y: rect.top - rootRect.top,
  };
}

function scheduleViewportSync() {
  if (syncRafRef.value != null) return;
  syncRafRef.value = requestAnimationFrame(() => {
    syncRafRef.value = null;
    moveableRef.value?.updateRect?.();
    syncLockBadge();
  });
}

function destroyMoveable() {
  moveableRef.value?.destroy();
  moveableRef.value = null;
}

function createMoveable() {
  destroyMoveable();
  const container = props.canvasContainer;
  const movable = movableTargets.value;
  const root = pointerRoot.value;
  if (!container || !movable?.length || !root) return;

  const moveable = new Moveable(container, {
    target: movable,
    rootContainer: container,
    container,
    dragContainer: root,
    className: "rv-moveable-layer",
    zoom: moveableControlZoom.value,
    hideChildMoveableDefaultLines: false,
    dragArea: true,
    draggable: true,
    resizable: true,
    rotatable: true,
    origin: false,
    throttleDrag: 0,
    throttleResize: 0,
    throttleRotate: 0,
  });

  moveable.on("dragStart", (e: any) => {
    const id = resolveSingleEventId(e.target as HTMLElement | null);
    if (!id) return;
    const data = props.elementsById.get(id);
    if (!data) return;
    e.set([0, 0]);
    e.datas.__startX = data.x;
    e.datas.__startY = data.y;
    const point = readClientPoint(e);
    e.datas.__startClientX = point?.x ?? null;
    e.datas.__startClientY = point?.y ?? null;
  });

  moveable.on("drag", (e: any) => {
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
  });

  moveable.on("dragGroupStart", (e: any) => {
    e.events.forEach((ev: any) => {
      const id = ev.target ? getId(ev.target) : null;
      if (!id) return;
      const data = props.elementsById.get(id);
      if (!data) return;
      ev.set([0, 0]);
      ev.datas.__startX = data.x;
      ev.datas.__startY = data.y;
      const point = readClientPoint(ev) ?? readClientPoint(e);
      ev.datas.__startClientX = point?.x ?? null;
      ev.datas.__startClientY = point?.y ?? null;
    });
  });

  moveable.on("dragGroup", (e: any) => {
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
  });

  moveable.on("resizeStart", (e: any) => {
    const id = resolveSingleEventId(e.target as HTMLElement | null);
    if (!id) return;
    const data = props.elementsById.get(id);
    if (!data) return;
    e.setOrigin(["%", "%"]);
    e.dragStart?.set([0, 0]);
    e.datas.__startX = data.x;
    e.datas.__startY = data.y;
    e.datas.__startClientX = e.inputEvent?.clientX ?? null;
    e.datas.__startClientY = e.inputEvent?.clientY ?? null;
  });

  moveable.on("resize", (e: any) => {
    if (!e?.target?.style) return;
    if (e.datas.__startX === undefined || e.datas.__startY === undefined) return;
    e.target.style.width = `${e.width}px`;
    e.target.style.height = `${e.height}px`;
    const sx = e.datas.__startX ?? 0;
    const sy = e.datas.__startY ?? 0;
    const tx = toCanvasDeltaX(e.drag.beforeTranslate?.[0] ?? 0);
    const ty = toCanvasDeltaY(e.drag.beforeTranslate?.[1] ?? 0);
    e.target.style.left = `${sx + tx}px`;
    e.target.style.top = `${sy + ty}px`;
    notifyPreviewLayoutChanged();
  });

  moveable.on("resizeGroupStart", (e: any) => {
    e.events.forEach((ev: any) => {
      const id = ev.target ? getId(ev.target) : null;
      if (!id) return;
      const data = props.elementsById.get(id);
      if (!data) return;
      ev.setOrigin(["%", "%"]);
      ev.dragStart?.set([0, 0]);
      ev.datas.__startX = data.x;
      ev.datas.__startY = data.y;
      const input = ev.inputEvent ?? e.inputEvent;
      ev.datas.__startClientX = input?.clientX ?? null;
      ev.datas.__startClientY = input?.clientY ?? null;
    });
  });

  moveable.on("resizeGroup", (e: any) => {
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
    notifyPreviewLayoutChanged();
  });

  moveable.on("rotateStart", (e: any) => {
    const id = resolveSingleEventId(e.target as HTMLElement | null);
    if (!id) return;
    const data = props.elementsById.get(id);
    if (!data) return;
    e.set(data.rotate ?? 0);
  });

  moveable.on("rotate", (e: any) => {
    if (!e?.target?.style) return;
    e.target.style.transform = `rotate(${e.beforeRotate}deg)`;
  });

  moveable.on("rotateGroup", (e: any) => {
    e.events.forEach((ev: any) => {
      if (!ev?.target?.style) return;
      ev.target.style.transform = `rotate(${ev.beforeRotate}deg)`;
    });
  });

  moveable.on("dragEnd", (e: any) => {
    const id = resolveSingleEventId(e.target as HTMLElement | null);
    if (!id) return;
    const data = props.elementsById.get(id);
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
    props.updateElement(id, { x: nextX, y: nextY, ...patch });
    if (data.materialType === "grid") {
      const dx = nextX - data.x;
      const dy = nextY - data.y;
      if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) {
        const children = getGridDirectChildren(id);
        const batchId = `move-grid-children-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        children.forEach((child) => {
          props.updateElement(
            child.id,
            { x: child.x + dx, y: child.y + dy },
            { batchId, meta: { type: "node.group-drag" } }
          );
        });
      }
    }
    scheduleViewportSync();
  });

  moveable.on("dragGroupEnd", (e: any) => {
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
      const data = props.elementsById.get(id);
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
      props.updateElement(
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
        props.updateElement(
          child.id,
          { x: child.x + delta.dx, y: child.y + delta.dy },
          { batchId, meta: { type: "node.group-drag" } }
        );
      });
    }
    scheduleViewportSync();
  });

  moveable.on("resizeEnd", (e: any) => {
    const id = resolveSingleEventId(e.target as HTMLElement | null);
    if (!id) return;
    const data = props.elementsById.get(id);
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
    props.updateElement(id, { width, height, x: nextX, y: nextY, ...snapPatch });
    scheduleViewportSync();
  });

  moveable.on("resizeGroupEnd", (e: any) => {
    const batchId = `resize-group-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    e.events.forEach((ev: any) => {
      const id = ev.target ? getId(ev.target) : null;
      if (!id) return;
      const data = props.elementsById.get(id);
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
      props.updateElement(
        id,
        { width, height, x: nextX, y: nextY, ...snapPatch },
        { batchId, meta: { type: "node.group-resize" } }
      );
    });
    scheduleViewportSync();
  });

  moveable.on("rotateEnd", (e: any) => {
    const id = resolveSingleEventId(e.target as HTMLElement | null);
    if (!id) return;
    const data = props.elementsById.get(id);
    if (!data) return;
    const rotate = e.lastEvent?.beforeRotate ?? data.rotate ?? 0;
    props.updateElement(id, { rotate });
    scheduleViewportSync();
  });

  moveable.on("rotateGroupEnd", (e: any) => {
    const batchId = `rotate-group-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    e.events.forEach((ev: any) => {
      const id = ev.target ? getId(ev.target) : null;
      if (!id) return;
      const data = props.elementsById.get(id);
      if (!data) return;
      const rotate = ev.lastEvent?.beforeRotate ?? data.rotate ?? 0;
      props.updateElement(id, { rotate }, { batchId, meta: { type: "node.group-rotate" } });
    });
    scheduleViewportSync();
  });

  moveableRef.value = moveable;
  scheduleViewportSync();
}

watch(
  () => [
    props.canvasContainer,
    movableIds.value.join(","),
    props.refreshToken,
    moveableControlZoom.value,
  ] as const,
  () => {
    createMoveable();
    syncLockBadge();
  }
);

watch(canvasScale, () => {
  if (moveableRef.value) {
    moveableRef.value.zoom = moveableControlZoom.value;
    moveableRef.value.updateRect?.();
  }
  syncLockBadge();
});

watch(
  () => props.viewportSyncRef,
  (refObj) => {
    if (!refObj) return;
    refObj.current = scheduleViewportSync;
  },
  { immediate: true }
);

onMounted(() => {
  if (props.viewportSyncRef) {
    props.viewportSyncRef.current = scheduleViewportSync;
  }
  createMoveable();
});

onUnmounted(() => {
  if (props.viewportSyncRef) {
    props.viewportSyncRef.current = null;
  }
  if (syncRafRef.value != null) {
    cancelAnimationFrame(syncRafRef.value);
  }
  destroyMoveable();
});

const showLockBadgeOnly = computed(
  () => lockBadgeScreen.value && hasLockedSelected.value && !movableTargets.value
);

const showPartialLockBadge = computed(
  () => hasLockedSelected.value && lockBadgeScreen.value && !!movableTargets.value
);
</script>

<template>
  <Teleport v-if="pointerRoot && showLockBadgeOnly" :to="pointerRoot">
    <div
      class="pointer-events-none absolute z-[80] inline-flex select-none items-center gap-1 rounded border border-border bg-background/95 px-1.5 py-0.5 text-[11px] text-foreground shadow-sm"
      :style="{ left: `${lockBadgeScreen!.x + 6}px`, top: `${lockBadgeScreen!.y - 22}px` }"
      :title="t('panel.config.nodeLockedTitle')"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.9"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="h-3.5 w-3.5"
        aria-hidden="true"
      >
        <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
        <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
        <circle cx="12" cy="15.5" r="1.2" />
      </svg>
      <span>{{ t("panel.config.nodeLockedBadge") }}</span>
    </div>
  </Teleport>
  <Teleport v-else-if="pointerRoot && showPartialLockBadge" :to="pointerRoot">
    <div
      class="pointer-events-none absolute z-[80] inline-flex select-none items-center gap-1 rounded border border-border bg-background/95 px-1.5 py-0.5 text-[11px] text-foreground shadow-sm"
      :style="{ left: `${lockBadgeScreen!.x + 6}px`, top: `${lockBadgeScreen!.y - 22}px` }"
      :title="t('panel.config.lockedExcludedTitle')"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.9"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="h-3.5 w-3.5"
        aria-hidden="true"
      >
        <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
        <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
        <circle cx="12" cy="15.5" r="1.2" />
      </svg>
      <span>{{ t("panel.config.lockedExcludedBadge") }}</span>
    </div>
  </Teleport>
</template>
