import React, { useCallback, useMemo } from "react";

export type PanelCanvasProps = {
  zoom: number;
  onZoomChange: (next: number) => void;
  contentSize?: { width: number; height: number };
  children: React.ReactNode;
  className?: string;
  canvasRef?: React.Ref<HTMLDivElement>;
  onCanvasMouseDownCapture?: React.MouseEventHandler<HTMLDivElement>;
};

export const PanelCanvas = React.forwardRef<HTMLDivElement, PanelCanvasProps>(
  (
    {
      zoom,
      onZoomChange,
      contentSize = { width: 2000, height: 2000 },
      children,
      className,
      canvasRef,
      onCanvasMouseDownCapture,
    },
    scrollRef
  ) => {
  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();

      const delta = e.deltaY;
      const step = delta > 0 ? -0.05 : 0.05;
      const next = Math.max(0.25, Math.min(4, Number((zoom + step).toFixed(2))));
      onZoomChange(next);
    },
    [onZoomChange, zoom]
  );

  const style = useMemo<React.CSSProperties>(
    () => ({
      width: contentSize.width,
      height: contentSize.height,
      transform: `scale(${zoom})`,
      transformOrigin: "0 0",
      position: "relative",
      backgroundSize: "20px 20px",
      backgroundImage:
        "linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)",
    }),
    [contentSize.height, contentSize.width, zoom]
  );

  return (
    <div
      ref={scrollRef}
      className={className}
      onWheel={handleWheel}
      style={{
        position: "relative",
        overflow: "auto",
        width: "100%",
        height: "100%",
        background: "var(--background, #fff)",
      }}
    >
      <div style={{ width: contentSize.width * zoom, height: contentSize.height * zoom }}>
        <div
          ref={canvasRef}
          data-panel-canvas
          style={style}
          onMouseDownCapture={onCanvasMouseDownCapture}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
);

PanelCanvas.displayName = "PanelCanvas";

