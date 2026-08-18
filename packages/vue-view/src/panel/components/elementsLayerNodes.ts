import {
  computed,
  defineComponent,
  h,
  onMounted,
  onUnmounted,
  ref,
  watch,
  type PropType,
  type VNode,
  type Component,
} from "vue";
import { useI18n } from "@arronqzy/i18n/vue";
import * as echarts from "echarts";
import type { PanelElement } from "../types";
import { buildChartOption, CHART_TYPES } from "../utils/chartOptionBuilder";
import { PREVIEW_LAYOUT_EVENT } from "../utils/panelStateIO";
import { cssTextLineHeight, cssTextAlignStyle } from "../utils/panelElementDefaults";
import TableNodeContent from "./table/TableNodeContent.vue";
import Scene3dNodeContent from "@arronqzy/view-scene3d/vue";

export { CHART_TYPES };

export function hasBackgroundImage(element: PanelElement) {
  const style = element.style ?? {};
  return Boolean(style.backgroundImage || style.backgroundImageRemoteUrl);
}

export function getNodeVisualStyle(element: PanelElement) {
  const style = element.style ?? {};
  return {
    backgroundColor: style.backgroundColor,
    backgroundImage: style.backgroundImage,
    backgroundSize: style.backgroundSize,
    backgroundPosition: style.backgroundPosition,
    borderWidth: style.borderWidth,
    borderStyle: style.borderStyle,
    borderColor: style.borderColor,
    borderRadius: style.borderRadius,
  };
}

export function getNodeAABB(element: PanelElement) {
  const rotate = ((element.rotate ?? 0) * Math.PI) / 180;
  const cos = Math.cos(rotate);
  const sin = Math.sin(rotate);
  const absCos = Math.abs(cos);
  const absSin = Math.abs(sin);
  const bboxWidth = element.width * absCos + element.height * absSin;
  const bboxHeight = element.width * absSin + element.height * absCos;
  const cx = element.x + element.width / 2;
  const cy = element.y + element.height / 2;
  return {
    left: cx - bboxWidth / 2,
    top: cy - bboxHeight / 2,
    right: cx + bboxWidth / 2,
    bottom: cy + bboxHeight / 2,
  };
}

export const TextNodeContent = defineComponent({
  name: "TextNodeContent",
  props: {
    element: { type: Object as PropType<PanelElement>, required: true },
    editable: { type: Boolean, default: false },
  },
  emits: ["change"],
  setup(p, { emit }) {
    const { t } = useI18n();
    const nodeRef = ref<HTMLDivElement | null>(null);
    const html = computed(
      () => p.element.textHtml ?? `<p>${t("panel.defaults.doubleClickTextHtml")}</p>`
    );
    const textStyle = computed(() => ({
      fontFamily: p.element.textFontFamily || undefined,
      fontSize: p.element.textFontSize ? `${p.element.textFontSize}px` : undefined,
      fontWeight: p.element.textFontWeight || undefined,
      color: p.element.textColor || undefined,
      lineHeight: cssTextLineHeight(p.element.textLineHeight),
      ...cssTextAlignStyle(p.element.textAlign),
    }));
    watch(
      html,
      (next) => {
        const el = nodeRef.value;
        if (!el || el.innerHTML === next) return;
        el.innerHTML = next;
      },
      { immediate: true }
    );
    return () =>
      h("div", {
        ref: nodeRef,
        "data-panel-user-text": "",
        class: "h-full w-full overflow-auto break-words p-2 outline-none",
        style: textStyle.value,
        contentEditable: p.editable,
        onInput: (e: Event) => emit("change", (e.currentTarget as HTMLDivElement).innerHTML),
        onBlur: (e: Event) => emit("change", (e.currentTarget as HTMLDivElement).innerHTML),
      });
  },
});

