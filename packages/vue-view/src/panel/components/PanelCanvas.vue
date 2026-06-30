<script setup lang="ts">
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  shallowRef,
  useTemplateRef,
  watch,
} from "vue";
import InfiniteViewer from "infinite-viewer";
import {
  clampViewportZoom,
  clampViewportZoomXY,
  uniformViewportZoom,
  type ViewportZoom,
} from "../viewportZoom";

const props = withDefaults(
  defineProps<{
    zoom: ViewportZoom;
    contentSize?: { width: number; height: number } | null;
    class?: string;
    canvasRef?: (el: HTMLDivElement | null) => void;
    scrollRef?: (el: HTMLDivElement | null) => void;
    viewportSyncRef?: { current: (() => void) | null };
    onDropMaterial?: (payload: { materialId: string; x: number; y: number }) => void;
    onCanvasMouseDownCapture?: (e: MouseEvent) => void;
    onCanvasClickCapture?: (e: MouseEvent) => void;
    onCanvasContextMenuCapture?: (e: MouseEvent) => void;
  }>(),
  { contentSize: null }
);

const emit = defineEmits<{
  zoomChange: [next: ViewportZoom];
  scrollChange: [pos: { left: number; top: number }];
}>();

const viewerHostRef = useTemplateRef<HTMLDivElement>("viewerHost");
const viewportRef = useTemplateRef<HTMLDivElement>("viewport");
const canvasElRef = useTemplateRef<HTMLDivElement>("canvasEl");

const viewerRef = shallowRef<InfiniteViewer | null>(null);
const syncingZoomRef = ref(false);
const didAutoCenterRef = ref(false);
const isPanning = ref(false);
const lastScrollRef = ref({ left: 0, top: 0 });
const zoomRef = ref({ ...props.zoom });
const viewportSizeRef = ref({ width: 0, height: 0 });
const viewport = ref({ width: 0, height: 0 });
const worldCanvasSize = ref<{ width: number; height: number } | null>(null);

const resizeZoomRafRef = ref<number | null>(null);
const resizeLayoutAnchorRef = ref<{
  viewportWidth: number;
  viewportHeight: number;
  zoomX: number;
  zoomY: number;
  scrollLeft: number;
  scrollTop: number;
} | null>(null);
const layoutBaselineRef = ref({
  viewportWidth: 0,
  viewportHeight: 0,
  zoomX: 1,
  zoomY: 1,
});

const panRef = ref({
  active: false,
  moved: false,
  startClientX: 0,
  startClientY: 0,
  startLeft: 0,
  startTop: 0,
});
const panHandlersRef = ref<{
  move: ((ev: MouseEvent) => void) | null;
  up: ((ev: MouseEvent) => void) | null;
}>({ move: null, up: null });

function applyCanvasTransform(scale: number) {
  const el = canvasElRef.value;
  if (!el) return;
  el.style.transform = `scale(${scale})`;
  el.style.transformOrigin = "0 0";
  el.dataset.canvasScale = String(scale);
}

function notifyViewportSync() {
  props.viewportSyncRef?.current?.();
}

function syncViewportElement(el: HTMLDivElement | null) {
  props.scrollRef?.(el);
}

function syncCanvasElement(el: HTMLDivElement | null) {
  if (el) {
    applyCanvasTransform(uniformViewportZoom(zoomRef.value));
  }
  props.canvasRef?.(el);
}

function clearWindowPanListeners() {
  if (panHandlersRef.value.move) {
    window.removeEventListener("mousemove", panHandlersRef.value.move, true);
    panHandlersRef.value.move = null;
  }
  if (panHandlersRef.value.up) {
    window.removeEventListener("mouseup", panHandlersRef.value.up, true);
    panHandlersRef.value.up = null;
  }
}

const resolvedContentSize = computed(() => {
  if (props.contentSize) return props.contentSize;
  if (worldCanvasSize.value) return worldCanvasSize.value;
  return {
    width: Math.max(0, viewport.value.width),
    height: Math.max(0, viewport.value.height),
  };
});

const canvasScale = computed(() => uniformViewportZoom(props.zoom));

const worldStyle = computed(() => ({
  width: `${resolvedContentSize.value.width}px`,
  height: `${resolvedContentSize.value.height}px`,
  position: "relative" as const,
}));

