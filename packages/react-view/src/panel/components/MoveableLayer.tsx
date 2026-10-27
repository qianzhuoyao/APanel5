import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@arronqzy/i18n/react";
import { createPortal } from "react-dom";
import Moveable from "react-moveable";

import type { PanelElement } from "../types";
import { uniformViewportZoom } from "../viewportZoom";
import { setCanvasInteractionBusy } from "../utils/canvas-interaction-busy";
import {
  computeSnapPatchForMovingElement,
  elementBelongsToGrid,
  resolveConcreteParentGridId,
} from "../utils/gridPlacement";

function LockGlyph({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
      <circle cx="12" cy="15.5" r="1.2" />
    </svg>
  );
}

export type MoveableLayerProps = {
  zoomX: number;
  zoomY: number;
  /** 带 scale 的画布根节点（data-panel-canvas），与节点同一坐标系 */
  canvasContainer: HTMLElement | null;
  /** 滚动视口，用于拖拽/框选指针坐标 */
  dragContainer?: HTMLElement | null;
  selectedTargets: HTMLElement[];
  elementsById: Map<string, PanelElement>;
  updateElement: (
    id: string,
    patch: Partial<PanelElement>,
    options?: { batchId?: string; meta?: Record<string, unknown> }
  ) => void;
  /** 画布平移/缩放等视口变化时递增或变化，用于触发控制框重算 */
  refreshToken?: number | string;
  /** 平移后立即同步控制框（由 PanelCanvas 写入，绕过 React scroll 节流） */
  viewportSyncRef?: React.MutableRefObject<(() => void) | null>;
};