export const GridNodeContent = defineComponent({
  name: "GridNodeContent",
  props: {
    element: { type: Object as PropType<PanelElement>, required: true },
    allElements: { type: Array as PropType<PanelElement[]>, required: true },
    previewMode: { type: Boolean, default: false },
  },
  setup(p) {
    const { t } = useI18n();
    const rows = computed(() => Math.max(1, Math.floor(p.element.gridRows ?? 2)));
    const cols = computed(() => Math.max(1, Math.floor(p.element.gridCols ?? 3)));
    const gap = computed(() => Math.max(0, p.element.gridGap ?? 8));
    const padding = computed(() => Math.max(0, p.element.gridPadding ?? 10));
    const occupied = computed(() => {
      const set = new Set<number>();
      p.allElements.forEach((el) => {
        if (el.parentGridId !== p.element.id || el.layerId !== p.element.layerId) return;
        if (el.gridSlotIndex === undefined) return;
        const start = Math.max(0, Math.floor(el.gridSlotIndex));
        const baseRow = Math.floor(start / cols.value);
        const baseCol = start % cols.value;
        const rowSpan = Math.max(1, Math.min(rows.value - baseRow, Math.floor(el.gridRowSpan ?? 1)));
        const colSpan = Math.max(1, Math.min(cols.value - baseCol, Math.floor(el.gridColSpan ?? 1)));
        for (let r = baseRow; r < baseRow + rowSpan; r++) {
          for (let c = baseCol; c < baseCol + colSpan; c++) set.add(r * cols.value + c);
        }
      });
      return set;
    });
    return () => {
      if (p.previewMode) return h("div", { class: "relative h-full w-full" });
      const total = rows.value * cols.value;
      const emptyCount = total - occupied.value.size;
      const gridStyle = {
        display: "grid",
        gridTemplateColumns: `repeat(${cols.value}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows.value}, minmax(0, 1fr))`,
        gap: `${gap.value}px`,
        padding: `${padding.value}px`,
        boxSizing: "border-box" as const,
      };
      return h(
        "div",
        {
          class: "pointer-events-none relative h-full w-full overflow-hidden rounded-md",
          style:
            emptyCount > 0
              ? {
                  border: "2px dashed rgba(14, 165, 233, 0.7)",
                  background: "rgba(14, 165, 233, 0.08)",
                }
              : undefined,
        },
        [
          h(
            "div",
            { class: "h-full w-full", style: gridStyle },
            Array.from({ length: total }).map((_, idx) => {
              const filled = occupied.value.has(idx);
              return h(
                "div",
                {
                  key: idx,
                  class: filled
                    ? "pointer-events-none"
                    : "pointer-events-auto flex flex-col items-center justify-center gap-0.5 rounded-md text-[11px] font-semibold",
                  style: filled
                    ? undefined
                    : {
                        border: "2px dashed rgba(2, 132, 199, 0.85)",
                        background: "rgba(186, 230, 253, 0.72)",
                        color: "rgba(3, 105, 161, 0.95)",
                      },
                  title: filled
                    ? t("panel.config.slotOccupied", { n: idx + 1 })
                    : t("panel.config.slotEmpty", { n: idx + 1 }),
                },
                filled
                  ? null
                  : h("span", String(idx + 1))
              );
            })
          ),
          occupied.value.size === 0
            ? h(
                "div",
                {
                  class:
                    "pointer-events-none absolute bottom-1.5 left-0 right-0 text-center text-[11px] font-medium text-sky-800/90",
                },
                t("panel.config.gridDropHint")
              )
            : null,
        ]
      );
    };
  },
});

export const ChartNodeContent = defineComponent({
  name: "ChartNodeContent",
  props: {
    element: { type: Object as PropType<PanelElement>, required: true },
    previewLayoutKey: { type: Number, default: undefined },
    previewMode: { type: Boolean, default: false },
  },
  setup(p) {
    const hostRef = ref<HTMLDivElement | null>(null);
    const chartRef = ref<echarts.ECharts | null>(null);
    const rendererRef = ref<"canvas" | "svg">("canvas");
    const option = computed(() => buildChartOption(p.element));
    const renderer = computed(() => (p.element.chart?.renderMode ?? "canvas") as "canvas" | "svg");

    function resizeChart() {
      chartRef.value?.resize();
    }

    watch(
      [() => p.element.width, () => p.element.height, option, () => p.previewLayoutKey, renderer],
      () => {
        const host = hostRef.value;
        if (!host) return;
        if (!chartRef.value || rendererRef.value !== renderer.value) {
          chartRef.value?.dispose();
          chartRef.value = echarts.init(host, undefined, { renderer: renderer.value });
          rendererRef.value = renderer.value;
        }
        chartRef.value.setOption(option.value as echarts.EChartsOption, true);
        resizeChart();
      },
      { immediate: true, deep: true }
    );

    let cleanup: (() => void) | null = null;
    onMounted(() => {
      const host = hostRef.value;
      if (!host) return;
      const onLayout = () => resizeChart();
      window.addEventListener(PREVIEW_LAYOUT_EVENT, onLayout);
      const obs = new ResizeObserver(onLayout);
      obs.observe(host);
      cleanup = () => {
        window.removeEventListener(PREVIEW_LAYOUT_EVENT, onLayout);
        obs.disconnect();
      };
    });
    onUnmounted(() => {
      cleanup?.();
      chartRef.value?.dispose();
      chartRef.value = null;
    });

    return () =>
      h("div", {
        ref: hostRef,
        class: "h-full w-full",
        style: p.previewMode
          ? {
              width: Math.max(1, p.element.width),
              height: Math.max(1, p.element.height),
              minWidth: 1,
              minHeight: 1,
            }
          : undefined,
      });
  },
});