const canvasStyle = computed(() => ({
  width: `${resolvedContentSize.value.width}px`,
  height: `${resolvedContentSize.value.height}px`,
  minWidth: "100%",
  minHeight: "100%",
  position: "relative" as const,
  transformOrigin: "0 0",
}));

function applyViewportResizeZoom(w: number, h: number) {
  if (w < 8 || h < 8) return;
  if (syncingZoomRef.value) return;

  const viewer = viewerRef.value;
  if (!viewer) return;

  const baseline = layoutBaselineRef.value;
  if (baseline.viewportWidth < 8 || baseline.viewportHeight < 8) {
    layoutBaselineRef.value = {
      viewportWidth: w,
      viewportHeight: h,
      zoomX: zoomRef.value.x,
      zoomY: zoomRef.value.y,
    };
    resizeLayoutAnchorRef.value = {
      viewportWidth: w,
      viewportHeight: h,
      zoomX: zoomRef.value.x,
      zoomY: zoomRef.value.y,
      scrollLeft: lastScrollRef.value.left,
      scrollTop: lastScrollRef.value.top,
    };
    return;
  }

  if (
    Math.abs(w - baseline.viewportWidth) < 2 &&
    Math.abs(h - baseline.viewportHeight) < 2
  ) {
    return;
  }

  const factorX = w / baseline.viewportWidth;
  const factorY = h / baseline.viewportHeight;
  const factor = Math.sqrt(factorX * factorY);

  const anchor = resizeLayoutAnchorRef.value ?? {
    viewportWidth: w,
    viewportHeight: h,
    zoomX: zoomRef.value.x,
    zoomY: zoomRef.value.y,
    scrollLeft: lastScrollRef.value.left,
    scrollTop: lastScrollRef.value.top,
  };

  const nextZoomValue = clampViewportZoom(baseline.zoomX * factor);
  const worldX =
    (anchor.scrollLeft + anchor.viewportWidth / 2) / Math.max(0.0001, anchor.zoomX);
  const worldY =
    (anchor.scrollTop + anchor.viewportHeight / 2) / Math.max(0.0001, anchor.zoomY);
  const nextScrollLeft = worldX * nextZoomValue - w / 2;
  const nextScrollTop = worldY * nextZoomValue - h / 2;
  const nextZoom = { x: nextZoomValue, y: nextZoomValue };

  syncingZoomRef.value = true;
  zoomRef.value = nextZoom;
  applyCanvasTransform(nextZoomValue);
  viewer.scrollTo(nextScrollLeft, nextScrollTop);
  resizeLayoutAnchorRef.value = {
    viewportWidth: w,
    viewportHeight: h,
    zoomX: nextZoomValue,
    zoomY: nextZoomValue,
    scrollLeft: nextScrollLeft,
    scrollTop: nextScrollTop,
  };
  layoutBaselineRef.value = {
    viewportWidth: w,
    viewportHeight: h,
    zoomX: nextZoomValue,
    zoomY: nextZoomValue,
  };
  emit("zoomChange", {
    x: Number(nextZoomValue.toFixed(4)),
    y: Number(nextZoomValue.toFixed(4)),
  });
}

function hasMaterialPayload(types: ArrayLike<string> | null | undefined) {
  if (!types) return false;
  return Array.from(types).includes("application/x-arronqzy-material");
}

function commitDropFromPoint(
  clientX: number,
  clientY: number,
  dataTransfer: DataTransfer | null
) {
  const raw = dataTransfer?.getData("application/x-arronqzy-material");
  if (!raw) return;
  try {
    const material = JSON.parse(raw) as { id?: string };
    if (!material?.id) return;
    const viewportEl = viewerRef.value?.getContainer?.() as HTMLDivElement | undefined;
    if (!viewportEl) return;
    const viewportRect = viewportEl.getBoundingClientRect();
    const localX = clientX - viewportRect.left;
    const localY = clientY - viewportRect.top;
    const isInsideViewport =
      localX >= 0 &&
      localY >= 0 &&
      localX <= viewportRect.width &&
      localY <= viewportRect.height;
    if (!isInsideViewport) return;
    const canvasEl = canvasElRef.value;
    if (!canvasEl) return;
    const canvasRect = canvasEl.getBoundingClientRect();
    const x = (clientX - canvasRect.left) / Math.max(0.0001, zoomRef.value.x);
    const y = (clientY - canvasRect.top) / Math.max(0.0001, zoomRef.value.y);
    props.onDropMaterial?.({ materialId: material.id, x, y });
  } catch {
    // ignore invalid payload
  }
}

