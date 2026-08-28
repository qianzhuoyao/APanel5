import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@arronqzy/i18n/react";
import type { Locale } from "@arronqzy/i18n";
import type { State } from "@arronqzy/rx-store";
import type { PanelElement } from "./types";

import { usePanelElements } from "./hooks/usePanelElements";
import { useWorkspaceProjects } from "./hooks/useWorkspaceProjects";
import type { WorkspaceProjectRecord } from "./library/workspace-project-db";
import { WorkspaceProjectNav } from "./components/WorkspaceProjectNav";
import { BusyOverlay } from "./components/BusyOverlay";
import { PanelCanvas } from "./components/PanelCanvas";
import { PanelRulers } from "./components/PanelRulers";
import { type ViewportZoom } from "./viewportZoom";
import { ElementsLayer } from "./components/ElementsLayer";
import { SelectLayer } from "./components/SelectLayer";
import { MoveableLayer } from "./components/MoveableLayer";
import { buildChartOption, CHART_TYPES } from "./utils/chartOptionBuilder";
import { readOutputScale, writeOutputScale } from "./utils/outputScale";
import {
  captureEditorPreviewSnapshot,
  registerPreviewSnapshotProvider,
} from "./library/preview-snapshot";
import {
  assertFileSize,
  parseJsonText,
  readFileAsDataUrl,
  runBusyTask,
} from "./utils/async-work";
import { MaterialSidebar } from "./components/MaterialSidebar";
import { AssistantChatPanel } from "./ai/AssistantChatPanel";
import {
  listLayersFromStore,
  listPanelElementsFromStore,
  getActiveLayerIdFromStore,
  type ApplyAssistantDeps,
} from "./ai/applyAssistantAction";
import { revealPanelConfigFromPatch } from "./ai/revealConfigField";
import {
  BlueprintGraph,
  BlueprintMetaDialog,
  BlueprintNodeSwitchTaskDialog,
  blueprintDocumentsEqual,
  buildBlueprintExportPayload,
  buildLibraryRecord,
  createLibraryBlueprintId,
  deleteBlueprintLibraryRecord,
  downloadBlueprintExport,
  documentToRunnableGraph,
  getBlueprintLibraryRecord,
  libraryRecordFromImport,
  listBlueprintLibrary,
  parseBlueprintImportFile,
  putBlueprintLibraryRecord,
  updateBlueprintLibraryMeta,
  useBlueprintDebugSession,
  useBlueprintNodeSelectionGuard,
  useBlueprintPageLifecycle,
  stopAllClockSchedules,
  resolveRunnableNodeType,
  resolveViewElementIds,
  type BlueprintDocument,
  type BlueprintGraphNode,
  type BlueprintLibraryListItem,
  type BlueprintMetaDraft,
} from "@arronqzy/react-blueprint";
import type { LibraryBlueprintResolver } from "@arronqzy/blueprint-dsl";
import { abortClockNode, appStorageKey, collectArmedViewEventBindings, EVENT_NODE_TYPE, LIFECYCLE_NODE_TYPE } from "@arronqzy/blueprint-dsl";
import { WorkspaceStageSplit } from "./components/WorkspaceStageSplit";
import {
  WorkspaceConfigSidebar,
  type WorkspaceConfigFocus,
} from "./components/WorkspaceConfigSidebar";
import {
  getViewElementScope,
  setViewElementScopes,
  clearViewElementScopes,
  useViewElementScope,
  useViewScopeStoreVersion,
} from "./scope/view-scope-store";
import { resolvePanelElementScope } from "./utils/scope-template";
import { I18nRoot } from "./I18nRoot";
import { getPanelMessages } from "./constants/messages";
import { PANEL_Z_INDEX } from "./constants/zIndex";
import { useRafThrottledScroll } from "./hooks/useRafThrottledScroll";
import {
  IconBackward,
  IconBringFront,
  IconClose,
  IconForward,
  IconImage,
  IconLayers,
  IconRedo,
  IconSendBack,
  IconUndo,
} from "./icons";
import {
  getSelectedTargetsFromIds,
  shouldClearSelectionOnBlank,
} from "./utils/panelSelection";
import { PanelMenubar } from "./components/PanelMenubar";
import { PanelHistoryPopover } from "./components/PanelHistoryPopover";
import { PanelLayerDock } from "./components/PanelLayerDock";
import { PanelWorkspaceDialogs } from "./components/PanelWorkspaceDialogs";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  Switch,
  Toaster,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  toast,
  useTheme,
} from "@arronqzy/ui";

export type ReactViewPanelProps = {
  initialZoom?: number;
  className?: string;
  /** 外部传入的完整工作区数据，挂载后按这份数据完整渲染；空则显示空白，不自动打开 IndexedDB 记录 */
  initialWorkspace?: WorkspaceProjectRecord | null;
  /** 界面语言；省略时按 localStorage / 浏览器语言解析 */
  locale?: Locale | null;
  onLocaleChange?: (locale: Locale) => void;
  /**
   * 隔离本实例的 IndexedDB / localStorage / BroadcastChannel。
   * 同一页面挂多个 App 时传入不同值，避免工作区、蓝图库、预览缓存互相覆盖。
   * 省略或空字符串保持历史全局库名。
   */
  nameSpace?: string | null;
};

