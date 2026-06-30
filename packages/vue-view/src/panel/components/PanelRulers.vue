<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { PanelRuler } from "../lib/panel-ruler-canvas";
import { PANEL_Z_INDEX } from "../constants/zIndex";

const RULER_WORLD_UNIT = 100;
const RULER_SEGMENT = 10;

const props = withDefaults(
  defineProps<{
    zoomX: number;
    zoomY: number;
    scrollLeft: number;
    scrollTop: number;
    size?: number;
  }>(),
  { size: 32 }
);

const isDark = ref(false);
const topHRef = ref<HTMLElement | null>(null);
const leftVRef = ref<HTMLElement | null>(null);
const bottomHRef = ref<HTMLElement | null>(null);
const rightVRef = ref<HTMLElement | null>(null);

let rulers: Array<{ ruler: PanelRuler; axis: "h" | "v" }> = [];

const rulerScrollLeft = computed(() => props.scrollLeft + props.size);
const rulerScrollTop = computed(() => props.scrollTop + props.size);

const horizontalOptions = computed(() => ({
  type: "horizontal" as const,
  zoom: props.zoomX,
  unit: RULER_WORLD_UNIT,
  segment: RULER_SEGMENT,
  backgroundColor: isDark.value ? "rgba(15,23,42,0.98)" : "rgba(255,255,255,0.98)",
  lineColor: isDark.value ? "rgba(226,232,240,0.4)" : "rgba(15,23,42,0.22)",
  textColor: isDark.value ? "rgba(248,250,252,0.95)" : "rgba(15,23,42,0.75)",
  font: "10px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
  longLineSize: 8,
  shortLineSize: 4,
}));

const verticalOptions = computed(() => ({
  type: "vertical" as const,
  zoom: props.zoomY,
  unit: RULER_WORLD_UNIT,
  segment: RULER_SEGMENT,
  backgroundColor: isDark.value ? "rgba(15,23,42,0.98)" : "rgba(255,255,255,0.98)",
  lineColor: isDark.value ? "rgba(226,232,240,0.4)" : "rgba(15,23,42,0.22)",
  textColor: isDark.value ? "rgba(248,250,252,0.95)" : "rgba(15,23,42,0.75)",
  font: "10px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
  longLineSize: 8,
  shortLineSize: 4,
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
      backgroundColor: opts.backgroundColor,
      lineColor: opts.lineColor,
      textColor: opts.textColor,
    });
  }
  syncScroll();
}

let themeObserver: MutationObserver | null = null;

onMounted(() => {
  const root = document.documentElement;
  const update = () => {
    isDark.value = root.classList.contains("dark");
  };
  update();
  themeObserver = new MutationObserver(update);
  themeObserver.observe(root, { attributes: true, attributeFilter: ["class"] });
  initRulers();
  window.addEventListener("resize", initRulers);
});

onUnmounted(() => {
  themeObserver?.disconnect();
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

watch([topHRef, leftVRef, bottomHRef, rightVRef], () => {
  if (!topHRef.value || !leftVRef.value || !bottomHRef.value || !rightVRef.value) return;
  if (rulers.length === 0) initRulers();
});
</script>

<template>
  <div
    class="pointer-events-none absolute inset-0 isolate"
    :style="{
      '--rv-ruler-size': `${size}px`,
      zIndex: PANEL_Z_INDEX.ruler,
    }"
  >
    <div
      class="absolute left-[var(--rv-ruler-size)] right-[var(--rv-ruler-size)] top-0 h-[var(--rv-ruler-size)] overflow-visible"
    >
      <div ref="topHRef" class="h-full w-full" />
    </div>
    <div
      class="absolute left-0 top-[var(--rv-ruler-size)] bottom-[var(--rv-ruler-size)] w-[var(--rv-ruler-size)] overflow-visible"
    >
      <div ref="leftVRef" class="h-full w-full" />
    </div>
    <div
      class="absolute left-[var(--rv-ruler-size)] right-[var(--rv-ruler-size)] bottom-0 h-[var(--rv-ruler-size)] overflow-visible"
    >
      <div ref="bottomHRef" class="h-full w-full" />
    </div>
    <div
      class="absolute right-0 top-[var(--rv-ruler-size)] bottom-[var(--rv-ruler-size)] w-[var(--rv-ruler-size)] overflow-visible"
    >
      <div ref="rightVRef" class="h-full w-full" />
    </div>
    <div
      class="absolute left-0 top-0 h-[var(--rv-ruler-size)] w-[var(--rv-ruler-size)] border-b border-r border-border bg-background"
    />
    <div
      class="absolute right-0 top-0 h-[var(--rv-ruler-size)] w-[var(--rv-ruler-size)] border-b border-l border-border bg-background"
    />
    <div
      class="absolute left-0 bottom-0 h-[var(--rv-ruler-size)] w-[var(--rv-ruler-size)] border-r border-t border-border bg-background"
    />
    <div
      class="absolute right-0 bottom-0 h-[var(--rv-ruler-size)] w-[var(--rv-ruler-size)] border-l border-t border-border bg-background"
    />
  </div>
</template>
