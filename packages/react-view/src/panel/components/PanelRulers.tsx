import React, { useEffect, useMemo, useState } from "react";
import Ruler from "@scena/react-ruler";
import { PANEL_Z_INDEX } from "../constants/zIndex";

const RULER_WORLD_UNIT = 100;
const RULER_SEGMENT = 10;

export type PanelRulersProps = {
  zoomX: number;
  zoomY: number;
  scrollLeft: number;
  scrollTop: number;
  size?: number;
};

export function PanelRulers({
  zoomX,
  zoomY,
  scrollLeft,
  scrollTop,
  size = 32,
}: PanelRulersProps) {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    const update = () => setIsDark(root.classList.contains("dark"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const rulerScrollLeft = scrollLeft + size;
  const rulerScrollTop = scrollTop + size;

  const horizontalProps = useMemo(
    () => ({
      zoom: zoomX,
      unit: RULER_WORLD_UNIT,
      segment: RULER_SEGMENT,
      backgroundColor: isDark ? "rgba(15,23,42,0.98)" : "rgba(255,255,255,0.98)",
      lineColor: isDark ? "rgba(226,232,240,0.4)" : "rgba(15,23,42,0.22)",
      textColor: isDark ? "rgba(248,250,252,0.95)" : "rgba(15,23,42,0.75)",
      font: "10px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
      longLineSize: 8,
      shortLineSize: 4,
    }),
    [isDark, zoomX]
  );

  const verticalProps = useMemo(
    () => ({
      zoom: zoomY,
      unit: RULER_WORLD_UNIT,
      segment: RULER_SEGMENT,
      backgroundColor: isDark ? "rgba(15,23,42,0.98)" : "rgba(255,255,255,0.98)",
      lineColor: isDark ? "rgba(226,232,240,0.4)" : "rgba(15,23,42,0.22)",
      textColor: isDark ? "rgba(248,250,252,0.95)" : "rgba(15,23,42,0.75)",
      font: "10px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
      longLineSize: 8,
      shortLineSize: 4,
    }),
    [isDark, zoomY]
  );

  return (
    <div
      className="pointer-events-none absolute inset-0 isolate"
      style={{ ["--rv-ruler-size" as string]: `${size}px`, zIndex: PANEL_Z_INDEX.ruler }}
    >
      <div className="absolute left-[var(--rv-ruler-size)] right-[var(--rv-ruler-size)] top-0 h-[var(--rv-ruler-size)] overflow-visible">
        <Ruler type="horizontal" {...horizontalProps} scrollPos={rulerScrollLeft} />
      </div>
      <div className="absolute left-0 top-[var(--rv-ruler-size)] bottom-[var(--rv-ruler-size)] w-[var(--rv-ruler-size)] overflow-visible">
        <Ruler type="vertical" {...verticalProps} scrollPos={rulerScrollTop} />
      </div>
      <div className="absolute left-[var(--rv-ruler-size)] right-[var(--rv-ruler-size)] bottom-0 h-[var(--rv-ruler-size)] overflow-visible">
        <Ruler type="horizontal" {...horizontalProps} scrollPos={rulerScrollLeft} />
      </div>
      <div className="absolute right-0 top-[var(--rv-ruler-size)] bottom-[var(--rv-ruler-size)] w-[var(--rv-ruler-size)] overflow-visible">
        <Ruler type="vertical" {...verticalProps} scrollPos={rulerScrollTop} />
      </div>
      <div className="absolute left-0 top-0 h-[var(--rv-ruler-size)] w-[var(--rv-ruler-size)] border-b border-r border-border bg-background" />
      <div className="absolute right-0 top-0 h-[var(--rv-ruler-size)] w-[var(--rv-ruler-size)] border-b border-l border-border bg-background" />
      <div className="absolute left-0 bottom-0 h-[var(--rv-ruler-size)] w-[var(--rv-ruler-size)] border-r border-t border-border bg-background" />
      <div className="absolute right-0 bottom-0 h-[var(--rv-ruler-size)] w-[var(--rv-ruler-size)] border-l border-t border-border bg-background" />
    </div>
  );
}
