import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@arronqzy/i18n/react";
import * as echarts from "echarts";
import type { PanelElement } from "../types";
import { buildChartOption, CHART_TYPES } from "../utils/chartOptionBuilder";
import { PREVIEW_LAYOUT_EVENT } from "../utils/panelStateIO";

export type ElementsLayerProps = {
  elements: PanelElement[];
  allElements: PanelElement[];
  selectedIds: string[];
  onSelectIds: (ids: string[]) => void;
  updateElement: (
    id: string,
    patch: Partial<PanelElement>,
    options?: { batchId?: string; meta?: Record<string, unknown> }
  ) => void;
  layerLocked?: boolean;
  /** 在线预览模式：隐藏网格编辑占位等辅助 UI */
  previewMode?: boolean;
  /** 预览布局变更时递增，用于触发图表/画布重绘 */
  previewLayoutKey?: number;
};

function TextNodeContent({
  element,
  editable,
  onChange,
}: {
  element: PanelElement;
  editable: boolean;
  onChange: (nextHtml: string) => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { t } = useI18n();
  const html = element.textHtml ?? `<p>${t("panel.defaults.doubleClickTextHtml")}</p>`;
  const textStyle: React.CSSProperties = {
    fontFamily: element.textFontFamily || undefined,
    fontSize: element.textFontSize ? `${element.textFontSize}px` : undefined,
    fontWeight: element.textFontWeight || undefined,
    color: element.textColor || undefined,
    lineHeight: element.textLineHeight ? String(element.textLineHeight) : undefined,
    textAlign: element.textAlign ?? "left",
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.innerHTML !== html) {
      el.innerHTML = html;
    }
  }, [html]);

  return (
    <div
      ref={ref}
      className="h-full w-full overflow-auto break-words p-2 text-sm leading-relaxed outline-none"
      style={textStyle}
      contentEditable={editable}
      suppressContentEditableWarning
      onInput={(e) => onChange((e.currentTarget as HTMLDivElement).innerHTML)}
      onBlur={(e) => onChange((e.currentTarget as HTMLDivElement).innerHTML)}
    />
  );
}

