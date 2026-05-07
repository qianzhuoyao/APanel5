import React, { useCallback, useEffect, useRef, useState } from "react";

import { usePanelElements } from "./hooks/usePanelElements";
import { PanelCanvas } from "./components/PanelCanvas";
import { PanelRulers } from "./components/PanelRulers";
import { ElementsLayer } from "./components/ElementsLayer";
import { SelectLayer } from "./components/SelectLayer";
import { MoveableLayer } from "./components/MoveableLayer";
import { MaterialSidebar } from "./components/MaterialSidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@arron/ui";

function IconPlus() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function IconMerge() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 7h4a4 4 0 0 1 4 4v6" />
      <path d="m12 14 3 3 3-3" />
      <path d="M7 17h2" />
    </svg>
  );
}

function IconLock({ locked }: { locked: boolean }) {
  return locked ? (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="11" width="16" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="11" width="16" height="9" rx="2" />
      <path d="M16 11V8a4 4 0 0 0-7-2.5" />
    </svg>
  );
}

function IconEdit() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 20h9" />
      <path d="m16.5 3.5 4 4L8 20l-5 1 1-5Z" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m5 12 5 5L20 7" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function IconChevron({ expanded }: { expanded: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
      {expanded ? <path d="m6 14 6-6 6 6" /> : <path d="m6 10 6 6 6-6" />}
    </svg>
  );
}

function IconUndo() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 14 4 9l5-5" />
      <path d="M20 20a9 9 0 0 0-9-9H4" />
    </svg>
  );
}

function IconRedo() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m15 14 5-5-5-5" />
      <path d="M4 20a9 9 0 0 1 9-9h7" />
    </svg>
  );
}

function IconHistory() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v4h4" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

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

function shouldClearSelectionOnBlank(target: HTMLElement | null) {
  if (!target) return false;
  if (
    target.closest(".rv-selectable") ||
    target.closest(".moveable-control-box") ||
    target.closest(".moveable-line") ||
    target.closest(".moveable-control") ||
    target.closest(".moveable-direction")
  ) {
    return false;
  }
  if (
    target.closest("button") ||
    target.closest("input") ||
    target.closest("select") ||
    target.closest("textarea") ||
    target.closest("label") ||
    target.closest("a") ||
    target.closest("[role='menuitem']") ||
    target.closest("[data-radix-popper-content-wrapper]")
  ) {
    return false;
  }
  return true;
}

export type ReactViewPanelProps = {
  initialZoom?: number;
  className?: string;
};