function setupWheelZoom(el: HTMLDivElement) {
  const onWheelZoom = (e: WheelEvent) => {
    const viewer = viewerRef.value;
    if (!viewer) return;
    const target = e.target as HTMLElement | null;
    if (
      target?.closest("input, textarea, select, [contenteditable='true']") ||
      target?.closest("[role='dialog']")
    ) {
      return;
    }
    e.preventDefault();
    const rect = el.getBoundingClientRect();
    const pointerX = e.clientX - rect.left;
    const pointerY = e.clientY - rect.top;
    const zx = zoomRef.value.x;
    const zy = zoomRef.value.y;
    const currentScrollLeft = Number(lastScrollRef.value.left ?? 0);
    const currentScrollTop = Number(lastScrollRef.value.top ?? 0);

    const direction = e.deltaY > 0 ? -1 : 1;
    const zoomStep = direction > 0 ? 1.08 : 0.92;
    const nextZoom = clampViewportZoomXY({
      x: zx * zoomStep,
      y: zy * zoomStep,
    });
    if (Math.abs(nextZoom.x - zx) < 0.0001 && Math.abs(nextZoom.y - zy) < 0.0001) {
      return;
    }

    const worldX = (pointerX + currentScrollLeft) / Math.max(0.0001, zx);
    const worldY = (pointerY + currentScrollTop) / Math.max(0.0001, zy);
    const nextScrollLeft = worldX * nextZoom.x - pointerX;
    const nextScrollTop = worldY * nextZoom.y - pointerY;
    const nextScale = uniformViewportZoom(nextZoom);

    syncingZoomRef.value = true;
    zoomRef.value = nextZoom;
    applyCanvasTransform(nextScale);
    viewer.scrollTo(nextScrollLeft, nextScrollTop);
    const { width: vw, height: vh } = viewportSizeRef.value;
    resizeLayoutAnchorRef.value = {
      viewportWidth: vw,
      viewportHeight: vh,
      zoomX: nextZoom.x,
      zoomY: nextZoom.y,
      scrollLeft: nextScrollLeft,
      scrollTop: nextScrollTop,
    };
    layoutBaselineRef.value = {
      viewportWidth: vw,
      viewportHeight: vh,
      zoomX: nextZoom.x,
      zoomY: nextZoom.y,
    };
    emit("zoomChange", {
      x: Number(nextZoom.x.toFixed(4)),
      y: Number(nextZoom.y.toFixed(4)),
    });
  };

  el.addEventListener("wheel", onWheelZoom, { passive: false, capture: true });
  return () => el.removeEventListener("wheel", onWheelZoom, true);
}

function setupPanHandlers(el: HTMLDivElement) {
  const onContextMenu = (e: MouseEvent) => {
    if (panRef.value.moved) {
      e.preventDefault();
      e.stopPropagation();
      (e as Event & { stopImmediatePropagation?: () => void }).stopImmediatePropagation?.();
      panRef.value.moved = false;
    }
  };

  const onMouseDown = (e: MouseEvent) => {
    const isRightLike = e.button === 2 || (e.button === 0 && e.ctrlKey);
    if (!isRightLike) return;
    const viewer = viewerRef.value;
    if (!viewer) return;

    panRef.value.active = true;
    panRef.value.moved = false;
    panRef.value.startClientX = e.clientX;
    panRef.value.startClientY = e.clientY;
    panRef.value.startLeft = lastScrollRef.value.left;
    panRef.value.startTop = lastScrollRef.value.top;

    const move = (ev: MouseEvent) => {
      if (!panRef.value.active) return;
      const dx = ev.clientX - panRef.value.startClientX;
      const dy = ev.clientY - panRef.value.startClientY;
      const distance = Math.hypot(dx, dy);
      if (!panRef.value.moved && distance > 10) {
        panRef.value.moved = true;
        isPanning.value = true;
      }
      if (!panRef.value.moved) return;
      ev.preventDefault();
      const nextLeft = panRef.value.startLeft - dx;
      const nextTop = panRef.value.startTop - dy;
      viewer.scrollTo(nextLeft, nextTop);
      lastScrollRef.value = { left: nextLeft, top: nextTop };
      emit("scrollChange", { left: nextLeft, top: nextTop });
      notifyViewportSync();
    };

    const up = (ev: MouseEvent) => {
      if (!panRef.value.active) return;
      if (panRef.value.moved) {
        ev.preventDefault();
      }
      panRef.value.active = false;
      isPanning.value = false;
      clearWindowPanListeners();
    };

    panHandlersRef.value.move = move;
    panHandlersRef.value.up = up;
    window.addEventListener("mousemove", move, true);
    window.addEventListener("mouseup", up, true);
  };

  el.addEventListener("contextmenu", onContextMenu, true);
  el.addEventListener("mousedown", onMouseDown, true);
  return () => {
    el.removeEventListener("contextmenu", onContextMenu, true);
    el.removeEventListener("mousedown", onMouseDown, true);
  };
}