function readLiveCanvasScale(
  canvasContainer: HTMLElement | null,
  fallback: number
): number {
  if (!canvasContainer) return fallback;
  const raw = canvasContainer.dataset.canvasScale;
  if (!raw) return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function MoveableLayer({
  zoomX,
  zoomY,
  canvasContainer,
  dragContainer,
  selectedTargets,
  elementsById,
  updateElement,
  refreshToken,
  viewportSyncRef,
}: MoveableLayerProps) {
  const { t } = useI18n();

  const moveableRef = useRef<any>(null);
  const targets = useMemo(() => {
    const validTargets = selectedTargets.filter(
      (target) =>
        !!target &&
        target.isConnected &&
        !!target.closest("[data-panel-canvas]")
    );
    return validTargets.length ? validTargets : null;
  }, [selectedTargets]);

  const getId = useCallback((target: HTMLElement) => {
    const el = target.closest<HTMLElement>(".rv-selectable");
    return el?.dataset.elementId ?? null;
  }, []);
  const selectedIds = useMemo(
    () =>
      (targets ?? [])
        .map((target) => getId(target))
        .filter((id): id is string => !!id),
    [getId, targets]
  );
  const lockedSelected = useMemo(
    () => selectedIds.filter((id) => elementsById.get(id)?.locked),
    [elementsById, selectedIds]
  );
  const hasLockedSelected = lockedSelected.length > 0;
  const movableTargets = useMemo(() => {
    if (!targets) return null;
    const unlocked = targets.filter((target) => {
      const id = getId(target);
      if (!id) return false;
      return !elementsById.get(id)?.locked;
    });
    return unlocked.length ? unlocked : null;
  }, [elementsById, getId, targets]);
  const movableIds = useMemo(
    () =>
      (movableTargets ?? [])
        .map((target) => getId(target))
        .filter((id): id is string => !!id),
    [getId, movableTargets]
  );
  const moveableRenderKey = useMemo(() => movableIds.join(","), [movableIds]);
  const propCanvasScale = useMemo(
    () => uniformViewportZoom({ x: zoomX, y: zoomY }),
    [zoomX, zoomY]
  );
  const canvasScale = readLiveCanvasScale(canvasContainer, propCanvasScale);
  /** 在 scale 画布内渲染，用倒数补偿，保证锚点/边线屏幕像素恒定 */
  const moveableControlZoom = 1 / Math.max(0.0001, canvasScale);
  const pointerRoot = dragContainer ?? canvasContainer;
  const resolveSingleEventId = useCallback(
    (target: HTMLElement | undefined | null) => {
      const id = target ? getId(target) : null;
      if (id) return id;
      // 过滤锁定后只剩一个可移动节点时，Moveable 某些事件 target 可能不是节点本身
      if (movableIds.length === 1) return movableIds[0] ?? null;
      return null;
    },
    [getId, movableIds]
  );
  const toCanvasDeltaX = useCallback(
    (value: number) => value / Math.max(0.0001, canvasScale),
    [canvasScale]
  );
  const toCanvasDeltaY = useCallback(
    (value: number) => value / Math.max(0.0001, canvasScale),
    [canvasScale]
  );
  const readClientPoint = useCallback((eventLike: any) => {
    const x =
      typeof eventLike?.clientX === "number"
        ? eventLike.clientX
        : typeof eventLike?.inputEvent?.clientX === "number"
          ? eventLike.inputEvent.clientX
          : null;
    const y =
      typeof eventLike?.clientY === "number"
        ? eventLike.clientY
        : typeof eventLike?.inputEvent?.clientY === "number"
          ? eventLike.inputEvent.clientY
          : null;
    if (x === null || y === null) return null;
    return { x, y };
  }, []);
  const readTargetCanvasSize = useCallback(
    (target: HTMLElement | null | undefined, fallback: { width: number; height: number }) => {
      const rect = target?.getBoundingClientRect?.();
      if (rect && rect.width > 0 && rect.height > 0) {
        return {
          width: Math.max(1, toCanvasDeltaX(rect.width)),
          height: Math.max(1, toCanvasDeltaY(rect.height)),
        };
      }
      return { width: Math.max(1, fallback.width), height: Math.max(1, fallback.height) };
    },
    [toCanvasDeltaX, toCanvasDeltaY]
  );
  const [lockBadgeScreen, setLockBadgeScreen] = useState<{ x: number; y: number } | null>(
    null
  );
  const syncRafRef = useRef<number | null>(null);
  const syncLockBadge = useCallback(() => {
    const id = lockedSelected[0];
    if (!id || !pointerRoot) {
      setLockBadgeScreen(null);
      return;
    }
    const target = selectedTargets.find(
      (node) => node.closest<HTMLElement>(".rv-selectable")?.dataset.elementId === id
    );
    if (!target) {
      setLockBadgeScreen(null);
      return;
    }
    const rect = target.getBoundingClientRect();
    const rootRect = pointerRoot.getBoundingClientRect();
    setLockBadgeScreen({
      x: rect.left - rootRect.left,
      y: rect.top - rootRect.top,
    });
  }, [lockedSelected, pointerRoot, selectedTargets]);

  const applyLiveMoveableZoom = useCallback(() => {
    const moveable = moveableRef.current;
    if (!moveable) return;
    const liveScale = readLiveCanvasScale(canvasContainer, propCanvasScale);
    moveable.zoom = 1 / Math.max(0.0001, liveScale);
  }, [canvasContainer, propCanvasScale]);

  const scheduleViewportSync = useCallback(() => {
    if (syncRafRef.current != null) return;
    syncRafRef.current = requestAnimationFrame(() => {
      syncRafRef.current = null;
      applyLiveMoveableZoom();
      moveableRef.current?.updateRect?.();
      syncLockBadge();
    });
  }, [applyLiveMoveableZoom, syncLockBadge]);

  useEffect(() => {
    if (!viewportSyncRef) return;
    viewportSyncRef.current = scheduleViewportSync;
    return () => {
      viewportSyncRef.current = null;
    };
  }, [scheduleViewportSync, viewportSyncRef]);

  useLayoutEffect(() => {
    applyLiveMoveableZoom();
    moveableRef.current?.updateRect?.();
    syncLockBadge();
  }, [applyLiveMoveableZoom, canvasScale, syncLockBadge]);

  const updateRectNextFrame = scheduleViewportSync;
  const getSnapPatch = useCallback(
    (movingId: string, x: number, y: number, width: number, height: number): Partial<PanelElement> =>
      computeSnapPatchForMovingElement(elementsById, movingId, x, y, width, height),
    [elementsById]
  );

  useEffect(() => {
    if (!targets) return;
    updateRectNextFrame();
  }, [moveableRenderKey, refreshToken, targets, updateRectNextFrame]);

  useEffect(
    () => () => {
      if (syncRafRef.current != null) {
        cancelAnimationFrame(syncRafRef.current);
      }
    },
    []
  );

  if (!canvasContainer) return null;

  const lockBadgeOnly =
    lockBadgeScreen && hasLockedSelected && !movableTargets ? (
      <div
        className="pointer-events-none absolute z-[80] inline-flex select-none items-center gap-1 rounded border border-border bg-background/95 px-1.5 py-0.5 text-[11px] text-foreground shadow-sm"
        style={{ left: lockBadgeScreen.x + 6, top: lockBadgeScreen.y - 22 }}
        title={t("panel.config.nodeLockedTitle")}>
        <LockGlyph />
        <span>{t("panel.config.nodeLockedBadge")}</span>
      </div>
    ) : null;

  if (!targets) {
    return lockBadgeOnly && pointerRoot
      ? createPortal(lockBadgeOnly, pointerRoot)
      : null;
  }

  if (!movableTargets) {
    return lockBadgeOnly && pointerRoot
      ? createPortal(lockBadgeOnly, pointerRoot)
      : null;
  }

  const layer = (
    <>
      <Moveable
        key={moveableRenderKey}
        ref={moveableRef}
      // Moveable 支持单个 HTMLElement 或 HTMLElement[]
      target={movableTargets as unknown as HTMLElement[]}
      rootContainer={canvasContainer}
      container={canvasContainer}
      dragContainer={pointerRoot}
      className="rv-moveable-layer"
      zoom={moveableControlZoom}
      hideChildMoveableDefaultLines={false}
      // 允许在控制框内部区域拖动（不必必须点到某个节点本体）
      dragArea
      draggable
      resizable
      rotatable
      origin={false}
      throttleDrag={0}
      throttleResize={0}
      throttleRotate={0}
      onDragStart={(e: any) => {
        if ((e.target as HTMLElement | null)?.closest("[data-scene3d-orbit-active='true']")) {
          e.stop?.();
          return;
        }
        const id = resolveSingleEventId(e.target as HTMLElement | null);
        if (!id) return;
        const data = elementsById.get(id);
        if (!data) return;
        e.set([0, 0]);
        e.datas.__startX = data.x;
        e.datas.__startY = data.y;
        const point = readClientPoint(e);
        e.datas.__startClientX = point?.x ?? null;
        e.datas.__startClientY = point?.y ?? null;
        setCanvasInteractionBusy(true);
      }}
      onDrag={(e: any) => {
        if (!e?.target?.style) return;
        if (e.datas.__startX === undefined || e.datas.__startY === undefined) return;
        const sx = e.datas.__startX ?? 0;
        const sy = e.datas.__startY ?? 0;
        const point = readClientPoint(e);
        const hasClient =
          typeof e.datas.__startClientX === "number" &&
          typeof e.datas.__startClientY === "number" &&
          !!point;
        const tx = hasClient
          ? toCanvasDeltaX(point.x - e.datas.__startClientX)
          : toCanvasDeltaX(e.beforeTranslate?.[0] ?? 0);
        const ty = hasClient
          ? toCanvasDeltaY(point.y - e.datas.__startClientY)
          : toCanvasDeltaY(e.beforeTranslate?.[1] ?? 0);
        e.target.style.left = `${sx + tx}px`;
        e.target.style.top = `${sy + ty}px`;
      }}
      onDragGroupStart={(e: any) => {
        if ((e.target as HTMLElement | null)?.closest("[data-scene3d-orbit-active='true']")) {
          e.stop?.();
          return;
        }
        e.events.forEach((ev: any) => {
          const id = ev.target ? getId(ev.target) : null;
          if (!id) return;
          const data = elementsById.get(id);
          if (!data) return;
          ev.set([0, 0]);
          ev.datas.__startX = data.x;
          ev.datas.__startY = data.y;
          const point = readClientPoint(ev) ?? readClientPoint(e);
          ev.datas.__startClientX = point?.x ?? null;
          ev.datas.__startClientY = point?.y ?? null;
        });
        setCanvasInteractionBusy(true);
      }}
      onDragGroup={(e: any) => {
        e.events.forEach((ev: any) => {
          if (!ev?.target?.style) return;
          const sx = ev.datas.__startX ?? 0;
          const sy = ev.datas.__startY ?? 0;
          const point = readClientPoint(ev) ?? readClientPoint(e);
          const hasClient =
            typeof ev.datas.__startClientX === "number" &&
            typeof ev.datas.__startClientY === "number" &&
            !!point;
          const tx = hasClient
            ? toCanvasDeltaX(point.x - ev.datas.__startClientX)
            : toCanvasDeltaX(ev.beforeTranslate?.[0] ?? 0);
          const ty = hasClient
            ? toCanvasDeltaY(point.y - ev.datas.__startClientY)
            : toCanvasDeltaY(ev.beforeTranslate?.[1] ?? 0);
          ev.target.style.left = `${sx + tx}px`;
          ev.target.style.top = `${sy + ty}px`;
        });
      }}
      onResizeStart={(e: any) => {
        const id = resolveSingleEventId(e.target as HTMLElement | null);
        if (!id) return;
        const data = elementsById.get(id);
        if (!data) return;
        e.setOrigin(["%", "%"]);
        e.dragStart?.set([0, 0]);
        e.datas.__startX = data.x;
        e.datas.__startY = data.y;
        e.datas.__startClientX = e.inputEvent?.clientX ?? null;
        e.datas.__startClientY = e.inputEvent?.clientY ?? null;
        setCanvasInteractionBusy(true);
      }}
      onResize={(e: any) => {
        if (!e?.target?.style) return;
        if (e.datas.__startX === undefined || e.datas.__startY === undefined) return;
        e.target.style.width = `${e.width}px`;
        e.target.style.height = `${e.height}px`;
        const sx = e.datas.__startX ?? 0;
        const sy = e.datas.__startY ?? 0;
        // resize 场景下位移应以 moveable 的 drag 偏移为准，避免 client 坐标换算导致漂移
        const tx = toCanvasDeltaX(e.drag.beforeTranslate?.[0] ?? 0);
        const ty = toCanvasDeltaY(e.drag.beforeTranslate?.[1] ?? 0);
        e.target.style.left = `${sx + tx}px`;
        e.target.style.top = `${sy + ty}px`;
      }}
      onResizeGroupStart={(e: any) => {
        e.events.forEach((ev: any) => {
          const id = ev.target ? getId(ev.target) : null;
          if (!id) return;
          const data = elementsById.get(id);
          if (!data) return;
          ev.setOrigin(["%", "%"]);
          ev.dragStart?.set([0, 0]);
          ev.datas.__startX = data.x;
          ev.datas.__startY = data.y;
          const input = ev.inputEvent ?? e.inputEvent;
          ev.datas.__startClientX = input?.clientX ?? null;
          ev.datas.__startClientY = input?.clientY ?? null;
        });
        setCanvasInteractionBusy(true);
      }}
      onResizeGroup={(e: any) => {
        e.events.forEach((ev: any) => {
          if (!ev?.target?.style) return;
          ev.target.style.width = `${ev.width}px`;
          ev.target.style.height = `${ev.height}px`;
          const sx = ev.datas.__startX ?? 0;
          const sy = ev.datas.__startY ?? 0;
          const tx = toCanvasDeltaX(ev.drag.beforeTranslate?.[0] ?? 0);
          const ty = toCanvasDeltaY(ev.drag.beforeTranslate?.[1] ?? 0);
          ev.target.style.left = `${sx + tx}px`;
          ev.target.style.top = `${sy + ty}px`;
        });
      }}
      onRotateStart={(e: any) => {
        const id = resolveSingleEventId(e.target as HTMLElement | null);
        if (!id) return;
        const data = elementsById.get(id);
        if (!data) return;
        e.set(data.rotate ?? 0);
        setCanvasInteractionBusy(true);
      }}
      onRotate={(e: any) => {
        if (!e?.target?.style) return;
        e.target.style.transform = `rotate(${e.beforeRotate}deg)`;
      }}
      onRotateGroupStart={(e: any) => {
        e.events.forEach((ev: any) => {
          const id = ev.target ? getId(ev.target) : null;
          if (!id) return;
          const data = elementsById.get(id);
          if (!data) return;
          ev.set(data.rotate ?? 0);
        });
        setCanvasInteractionBusy(true);
      }}
      onRotateGroup={(e: any) => {
        e.events.forEach((ev: any) => {
          if (!ev?.target?.style) return;
          ev.target.style.transform = `rotate(${ev.beforeRotate}deg)`;
        });
      }}
      onDragEnd={(e: any) => {
        try {
        const id = resolveSingleEventId(e.target as HTMLElement | null);
        if (!id) return;
        const data = elementsById.get(id);
        if (!data) return;
        const sx = e.datas.__startX ?? data.x;
        const sy = e.datas.__startY ?? data.y;
        const point = readClientPoint(e);
        const hasClient =
          typeof e.datas.__startClientX === "number" &&
          typeof e.datas.__startClientY === "number" &&
          !!point;
        const tx = hasClient
          ? toCanvasDeltaX(point.x - e.datas.__startClientX)
          : toCanvasDeltaX(e.lastEvent?.beforeTranslate?.[0] ?? 0);
        const ty = hasClient
          ? toCanvasDeltaY(point.y - e.datas.__startClientY)
          : toCanvasDeltaY(e.lastEvent?.beforeTranslate?.[1] ?? 0);
        const nextX = sx + tx;
        const nextY = sy + ty;
        const size = readTargetCanvasSize(e.target as HTMLElement | null, {
          width: data.width,
          height: data.height,
        });
        const patch = getSnapPatch(id, nextX, nextY, size.width, size.height);
        // 网格子节点几何由 applyGridLayoutPatch / reflow 按槽位重算，勿再 +dx 二次平移
        updateElement(id, { x: nextX, y: nextY, ...patch });
        updateRectNextFrame();
        } finally {
          setCanvasInteractionBusy(false);
        }
      }}
      onDragGroupEnd={(e: any) => {
        try {
        const batchId = `move-group-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const selectedIdsInGroup: string[] = e.events
          .map((ev: any) => (ev.target ? getId(ev.target) : null))
          .filter((id: string | null): id is string => !!id);
        const selectedGridIds = new Set<string>(
          selectedIdsInGroup.filter(
            (sid: string) => elementsById.get(sid)?.materialType === "grid"
          )
        );
        const isUnderSelectedGrid = (el: PanelElement) => {
          if (selectedGridIds.size === 0) return false;
          let current: PanelElement | undefined = el;
          const seen = new Set<string>();
          while (current?.parentGridId && !seen.has(current.id)) {
            seen.add(current.id);
            for (const gid of selectedGridIds) {
              if (elementBelongsToGrid(current, gid, elementsById)) return true;
            }
            const concrete: string =
              resolveConcreteParentGridId(current, elementsById) ?? current.parentGridId;
            if (selectedGridIds.has(concrete)) return true;
            current = elementsById.get(concrete);
          }
          return false;
        };
        e.events.forEach((ev: any) => {
          const id = ev.target ? getId(ev.target) : null;
          if (!id) return;
          const data = elementsById.get(id);
          if (!data) return;
          // 父网格同批拖动时子节点只靠 reflow，避免双写
          if (selectedGridIds.size > 0 && isUnderSelectedGrid(data)) return;
          const sx = ev.datas.__startX ?? data.x;
          const sy = ev.datas.__startY ?? data.y;
          const point = readClientPoint(ev) ?? readClientPoint(e);
          const hasClient =
            typeof ev.datas.__startClientX === "number" &&
            typeof ev.datas.__startClientY === "number" &&
            !!point;
          const tx = hasClient
            ? toCanvasDeltaX(point.x - ev.datas.__startClientX)
            : toCanvasDeltaX(ev.lastEvent?.beforeTranslate?.[0] ?? 0);
          const ty = hasClient
            ? toCanvasDeltaY(point.y - ev.datas.__startClientY)
            : toCanvasDeltaY(ev.lastEvent?.beforeTranslate?.[1] ?? 0);
          const nextX = sx + tx;
          const nextY = sy + ty;
          const size = readTargetCanvasSize(ev.target as HTMLElement | null, {
            width: data.width,
            height: data.height,
          });
          const patch = getSnapPatch(id, nextX, nextY, size.width, size.height);
          updateElement(
            id,
            { x: nextX, y: nextY, ...patch },
            { batchId, meta: { type: "node.group-drag" } }
          );
        });
        updateRectNextFrame();
        } finally {
          setCanvasInteractionBusy(false);
        }
      }}
      onResizeEnd={(e: any) => {
        try {
        const id = resolveSingleEventId(e.target as HTMLElement | null);
        if (!id) return;
        const data = elementsById.get(id);
        if (!data) return;
        const width = e.lastEvent?.width ?? data.width;
        const height = e.lastEvent?.height ?? data.height;
        const tx = toCanvasDeltaX(e.lastEvent?.drag?.beforeTranslate?.[0] ?? 0);
        const ty = toCanvasDeltaY(e.lastEvent?.drag?.beforeTranslate?.[1] ?? 0);
        const sx = e.datas.__startX ?? data.x;
        const sy = e.datas.__startY ?? data.y;
        const nextX = sx + tx;
        const nextY = sy + ty;
        const size = readTargetCanvasSize(e.target as HTMLElement | null, { width, height });
        const snapPatch = getSnapPatch(id, nextX, nextY, size.width, size.height);
        updateElement(id, { width, height, x: nextX, y: nextY, ...snapPatch });
        updateRectNextFrame();
        } finally {
          setCanvasInteractionBusy(false);
        }
      }}
      onResizeGroupEnd={(e: any) => {
        try {
        const batchId = `resize-group-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        e.events.forEach((ev: any) => {
          const id = ev.target ? getId(ev.target) : null;
          if (!id) return;
          const data = elementsById.get(id);
          if (!data) return;
          const width = ev.lastEvent?.width ?? data.width;
          const height = ev.lastEvent?.height ?? data.height;
          const tx = toCanvasDeltaX(ev.lastEvent?.drag?.beforeTranslate?.[0] ?? 0);
          const ty = toCanvasDeltaY(ev.lastEvent?.drag?.beforeTranslate?.[1] ?? 0);
          const sx = ev.datas.__startX ?? data.x;
          const sy = ev.datas.__startY ?? data.y;
          const nextX = sx + tx;
          const nextY = sy + ty;
          const size = readTargetCanvasSize(ev.target as HTMLElement | null, { width, height });
          const snapPatch = getSnapPatch(id, nextX, nextY, size.width, size.height);
          updateElement(
            id,
            { width, height, x: nextX, y: nextY, ...snapPatch },
            { batchId, meta: { type: "node.group-resize" } }
          );
        });
        updateRectNextFrame();
        } finally {
          setCanvasInteractionBusy(false);
        }
      }}
      onRotateEnd={(e: any) => {
        try {
        const id = resolveSingleEventId(e.target as HTMLElement | null);
        if (!id) return;
        const data = elementsById.get(id);
        if (!data) return;
        const rotate = e.lastEvent?.beforeRotate ?? data.rotate ?? 0;
        updateElement(id, { rotate });
        updateRectNextFrame();
        } finally {
          setCanvasInteractionBusy(false);
        }
      }}
      onRotateGroupEnd={(e: any) => {
        try {
        const batchId = `rotate-group-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        e.events.forEach((ev: any) => {
          const id = ev.target ? getId(ev.target) : null;
          if (!id) return;
          const data = elementsById.get(id);
          if (!data) return;
          const rotate = ev.lastEvent?.beforeRotate ?? data.rotate ?? 0;
          updateElement(id, { rotate }, { batchId, meta: { type: "node.group-rotate" } });
        });
        updateRectNextFrame();
        } finally {
          setCanvasInteractionBusy(false);
        }
      }}
      />
      {hasLockedSelected && lockBadgeScreen ? (
        <div
          className="pointer-events-none absolute z-[80] inline-flex select-none items-center gap-1 rounded border border-border bg-background/95 px-1.5 py-0.5 text-[11px] text-foreground shadow-sm"
          style={{ left: lockBadgeScreen.x + 6, top: lockBadgeScreen.y - 22 }}
          title={t("panel.config.lockedExcludedTitle")}>
          <LockGlyph />
          <span>{t("panel.config.lockedExcludedBadge")}</span>
        </div>
      ) : null}
    </>
  );

  return canvasContainer ? createPortal(layer, canvasContainer) : null;
}

