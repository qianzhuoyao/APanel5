import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { State } from "../../../rx-store/src/types";
import type { PanelElement } from "./types";

import { usePanelElements } from "./hooks/usePanelElements";
import { PanelCanvas } from "./components/PanelCanvas";
import { PanelRulers } from "./components/PanelRulers";
import { ElementsLayer } from "./components/ElementsLayer";
import { SelectLayer } from "./components/SelectLayer";
import { MoveableLayer } from "./components/MoveableLayer";
import { buildChartOption, CHART_TYPES } from "./utils/chartOptionBuilder";
import { MaterialSidebar } from "./components/MaterialSidebar";
import { PanelConfigSidebar } from "./components/PanelConfigSidebar";
import { PANEL_MESSAGES } from "./constants/messages";
import { PANEL_Z_INDEX } from "./constants/zIndex";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Empty,
  EmptyDescription,
  EmptyIcon,
  EmptyTitle,
  Input,
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarTrigger,
  RadioGroup,
  RadioGroupItem,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toaster,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  toast,
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

function IconBringFront() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 17h10M12 17V7" />
      <path d="m8.5 9 3.5-3.5L15.5 9" />
    </svg>
  );
}

function IconSendBack() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 7h10M12 17V7" />
      <path d="m15.5 15-3.5 3.5L8.5 15" />
    </svg>
  );
}

function IconForward() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 18V6" />
      <path d="m8.5 9 3.5-3.5L15.5 9" />
    </svg>
  );
}

function IconBackward() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 6v12" />
      <path d="m15.5 15-3.5 3.5L8.5 15" />
    </svg>
  );
}

function IconLayers() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m12 4 8 4-8 4-8-4 8-4Z" />
      <path d="m4 12 8 4 8-4" />
      <path d="m4 16 8 4 8-4" />
    </svg>
  );
}

function IconImage() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="10" r="1.5" />
      <path d="m21 16-5.5-5.5L7 19" />
    </svg>
  );
}

