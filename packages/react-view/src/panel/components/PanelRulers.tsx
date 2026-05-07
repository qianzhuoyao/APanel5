import React, { useMemo } from "react";
import Ruler from "@scena/react-ruler";

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
  const unit = useMemo(() => getAdaptiveUnit(zoom), [zoom]);
  const segment = useMemo(() => (unit >= 100 ? 5 : 10), [unit]);

  const commonProps = useMemo(
    () => ({
      zoom,
      unit,
      segment,
      backgroundColor: "rgba(255,255,255,0.98)",
      lineColor: "rgba(0,0,0,0.15)",
      textColor: "rgba(0,0,0,0.65)",
      font: "10px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
      longLineSize: 8,
      shortLineSize: 4,
    }),
    [segment, unit, zoom]
  );

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[999]"
      style={{ ["--rv-ruler-size" as any]: `${size}px` }}
    >
      {/* Top */}
      <div
        className="absolute left-[var(--rv-ruler-size)] right-[var(--rv-ruler-size)] top-0 h-[var(--rv-ruler-size)] overflow-visible"
      >
        <Ruler
          type="horizontal"
          {...commonProps}
          scrollPos={scrollLeft}
        />
      </div>

      {/* Left */}
      <div
        className="absolute left-0 top-[var(--rv-ruler-size)] bottom-[var(--rv-ruler-size)] w-[var(--rv-ruler-size)] overflow-visible"
      >
        <Ruler
          type="vertical"
          {...commonProps}
          scrollPos={scrollTop}
        />
      </div>

      {/* Bottom */}
      <div
        className="absolute left-[var(--rv-ruler-size)] right-[var(--rv-ruler-size)] bottom-0 h-[var(--rv-ruler-size)] overflow-visible"
      >
        <Ruler
          type="horizontal"
          {...commonProps}
          scrollPos={scrollLeft}
        />
      </div>

      {/* Right */}
      <div
        className="absolute right-0 top-[var(--rv-ruler-size)] bottom-[var(--rv-ruler-size)] w-[var(--rv-ruler-size)] overflow-visible"
      >
        <Ruler
          type="vertical"
          {...commonProps}
          scrollPos={scrollTop}
        />
      </div>

      <div className="absolute left-0 top-0 h-[var(--rv-ruler-size)] w-[var(--rv-ruler-size)] border-b border-r border-black/10 bg-white" />

      {/* Corners */}
      <div className="absolute right-0 top-0 h-[var(--rv-ruler-size)] w-[var(--rv-ruler-size)] border-b border-l border-black/10 bg-white" />
      <div className="absolute left-0 bottom-0 h-[var(--rv-ruler-size)] w-[var(--rv-ruler-size)] border-r border-t border-black/10 bg-white" />
      <div className="absolute right-0 bottom-0 h-[var(--rv-ruler-size)] w-[var(--rv-ruler-size)] border-l border-t border-black/10 bg-white" />
    </div>
  );
}

