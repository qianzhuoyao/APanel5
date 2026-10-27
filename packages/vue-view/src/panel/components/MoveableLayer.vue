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
import { setCanvasInteractionBusy } from "../utils/canvas-interaction-busy";
import {
  computeSnapPatchForMovingElement,
  elementBelongsToGrid,
  resolveConcreteParentGridId,
} from "../utils/gridPlacement";

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

function readLiveCanvasScale(canvasContainer: HTMLElement | null, fallback: number): number {
  if (!canvasContainer) return fallback;
  const raw = canvasContainer.dataset.canvasScale;
  if (!raw) return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

type GridChildDragStart = { el: HTMLElement; x: number; y: number; rotate: number };

function composeLiveTransform(tx: number, ty: number, rotate: number) {
  return `translate(${tx}px, ${ty}px) rotate(${rotate}deg)`;
}

function applyLiveTranslate(target: HTMLElement, tx: number, ty: number, rotate: number) {
  target.style.transform = composeLiveTransform(tx, ty, rotate);
}

function commitLivePosition(
  target: HTMLElement,
  x: number,
  y: number,
  rotate: number
) {
  target.style.left = `${x}px`;
  target.style.top = `${y}px`;
  target.style.transform = `rotate(${rotate}deg)`;
  target.style.willChange = "";
}

function collectGridDescendantDragStarts(
  canvasContainer: HTMLElement | null,
  elementsById: Map<string, PanelElement>,
  gridId: string
): GridChildDragStart[] {
  if (!canvasContainer) return [];
  const result: GridChildDragStart[] = [];
  const queue = [gridId];
  const seen = new Set<string>();
  while (queue.length > 0) {
    const parentId = queue.shift()!;
    for (const el of elementsById.values()) {
      if (el.parentGridId !== parentId || seen.has(el.id)) continue;
      seen.add(el.id);
      const dom = canvasContainer.querySelector<HTMLElement>(
        `.rv-selectable[data-element-id="${CSS.escape(el.id)}"]`
      );
      if (dom) {
        result.push({ el: dom, x: el.x, y: el.y, rotate: el.rotate ?? 0 });
      }
      if (el.materialType === "grid") queue.push(el.id);
    }
  }
  return result;
}

function applyLiveTranslateToGridChildren(
  children: GridChildDragStart[] | undefined,
  tx: number,
  ty: number
) {
  if (!children?.length) return;
  for (let i = 0; i < children.length; i++) {
    const child = children[i]!;
    applyLiveTranslate(child.el, tx, ty, child.rotate);
  }
}

function clearLiveTranslateOnGridChildren(children: GridChildDragStart[] | undefined) {
  if (!children?.length) return;
  for (let i = 0; i < children.length; i++) {
    const child = children[i]!;
    child.el.style.transform = `rotate(${child.rotate}deg)`;
    child.el.style.willChange = "";
  }
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

function getSnapPatch(
  movingId: string,
  x: number,
  y: number,
  width: number,
  height: number
): Partial<PanelElement> {
  return computeSnapPatchForMovingElement(props.elementsById, movingId, x, y, width, height);
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

function applyLiveMoveableZoom() {
  const moveable = moveableRef.value;
  if (!moveable) return;
  const liveScale = readLiveCanvasScale(props.canvasContainer, propCanvasScale.value);
  moveable.zoom = 1 / Math.max(0.0001, liveScale);
}

function scheduleViewportSync() {
  if (syncRafRef.value != null) return;
  syncRafRef.value = requestAnimationFrame(() => {
    syncRafRef.value = null;
    applyLiveMoveableZoom();
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
    throttleDrag: 1,
    throttleResize: 1,
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
    e.datas.__rotate = data.rotate ?? 0;
    const point = readClientPoint(e);
    e.datas.__startClientX = point?.x ?? null;
    e.datas.__startClientY = point?.y ?? null;
    e.datas.__gridChildren =
      data.materialType === "grid"
        ? collectGridDescendantDragStarts(props.canvasContainer, props.elementsById, id)
        : undefined;
    if (e.target?.style) {
      e.target.style.left = `${data.x}px`;
      e.target.style.top = `${data.y}px`;
      e.target.style.willChange = "transform";
    }
    setCanvasInteractionBusy(true);
  });

  moveable.on("drag", (e: any) => {
    if (!e?.target?.style) return;
    if (e.datas.__startX === undefined || e.datas.__startY === undefined) return;
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
    applyLiveTranslate(e.target, tx, ty, e.datas.__rotate ?? 0);
    applyLiveTranslateToGridChildren(e.datas.__gridChildren, tx, ty);
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
      ev.datas.__rotate = data.rotate ?? 0;
      const point = readClientPoint(ev) ?? readClientPoint(e);
      ev.datas.__startClientX = point?.x ?? null;
      ev.datas.__startClientY = point?.y ?? null;
      ev.datas.__gridChildren =
        data.materialType === "grid"
          ? collectGridDescendantDragStarts(props.canvasContainer, props.elementsById, id)
          : undefined;
      if (ev.target?.style) {
        ev.target.style.left = `${data.x}px`;
        ev.target.style.top = `${data.y}px`;
        ev.target.style.willChange = "transform";
      }
    });
    setCanvasInteractionBusy(true);
  });

  moveable.on("dragGroup", (e: any) => {
    e.events.forEach((ev: any) => {
      if (!ev?.target?.style) return;
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
      applyLiveTranslate(ev.target, tx, ty, ev.datas.__rotate ?? 0);
      applyLiveTranslateToGridChildren(ev.datas.__gridChildren, tx, ty);
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
    e.datas.__rotate = data.rotate ?? 0;
    e.datas.__startClientX = e.inputEvent?.clientX ?? null;
    e.datas.__startClientY = e.inputEvent?.clientY ?? null;
    if (e.target?.style) {
      e.target.style.left = `${data.x}px`;
      e.target.style.top = `${data.y}px`;
      e.target.style.willChange = "transform, width, height";
    }
    setCanvasInteractionBusy(true);
  });

  moveable.on("resize", (e: any) => {
    if (!e?.target?.style) return;
    if (e.datas.__startX === undefined || e.datas.__startY === undefined) return;
    e.target.style.width = `${e.width}px`;
    e.target.style.height = `${e.height}px`;
    const tx = toCanvasDeltaX(e.drag.beforeTranslate?.[0] ?? 0);
    const ty = toCanvasDeltaY(e.drag.beforeTranslate?.[1] ?? 0);
    applyLiveTranslate(e.target, tx, ty, e.datas.__rotate ?? 0);
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
      ev.datas.__rotate = data.rotate ?? 0;
      const input = ev.inputEvent ?? e.inputEvent;
      ev.datas.__startClientX = input?.clientX ?? null;
      ev.datas.__startClientY = input?.clientY ?? null;
      if (ev.target?.style) {
        ev.target.style.left = `${data.x}px`;
        ev.target.style.top = `${data.y}px`;
        ev.target.style.willChange = "transform, width, height";
      }
    });
    setCanvasInteractionBusy(true);
  });

  moveable.on("resizeGroup", (e: any) => {
    e.events.forEach((ev: any) => {
      if (!ev?.target?.style) return;
      ev.target.style.width = `${ev.width}px`;
      ev.target.style.height = `${ev.height}px`;
      const tx = toCanvasDeltaX(ev.drag.beforeTranslate?.[0] ?? 0);
      const ty = toCanvasDeltaY(ev.drag.beforeTranslate?.[1] ?? 0);
      applyLiveTranslate(ev.target, tx, ty, ev.datas.__rotate ?? 0);
    });
  });

  moveable.on("rotateStart", (e: any) => {
    const id = resolveSingleEventId(e.target as HTMLElement | null);
    if (!id) return;
    const data = props.elementsById.get(id);
    if (!data) return;
    e.set(data.rotate ?? 0);
    e.datas.__rotate = data.rotate ?? 0;
    if (e.target?.style) e.target.style.willChange = "transform";
    setCanvasInteractionBusy(true);
  });

  moveable.on("rotate", (e: any) => {
    if (!e?.target?.style) return;
    e.target.style.transform = `rotate(${e.beforeRotate}deg)`;
  });

  moveable.on("rotateGroupStart", (e: any) => {
    e.events.forEach((ev: any) => {
      const id = ev.target ? getId(ev.target) : null;
      if (!id) return;
      const data = props.elementsById.get(id);
      if (!data) return;
      ev.set(data.rotate ?? 0);
      if (ev.target?.style) ev.target.style.willChange = "transform";
    });
    setCanvasInteractionBusy(true);
  });

  moveable.on("rotateGroup", (e: any) => {
    e.events.forEach((ev: any) => {
      if (!ev?.target?.style) return;
      ev.target.style.transform = `rotate(${ev.beforeRotate}deg)`;
    });
  });

  moveable.on("dragEnd", (e: any) => {
    try {
      const id = resolveSingleEventId(e.target as HTMLElement | null);
      if (!id) return;
      const data = props.elementsById.get(id);
      if (!data) return;
      const sx = e.datas.__startX ?? data.x;
      const sy = e.datas.__startY ?? data.y;
      const rotate = e.datas.__rotate ?? data.rotate ?? 0;
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
      if (e.target) commitLivePosition(e.target, nextX, nextY, rotate);
      clearLiveTranslateOnGridChildren(e.datas.__gridChildren);
      const size = readTargetCanvasSize(e.target as HTMLElement | null, {
        width: data.width,
        height: data.height,
      });
      const patch = getSnapPatch(id, nextX, nextY, size.width, size.height);
      props.updateElement(id, { x: nextX, y: nextY, ...patch });
      scheduleViewportSync();
    } finally {
      setCanvasInteractionBusy(false);
    }
  });

  moveable.on("dragGroupEnd", (e: any) => {
    try {
      const batchId = `move-group-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const selectedIdsInGroup: string[] = e.events
        .map((ev: any) => (ev.target ? getId(ev.target) : null))
        .filter((id: string | null): id is string => !!id);
      const selectedGridIds = new Set<string>(
        selectedIdsInGroup.filter(
          (sid: string) => props.elementsById.get(sid)?.materialType === "grid"
        )
      );
      const isUnderSelectedGrid = (el: PanelElement) => {
        if (selectedGridIds.size === 0) return false;
        let current: PanelElement | undefined = el;
        const seen = new Set<string>();
        while (current?.parentGridId && !seen.has(current.id)) {
          seen.add(current.id);
          for (const gid of selectedGridIds) {
            if (elementBelongsToGrid(current, gid, props.elementsById)) return true;
          }
          const concrete: string =
            resolveConcreteParentGridId(current, props.elementsById) ?? current.parentGridId;
          if (selectedGridIds.has(concrete)) return true;
          current = props.elementsById.get(concrete);
        }
        return false;
      };
      e.events.forEach((ev: any) => {
        const id = ev.target ? getId(ev.target) : null;
        if (!id) return;
        const data = props.elementsById.get(id);
        if (!data) return;
        if (selectedGridIds.size > 0 && isUnderSelectedGrid(data)) {
          if (ev.target?.style) {
            ev.target.style.transform = `rotate(${ev.datas.__rotate ?? data.rotate ?? 0}deg)`;
            ev.target.style.willChange = "";
          }
          return;
        }
        const sx = ev.datas.__startX ?? data.x;
        const sy = ev.datas.__startY ?? data.y;
        const rotate = ev.datas.__rotate ?? data.rotate ?? 0;
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
        if (ev.target) commitLivePosition(ev.target, nextX, nextY, rotate);
        clearLiveTranslateOnGridChildren(ev.datas.__gridChildren);
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
      });
      scheduleViewportSync();
    } finally {
      setCanvasInteractionBusy(false);
    }
  });

  moveable.on("resizeEnd", (e: any) => {
    try {
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
      const rotate = e.datas.__rotate ?? data.rotate ?? 0;
      const nextX = sx + tx;
      const nextY = sy + ty;
      if (e.target) {
        e.target.style.width = `${width}px`;
        e.target.style.height = `${height}px`;
        commitLivePosition(e.target, nextX, nextY, rotate);
      }
      const size = readTargetCanvasSize(e.target as HTMLElement | null, { width, height });
      const snapPatch = getSnapPatch(id, nextX, nextY, size.width, size.height);
      props.updateElement(id, { width, height, x: nextX, y: nextY, ...snapPatch });
      scheduleViewportSync();
    } finally {
      setCanvasInteractionBusy(false);
    }
  });

  moveable.on("resizeGroupEnd", (e: any) => {
    try {
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
        const rotate = ev.datas.__rotate ?? data.rotate ?? 0;
        const nextX = sx + tx;
        const nextY = sy + ty;
        if (ev.target) {
          ev.target.style.width = `${width}px`;
          ev.target.style.height = `${height}px`;
          commitLivePosition(ev.target, nextX, nextY, rotate);
        }
        const size = readTargetCanvasSize(ev.target as HTMLElement | null, { width, height });
        const snapPatch = getSnapPatch(id, nextX, nextY, size.width, size.height);
        props.updateElement(
          id,
          { width, height, x: nextX, y: nextY, ...snapPatch },
          { batchId, meta: { type: "node.group-resize" } }
        );
      });
      scheduleViewportSync();
    } finally {
      setCanvasInteractionBusy(false);
    }
  });

  moveable.on("rotateEnd", (e: any) => {
    try {
      const id = resolveSingleEventId(e.target as HTMLElement | null);
      if (!id) return;
      const data = props.elementsById.get(id);
      if (!data) return;
      const rotate = e.lastEvent?.beforeRotate ?? data.rotate ?? 0;
      if (e.target?.style) {
        e.target.style.transform = `rotate(${rotate}deg)`;
        e.target.style.willChange = "";
      }
      props.updateElement(id, { rotate });
      scheduleViewportSync();
    } finally {
      setCanvasInteractionBusy(false);
    }
  });

  moveable.on("rotateGroupEnd", (e: any) => {
    try {
      const batchId = `rotate-group-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      e.events.forEach((ev: any) => {
        const id = ev.target ? getId(ev.target) : null;
        if (!id) return;
        const data = props.elementsById.get(id);
        if (!data) return;
        const rotate = ev.lastEvent?.beforeRotate ?? data.rotate ?? 0;
        if (ev.target?.style) {
          ev.target.style.transform = `rotate(${rotate}deg)`;
          ev.target.style.willChange = "";
        }
        props.updateElement(id, { rotate }, { batchId, meta: { type: "node.group-rotate" } });
      });
      scheduleViewportSync();
    } finally {
      setCanvasInteractionBusy(false);
    }
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
