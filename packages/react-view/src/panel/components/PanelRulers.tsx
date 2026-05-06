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
  onZoomChange,
  size = 24,
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
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: size,
          top: 0,
          right: 0,
          height: size,
          pointerEvents: "auto",
        }}
      >
        <Ruler
          type="horizontal"
          {...commonProps}
          scrollPos={scrollLeft}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          top: size,
          bottom: 0,
          width: size,
          pointerEvents: "auto",
        }}
      >
        <Ruler
          type="vertical"
          {...commonProps}
          scrollPos={scrollTop}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: size,
          height: size,
          background: "rgba(0,0,0,0.05)",
          borderRight: "1px solid rgba(0,0,0,0.08)",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          pointerEvents: "auto",
        }}
      />
    </div>
  );
}