function ReactViewPanelInner({
  initialZoom = 1,
  className,
  initialWorkspace = null,
  nameSpace = null,
}: ReactViewPanelProps) {
  const { t, locale, setLocale } = useI18n();
  const messages = useMemo(() => getPanelMessages(t), [t]);
  const THEME_STORAGE_KEY = appStorageKey("panel:theme", nameSpace);
  const TITLE_ICON_STORAGE_KEY = appStorageKey("panel:titleIconDataUrl", nameSpace);
  const FONT_SIZE_STORAGE_KEY = appStorageKey("panel:fontSize", nameSpace);
  const { setTheme } = useTheme();
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
    setPrimaryLayer,
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
  const [viewportEl, setViewportEl] = useState<HTMLDivElement | null>(null);
  const syncScrollRef = useCallback((el: HTMLDivElement | null) => {
    scrollRef.current = el;
    setViewportEl(el);
  }, []);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [canvasEl, setCanvasEl] = useState<HTMLDivElement | null>(null);
  const syncCanvasRef = useCallback((el: HTMLDivElement | null) => {
    canvasRef.current = el;
    setCanvasEl(el);
  }, []);
  const panelRootRef = useRef<HTMLDivElement | null>(null);
  const [zoom, setZoom] = useState<ViewportZoom>({
    x: initialZoom,
    y: initialZoom,
  });

  const adjustUniformZoom = useCallback((updater: (value: number) => number) => {
    setZoom((prev) => {
      const next = Math.min(4, Math.max(0.25, updater(prev.x)));
      const rounded = Number(next.toFixed(4));
      return { x: rounded, y: rounded };
    });
  }, []);
  const { scroll, scrollRef: scrollPosRef, onScrollChange: onViewportScrollChange } =
    useRafThrottledScroll();
  const viewportSyncRef = useRef<(() => void) | null>(null);

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
  const blueprintImportInputRef = useRef<HTMLInputElement | null>(null);
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
  const [productName, setProductName] = useState(t("panel.defaults.unnamedProduct"));
  const [titleIconDataUrl, setTitleIconDataUrl] = useState<string>("");
  const [titleIconPreviewOpen, setTitleIconPreviewOpen] = useState(false);
  const [titleIconZoom, setTitleIconZoom] = useState(1.6);
  const [pendingPreviewLayerId, setPendingPreviewLayerId] = useState<string | null>(null);
  const [panelFontSize, setPanelFontSize] = useState<"sm" | "md" | "lg">("md");
  const [outputScale, setOutputScale] = useState(() => readOutputScale(nameSpace));
  const [blueprintOpen, setBlueprintOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [blueprintGraph, setBlueprintGraph] = useState(() => BlueprintGraph.empty());
  const blueprintGraphRef = useRef(blueprintGraph);
  blueprintGraphRef.current = blueprintGraph;
  const [blueprintMeta, setBlueprintMeta] = useState<BlueprintMetaDraft>({
    name: t("panel.defaults.unnamedBlueprint"),
    remark: "",
  });
  const [blueprintLibraryItems, setBlueprintLibraryItems] = useState<
    BlueprintLibraryListItem[]
  >([]);
  const [activeBlueprintLibraryId, setActiveBlueprintLibraryId] = useState<string | null>(
    null
  );
  /** 当前库蓝图加载/同步时的文档快照，用于判断是否有未同步修改 */
  const [blueprintSyncedDocument, setBlueprintSyncedDocument] =
    useState<BlueprintDocument | null>(null);
  /** 进入蓝图库编辑前的工作区蓝图，用于取消库选中时恢复 */
  const workspaceBlueprintRef = useRef<{
    document: BlueprintDocument;
    meta: BlueprintMetaDraft;
  } | null>(null);
  const [blueprintMetaDialogOpen, setBlueprintMetaDialogOpen] = useState(false);
  const [blueprintMetaDialogMode, setBlueprintMetaDialogMode] = useState<
    "export" | "save"
  >("save");
  const [selectedBlueprintNodeId, setSelectedBlueprintNodeId] = useState<string | null>(
    null
  );
  const [configFocus, setConfigFocus] = useState<WorkspaceConfigFocus>("view");
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
    root.classList.toggle("light", !checked);
    root.dataset.theme = checked ? "dark" : "light";
    setTheme(checked ? "dark" : "light");
    try {
      // panel 独立持久化键，避免与宿主应用的通用 theme 键互相覆盖
      localStorage.setItem(THEME_STORAGE_KEY, checked ? "dark" : "light");
      // 兼容旧逻辑与其他依赖 theme 的读取方
      localStorage.setItem("theme", checked ? "dark" : "light");
    } catch {
      // ignore storage errors
    }
    setIsDark(checked);
  }, [THEME_STORAGE_KEY, setTheme]);

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
      const stored = localStorage.getItem(FONT_SIZE_STORAGE_KEY);
      if (stored === "sm" || stored === "md" || stored === "lg") {
        setPanelFontSize(stored);
      }
    } catch {
      // ignore storage errors
    }
  }, [FONT_SIZE_STORAGE_KEY]);

  useEffect(() => {
    try {
      localStorage.setItem(FONT_SIZE_STORAGE_KEY, panelFontSize);
    } catch {
      // ignore storage errors
    }
  }, [FONT_SIZE_STORAGE_KEY, panelFontSize]);

  useEffect(() => {
    writeOutputScale(outputScale, nameSpace);
  }, [nameSpace, outputScale]);

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

  const applyBlueprintNodeSelection = useCallback((nodeId: string | null) => {
    setSelectedBlueprintNodeId(nodeId);
    if (nodeId) {
      setConfigFocus("blueprint");
      setSelectedIds([]);
      setSelectedTargets([]);
      return;
    }
    setConfigFocus("view");
  }, []);

  const {
    requestSelectNode: requestSelectBlueprintNode,
    pendingSwitch: pendingBlueprintNodeSwitch,
    keepTaskAndSwitch: keepBlueprintTaskAndSwitch,
    cancelTaskAndSwitch: cancelBlueprintTaskAndSwitch,
    stayOnCurrentNode: stayOnCurrentBlueprintNode,
  } = useBlueprintNodeSelectionGuard(
    selectedBlueprintNodeId,
    applyBlueprintNodeSelection
  );

  const focusViewConfig = useCallback(() => {
    setConfigFocus("view");
    requestSelectBlueprintNode(null);
  }, [requestSelectBlueprintNode]);

  const onSelectBlueprintNode = requestSelectBlueprintNode;

  const handleUpdateBlueprintNode = useCallback(
    (
      nodeId: string,
      patch: Partial<
        Pick<
          BlueprintGraphNode,
          | "label"
          | "role"
          | "nodeType"
          | "configSource"
          | "viewElementId"
          | "viewElementIds"
          | "nestedBlueprintId"
          | "libraryBlueprintId"
          | "lifecyclePhase"
          | "fetchConfig"
          | "jsonConfig"
          | "storageConfig"
          | "logicConfig"
          | "clockConfig"
          | "eventConfig"
        >
      >
    ) => {
      setBlueprintGraph((graph) => graph.updateNode(nodeId, patch));
    },
    []
  );

  const handleUpdateAllowFalseSignalPropagation = useCallback((value: boolean) => {
    setBlueprintGraph((graph) =>
      graph.withDocument({
        ...graph.document,
        allowFalseSignalPropagation: value,
      })
    );
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
    setSelectedTargets([]);
    focusViewConfig();
  }, [focusViewConfig]);

  useEffect(() => {
    setSelectedIds([]);
    setSelectedTargets([]);
    setConfigFocus("view");
    setSelectedBlueprintNodeId(null);
  }, [activeLayerId]);

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

  /** 选中视图节点：更新选中集合并将右侧配置切回视图（最近一次触发优先） */
  const selectViewElements = useCallback(
    (ids: string[]) => {
      setSelectedIds(ids);
      if (ids.length > 0) {
        focusViewConfig();
      }
    },
    [focusViewConfig]
  );

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

  const canvasContainer = canvasEl;
  const activeLayer = layers.find((l) => l.id === activeLayerId) ?? null;
  const primaryLayer = layers.find((l) => l.isPrimary) ?? layers[0] ?? null;
  const deletingLayer = layers.find((l) => l.id === confirmDeleteLayerId) ?? null;
  const deletingLayerMode: "move" | "remove" =
    deletingLayer?.isMapping ? "remove" : deleteMode;
  const deleteTargetCandidates = layers.filter((l) => l.id !== confirmDeleteLayerId);
  const selectedBlueprintNode = useMemo(() => {
    if (!selectedBlueprintNodeId) return null;
    return blueprintGraph.getNode(selectedBlueprintNodeId) ?? null;
  }, [blueprintGraph, selectedBlueprintNodeId]);

  const blueprintLibraryNameById = useMemo(
    () => new Map(blueprintLibraryItems.map((item) => [item.id, item.name])),
    [blueprintLibraryItems]
  );

  const blueprintLibraryOptions = useMemo(
    () =>
      blueprintLibraryItems.map((item) => ({
        id: item.id,
        label: item.name,
      })),
    [blueprintLibraryItems]
  );

  const resolveLibraryBlueprint = useCallback<LibraryBlueprintResolver>(
    async (libraryBlueprintId) => {
      const record = await getBlueprintLibraryRecord(libraryBlueprintId, nameSpace);
      if (!record) return null;
      const items = await listBlueprintLibrary(nameSpace);
      const nameById = new Map(items.map((item) => [item.id, item.name]));
      return documentToRunnableGraph(record.document, { libraryNameById: nameById });
    },
    [nameSpace]
  );

  const handleBlueprintExecutionBlocked = useCallback((message: string) => {
    toast({ title: message });
  }, []);

  const handleViewScopeUpdate = useCallback(
    (viewElementIds: string[], scope: unknown) => {
      setViewElementScopes(viewElementIds, scope);
    },
    []
  );

  const blueprintDebugSession = useBlueprintDebugSession({
    graph: blueprintGraph,
    blueprintId: activeBlueprintLibraryId,
    blueprintName: blueprintMeta.name || t("panel.defaults.unnamedBlueprint"),
    resolveLibraryBlueprint,
    libraryNameById: blueprintLibraryNameById,
    onExecutionBlocked: handleBlueprintExecutionBlocked,
    onViewScopeUpdate: handleViewScopeUpdate,
    nameSpace,
  });

  const { selectLifecycleNode, selectedLifecycleNodeId: debugLifecycleNodeId } =
    blueprintDebugSession;

  useEffect(() => {
    if (!selectedBlueprintNodeId) return;
    const node = blueprintGraph.getNode(selectedBlueprintNodeId);
    if (node?.role !== "lifecycle") return;
    if (debugLifecycleNodeId === selectedBlueprintNodeId) return;
    selectLifecycleNode(selectedBlueprintNodeId);
  }, [
    blueprintGraph,
    debugLifecycleNodeId,
    selectLifecycleNode,
    selectedBlueprintNodeId,
  ]);

  const sidebarConfigFocus: WorkspaceConfigFocus =
    blueprintDebugSession.logPanelOpen ? "blueprint-log" : configFocus;

  const selectedDebugLifecyclePhase =
    blueprintDebugSession.lifecycleNodes.find(
      (node) => node.id === blueprintDebugSession.selectedLifecycleNodeId
    )?.phase;

  const blueprintDebugToolbar = useMemo(
    () => ({
      lifecycleNodes: blueprintDebugSession.lifecycleNodes,
      selectedLifecycleNodeId: blueprintDebugSession.selectedLifecycleNodeId,
      onSelectLifecycleNode: blueprintDebugSession.selectLifecycleNode,
      onRunAll: () => void blueprintDebugSession.runAll(),
      onResetToStart: () => void blueprintDebugSession.resetToStart(),
      onStepBack: () => void blueprintDebugSession.stepBack(),
      onStepNext: () => void blueprintDebugSession.stepNext(),
      canResetToStart: blueprintDebugSession.canResetToStart,
      canStepBack: blueprintDebugSession.canStepBack,
      canStepNext: blueprintDebugSession.canStepNext,
      chainComplete: blueprintDebugSession.chainComplete,
      falseSignalHalt: blueprintDebugSession.falseSignalHalt,
      logPanelOpen: blueprintDebugSession.logPanelOpen,
      onToggleLogPanel: () =>
        blueprintDebugSession.setLogPanelOpen((open) => !open),
      running: blueprintDebugSession.running,
    }),
    [blueprintDebugSession]
  );

  const executionLogView = useMemo(
    () => ({
      entries: blueprintDebugSession.entries,
      settings: blueprintDebugSession.settings,
      onUpdateSettings: blueprintDebugSession.updateSettings,
      onSave: blueprintDebugSession.saveCurrentRun,
      onExport: blueprintDebugSession.exportCurrentRun,
      onClear: blueprintDebugSession.clearLog,
      onClearAllSaved: async () => {
        const removed = await blueprintDebugSession.clearAllSavedRuns();
        toast({
          title:
            removed > 0
              ? messages.clearedBlueprintLogs(removed)
              : messages.noSavedBlueprintLogs,
        });
      },
      hasSavedRuns: blueprintDebugSession.totalSavedRunCount > 0,
      onApplyRetention: blueprintDebugSession.applyRetention,
      lifecyclePhase: selectedDebugLifecyclePhase,
    }),
    [blueprintDebugSession, selectedDebugLifecyclePhase]
  );

  const handleAbortClock = useCallback(
    (nodeId: string) => {
      blueprintDebugSession.abortClock(nodeId);
      abortClockNode(activeBlueprintLibraryId ?? "local", nodeId);
    },
    [activeBlueprintLibraryId, blueprintDebugSession]
  );

  const blueprintCanvasProps = useMemo(
    () => ({
      graph: blueprintGraph,
      onGraphChange: setBlueprintGraph,
      selectedNodeId: selectedBlueprintNodeId,
      onSelectNode: onSelectBlueprintNode,
      onAbortClock: handleAbortClock,
      libraryNameById: blueprintLibraryNameById,
      executionOverlay: blueprintDebugSession.executionOverlay,
    }),
    [
      blueprintGraph,
      blueprintDebugSession.executionOverlay,
      blueprintLibraryNameById,
      handleAbortClock,
      onSelectBlueprintNode,
      selectedBlueprintNodeId,
    ]
  );

  const refreshBlueprintLibrary = useCallback(async () => {
    const items = await listBlueprintLibrary(nameSpace);
    setBlueprintLibraryItems(items);
  }, [nameSpace]);

  useEffect(() => {
    void refreshBlueprintLibrary();
  }, [refreshBlueprintLibrary]);

  const loadBlueprintFromLibrary = useCallback(
    async (id: string) => {
      const record = await getBlueprintLibraryRecord(id, nameSpace);
      if (!record) {
        toast({ title: t("panel.messages.blueprintNotFound") });
        void refreshBlueprintLibrary();
        return;
      }
      await runBusyTask(t("common.loadingBlueprint"), async () => {
        setBlueprintGraph(BlueprintGraph.fromDocument(record.document));
        setBlueprintMeta({
          name: record.name,
          remark: record.remark ?? "",
        });
        setActiveBlueprintLibraryId(record.id);
        setBlueprintSyncedDocument(record.document);
        setSelectedBlueprintNodeId(null);
        setConfigFocus("blueprint");
        setBlueprintOpen(true);
      });
    },
    [nameSpace, refreshBlueprintLibrary, t]
  );

  const snapshotWorkspaceBlueprint = useCallback(() => {
    workspaceBlueprintRef.current = {
      document: blueprintGraph.document,
      meta: { ...blueprintMeta },
    };
  }, [blueprintGraph.document, blueprintMeta]);

  const returnToWorkspaceBlueprint = useCallback(() => {
    const snapshot = workspaceBlueprintRef.current;
    if (snapshot) {
      setBlueprintGraph(BlueprintGraph.fromDocument(snapshot.document));
      setBlueprintMeta(snapshot.meta);
    }
    setActiveBlueprintLibraryId(null);
    setBlueprintSyncedDocument(null);
    setSelectedBlueprintNodeId(null);
  }, []);

  const handleSelectBlueprintLibraryItem = useCallback(
    async (id: string) => {
      if (activeBlueprintLibraryId === id) {
        returnToWorkspaceBlueprint();
        return;
      }
      if (!activeBlueprintLibraryId) {
        snapshotWorkspaceBlueprint();
      }
      await loadBlueprintFromLibrary(id);
    },
    [
      activeBlueprintLibraryId,
      loadBlueprintFromLibrary,
      returnToWorkspaceBlueprint,
      snapshotWorkspaceBlueprint,
    ]
  );

  const blueprintLibraryDirty = useMemo(() => {
    if (!activeBlueprintLibraryId || !blueprintSyncedDocument) return false;
    return !blueprintDocumentsEqual(
      blueprintGraph.document,
      blueprintSyncedDocument
    );
  }, [
    activeBlueprintLibraryId,
    blueprintGraph.document,
    blueprintSyncedDocument,
  ]);

  const syncBlueprintToLibrary = useCallback(async () => {
    if (!activeBlueprintLibraryId) return;
    await runBusyTask(t("common.syncingBlueprint"), async () => {
      const existing = await getBlueprintLibraryRecord(activeBlueprintLibraryId, nameSpace);
      if (!existing) {
        toast({ title: t("panel.messages.blueprintNotFound") });
        void refreshBlueprintLibrary();
        setActiveBlueprintLibraryId(null);
        setBlueprintSyncedDocument(null);
        return;
      }

      const record = buildLibraryRecord({
        id: existing.id,
        createdAt: existing.createdAt,
        document: blueprintGraph.document,
        meta: blueprintMeta,
        source: existing.source,
      });
      await putBlueprintLibraryRecord(record, nameSpace);
      setBlueprintSyncedDocument(blueprintGraph.document);
      await refreshBlueprintLibrary();
      toast({ title: messages.blueprintSynced(record.name) });
    });
  }, [
    activeBlueprintLibraryId,
    blueprintGraph.document,
    blueprintMeta,
    refreshBlueprintLibrary,
    t,
    nameSpace,
  ]);

  const saveBlueprintToLibrary = useCallback(
    async (meta: BlueprintMetaDraft) => {
      await runBusyTask(t("common.savingBlueprint"), async () => {
        setBlueprintMeta(meta);

        let recordId = activeBlueprintLibraryId ?? undefined;
        let createdAt: number | undefined;
        if (activeBlueprintLibraryId) {
          const existing = await getBlueprintLibraryRecord(activeBlueprintLibraryId, nameSpace);
          if (existing?.source === "saved") {
            recordId = existing.id;
            createdAt = existing.createdAt;
          } else {
            recordId = createLibraryBlueprintId();
          }
        } else {
          recordId = createLibraryBlueprintId();
        }

        const record = buildLibraryRecord({
          id: recordId,
          createdAt,
          document: blueprintGraph.document,
          meta,
          source: "saved",
        });
        await putBlueprintLibraryRecord(record, nameSpace);
        setActiveBlueprintLibraryId(record.id);
        setBlueprintSyncedDocument(blueprintGraph.document);
        await refreshBlueprintLibrary();
        toast({ title: t("panel.messages.blueprintSavedLocal") });
      });
    },
    [activeBlueprintLibraryId, blueprintGraph.document, nameSpace, refreshBlueprintLibrary, t]
  );

  const openBlueprintMetaDialog = useCallback((mode: "export" | "save") => {
    setBlueprintMetaDialogMode(mode);
    setBlueprintMetaDialogOpen(true);
  }, []);

  const handleBlueprintMetaConfirm = useCallback(
    async (meta: BlueprintMetaDraft) => {
      if (blueprintMetaDialogMode === "export") {
        await runBusyTask(t("common.exportingPanel"), async () => {
          setBlueprintMeta(meta);
          downloadBlueprintExport(
            buildBlueprintExportPayload(blueprintGraph.document, meta)
          );
          toast({ title: t("panel.messages.blueprintExported") });
        });
        return;
      }
      await saveBlueprintToLibrary(meta);
    },
    [blueprintGraph.document, blueprintMetaDialogMode, saveBlueprintToLibrary, t]
  );

  const handleRenameBlueprintLibraryItem = useCallback(
    async (id: string, name: string) => {
      const updated = await updateBlueprintLibraryMeta(id, { name }, nameSpace);
      if (!updated) {
        toast({ title: t("panel.messages.renameFailed") });
        void refreshBlueprintLibrary();
        return;
      }
      await refreshBlueprintLibrary();
      if (activeBlueprintLibraryId === id) {
        setBlueprintMeta((prev) => ({ ...prev, name }));
      }
      toast({ title: t("panel.messages.blueprintRenamed") });
    },
    [activeBlueprintLibraryId, nameSpace, refreshBlueprintLibrary]
  );

  const handleDeleteBlueprintLibraryItem = useCallback(
    async (id: string) => {
      await deleteBlueprintLibraryRecord(id, nameSpace);
      await refreshBlueprintLibrary();
      if (activeBlueprintLibraryId === id) {
        setActiveBlueprintLibraryId(null);
        setBlueprintSyncedDocument(null);
      }
      toast({ title: t("panel.messages.blueprintDeletedFromLibrary") });
    },
    [activeBlueprintLibraryId, nameSpace, refreshBlueprintLibrary]
  );

  const openBlueprintExportDialog = useCallback(() => {
    openBlueprintMetaDialog("export");
  }, [openBlueprintMetaDialog]);

  const handleBlueprintImportFile = useCallback(
    async (file: File) => {
      try {
        await runBusyTask(t("common.importingBlueprint"), async () => {
          assertFileSize(file, "json");
          const text = await file.text();
          const payload = parseBlueprintImportFile(await parseJsonText(text));
          const record = libraryRecordFromImport(payload);
          await putBlueprintLibraryRecord(record, nameSpace);
          await refreshBlueprintLibrary();
          if (!activeBlueprintLibraryId) {
            snapshotWorkspaceBlueprint();
          }
          await loadBlueprintFromLibrary(record.id);
          toast({ title: t("panel.messages.blueprintImported") });
        });
      } catch (error) {
        toast({
          title: error instanceof Error ? error.message : t("panel.messages.importInvalidFormat"),
        });
      }
    },
    [
      activeBlueprintLibraryId,
      loadBlueprintFromLibrary,
      nameSpace,
      refreshBlueprintLibrary,
      snapshotWorkspaceBlueprint,
      t,
    ]
  );

  useEffect(() => {
    if (blueprintOpen) return;
    stopAllClockSchedules();
  }, [blueprintOpen]);

  const handleWorkspaceProjectApplied = useCallback(
    (record: WorkspaceProjectRecord) => {
      workspaceBlueprintRef.current = {
        document: record.blueprintDocument,
        meta: {
          name: record.blueprintMeta?.name ?? t("panel.defaults.unnamedBlueprint"),
          remark: record.blueprintMeta?.remark ?? "",
        },
      };
      setActiveBlueprintLibraryId(null);
      setBlueprintSyncedDocument(null);
      setSelectedBlueprintNodeId(null);
      setBlueprintOpen(true);
      setConfigFocus("blueprint");
    },
    []
  );

  const workspaceProjects = useWorkspaceProjects({
    exportPanelData,
    importPanelData,
    blueprintDocument: blueprintGraph.document,
    blueprintMeta,
    setBlueprintGraph,
    setBlueprintMeta,
    productName,
    setProductName,
    titleIconDataUrl,
    setTitleIconDataUrl,
    panelRevision: `${historyCursor}|${allElements.length}`,
    onProjectApplied: handleWorkspaceProjectApplied,
    initialWorkspace,
    nameSpace,
  });

  useEffect(() => {
    registerPreviewSnapshotProvider(async () => {
      return captureEditorPreviewSnapshot({
        canvasRoot: canvasRef.current,
        allElements,
        layers,
        activeLayerId,
        outputScale: readOutputScale(nameSpace),
      });
    });
    return () => registerPreviewSnapshotProvider(null);
  }, [activeLayerId, allElements, canvasEl, layers, nameSpace]);

  const { triggerBlueprintNode, emitViewEvent, firedLifecyclePhases } = useBlueprintPageLifecycle({
    graph: blueprintGraph,
    active: blueprintOpen,
    bootKey: workspaceProjects.activeProjectId ?? undefined,
    onUpdated: `${activeLayerId}|${historyCursor}`,
    resolveLibraryBlueprint,
    libraryNameById: blueprintLibraryNameById,
    rootLibraryBlueprintId: activeBlueprintLibraryId,
    onExecutionBlocked: handleBlueprintExecutionBlocked,
    onViewScopeUpdate: handleViewScopeUpdate,
  });

  const boundViewEventTypes = useMemo(
    () =>
      collectArmedViewEventBindings(
        blueprintGraph.document.nodes.map((node) => ({
          id: node.id,
          nodeType: resolveRunnableNodeType(node),
          lifecyclePhase: node.lifecyclePhase,
          viewElementIds: resolveViewElementIds(node),
          eventConfig: node.eventConfig,
        })),
        blueprintGraph.document.edges,
        EVENT_NODE_TYPE,
        LIFECYCLE_NODE_TYPE,
        firedLifecyclePhases
      ),
    [blueprintGraph.document.nodes, blueprintGraph.document.edges, firedLifecyclePhases]
  );

  const handleWorkspaceCreateProject = useCallback(async () => {
    const result = await workspaceProjects.handleCreateProject();
    if (result?.name) {
      toast({ title: messages.workspaceCreated(result.name) });
    }
    return result;
  }, [workspaceProjects]);

  const handleWorkspaceOpenProject = useCallback(
    async (id: string) => {
      try {
        stopAllClockSchedules();
        clearViewElementScopes();
        await workspaceProjects.handleOpenProject(id);
        setSelectedIds([]);
        toast({
          title: t("panel.messages.workspaceLoaded"),
          description: t("panel.messages.workspaceLoadedDesc"),
        });
      } catch (error) {
        toast({
          title: error instanceof Error ? error.message : t("panel.messages.openWorkspaceFailed"),
        });
      }
    },
    [workspaceProjects]
  );

  const handleWorkspaceSyncProject = useCallback(async () => {
    try {
      const name = await workspaceProjects.handleSyncProject();
      if (name) {
        toast({ title: messages.blueprintSynced(name) });
      }
    } catch (error) {
      toast({
        title: error instanceof Error ? error.message : t("panel.messages.syncFailed"),
      });
    }
  }, [workspaceProjects]);

  const handleWorkspaceDeleteProject = useCallback(
    async (id: string) => {
      await workspaceProjects.handleDeleteProject(id);
      toast({ title: t("panel.messages.workspaceDeleted") });
    },
    [workspaceProjects]
  );

  const openOnlinePreviewForProject = useCallback(
    async (projectId: string, options?: { syncFirst?: boolean }) => {
      try {
        await workspaceProjects.handlePreviewProject(projectId, options);
      } catch (error) {
        toast({
          title: error instanceof Error ? error.message : t("panel.messages.openPreviewFailed"),
        });
      }
    },
    [workspaceProjects]
  );

  const selectedElement = selectedIds.length === 1 ? byId.get(selectedIds[0]) ?? null : null;
  const selectedElements = useMemo(
    () => selectedIds.map((id) => byId.get(id)).filter((el): el is PanelElement => !!el),
    [byId, selectedIds]
  );
  const selectedElementScope = useViewElementScope(selectedElement?.id ?? null);
  const scopeStoreVersion = useViewScopeStoreVersion();
  const scopedCanvasElements = useMemo(() => {
    void scopeStoreVersion;
    return elements.map((el) =>
      resolvePanelElementScope(el, getViewElementScope(el.id))
    );
  }, [elements, scopeStoreVersion]);
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

  const selectedIdsRef = useRef(selectedIds);
  selectedIdsRef.current = selectedIds;
  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;
  const blueprintOpenRef = useRef(blueprintOpen);
  blueprintOpenRef.current = blueprintOpen;
  const workspaceLiveRef = useRef({
    activeProjectId: workspaceProjects.activeProjectId,
    activeProjectName: workspaceProjects.activeProjectName,
    dirty: workspaceProjects.dirty,
    projectCount: workspaceProjects.projects.length,
  });
  workspaceLiveRef.current = {
    activeProjectId: workspaceProjects.activeProjectId,
    activeProjectName: workspaceProjects.activeProjectName,
    dirty: workspaceProjects.dirty,
    projectCount: workspaceProjects.projects.length,
  };

  const assistantDeps = useMemo<ApplyAssistantDeps>(
    () => ({
      addElementFromMaterial,
      updateElement,
      deleteElement,
      duplicateElement,
      setSelectedIds: (ids) => {
        selectedIdsRef.current = ids;
        selectViewElements(ids);
        // Newly added nodes may not be in DOM until next paint — refresh Moveable targets.
        requestAnimationFrame(() => {
          setSelectedTargets(
            getSelectedTargetsFromIds(canvasRef.current, selectedIdsRef.current)
          );
        });
      },
      getSelectedIds: () => selectedIdsRef.current,
      revealConfigFromPatch: (patch) => {
        window.setTimeout(() => {
          revealPanelConfigFromPatch(patch);
        }, 60);
      },
      focusWorkspace: (area) => {
        if (area === "blueprint") {
          setConfigFocus("blueprint");
          setBlueprintOpen(true);
        } else {
          focusViewConfig();
        }
      },
      getElementIds: () =>
        new Set(listPanelElementsFromStore().map((el) => el.id)),
      getElement: (id) => listPanelElementsFromStore().find((el) => el.id === id),
      listElements: () => listPanelElementsFromStore(),
      getLayers: () => listLayersFromStore(),
      getActiveLayerId: () => getActiveLayerIdFromStore(),
      setActiveLayer,
      addLayer,
      renameLayer,
      setLayerLocked: (id, locked) => {
        const layer = listLayersFromStore().find((l) => l.id === id);
        if (!layer) return;
        if (!!layer.locked !== locked) toggleLayerLock(id);
      },
      deleteLayer: (id) => {
        const result = deleteLayer(id, { mode: "remove" });
        return result.ok
          ? { ok: true }
          : { ok: false, reason: result.reason };
      },
      bringElementsToFront,
      sendElementsToBack,
      bringElementsForward,
      sendElementsBackward,
      getZoom: () => zoomRef.current.x,
      setZoomAbsolute: (value) => {
        const next = Math.min(4, Math.max(0.25, value));
        const rounded = Number(next.toFixed(4));
        zoomRef.current = { x: rounded, y: rounded };
        setZoom({ x: rounded, y: rounded });
      },
      adjustZoomDelta: (delta) => {
        const next = Math.min(4, Math.max(0.25, zoomRef.current.x + delta));
        const rounded = Number(next.toFixed(4));
        zoomRef.current = { x: rounded, y: rounded };
        setZoom({ x: rounded, y: rounded });
      },
      fitViewport: () => {
        zoomRef.current = { x: 1, y: 1 };
        setZoom({ x: 1, y: 1 });
      },
      undo,
      redo,
      setBlueprintGraph,
      getBlueprintGraph: () => blueprintGraphRef.current,
      setBlueprintOpen,
      getBlueprintOpen: () => blueprintOpenRef.current,
      runBlueprintAll: () => blueprintDebugSession.runAll(),
      getWorkspace: () => ({ ...workspaceLiveRef.current }),
      workspaceSave: () => workspaceProjects.handleSaveProject(),
      workspaceSync: () => workspaceProjects.handleSyncProject(),
      workspaceCreate: async (name) => {
        if (name?.trim()) setProductName(name.trim());
        return workspaceProjects.handleCreateProject();
      },
      workspaceOpen: (id) => workspaceProjects.handleOpenProject(id),
      workspacePreview: async (id) => {
        const target =
          id ?? workspaceLiveRef.current.activeProjectId ?? undefined;
        if (!target) {
          const created = await workspaceProjects.handleCreateProject();
          await openOnlinePreviewForProject(created.id, { syncFirst: false });
          return;
        }
        await openOnlinePreviewForProject(target, { syncFirst: true });
      },
      exportPanelJson: () => JSON.stringify(exportPanelData(), null, 2),
      importPanelJson: (json) => {
        const parsed = JSON.parse(json) as State;
        const ok = importPanelData(parsed);
        if (ok) {
          selectedIdsRef.current = [];
          setSelectedIds([]);
        }
        return ok;
      },
      setTheme: (theme) => applyTheme(theme === "dark"),
      setLocale,
      setPanelFontSize,
    }),
    [
      addElementFromMaterial,
      updateElement,
      deleteElement,
      duplicateElement,
      selectViewElements,
      focusViewConfig,
      setActiveLayer,
      addLayer,
      renameLayer,
      toggleLayerLock,
      deleteLayer,
      bringElementsToFront,
      sendElementsToBack,
      bringElementsForward,
      sendElementsBackward,
      undo,
      redo,
      setBlueprintGraph,
      blueprintDebugSession,
      workspaceProjects,
      openOnlinePreviewForProject,
      exportPanelData,
      importPanelData,
      applyTheme,
      setLocale,
    ]
  );
  const showActionHint = useCallback((message: string) => {
    toast({
      title: t("panel.messages.operationRestricted"),
      description: message,
    });
  }, []);
  const hintUnlockNodeForDelete = useCallback(() => {
    showActionHint(messages.nodeDeleteLocked);
  }, [showActionHint]);
  const hintUnlockLayerForDelete = useCallback(() => {
    showActionHint(messages.nodeDeleteLayerLocked);
  }, [showActionHint]);
  const hintLockedNodesInBatchDelete = useCallback(() => {
    showActionHint(messages.nodeBatchDeleteContainsLocked);
  }, [showActionHint]);
  const hintNodeNotFound = useCallback(() => {
    showActionHint(messages.nodeNotFound);
  }, [showActionHint]);
  const hintUnlockNodeForMove = useCallback(() => {
    showActionHint(messages.nodeMoveLocked);
  }, [showActionHint]);
  const hintUnlockSourceLayerForMove = useCallback(() => {
    showActionHint(messages.nodeMoveSourceLayerLocked);
  }, [showActionHint]);
  const hintTargetLayerNotFound = useCallback(() => {
    showActionHint(messages.targetLayerNotFound);
  }, [showActionHint]);
  const hintUnlockTargetLayerForMove = useCallback(() => {
    showActionHint(messages.nodeMoveTargetLayerLocked);
  }, [showActionHint]);
  const getLayerDeleteBlockReason = useCallback(
    (layerId: string) => {
      const targetLayer = layerById.get(layerId);
      if (!targetLayer) return t("panel.messages.layerNotFound");
      if (!targetLayer.editable) return t("panel.layers.cannotDeleteDefault");
      if (targetLayer.locked) return t("panel.layers.cannotDeleteLocked");
      if (targetLayer.isMapping) return null;
      const hasBlockingRef = allElements.some((el) => {
        if (el.layerId === layerId) return false;
        if (el.materialType !== "reference" && el.materialType !== "viewport") return false;
        if (el.refLayerId !== layerId) return false;
        return (el.refCopyMode ?? "shallow") !== "deep";
      });
      if (hasBlockingRef) return t("panel.messages.shallowRefBlockingDelete");
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
    void runBusyTask(t("common.exportingPanel"), async () => {
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
    });
  }, [exportPanelData, productName, t]);

  const handleImportFile = useCallback(
    async (file: File) => {
      try {
        await runBusyTask(t("common.importingPanel"), async () => {
          assertFileSize(file, "json");
          const text = await file.text();
          const parsed = await parseJsonText<State>(text);
          const ok = importPanelData(parsed);
          if (!ok) {
            window.alert(messages.importInvalidFormat);
          } else {
            setSelectedIds([]);
          }
        });
      } catch (error) {
        window.alert(
          error instanceof Error ? error.message : messages.importInvalidFormat
        );
      }
    },
    [importPanelData, t]
  );

  const normalizeTitleIconFile = useCallback(async (file: File) => {
    const src = await readFileAsDataUrl(file, "read-failed", "image");
    return new Promise<string>((resolve, reject) => {
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
        const scale = Math.min(size / img.width, size / img.height);
        const drawW = img.width * scale;
        const drawH = img.height * scale;
        const dx = (size - drawW) / 2;
        const dy = (size - drawH) / 2;
        ctx.drawImage(img, dx, dy, drawW, drawH);
        img.src = "";
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = () => reject(new Error("image-decode-failed"));
      img.src = src;
    });
  }, []);

  const buildPreviewForLayer = useCallback((targetLayerId: string, retryCount = 0) => {
    const targetLayer = layers.find((l) => l.id === targetLayerId);
    const layerElements = allElements.filter((el) => el.layerId === targetLayerId);
    const getAABB = (el: PanelElement) => {
      const w = Math.max(1, el.width);
      const h = Math.max(1, el.height);
      const rad = ((el.rotate ?? 0) * Math.PI) / 180;
      const absCos = Math.abs(Math.cos(rad));
      const absSin = Math.abs(Math.sin(rad));
      const bw = w * absCos + h * absSin;
      const bh = w * absSin + h * absCos;
      const cx = el.x + w / 2;
      const cy = el.y + h / 2;
      return {
        left: cx - bw / 2,
        top: cy - bh / 2,
        right: cx + bw / 2,
        bottom: cy + bh / 2,
      };
    };
    const fallbackBoxes = layerElements.map(getAABB);
    // 使用节点几何边界（含旋转）作为统一坐标系，避免视口缩放/平移导致预览范围偏移
    const minX = fallbackBoxes.length ? Math.min(...fallbackBoxes.map((b) => b.left)) : 0;
    const minY = fallbackBoxes.length ? Math.min(...fallbackBoxes.map((b) => b.top)) : 0;
    const maxX = fallbackBoxes.length ? Math.max(...fallbackBoxes.map((b) => b.right)) : 1;
    const maxY = fallbackBoxes.length ? Math.max(...fallbackBoxes.map((b) => b.bottom)) : 1;
    const sceneWidth = Math.max(1, maxX - minX);
    const sceneHeight = Math.max(1, maxY - minY);
    const serializeNodeDom = (
      sourceNode: HTMLElement,
      sourceElement: PanelElement,
      isChartNode: boolean
    ): string => {
      const clone = sourceNode.cloneNode(true) as HTMLElement;
      // 去掉编辑态选中 ring 等视觉痕迹，避免预览出现 Moveable/编辑辅助效果
      clone.className = clone.className
        .split(/\s+/)
        .filter((cls) => cls && !cls.startsWith("ring-"))
        .join(" ");
      clone.removeAttribute("data-moveable-target");
      // 以整体包围盒左上角为 (0,0) 做归一化，保证“整块内容”完整进入预览
      clone.style.left = `${sourceElement.x - minX}px`;
      clone.style.top = `${sourceElement.y - minY}px`;
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

    const mountedNodes = layerElements.map((el) => ({
      el,
      node: canvasRef.current?.querySelector<HTMLElement>(`[data-element-id="${el.id}"]`) ?? null,
    }));
    const mountedCount = mountedNodes.filter((item) => !!item.node).length;
    const previewNodesHtml = mountedNodes
      .map((item) => {
        if (!item.node) return "";
        return serializeNodeDom(item.node, item.el, CHART_TYPES.has(item.el.materialType ?? ""));
      })
      .filter(Boolean)
      .join("");
    if (mountedCount < layerElements.length && layerElements.length > 0 && retryCount < 20) {
      window.setTimeout(() => {
        buildPreviewForLayer(targetLayerId, retryCount + 1);
      }, 80);
      return;
    }
    if (!previewNodesHtml && layerElements.length > 0 && retryCount < 20) {
      window.setTimeout(() => {
        buildPreviewForLayer(targetLayerId, retryCount + 1);
      }, 80);
      return;
    }
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
    const faviconHrefWithVersion = titleIconDataUrl
      ? titleIconDataUrl.startsWith("data:")
        ? titleIconDataUrl
        : `${titleIconDataUrl}${titleIconDataUrl.includes("?") ? "&" : "?"}v=${Date.now()}`
      : "";
    const previewFaviconLink = faviconHrefWithVersion
      ? `<link rel="icon" type="image/png" href="${faviconHrefWithVersion}" /><link rel="shortcut icon" type="image/png" href="${faviconHrefWithVersion}" />`
      : "";
    const previewTitle = productName.trim() || t("panel.defaults.unnamedProduct");
    const escapedPreviewTitle = previewTitle
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

    const faviconJson = JSON.stringify(faviconHrefWithVersion || "");
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
    <div id="preview-root" style="position:fixed;left:0;top:0;width:100vw;height:100vh;overflow:hidden;">
      <div id="preview-scene" style="position:absolute;left:0;top:0;width:${sceneWidth}px;height:${sceneHeight}px;transform-origin:left top;">
        ${previewNodesHtml}
      </div>
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
            link.type = "image/png";
            link.href = faviconHref;
            document.head.appendChild(link);
          });
        }
        var scene = document.getElementById("preview-scene");
        var root = document.getElementById("preview-root");
        var outputScale = ${outputScale ? "true" : "false"};
        function rememberBox(node) {
          if (node.dataset.origLeft != null) return;
          node.dataset.origLeft = String(parseFloat(node.style.left) || 0);
          node.dataset.origTop = String(parseFloat(node.style.top) || 0);
          node.dataset.origWidth = String(parseFloat(node.style.width) || node.offsetWidth || 0);
          node.dataset.origHeight = String(parseFloat(node.style.height) || node.offsetHeight || 0);
        }
        function applyBoxScale(node, sx, sy) {
          rememberBox(node);
          node.style.left = (Number(node.dataset.origLeft) * sx) + "px";
          node.style.top = (Number(node.dataset.origTop) * sy) + "px";
          node.style.width = (Number(node.dataset.origWidth) * sx) + "px";
          node.style.height = (Number(node.dataset.origHeight) * sy) + "px";
        }
        function fitScene() {
          if (!scene) return;
          var vw = window.innerWidth || 1;
          var vh = window.innerHeight || 1;
          var sw = ${sceneWidth} || 1;
          var sh = ${sceneHeight} || 1;
          var scaleX = vw / sw;
          var scaleY = vh / sh;
          if (root) root.style.overflow = "hidden";
          var nodes = scene.querySelectorAll("[data-element-id]");
          var sx = outputScale ? 1 : scaleX;
          var sy = outputScale ? 1 : scaleY;
          if (outputScale) {
            scene.style.width = sw + "px";
            scene.style.height = sh + "px";
            scene.style.transform = "translate(0px,0px) scale(" + scaleX + "," + scaleY + ")";
          } else {
            scene.style.width = vw + "px";
            scene.style.height = vh + "px";
            scene.style.transform = "none";
          }
          nodes.forEach(function (node) {
            applyBoxScale(node, sx, sy);
            var inner = node.querySelectorAll("[data-viewport-sizer], [data-viewport-item]");
            inner.forEach(function (el) {
              applyBoxScale(el, sx, sy);
            });
          });
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
    if (faviconHrefWithVersion) {
      ["icon", "shortcut icon"].forEach((rel) => {
        const existing = win.document.querySelector(`link[rel='${rel}']`);
        if (existing?.parentNode) existing.parentNode.removeChild(existing);
        const link = win.document.createElement("link");
        link.rel = rel;
        link.type = "image/png";
        link.href = faviconHrefWithVersion;
        win.document.head.appendChild(link);
      });
    }
  }, [allElements, layers, productName, titleIconDataUrl]);

  const handlePreviewLayer = useCallback(() => {
    void (async () => {
      try {
        let projectId = workspaceProjects.activeProjectId;
        if (!projectId) {
          const created = await handleWorkspaceCreateProject();
          projectId = created?.id ?? null;
        } else if (workspaceProjects.dirty) {
          await handleWorkspaceSyncProject();
        }
        if (projectId) {
          await openOnlinePreviewForProject(projectId);
        }
      } catch (error) {
        toast({
          title: error instanceof Error ? error.message : t("panel.messages.openPreviewFailed"),
        });
      }
    })();
  }, [
    handleWorkspaceCreateProject,
    handleWorkspaceSyncProject,
    openOnlinePreviewForProject,
    workspaceProjects.activeProjectId,
    workspaceProjects.dirty,
  ]);

  useEffect(() => {
    if (!pendingPreviewLayerId) return;
    if (activeLayerId !== pendingPreviewLayerId) return;
    let cancelled = false;
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        if (cancelled) return;
        buildPreviewForLayer(pendingPreviewLayerId);
        setPendingPreviewLayerId(null);
      });
    });
    return () => {
      cancelled = true;
    };
  }, [activeLayerId, buildPreviewForLayer, pendingPreviewLayerId]);

  return (
    <div
      ref={panelRootRef}
      className={[
        "relative flex h-full min-h-0 w-full flex-col overflow-hidden bg-background text-foreground",
        className ?? "",
      ].join(" ")}
      style={{ ["--panel-font-px" as string]: `${panelFontPx}px` }}
    >
      <BusyOverlay />
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
        /* 画布节点、富文本内容使用各自的字号，不被编辑器 UI 字号强制覆盖 */
        .panel-font-root [data-workspace-region="view"] :is(span, label, p, strong, button, input, textarea, select, option, a, li),
        .panel-font-root [data-panel-user-text] :is(span, label, p, strong, button, input, textarea, select, option, a, li) {
          font-size: inherit !important;
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
        <PanelMenubar
          t={t}
          handleExport={handleExport}
          importInputRef={importInputRef}
          blueprintImportInputRef={blueprintImportInputRef}
          canUndo={canUndo}
          canRedo={canRedo}
          undo={undo}
          redo={redo}
          hasUnlockedSelection={hasUnlockedSelection}
          selectedIds={selectedIds}
          bringElementsForward={bringElementsForward}
          sendElementsBackward={sendElementsBackward}
          bringElementsToFront={bringElementsToFront}
          sendElementsToBack={sendElementsToBack}
          adjustUniformZoom={adjustUniformZoom}
          applyTheme={applyTheme}
          isDark={isDark}
          openBlueprintExportDialog={openBlueprintExportDialog}
          panelFontSize={panelFontSize}
          setPanelFontSize={setPanelFontSize}
          locale={locale}
          setLocale={setLocale}
          outputScale={outputScale}
          setOutputScale={setOutputScale}
        />
        <WorkspaceProjectNav
          projects={workspaceProjects.projects}
          activeProjectId={workspaceProjects.activeProjectId}
          activeProjectName={workspaceProjects.activeProjectName}
          dirty={workspaceProjects.dirty}
          previewingProjectIds={workspaceProjects.previewingProjectIds}
          onCreateProject={handleWorkspaceCreateProject}
          onOpenProject={handleWorkspaceOpenProject}
          onSyncProject={handleWorkspaceSyncProject}
          onDeleteProject={handleWorkspaceDeleteProject}
          onPreviewProject={openOnlinePreviewForProject}
        />
        <div className="flex-1" />
        <Button
          type="button"
          variant={assistantOpen ? "secondary" : "outline"}
          size="sm"
          className="h-7 shrink-0 px-2 text-xs"
          onClick={() => setAssistantOpen((v) => !v)}
        >
          {assistantOpen ? t("panel.ai.hide") : t("panel.ai.open")}
        </Button>
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
                selectViewElements([nodeId]);
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
              if (
                target?.closest(
                  "[data-workspace-region='blueprint'], [data-blueprint-toggle], [data-blueprint-node-card]"
                )
              ) {
                return;
              }
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
                  placeholder={t("panel.menubar.productNamePlaceholder")}
                  className="h-7 w-[220px] text-xs focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
                />
                <span className="text-[11px] text-muted-foreground">{t("panel.menubar.productName")}</span>
                <TooltipProvider delayDuration={150}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => titleIconInputRef.current?.click()}
                        className="rounded border border-border p-1 hover:bg-accent"
                        aria-label={t("panel.menubar.uploadTitleIcon")}
                      >
                        <IconImage />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="z-[10000]">{t("panel.menubar.uploadTitleIcon")}</TooltipContent>
                  </Tooltip>
                  {titleIconDataUrl ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => setTitleIconDataUrl("")}
                          className="rounded border border-border p-1 hover:bg-accent"
                          aria-label={t("panel.menubar.clearTitleIcon")}
                        >
                          <IconClose />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="z-[10000]">{t("panel.menubar.clearTitleIcon")}</TooltipContent>
                    </Tooltip>
                  ) : null}
                  {titleIconDataUrl ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => setTitleIconPreviewOpen(true)}
                          className="h-7 shrink-0 flex min-w-[92px] items-center gap-1.5 rounded border border-border bg-muted/30 px-2 py-1 hover:bg-accent/40"
                          aria-label={t("panel.menubar.viewTitleIcon")}
                        >
                          <img
                            src={titleIconDataUrl}
                            alt={t("panel.menubar.titleIconThumbAlt")}
                            className="h-5 w-5 shrink-0 rounded border border-border/60 object-cover"
                          />
                          <span className="text-[10px] text-muted-foreground">Title Icon</span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="z-[10000]">{t("panel.menubar.viewTitleIconHint")}</TooltipContent>
                    </Tooltip>
                  ) : null}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={undo}
                        disabled={!canUndo}
                        className="rounded border border-border p-1 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label={t("panel.menubar.undo")}
                      >
                        <IconUndo />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="z-[10000]">{t("panel.menubar.undoShortcut")}</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={redo}
                        disabled={!canRedo}
                        className="rounded border border-border p-1 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label={t("panel.menubar.redo")}
                      >
                        <IconRedo />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="z-[10000]">{t("panel.menubar.redoShortcut")}</TooltipContent>
                  </Tooltip>
                  <PanelHistoryPopover
                    t={t}
                    isHistoryPanelExpanded={isHistoryPanelExpanded}
                    setIsHistoryPanelExpanded={setIsHistoryPanelExpanded}
                    history={history}
                    historyCursor={historyCursor}
                    historyKeyword={historyKeyword}
                    setHistoryKeyword={setHistoryKeyword}
                    normalizedHistoryKeyword={normalizedHistoryKeyword}
                    goToHistory={goToHistory}
                    historyNow={historyNow}
                    themedScrollbarClass={themedScrollbarClass}
                  />
                </TooltipProvider>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      disabled={!hasUnlockedSelection}
                      className="rounded border border-border p-1 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label={t("panel.menubar.nodeZOrderAria")}
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
                      {t("panel.menubar.bringForward")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={!hasUnlockedSelection}
                      onClick={() => sendElementsBackward(selectedIds)}
                    >
                      <span className="mr-2 inline-flex"><IconBackward /></span>
                      {t("panel.menubar.sendBackward")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={!hasUnlockedSelection}
                      onClick={() => bringElementsToFront(selectedIds)}
                    >
                      <span className="mr-2 inline-flex"><IconBringFront /></span>
                      {t("panel.menubar.bringToFront")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={!hasUnlockedSelection}
                      onClick={() => sendElementsToBack(selectedIds)}
                    >
                      <span className="mr-2 inline-flex"><IconSendBack /></span>
                      {t("panel.menubar.sendToBack")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex-1" />
                <div
                  data-blueprint-toggle
                  className="flex shrink-0 items-center gap-2 rounded-md border border-border bg-muted/30 px-2 py-1"
                >
                  <span className="text-[11px] text-muted-foreground">{t("panel.menubar.blueprint")}</span>
                  <Switch
                    checked={blueprintOpen}
                    onCheckedChange={setBlueprintOpen}
                    aria-label={t("panel.menubar.showBlueprintPanel")}
                  />
                </div>
                <TooltipProvider delayDuration={150}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative">
                        <Switch
                          checked={isDark}
                          onCheckedChange={applyTheme}
                          aria-label={t("panel.menubar.toggleTheme")}
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
                    <TooltipContent className="z-[10000]">{t("panel.menubar.toggleThemeHint")}</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => adjustUniformZoom((z) => z - 0.1)}
                        className="rounded-md border border-border bg-secondary px-2 py-1 text-xs text-secondary-foreground hover:bg-secondary/80"
                      >
                        -
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="z-[10000]">{t("panel.menubar.zoomOutCanvas")}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span className="w-20 text-center text-xs">
                  {zoom.x === zoom.y
                    ? `${(zoom.x * 100).toFixed(0)}%`
                    : `${(zoom.x * 100).toFixed(0)}%×${(zoom.y * 100).toFixed(0)}%`}
                </span>
                <TooltipProvider delayDuration={150}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => adjustUniformZoom((z) => z + 0.1)}
                        className="rounded-md border border-border bg-secondary px-2 py-1 text-xs text-secondary-foreground hover:bg-secondary/80"
                      >
                        +
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="z-[10000]">{t("panel.menubar.zoomInCanvas")}</TooltipContent>
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
                    window.alert(messages.importJsonParseError);
                  }
                }}
              />
              <Input
                ref={blueprintImportInputRef}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  e.currentTarget.value = "";
                  if (!file) return;
                  try {
                    await handleBlueprintImportFile(file);
                  } catch {
                    window.alert(messages.blueprintImportInvalid);
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
                  } catch (error) {
                    window.alert(
                      error instanceof Error ? error.message : messages.iconReadFailed
                    );
                  }
                }}
              />

              <WorkspaceStageSplit
                blueprintOpen={blueprintOpen}
                blueprintProps={blueprintCanvasProps}
                blueprintLibraryItems={blueprintLibraryItems}
                activeBlueprintLibraryId={activeBlueprintLibraryId}
                currentBlueprintLabel={blueprintMeta.name}
                onSelectBlueprintLibraryItem={(id) => {
                  void handleSelectBlueprintLibraryItem(id);
                }}
                onRenameBlueprintLibraryItem={(id, name) => {
                  void handleRenameBlueprintLibraryItem(id, name);
                }}
                onDeleteBlueprintLibraryItem={(id) => {
                  void handleDeleteBlueprintLibraryItem(id);
                }}
                onSaveBlueprint={() => openBlueprintMetaDialog("save")}
                onSyncBlueprint={() => {
                  void syncBlueprintToLibrary();
                }}
                canSyncBlueprint={blueprintLibraryDirty}
                blueprintDebug={blueprintDebugToolbar}
                viewStage={
              <div
                data-workspace-region="view"
                className="relative h-full min-h-0 flex-1"
              >
                <PanelRulers
                  zoomX={zoom.x}
                  zoomY={zoom.y}
                  scrollLeft={scroll.left}
                  scrollTop={scroll.top}
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
                      !!target?.closest(".moveable-group") ||
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
                    ref={syncScrollRef}
                    zoom={zoom}
                    onZoomChange={setZoom}
                    onScrollChange={onViewportScrollChange}
                    canvasRef={syncCanvasRef}
                    viewportSyncRef={viewportSyncRef}
                    viewportOverlay={
                      <MoveableLayer
                        zoomX={zoom.x}
                        zoomY={zoom.y}
                        canvasContainer={canvasContainer}
                        dragContainer={viewportEl}
                        selectedTargets={selectedTargets}
                        elementsById={byId}
                        updateElement={updateElement}
                        refreshToken={historyCursor}
                        viewportSyncRef={viewportSyncRef}
                      />
                    }
                    onCanvasMouseDownCapture={(e) => {
                      if (e.button !== 0) return;
                      const target = e.target as HTMLElement | null;
                      if (!shouldClearSelectionOnBlank(target)) return;
                      clearSelection();
                    }}
                    onDropMaterial={({ materialId, x, y }) => {
                      if (activeLayer?.locked) {
                        showActionHint(messages.activeLayerLockedCannotAdd);
                        return;
                      }
                      addElementFromMaterial(materialId, x, y);
                    }}
                    className="h-full w-full"
                  >
                    <ElementsLayer
                      elements={scopedCanvasElements}
                      allElements={allElements}
                      selectedIds={selectedIds}
                      onSelectIds={selectViewElements}
                      updateElement={updateElement}
                      layerLocked={Boolean(activeLayer?.locked)}
                      onTableCellAction={(payload) => {
                        void triggerBlueprintNode(payload.blueprintNodeId, payload);
                      }}
                      boundViewEventTypes={boundViewEventTypes}
                      onViewUiEvent={(payload) => {
                        void emitViewEvent(payload);
                      }}
                    />

                    <SelectLayer
                      container={canvasContainer}
                      dragContainer={scrollRef.current}
                      rootContainer={scrollRef.current}
                      selectedIds={selectedIds}
                      onSelectedIdsChange={selectViewElements}
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
                              showActionHint(messages.nodeLayerLockedCannotCopy);
                              return;
                            }
                            setCopiedNodeId(contextMenuNodeId);
                          }}
                        >
                          {t("panel.menubar.duplicateNode")}
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
                                showActionHint(messages.sourceNodeNotFound);
                                return;
                              }
                              if (activeLayerId !== sourceNode.layerId) {
                                setActiveLayer(sourceNode.layerId);
                              }
                              selectViewElements([sourceNode.id]);
                              setContextMenuNodeId(null);
                            }}
                          >
                            {t("panel.menubar.locateSourceNode")}
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
                          {t("panel.menubar.openInMappingLayer")}
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
                                showActionHint(messages.selectionContainsLockedLayerNode);
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
                            ? t("panel.menubar.deleteSelectedNodes", { count: selectedIds.length })
                            : t("panel.menubar.deleteNode")}
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
                              showActionHint(messages.sourceLayerLockedCannotPaste);
                              return;
                            }
                            const canvasEl = canvasRef.current;
                            const viewportEl = scrollRef.current;
                            let targetX: number | undefined;
                            let targetY: number | undefined;
                            if (canvasEl) {
                              const canvasRect = canvasEl.getBoundingClientRect();
                              targetX =
                                (dropdownPoint.x - canvasRect.left) /
                                Math.max(0.0001, zoom.x);
                              targetY =
                                (dropdownPoint.y - canvasRect.top) /
                                Math.max(0.0001, zoom.y);
                            } else if (viewportEl) {
                              const rect = viewportEl.getBoundingClientRect();
                              const centerX = rect.left + rect.width / 2;
                              const centerY = rect.top + rect.height / 2;
                              targetX =
                                (centerX - rect.left + scrollPosRef.current.left) /
                                Math.max(0.0001, zoom.x);
                              targetY =
                                (centerY - rect.top + scrollPosRef.current.top) /
                                Math.max(0.0001, zoom.y);
                            }
                            duplicateElement(
                              copiedNodeId,
                              targetX !== undefined && targetY !== undefined
                                ? { position: { x: targetX, y: targetY } }
                                : undefined
                            );
                          }}
                        >
                          {t("panel.menubar.pasteNode")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          disabled={elements.length === 0}
                          onClick={() => {
                            selectViewElements(elements.map((el) => el.id));
                          }}
                        >
                          {t("panel.menubar.selectAllInLayer")}
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
                }
              />

              <PanelLayerDock
                t={t}
                isLayerPanelExpanded={isLayerPanelExpanded}
                setIsLayerPanelExpanded={setIsLayerPanelExpanded}
                addLayer={addLayer}
                canMergeLayers={canMergeLayers}
                setIsMergingLayers={setIsMergingLayers}
                isMergingLayers={isMergingLayers}
                layers={layers}
                activeLayerId={activeLayerId}
                setActiveLayer={setActiveLayer}
                themedScrollbarClass={themedScrollbarClass}
                activeLayer={activeLayer}
                editingLayerId={editingLayerId}
                setEditingLayerId={setEditingLayerId}
                editingLayerName={editingLayerName}
                setEditingLayerName={setEditingLayerName}
                renameLayer={renameLayer}
                setPrimaryLayer={setPrimaryLayer}
                toggleLayerLock={toggleLayerLock}
                getLayerDeleteBlockReason={getLayerDeleteBlockReason}
                showActionHint={showActionHint}
                setConfirmDeleteLayerId={setConfirmDeleteLayerId}
                setDeleteTargetLayerId={setDeleteTargetLayerId}
                setDeleteMode={setDeleteMode}
                toggleLayerMergeSelected={toggleLayerMergeSelected}
                mergeLayerName={mergeLayerName}
                setMergeLayerName={setMergeLayerName}
                mergeSelectedLayers={mergeSelectedLayers}
              />
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={20} minSize={20}>
          <div className="panel-font-root h-full">
            <WorkspaceConfigSidebar
              configFocus={sidebarConfigFocus}
              executionLog={executionLogView}
              selectedBlueprintNode={selectedBlueprintNode}
              blueprintGraphNodes={blueprintGraph.document.nodes}
              blueprintGraphEdges={blueprintGraph.document.edges}
              allowFalseSignalPropagation={
                blueprintGraph.document.allowFalseSignalPropagation ?? false
              }
              onUpdateAllowFalseSignalPropagation={
                handleUpdateAllowFalseSignalPropagation
              }
              onUpdateBlueprintNode={handleUpdateBlueprintNode}
              blueprintLibraryOptions={blueprintLibraryOptions}
              blueprintNodeOptions={blueprintGraph.document.nodes.map((node) => ({
                id: node.id,
                label: `${node.label || node.id}${node.nodeType ? ` (${node.nodeType})` : ""}`,
              }))}
              selectedElement={selectedElement}
              selectedElements={selectedElements}
              viewElementScope={selectedElementScope}
              allViewElements={allElements}
              layers={layers}
              updateElement={updateElement}
              setReferenceCopyMode={setReferenceCopyMode}
              nodeZOrderLabel={selectedNodeZOrderLabel}
              onExcludeSelectedNode={(nodeId) => {
                setSelectedIds((prev) => {
                  const nextIds = prev.filter((id) => id !== nodeId);
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
      <AssistantChatPanel
        deps={assistantDeps}
        open={assistantOpen}
        onOpenChange={setAssistantOpen}
      />
      <PanelWorkspaceDialogs
        t={t}
        mappingDeleteConfirmOpen={mappingDeleteConfirmOpen}
        setMappingDeleteConfirmOpen={setMappingDeleteConfirmOpen}
        mappingDeleteProceedRef={mappingDeleteProceedRef}
        mappingDeleteImpactCount={mappingDeleteImpactCount}
        deletingLayer={deletingLayer}
        deletingLayerMode={deletingLayerMode}
        setConfirmDeleteLayerId={setConfirmDeleteLayerId}
        setDeleteMode={setDeleteMode}
        setDeleteTargetLayerId={setDeleteTargetLayerId}
        deleteTargetLayerId={deleteTargetLayerId}
        deleteTargetCandidates={deleteTargetCandidates}
        deleteLayer={deleteLayer}
        showActionHint={showActionHint}
        titleIconPreviewOpen={titleIconPreviewOpen}
        setTitleIconPreviewOpen={setTitleIconPreviewOpen}
        titleIconZoom={titleIconZoom}
        setTitleIconZoom={setTitleIconZoom}
        titleIconDataUrl={titleIconDataUrl}
      />
      <BlueprintMetaDialog
        open={blueprintMetaDialogOpen}
        mode={blueprintMetaDialogMode}
        initialMeta={blueprintMeta}
        onOpenChange={setBlueprintMetaDialogOpen}
        onConfirm={(meta) => {
          void handleBlueprintMetaConfirm(meta);
        }}
      />
      {pendingBlueprintNodeSwitch ? (
        <BlueprintNodeSwitchTaskDialog
          open
          fromNodeId={pendingBlueprintNodeSwitch.fromNodeId}
          toNodeId={pendingBlueprintNodeSwitch.toNodeId}
          onOpenChange={(open) => {
            if (!open) stayOnCurrentBlueprintNode();
          }}
          onKeepTaskAndSwitch={keepBlueprintTaskAndSwitch}
          onCancelTaskAndSwitch={cancelBlueprintTaskAndSwitch}
        />
      ) : null}
      <Toaster />
    </div>
  );
}

export function ReactViewPanel({
  locale,
  onLocaleChange,
  nameSpace,
  ...rest
}: ReactViewPanelProps) {
  return (
    <I18nRoot locale={locale} onLocaleChange={onLocaleChange} nameSpace={nameSpace}>
      <ReactViewPanelInner nameSpace={nameSpace} {...rest} />
    </I18nRoot>
  );
}