export const AudioNodeContent = defineComponent({
  name: "AudioNodeContent",
  props: {
    element: { type: Object as PropType<PanelElement>, required: true },
    selected: { type: Boolean, default: false },
  },
  setup(p) {
    const { t } = useI18n();
    const audioRef = ref<HTMLAudioElement | null>(null);
    const playing = ref(false);
    const src = computed(() => p.element.audioSrc || p.element.audioRemoteUrl || "");
    const poster = computed(() => p.element.audioPosterImage);
    const iconPreset = computed(() => p.element.audioIconPreset);
    const iconMode = computed(() => Boolean(poster.value || iconPreset.value));
    const visualEffect = computed(() => p.element.audioVisualEffect ?? "pulse");
    const visualSpeed = computed(() => p.element.audioVisualSpeed ?? "normal");
    const speedMs = computed(() =>
      visualSpeed.value === "fast" ? 900 : visualSpeed.value === "slow" ? 1800 : 1300
    );
    const shouldAnimate = computed(
      () => Boolean(src.value) && playing.value && visualEffect.value !== "none"
    );

    onMounted(() => {
      const el = audioRef.value;
      if (!el) return;
      const onPlay = () => (playing.value = true);
      const onPause = () => (playing.value = false);
      const onEnded = () => (playing.value = false);
      el.addEventListener("play", onPlay);
      el.addEventListener("pause", onPause);
      el.addEventListener("ended", onEnded);
      onUnmounted(() => {
        el.removeEventListener("play", onPlay);
        el.removeEventListener("pause", onPause);
        el.removeEventListener("ended", onEnded);
      });
    });

    watch(
      () => [p.selected, p.element.mediaAutoPauseOnEdit] as const,
      () => {
        if (!p.selected || p.element.mediaAutoPauseOnEdit === false) return;
        const el = audioRef.value;
        if (el && !el.paused) el.pause();
      }
    );

    function togglePlay(e: Event) {
      e.stopPropagation();
      if (!src.value) return;
      const el = audioRef.value;
      if (!el) return;
      if (el.paused) void el.play();
      else el.pause();
    }

    function renderIcon() {
      const common = "h-8 w-8 text-foreground/90";
      const preset = iconPreset.value;
      if (preset === "music") {
        return h("svg", { viewBox: "0 0 24 24", class: common, fill: "none", stroke: "currentColor", "stroke-width": "1.8" }, [
          h("path", { d: "M9 18a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm11-2a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" }),
          h("path", { d: "M9 18V7l11-2v11" }),
        ]);
      }
      if (preset === "headphone") {
        return h("svg", { viewBox: "0 0 24 24", class: common, fill: "none", stroke: "currentColor", "stroke-width": "1.8" }, [
          h("path", { d: "M4 12a8 8 0 1 1 16 0" }),
          h("rect", { x: "3", y: "12", width: "4", height: "7", rx: "2" }),
          h("rect", { x: "17", y: "12", width: "4", height: "7", rx: "2" }),
        ]);
      }
      if (preset === "wave") {
        return h("svg", { viewBox: "0 0 24 24", class: common, fill: "none", stroke: "currentColor", "stroke-width": "1.8" }, [
          h("path", { d: "M4 14v-4M8 17V7M12 20V4M16 17V7M20 14v-4" }),
        ]);
      }
      return h("svg", { viewBox: "0 0 24 24", class: common, fill: "none", stroke: "currentColor", "stroke-width": "1.8" }, [
        h("path", { d: "M11 5 6 9H3v6h3l5 4V5Z" }),
        h("path", { d: "M15 9a4 4 0 0 1 0 6" }),
        h("path", { d: "M17.5 6.5a7 7 0 0 1 0 11" }),
      ]);
    }

    return () => {
      if (iconMode.value) {
        return h(
          "div",
          {
            class: [
              "relative flex h-full w-full items-center justify-center overflow-hidden rounded border border-border/60 bg-muted/10",
              shouldAnimate.value && visualEffect.value === "pulse"
                ? "animate-pulse ring-2 ring-primary/50"
                : "",
            ].join(" "),
            style:
              shouldAnimate.value && visualEffect.value === "pulse"
                ? { animationDuration: `${speedMs.value}ms` }
                : undefined,
          },
          [
            poster.value
              ? h(
                  "button",
                  {
                    type: "button",
                    class: "h-full w-full",
                    onMousedown: (e: Event) => e.stopPropagation(),
                    onPointerdown: (e: Event) => e.stopPropagation(),
                    onClick: togglePlay,
                    title: !src.value ? t("panel.config.configureAudioFirst") : playing.value ? t("panel.config.clickPause") : t("panel.config.clickPlay"),
                  },
                  [
                    h("img", {
                      src: poster.value,
                      alt: t("panel.config.audioPoster"),
                      class: "h-full w-full object-cover",
                      draggable: false,
                      onDragstart: (e: Event) => e.preventDefault(),
                    }),
                  ]
                )
              : h(
                  "button",
                  {
                    type: "button",
                    class: "flex h-full w-full items-center justify-center",
                    onMousedown: (e: Event) => e.stopPropagation(),
                    onPointerdown: (e: Event) => e.stopPropagation(),
                    onClick: togglePlay,
                    title: !src.value ? t("panel.config.configureAudioFirst") : playing.value ? t("panel.config.clickPause") : t("panel.config.clickPlay"),
                  },
                  [renderIcon()]
                ),
            shouldAnimate.value && visualEffect.value === "ripple"
              ? [
                  h("span", {
                    class:
                      "pointer-events-none absolute h-16 w-16 rounded-full border border-primary/70 animate-ping",
                    style: { animationDuration: `${speedMs.value}ms` },
                  }),
                  h("span", {
                    class:
                      "pointer-events-none absolute h-24 w-24 rounded-full border border-primary/40 animate-ping",
                    style: {
                      animationDuration: `${speedMs.value}ms`,
                      animationDelay: `${Math.round(speedMs.value / 3)}ms`,
                    },
                  }),
                ]
              : null,
            h(
              "span",
              {
                class:
                  "pointer-events-none absolute right-2 top-2 rounded bg-black/55 px-1.5 py-0.5 text-[10px] text-white",
              },
              !src.value ? t("panel.config.audioNotConfigured") : playing.value ? t("panel.config.pause") : t("panel.config.play")
            ),
            h("audio", { ref: audioRef, src: src.value, preload: "metadata", class: "hidden" }),
          ]
        );
      }
      if (!src.value) {
        return h(
          "div",
          {
            class:
              "flex h-full w-full items-center justify-center rounded border border-dashed border-border/70 bg-muted/15 px-2 text-[11px] text-muted-foreground",
          },
          t("panel.config.audioPlaceholder")
        );
      }
      return h("div", { class: "relative flex h-full w-full items-center justify-center rounded border border-border/60 bg-muted/10 px-2" }, [
        h("div", { class: "pointer-events-none text-[11px] text-muted-foreground" }, playing.value ? t("panel.config.audioPlaying") : t("panel.config.audioReady")),
        h(
          "button",
          {
            type: "button",
            class: "absolute right-2 top-2 rounded bg-black/55 px-1.5 py-0.5 text-[10px] text-white",
            onMousedown: (e: Event) => e.stopPropagation(),
            onPointerdown: (e: Event) => e.stopPropagation(),
            onClick: togglePlay,
            title: playing.value ? t("panel.config.clickPause") : t("panel.config.clickPlay"),
          },
          playing.value ? t("panel.config.pause") : t("panel.config.play")
        ),
        h("audio", { ref: audioRef, src: src.value, preload: "metadata", class: "hidden" }),
      ]);
    };
  },
});

