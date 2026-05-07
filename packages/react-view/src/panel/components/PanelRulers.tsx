import React, { useMemo } from "react";
import Ruler from "@scena/react-ruler";

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
  const commonProps = useMemo(
    () => ({
      zoom,
      unit: 50,
      segment: 10,
      backgroundColor: "rgba(0,0,0,0.03)",
      lineColor: "rgba(0,0,0,0.15)",
      textColor: "rgba(0,0,0,0.65)",
      font: "10px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
      longLineSize: 8,
      shortLineSize: 4,
    }),
    [zoom]
  );

  return (
    <div
      className="pointer-events-none absolute inset-0 z-20"
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

      <div className="absolute left-0 top-0 h-[var(--rv-ruler-size)] w-[var(--rv-ruler-size)] border-b border-r border-black/10 bg-black/5" />

      {/* Corners */}
      <div className="absolute right-0 top-0 h-[var(--rv-ruler-size)] w-[var(--rv-ruler-size)] border-b border-l border-black/10 bg-black/5" />
      <div className="absolute left-0 bottom-0 h-[var(--rv-ruler-size)] w-[var(--rv-ruler-size)] border-r border-t border-black/10 bg-black/5" />
      <div className="absolute right-0 bottom-0 h-[var(--rv-ruler-size)] w-[var(--rv-ruler-size)] border-l border-t border-black/10 bg-black/5" />
    </div>
  );
}

