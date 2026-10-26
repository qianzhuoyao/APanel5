<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { PanelRuler } from "../lib/panel-ruler-canvas";
import { PANEL_Z_INDEX } from "../constants/zIndex";

const RULER_SEGMENT = 10;
const RULER_TARGET_MAJOR_PX = 78;

const props = withDefaults(
  defineProps<{
    zoomX: number;
    zoomY: number;
    scrollLeft: number;
    scrollTop: number;
    /** 固定厚度；省略时按编辑区尺寸动态计算 */
    size?: number;
  }>(),
  {}
);

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function niceNumber(raw: number): number {
  if (!Number.isFinite(raw) || raw <= 0) return 1;
  const exp = Math.floor(Math.log10(raw));
  const frac = raw / 10 ** exp;
  const niceFrac = frac <= 1 ? 1 : frac <= 2 ? 2 : frac <= 5 ? 5 : 10;
  return niceFrac * 10 ** exp;
}

function resolveRulerUnit(zoom: number): number {
  const z = Math.max(zoom, 0.0001);
  return Math.max(1, niceNumber(RULER_TARGET_MAJOR_PX / z));
}

function resolveRulerSize(width: number, height: number): number {
  const edge = Math.min(width || 0, height || 0);
  if (edge <= 0) return 22;
  return Math.round(clamp(edge * 0.032, 24, 30));
}

const rootRef = ref<HTMLElement | null>(null);
const autoSize = ref(22);
const isDark = ref(false);
const topHRef = ref<HTMLElement | null>(null);
const leftVRef = ref<HTMLElement | null>(null);
const bottomHRef = ref<HTMLElement | null>(null);
const rightVRef = ref<HTMLElement | null>(null);

let rulers: Array<{ ruler: PanelRuler; axis: "h" | "v" }> = [];
let themeObserver: MutationObserver | null = null;
let resizeObserver: ResizeObserver | null = null;

const size = computed(() =>
  typeof props.size === "number" ? props.size : autoSize.value
);
const sizePx = computed(() => `${size.value}px`);
const longLineSize = computed(() => Math.max(4, Math.round(size.value * 0.28)));
const shortLineSize = computed(() => Math.max(2, Math.round(size.value * 0.15)));
const fontPx = computed(() => Math.max(10, Math.min(12, Math.round(size.value * 0.42))));
const bg = computed(() =>
  isDark.value ? "rgba(15,23,42,0.98)" : "rgba(255,255,255,0.98)"
);
const lineColor = computed(() =>
  isDark.value ? "rgba(226,232,240,0.75)" : "rgba(15,23,42,0.5)"
);
const textColor = computed(() =>
  isDark.value ? "rgba(248,250,252,0.95)" : "rgba(15,23,42,0.88)"
);
const seam = computed(() =>
  isDark.value ? "rgba(226,232,240,0.45)" : "rgba(15,23,42,0.28)"
);


const rulerScrollLeft = computed(
  () => props.scrollLeft + size.value * (1 - 1 / Math.max(props.zoomX, 0.0001))
);
const rulerScrollTop = computed(
  () => props.scrollTop + size.value * (1 - 1 / Math.max(props.zoomY, 0.0001))
);

const clipTop = computed(
  () => `polygon(0 0, 100% 0, calc(100% - ${sizePx.value}) 100%, ${sizePx.value} 100%)`
);
const clipBottom = computed(
  () => `polygon(${sizePx.value} 0, calc(100% - ${sizePx.value}) 0, 100% 100%, 0 100%)`
);
const clipLeft = computed(
  () => `polygon(0 0, 100% ${sizePx.value}, 100% calc(100% - ${sizePx.value}), 0 100%)`
);
const clipRight = computed(
  () => `polygon(0 ${sizePx.value}, 100% 0, 100% 100%, 0 calc(100% - ${sizePx.value}))`
);

const unitX = computed(() => resolveRulerUnit(props.zoomX));
const unitY = computed(() => resolveRulerUnit(props.zoomY));

const horizontalOptions = computed(() => ({
  type: "horizontal" as const,
  zoom: props.zoomX,
  unit: unitX.value,
  segment: RULER_SEGMENT,
  backgroundColor: bg.value,
  lineColor: lineColor.value,
  textColor: textColor.value,
  font: `500 ${fontPx.value}px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial`,
  longLineSize: longLineSize.value,
  shortLineSize: shortLineSize.value,
}));

const verticalOptions = computed(() => ({
  type: "vertical" as const,
  zoom: props.zoomY,
  unit: unitY.value,
  segment: RULER_SEGMENT,
  backgroundColor: bg.value,
  lineColor: lineColor.value,
  textColor: textColor.value,
  font: `500 ${fontPx.value}px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial`,
  longLineSize: longLineSize.value,
  shortLineSize: shortLineSize.value,
}));

function destroyRulers() {
  for (const { ruler } of rulers) {
    ruler.destroy();
  }
  rulers = [];
}

