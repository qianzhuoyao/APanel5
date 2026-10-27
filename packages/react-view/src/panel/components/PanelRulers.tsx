import React, { useEffect, useMemo, useRef, useState } from "react";
import Ruler from "@scena/react-ruler";
import { PANEL_Z_INDEX } from "../constants/zIndex";

const RULER_SEGMENT = 10;
/** 主刻度标签在屏幕上的目标间距（px），过密/过疏时动态调 unit */
const RULER_TARGET_MAJOR_PX = 78;
/** @scena/react-ruler 内部把刻度文字原点写死为 17px，厚度必须大于该值才看得见数字 */
const SCENA_TEXT_ORIGIN = 17;

export type PanelRulersProps = {
  zoomX: number;
  zoomY: number;
  scrollLeft: number;
  scrollTop: number;
  /** 固定厚度；省略时按编辑区尺寸动态计算 */
  size?: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/** 1/2/5 × 10^n 好看步长 */
function niceNumber(raw: number): number {
  if (!Number.isFinite(raw) || raw <= 0) return 1;
  const exp = Math.floor(Math.log10(raw));
  const frac = raw / 10 ** exp;
  const niceFrac = frac <= 1 ? 1 : frac <= 2 ? 2 : frac <= 5 ? 5 : 10;
  return niceFrac * 10 ** exp;
}

/**
 * 按缩放动态主刻度单位：屏幕上主刻度间距 roughly 恒定，
 * 缩小 → unit 变大（标签变少），放大 → unit 变小（标签变密）。
 */
export function resolveRulerUnit(zoom: number): number {
  const z = Math.max(zoom, 0.0001);
  return Math.max(1, niceNumber(RULER_TARGET_MAJOR_PX / z));
}

/** 按画布可视区域动态计算刻度尺厚度（保证刻度数字可读） */
export function resolveRulerSize(width: number, height: number): number {
  const edge = Math.min(width || 0, height || 0);
  if (edge <= 0) return 22;
  // 下限 24：文字带与刻度带分离，避免数字压住刻度线
  return Math.round(clamp(edge * 0.032, 24, 30));
}

export function PanelRulers({
  zoomX,
  zoomY,
  scrollLeft,
  scrollTop,
  size: sizeProp,
}: PanelRulersProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [autoSize, setAutoSize] = useState(22);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const update = () => setIsDark(root.classList.contains("dark"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof sizeProp === "number") return;
    const el = rootRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      setAutoSize(resolveRulerSize(rect.width, rect.height));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [sizeProp]);

  const size = typeof sizeProp === "number" ? sizeProp : autoSize;
  const s = `${size}px`;
  const fontPx = Math.max(10, Math.min(11, Math.round(size * 0.38)));
  const bg = isDark ? "rgba(22,22,26,0.96)" : "rgba(255,255,255,0.96)";
  const lineColor = isDark ? "rgba(244,246,248,0.38)" : "rgba(24,24,28,0.38)";
  const textColor = isDark ? "rgba(244,246,248,0.72)" : "rgba(24,24,28,0.62)";
  const seam = isDark ? "rgba(244,246,248,0.12)" : "rgba(24,24,28,0.12)";

  // 刻度线只占内侧约 30%，数字在外侧，互不遮挡
  const longLineSize = Math.max(4, Math.min(Math.round(size * 0.3), size - fontPx - 4));
  const shortLineSize = Math.max(2, Math.round(longLineSize * 0.55));
  // @scena 文字原点写死 17px
  // end(顶/左): baseline=bottom，目标底边 ≈ fontPx+1
  // start(底/右): baseline=top，目标顶边 ≈ size-fontPx-2
  // 横向 offset=[沿尺, 厚度]；纵向 offset=[厚度, 沿尺]
  const textBandEnd = fontPx + 1 - (size - SCENA_TEXT_ORIGIN);
  const textBandStart = size - fontPx - 2 - SCENA_TEXT_ORIGIN;
  const textOffsetHEnd: [number, number] = [3, textBandEnd];
  const textOffsetHStart: [number, number] = [3, textBandStart];
  const textOffsetVEnd: [number, number] = [textBandEnd, 3];
  const textOffsetVStart: [number, number] = [textBandStart, 3];

  const rulerScrollLeft = scrollLeft + size * (1 - 1 / Math.max(zoomX, 0.0001));
  const rulerScrollTop = scrollTop + size * (1 - 1 / Math.max(zoomY, 0.0001));
  const unitX = useMemo(() => resolveRulerUnit(zoomX), [zoomX]);
  const unitY = useMemo(() => resolveRulerUnit(zoomY), [zoomY]);

  const sharedPaint = useMemo(
    () => ({
      segment: RULER_SEGMENT,
      backgroundColor: bg,
      lineColor,
      textColor,
      font: `500 ${fontPx}px system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial`,
      longLineSize,
      shortLineSize,
      mainLineSize: longLineSize + 2,
    }),
    [bg, fontPx, lineColor, longLineSize, shortLineSize, textColor]
  );

  const clipTop = `polygon(0 0, 100% 0, calc(100% - ${s}) 100%, ${s} 100%)`;
  const clipBottom = `polygon(${s} 0, calc(100% - ${s}) 0, 100% 100%, 0 100%)`;
  const clipLeft = `polygon(0 0, 100% ${s}, 100% calc(100% - ${s}), 0 100%)`;
  const clipRight = `polygon(0 ${s}, 100% 0, 100% 100%, 0 calc(100% - ${s}))`;

  return (
    <div
      ref={rootRef}
      className="pointer-events-none absolute inset-0 isolate"
      style={{ ["--rv-ruler-size" as string]: s, zIndex: PANEL_Z_INDEX.ruler }}
    >
      {/* 顶：刻度朝下(end)，数字在上半区 */}
      <div
        className="absolute inset-x-0 top-0 overflow-hidden"
        style={{ height: s, clipPath: clipTop, backgroundColor: bg }}
      >
        <Ruler
          key={`h-end-${unitX}`}
          type="horizontal"
          {...sharedPaint}
          unit={unitX}
          zoom={zoomX}
          direction="end"
          textOffset={textOffsetHEnd}
          scrollPos={rulerScrollLeft}
        />
      </div>
      {/* 左：刻度朝右(end)，数字在左半区 */}
      <div
        className="absolute inset-y-0 left-0 overflow-hidden"
        style={{ width: s, clipPath: clipLeft, backgroundColor: bg }}
      >
        <Ruler
          key={`v-end-${unitY}`}
          type="vertical"
          {...sharedPaint}
          unit={unitY}
          zoom={zoomY}
          direction="end"
          textOffset={textOffsetVEnd}
          scrollPos={rulerScrollTop}
        />
      </div>
      {/* 底：刻度朝上(start)，数字在下半区 */}
      <div
        className="absolute inset-x-0 bottom-0 overflow-hidden"
        style={{ height: s, clipPath: clipBottom, backgroundColor: bg }}
      >
        <Ruler
          key={`h-start-${unitX}`}
          type="horizontal"
          {...sharedPaint}
          unit={unitX}
          zoom={zoomX}
          direction="start"
          textOffset={textOffsetHStart}
          scrollPos={rulerScrollLeft}
        />
      </div>
      {/* 右：刻度朝左(start)，数字在右半区 */}
      <div
        className="absolute inset-y-0 right-0 overflow-hidden"
        style={{ width: s, clipPath: clipRight, backgroundColor: bg }}
      >
        <Ruler
          key={`v-start-${unitY}`}
          type="vertical"
          {...sharedPaint}
          unit={unitY}
          zoom={zoomY}
          direction="start"
          textOffset={textOffsetVStart}
          scrollPos={rulerScrollTop}
        />
      </div>

      {/* 四角斜缝：SVG 明确画外角→内角 */}
      <svg aria-hidden className="pointer-events-none absolute left-0 top-0" width={size} height={size} style={{ zIndex: 1 }}>
        <line x1={0} y1={0} x2={size} y2={size} stroke={seam} strokeWidth={1} />
      </svg>
      <svg aria-hidden className="pointer-events-none absolute right-0 top-0" width={size} height={size} style={{ zIndex: 1 }}>
        <line x1={size} y1={0} x2={0} y2={size} stroke={seam} strokeWidth={1} />
      </svg>
      <svg aria-hidden className="pointer-events-none absolute bottom-0 left-0" width={size} height={size} style={{ zIndex: 1 }}>
        <line x1={0} y1={size} x2={size} y2={0} stroke={seam} strokeWidth={1} />
      </svg>
      <svg aria-hidden className="pointer-events-none absolute bottom-0 right-0" width={size} height={size} style={{ zIndex: 1 }}>
        <line x1={size} y1={size} x2={0} y2={0} stroke={seam} strokeWidth={1} />
      </svg>
    </div>
  );
}
