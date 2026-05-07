import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import InfiniteViewer from "react-infinite-viewer";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

export type PanelCanvasProps = {
  zoom: number;
  onZoomChange: (next: number) => void;
  contentSize?: { width: number; height: number } | null;
  onScrollChange?: (pos: { left: number; top: number }) => void;
  children: React.ReactNode;
  className?: string;
  canvasRef?: React.Ref<HTMLDivElement>;
  onCanvasMouseDownCapture?: React.MouseEventHandler<HTMLDivElement>;
  onCanvasClickCapture?: React.MouseEventHandler<HTMLDivElement>;
  onCanvasContextMenuCapture?: React.MouseEventHandler<HTMLDivElement>;
  onDropMaterial?: (payload: { materialId: string; x: number; y: number }) => void;
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
      onCanvasClickCapture,
      onCanvasContextMenuCapture,
      onDropMaterial,
    },
    scrollRef
  ) => {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<any>(null);
  const transformRef = useRef<any>(null);
  const syncingZoomRef = useRef(false);
  const didAutoCenterRef = useRef(false);
  const [isPanning, setIsPanning] = useState(false);
  const lastScrollRef = useRef({ left: 0, top: 0 });
  const zoomRef = useRef(zoom);
  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);
  const panRef = useRef<{
    active: boolean;
    moved: boolean;
    startClientX: number;
    startClientY: number;
    startLeft: number;
    startTop: number;
  }>({
    active: false,
    moved: false,
    startClientX: 0,
    startClientY: 0,
    startLeft: 0,
    startTop: 0,
  });
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

  useEffect(() => {
    const api = transformRef.current;
    if (!api) return;
    const current = api.state?.scale ?? 1;
    if (Math.abs(current - zoom) < 0.0001) return;
    syncingZoomRef.current = true;
    // 位置始终锁定为 0，避免可操作层偏移出操作面板
    api.setTransform(0, 0, zoom, 120, "easeOut");
    requestAnimationFrame(() => {
      syncingZoomRef.current = false;
    });
  }, [zoom]);

  const syncViewportElement = useCallback(
    (el: HTMLDivElement | null) => {
      viewportRef.current = el;
      if (!scrollRef) return;
      if (typeof scrollRef === "function") scrollRef(el);
      else (scrollRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
    },
    [scrollRef]
  );

  const syncCanvasElement = useCallback(
    (el: HTMLDivElement | null) => {
      if (!canvasRef) return;
      if (typeof canvasRef === "function") canvasRef(el);
      else (canvasRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
    },
    [canvasRef]
  );

  useEffect(() => {
    const container = viewerRef.current?.getContainer?.() as HTMLDivElement | undefined;
    syncViewportElement(container ?? null);
  }, [syncViewportElement]);

  useEffect(() => {
    if (didAutoCenterRef.current) return;
    const viewer = viewerRef.current as any;
    const viewportEl = viewportRef.current;
    if (!viewer || !viewportEl) return;

    const id = requestAnimationFrame(() => {
      const nodes = viewportEl.querySelectorAll<HTMLElement>(".rv-selectable");
      if (!nodes.length) return;

      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;

      nodes.forEach((node) => {
        const left = node.offsetLeft;
        const top = node.offsetTop;
        const width = node.offsetWidth;
        const height = node.offsetHeight;
        minX = Math.min(minX, left);
        minY = Math.min(minY, top);
        maxX = Math.max(maxX, left + width);
        maxY = Math.max(maxY, top + height);
      });

      if (!Number.isFinite(minX) || !Number.isFinite(minY)) return;
      const boundsWidth = Math.max(1, maxX - minX);
      const boundsHeight = Math.max(1, maxY - minY);

      const targetLeft = minX + boundsWidth / 2 - viewportEl.clientWidth / 2;
      const targetTop = minY + boundsHeight / 2 - viewportEl.clientHeight / 2;
      viewer.scrollTo(Math.round(targetLeft), Math.round(targetTop));
      didAutoCenterRef.current = true;
    });

    return () => cancelAnimationFrame(id);
  }, []);

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

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onContextMenu = (e: MouseEvent) => {
      // 只有发生了右键平移时，才拦截本次菜单；其余交给 shadcn ContextMenu
      if (panRef.current.moved) {
        e.preventDefault();
        e.stopPropagation();
        (e as any).stopImmediatePropagation?.();
        panRef.current.moved = false;
      }
    };
    const onMouseDown = (e: MouseEvent) => {
      // 右键 或 mac 上 ctrl+左键
      const isRightLike = e.button === 2 || (e.button === 0 && e.ctrlKey);
      if (!isRightLike) return;
      const viewer = viewerRef.current as any;
      if (!viewer) return;

      panRef.current.active = true;
      panRef.current.moved = false;
      panRef.current.startClientX = e.clientX;
      panRef.current.startClientY = e.clientY;
      panRef.current.startLeft = lastScrollRef.current.left;
      panRef.current.startTop = lastScrollRef.current.top;

      const move = (ev: MouseEvent) => {
        if (!panRef.current.active) return;
        const dx = ev.clientX - panRef.current.startClientX;
        const dy = ev.clientY - panRef.current.startClientY;
        const distance = Math.hypot(dx, dy);
        if (!panRef.current.moved && distance > 10) {
          panRef.current.moved = true;
          setIsPanning(true);
        }
        if (!panRef.current.moved) return;
        ev.preventDefault();
        viewer.scrollTo(panRef.current.startLeft - dx, panRef.current.startTop - dy);
      };

      const up = (ev: MouseEvent) => {
        if (!panRef.current.active) return;
        if (panRef.current.moved) {
          ev.preventDefault();
        }
        panRef.current.active = false;
        setIsPanning(false);
        clearWindowPanListeners();
      };

      panHandlersRef.current.move = move;
      panHandlersRef.current.up = up;
      window.addEventListener("mousemove", move, true);
      window.addEventListener("mouseup", up, true);
    };

    el.addEventListener("contextmenu", onContextMenu, true);
    el.addEventListener("mousedown", onMouseDown, true);
    return () => {
      el.removeEventListener("contextmenu", onContextMenu, true);
      el.removeEventListener("mousedown", onMouseDown, true);
    };
  }, [clearWindowPanListeners]);

  const resolvedContentSize = useMemo(() => {
    if (contentSize) return contentSize;
    // 内容尺寸严格跟随父容器可视区（不除以 zoom），缩放通过外层占位尺寸实现
    return { width: Math.max(0, viewport.width), height: Math.max(0, viewport.height) };
  }, [contentSize, viewport.height, viewport.width]);

  const style = useMemo<React.CSSProperties>(
    () => ({
      width: resolvedContentSize.width,
      height: resolvedContentSize.height,
      minWidth: "100%",
      minHeight: "100%",
      position: "relative",
    }),
    [resolvedContentSize.height, resolvedContentSize.width]
  );

  const hasMaterialPayload = useCallback((types: ArrayLike<string> | null | undefined) => {
    if (!types) return false;
    return Array.from(types).includes("application/x-arron-material");
  }, []);

  const commitDropFromPoint = useCallback(
    (clientX: number, clientY: number, dataTransfer: DataTransfer | null) => {
      const raw = dataTransfer?.getData("application/x-arron-material");
      if (!raw) return;
      try {
        const material = JSON.parse(raw) as { id?: string };
        if (!material?.id) return;
        const viewportEl = viewportRef.current;
        if (!viewportEl) return;
        const viewportRect = viewportEl.getBoundingClientRect();
        const localX = clientX - viewportRect.left;
        const localY = clientY - viewportRect.top;
        const isInsideViewport =
          localX >= 0 &&
          localY >= 0 &&
          localX <= viewportRect.width &&
          localY <= viewportRect.height;
        if (!isInsideViewport) return;
        const currentZoom = Math.max(0.0001, zoomRef.current);
        const viewer = viewerRef.current as
          | {
              getScrollLeft?: () => number;
              getScrollTop?: () => number;
            }
          | null;
        const viewerScrollLeft = viewer?.getScrollLeft?.();
        const viewerScrollTop = viewer?.getScrollTop?.();
        const currentScrollLeft =
          (typeof viewerScrollLeft === "number" ? viewerScrollLeft : undefined) ??
          viewportEl.scrollLeft ??
          lastScrollRef.current.left;
        const currentScrollTop =
          (typeof viewerScrollTop === "number" ? viewerScrollTop : undefined) ??
          viewportEl.scrollTop ??
          lastScrollRef.current.top;
        const x = (currentScrollLeft + localX) / currentZoom;
        const y = (currentScrollTop + localY) / currentZoom;
        onDropMaterial?.({ materialId: material.id, x, y });
      } catch {
        // ignore invalid payload
      }
    },
    [onDropMaterial]
  );

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const onDragOver = (e: DragEvent) => {
      if (!hasMaterialPayload(e.dataTransfer?.types)) return;
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
    };

    const onDrop = (e: DragEvent) => {
      if (!hasMaterialPayload(e.dataTransfer?.types)) return;
      e.preventDefault();
      commitDropFromPoint(e.clientX, e.clientY, e.dataTransfer ?? null);
    };

    el.addEventListener("dragover", onDragOver, true);
    el.addEventListener("drop", onDrop, true);
    return () => {
      el.removeEventListener("dragover", onDragOver, true);
      el.removeEventListener("drop", onDrop, true);
    };
  }, [commitDropFromPoint, hasMaterialPayload]);

  return (
    <InfiniteViewer
      ref={viewerRef}
      className={[
        // 禁用原生滚动条外观（InfiniteViewer 自己的滚动条也会被下面的 props 关闭）
        "relative h-full w-full overflow-hidden bg-background [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
        isPanning ? "cursor-grabbing select-none" : "",
        className ?? "",
      ].join(" ")}
      style={{
        backgroundImage:
          "linear-gradient(to right, hsl(var(--border) / 0.45) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border) / 0.45) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
      margin={0}
      threshold={0}
      // 只允许右键平移：禁用 InfiniteViewer 的默认鼠标拖拽（通常是左键）
      useMouseDrag={false}
      // 不显示滚动条 & 禁用滚轮滚动（类型定义未暴露这些 props，按 any 透传）
      {...({
        displayVerticalScroll: false,
        displayHorizontalScroll: false,
        useWheelScroll: false,
      } as any)}
      preventWheelClick
      onScroll={(e: any) => {
        const next = { left: e.scrollLeft ?? 0, top: e.scrollTop ?? 0 };
        lastScrollRef.current = next;
        onScrollChange?.(next);
      }}
    >
      <TransformWrapper
        ref={transformRef}
        initialScale={zoom}
        minScale={0.5}
        maxScale={2}
        centerOnInit={false}
        limitToBounds={false}
        panning={{ disabled: true }}
        doubleClick={{ disabled: true }}
        pinch={{ disabled: true }}
        wheel={{ step: 0.008, disabled: false, wheelDisabled: false }}
        centerZoomedOut={false}
        onWheel={(ref) => {
          const next = Number(ref.state.scale.toFixed(4));
          if (syncingZoomRef.current) return;
          onZoomChange(next);
        }}
      >
        <TransformComponent
          // 始终占满操作容器，但不在这一层裁切放大后的内容
          wrapperStyle={{ width: "100%", height: "100%", overflow: "visible" }}
          contentStyle={{ width: "100%", height: "100%", overflow: "visible" }}
        >
          <div
            ref={syncCanvasElement}
            data-panel-canvas
            style={style}
            className=""
            onMouseDownCapture={onCanvasMouseDownCapture}
            onClickCapture={onCanvasClickCapture}
            onContextMenuCapture={onCanvasContextMenuCapture}
          >
            {children}
          </div>
        </TransformComponent>
      </TransformWrapper>
    </InfiniteViewer>
  );
}
);

PanelCanvas.displayName = "PanelCanvas";