function initRulers() {
  destroyRulers();
  if (topHRef.value) {
    rulers.push({ ruler: new PanelRuler(topHRef.value, horizontalOptions.value), axis: "h" });
  }
  if (leftVRef.value) {
    rulers.push({ ruler: new PanelRuler(leftVRef.value, verticalOptions.value), axis: "v" });
  }
  if (bottomHRef.value) {
    rulers.push({ ruler: new PanelRuler(bottomHRef.value, horizontalOptions.value), axis: "h" });
  }
  if (rightVRef.value) {
    rulers.push({ ruler: new PanelRuler(rightVRef.value, verticalOptions.value), axis: "v" });
  }
  syncScroll();
}

function syncScroll() {
  for (const { ruler, axis } of rulers) {
    ruler.scroll(axis === "h" ? rulerScrollLeft.value : rulerScrollTop.value);
  }
}

function syncTheme() {
  for (const { ruler, axis } of rulers) {
    const opts = axis === "h" ? horizontalOptions.value : verticalOptions.value;
    ruler.setState({
      zoom: opts.zoom,
      unit: opts.unit,
      segment: opts.segment,
      backgroundColor: opts.backgroundColor,
      lineColor: opts.lineColor,
      textColor: opts.textColor,
      font: opts.font,
      longLineSize: opts.longLineSize,
      shortLineSize: opts.shortLineSize,
    });
  }
  syncScroll();
}

onMounted(() => {
  const root = document.documentElement;
  const updateTheme = () => {
    isDark.value = root.classList.contains("dark");
  };
  updateTheme();
  themeObserver = new MutationObserver(updateTheme);
  themeObserver.observe(root, { attributes: true, attributeFilter: ["class"] });

  if (rootRef.value && typeof props.size !== "number") {
    const updateSize = () => {
      const rect = rootRef.value!.getBoundingClientRect();
      autoSize.value = resolveRulerSize(rect.width, rect.height);
    };
    updateSize();
    resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(rootRef.value);
  }

  initRulers();
  window.addEventListener("resize", initRulers);
});

onUnmounted(() => {
  themeObserver?.disconnect();
  resizeObserver?.disconnect();
  window.removeEventListener("resize", initRulers);
  destroyRulers();
});

watch([horizontalOptions, verticalOptions], () => {
  if (rulers.length === 0) return;
  syncTheme();
});

watch([rulerScrollLeft, rulerScrollTop], () => {
  if (rulers.length === 0) return;
  syncScroll();
});

watch(size, () => {
  initRulers();
});

watch([topHRef, leftVRef, bottomHRef, rightVRef], () => {
  if (!topHRef.value || !leftVRef.value || !bottomHRef.value || !rightVRef.value) return;
  if (rulers.length === 0) initRulers();
});
</script>

<template>
  <div
    ref="rootRef"
    class="pointer-events-none absolute inset-0 isolate"
    :style="{
      '--rv-ruler-size': sizePx,
      zIndex: PANEL_Z_INDEX.ruler,
    }"
  >
    <div
      class="absolute inset-x-0 top-0 overflow-hidden"
      :style="{ height: sizePx, clipPath: clipTop, backgroundColor: bg }"
    >
      <div ref="topHRef" class="h-full w-full" />
    </div>
    <div
      class="absolute inset-y-0 left-0 overflow-hidden"
      :style="{ width: sizePx, clipPath: clipLeft, backgroundColor: bg }"
    >
      <div ref="leftVRef" class="h-full w-full" />
    </div>
    <div
      class="absolute inset-x-0 bottom-0 overflow-hidden"
      :style="{ height: sizePx, clipPath: clipBottom, backgroundColor: bg }"
    >
      <div ref="bottomHRef" class="h-full w-full" />
    </div>
    <div
      class="absolute inset-y-0 right-0 overflow-hidden"
      :style="{ width: sizePx, clipPath: clipRight, backgroundColor: bg }"
    >
      <div ref="rightVRef" class="h-full w-full" />
    </div>

    <svg
      aria-hidden="true"
      class="pointer-events-none absolute left-0 top-0"
      :width="size"
      :height="size"
      style="z-index: 1"
    >
      <line :x1="0" :y1="0" :x2="size" :y2="size" :stroke="seam" stroke-width="1" />
    </svg>
    <svg
      aria-hidden="true"
      class="pointer-events-none absolute right-0 top-0"
      :width="size"
      :height="size"
      style="z-index: 1"
    >
      <line :x1="size" :y1="0" :x2="0" :y2="size" :stroke="seam" stroke-width="1" />
    </svg>
    <svg
      aria-hidden="true"
      class="pointer-events-none absolute bottom-0 left-0"
      :width="size"
      :height="size"
      style="z-index: 1"
    >
      <line :x1="0" :y1="size" :x2="size" :y2="0" :stroke="seam" stroke-width="1" />
    </svg>
    <svg
      aria-hidden="true"
      class="pointer-events-none absolute bottom-0 right-0"
      :width="size"
      :height="size"
      style="z-index: 1"
    >
      <line :x1="size" :y1="size" :x2="0" :y2="0" :stroke="seam" stroke-width="1" />
    </svg>
  </div>
</template>