function GridNodeContent({
  element,
  allElements,
  previewMode = false,
}: {
  element: PanelElement;
  allElements: PanelElement[];
  previewMode?: boolean;
}) {
  const { t } = useI18n();
  const rows = Math.max(1, Math.floor(element.gridRows ?? 2));
  const cols = Math.max(1, Math.floor(element.gridCols ?? 3));
  const gap = Math.max(0, element.gridGap ?? 8);
  const padding = Math.max(0, element.gridPadding ?? 10);
  const occupied = useMemo(() => {
    const set = new Set<number>();
    allElements.forEach((el) => {
      if (el.parentGridId !== element.id) return;
      if (el.layerId !== element.layerId) return;
      if (el.gridSlotIndex === undefined) return;
      const start = Math.max(0, Math.floor(el.gridSlotIndex));
      const baseRow = Math.floor(start / cols);
      const baseCol = start % cols;
      const rowSpan = Math.max(1, Math.min(rows - baseRow, Math.floor(el.gridRowSpan ?? 1)));
      const colSpan = Math.max(1, Math.min(cols - baseCol, Math.floor(el.gridColSpan ?? 1)));
      for (let r = baseRow; r < baseRow + rowSpan; r++) {
        for (let c = baseCol; c < baseCol + colSpan; c++) {
          set.add(r * cols + c);
        }
      }
    });
    return set;
  }, [allElements, cols, element.id, element.layerId, rows]);
  const occupiedBlocks = useMemo(() => {
    return allElements
      .filter(
        (el) =>
          el.parentGridId === element.id &&
          el.layerId === element.layerId &&
          el.gridSlotIndex !== undefined
      )
      .map((el) => {
        const start = Math.max(0, Math.floor(el.gridSlotIndex ?? 0));
        const baseRow = Math.floor(start / cols);
        const baseCol = start % cols;
        const rowSpan = Math.max(1, Math.min(rows - baseRow, Math.floor(el.gridRowSpan ?? 1)));
        const colSpan = Math.max(1, Math.min(cols - baseCol, Math.floor(el.gridColSpan ?? 1)));
        return {
          id: el.id,
          rowStart: baseRow + 1,
          rowEnd: baseRow + rowSpan + 1,
          colStart: baseCol + 1,
          colEnd: baseCol + colSpan + 1,
        };
      });
  }, [allElements, cols, element.id, element.layerId, rows]);
  if (previewMode) {
    return <div className="relative h-full w-full" />;
  }
  return (
    <div className="relative h-full w-full">
      <div
        className="h-full w-full"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          gap: `${gap}px`,
          padding: `${padding}px`,
          boxSizing: "border-box",
        }}
      >
        {Array.from({ length: rows * cols }).map((_, idx) => (
          <div
            key={idx}
            className={[
              "rounded border border-dashed",
              occupied.has(idx)
                ? "border-primary/70 bg-primary/10"
                : "border-border/60 bg-muted/20",
            ].join(" ")}
            title={occupied.has(idx) ? t("panel.config.slotOccupied", { n: idx + 1 }) : t("panel.config.slotEmpty", { n: idx + 1 })}
          />
        ))}
      </div>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          gap: `${gap}px`,
          padding: `${padding}px`,
          boxSizing: "border-box",
        }}
      >
        {occupiedBlocks.map((block) => (
          <div
            key={block.id}
            className="rounded border border-primary/70 bg-primary/20"
            style={{
              gridColumn: `${block.colStart} / ${block.colEnd}`,
              gridRow: `${block.rowStart} / ${block.rowEnd}`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function AudioNodeContent({
  element,
  selected = false,
}: {
  element: PanelElement;
  selected?: boolean;
}) {
  const { t } = useI18n();
  const src = element.audioSrc || element.audioRemoteUrl || "";
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const poster = element.audioPosterImage;
  const iconPreset = element.audioIconPreset;
  const iconMode = Boolean(poster || iconPreset);
  const visualEffect = element.audioVisualEffect ?? "pulse";
  const visualSpeed = element.audioVisualSpeed ?? "normal";
  const speedMs = visualSpeed === "fast" ? 900 : visualSpeed === "slow" ? 1800 : 1300;
  const shouldAnimate = Boolean(src) && playing && visualEffect !== "none";
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => setPlaying(false);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnded);
    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnded);
    };
  }, []);
  useEffect(() => {
    if (!selected || element.mediaAutoPauseOnEdit === false) return;
    const el = audioRef.current;
    if (!el) return;
    if (!el.paused) el.pause();
  }, [selected, element.mediaAutoPauseOnEdit]);
  const renderIcon = () => {
    const common = "h-8 w-8 text-foreground/90";
    switch (iconPreset) {
      case "music":
        return (
          <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M9 18a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm11-2a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" />
            <path d="M9 18V7l11-2v11" />
          </svg>
        );
      case "headphone":
        return (
          <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 12a8 8 0 1 1 16 0" />
            <rect x="3" y="12" width="4" height="7" rx="2" />
            <rect x="17" y="12" width="4" height="7" rx="2" />
          </svg>
        );
      case "wave":
        return (
          <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 14v-4M8 17V7M12 20V4M16 17V7M20 14v-4" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M11 5 6 9H3v6h3l5 4V5Z" />
            <path d="M15 9a4 4 0 0 1 0 6" />
            <path d="M17.5 6.5a7 7 0 0 1 0 11" />
          </svg>
        );
    }
  };
  if (iconMode) {
    return (
      <div
        className={[
          "relative flex h-full w-full items-center justify-center overflow-hidden rounded border border-border/60 bg-muted/10",
          shouldAnimate && visualEffect === "pulse" ? "animate-pulse ring-2 ring-primary/50" : "",
        ].join(" ")}
        style={shouldAnimate && visualEffect === "pulse" ? { animationDuration: `${speedMs}ms` } : undefined}
      >
        {poster ? (
          <button
            type="button"
            className="h-full w-full"
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => {
              if (!src) return;
              const el = audioRef.current;
              if (!el) return;
              if (el.paused) {
                void el.play();
              } else {
                el.pause();
              }
            }}
            title={!src ? t("panel.config.configureAudioFirst") : playing ? t("panel.config.clickPause") : t("panel.config.clickPlay")}
          >
            <img
              src={poster}
              alt={t("panel.config.audioPoster")}
              className="h-full w-full object-cover"
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
            />
          </button>
        ) : (
          <button
            type="button"
            className="flex h-full w-full items-center justify-center"
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => {
              if (!src) return;
              const el = audioRef.current;
              if (!el) return;
              if (el.paused) {
                void el.play();
              } else {
                el.pause();
              }
            }}
            title={!src ? t("panel.config.configureAudioFirst") : playing ? t("panel.config.clickPause") : t("panel.config.clickPlay")}
          >
            {renderIcon()}
          </button>
        )}
        {shouldAnimate && visualEffect === "ripple" ? (
          <>
            <span
              className="pointer-events-none absolute h-16 w-16 rounded-full border border-primary/70 animate-ping"
              style={{ animationDuration: `${speedMs}ms` }}
            />
            <span
              className="pointer-events-none absolute h-24 w-24 rounded-full border border-primary/40 animate-ping"
              style={{ animationDuration: `${speedMs}ms`, animationDelay: `${Math.round(speedMs / 3)}ms` }}
            />
          </>
        ) : null}
        <span className="pointer-events-none absolute right-2 top-2 rounded bg-black/55 px-1.5 py-0.5 text-[10px] text-white">
          {!src ? t("panel.config.audioNotConfigured") : playing ? t("panel.config.pause") : t("panel.config.play")}
        </span>
        <audio ref={audioRef} src={src} preload="metadata" className="hidden" />
      </div>
    );
  }
  if (!src) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded border border-dashed border-border/70 bg-muted/15 px-2 text-[11px] text-muted-foreground">
        {t("panel.config.audioPlaceholder")}
      </div>
    );
  }
  return (
    <div className="relative flex h-full w-full items-center justify-center rounded border border-border/60 bg-muted/10 px-2">
      <div className="pointer-events-none text-[11px] text-muted-foreground">
        {playing ? t("panel.config.audioPlaying") : t("panel.config.audioReady")}
      </div>
      <button
        type="button"
        className="absolute right-2 top-2 rounded bg-black/55 px-1.5 py-0.5 text-[10px] text-white"
        onMouseDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => {
          const el = audioRef.current;
          if (!el) return;
          if (el.paused) {
            void el.play();
          } else {
            el.pause();
          }
        }}
        title={playing ? t("panel.config.clickPause") : t("panel.config.clickPlay")}
      >
        {playing ? t("panel.config.pause") : t("panel.config.play")}
      </button>
      <audio ref={audioRef} src={src} preload="metadata" className="hidden" />
    </div>
  );
}