export const VideoNodeContent = defineComponent({
  name: "VideoNodeContent",
  props: {
    element: { type: Object as PropType<PanelElement>, required: true },
    selected: { type: Boolean, default: false },
  },
  setup(p) {
    const { t } = useI18n();
    const videoRef = ref<HTMLVideoElement | null>(null);
    const playing = ref(false);
    const src = computed(() => p.element.videoSrc || p.element.videoRemoteUrl || "");

    onMounted(() => {
      const el = videoRef.value;
      if (!el) return;
      const onPlay = () => (playing.value = true);
      const onPause = () => (playing.value = false);
      const onEnded = () => (playing.value = false);
      el.addEventListener("play", onPlay);
      el.addEventListener("pause", onPause);
      el.addEventListener("ended", onEnded);
      onUnmounted(() => {
        el.removeEventListener("play", onPlay);
        el.removeEventListener("pause", onPause);
        el.removeEventListener("ended", onEnded);
      });
    });

    watch(
      () => [p.selected, p.element.mediaAutoPauseOnEdit] as const,
      () => {
        if (!p.selected || p.element.mediaAutoPauseOnEdit === false) return;
        const el = videoRef.value;
        if (el && !el.paused) el.pause();
      }
    );

    function togglePlay(e: Event) {
      e.stopPropagation();
      const el = videoRef.value;
      if (!el) return;
      if (el.paused) void el.play();
      else el.pause();
    }

    return () => {
      if (!src.value) {
        return h(
          "div",
          {
            class:
              "flex h-full w-full items-center justify-center rounded border border-dashed border-border/70 bg-muted/15 px-2 text-[11px] text-muted-foreground",
          },
          t("panel.config.videoPlaceholder")
        );
      }
      return h("div", { class: "relative h-full w-full p-1" }, [
        h("video", {
          ref: videoRef,
          src: src.value,
          class: "h-full w-full rounded object-contain pointer-events-none",
        }),
        h(
          "button",
          {
            type: "button",
            class: "absolute right-2 top-2 rounded bg-black/55 px-1.5 py-0.5 text-[10px] text-white",
            onMousedown: (e: Event) => e.stopPropagation(),
            onPointerdown: (e: Event) => e.stopPropagation(),
            onClick: togglePlay,
            title: playing.value ? t("panel.config.clickPause") : t("panel.config.clickPlay"),
          },
          playing.value ? t("panel.config.pause") : t("panel.config.play")
        ),
      ]);
    };
  },
});

