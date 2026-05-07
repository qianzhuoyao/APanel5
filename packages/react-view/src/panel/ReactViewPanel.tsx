import React, { useCallback, useEffect, useRef, useState } from "react";

import { usePanelElements } from "./hooks/usePanelElements";
import { PanelCanvas } from "./components/PanelCanvas";
import { PanelRulers } from "./components/PanelRulers";
import { ElementsLayer } from "./components/ElementsLayer";
import { SelectLayer } from "./components/SelectLayer";
import { MoveableLayer } from "./components/MoveableLayer";
import { MaterialSidebar } from "./components/MaterialSidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@arron/ui";

function getSelectedTargetsFromIds(
  container: HTMLElement | null,
  ids: string[],
) {
  if (!container) return [];
  const targets: HTMLElement[] = [];
  for (const id of ids) {
    const el = container.querySelector<HTMLElement>(
      `[data-element-id="${id}"]`,
    );
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

  // 平移/滚动由 InfiniteViewer 驱动，通过 PanelCanvas 回传

  const handleSelectedIdsChange = useCallback((ids: string[]) => {
    setSelectedIds(ids);
  }, []);

  // 同步点击选中 -> targets
  useEffect(() => {
    setSelectedTargets(
      getSelectedTargetsFromIds(canvasRef.current, selectedIds),
    );
  }, [selectedIds]);

  const canvasContainer = canvasRef.current;

  return (
    <div className="h-full w-full bg-slate-50">
      <ResizablePanelGroup direction="horizontal" className="h-full w-full">
        <ResizablePanel defaultSize={20} minSize={20}>
          <MaterialSidebar />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={60} minSize={10}>
          {/* Center workspace */}
          <div className="min-w-0 h-full">
            <div className="relative h-full overflow-hidden border border-black/10 bg-slate-900">
              {/* Top bar */}
              <div className="flex items-center gap-2 border-b border-white/10 bg-slate-900/90 px-3 py-2 text-white/85">
                <strong className="text-xs font-semibold">Panel</strong>
                <div className="flex-1" />
                <button
                  type="button"
                  onClick={() =>
                    setZoom((z) => Math.max(0.25, Number((z - 0.1).toFixed(2))))
                  }
                  className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs hover:bg-white/10"
                >
                  -
                </button>
                <span className="w-16 text-center text-xs">
                  {(zoom * 100).toFixed(0)}%
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setZoom((z) => Math.min(4, Number((z + 0.1).toFixed(2))))
                  }
                  className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs hover:bg-white/10"
                >
                  +
                </button>
              </div>

              {/* Stage */}
              <div className="relative h-[calc(100%-41px)]">
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
                  onScrollChange={setScroll}
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
                  className="h-full w-full"
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
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={20} minSize={20}>
          {/* Right config sidebar (placeholder) */}
          <aside className="h-full border-l border-black/10 bg-slate-950 px-3 py-3 text-white/85">
            <div className="mb-2 text-xs font-semibold">配置</div>
            <div className="text-xs leading-6 text-white/70">
              这里先留空。后续可放属性编辑、图层树、样式配置等。
            </div>
          </aside>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
