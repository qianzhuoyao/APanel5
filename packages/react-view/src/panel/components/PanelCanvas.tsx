import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import InfiniteViewer from "react-infinite-viewer";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

import {
  clampViewportZoom,
  clampViewportZoomXY,
  uniformViewportZoom,
  type ViewportZoom,
} from "../viewportZoom";

export type PanelCanvasProps = {
  zoom: ViewportZoom;
  onZoomChange: (next: ViewportZoom) => void;
  contentSize?: { width: number; height: number } | null;
  onScrollChange?: (pos: { left: number; top: number }) => void;
  children: React.ReactNode;
  className?: string;
  canvasRef?: React.Ref<HTMLDivElement>;
  onCanvasMouseDownCapture?: React.MouseEventHandler<HTMLDivElement>;
  onCanvasClickCapture?: React.MouseEventHandler<HTMLDivElement>;
  onCanvasContextMenuCapture?: React.MouseEventHandler<HTMLDivElement>;
  onDropMaterial?: (payload: { materialId: string; x: number; y: number }) => void;
  /** 渲染在 InfiniteViewer 内、画布 scale 层之外（如 Moveable 控制框） */
  viewportOverlay?: React.ReactNode;
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
      viewportOverlay,
    },
    scrollRef
  ) => {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<any>(null);
  const transformRef = useRef<any>(null);
  const canvasElRef = useRef<HTMLDivElement | null>(null);
  const syncingZoomRef = useRef(false);
  const didAutoCenterRef = useRef(false);
  const [isPanning, setIsPanning] = useState(false);
  const lastScrollRef = useRef({ left: 0, top: 0 });
  const zoomRef = useRef(zoom);
  const viewportSizeRef = useRef({ width: 0, height: 0 });
  const resizeZoomRafRef = useRef<number | null>(null);
  const resizeLayoutAnchorRef = useRef<{
    viewportWidth: number;
    viewportHeight: number;
    zoomX: number;
    zoomY: number;
    scrollLeft: number;
    scrollTop: number;
  } | null>(null);
  /** 上一次已应用的视口尺寸与分轴 zoom（每次 resize / 滚轮缩放后更新，保证开合蓝图可逆） */
  const layoutBaselineRef = useRef({
    viewportWidth: 0,
    viewportHeight: 0,
    zoomX: 1,
    zoomY: 1,
  });
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  /** 固定世界画布尺寸，不随 zoom / 当前视口变化，避免缩放与 DOM 尺寸竞态导致节点错位 */
  const [worldCanvasSize, setWorldCanvasSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const commitScroll = useCallback(
    (left: number, top: number) => {
      const next = { left, top };
      lastScrollRef.current = next;
      onScrollChange?.(next);
    },
    [onScrollChange]
  );

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  useEffect(() => {
    viewportSizeRef.current = viewport;
  }, [viewport]);

  useEffect(() => {
    if (contentSize) return;
    if (viewport.width < 8 || viewport.height < 8) return;
    setWorldCanvasSize((prev) => {
      if (prev) return prev;
      const size = { width: viewport.width, height: viewport.height };
      layoutBaselineRef.current = {
        viewportWidth: viewport.width,
        viewportHeight: viewport.height,
        zoomX: zoomRef.current.x,
        zoomY: zoomRef.current.y,
      };
      resizeLayoutAnchorRef.current = {
        viewportWidth: viewport.width,
        viewportHeight: viewport.height,
        zoomX: zoomRef.current.x,
        zoomY: zoomRef.current.y,
        scrollLeft: lastScrollRef.current.left,
        scrollTop: lastScrollRef.current.top,
      };
      return size;
    });
  }, [contentSize, viewport.height, viewport.width]);

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
    const el = viewportRef.current;
    if (!el) return;

    const onWheelZoom = (e: WheelEvent) => {
      const api = transformRef.current;
      if (!api) return;
      const viewer = viewerRef.current as any;
      if (!viewer) return;
      const target = e.target as HTMLElement | null;
      if (
        target?.closest("input, textarea, select, [contenteditable='true']") ||
        target?.closest("[role='dialog']")
      ) {
        return;
      }
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const pointerX = e.clientX - rect.left;
      const pointerY = e.clientY - rect.top;
      const zx = zoomRef.current.x;
      const zy = zoomRef.current.y;
      const currentScrollLeft = Number(lastScrollRef.current.left ?? 0);
      const currentScrollTop = Number(lastScrollRef.current.top ?? 0);

      const direction = e.deltaY > 0 ? -1 : 1;
      const zoomStep = direction > 0 ? 1.08 : 0.92;
      const nextZoom = clampViewportZoomXY({
        x: zx * zoomStep,
        y: zy * zoomStep,
      });
      if (Math.abs(nextZoom.x - zx) < 0.0001 && Math.abs(nextZoom.y - zy) < 0.0001) {
        return;
      }

      const worldX = (pointerX + currentScrollLeft) / Math.max(0.0001, zx);
      const worldY = (pointerY + currentScrollTop) / Math.max(0.0001, zy);
      const nextScrollLeft = worldX * nextZoom.x - pointerX;
      const nextScrollTop = worldY * nextZoom.y - pointerY;

      syncingZoomRef.current = true;
      viewer.scrollTo(nextScrollLeft, nextScrollTop);
      commitScroll(nextScrollLeft, nextScrollTop);
      const { width: vw, height: vh } = viewportSizeRef.current;
      resizeLayoutAnchorRef.current = {
        viewportWidth: vw,
        viewportHeight: vh,
        zoomX: nextZoom.x,
        zoomY: nextZoom.y,
        scrollLeft: nextScrollLeft,
        scrollTop: nextScrollTop,
      };
      layoutBaselineRef.current = {
        viewportWidth: vw,
        viewportHeight: vh,
        zoomX: nextZoom.x,
        zoomY: nextZoom.y,
      };
      zoomRef.current = nextZoom;
      onZoomChange({
        x: Number(nextZoom.x.toFixed(4)),
        y: Number(nextZoom.y.toFixed(4)),
      });
      requestAnimationFrame(() => {
        syncingZoomRef.current = false;
      });
    };

    el.addEventListener("wheel", onWheelZoom, { passive: false, capture: true });
    return () => {
      el.removeEventListener("wheel", onWheelZoom, true);
    };
  }, [commitScroll, onZoomChange, viewport.width, viewport.height]);

  const applyViewportResizeZoom = useCallback(
    (w: number, h: number) => {
      if (w < 8 || h < 8) return;

      const viewer = viewerRef.current as {
        scrollTo?: (x: number, y: number) => void;
      } | null;
      if (!viewer) return;

      const baseline = layoutBaselineRef.current;
      if (baseline.viewportWidth < 8 || baseline.viewportHeight < 8) {
        layoutBaselineRef.current = {
          viewportWidth: w,
          viewportHeight: h,
          zoomX: zoomRef.current.x,
          zoomY: zoomRef.current.y,
        };
        resizeLayoutAnchorRef.current = {
          viewportWidth: w,
          viewportHeight: h,
          zoomX: zoomRef.current.x,
          zoomY: zoomRef.current.y,
          scrollLeft: lastScrollRef.current.left,
          scrollTop: lastScrollRef.current.top,
        };
        return;
      }

      if (
        Math.abs(w - baseline.viewportWidth) < 2 &&
        Math.abs(h - baseline.viewportHeight) < 2
      ) {
        return;
      }

      const factorX = w / baseline.viewportWidth;
      const factorY = h / baseline.viewportHeight;
      // 视口拉伸时用同一倍率，避免 scale(zoomX, zoomY) 非等比导致节点旋转变形
      const factor = Math.sqrt(factorX * factorY);

      const anchor = resizeLayoutAnchorRef.current ?? {
        viewportWidth: w,
        viewportHeight: h,
        zoomX: zoomRef.current.x,
        zoomY: zoomRef.current.y,
        scrollLeft: lastScrollRef.current.left,
        scrollTop: lastScrollRef.current.top,
      };

      const nextZoomValue = clampViewportZoom(baseline.zoomX * factor);
      const worldX =
        (anchor.scrollLeft + anchor.viewportWidth / 2) /
        Math.max(0.0001, anchor.zoomX);
      const worldY =
        (anchor.scrollTop + anchor.viewportHeight / 2) /
        Math.max(0.0001, anchor.zoomY);
      const nextScrollLeft = worldX * nextZoomValue - w / 2;
      const nextScrollTop = worldY * nextZoomValue - h / 2;
      const nextZoom = { x: nextZoomValue, y: nextZoomValue };

      syncingZoomRef.current = true;
      viewer.scrollTo?.(nextScrollLeft, nextScrollTop);
      commitScroll(nextScrollLeft, nextScrollTop);
      resizeLayoutAnchorRef.current = {
        viewportWidth: w,
        viewportHeight: h,
        zoomX: nextZoomValue,
        zoomY: nextZoomValue,
        scrollLeft: nextScrollLeft,
        scrollTop: nextScrollTop,
      };
      layoutBaselineRef.current = {
        viewportWidth: w,
        viewportHeight: h,
        zoomX: nextZoomValue,
        zoomY: nextZoomValue,
      };
      zoomRef.current = nextZoom;
      onZoomChange({
        x: Number(nextZoomValue.toFixed(4)),
        y: Number(nextZoomValue.toFixed(4)),
      });
      requestAnimationFrame(() => {
        syncingZoomRef.current = false;
      });
    },
    [commitScroll, onZoomChange]
  );

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
      canvasElRef.current = el;
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

  /** 操作区尺寸变化时同步缩放；基于上一次已应用的锚点，避免放大后滚动补偿错位 */
  useEffect(() => {
    if (contentSize) return;
    if (viewport.width < 8 || viewport.height < 8) return;

    if (resizeZoomRafRef.current != null) {
      cancelAnimationFrame(resizeZoomRafRef.current);
    }
    resizeZoomRafRef.current = requestAnimationFrame(() => {
      resizeZoomRafRef.current = null;
      applyViewportResizeZoom(viewport.width, viewport.height);
    });

    return () => {
      if (resizeZoomRafRef.current != null) {
        cancelAnimationFrame(resizeZoomRafRef.current);
      }
    };
  }, [
    applyViewportResizeZoom,
    contentSize,
    viewport.height,
    viewport.width,
  ]);

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
        const nextLeft = panRef.current.startLeft - dx;
        const nextTop = panRef.current.startTop - dy;
        viewer.scrollTo(nextLeft, nextTop);
        const left =
          typeof viewer.getScrollLeft === "function"
            ? viewer.getScrollLeft()
            : nextLeft;
        const top =
          typeof viewer.getScrollTop === "function"
            ? viewer.getScrollTop()
            : nextTop;
        commitScroll(left, top);
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
  }, [clearWindowPanListeners, commitScroll]);

  const resolvedContentSize = useMemo(() => {
    if (contentSize) return contentSize;
    if (worldCanvasSize) return worldCanvasSize;
    return {
      width: Math.max(0, viewport.width),
      height: Math.max(0, viewport.height),
    };
  }, [contentSize, viewport.height, viewport.width, worldCanvasSize]);

  const canvasScale = useMemo(() => uniformViewportZoom(zoom), [zoom.x, zoom.y]);

  const style = useMemo<React.CSSProperties>(
    () => ({
      width: resolvedContentSize.width,
      height: resolvedContentSize.height,
      minWidth: "100%",
      minHeight: "100%",
      position: "relative",
      transform: `scale(${canvasScale})`,
      transformOrigin: "0 0",
    }),
    [canvasScale, resolvedContentSize.height, resolvedContentSize.width]
  );

  const hasMaterialPayload = useCallback((types: ArrayLike<string> | null | undefined) => {
    if (!types) return false;
    return Array.from(types).includes("application/x-arronqzy-material");
  }, []);

  const commitDropFromPoint = useCallback(
    (clientX: number, clientY: number, dataTransfer: DataTransfer | null) => {
      const raw = dataTransfer?.getData("application/x-arronqzy-material");
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
        const canvasEl = canvasElRef.current;
        if (!canvasEl) return;
        const canvasRect = canvasEl.getBoundingClientRect();
        const x = (clientX - canvasRect.left) / Math.max(0.0001, zoomRef.current.x);
        const y = (clientY - canvasRect.top) / Math.max(0.0001, zoomRef.current.y);
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
        initialScale={1}
        minScale={1}
        maxScale={1}
        centerOnInit={false}
        limitToBounds={false}
        panning={{ disabled: true }}
        doubleClick={{ disabled: true }}
        pinch={{ disabled: true }}
        wheel={{ step: 0.008, disabled: true, wheelDisabled: true }}
        centerZoomedOut={false}
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
            {viewportOverlay ? (
              <div className="rv-viewport-overlay pointer-events-none absolute inset-0 z-[70] overflow-visible [&_.moveable-control-box]:pointer-events-auto">
                {viewportOverlay}
              </div>
            ) : null}
          </div>
        </TransformComponent>
      </TransformWrapper>
    </InfiniteViewer>
  );
}
);

PanelCanvas.displayName = "PanelCanvas";

