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
  Switch,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
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
  className?: string;
};

export function ReactViewPanel({ initialZoom = 1, className }: ReactViewPanelProps) {
  const { elements, byId, updateElement } = usePanelElements();

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [zoom, setZoom] = useState(initialZoom);
  const [scroll, setScroll] = useState({ left: 0, top: 0 });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedTargets, setSelectedTargets] = useState<HTMLElement[]>([]);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const update = () => setIsDark(root.classList.contains("dark"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

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
    <div className={["h-full w-full bg-background text-foreground", className ?? ""].join(" ")}>
      <ResizablePanelGroup direction="horizontal" className="h-full w-full">
        <ResizablePanel defaultSize={20} minSize={20}>
          <MaterialSidebar />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={60} minSize={10}>
          {/* Center workspace */}
          <div className="min-w-0 h-full">
            <div className="relative h-full overflow-hidden border border-border bg-background">
              {/* Top bar */}
              <div className="flex items-center gap-2 border-b border-border bg-background/90 px-3 py-2 text-foreground">
                <strong className="text-xs font-semibold">Panel</strong>
                <div className="flex-1" />
                <TooltipProvider delayDuration={150}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative">
                        <Switch
                          checked={isDark}
                          onCheckedChange={(checked) => {
                            const root = document.documentElement;
                            root.classList.toggle("dark", checked);
                            root.dataset.theme = checked ? "dark" : "light";
                            try {
                              localStorage.setItem("theme", checked ? "dark" : "light");
                            } catch {
                              // ignore storage errors
                            }
                            setIsDark(checked);
                          }}
                          aria-label="切换主题"
                          className="data-[state=checked]:bg-primary/80 data-[state=unchecked]:bg-secondary"
                        />
                        <div
                          className={[
                            "pointer-events-none absolute left-0.5 top-0.5 flex h-5 w-5 items-center justify-center transition-transform duration-200",
                            isDark ? "translate-x-5" : "translate-x-0",
                          ].join(" ")}
                        >
                          {isDark ? (
                            <svg
                              viewBox="0 0 24 24"
                              className="h-3 w-3 text-foreground"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                            >
                              <path d="M21 12.79A9 9 0 1 1 11.21 3c0 .66.08 1.3.22 1.92A7 7 0 0 0 19.08 12c.62.14 1.26.22 1.92.22Z" />
                            </svg>
                          ) : (
                            <svg
                              viewBox="0 0 24 24"
                              className="h-3 w-3 text-foreground"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                            >
                              <circle cx="12" cy="12" r="4" />
                              <path d="M12 2v2.5M12 19.5V22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M2 12h2.5M19.5 12H22M4.93 19.07 6.7 17.3M17.3 6.7l1.77-1.77" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>切换深色/浅色主题</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() =>
                          setZoom((z) => Math.max(0.25, Number((z - 0.1).toFixed(2))))
                        }
                        className="rounded-md border border-border bg-secondary px-2 py-1 text-xs text-secondary-foreground hover:bg-secondary/80"
                      >
                        -
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>缩小画布</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span className="w-16 text-center text-xs">
                  {(zoom * 100).toFixed(0)}%
                </span>
                <TooltipProvider delayDuration={150}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() =>
                          setZoom((z) => Math.min(4, Number((z + 0.1).toFixed(2))))
                        }
                        className="rounded-md border border-border bg-secondary px-2 py-1 text-xs text-secondary-foreground hover:bg-secondary/80"
                      >
                        +
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>放大画布</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
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
          <aside className="h-full border-l border-border bg-background px-3 py-3 text-foreground">
            <div className="mb-2 text-xs font-semibold">配置</div>
            <div className="text-xs leading-6 text-muted-foreground">
              这里先留空。后续可放属性编辑、图层树、样式配置等。
            </div>
          </aside>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