function formatRelativeTime(timestamp: number, now: number): string {
  const diff = Math.max(0, now - timestamp);
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}秒前`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}分钟前`;
  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour}小时前`;
  const day = Math.floor(hour / 24);
  return `${day}天前`;
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
  const THEME_STORAGE_KEY = "panel:theme";
  const TITLE_ICON_STORAGE_KEY = "panel:titleIconDataUrl";
  const themedScrollbarClass =
    "scrollbar-thin [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-muted/40 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border/80 [&::-webkit-scrollbar-thumb]:hover:bg-border";
  const {
    elements,
    allElements,
    byId,
    layers,
    activeLayerId,
    updateElement,
    deleteElement,
    deleteElements,
    bringElementsToFront,
    sendElementsToBack,
    bringElementsForward,
    sendElementsBackward,
    duplicateElement,
    setReferenceCopyMode,
    addElementFromMaterial,
    setActiveLayer,
    addLayer,
    openElementsInNewLayer,
    renameLayer,
    toggleLayerLock,
    deleteLayer,
    toggleLayerMergeSelected,
    mergeSelectedLayers,
    undo,
    redo,
    goToHistory,
    canUndo,
    canRedo,
    historyCursor,
    history,
    exportPanelData,
    importPanelData,
  } = usePanelElements();

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const panelRootRef = useRef<HTMLDivElement | null>(null);
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
  const importInputRef = useRef<HTMLInputElement | null>(null);
  const titleIconInputRef = useRef<HTMLInputElement | null>(null);
  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);
  const [editingLayerName, setEditingLayerName] = useState("");
  const [confirmDeleteLayerId, setConfirmDeleteLayerId] = useState<string | null>(null);
  const [deleteMode, setDeleteMode] = useState<"remove" | "move">("move");
  const [deleteTargetLayerId, setDeleteTargetLayerId] = useState<string>("");
  const [isMergingLayers, setIsMergingLayers] = useState(false);
  const [mergeLayerName, setMergeLayerName] = useState("");
  const [mappingDeleteConfirmOpen, setMappingDeleteConfirmOpen] = useState(false);
  const [mappingDeleteImpactCount, setMappingDeleteImpactCount] = useState(0);
  const mappingDeleteProceedRef = useRef<(() => void) | null>(null);
  const [isLayerPanelExpanded, setIsLayerPanelExpanded] = useState(false);
  const [isHistoryPanelExpanded, setIsHistoryPanelExpanded] = useState(false);
  const [historyNow, setHistoryNow] = useState(Date.now());
  const [historyKeyword, setHistoryKeyword] = useState("");
  const [productName, setProductName] = useState("未命名产物");
  const [titleIconDataUrl, setTitleIconDataUrl] = useState<string>("");
  const [titleIconPreviewOpen, setTitleIconPreviewOpen] = useState(false);
  const [titleIconZoom, setTitleIconZoom] = useState(1.6);
  const [panelFontSize, setPanelFontSize] = useState<"sm" | "md" | "lg">("md");
  const [ellipsisTooltip, setEllipsisTooltip] = useState<{
    open: boolean;
    text: string;
    x: number;
    y: number;
  }>({
    open: false,
    text: "",
    x: 0,
    y: 0,
  });
  const mergeSelectedCount = layers.filter((l) => l.mergeSelected && !l.isMapping).length;
  const canMergeLayers = mergeSelectedCount >= 2;
  const panelFontPx = panelFontSize === "sm" ? 12 : panelFontSize === "lg" ? 15 : 13;
  const normalizedHistoryKeyword = historyKeyword.trim().toLowerCase();
  useEffect(() => {
    if (!isHistoryPanelExpanded) return;
    setHistoryNow(Date.now());
    const timer = window.setInterval(() => setHistoryNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [isHistoryPanelExpanded]);
  const applyTheme = useCallback((checked: boolean) => {
    const root = document.documentElement;
    root.classList.toggle("dark", checked);
    root.dataset.theme = checked ? "dark" : "light";
    try {
      // panel 独立持久化键，避免与宿主应用的通用 theme 键互相覆盖
      localStorage.setItem(THEME_STORAGE_KEY, checked ? "dark" : "light");
      // 兼容旧逻辑与其他依赖 theme 的读取方
      localStorage.setItem("theme", checked ? "dark" : "light");
    } catch {
      // ignore storage errors
    }
    setIsDark(checked);
  }, [THEME_STORAGE_KEY]);

  useEffect(() => {
    const root = document.documentElement;
    try {
      const storedTheme =
        localStorage.getItem(THEME_STORAGE_KEY) ?? localStorage.getItem("theme");
      if (storedTheme === "dark" || storedTheme === "light") {
        applyTheme(storedTheme === "dark");
      } else {
        // 默认黑色主题，并持久化
        applyTheme(true);
      }
    } catch {
      // 读取失败时也回落到默认黑色
      applyTheme(true);
    }
    const update = () => setIsDark(root.classList.contains("dark"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [THEME_STORAGE_KEY, applyTheme]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("panel:fontSize");
      if (stored === "sm" || stored === "md" || stored === "lg") {
        setPanelFontSize(stored);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("panel:fontSize", panelFontSize);
    } catch {
      // ignore storage errors
    }
  }, [panelFontSize]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(TITLE_ICON_STORAGE_KEY) ?? "";
      if (stored) setTitleIconDataUrl(stored);
    } catch {
      // ignore storage errors
    }
  }, [TITLE_ICON_STORAGE_KEY]);

  useEffect(() => {
    try {
      if (titleIconDataUrl) {
        localStorage.setItem(TITLE_ICON_STORAGE_KEY, titleIconDataUrl);
      } else {
        localStorage.removeItem(TITLE_ICON_STORAGE_KEY);
      }
    } catch {
      // ignore storage errors
    }
  }, [TITLE_ICON_STORAGE_KEY, titleIconDataUrl]);

  useEffect(() => {
    if (!titleIconPreviewOpen) return;
    setTitleIconZoom(1.6);
  }, [titleIconPreviewOpen, titleIconDataUrl]);

  useEffect(() => {
    const root = panelRootRef.current;
    if (!root) return;
    let rafId = 0;
    const schedule = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        const candidates = root.querySelectorAll<HTMLElement>(
          ".truncate, .line-clamp-1, .line-clamp-2, .line-clamp-3"
        );
        candidates.forEach((el) => {
          const text = (el.textContent ?? "").trim();
          if (!text) {
            delete el.dataset.ellipsisOverflow;
            delete el.dataset.ellipsisTooltipText;
            return;
          }
          const overflowed =
            el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1;
          if (overflowed) {
            el.dataset.ellipsisOverflow = "1";
            el.dataset.ellipsisTooltipText = text;
          } else {
            delete el.dataset.ellipsisOverflow;
            delete el.dataset.ellipsisTooltipText;
          }
        });
      });
    };

    schedule();
    const mutationObserver = new MutationObserver(schedule);
    mutationObserver.observe(root, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["class", "style"],
    });
    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(root);
    window.addEventListener("resize", schedule);
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      mutationObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("resize", schedule);
    };
  }, []);

  useEffect(() => {
    const root = panelRootRef.current;
    if (!root) return;
    const hide = () =>
      setEllipsisTooltip((prev) => (prev.open ? { ...prev, open: false } : prev));
    const onPointerMove = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      const holder = target?.closest<HTMLElement>("[data-ellipsis-overflow='1']");
      if (!holder) {
        hide();
        return;
      }
      const text = holder.dataset.ellipsisTooltipText ?? holder.textContent?.trim() ?? "";
      if (!text) {
        hide();
        return;
      }
      setEllipsisTooltip({
        open: true,
        text,
        x: e.clientX + 8,
        y: e.clientY + 14,
      });
    };
    root.addEventListener("pointermove", onPointerMove, true);
    root.addEventListener("pointerleave", hide, true);
    root.addEventListener("scroll", hide, true);
    return () => {
      root.removeEventListener("pointermove", onPointerMove, true);
      root.removeEventListener("pointerleave", hide, true);
      root.removeEventListener("scroll", hide, true);
    };
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
  const deletingLayerMode: "move" | "remove" =
    deletingLayer?.isMapping ? "remove" : deleteMode;
  const deleteTargetCandidates = layers.filter((l) => l.id !== confirmDeleteLayerId);
  const selectedElement = selectedIds.length === 1 ? byId.get(selectedIds[0]) ?? null : null;
  const selectedElements = useMemo(
    () => selectedIds.map((id) => byId.get(id)).filter((el): el is PanelElement => !!el),
    [byId, selectedIds]
  );
  const selectedNodeZOrderLabel = useMemo(() => {
    if (!selectedElement) return "-";
    return String(selectedElement.zIndex ?? 1);
  }, [selectedElement]);
  const layerById = useMemo(() => {
    const map = new Map<string, (typeof layers)[number]>();
    for (const layer of layers) map.set(layer.id, layer);
    return map;
  }, [layers]);

  const isRightLikePointer = (e: React.PointerEvent<HTMLElement>) =>
    e.button === 2 || (e.button === 0 && e.ctrlKey);
  const hasSelection = selectedIds.length > 0;
  const hasUnlockedSelection = selectedIds.some((id) => {
    const el = byId.get(id);
    if (!el || el.locked) return false;
    const layer = layerById.get(el.layerId);
    return !layer?.locked;
  });
  const showActionHint = useCallback((message: string) => {
    toast({
      title: "操作受限",
      description: message,
    });
  }, []);
  const hintUnlockNodeForDelete = useCallback(() => {
    showActionHint(PANEL_MESSAGES.nodeDeleteLocked);
  }, [showActionHint]);
  const hintUnlockLayerForDelete = useCallback(() => {
    showActionHint(PANEL_MESSAGES.nodeDeleteLayerLocked);
  }, [showActionHint]);
  const hintLockedNodesInBatchDelete = useCallback(() => {
    showActionHint(PANEL_MESSAGES.nodeBatchDeleteContainsLocked);
  }, [showActionHint]);
  const hintNodeNotFound = useCallback(() => {
    showActionHint(PANEL_MESSAGES.nodeNotFound);
  }, [showActionHint]);
  const hintUnlockNodeForMove = useCallback(() => {
    showActionHint(PANEL_MESSAGES.nodeMoveLocked);
  }, [showActionHint]);
  const hintUnlockSourceLayerForMove = useCallback(() => {
    showActionHint(PANEL_MESSAGES.nodeMoveSourceLayerLocked);
  }, [showActionHint]);
  const hintTargetLayerNotFound = useCallback(() => {
    showActionHint(PANEL_MESSAGES.targetLayerNotFound);
  }, [showActionHint]);
  const hintUnlockTargetLayerForMove = useCallback(() => {
    showActionHint(PANEL_MESSAGES.nodeMoveTargetLayerLocked);
  }, [showActionHint]);
  const getLayerDeleteBlockReason = useCallback(
    (layerId: string) => {
      const targetLayer = layerById.get(layerId);
      if (!targetLayer) return "图层不存在";
      if (!targetLayer.editable) return "默认图层不可删除";
      if (targetLayer.locked) return "锁定图层不可删除";
      if (targetLayer.isMapping) return null;
      const hasBlockingRef = allElements.some((el) => {
        if (el.layerId === layerId) return false;
        if (el.materialType !== "reference") return false;
        if (el.refLayerId !== layerId) return false;
        return (el.refCopyMode ?? "shallow") !== "deep";
      });
      if (hasBlockingRef) return "该图层仍被浅拷贝引用，请先删除引用节点或改为深拷贝";
      return null;
    },
    [allElements, layerById]
  );
  const requestDeleteWithMappingImpact = useCallback(
    (nodeIds: string[], onConfirm: () => void) => {
      const sourceIds = new Set(nodeIds.filter(Boolean));
      if (sourceIds.size === 0) {
        onConfirm();
        return;
      }
      const impactedLayerIds = new Set<string>();
      allElements.forEach((el) => {
        if (!el.mappingSourceNodeId) return;
        if (!sourceIds.has(el.mappingSourceNodeId)) return;
        impactedLayerIds.add(el.layerId);
      });
      if (impactedLayerIds.size === 0) {
        onConfirm();
        return;
      }
      mappingDeleteProceedRef.current = onConfirm;
      setMappingDeleteImpactCount(impactedLayerIds.size);
      setMappingDeleteConfirmOpen(true);
    },
    [allElements]
  );

  const handleExport = useCallback(() => {
    const data = exportPanelData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const safeName = (productName.trim() || "panel")
      .replace(/[\\/:*?"<>|]/g, "-")
      .replace(/\s+/g, "-");
    a.download = `${safeName}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [exportPanelData, productName]);

  const handleImportFile = useCallback(
    async (file: File) => {
      const text = await file.text();
      const parsed = JSON.parse(text) as State;
      const ok = importPanelData(parsed);
      if (!ok) {
        window.alert("导入失败：文件格式不正确");
      } else {
        setSelectedIds([]);
      }
    },
    [importPanelData]
  );

  const normalizeTitleIconFile = useCallback((file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("read-failed"));
      reader.onload = () => {
        const src = typeof reader.result === "string" ? reader.result : "";
        if (!src) {
          reject(new Error("empty-data"));
          return;
        }
        const img = new Image();
        img.onload = () => {
          const size = 64;
          const canvas = document.createElement("canvas");
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("canvas-context-failed"));
            return;
          }
          ctx.clearRect(0, 0, size, size);
          // 保持长宽比居中绘制，统一导出 PNG，提升 favicon 兼容性
          const scale = Math.min(size / img.width, size / img.height);
          const drawW = img.width * scale;
          const drawH = img.height * scale;
          const dx = (size - drawW) / 2;
          const dy = (size - drawH) / 2;
          ctx.drawImage(img, dx, dy, drawW, drawH);
          resolve(canvas.toDataURL("image/png"));
        };
        img.onerror = () => reject(new Error("image-decode-failed"));
        img.src = src;
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const handlePreviewLayer = useCallback(() => {
    const targetLayer = layers.find((l) => l.id === activeLayerId);
    const layerElements = allElements.filter((el) => el.layerId === activeLayerId);
    const getAABB = (el: PanelElement) => {
      const rad = ((el.rotate ?? 0) * Math.PI) / 180;
      const absCos = Math.abs(Math.cos(rad));
      const absSin = Math.abs(Math.sin(rad));
      const bw = el.width * absCos + el.height * absSin;
      const bh = el.width * absSin + el.height * absCos;
      const cx = el.x + el.width / 2;
      const cy = el.y + el.height / 2;
      return {
        left: cx - bw / 2,
        top: cy - bh / 2,
        right: cx + bw / 2,
        bottom: cy + bh / 2,
      };
    };
    const boxes = layerElements.map(getAABB);
    const minX = boxes.length ? Math.min(...boxes.map((b) => b.left)) : 0;
    const minY = boxes.length ? Math.min(...boxes.map((b) => b.top)) : 0;
    const maxX = boxes.length ? Math.max(...boxes.map((b) => b.right)) : 1;
    const maxY = boxes.length ? Math.max(...boxes.map((b) => b.bottom)) : 1;
    const sceneWidth = Math.max(1, maxX - minX);
    const sceneHeight = Math.max(1, maxY - minY);
    const serializeNodeDom = (sourceNode: HTMLElement, isChartNode: boolean): string => {
      const clone = sourceNode.cloneNode(true) as HTMLElement;
      // 去掉编辑态选中 ring 等视觉痕迹，避免预览出现 Moveable/编辑辅助效果
      clone.className = clone.className
        .split(/\s+/)
        .filter((cls) => cls && !cls.startsWith("ring-"))
        .join(" ");
      clone.removeAttribute("data-moveable-target");
      const sourceCanvases = Array.from(sourceNode.querySelectorAll("canvas"));
      const cloneCanvases = Array.from(clone.querySelectorAll("canvas"));
      if (isChartNode) return clone.outerHTML;
      sourceCanvases.forEach((srcCanvas, idx) => {
        const clonedCanvas = cloneCanvases[idx];
        if (!clonedCanvas) return;
        try {
          const dataUrl = srcCanvas.toDataURL("image/png");
          const img = document.createElement("img");
          img.src = dataUrl;
          img.style.width = "100%";
          img.style.height = "100%";
          img.style.objectFit = "fill";
          img.style.display = "block";
          clonedCanvas.replaceWith(img);
        } catch {
          // ignore tainted canvas
        }
      });
      return clone.outerHTML;
    };

    const previewNodesHtml = layerElements
      .map((el) => {
        const node = canvasRef.current?.querySelector<HTMLElement>(`[data-element-id="${el.id}"]`);
        if (!node) return "";
        return serializeNodeDom(node, CHART_TYPES.has(el.materialType ?? ""));
      })
      .filter(Boolean)
      .join("");
    const previewMeta = JSON.stringify({
      gridNodeIds: layerElements.filter((el) => el.materialType === "grid").map((el) => el.id),
      chartNodes: layerElements
        .filter((el) => CHART_TYPES.has(el.materialType ?? ""))
        .map((el) => ({
          id: el.id,
          renderer: el.chart?.renderMode ?? "canvas",
          option: buildChartOption(el),
        })),
    }).replace(/<\//g, "<\\/");

    const headStyles = Array.from(
      document.querySelectorAll('style, link[rel="stylesheet"]')
    )
      .map((el) => el.outerHTML)
      .join("\n");
    const previewFaviconLink = titleIconDataUrl
      ? `<link rel="icon" href="${titleIconDataUrl}" /><link rel="shortcut icon" href="${titleIconDataUrl}" />`
      : "";
    const previewTitle = productName.trim() || "未命名产物";
    const escapedPreviewTitle = previewTitle
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

    const faviconJson = JSON.stringify(titleIconDataUrl || "");
    const titleJson = JSON.stringify(previewTitle);
    const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8"/>
    <title>${escapedPreviewTitle}</title>
    ${headStyles}
    ${previewFaviconLink}
    <script src="https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js"></script>
  </head>
  <body style="margin:0;background:#fff;overflow:hidden;">
    <div id="preview-root" style="position:absolute;left:${-minX}px;top:${-minY}px;width:${sceneWidth}px;height:${sceneHeight}px;transform-origin:left top;">
      ${previewNodesHtml}
    </div>
    <script id="preview-meta" type="application/json">${previewMeta}</script>
    <script>
      (function () {
        var faviconHref = ${faviconJson};
        var previewTitle = ${titleJson};
        if (previewTitle) {
          document.title = previewTitle;
        }
        if (faviconHref) {
          var rels = ["icon", "shortcut icon"];
          rels.forEach(function (rel) {
            var existing = document.querySelector("link[rel='" + rel + "']");
            if (existing && existing.parentNode) {
              existing.parentNode.removeChild(existing);
            }
            var link = document.createElement("link");
            link.rel = rel;
            link.href = faviconHref;
            document.head.appendChild(link);
          });
        }
        var scene = document.getElementById("preview-root");
        function fitScene() {
          if (!scene) return;
          var vw = window.innerWidth || 1;
          var vh = window.innerHeight || 1;
          var sw = ${sceneWidth} || 1;
          var sh = ${sceneHeight} || 1;
          var scale = Math.min(vw / sw, vh / sh);
          var ox = (vw - sw * scale) / 2;
          var oy = (vh - sh * scale) / 2;
          scene.style.transform = "translate(" + ox + "px," + oy + "px) scale(" + scale + ")";
        }
        fitScene();
        window.addEventListener("resize", fitScene);
        var metaRaw = document.getElementById("preview-meta");
        var meta = {};
        try { meta = JSON.parse((metaRaw && metaRaw.textContent) || "{}"); } catch (e) {}
        var gridNodeIds = Array.isArray(meta.gridNodeIds) ? meta.gridNodeIds : [];
        var chartNodes = Array.isArray(meta.chartNodes) ? meta.chartNodes : [];
        gridNodeIds.forEach(function (id) {
          var gridNode = document.querySelector("[data-element-id='" + id + "']");
          if (!gridNode) return;
          var content = gridNode.firstElementChild;
          if (content) {
            // 预览中隐藏网格编辑态占位格，仅保留内部真实节点呈现
            content.innerHTML = "";
            content.removeAttribute("style");
          }
        });
        chartNodes.forEach(function (n) {
          var host = document.querySelector("[data-element-id='" + n.id + "'] > div");
          if (!host || !window.echarts) return;
          host.innerHTML = "";
          var chart = window.echarts.init(host, null, { renderer: n.renderer || "canvas" });
          chart.setOption(n.option || {}, true);
          chart.resize();
          window.addEventListener("resize", function () { chart.resize(); });
        });
      })();
    </script>
  </body>
</html>`;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.document.title = previewTitle;
  }, [activeLayerId, allElements, layers, productName, titleIconDataUrl]);

  return (
    <div
      ref={panelRootRef}
      className={[
        "relative flex h-full min-h-0 w-full flex-col overflow-hidden bg-background text-foreground",
        className ?? "",
      ].join(" ")}
      style={{ ["--panel-font-px" as string]: `${panelFontPx}px` }}
    >
      <TooltipProvider delayDuration={120}>
        <Tooltip open={ellipsisTooltip.open}>
          <TooltipTrigger asChild>
            <span
              aria-hidden="true"
              className="pointer-events-none fixed z-[10000] h-0 w-0"
              style={{ left: ellipsisTooltip.x, top: ellipsisTooltip.y }}
            />
          </TooltipTrigger>
          <TooltipContent side="top" align="start" className="max-w-[420px] break-words text-[11px]">
            {ellipsisTooltip.text}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <style>{`
        .panel-font-root :is(span, label, p, strong, button, input, textarea, select, option, a, li) {
          font-size: var(--panel-font-px) !important;
        }
        .panel-font-root :is(input, textarea):focus,
        .panel-font-root :is(input, textarea):focus-visible {
          outline: none !important;
          box-shadow: none !important;
        }
        .panel-font-root button[role="combobox"] {
          border-width: 1px !important;
          border-color: hsl(var(--foreground) / 0.35) !important;
          background: hsl(var(--background)) !important;
          box-shadow: 0 0 0 1px hsl(var(--foreground) / 0.12) inset !important;
        }
        .panel-font-root button[role="combobox"]:focus,
        .panel-font-root button[role="combobox"]:focus-visible,
        .panel-font-root button[role="combobox"][data-state="open"] {
          outline: none !important;
          box-shadow: 0 0 0 1px hsl(var(--foreground) / 0.12) inset !important;
          border-color: hsl(var(--foreground) / 0.35) !important;
        }
        .panel-font-root button[role="checkbox"] {
          border-width: 2px !important;
          border-color: hsl(var(--foreground) / 0.8) !important;
          background: hsl(var(--background)) !important;
          color: hsl(var(--background)) !important;
          box-shadow: 0 0 0 1px hsl(var(--foreground) / 0.4) inset !important;
        }
        .panel-font-root button[role="checkbox"][data-state="checked"] {
          border-color: hsl(var(--primary)) !important;
          background: hsl(var(--primary)) !important;
          color: hsl(var(--primary-foreground)) !important;
          box-shadow: 0 0 0 1px hsl(var(--primary) / 0.45) inset !important;
        }
      `}</style>
      <nav className="panel-font-root relative z-30 flex items-center gap-2 border-b border-border bg-background/95 px-2 text-foreground">
        <Menubar className="h-8 border-0 bg-transparent p-0 shadow-none">
          <MenubarMenu>
            <MenubarTrigger className="px-2 py-1 text-xs font-normal">文件</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={handlePreviewLayer}>预览</MenubarItem>
              <MenubarItem onClick={handleExport}>导出</MenubarItem>
              <MenubarItem onClick={() => importInputRef.current?.click()}>导入</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger className="px-2 py-1 text-xs font-normal">编辑</MenubarTrigger>
            <MenubarContent>
              <MenubarItem disabled={!canUndo} onClick={undo}>撤销</MenubarItem>
              <MenubarItem disabled={!canRedo} onClick={redo}>重做</MenubarItem>
              <MenubarSeparator />
              <MenubarItem disabled={!hasUnlockedSelection} onClick={() => bringElementsForward(selectedIds)}>上移一层</MenubarItem>
              <MenubarItem disabled={!hasUnlockedSelection} onClick={() => sendElementsBackward(selectedIds)}>下移一层</MenubarItem>
              <MenubarItem disabled={!hasUnlockedSelection} onClick={() => bringElementsToFront(selectedIds)}>置顶</MenubarItem>
              <MenubarItem disabled={!hasUnlockedSelection} onClick={() => sendElementsToBack(selectedIds)}>置底</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger className="px-2 py-1 text-xs font-normal">视图</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={() => setZoom((z) => Math.max(0.25, Number((z - 0.1).toFixed(2))))}>缩小</MenubarItem>
              <MenubarItem onClick={() => setZoom((z) => Math.min(4, Number((z + 0.1).toFixed(2))))}>放大</MenubarItem>
              <MenubarSeparator />
              <MenubarItem
                onClick={() => {
                  applyTheme(!isDark);
                }}
              >
                {isDark ? "切换到浅色" : "切换到深色"}
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger className="px-2 py-1 text-xs font-normal">设置</MenubarTrigger>
            <MenubarContent>
              <MenubarRadioGroup
                value={panelFontSize}
                onValueChange={(value) => setPanelFontSize(value as "sm" | "md" | "lg")}
              >
                <MenubarRadioItem value="sm">字体：小</MenubarRadioItem>
                <MenubarRadioItem value="md">字体：中</MenubarRadioItem>
                <MenubarRadioItem value="lg">字体：大</MenubarRadioItem>
              </MenubarRadioGroup>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
        <div className="flex-1" />
      </nav>
      <ResizablePanelGroup direction="horizontal" className="min-h-0 w-full flex-1">
        <ResizablePanel defaultSize={15} minSize={15}>
          <div className="panel-font-root h-full">
            <MaterialSidebar
              layers={layers}
              allElements={allElements}
              selectedIds={selectedIds}
              onSelectNode={(nodeId, layerId) => {
                if (activeLayerId !== layerId) setActiveLayer(layerId);
                setSelectedIds([nodeId]);
              }}
              onNodeContextMenu={({ nodeId, x, y }) => {
                setDropdownOpen(false);
                requestAnimationFrame(() => {
                  setContextMenuNodeId(nodeId);
                  setDropdownPoint({ x, y });
                  setDropdownEpoch((v) => v + 1);
                  setDropdownOpen(true);
                });
              }}
              onCopyNode={(nodeId, mode) => {
                duplicateElement(nodeId, { referenceCopyMode: mode });
              }}
              onDeleteNode={(nodeId) => {
                const node = byId.get(nodeId);
                if (!node) {
                  hintNodeNotFound();
                  return;
                }
                if (node.locked) {
                  hintUnlockNodeForDelete();
                  return;
                }
                if (layerById.get(node.layerId)?.locked) {
                  hintUnlockLayerForDelete();
                  return;
                }
                requestDeleteWithMappingImpact([nodeId], () => {
                  deleteElement(nodeId);
                  setSelectedIds((prev) => prev.filter((id) => id !== nodeId));
                });
              }}
              onMoveNodeToLayer={(nodeId, targetLayerId) => {
                const node = byId.get(nodeId);
                if (!node) {
                  hintNodeNotFound();
                  return;
                }
                if (node.locked) {
                  hintUnlockNodeForMove();
                  return;
                }
                if (node.layerId === targetLayerId) return;
                const sourceLayer = layerById.get(node.layerId);
                if (sourceLayer?.locked) {
                  hintUnlockSourceLayerForMove();
                  return;
                }
                const targetLayer = layerById.get(targetLayerId);
                if (!targetLayer) {
                  hintTargetLayerNotFound();
                  return;
                }
                if (targetLayer.locked) {
                  hintUnlockTargetLayerForMove();
                  return;
                }
                updateElement(nodeId, { layerId: targetLayerId });
                if (activeLayerId !== targetLayerId) setActiveLayer(targetLayerId);
              }}
            />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={65} minSize={10}>
          {/* Center workspace */}
          <div
            className="panel-font-root min-w-0 h-full"
            onMouseDownCapture={(e) => {
              if (e.button !== 0) return;
              const target = e.target as HTMLElement | null;
              if (!shouldClearSelectionOnBlank(target)) return;
              clearSelection();
            }}
          >
            <div className="relative flex h-full flex-col overflow-hidden border border-border bg-background">
              <div
                className="relative flex items-center gap-2 border-b border-border bg-background/90 px-3 py-1.5 text-foreground"
                style={{ zIndex: PANEL_Z_INDEX.toolbar }}
              >
                <Input
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="请输入当前构建产物名称"
                  className="h-7 w-[220px] text-xs focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
                />
                <span className="text-[11px] text-muted-foreground">产物名称</span>
                <TooltipProvider delayDuration={150}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => titleIconInputRef.current?.click()}
                        className="rounded border border-border p-1 hover:bg-accent"
                        aria-label="上传 title 图标"
                      >
                        <IconImage />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="z-[10000]">上传 title 图标</TooltipContent>
                  </Tooltip>
                  {titleIconDataUrl ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => setTitleIconDataUrl("")}
                          className="rounded border border-border p-1 hover:bg-accent"
                          aria-label="清除 title 图标"
                        >
                          <IconClose />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="z-[10000]">清除 title 图标</TooltipContent>
                    </Tooltip>
                  ) : null}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {titleIconDataUrl ? (
                        <button
                          type="button"
                          onClick={() => setTitleIconPreviewOpen(true)}
                          className="flex min-w-[92px] items-center gap-1.5 rounded border border-border bg-muted/30 px-2 py-1 hover:bg-accent/40"
                          aria-label="查看 title 图标大图"
                        >
                          <img
                            src={titleIconDataUrl}
                            alt="title 图标缩略图"
                            className="h-6 w-6 rounded border border-border/60 object-cover"
                          />
                          <span className="text-[10px] text-muted-foreground">Title Icon</span>
                        </button>
                      ) : (
                        <div className="flex min-w-[92px] items-center gap-1.5 rounded border border-border bg-muted/30 px-2 py-1">
                          <div className="h-6 w-6 rounded border border-dashed border-border/70 bg-background" />
                          <span className="text-[10px] text-muted-foreground">Title Icon</span>
                        </div>
                      )}
                    </TooltipTrigger>
                    <TooltipContent className="z-[10000]">
                      {titleIconDataUrl ? "点击查看 title 图标大图" : "当前未上传 title 图标"}
                    </TooltipContent>
                  </Tooltip>
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
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsHistoryPanelExpanded((prev) => !prev)}
                          className={[
                            "rounded border border-border p-1 hover:bg-accent",
                            isHistoryPanelExpanded ? "bg-accent/60" : "",
                          ].join(" ")}
                          aria-label={isHistoryPanelExpanded ? "收起操作历史" : "展开操作历史"}
                        >
                          <IconHistory />
                        </button>
                        {isHistoryPanelExpanded ? (
                          <div
                            className="absolute left-1/2 top-[calc(100%+6px)] w-[280px] -translate-x-1/2 rounded-lg border border-border bg-card/95 p-2 shadow-lg backdrop-blur"
                            style={{ zIndex: PANEL_Z_INDEX.historyPopover }}
                          >
                            <div className="mb-1 flex items-center justify-between">
                              <span className="text-[11px] font-semibold text-muted-foreground">操作历史</span>
                              <span className="text-[11px] text-muted-foreground">
                                {history.length > 0 ? `${historyCursor + 1}/${history.length}` : "0/0"}
                              </span>
                            </div>
                            <Input
                              value={historyKeyword}
                              onChange={(e) => setHistoryKeyword(e.target.value)}
                              placeholder="搜索历史，如：删除、图层、缩放..."
                              className="mb-2 h-7 text-xs"
                            />
                            <div
                              className={`max-h-52 space-y-1 overflow-auto pr-1 text-[11px] ${themedScrollbarClass}`}
                            >
                              {history.length === 0 ? (
                                <Empty className="py-4">
                                  <EmptyIcon className="h-8 w-8">
                                    <IconHistory />
                                  </EmptyIcon>
                                  <EmptyTitle className="text-xs">暂无操作历史</EmptyTitle>
                                  <EmptyDescription className="text-[11px]">
                                    进行一次操作后，这里会展示历史记录。
                                  </EmptyDescription>
                                </Empty>
                              ) : (
                                history
                                  .slice(Math.max(0, history.length - 20))
                                  .reverse()
                                  .filter((item) =>
                                    !normalizedHistoryKeyword
                                      ? true
                                      : item.label.toLowerCase().includes(normalizedHistoryKeyword)
                                  )
                                  .map((item) => (
                                    <button
                                      key={`${item.index}-${item.timestamp}`}
                                      type="button"
                                      className={[
                                        "w-full rounded border px-2 py-1 text-left transition-colors",
                                        item.active
                                          ? "border-primary/50 bg-primary/10 text-foreground"
                                          : "border-border/60 bg-background/70 text-muted-foreground hover:bg-accent/50",
                                      ].join(" ")}
                                      title={new Date(item.timestamp).toLocaleString()}
                                      onClick={() => {
                                        if (item.active) return;
                                        goToHistory(item.index);
                                      }}
                                    >
                                      <div className="flex items-center justify-between gap-2">
                                        <span className="truncate">{item.label}</span>
                                        <span className="shrink-0 text-[10px] text-muted-foreground">
                                          {formatRelativeTime(item.timestamp, historyNow)}
                                        </span>
                                      </div>
                                    </button>
                                  ))
                              )}
                              {history.length > 0 &&
                              history
                                .slice(Math.max(0, history.length - 20))
                                .reverse()
                                .filter((item) =>
                                  !normalizedHistoryKeyword
                                    ? true
                                    : item.label.toLowerCase().includes(normalizedHistoryKeyword)
                                ).length === 0 ? (
                                <Empty className="py-4">
                                  <EmptyIcon className="h-8 w-8">
                                    <svg
                                      viewBox="0 0 24 24"
                                      className="h-4 w-4"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="1.8"
                                      aria-hidden="true"
                                    >
                                      <circle cx="11" cy="11" r="7" />
                                      <path d="m20 20-3.5-3.5" />
                                    </svg>
                                  </EmptyIcon>
                                  <EmptyTitle className="text-xs">未匹配到历史项</EmptyTitle>
                                  <EmptyDescription className="text-[11px]">
                                    尝试更换关键词，例如删除、图层、缩放。
                                  </EmptyDescription>
                                </Empty>
                              ) : null}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="z-[10000]">
                      {isHistoryPanelExpanded ? "收起操作历史" : "展开操作历史"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      disabled={!hasUnlockedSelection}
                      className="rounded border border-border p-1 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="节点层级操作"
                    >
                      <IconLayers />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" sideOffset={6} className="z-[10000] w-44">
                    <DropdownMenuItem
                      disabled={!hasUnlockedSelection}
                      onClick={() => bringElementsForward(selectedIds)}
                    >
                      <span className="mr-2 inline-flex"><IconForward /></span>
                      上移一层
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={!hasUnlockedSelection}
                      onClick={() => sendElementsBackward(selectedIds)}
                    >
                      <span className="mr-2 inline-flex"><IconBackward /></span>
                      下移一层
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={!hasUnlockedSelection}
                      onClick={() => bringElementsToFront(selectedIds)}
                    >
                      <span className="mr-2 inline-flex"><IconBringFront /></span>
                      置顶
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={!hasUnlockedSelection}
                      onClick={() => sendElementsToBack(selectedIds)}
                    >
                      <span className="mr-2 inline-flex"><IconSendBack /></span>
                      置底
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex-1" />
                <TooltipProvider delayDuration={150}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative">
                        <Switch
                          checked={isDark}
                          onCheckedChange={applyTheme}
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
                        onClick={() => setZoom((z) => Math.max(0.25, Number((z - 0.1).toFixed(2))))}
                        className="rounded-md border border-border bg-secondary px-2 py-1 text-xs text-secondary-foreground hover:bg-secondary/80"
                      >
                        -
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="z-[10000]">缩小画布</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span className="w-14 text-center text-xs">{(zoom * 100).toFixed(0)}%</span>
                <TooltipProvider delayDuration={150}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => setZoom((z) => Math.min(4, Number((z + 0.1).toFixed(2))))}
                        className="rounded-md border border-border bg-secondary px-2 py-1 text-xs text-secondary-foreground hover:bg-secondary/80"
                      >
                        +
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="z-[10000]">放大画布</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                ref={importInputRef}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  e.currentTarget.value = "";
                  if (!file) return;
                  try {
                    await handleImportFile(file);
                  } catch {
                    window.alert("导入失败：JSON 解析错误");
                  }
                }}
              />
              <Input
                ref={titleIconInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  e.currentTarget.value = "";
                  if (!file) return;
                  try {
                    const normalizedDataUrl = await normalizeTitleIconFile(file);
                    setTitleIconDataUrl(normalizedDataUrl);
                  } catch {
                    window.alert("图标读取失败，请重试");
                  }
                }}
              />

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
                      if (activeLayer?.locked) {
                        showActionHint(PANEL_MESSAGES.activeLayerLockedCannotAdd);
                        return;
                      }
                      addElementFromMaterial(materialId, x, y);
                    }}
                    className="h-full w-full"
                  >
                    <ElementsLayer
                      elements={elements}
                      allElements={allElements}
                      selectedIds={selectedIds}
                      onSelectIds={setSelectedIds}
                      updateElement={updateElement}
                      layerLocked={Boolean(activeLayer?.locked)}
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
                            if (!contextMenuNodeId) return;
                            const node = byId.get(contextMenuNodeId);
                            if (!node) return;
                            const layer = layerById.get(node.layerId);
                            if (layer?.locked) {
                              showActionHint(PANEL_MESSAGES.nodeLayerLockedCannotCopy);
                              return;
                            }
                            setCopiedNodeId(contextMenuNodeId);
                          }}
                        >
                          复制节点
                        </DropdownMenuItem>
                        {contextMenuNodeId &&
                        byId.get(contextMenuNodeId)?.mappingSourceNodeId ? (
                          <DropdownMenuItem
                            onClick={() => {
                              if (!contextMenuNodeId) return;
                              const mappingNode = byId.get(contextMenuNodeId);
                              const sourceNodeId = mappingNode?.mappingSourceNodeId;
                              if (!sourceNodeId) return;
                              const sourceNode = byId.get(sourceNodeId);
                              if (!sourceNode) {
                                showActionHint(PANEL_MESSAGES.sourceNodeNotFound);
                                return;
                              }
                              if (activeLayerId !== sourceNode.layerId) {
                                setActiveLayer(sourceNode.layerId);
                              }
                              setSelectedIds([sourceNode.id]);
                              setContextMenuNodeId(null);
                            }}
                          >
                            定位到源节点
                          </DropdownMenuItem>
                        ) : null}
                        <DropdownMenuItem
                          onClick={() => {
                            if (!contextMenuNodeId) return;
                            const shouldOpenBatch =
                              selectedIds.includes(contextMenuNodeId) && selectedIds.length > 1;
                            const targetIds = shouldOpenBatch ? selectedIds : [contextMenuNodeId];
                            const result = openElementsInNewLayer(targetIds);
                            if (!result.ok) {
                              showActionHint(result.reason);
                              return;
                            }
                            setContextMenuNodeId(null);
                          }}
                        >
                          在映射图层打开
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            const targetNode = contextMenuNodeId
                              ? byId.get(contextMenuNodeId)
                              : null;
                            const targetLayer = targetNode
                              ? layerById.get(targetNode.layerId)
                              : null;
                            if (targetLayer?.locked) {
                              hintUnlockLayerForDelete();
                              return;
                            }
                            const shouldDeleteBatch =
                              !!contextMenuNodeId &&
                              selectedIds.includes(contextMenuNodeId) &&
                              selectedIds.length > 1;
                            if (shouldDeleteBatch) {
                              requestDeleteWithMappingImpact(selectedIds, () => {
                              const hasLockedNode = selectedIds.some((id) => byId.get(id)?.locked);
                              if (hasLockedNode) {
                                hintLockedNodesInBatchDelete();
                                return;
                              }
                              const hasLockedLayerNode = selectedIds.some((id) => {
                                const el = byId.get(id);
                                if (!el) return false;
                                return !!layerById.get(el.layerId)?.locked;
                              });
                              if (hasLockedLayerNode) {
                                showActionHint(PANEL_MESSAGES.selectionContainsLockedLayerNode);
                                return;
                              }
                              deleteElements(selectedIds);
                              setSelectedIds([]);
                              });
                            } else {
                              if (!contextMenuNodeId) return;
                              requestDeleteWithMappingImpact([contextMenuNodeId], () => {
                                const target = byId.get(contextMenuNodeId);
                                if (target?.locked) {
                                  hintUnlockNodeForDelete();
                                  return;
                                }
                                deleteElement(contextMenuNodeId);
                                setSelectedIds((prev) =>
                                  prev.filter((sid) => sid !== contextMenuNodeId)
                                );
                              });
                            }
                            setContextMenuNodeId(null);
                          }}
                        >
                          {contextMenuNodeId && selectedIds.includes(contextMenuNodeId) && selectedIds.length > 1
                            ? `删除选中节点（${selectedIds.length}）`
                            : "删除节点"}
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem
                          disabled={!copiedNodeId}
                          onClick={() => {
                            if (!copiedNodeId) return;
                            const sourceNode = byId.get(copiedNodeId);
                            if (sourceNode && layerById.get(sourceNode.layerId)?.locked) {
                              showActionHint(PANEL_MESSAGES.sourceLayerLockedCannotPaste);
                              return;
                            }
                            const canvasEl = canvasRef.current;
                            const viewportEl = scrollRef.current;
                            const currentZoom = Math.max(0.0001, zoom);
                            let targetX: number | undefined;
                            let targetY: number | undefined;
                            if (canvasEl) {
                              const canvasRect = canvasEl.getBoundingClientRect();
                              targetX = (dropdownPoint.x - canvasRect.left) / currentZoom;
                              targetY = (dropdownPoint.y - canvasRect.top) / currentZoom;
                            } else if (viewportEl) {
                              const rect = viewportEl.getBoundingClientRect();
                              const centerX = rect.left + rect.width / 2;
                              const centerY = rect.top + rect.height / 2;
                              targetX = (centerX - rect.left + scroll.left) / currentZoom;
                              targetY = (centerY - rect.top + scroll.top) / currentZoom;
                            }
                            duplicateElement(
                              copiedNodeId,
                              targetX !== undefined && targetY !== undefined
                                ? { position: { x: targetX, y: targetY } }
                                : undefined
                            );
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

                    <TabsList
                      className={`h-auto w-full justify-start gap-1 overflow-x-auto bg-muted/40 p-1 ${themedScrollbarClass}`}
                    >
                      {layers.map((layer) => (
                        <TabsTrigger
                          key={layer.id}
                          value={layer.id}
                          className="flex min-w-[120px] items-center gap-1 px-2 py-1 text-xs"
                        >
                          <span className="truncate">{layer.name}</span>
                          {layer.isMapping ? (
                            <span className="rounded border border-primary/40 bg-primary/10 px-1 text-[10px] text-primary">
                              映射
                            </span>
                          ) : null}
                          {layer.locked ? <IconLock locked /> : null}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    <TabsContent value={activeLayerId} className="mt-2 space-y-2">
                      {activeLayer ? (
                        <div className="flex items-center gap-2 rounded border border-border bg-card px-2 py-1.5 text-xs">
                          {editingLayerId === activeLayer.id ? (
                            <Input
                              value={editingLayerName}
                              onChange={(e) => setEditingLayerName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  renameLayer(editingLayerId, editingLayerName);
                                  setEditingLayerId(null);
                                  setEditingLayerName("");
                                  return;
                                }
                                if (e.key === "Escape") {
                                  e.preventDefault();
                                  setEditingLayerId(null);
                                  setEditingLayerName("");
                                }
                              }}
                              className="h-7 min-w-0 flex-1"
                              placeholder="请输入图层名称"
                              autoFocus
                            />
                          ) : (
                            <span className="truncate font-medium">{activeLayer.name}</span>
                          )}
                          {activeLayer.isMapping ? (
                            <span className="rounded border border-primary/40 bg-primary/10 px-1 text-[10px] text-primary">
                              映射图层
                            </span>
                          ) : null}
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
                              {editingLayerId === activeLayer.id ? (
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
                              ) : (
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
                              )}
                            </TooltipTrigger>
                            <TooltipContent className="z-[10000]">
                              {editingLayerId === activeLayer.id ? "保存图层名称" : "重命名图层"}
                            </TooltipContent>
                          </Tooltip>
                          {editingLayerId === activeLayer.id ? (
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
                          ) : null}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                onClick={() => {
                                  const blockReason = getLayerDeleteBlockReason(activeLayer.id);
                                  if (blockReason) {
                                    showActionHint(blockReason);
                                    return;
                                  }
                                  setConfirmDeleteLayerId(activeLayer.id);
                                  const firstTarget = layers.find((l) => l.id !== activeLayer.id);
                                  setDeleteTargetLayerId(firstTarget?.id ?? "");
                                  setDeleteMode(activeLayer.isMapping ? "remove" : "move");
                                }}
                                disabled={!activeLayer.editable || activeLayer.locked}
                                aria-label={
                                  !activeLayer.editable
                                    ? "默认图层不可删除"
                                    : activeLayer.locked
                                      ? "锁定图层不可删除"
                                      : "删除图层"
                                }
                                className="rounded border border-border p-1 disabled:opacity-40"
                              >
                                <IconTrash />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent className="z-[10000]">
                              {!activeLayer.editable
                                ? "默认图层不可删除"
                                : activeLayer.locked
                                  ? "锁定图层不可删除"
                                  : "删除图层"}
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
                                <Checkbox
                                  checked={Boolean(layer.mergeSelected)}
                                  disabled={layer.isMapping}
                                  className="h-4 w-4 border-2 border-foreground/80 bg-background ring-1 ring-foreground/40 data-[state=checked]:border-primary data-[state=checked]:ring-primary/40"
                                  onCheckedChange={() => toggleLayerMergeSelected(layer.id)}
                                />
                                <span
                                  className="max-w-[140px] truncate"
                                  title={layer.isMapping ? "映射图层不允许合并" : layer.name}
                                >
                                  {layer.name}
                                  {layer.isMapping ? "（不可合并）" : ""}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </TabsContent>
                  </Tabs>

                {isLayerPanelExpanded && isMergingLayers ? (
                  <div className="mt-2 flex items-center gap-2 rounded border border-border bg-card px-2 py-1.5 text-xs">
                    <span className="text-muted-foreground">合并后图层名</span>
                    <Input
                      value={mergeLayerName}
                      onChange={(e) => setMergeLayerName(e.target.value)}
                      className="h-7 min-w-0 flex-1"
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
                </TooltipProvider>
              </div>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={20} minSize={20}>
          <div className="panel-font-root h-full">
            <PanelConfigSidebar
              selectedElement={selectedElement}
              selectedElements={selectedElements}
              layers={layers}
              updateElement={updateElement}
              setReferenceCopyMode={setReferenceCopyMode}
              nodeZOrderLabel={selectedNodeZOrderLabel}
              onExcludeSelectedNode={(nodeId) => {
                setSelectedIds((prev) => {
                  const nextIds = prev.filter((id) => id !== nodeId);
                  // 立即同步 Moveable targets，避免一帧内仍持有旧多选目标导致拖拽不跟手
                  setSelectedTargets(getSelectedTargetsFromIds(canvasRef.current, nextIds));
                  return nextIds;
                });
              }}
              onAdjustNodeZOrder={(nodeId, action) => {
                if (action === "bringForward") {
                  bringElementsForward([nodeId]);
                  return;
                }
                if (action === "sendBackward") {
                  sendElementsBackward([nodeId]);
                  return;
                }
                if (action === "bringToFront") {
                  bringElementsToFront([nodeId]);
                  return;
                }
                sendElementsToBack([nodeId]);
              }}
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      <AlertDialog
        open={mappingDeleteConfirmOpen}
        onOpenChange={(open) => {
          setMappingDeleteConfirmOpen(open);
          if (!open) mappingDeleteProceedRef.current = null;
        }}
      >
        <AlertDialogContent overlayClassName="bg-transparent pointer-events-none">
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              将删除 {mappingDeleteImpactCount} 个关联映射图层，是否继续？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const fn = mappingDeleteProceedRef.current;
                mappingDeleteProceedRef.current = null;
                setMappingDeleteConfirmOpen(false);
                fn?.();
              }}
            >
              继续删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog
        open={Boolean(deletingLayer)}
        onOpenChange={(open) => {
          if (open) return;
          setConfirmDeleteLayerId(null);
          setDeleteMode("move");
          setDeleteTargetLayerId("");
        }}
      >
        <DialogContent
          className="sm:max-w-[520px]"
          overlayClassName="bg-transparent pointer-events-none"
        >
          <DialogHeader>
            <DialogTitle>确认删除图层</DialogTitle>
            <DialogDescription>
              即将删除图层：{deletingLayer?.name ?? "-"}
            </DialogDescription>
          </DialogHeader>
          {deletingLayer ? (
            <RadioGroup
              value={deletingLayerMode}
              onValueChange={(value) => setDeleteMode(value as "move" | "remove")}
              className="space-y-2 text-sm"
            >
              {!deletingLayer.isMapping ? (
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5">
                    <RadioGroupItem value="move" />
                    节点迁移到
                  </label>
                  <Select
                    value={deleteTargetLayerId || "__none__"}
                    onValueChange={(value) =>
                      setDeleteTargetLayerId(value === "__none__" ? "" : value)
                    }
                    disabled={deletingLayerMode !== "move" || deleteTargetCandidates.length === 0}
                  >
                    <SelectTrigger className="h-8 w-[220px]">
                      <SelectValue placeholder="选择目标图层" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">请选择图层</SelectItem>
                      {deleteTargetCandidates.map((l) => (
                        <SelectItem key={l.id} value={l.id}>
                          {l.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : null}
              <label className="flex items-center gap-1.5">
                <RadioGroupItem value="remove" />
                {deletingLayer.isMapping ? "删除映射图层及其节点" : "同时删除该图层下所有节点"}
              </label>
            </RadioGroup>
          ) : null}
          <DialogFooter>
            <button
              type="button"
              onClick={() => {
                setConfirmDeleteLayerId(null);
                setDeleteMode("move");
                setDeleteTargetLayerId("");
              }}
              className="rounded border border-border px-3 py-1.5 text-sm hover:bg-accent"
            >
              取消
            </button>
            <button
              type="button"
              onClick={() => {
                if (!deletingLayer) return;
                const result = deleteLayer(deletingLayer.id, {
                  mode: deletingLayerMode,
                  targetLayerId: deleteTargetLayerId || undefined,
                });
                if (!result.ok) {
                  showActionHint(result.reason);
                  return;
                }
                setConfirmDeleteLayerId(null);
                setDeleteMode("move");
                setDeleteTargetLayerId("");
              }}
              className="rounded bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90"
            >
              确认删除
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={titleIconPreviewOpen}
        onOpenChange={setTitleIconPreviewOpen}
      >
        <DialogContent
          className="sm:max-w-[860px]"
          overlayClassName="bg-transparent pointer-events-none"
        >
          <DialogHeader>
            <DialogTitle>Title 图标预览</DialogTitle>
            <DialogDescription>用于预览页标签页 icon 的当前图片</DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setTitleIconZoom((z) => Math.max(0.5, Number((z - 0.1).toFixed(2))))}
              className="rounded border border-border px-2 py-1 text-xs hover:bg-accent"
            >
              -
            </button>
            <span className="w-14 text-center text-xs text-muted-foreground">
              {(titleIconZoom * 100).toFixed(0)}%
            </span>
            <button
              type="button"
              onClick={() => setTitleIconZoom((z) => Math.min(8, Number((z + 0.1).toFixed(2))))}
              className="rounded border border-border px-2 py-1 text-xs hover:bg-accent"
            >
              +
            </button>
            <button
              type="button"
              onClick={() => setTitleIconZoom(1.6)}
              className="rounded border border-border px-2 py-1 text-xs text-muted-foreground hover:bg-accent"
            >
              重置
            </button>
          </div>
          {titleIconDataUrl ? (
            <div
              className="max-h-[78vh] overflow-auto rounded border border-border bg-muted/20 p-4"
              onWheel={(e) => {
                e.preventDefault();
                const delta = e.deltaY > 0 ? -0.1 : 0.1;
                setTitleIconZoom((z) => {
                  const next = Number((z + delta).toFixed(2));
                  return Math.min(8, Math.max(0.5, next));
                });
              }}
            >
              <img
                src={titleIconDataUrl}
                alt="title 图标大图预览"
                className="mx-auto rounded border border-border/70 object-contain"
                style={{
                  width: 200,
                  height: 200,
                  maxWidth: "none",
                  maxHeight: "none",
                  transform: `scale(${titleIconZoom})`,
                  transformOrigin: "center center",
                }}
              />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  );
}
