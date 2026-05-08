import React, { useEffect, useMemo, useState } from "react";
import Ruler from "@scena/react-ruler";
import { PANEL_Z_INDEX } from "../constants/zIndex";

function getAdaptiveUnit(zoom: number) {
  // 让主刻度在屏幕上大致保持 70~110px，避免缩放大后标签过密
  const targetPx = 90;
  const raw = targetPx / Math.max(zoom, 0.0001);
  const exponent = Math.floor(Math.log10(raw));
  const base = 10 ** exponent;
  const normalized = raw / base;

  let step = 1;
  if (normalized <= 1) step = 1;
  else if (normalized <= 2) step = 2;
  else if (normalized <= 5) step = 5;
  else step = 10;

  return step * base;
}

export type PanelRulersProps = {
  zoom: number;
  scrollLeft: number;
  scrollTop: number;
  onZoomChange: (next: number) => void;
  size?: number;
};

export function PanelRulers({
  zoom,
  scrollLeft,
  scrollTop,
  onZoomChange: _onZoomChange,
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

  const unit = useMemo(() => getAdaptiveUnit(zoom), [zoom]);
  const segment = useMemo(() => (unit >= 100 ? 5 : 10), [unit]);
  // 标尺可视区域相对画布有 size 的内缩，需要加回滚动补偿，确保刻度与节点 x/y 对齐
  const rulerScrollLeft = scrollLeft + size;
  const rulerScrollTop = scrollTop + size;

  const commonProps = useMemo(
    () => ({
      zoom,
      unit,
      segment,
      backgroundColor: isDark ? "rgba(15,23,42,0.98)" : "rgba(255,255,255,0.98)",
      lineColor: isDark ? "rgba(226,232,240,0.4)" : "rgba(15,23,42,0.22)",
      textColor: isDark ? "rgba(248,250,252,0.95)" : "rgba(15,23,42,0.75)",
      font: "10px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
      longLineSize: 8,
      shortLineSize: 4,
    }),
    [isDark, segment, unit, zoom]
  );

  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{ ["--rv-ruler-size" as any]: `${size}px`, zIndex: PANEL_Z_INDEX.ruler }}
    >
      {/* Top */}
      <div
        className="absolute left-[var(--rv-ruler-size)] right-[var(--rv-ruler-size)] top-0 h-[var(--rv-ruler-size)] overflow-visible"
      >
        <Ruler
          type="horizontal"
          {...commonProps}
          scrollPos={rulerScrollLeft}
        />
      </div>

      {/* Left */}
      <div
        className="absolute left-0 top-[var(--rv-ruler-size)] bottom-[var(--rv-ruler-size)] w-[var(--rv-ruler-size)] overflow-visible"
      >
        <Ruler
          type="vertical"
          {...commonProps}
          scrollPos={rulerScrollTop}
        />
      </div>

      {/* Bottom */}
      <div
        className="absolute left-[var(--rv-ruler-size)] right-[var(--rv-ruler-size)] bottom-0 h-[var(--rv-ruler-size)] overflow-visible"
      >
        <Ruler
          type="horizontal"
          {...commonProps}
          scrollPos={rulerScrollLeft}
        />
      </div>

      {/* Right */}
      <div
        className="absolute right-0 top-[var(--rv-ruler-size)] bottom-[var(--rv-ruler-size)] w-[var(--rv-ruler-size)] overflow-visible"
      >
        <Ruler
          type="vertical"
          {...commonProps}
          scrollPos={rulerScrollTop}
        />
      </div>

      <div className="absolute left-0 top-0 h-[var(--rv-ruler-size)] w-[var(--rv-ruler-size)] border-b border-r border-border bg-background" />

      {/* Corners */}
      <div className="absolute right-0 top-0 h-[var(--rv-ruler-size)] w-[var(--rv-ruler-size)] border-b border-l border-border bg-background" />
      <div className="absolute left-0 bottom-0 h-[var(--rv-ruler-size)] w-[var(--rv-ruler-size)] border-r border-t border-border bg-background" />
      <div className="absolute right-0 bottom-0 h-[var(--rv-ruler-size)] w-[var(--rv-ruler-size)] border-l border-t border-border bg-background" />
    </div>
  );
}

