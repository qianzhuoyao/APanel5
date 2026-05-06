import React, { useCallback, useEffect, useRef, useState } from "react";

import { usePanelElements } from "./hooks/usePanelElements";
import { PanelCanvas } from "./components/PanelCanvas";
import { PanelRulers } from "./components/PanelRulers";
import { ElementsLayer } from "./components/ElementsLayer";
import { SelectLayer } from "./components/SelectLayer";
import { MoveableLayer } from "./components/MoveableLayer";

function getSelectedTargetsFromIds(container: HTMLElement | null, ids: string[]) {
  if (!container) return [];
  const targets: HTMLElement[] = [];
  for (const id of ids) {
    const el = container.querySelector<HTMLElement>(`[data-element-id="${id}"]`);
    if (el) targets.push(el);
  }
  return targets;
}

export type ReactViewPanelProps = {
  initialZoom?: number;
};

export function ReactViewPanel({ initialZoom = 1 }: ReactViewPanelProps) {
  const { elements, byId, updateElement } = usePanelElements();

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [zoom, setZoom] = useState(initialZoom);
  const [scroll, setScroll] = useState({ left: 0, top: 0 });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedTargets, setSelectedTargets] = useState<HTMLElement[]>([]);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
    setSelectedTargets([]);
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setScroll({ left: el.scrollLeft, top: el.scrollTop });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    handleScroll();
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll as any);
  }, [handleScroll]);

  const handleSelectedIdsChange = useCallback((ids: string[]) => {
    setSelectedIds(ids);
  }, []);

  // 同步点击选中 -> targets
  useEffect(() => {
    setSelectedTargets(getSelectedTargetsFromIds(canvasRef.current, selectedIds));
  }, [selectedIds]);

  const canvasContainer = canvasRef.current;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        border: "1px solid rgba(0,0,0,0.12)",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 12px",
          borderBottom: "1px solid rgba(0,0,0,0.10)",
          background: "rgba(0,0,0,0.02)",
        }}
      >
        <strong style={{ fontSize: 12, opacity: 0.85 }}>React View Panel</strong>
        <div style={{ flex: 1 }} />
        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(0.25, Number((z - 0.1).toFixed(2))))}
        >
          -
        </button>
        <span style={{ width: 64, textAlign: "center", fontSize: 12 }}>
          {(zoom * 100).toFixed(0)}%
        </span>
        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(4, Number((z + 0.1).toFixed(2))))}
        >
          +
        </button>
      </div>

      <div style={{ position: "relative", width: "100%", height: "calc(100% - 41px)" }}>
        <PanelRulers
          zoom={zoom}
          scrollLeft={scroll.left}
          scrollTop={scroll.top}
          onZoomChange={setZoom}
        />

        <PanelCanvas
          ref={scrollRef}
          zoom={zoom}
          onZoomChange={setZoom}
          canvasRef={canvasRef}
          onCanvasMouseDownCapture={(e) => {
            const target = e.target as HTMLElement | null;
            if (!target) return;
            // 点击在节点或 Moveable 控制框上时，不清空选择
            if (
              target.closest(".rv-selectable") ||
              target.closest(".moveable-control-box") ||
              target.closest(".moveable-line") ||
              target.closest(".moveable-control") ||
              target.closest(".moveable-direction")
            ) {
              return;
            }
            clearSelection();
          }}
          className=""
        >
          <ElementsLayer
            elements={elements}
            selectedIds={selectedIds}
            onSelectIds={setSelectedIds}
          />

          <SelectLayer
            container={canvasContainer}
            dragContainer={scrollRef.current}
            rootContainer={scrollRef.current}
            selectedIds={selectedIds}
            onSelectedIdsChange={handleSelectedIdsChange}
          />

          <MoveableLayer
            zoom={zoom}
            selectedTargets={selectedTargets}
            elementsById={byId}
            updateElement={updateElement}
          />
        </PanelCanvas>
      </div>
    </div>
  );
}