function VideoNodeContent({
  element,
  selected = false,
}: {
  element: PanelElement;
  selected?: boolean;
}) {
  const { t } = useI18n();
  const src = element.videoSrc || element.videoRemoteUrl || "";
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => setPlaying(false);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnded);
    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnded);
    };
  }, []);
  useEffect(() => {
    if (!selected || element.mediaAutoPauseOnEdit === false) return;
    const el = videoRef.current;
    if (!el) return;
    if (!el.paused) el.pause();
  }, [selected, element.mediaAutoPauseOnEdit]);
  if (!src) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded border border-dashed border-border/70 bg-muted/15 px-2 text-[11px] text-muted-foreground">
        {t("panel.config.videoPlaceholder")}
      </div>
    );
  }
  return (
    <div className="relative h-full w-full p-1">
      <video ref={videoRef} src={src} className="h-full w-full rounded object-contain pointer-events-none" />
      <button
        type="button"
        className="absolute right-2 top-2 rounded bg-black/55 px-1.5 py-0.5 text-[10px] text-white"
        onMouseDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => {
          const el = videoRef.current;
          if (!el) return;
          if (el.paused) {
            void el.play();
          } else {
            el.pause();
          }
        }}
        title={playing ? t("panel.config.clickPause") : t("panel.config.clickPlay")}
      >
        {playing ? t("panel.config.pause") : t("panel.config.play")}
      </button>
    </div>
  );
}

