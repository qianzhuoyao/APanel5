import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import InfiniteViewer from "react-infinite-viewer";

export type PanelCanvasProps = {
  zoom: number;
  onZoomChange: (next: number) => void;
  contentSize?: { width: number; height: number } | null;
  onScrollChange?: (pos: { left: number; top: number }) => void;
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
      onScrollChange,
      children,
      className,
      canvasRef,
      onCanvasMouseDownCapture,
    },
    scrollRef
  ) => {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<any>(null);
  const [isPanning, setIsPanning] = useState(false);
  const lastScrollRef = useRef({ left: 0, top: 0 });
  const panRef = useRef<{
    active: boolean;
    startClientX: number;
    startClientY: number;
    startLeft: number;
    startTop: number;
  }>({ active: false, startClientX: 0, startClientY: 0, startLeft: 0, startTop: 0 });
  const panHandlersRef = useRef<{
    move: ((ev: MouseEvent) => void) | null;
    up: ((ev: MouseEvent) => void) | null;
  }>({ move: null, up: null });

  const clearWindowPanListeners = useCallback(() => {
    if (panHandlersRef.current.move) {
      window.removeEventListener("mousemove", panHandlersRef.current.move, true);
      panHandlersRef.current.move = null;
    }
    if (panHandlersRef.current.up) {
      window.removeEventListener("mouseup", panHandlersRef.current.up, true);
      panHandlersRef.current.up = null;
    }
  }, []);

  useEffect(() => clearWindowPanListeners, [clearWindowPanListeners]);

  const setScrollRef = useCallback(
    (el: HTMLDivElement | null) => {
      viewportRef.current = el;
      if (!scrollRef) return;
      if (typeof scrollRef === "function") scrollRef(el);
      else (scrollRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
    },
    [scrollRef]
  );

  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = viewportRef.current;
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
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    // InfiniteViewer 右键拖拽时禁用默认菜单，避免手势被打断
    e.preventDefault();
  }, []);

  const handleRightPanMouseDownCapture = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // 右键 或 mac 上 ctrl+左键
      const isRightLike = e.button === 2 || (e.button === 0 && e.ctrlKey);
      if (!isRightLike) return;
      const viewer = viewerRef.current as any;
      if (!viewer) return;

      e.preventDefault();
      e.stopPropagation();

      panRef.current.active = true;
      panRef.current.startClientX = e.clientX;
      panRef.current.startClientY = e.clientY;
      panRef.current.startLeft = lastScrollRef.current.left;
      panRef.current.startTop = lastScrollRef.current.top;
      setIsPanning(true);

      const move = (ev: MouseEvent) => {
        if (!panRef.current.active) return;
        ev.preventDefault();
        const dx = ev.clientX - panRef.current.startClientX;
        const dy = ev.clientY - panRef.current.startClientY;
        // 关键：用 InfiniteViewer 自己的 scrollTo 来移动
        viewer.scrollTo(panRef.current.startLeft - dx, panRef.current.startTop - dy);
      };

      const up = (ev: MouseEvent) => {
        if (!panRef.current.active) return;
        ev.preventDefault();
        panRef.current.active = false;
        setIsPanning(false);
        clearWindowPanListeners();
      };

      panHandlersRef.current.move = move;
      panHandlersRef.current.up = up;
      window.addEventListener("mousemove", move, true);
      window.addEventListener("mouseup", up, true);
    },
    [clearWindowPanListeners]
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
    <InfiniteViewer
      ref={viewerRef}
      className={[
        "relative h-full w-full",
        isPanning ? "cursor-grabbing select-none" : "",
        className ?? "",
      ].join(" ")}
      margin={0}
      threshold={0}
      useMouseDrag
      preventWheelClick
      onScroll={(e: any) => {
        const next = { left: e.scrollLeft ?? 0, top: e.scrollTop ?? 0 };
        lastScrollRef.current = next;
        onScrollChange?.(next);
      }}
    >
      <div
        ref={setScrollRef}
        className="relative h-full w-full overflow-hidden bg-white"
        onWheel={handleWheel}
        onContextMenu={handleContextMenu}
        onMouseDownCapture={handleRightPanMouseDownCapture}
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
    </InfiniteViewer>
  );
}
);

PanelCanvas.displayName = "PanelCanvas";