export const GeometryNodeContent = defineComponent({
  name: "GeometryNodeContent",
  props: {
    element: { type: Object as PropType<PanelElement>, required: true },
  },
  setup(p) {
    const canvasRef = ref<HTMLCanvasElement | null>(null);
    const elementRef = ref(p.element);
    elementRef.value = p.element;
    watch(
      () => p.element,
      (next) => {
        elementRef.value = next;
      }
    );

    const shape = computed(() => p.element.geometryShape ?? "rect");
    const color = computed(() => p.element.geometryColor ?? "#3b82f6");
    const script = computed(() => p.element.geometryScript ?? "");
    const sketch = computed(() => p.element.geometrySketchDataUrl ?? "");

    function drawCanvas() {
      const canvas = canvasRef.value;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const width = Math.max(1, canvas.clientWidth);
      const height = Math.max(1, canvas.clientHeight);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const drawShapePath = () => {
        const cx = width / 2;
        const cy = height / 2;
        const r = Math.max(10, Math.min(width, height) * 0.42);
        ctx.beginPath();
        const s = shape.value;
        if (s === "circle") {
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
        } else if (s === "triangle") {
          ctx.moveTo(cx, cy - r);
          ctx.lineTo(cx + r * 0.9, cy + r * 0.8);
          ctx.lineTo(cx - r * 0.9, cy + r * 0.8);
          ctx.closePath();
        } else if (s === "diamond") {
          ctx.moveTo(cx, cy - r);
          ctx.lineTo(cx + r, cy);
          ctx.lineTo(cx, cy + r);
          ctx.lineTo(cx - r, cy);
          ctx.closePath();
        } else if (s === "hexagon") {
          for (let i = 0; i < 6; i += 1) {
            const a = (Math.PI / 3) * i - Math.PI / 6;
            const x = cx + r * Math.cos(a);
            const y = cy + r * Math.sin(a);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
        } else if (s === "star") {
          const inner = r * 0.45;
          for (let i = 0; i < 10; i += 1) {
            const rr = i % 2 === 0 ? r : inner;
            const a = (Math.PI / 5) * i - Math.PI / 2;
            const x = cx + rr * Math.cos(a);
            const y = cy + rr * Math.sin(a);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
        } else if (s === "heart") {
          const top = cy - r * 0.2;
          ctx.moveTo(cx, cy + r * 0.9);
          ctx.bezierCurveTo(cx - r * 1.2, cy + r * 0.25, cx - r * 0.9, top - r * 0.8, cx, top);
          ctx.bezierCurveTo(cx + r * 0.9, top - r * 0.8, cx + r * 1.2, cy + r * 0.25, cx, cy + r * 0.9);
          ctx.closePath();
        } else {
          const rr = Math.max(4, Math.min(width, height) * 0.08);
          const x = width * 0.08;
          const y = height * 0.08;
          const w = width * 0.84;
          const hh = height * 0.84;
          ctx.moveTo(x + rr, y);
          ctx.lineTo(x + w - rr, y);
          ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
          ctx.lineTo(x + w, y + hh - rr);
          ctx.quadraticCurveTo(x + w, y + hh, x + w - rr, y + hh);
          ctx.lineTo(x + rr, y + hh);
          ctx.quadraticCurveTo(x, y + hh, x, y + hh - rr);
          ctx.lineTo(x, y + rr);
          ctx.quadraticCurveTo(x, y, x + rr, y);
          ctx.closePath();
        }
      };

      drawShapePath();
      ctx.fillStyle = color.value;
      ctx.fill();

      if (sketch.value) {
        const img = new Image();
        img.onload = () => {
          ctx.save();
          drawShapePath();
          ctx.clip();
          ctx.drawImage(img, 0, 0, width, height);
          ctx.restore();
        };
        img.src = sketch.value;
      }

      if (script.value.trim()) {
        try {
          const fn = new Function("ctx", "width", "height", "element", script.value);
          fn(ctx, width, height, elementRef.value);
        } catch {
          // ignore invalid script
        }
      }
    }

    watch([canvasRef, shape, color, script, sketch], drawCanvas, { immediate: true, flush: "post" });

    let resizeObserver: ResizeObserver | null = null;
    onMounted(() => {
      const canvas = canvasRef.value;
      if (!canvas) return;
      resizeObserver = new ResizeObserver(drawCanvas);
      resizeObserver.observe(canvas);
    });
    onUnmounted(() => resizeObserver?.disconnect());

    return () => h("canvas", { ref: canvasRef, class: "h-full w-full" });
  },
});

export const ReferenceNodeContent = defineComponent({
  name: "ReferenceNodeContent",
  props: {
    element: { type: Object as PropType<PanelElement>, required: true },
    allElements: { type: Array as PropType<PanelElement[]>, required: true },
    snapshotSource: { type: Array as PropType<PanelElement[]>, default: undefined },
    visitedIds: { type: Array as PropType<string[]>, default: () => [] },
    previewLayoutKey: { type: Number, default: undefined },
    previewMode: { type: Boolean, default: false },
  },
  setup(p) {
    const { t } = useI18n();
    const sourceNodes = computed(() => {
      const fromDeep =
        p.element.refCopyMode === "deep"
          ? p.element.refSnapshot ?? p.snapshotSource ?? []
          : null;
      const base = fromDeep ?? p.allElements.filter((n) => n.layerId === p.element.refLayerId);
      return base.filter((n) => n.id !== p.element.id && !p.visitedIds.includes(n.id));
    });

    const layout = computed(() => {
      if (sourceNodes.value.length === 0) return null;
      const boxes = sourceNodes.value.map(getNodeAABB);
      const minX = Math.min(...boxes.map((b) => b.left));
      const minY = Math.min(...boxes.map((b) => b.top));
      const maxX = Math.max(...boxes.map((b) => b.right));
      const maxY = Math.max(...boxes.map((b) => b.bottom));
      const sourceWidth = Math.max(1, maxX - minX);
      const sourceHeight = Math.max(1, maxY - minY);
      const innerW = Math.max(1, p.element.width);
      const innerH = Math.max(1, p.element.height);
      const scale = Math.max(0.05, Math.min(innerW / sourceWidth, innerH / sourceHeight));
      const mappedW = sourceWidth * scale;
      const mappedH = sourceHeight * scale;
      return {
        minX,
        minY,
        scale,
        offsetX: (innerW - mappedW) / 2,
        offsetY: (innerH - mappedH) / 2,
      };
    });

    return () => {
      if (!layout.value || sourceNodes.value.length === 0) {
        const hintText = p.element.refLayerId ? t("panel.config.refLayerEmpty") : t("panel.config.selectRefLayer");
        return h("div", { class: "flex h-full w-full items-center justify-center" }, [
          h(
            "div",
            {
              class:
                "rounded border border-dashed border-border/70 px-2 py-1 text-[10px] text-muted-foreground",
            },
            hintText
          ),
        ]);
      }

      return h("div", { class: "pointer-events-none relative h-full w-full overflow-hidden" }, [
        ...sourceNodes.value.map((node) => {
          const box = getNodeAABB(node);
          const left = layout.value!.offsetX + (box.left - layout.value!.minX) * layout.value!.scale;
          const top = layout.value!.offsetY + (box.top - layout.value!.minY) * layout.value!.scale;
          const width = Math.max(12, node.width * layout.value!.scale);
          const height = Math.max(10, node.height * layout.value!.scale);
          const boxWidth = Math.max(12, (box.right - box.left) * layout.value!.scale);
          const boxHeight = Math.max(10, (box.bottom - box.top) * layout.value!.scale);
          return h(
            "div",
            {
              key: node.id,
              class: "absolute overflow-visible",
              style: { left, top, width: boxWidth, height: boxHeight },
            },
            [
              h(
                "div",
                {
                  class: "absolute",
                  style: {
                    left: (boxWidth - width) / 2,
                    top: (boxHeight - height) / 2,
                    width,
                    height,
                    transform: `rotate(${node.rotate ?? 0}deg)`,
                    transformOrigin: "center center",
                    ...getNodeVisualStyle(node),
                  },
                },
                [
                  CHART_TYPES.has(node.materialType ?? "")
                    ? h(ChartNodeContent, {
                        element: node,
                        previewLayoutKey: p.previewLayoutKey,
                        previewMode: p.previewMode,
                      })
                    : node.materialType === "reference"
                      ? h(ReferenceNodeContent as Component, {
                          element: node,
                          allElements: p.allElements,
                          snapshotSource: node.refSnapshot,
                          visitedIds: [...p.visitedIds, p.element.id],
                          previewLayoutKey: p.previewLayoutKey,
                          previewMode: p.previewMode,
                        })
                      : node.materialType === "geometry"
                        ? h(GeometryNodeContent, { element: node })
                        : node.materialType === "scene3d"
                          ? h(Scene3dNodeContent, {
                              config: node.scene3d,
                              previewMode: p.previewMode,
                            })
                        : node.materialType === "table"
                          ? h(TableNodeContent, { element: node })
                          : h("div", { class: "h-full w-full" }),
                ]
              ),
            ]
          );
        }),
      ]);
    };
  },
}) as Component;

export const ImageNodeContent = defineComponent({
  name: "ImageNodeContent",
  props: {
    element: { type: Object as PropType<PanelElement>, required: true },
  },
  setup(p) {
    const { t } = useI18n();
    return () => {
      if (hasBackgroundImage(p.element)) return null;
      return h(
        "div",
        {
          class:
            "flex h-full w-full items-center justify-center rounded border border-dashed border-border/70 bg-muted/15 px-2 text-[11px] text-muted-foreground",
        },
        t("panel.config.imagePlaceholder")
      );
    };
  },
});

export const EmptyNodePlaceholder = defineComponent({
  name: "EmptyNodePlaceholder",
  props: {
    element: { type: Object as PropType<PanelElement>, required: true },
  },
  setup(p) {
    const { t } = useI18n();
    return () => {
      const labelMap: Record<string, string> = { video: t("panel.config.videoPlaceholder"), audio: t("panel.config.audioPlaceholder") };
      const label =
        labelMap[p.element.materialType ?? ""] ??
        t("panel.config.materialPlaceholder", {
          type: p.element.materialType ?? t("common.node"),
        });
      return h(
        "div",
        {
          class:
            "flex h-full w-full items-center justify-center rounded border border-dashed border-border/70 bg-muted/15 px-2 text-[11px] text-muted-foreground",
        },
        label
      );
    };
  },
});