function hasBackgroundImage(element: PanelElement) {
  const style = element.style ?? {};
  return Boolean(style.backgroundImage || style.backgroundImageRemoteUrl);
}

function ImageNodeContent({ element }: { element: PanelElement }) {
  const { t } = useI18n();
  if (hasBackgroundImage(element)) return null;
  return (
    <div className="flex h-full w-full items-center justify-center rounded border border-dashed border-border/70 bg-muted/15 px-2 text-[11px] text-muted-foreground">
      {t("panel.config.imagePlaceholder")}
    </div>
  );
}

function EmptyNodePlaceholder({ element }: { element: PanelElement }) {
  const { t } = useI18n();
  const labelMap: Record<string, string> = {
    video: t("panel.config.videoPlaceholder"),
    audio: t("panel.config.audioPlaceholder"),
  };
  const label = labelMap[element.materialType ?? ""] ?? t("panel.config.materialPlaceholder", { type: element.materialType ?? t("common.node") });
  return (
    <div className="flex h-full w-full items-center justify-center rounded border border-dashed border-border/70 bg-muted/15 px-2 text-[11px] text-muted-foreground">
      {label}
    </div>
  );
}

function GeometryNodeContent({ element }: { element: PanelElement }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const elementRef = useRef(element);
  elementRef.current = element;
  const shape = element.geometryShape ?? "rect";
  const color = element.geometryColor ?? "#3b82f6";
  const script = element.geometryScript ?? "";
  const sketch = element.geometrySketchDataUrl ?? "";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
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
        if (shape === "circle") {
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
        } else if (shape === "triangle") {
          ctx.moveTo(cx, cy - r);
          ctx.lineTo(cx + r * 0.9, cy + r * 0.8);
          ctx.lineTo(cx - r * 0.9, cy + r * 0.8);
          ctx.closePath();
        } else if (shape === "diamond") {
          ctx.moveTo(cx, cy - r);
          ctx.lineTo(cx + r, cy);
          ctx.lineTo(cx, cy + r);
          ctx.lineTo(cx - r, cy);
          ctx.closePath();
        } else if (shape === "hexagon") {
          for (let i = 0; i < 6; i += 1) {
            const a = (Math.PI / 3) * i - Math.PI / 6;
            const x = cx + r * Math.cos(a);
            const y = cy + r * Math.sin(a);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
        } else if (shape === "star") {
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
        } else if (shape === "heart") {
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
          const h = height * 0.84;
          ctx.moveTo(x + rr, y);
          ctx.lineTo(x + w - rr, y);
          ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
          ctx.lineTo(x + w, y + h - rr);
          ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
          ctx.lineTo(x + rr, y + h);
          ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
          ctx.lineTo(x, y + rr);
          ctx.quadraticCurveTo(x, y, x + rr, y);
          ctx.closePath();
        }
      };

      drawShapePath();
      ctx.fillStyle = color;
      ctx.fill();

      if (sketch) {
        const img = new Image();
        img.onload = () => {
          ctx.save();
          drawShapePath();
          ctx.clip();
          ctx.drawImage(img, 0, 0, width, height);
          ctx.restore();
        };
        img.src = sketch;
      }

      if (script.trim()) {
        try {
          const fn = new Function("ctx", "width", "height", "element", script);
          fn(ctx, width, height, elementRef.current);
        } catch {
          // ignore invalid script to avoid breaking render
        }
      }
    };

    draw();
    const obs = new ResizeObserver(draw);
    obs.observe(canvas);
    return () => obs.disconnect();
    // 不要依赖整个 element：移动 x/y 等会换新引用，触发 draw 后 clearRect
    // 与手绘层 img.onload 异步绘制叠在一起会产生「移动结束闪一下」。
    // 脚本里需要最新节点数据时读 elementRef.current。
  }, [color, script, shape, sketch]);

  return <canvas ref={canvasRef} className="h-full w-full" />;
}

