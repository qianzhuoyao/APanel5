import React, { useCallback, useEffect, useMemo, useRef } from "react";
import Moveable from "react-moveable";

import type { PanelElement } from "../types";

export type MoveableLayerProps = {
  zoom: number;
  selectedTargets: HTMLElement[];
  elementsById: Map<string, PanelElement>;
  updateElement: (id: string, patch: Partial<PanelElement>) => void;
};

export function MoveableLayer({
  zoom,
  selectedTargets,
  elementsById,
  updateElement,
}: MoveableLayerProps) {
  const moveableRef = useRef<any>(null);
  const targets = useMemo(
    () => (selectedTargets.length ? selectedTargets : null),
    [selectedTargets]
  );

  const getId = useCallback((target: HTMLElement) => {
    const el = target.closest<HTMLElement>(".rv-selectable");
    return el?.dataset.elementId ?? null;
  }, []);

  const updateRectNextFrame = useCallback(() => {
    // 等 React 把 left/top/width/height 重新渲染后，再让 Moveable 重新计算控制框
    requestAnimationFrame(() => {
      moveableRef.current?.updateRect?.();
    });
  }, []);

  useEffect(() => {
    if (!targets) return;
    updateRectNextFrame();
  }, [targets, zoom, updateRectNextFrame]);

  if (!targets) return null;

  return (
    <Moveable
      ref={moveableRef}
      // Moveable 支持单个 HTMLElement 或 HTMLElement[]
      target={targets as unknown as HTMLElement[]}
      // 父容器做了 transform: scale(zoom) 时，这里传入同样的 zoom 用于坐标换算
      zoom={zoom}
      draggable
      resizable
      rotatable
      origin={false}
      throttleDrag={0}
      throttleResize={0}
      throttleRotate={0}
      onDragStart={(e: any) => {
        const id = e.target ? getId(e.target) : null;
        if (!id) return;
        const data = elementsById.get(id);
        if (!data) return;
        e.set([0, 0]);
        e.datas.__startX = data.x;
        e.datas.__startY = data.y;
      }}
      onDrag={(e: any) => {
        const sx = e.datas.__startX ?? 0;
        const sy = e.datas.__startY ?? 0;
        const tx = e.beforeTranslate?.[0] ?? 0;
        const ty = e.beforeTranslate?.[1] ?? 0;
        e.target.style.left = `${sx + tx}px`;
        e.target.style.top = `${sy + ty}px`;
      }}
      onDragGroupStart={(e: any) => {
        e.events.forEach((ev: any) => {
          const id = ev.target ? getId(ev.target) : null;
          if (!id) return;
          const data = elementsById.get(id);
          if (!data) return;
          ev.set([0, 0]);
          ev.datas.__startX = data.x;
          ev.datas.__startY = data.y;
        });
      }}
      onDragGroup={(e: any) => {
        e.events.forEach((ev: any) => {
          const sx = ev.datas.__startX ?? 0;
          const sy = ev.datas.__startY ?? 0;
          const tx = ev.beforeTranslate?.[0] ?? 0;
          const ty = ev.beforeTranslate?.[1] ?? 0;
          ev.target.style.left = `${sx + tx}px`;
          ev.target.style.top = `${sy + ty}px`;
        });
      }}
      onResizeStart={(e: any) => {
        const id = e.target ? getId(e.target) : null;
        if (!id) return;
        const data = elementsById.get(id);
        if (!data) return;
        e.setOrigin(["%", "%"]);
        e.dragStart?.set([0, 0]);
        e.datas.__startX = data.x;
        e.datas.__startY = data.y;
      }}
      onResize={(e: any) => {
        e.target.style.width = `${e.width}px`;
        e.target.style.height = `${e.height}px`;
        const sx = e.datas.__startX ?? 0;
        const sy = e.datas.__startY ?? 0;
        const tx = e.drag.beforeTranslate?.[0] ?? 0;
        const ty = e.drag.beforeTranslate?.[1] ?? 0;
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
        });
      }}
      onResizeGroup={(e: any) => {
        e.events.forEach((ev: any) => {
          ev.target.style.width = `${ev.width}px`;
          ev.target.style.height = `${ev.height}px`;
          const sx = ev.datas.__startX ?? 0;
          const sy = ev.datas.__startY ?? 0;
          const tx = ev.drag.beforeTranslate?.[0] ?? 0;
          const ty = ev.drag.beforeTranslate?.[1] ?? 0;
          ev.target.style.left = `${sx + tx}px`;
          ev.target.style.top = `${sy + ty}px`;
        });
      }}
      onRotateStart={(e: any) => {
        const id = e.target ? getId(e.target) : null;
        if (!id) return;
        const data = elementsById.get(id);
        if (!data) return;
        e.set(data.rotate ?? 0);
      }}
      onRotate={(e: any) => {
        e.target.style.transform = `rotate(${e.beforeRotate}deg)`;
      }}
      onRotateGroup={(e: any) => {
        e.events.forEach((ev: any) => {
          ev.target.style.transform = `rotate(${ev.beforeRotate}deg)`;
        });
      }}
      onDragEnd={(e: any) => {
        const id = e.target ? getId(e.target) : null;
        if (!id) return;
        const data = elementsById.get(id);
        if (!data) return;
        const sx = e.datas.__startX ?? data.x;
        const sy = e.datas.__startY ?? data.y;
        const tx = e.lastEvent?.beforeTranslate?.[0] ?? 0;
        const ty = e.lastEvent?.beforeTranslate?.[1] ?? 0;
        updateElement(id, { x: sx + tx, y: sy + ty });
        updateRectNextFrame();
      }}
      onDragGroupEnd={(e: any) => {
        e.events.forEach((ev: any) => {
          const id = ev.target ? getId(ev.target) : null;
          if (!id) return;
          const data = elementsById.get(id);
          if (!data) return;
          const sx = ev.datas.__startX ?? data.x;
          const sy = ev.datas.__startY ?? data.y;
          const tx = ev.lastEvent?.beforeTranslate?.[0] ?? 0;
          const ty = ev.lastEvent?.beforeTranslate?.[1] ?? 0;
          updateElement(id, { x: sx + tx, y: sy + ty });
        });
        updateRectNextFrame();
      }}
      onResizeEnd={(e: any) => {
        const id = e.target ? getId(e.target) : null;
        if (!id) return;
        const data = elementsById.get(id);
        if (!data) return;
        const width = e.lastEvent?.width ?? data.width;
        const height = e.lastEvent?.height ?? data.height;
        const tx = e.lastEvent?.drag?.beforeTranslate?.[0] ?? 0;
        const ty = e.lastEvent?.drag?.beforeTranslate?.[1] ?? 0;
        const sx = e.datas.__startX ?? data.x;
        const sy = e.datas.__startY ?? data.y;
        updateElement(id, { width, height, x: sx + tx, y: sy + ty });
        updateRectNextFrame();
      }}
      onResizeGroupEnd={(e: any) => {
        e.events.forEach((ev: any) => {
          const id = ev.target ? getId(ev.target) : null;
          if (!id) return;
          const data = elementsById.get(id);
          if (!data) return;
          const width = ev.lastEvent?.width ?? data.width;
          const height = ev.lastEvent?.height ?? data.height;
          const tx = ev.lastEvent?.drag?.beforeTranslate?.[0] ?? 0;
          const ty = ev.lastEvent?.drag?.beforeTranslate?.[1] ?? 0;
          const sx = ev.datas.__startX ?? data.x;
          const sy = ev.datas.__startY ?? data.y;
          updateElement(id, { width, height, x: sx + tx, y: sy + ty });
        });
        updateRectNextFrame();
      }}
      onRotateEnd={(e: any) => {
        const id = e.target ? getId(e.target) : null;
        if (!id) return;
        const data = elementsById.get(id);
        if (!data) return;
        const rotate = e.lastEvent?.beforeRotate ?? data.rotate ?? 0;
        updateElement(id, { rotate });
        updateRectNextFrame();
      }}
      onRotateGroupEnd={(e: any) => {
        e.events.forEach((ev: any) => {
          const id = ev.target ? getId(ev.target) : null;
          if (!id) return;
          const data = elementsById.get(id);
          if (!data) return;
          const rotate = ev.lastEvent?.beforeRotate ?? data.rotate ?? 0;
          updateElement(id, { rotate });
        });
        updateRectNextFrame();
      }}
    />
  );
}