export function ReactViewPanel({ initialZoom = 1, className }: ReactViewPanelProps) {
  const {
    elements,
    byId,
    layers,
    activeLayerId,
    updateElement,
    deleteElement,
    duplicateElement,
    addElementFromMaterial,
    setActiveLayer,
    addLayer,
    renameLayer,
    toggleLayerLock,
    deleteLayer,
    toggleLayerMergeSelected,
    mergeSelectedLayers,
    undo,
    redo,
    canUndo,
    canRedo,
    historyCursor,
    history,
  } = usePanelElements();

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [zoom, setZoom] = useState(initialZoom);
  const [scroll, setScroll] = useState({ left: 0, top: 0 });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedTargets, setSelectedTargets] = useState<HTMLElement[]>([]);
  const [contextMenuNodeId, setContextMenuNodeId] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownEpoch, setDropdownEpoch] = useState(0);
  const [dropdownPoint, setDropdownPoint] = useState({ x: 0, y: 0 });
  const rightPointerRef = useRef<{
    active: boolean;
    moved: boolean;
    startX: number;
    startY: number;
  }>({ active: false, moved: false, startX: 0, startY: 0 });
  const [copiedNodeId, setCopiedNodeId] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);
  const [editingLayerName, setEditingLayerName] = useState("");
  const [confirmDeleteLayerId, setConfirmDeleteLayerId] = useState<string | null>(null);
  const [deleteMode, setDeleteMode] = useState<"remove" | "move">("move");
  const [deleteTargetLayerId, setDeleteTargetLayerId] = useState<string>("");
  const [isMergingLayers, setIsMergingLayers] = useState(false);
  const [mergeLayerName, setMergeLayerName] = useState("");
  const [isLayerPanelExpanded, setIsLayerPanelExpanded] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const mergeSelectedCount = layers.filter((l) => l.mergeSelected).length;
  const canMergeLayers = mergeSelectedCount >= 2;

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

  useEffect(() => {
    clearSelection();
  }, [activeLayerId, clearSelection]);

  useEffect(() => {
    if (isMergingLayers && !canMergeLayers) {
      setIsMergingLayers(false);
      setMergeLayerName("");
    }
  }, [canMergeLayers, isMergingLayers]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const cmdOrCtrl = e.metaKey || e.ctrlKey;
      if (!cmdOrCtrl) return;
      if (e.key.toLowerCase() !== "z") return;
      e.preventDefault();
      if (e.shiftKey) {
        if (canRedo) redo();
      } else if (canUndo) {
        undo();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [canRedo, canUndo, redo, undo]);

  // 平移/滚动由 InfiniteViewer 驱动，通过 PanelCanvas 回传

  const handleSelectedIdsChange = useCallback((ids: string[]) => {
    setSelectedIds(ids);
  }, []);

  // 同步点击选中 -> targets
  useEffect(() => {
    setSelectedTargets(
      getSelectedTargetsFromIds(canvasRef.current, selectedIds),
    );
  }, [selectedIds, elements, historyCursor]);

  useEffect(() => {
    const existing = new Set(elements.map((el) => el.id));
    setSelectedIds((prev) => prev.filter((id) => existing.has(id)));
  }, [elements]);

  const canvasContainer = canvasRef.current;
  const activeLayer = layers.find((l) => l.id === activeLayerId) ?? null;
  const deletingLayer = layers.find((l) => l.id === confirmDeleteLayerId) ?? null;
  const deleteTargetCandidates = layers.filter((l) => l.id !== confirmDeleteLayerId);

  const isRightLikePointer = (e: React.PointerEvent<HTMLElement>) =>
    e.button === 2 || (e.button === 0 && e.ctrlKey);

  return (
    <div className={["h-full w-full bg-background text-foreground", className ?? ""].join(" ")}>
      <ResizablePanelGroup direction="horizontal" className="h-full w-full">
        <ResizablePanel defaultSize={15} minSize={15}>
          <MaterialSidebar />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={65} minSize={10}>
          {/* Center workspace */}
          <div
            className="min-w-0 h-full"
            onMouseDownCapture={(e) => {
              if (e.button !== 0) return;
              const target = e.target as HTMLElement | null;
              if (!shouldClearSelectionOnBlank(target)) return;
              clearSelection();
            }}
          >
            <div className="relative flex h-full flex-col overflow-hidden border border-border bg-background">
              {/* Top bar */}
              <div className="relative z-20 flex items-center gap-2 border-b border-border bg-background/90 px-3 py-2 text-foreground">
                <strong className="text-xs font-semibold">Panel</strong>
                <div className="flex-1" />
                <TooltipProvider delayDuration={150}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={undo}
                        disabled={!canUndo}
                        className="rounded border border-border p-1 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="撤销"
                      >
                        <IconUndo />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="z-[10000]">撤销（Cmd/Ctrl + Z）</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={redo}
                        disabled={!canRedo}
                        className="rounded border border-border p-1 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="重做"
                      >
                        <IconRedo />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="z-[10000]">重做（Cmd/Ctrl + Shift + Z）</TooltipContent>
                  </Tooltip>
                  <DropdownMenu open={historyOpen} onOpenChange={setHistoryOpen}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="rounded border border-border p-1 hover:bg-accent"
                            aria-label="查看操作历史"
                          >
                            <IconHistory />
                          </button>
                        </DropdownMenuTrigger>
                      </TooltipTrigger>
                      <TooltipContent className="z-[10000]">查看操作历史</TooltipContent>
                    </Tooltip>
                    <DropdownMenuContent
                      align="end"
                      sideOffset={6}
                      className="z-[10000] w-72"
                    >
                      <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                        操作历史（最近 20 条）
                      </div>
                      <div className="max-h-64 overflow-auto px-1 pb-1">
                        {history.length === 0 ? (
                          <div className="px-2 py-1.5 text-xs text-muted-foreground">暂无历史</div>
                        ) : (
                          history
                            .slice(-20)
                            .reverse()
                            .map((item) => (
                              <div
                                key={item.index}
                                className={[
                                  "rounded px-2 py-1 text-xs",
                                  item.active
                                    ? "bg-primary/15 text-foreground"
                                    : "text-muted-foreground",
                                ].join(" ")}
                              >
                                <div className="truncate">{item.label}</div>
                                <div className="text-[10px] opacity-80">
                                  {new Date(item.timestamp).toLocaleTimeString()}
                                </div>
                              </div>
                            ))
                        )}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
                    <TooltipContent className="z-[10000]">切换深色/浅色主题</TooltipContent>
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
                    <TooltipContent className="z-[10000]">缩小画布</TooltipContent>
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
                    <TooltipContent className="z-[10000]">放大画布</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Stage */}
              <div className="relative min-h-0 flex-1">
                <PanelRulers
                  zoom={zoom}
                  scrollLeft={scroll.left}
                  scrollTop={scroll.top}
                  onZoomChange={setZoom}
                />

                <div
                  className="h-full w-full"
                  onPointerDownCapture={(e) => {
                    if (!isRightLikePointer(e)) return;
                    rightPointerRef.current.active = true;
                    rightPointerRef.current.moved = false;
                    rightPointerRef.current.startX = e.clientX;
                    rightPointerRef.current.startY = e.clientY;
                  }}
                  onPointerMoveCapture={(e) => {
                    if (!rightPointerRef.current.active) return;
                    const dx = e.clientX - rightPointerRef.current.startX;
                    const dy = e.clientY - rightPointerRef.current.startY;
                    if (Math.hypot(dx, dy) > 10) {
                      rightPointerRef.current.moved = true;
                    }
                  }}
                  onPointerUpCapture={(e) => {
                    if (!rightPointerRef.current.active) return;
                    const wasMoved = rightPointerRef.current.moved;
                    rightPointerRef.current.active = false;
                    if (!isRightLikePointer(e) || wasMoved) return;

                    const target = e.target as HTMLElement | null;
                    const nodeEl = target?.closest<HTMLElement>("[data-element-id]");
                    const nodeIdFromElement = nodeEl?.dataset.elementId ?? null;
                    const onMoveable =
                      !!target?.closest(".moveable-control-box") ||
                      !!target?.closest(".moveable-line") ||
                      !!target?.closest(".moveable-control") ||
                      !!target?.closest(".moveable-direction");
                    const nodeId =
                      nodeIdFromElement ??
                      (onMoveable && selectedIds.length > 0 ? selectedIds[0] : null);
                    const nextPoint = { x: e.clientX, y: e.clientY };

                    setDropdownOpen(false);
                    requestAnimationFrame(() => {
                      setContextMenuNodeId(nodeId);
                      setDropdownPoint(nextPoint);
                      setDropdownEpoch((v) => v + 1);
                      setDropdownOpen(true);
                    });
                  }}
                  onContextMenuCapture={(e) => {
                    // 统一禁用系统菜单；菜单弹出改为在 pointerup 阶段控制
                    e.preventDefault();
                  }}
                >
                  <PanelCanvas
                    ref={scrollRef}
                    zoom={zoom}
                    onZoomChange={setZoom}
                    onScrollChange={setScroll}
                    canvasRef={canvasRef}
                    onCanvasMouseDownCapture={(e) => {
                      if (e.button !== 0) return;
                      const target = e.target as HTMLElement | null;
                      if (!shouldClearSelectionOnBlank(target)) return;
                      clearSelection();
                    }}
                    onDropMaterial={({ materialId, x, y }) => {
                      addElementFromMaterial(materialId, x, y);
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
                      refreshToken={historyCursor}
                    />
                  </PanelCanvas>
                </div>
                <DropdownMenu
                  key={dropdownEpoch}
                  open={dropdownOpen}
                  onOpenChange={setDropdownOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      aria-hidden="true"
                      tabIndex={-1}
                      className="pointer-events-none fixed h-0 w-0 opacity-0"
                      style={{ left: dropdownPoint.x, top: dropdownPoint.y }}
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" sideOffset={6}>
                    {contextMenuNodeId ? (
                      <>
                        <DropdownMenuItem
                          onClick={() => {
                            setCopiedNodeId(contextMenuNodeId);
                          }}
                        >
                          复制节点
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            deleteElement(contextMenuNodeId);
                            setSelectedIds((prev) =>
                              prev.filter((sid) => sid !== contextMenuNodeId)
                            );
                            setContextMenuNodeId(null);
                          }}
                        >
                          删除节点
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem
                          disabled={!copiedNodeId}
                          onClick={() => {
                            if (!copiedNodeId) return;
                            duplicateElement(copiedNodeId);
                          }}
                        >
                          粘贴节点
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          disabled={elements.length === 0}
                          onClick={() => {
                            setSelectedIds(elements.map((el) => el.id));
                          }}
                        >
                          全选当前图层
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="border-t border-border bg-background/95 px-2 py-1.5">
                <TooltipProvider delayDuration={120}>
                  <Tabs value={activeLayerId} onValueChange={setActiveLayer}>
                    <div className="mb-1 flex items-center gap-2">
                      <div className="text-[11px] font-semibold text-muted-foreground">图层</div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            onClick={() => setIsLayerPanelExpanded((v) => !v)}
                            aria-label={isLayerPanelExpanded ? "收起图层输入区" : "展开图层输入区"}
                            className="rounded border border-border p-1 hover:bg-accent"
                          >
                            <IconChevron expanded={isLayerPanelExpanded} />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="z-[10000]">
                          {isLayerPanelExpanded ? "收起输入区" : "展开输入区"}
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            onClick={addLayer}
                            aria-label="新增图层"
                            className="rounded border border-border p-1 hover:bg-accent"
                          >
                            <IconPlus />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="z-[10000]">新增图层</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            onClick={() => {
                            if (!canMergeLayers) return;
                              setIsMergingLayers(true);
                            }}
                            aria-label="合并图层"
                          disabled={!canMergeLayers}
                          className="rounded border border-border p-1 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <IconMerge />
                          </button>
                        </TooltipTrigger>
                      <TooltipContent className="z-[10000]">
                        {canMergeLayers ? "合并图层" : "至少勾选 2 个图层后可合并"}
                      </TooltipContent>
                      </Tooltip>
                    </div>

                    <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto bg-muted/40 p-1">
                      {layers.map((layer) => (
                        <TabsTrigger
                          key={layer.id}
                          value={layer.id}
                          className="flex min-w-[120px] items-center gap-1 px-2 py-1 text-xs"
                        >
                          <span className="truncate">{layer.name}</span>
                          {layer.locked ? <IconLock locked /> : null}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    <TabsContent value={activeLayerId} className="mt-2 space-y-2">
                      {activeLayer ? (
                        <div className="flex items-center gap-2 rounded border border-border bg-card px-2 py-1.5 text-xs">
                          <span className="truncate font-medium">{activeLayer.name}</span>
                          <div className="flex-1" />
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                onClick={() => toggleLayerLock(activeLayer.id)}
                                disabled={!activeLayer.editable}
                                aria-label={activeLayer.locked ? "解锁图层" : "锁定图层"}
                                className="rounded border border-border p-1 disabled:opacity-40"
                              >
                                <IconLock locked={activeLayer.locked} />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent className="z-[10000]">
                              {activeLayer.locked ? "解锁图层" : "锁定图层"}
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingLayerId(activeLayer.id);
                                  setEditingLayerName(activeLayer.name);
                                }}
                                disabled={!activeLayer.editable}
                                aria-label="重命名图层"
                                className="rounded border border-border p-1 disabled:opacity-40"
                              >
                                <IconEdit />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent className="z-[10000]">重命名图层</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                onClick={() => {
                                  setConfirmDeleteLayerId(activeLayer.id);
                                  const firstTarget = layers.find((l) => l.id !== activeLayer.id);
                                  setDeleteTargetLayerId(firstTarget?.id ?? "");
                                  setDeleteMode("move");
                                }}
                                disabled={!activeLayer.editable}
                                aria-label={
                                  activeLayer.editable ? "删除图层" : "默认图层不可删除"
                                }
                                className="rounded border border-border p-1 disabled:opacity-40"
                              >
                                <IconTrash />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent className="z-[10000]">
                              {activeLayer.editable ? "删除图层" : "默认图层不可删除"}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      ) : null}

                      {isLayerPanelExpanded ? (
                        <div className="rounded border border-border bg-card px-2 py-1.5 text-xs">
                          <div className="mb-1 text-muted-foreground">选择合并图层</div>
                          <div className="flex flex-wrap gap-2">
                            {layers.map((layer) => (
                              <label key={layer.id} className="flex items-center gap-1.5">
                                <input
                                  type="checkbox"
                                  checked={Boolean(layer.mergeSelected)}
                                  onChange={() => toggleLayerMergeSelected(layer.id)}
                                  className="h-3.5 w-3.5"
                                />
                                <span className="max-w-[120px] truncate">{layer.name}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </TabsContent>
                  </Tabs>

                {isLayerPanelExpanded && editingLayerId ? (
                  <div className="mt-2 flex items-center gap-2 rounded border border-border bg-card px-2 py-1.5 text-xs">
                    <span className="text-muted-foreground">编辑图层名</span>
                    <input
                      value={editingLayerName}
                      onChange={(e) => setEditingLayerName(e.target.value)}
                      className="h-7 min-w-0 flex-1 rounded border border-border bg-background px-2 outline-none"
                      placeholder="请输入图层名称"
                      autoFocus
                    />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => {
                            renameLayer(editingLayerId, editingLayerName);
                            setEditingLayerId(null);
                            setEditingLayerName("");
                          }}
                          aria-label="保存图层名称"
                          className="rounded border border-border p-1 hover:bg-accent"
                        >
                          <IconCheck />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="z-[10000]">保存图层名称</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingLayerId(null);
                            setEditingLayerName("");
                          }}
                          aria-label="取消编辑图层名称"
                          className="rounded border border-border p-1 hover:bg-accent"
                        >
                          <IconClose />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="z-[10000]">取消编辑</TooltipContent>
                    </Tooltip>
                  </div>
                ) : null}
                {isLayerPanelExpanded && isMergingLayers ? (
                  <div className="mt-2 flex items-center gap-2 rounded border border-border bg-card px-2 py-1.5 text-xs">
                    <span className="text-muted-foreground">合并后图层名</span>
                    <input
                      value={mergeLayerName}
                      onChange={(e) => setMergeLayerName(e.target.value)}
                      className="h-7 min-w-0 flex-1 rounded border border-border bg-background px-2 outline-none"
                      placeholder="可空，留空将随机命名"
                      autoFocus
                    />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => {
                            if (!canMergeLayers) return;
                            mergeSelectedLayers(mergeLayerName || undefined);
                            setIsMergingLayers(false);
                            setMergeLayerName("");
                          }}
                          aria-label="确认合并图层"
                          disabled={!canMergeLayers}
                          className="rounded border border-border p-1 hover:bg-accent"
                        >
                          <IconCheck />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="z-[10000]">确认合并</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => {
                            setIsMergingLayers(false);
                            setMergeLayerName("");
                          }}
                          aria-label="取消合并图层"
                          className="rounded border border-border p-1 hover:bg-accent"
                        >
                          <IconClose />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="z-[10000]">取消合并</TooltipContent>
                    </Tooltip>
                  </div>
                ) : null}
                {isLayerPanelExpanded && deletingLayer ? (
                  <div className="mt-2 rounded border border-border bg-card px-2 py-2 text-xs">
                    <div className="mb-2">
                      确认删除图层：
                      <span className="font-semibold">{deletingLayer.name}</span>
                    </div>
                    <div className="mb-2 flex items-center gap-3">
                      <label className="flex items-center gap-1.5">
                        <input
                          type="radio"
                          checked={deleteMode === "move"}
                          onChange={() => setDeleteMode("move")}
                        />
                        节点迁移到
                      </label>
                      <select
                        value={deleteTargetLayerId}
                        onChange={(e) => setDeleteTargetLayerId(e.target.value)}
                        disabled={deleteMode !== "move" || deleteTargetCandidates.length === 0}
                        className="h-7 rounded border border-border bg-background px-2 disabled:opacity-50"
                      >
                        {deleteTargetCandidates.map((l) => (
                          <option key={l.id} value={l.id}>
                            {l.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-2">
                      <label className="flex items-center gap-1.5">
                        <input
                          type="radio"
                          checked={deleteMode === "remove"}
                          onChange={() => setDeleteMode("remove")}
                        />
                        同时删除该图层下所有节点
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            onClick={() => {
                              deleteLayer(deletingLayer.id, {
                                mode: deleteMode,
                                targetLayerId: deleteTargetLayerId || undefined,
                              });
                              setConfirmDeleteLayerId(null);
                              setDeleteMode("move");
                              setDeleteTargetLayerId("");
                            }}
                            aria-label="确认删除图层"
                            className="rounded border border-border p-1 hover:bg-accent"
                          >
                            <IconCheck />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="z-[10000]">确认删除</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            onClick={() => {
                              setConfirmDeleteLayerId(null);
                              setDeleteMode("move");
                              setDeleteTargetLayerId("");
                            }}
                            aria-label="取消删除图层"
                            className="rounded border border-border p-1 hover:bg-accent"
                          >
                            <IconClose />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="z-[10000]">取消删除</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                ) : null}
                </TooltipProvider>
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