function ChartNodeContent({
  element,
  previewLayoutKey,
  previewMode = false,
}: {
  element: PanelElement;
  previewLayoutKey?: number;
  previewMode?: boolean;
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);
  const rendererRef = useRef<"canvas" | "svg">("canvas");
  const option = useMemo(() => buildChartOption(element), [element]);
  const renderer = (element.chart?.renderMode ?? "canvas") as "canvas" | "svg";

  const resizeChart = useCallback(() => {
    chartRef.current?.resize();
  }, []);

  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (!chartRef.current || rendererRef.current !== renderer) {
      chartRef.current?.dispose();
      chartRef.current = echarts.init(host, undefined, { renderer });
      rendererRef.current = renderer;
    }
    chartRef.current.setOption(option as echarts.EChartsOption, true);
    resizeChart();
  }, [element.height, element.width, option, previewLayoutKey, renderer, resizeChart]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const onLayout = () => resizeChart();
    window.addEventListener(PREVIEW_LAYOUT_EVENT, onLayout);
    const obs = new ResizeObserver(onLayout);
    obs.observe(host);
    return () => {
      window.removeEventListener(PREVIEW_LAYOUT_EVENT, onLayout);
      obs.disconnect();
    };
  }, [resizeChart]);

  useEffect(() => {
    return () => {
      chartRef.current?.dispose();
      chartRef.current = null;
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className="h-full w-full"
      style={
        previewMode
          ? {
              width: Math.max(1, element.width),
              height: Math.max(1, element.height),
              minWidth: 1,
              minHeight: 1,
            }
          : undefined
      }
    />
  );
}

function getNodeVisualStyle(element: PanelElement): React.CSSProperties {
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

function getNodeAABB(element: PanelElement) {
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

function ReferenceNodeContent({
  element,
  allElements,
  snapshotSource,
  visitedIds = [],
}: {
  element: PanelElement;
  allElements: PanelElement[];
  snapshotSource?: PanelElement[];
  visitedIds?: string[];
}) {
  const { t } = useI18n();
  const sourceNodes = useMemo(
    () => {
      const fromDeep =
        element.refCopyMode === "deep" ? element.refSnapshot ?? snapshotSource ?? [] : null;
      const base = fromDeep ?? allElements.filter((n) => n.layerId === element.refLayerId);
      return base.filter((n) => n.id !== element.id && !visitedIds.includes(n.id));
    },
    [
      allElements,
      element.id,
      element.refCopyMode,
      element.refLayerId,
      element.refSnapshot,
      snapshotSource,
      visitedIds,
    ]
  );

  const layout = useMemo(() => {
    if (sourceNodes.length === 0) return null;
    const boxes = sourceNodes.map(getNodeAABB);
    const minX = Math.min(...boxes.map((b) => b.left));
    const minY = Math.min(...boxes.map((b) => b.top));
    const maxX = Math.max(...boxes.map((b) => b.right));
    const maxY = Math.max(...boxes.map((b) => b.bottom));
    const sourceWidth = Math.max(1, maxX - minX);
    const sourceHeight = Math.max(1, maxY - minY);

    const innerW = Math.max(1, element.width);
    const innerH = Math.max(1, element.height);
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
  }, [element.height, element.width, sourceNodes]);

  if (!layout || sourceNodes.length === 0) {
    const hintText = element.refLayerId ? t("panel.config.refLayerEmpty") : t("panel.config.selectRefLayer");
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="rounded border border-dashed border-border/70 px-2 py-1 text-[10px] text-muted-foreground">
          {hintText}
        </div>
      </div>
    );
  }

  return (
    <div className="pointer-events-none relative h-full w-full overflow-hidden">
      {sourceNodes.map((node) => {
        const box = getNodeAABB(node);
        const left = layout.offsetX + (box.left - layout.minX) * layout.scale;
        const top = layout.offsetY + (box.top - layout.minY) * layout.scale;
        const width = Math.max(12, node.width * layout.scale);
        const height = Math.max(10, node.height * layout.scale);
        const boxWidth = Math.max(12, (box.right - box.left) * layout.scale);
        const boxHeight = Math.max(10, (box.bottom - box.top) * layout.scale);
        return (
          <div
            key={node.id}
            className="absolute overflow-visible"
            style={{
              left,
              top,
              width: boxWidth,
              height: boxHeight,
            }}
          >
            <div
              className="absolute"
              style={{
                left: (boxWidth - width) / 2,
                top: (boxHeight - height) / 2,
                width,
                height,
                transform: `rotate(${node.rotate ?? 0}deg)`,
                transformOrigin: "center center",
                ...getNodeVisualStyle(node),
              }}
            >
              {CHART_TYPES.has(node.materialType ?? "") ? (
                <ChartNodeContent element={node} />
              ) : node.materialType === "reference" ? (
                <ReferenceNodeContent
                  element={node}
                  allElements={allElements}
                  snapshotSource={node.refSnapshot}
                  visitedIds={[...visitedIds, element.id]}
                />
              ) : node.materialType === "geometry" ? (
                <GeometryNodeContent element={node} />
              ) : (
                <div className="h-full w-full" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export const ElementsLayer = React.memo(function ElementsLayer({
  elements,
  allElements,
  selectedIds,
  onSelectIds,
  updateElement,
  layerLocked = false,
  previewMode = false,
  previewLayoutKey,
}: ElementsLayerProps) {
  const sortedElements = useMemo(() => {
    return [...elements].sort((a, b) => {
      const za = a.zIndex ?? 1;
      const zb = b.zIndex ?? 1;
      if (za !== zb) return za - zb;
      return a.id.localeCompare(b.id);
    });
  }, [elements]);
  return (
    <>
      {sortedElements.map((el) => {
        const isSelected = selectedIds.includes(el.id);
        return (
          <div
            key={el.id}
            className={[
              "absolute select-none",
              previewMode ? "" : "rv-selectable",
              !previewMode && isSelected ? "ring-2 ring-blue-500/90 ring-offset-0" : "",
            ].join(" ")}
            data-element-id={el.id}
            onMouseDown={(e) => {
              if (previewMode) return;
              if (e.button !== 0) return;
              // 单击选中（与 Selecto 的框选互补）
              if (e.shiftKey) {
                onSelectIds(
                  isSelected
                    ? selectedIds.filter((id) => id !== el.id)
                    : [...selectedIds, el.id]
                );
              } else {
                onSelectIds([el.id]);
              }
            }}
            style={{
              left: el.x,
              top: el.y,
              width: Math.max(1, el.width),
              height: Math.max(1, el.height),
              zIndex: el.zIndex ?? 1,
              transform: `rotate(${el.rotate ?? 0}deg)`,
              transformOrigin: "center center",
              boxSizing: "border-box",
              ...getNodeVisualStyle(el),
            }}
          >
            {CHART_TYPES.has(el.materialType ?? "") ? (
              <ChartNodeContent
                element={el}
                previewLayoutKey={previewLayoutKey}
                previewMode={previewMode}
              />
            ) : el.materialType === "reference" ? (
              <ReferenceNodeContent element={el} allElements={allElements} />
            ) : el.materialType === "grid" ? (
              <GridNodeContent
                element={el}
                allElements={allElements}
                previewMode={previewMode}
              />
            ) : el.materialType === "text" ? (
              <TextNodeContent
                element={el}
                editable={(el.textAllowInput ?? true) && !el.locked && !layerLocked}
                onChange={(nextHtml) => {
                  updateElement(el.id, { textHtml: nextHtml });
                }}
              />
            ) : el.materialType === "audio" ? (
              <AudioNodeContent element={el} selected={isSelected} />
            ) : el.materialType === "video" ? (
              <VideoNodeContent element={el} selected={isSelected} />
            ) : el.materialType === "geometry" ? (
              <GeometryNodeContent element={el} />
            ) : el.materialType === "image" ? (
              <ImageNodeContent element={el} />
            ) : (
              <EmptyNodePlaceholder element={el} />
            )}
          </div>
        );
      })}
    </>
  );
});