function setupDropHandlers(el: HTMLDivElement) {
  const onDragOver = (e: DragEvent) => {
    if (!hasMaterialPayload(e.dataTransfer?.types)) return;
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
  };

  const onDrop = (e: DragEvent) => {
    if (!hasMaterialPayload(e.dataTransfer?.types)) return;
    e.preventDefault();
    commitDropFromPoint(e.clientX, e.clientY, e.dataTransfer ?? null);
  };

  el.addEventListener("dragover", onDragOver, true);
  el.addEventListener("drop", onDrop, true);
  return () => {
    el.removeEventListener("dragover", onDragOver, true);
    el.removeEventListener("drop", onDrop, true);
  };
}

let cleanupWheel: (() => void) | null = null;
let cleanupPan: (() => void) | null = null;
let cleanupDrop: (() => void) | null = null;
let resizeObserver: ResizeObserver | null = null;

watch(
  () => props.zoom,
  (zoom) => {
    zoomRef.value = zoom;
  },
  { immediate: true, deep: true }
);

watch(viewport, (v) => {
  viewportSizeRef.value = v;
});

watch(
  () => [props.contentSize, viewport.value.width, viewport.value.height] as const,
  () => {
    if (props.contentSize) return;
    if (viewport.value.width < 8 || viewport.value.height < 8) return;
    if (worldCanvasSize.value) return;
    const size = { width: viewport.value.width, height: viewport.value.height };
    layoutBaselineRef.value = {
      viewportWidth: viewport.value.width,
      viewportHeight: viewport.value.height,
      zoomX: zoomRef.value.x,
      zoomY: zoomRef.value.y,
    };
    resizeLayoutAnchorRef.value = {
      viewportWidth: viewport.value.width,
      viewportHeight: viewport.value.height,
      zoomX: zoomRef.value.x,
      zoomY: zoomRef.value.y,
      scrollLeft: lastScrollRef.value.left,
      scrollTop: lastScrollRef.value.top,
    };
    worldCanvasSize.value = size;
  }
);

watch(canvasScale, () => {
  const scale = syncingZoomRef.value
    ? uniformViewportZoom(zoomRef.value)
    : uniformViewportZoom(props.zoom);
  applyCanvasTransform(scale);
});

watch(
  () => [props.zoom.x, props.zoom.y] as const,
  () => {
    if (
      Math.abs(props.zoom.x - zoomRef.value.x) < 0.0001 &&
      Math.abs(props.zoom.y - zoomRef.value.y) < 0.0001
    ) {
      syncingZoomRef.value = false;
    }
  }
);

watch(
  () => [viewport.value.width, viewport.value.height, props.contentSize] as const,
  () => {
    if (props.contentSize) return;
    if (viewport.value.width < 8 || viewport.value.height < 8) return;

    if (resizeZoomRafRef.value != null) {
      cancelAnimationFrame(resizeZoomRafRef.value);
    }
    resizeZoomRafRef.value = requestAnimationFrame(() => {
      resizeZoomRafRef.value = null;
      applyViewportResizeZoom(viewport.value.width, viewport.value.height);
    });
  }
);

watch(canvasElRef, (el) => syncCanvasElement(el), { immediate: true });

