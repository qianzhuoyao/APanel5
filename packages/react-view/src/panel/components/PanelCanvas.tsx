import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type PanelCanvasProps = {
  zoom: number;
  onZoomChange: (next: number) => void;
  contentSize?: { width: number; height: number } | null;
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
      contentSize = null,
      children,
      className,
      canvasRef,
      onCanvasMouseDownCapture,
    },
    scrollRef
  ) => {
  const innerScrollRef = useRef<HTMLDivElement | null>(null);
  const setScrollRef = useCallback(
    (el: HTMLDivElement | null) => {
      innerScrollRef.current = el;
      if (!scrollRef) return;
      if (typeof scrollRef === "function") scrollRef(el);
      else (scrollRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
    },
    [scrollRef]
  );

  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = innerScrollRef.current;
    if (!el) return;

    const update = () => {
      const width = Math.round(el.clientWidth);
      const height = Math.round(el.clientHeight);
      setViewport((prev) =>
        prev.width === width && prev.height === height ? prev : { width, height }
      );
    };
    update();

    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(update);
      ro.observe(el);
      return () => ro.disconnect();
    }

    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

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

  const resolvedContentSize = useMemo(() => {
    if (contentSize) return contentSize;
    // 内容尺寸严格跟随父容器可视区（不除以 zoom），缩放通过外层占位尺寸实现
    return { width: Math.max(0, viewport.width), height: Math.max(0, viewport.height) };
  }, [contentSize, viewport.height, viewport.width]);

  const style = useMemo<React.CSSProperties>(
    () => ({
      width: resolvedContentSize.width,
      height: resolvedContentSize.height,
      transform: `scale(${zoom})`,
      transformOrigin: "0 0",
      position: "relative",
    }),
    [resolvedContentSize.height, resolvedContentSize.width, zoom]
  );

  return (
    <div
      ref={setScrollRef}
      className={[
        // Keep scrollbar space stable to avoid ResizeObserver feedback loop.
        "relative h-full w-full overflow-scroll bg-white [scrollbar-gutter:stable]",
        className ?? "",
      ].join(" ")}
      onWheel={handleWheel}
    >
      <div
        style={{
          width: resolvedContentSize.width * zoom,
          height: resolvedContentSize.height * zoom,
        }}
      >
        <div
          ref={canvasRef}
          data-panel-canvas
          style={style}
          className="bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:20px_20px]"
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