onMounted(async () => {
  const host = viewerHostRef.value;
  const viewportEl = viewportRef.value;
  if (!host || !viewportEl) return;

  const viewer = new InfiniteViewer(host, viewportEl, {
    margin: 0,
    threshold: 0,
    useMouseDrag: false,
    displayVerticalScroll: false,
    displayHorizontalScroll: false,
    useWheelScroll: false,
    preventWheelClick: true,
  });
  viewerRef.value = viewer;

  viewer.on("scroll", () => {
    const next = {
      left: viewer.getScrollLeft(),
      top: viewer.getScrollTop(),
    };
    lastScrollRef.value = next;
    emit("scrollChange", next);
    if (!syncingZoomRef.value) {
      notifyViewportSync();
    }
  });

  await nextTick();
  const container = viewer.getContainer() as HTMLDivElement | null;
  syncViewportElement(container);

  const updateViewportSize = () => {
    if (!container) return;
    const width = Math.round(container.clientWidth);
    const height = Math.round(container.clientHeight);
    if (viewport.value.width !== width || viewport.value.height !== height) {
      viewport.value = { width, height };
    }
  };
  updateViewportSize();

  if (container) {
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(updateViewportSize);
      resizeObserver.observe(container);
    } else {
      window.addEventListener("resize", updateViewportSize);
    }

    cleanupWheel = setupWheelZoom(container);
    cleanupPan = setupPanHandlers(container);
    cleanupDrop = setupDropHandlers(container);
  }

  requestAnimationFrame(() => {
    if (!container || didAutoCenterRef.value) return;
    const nodes = container.querySelectorAll<HTMLElement>(".rv-selectable");
    if (!nodes.length) return;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    nodes.forEach((node) => {
      const left = node.offsetLeft;
      const top = node.offsetTop;
      const width = node.offsetWidth;
      const height = node.offsetHeight;
      minX = Math.min(minX, left);
      minY = Math.min(minY, top);
      maxX = Math.max(maxX, left + width);
      maxY = Math.max(maxY, top + height);
    });

    if (!Number.isFinite(minX) || !Number.isFinite(minY)) return;
    const boundsWidth = Math.max(1, maxX - minX);
    const boundsHeight = Math.max(1, maxY - minY);

    const targetLeft = minX + boundsWidth / 2 - container.clientWidth / 2;
    const targetTop = minY + boundsHeight / 2 - container.clientHeight / 2;
    viewer.scrollTo(Math.round(targetLeft), Math.round(targetTop));
    didAutoCenterRef.value = true;
  });
});

onUnmounted(() => {
  clearWindowPanListeners();
  cleanupWheel?.();
  cleanupPan?.();
  cleanupDrop?.();
  resizeObserver?.disconnect();
  if (resizeZoomRafRef.value != null) {
    cancelAnimationFrame(resizeZoomRafRef.value);
  }
  viewerRef.value?.destroy();
  viewerRef.value = null;
  syncViewportElement(null);
  syncCanvasElement(null);
});
</script>

<template>
  <div
    ref="viewerHost"
    :class="[
      'relative h-full w-full overflow-hidden bg-background [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
      isPanning ? 'cursor-grabbing select-none' : '',
      props.class ?? '',
    ]"
    :style="{
      backgroundImage:
        'linear-gradient(to right, hsl(var(--border) / 0.45) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border) / 0.45) 1px, transparent 1px)',
      backgroundSize: '20px 20px',
    }"
  >
    <div ref="viewport">
      <div :style="worldStyle">
        <div
          ref="canvasEl"
          data-panel-canvas
          :style="canvasStyle"
          class="h-full w-full"
          @mousedown.capture="props.onCanvasMouseDownCapture"
          @click.capture="props.onCanvasClickCapture"
          @contextmenu.capture="props.onCanvasContextMenuCapture"
        >
          <slot />
        </div>
        <div
          v-if="$slots['viewport-overlay']"
          class="rv-viewport-overlay pointer-events-none absolute inset-0 z-[70] overflow-visible [&_.moveable-control-box]:pointer-events-auto [&_.moveable-group]:pointer-events-auto [&_.moveable-area]:pointer-events-auto"
        >
          <slot name="viewport-overlay" />
        </div>
      </div>
    </div>
  </div>
</template>
