<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, shallowRef, watch } from "vue";
import {
  registerAbuilderViewHandle,
  type AbuilderViewHandle,
} from "./library/abuilder-view-handle";
import {
  captureEditorPreviewSnapshot,
  registerPreviewSnapshotProvider,
} from "./library/preview-snapshot";
import { readOutputScale } from "./utils/outputScale";
import type { State } from "@arronqzy/rx-store";
import {
  useBlueprintDslLocaleSync,
  ApiCollectionManagerDialog,
  BlueprintGraph,
  abortClockNode,
  blueprintDocumentsEqual,
  buildBlueprintExportPayload,
  buildLibraryRecord,
  createLibraryBlueprintId,
  deleteBlueprintLibraryRecord,
  documentToRunnableGraph,
  downloadBlueprintExport,
  getBlueprintLibraryRecord,
  hydrateApiCollections,
  libraryRecordFromImport,
  listBlueprintLibrary,
  parseBlueprintImportFile,
  putBlueprintLibraryRecord,
  stopAllClockSchedules,
  useBlueprintDebugSession,
  useBlueprintNodeSelectionGuard,
  useBlueprintPageLifecycle,
  type BlueprintDocument,
  type BlueprintGraphNode,
  type BlueprintLibraryListItem,
  type BlueprintMetaDraft,
  resolveRunnableNodeType,
  resolveViewElementIds,
} from "@arronqzy/vue-blueprint";
import { collectArmedViewEventBindings, EVENT_NODE_TYPE, LIFECYCLE_NODE_TYPE, buildApiCollectionSyncPatches, toApiCollectionSyncResult, type LibraryBlueprintResolver } from "@arronqzy/blueprint-dsl";
import {
  Button,
  Dropdown,
  Input,
  Layout,
  Menu,
  Tooltip,
  message,
} from "ant-design-vue";
import { usePanelElements } from "./hooks/usePanelElements";
import {
  buildOnlinePreviewUrl,
  useWorkspaceProjects,
} from "./hooks/useWorkspaceProjects";
import type { WorkspaceProjectRecord } from "./library/workspace-project-db";
import { AbuilderEvents, emitAbuilderEvent } from "./library/event-subscription";
import { subscribeBlueprintLibraryChanged } from "./library/blueprint-library-sync";
import { type ViewportZoom } from "./viewportZoom";
import PanelCanvas from "./components/PanelCanvas.vue";
import ElementsLayer from "./components/ElementsLayer.vue";
import MoveableLayer from "./components/MoveableLayer.vue";
import SelectLayer from "./components/SelectLayer.vue";
import MaterialSidebar from "./components/MaterialSidebar.vue";
import WorkspaceStageSplit from "./components/WorkspaceStageSplit.vue";
import WorkspaceProjectNav from "./components/WorkspaceProjectNav.vue";
import WorkspaceConfigSidebar from "./components/WorkspaceConfigSidebar.vue";
import type { WorkspaceConfigFocus } from "./components/WorkspaceConfigSidebar.vue";
import PanelLayerDock from "./components/PanelLayerDock.vue";
import {
  IconBackward,
  IconBlueprint,
  IconBringFront,
  IconClose,
  IconForward,
  IconImage,
  IconLayers,
  IconMoon,
  IconRedo,
  IconSendBack,
  IconSun,
  IconUndo,
} from "./icons";
import {
  clearViewElementScopes,
  getViewElementScope,
  setViewElementScopes,
  useViewElementScope,
  useViewScopeStoreVersion,
} from "./scope/view-scope-store";
import { resolvePanelElementScope } from "./utils/scope-template";
import { useRafThrottledScroll } from "./hooks/useRafThrottledScroll";
import { useI18n } from "@arronqzy/i18n/vue";
import { relocalizeMessage } from "@arronqzy/i18n";
import { getPanelMessages } from "./constants/messages";
import BusyOverlay from "./components/BusyOverlay.vue";
import PanelRulers from "./components/PanelRulers.vue";
import { assertFileSize, parseJsonText, runBusyTask } from "./utils/async-work";
import {
  getSelectedTargetsFromIds,
  shouldClearSelectionOnBlank,
} from "./utils/panelSelection";
import "./stage.css";
import "../../dist/styles.css";

const { t, locale, setLocale } = useI18n();
useBlueprintDslLocaleSync();
const panelMessages = () => getPanelMessages(t);

const props = withDefaults(
  defineProps<{
    class?: string;
    initialZoom?: number;
    nameSpace?: string | null;
    initialWorkspace?: WorkspaceProjectRecord | null;
    /**
     * 按 IndexedDB id 打开工作区（不 remount）。
     * 与 initialWorkspace 同时存在时：首次优先完整记录；之后 id 变化从 IndexedDB 打开。
     */
    workspaceId?: string | null;
    /** 顶栏「设置 → 关于」展示的 npm 包名 */
    packageName?: string | null;
    /** 顶栏「设置 → 关于」展示的包版本号 */
    packageVersion?: string | null;
    /** 顶栏品牌标记（图片 URL 或内联 SVG） */
    projectIcon?: string | null;
  }>(),
  {
    initialZoom: 1,
    nameSpace: null,
    initialWorkspace: null,
    workspaceId: null,
    packageName: null,
    packageVersion: null,
    projectIcon: null,
  }
);

const packageVersionText = computed(() => {
  const version = (props.packageVersion ?? "").trim();
  if (!version) return t("panel.menubar.versionUnavailable");
  return t("panel.menubar.versionValue", { version });
});

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
  openElementsInNewLayer,
  addElementFromMaterial,
  setActiveLayer,
  addLayer,
  renameLayer,
  toggleLayerLock,
  deleteLayer,
  toggleLayerMergeSelected,
  mergeSelectedLayers,
  setPrimaryLayer,
  undo,
  redo,
  canUndo,
  canRedo,
  historyCursor,
  exportPanelData,
  importPanelData,
  setReferenceCopyMode,
} = usePanelElements();

const selectedIds = ref<string[]>([]);
const contextMenuNodeId = ref<string | null>(null);
const dropdownOpen = ref(false);
const dropdownEpoch = ref(0);
const dropdownPoint = ref({ x: 0, y: 0 });
const copiedNodeId = ref<string | null>(null);
const rightPointer = ref({
  active: false,
  moved: false,
  startX: 0,
  startY: 0,
});
const zoom = ref<ViewportZoom>({ x: props.initialZoom, y: props.initialZoom });
const blueprintGraph = ref(BlueprintGraph.empty());
const blueprintMeta = ref<BlueprintMetaDraft>({ name: t("panel.defaults.unnamedBlueprint"), remark: "" });
const blueprintOpen = ref(false);
const selectedBlueprintNodeId = ref<string | null>(null);
const blueprintLibraryItems = ref<BlueprintLibraryListItem[]>([]);
const activeBlueprintLibraryId = ref<string | null>(null);
const blueprintSyncedDocument = ref<BlueprintDocument | null>(null);
const workspaceBlueprintRef = shallowRef<{
  document: BlueprintDocument;
  meta: BlueprintMetaDraft;
} | null>(null);
const configFocus = ref<WorkspaceConfigFocus>("view");
const productName = ref(t("panel.defaults.unnamedProduct"));
const displayProductName = computed(() => {
  void locale.value;
  return relocalizeMessage(productName.value, "panel.defaults.unnamedProduct", t);
});
const displayBlueprintName = computed(() => {
  void locale.value;
  return relocalizeMessage(
    blueprintMeta.value.name,
    ["panel.defaults.unnamedBlueprint", "blueprint.dialog.unnamedBlueprint"],
    t
  );
});
const titleIconDataUrl = ref("");
const titleIconInputRef = ref<HTMLInputElement | null>(null);
const editingLayerId = ref<string | null>(null);
const editingLayerName = ref("");
const isMergingLayers = ref(false);
const mergeLayerName = ref("");
const isLayerPanelExpanded = ref(false);
const leftWidth = ref(220);
const rightWidth = ref(280);
const importInputRef = ref<HTMLInputElement | null>(null);
const blueprintImportInputRef = ref<HTMLInputElement | null>(null);
const apiCollectionManagerOpen = ref(false);
const panelFontSize = ref<"sm" | "md" | "lg">("md");
const panelFontPx = computed(() =>
  panelFontSize.value === "sm" ? 12 : panelFontSize.value === "lg" ? 15 : 13
);
const isDark = ref(
  typeof document !== "undefined"
    ? document.documentElement.classList.contains("dark")
    : true
);
const themedScrollbarClass =
  "scrollbar-thin [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-muted/40 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border/80 [&::-webkit-scrollbar-thumb]:hover:bg-border";
const projectMarkMarkup = computed(() => {
  const value = (props.projectIcon ?? "").trim();
  if (!value) return null;
  return {
    isSvg: value.startsWith("<svg") || value.startsWith("<?xml"),
    value,
  };
});

function applyTheme(dark: boolean) {
  isDark.value = dark;
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", dark);
  }
}

function adjustUniformZoom(updater: (value: number) => number) {
  setUniformZoom(updater(uniformZoom.value));
}

async function onTitleIconFileChange(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = "";
  if (!file) return;
  try {
    assertFileSize(file, "image");
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ""));
      reader.onerror = () => reject(reader.error ?? new Error("read failed"));
      reader.readAsDataURL(file);
    });
    titleIconDataUrl.value = dataUrl;
  } catch (err) {
    message.warning(err instanceof Error ? err.message : panelMessages().iconReadFailed);
  }
}

const viewportEl = ref<HTMLDivElement | null>(null);
const canvasEl = ref<HTMLDivElement | null>(null);
const viewportSyncRef = ref<{ current: (() => void) | null }>({ current: null });
const selectedTargets = ref<HTMLElement[]>([]);

const { scroll, onScrollChange: onViewportScrollChange } = useRafThrottledScroll();

const activeLayer = computed(() => layers.value.find((l) => l.id === activeLayerId.value));
const mergeSelectedCount = computed(
  () => layers.value.filter((l) => l.mergeSelected && !l.isMapping).length
);
const canMergeLayers = computed(() => mergeSelectedCount.value >= 2);
const uniformZoom = computed(() => zoom.value.x);
const selectedElement = computed(() => {
  const id = selectedIds.value[0];
  return id ? byId.value.get(id) ?? null : null;
});
const selectedElements = computed(() =>
  selectedIds.value.map((id) => byId.value.get(id)).filter(Boolean) as NonNullable<
    ReturnType<typeof byId.value.get>
  >[]
);
const selectedNodeZOrderLabel = computed(() => {
  if (!selectedElement.value) return "-";
  return String(selectedElement.value.zIndex ?? 1);
});
const selectedBlueprintNode = computed(() => {
  if (!selectedBlueprintNodeId.value) return null;
  return blueprintGraph.value.getNode(selectedBlueprintNodeId.value) ?? null;
});
const blueprintLibraryNameById = computed(
  () => new Map(blueprintLibraryItems.value.map((item) => [item.id, item.name]))
);
const blueprintLibraryOptions = computed(() =>
  blueprintLibraryItems.value.map((item) => ({ id: item.id, label: item.name }))
);
const blueprintLibraryDirty = computed(() => {
  if (!activeBlueprintLibraryId.value || !blueprintSyncedDocument.value) return false;
  return !blueprintDocumentsEqual(blueprintGraph.value.document, blueprintSyncedDocument.value);
});
const hasUnlockedSelection = computed(() =>
  selectedIds.value.some((id) => {
    const node = byId.value.get(id);
    if (!node || node.locked) return false;
    return !layers.value.find((l) => l.id === node.layerId)?.locked;
  })
);

const viewElementScope = useViewElementScope(
  computed(() => selectedElement.value?.id ?? null)
);
const scopeStoreVersion = useViewScopeStoreVersion();
const scopedCanvasElements = computed(() => {
  void scopeStoreVersion.value;
  return elements.value.map((el) =>
    resolvePanelElementScope(el, getViewElementScope(el.id))
  );
});

function excludeSelectedNode(nodeId: string) {
  const nextIds = selectedIds.value.filter((id) => id !== nodeId);
  selectedIds.value = nextIds;
  selectedTargets.value = getSelectedTargetsFromIds(canvasEl.value, nextIds);
}

function adjustNodeZOrder(
  nodeId: string,
  action: "bringForward" | "sendBackward" | "bringToFront" | "sendToBack"
) {
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
}

function syncScrollRef(el: HTMLDivElement | null) {
  viewportEl.value = el;
}
function syncCanvasRef(el: HTMLDivElement | null) {
  canvasEl.value = el;
}

watch([selectedIds, elements, historyCursor], () => {
  selectedTargets.value = getSelectedTargetsFromIds(canvasEl.value, selectedIds.value);
}, { deep: true });

watch(elements, (next) => {
  const existing = new Set(next.map((el) => el.id));
  selectedIds.value = selectedIds.value.filter((id) => existing.has(id));
});

watch(activeLayerId, () => {
  selectedIds.value = [];
  selectedTargets.value = [];
  configFocus.value = "view";
  selectedBlueprintNodeId.value = null;
});

watch(blueprintOpen, (open) => {
  if (!open) stopAllClockSchedules();
});

function selectIds(ids: string[]) {
  selectedIds.value = ids;
  if (ids.length > 0) {
    configFocus.value = "view";
    requestSelectBlueprintNode(null);
  }
}

function setUniformZoom(value: number) {
  const rounded = Number(Math.min(4, Math.max(0.25, value)).toFixed(4));
  zoom.value = { x: rounded, y: rounded };
}

function onDropMaterial(payload: { materialId: string; x: number; y: number }) {
  if (activeLayer.value?.locked) return;
  addElementFromMaterial(payload.materialId, payload.x, payload.y);
}

function onCanvasMouseDownCapture(e: MouseEvent) {
  if (e.button !== 0) return;
  const target = e.target as HTMLElement | null;
  if (target?.closest("[data-workspace-region='blueprint'], [data-blueprint-toggle]")) return;
  if (!shouldClearSelectionOnBlank(target)) return;
  selectedIds.value = [];
  configFocus.value = "view";
  requestSelectBlueprintNode(null);
}

function applyBlueprintNodeSelection(nodeId: string | null) {
  selectedBlueprintNodeId.value = nodeId;
  if (nodeId) {
    configFocus.value = "blueprint";
    selectedIds.value = [];
    selectedTargets.value = [];
  } else {
    configFocus.value = "view";
  }
}

const {
  requestSelectNode: requestSelectBlueprintNode,
} = useBlueprintNodeSelectionGuard(selectedBlueprintNodeId, applyBlueprintNodeSelection);

const resolveLibraryBlueprint: LibraryBlueprintResolver = async (libraryBlueprintId) => {
  const record = await getBlueprintLibraryRecord(libraryBlueprintId, props.nameSpace);
  if (!record) return null;
  const items = await listBlueprintLibrary(props.nameSpace);
  const nameById = new Map(items.map((item) => [item.id, item.name]));
  return documentToRunnableGraph(record.document, { libraryNameById: nameById });
};

function handleBlueprintExecutionBlocked(msg: string) {
  message.warning(msg);
}

function handleViewScopeUpdate(viewElementIds: string[], scope: unknown) {
  setViewElementScopes(viewElementIds, scope);
}

const blueprintDebugSession = useBlueprintDebugSession({
  graph: blueprintGraph,
  blueprintId: activeBlueprintLibraryId,
  blueprintName: computed(() => displayBlueprintName.value || t("panel.defaults.unnamedBlueprint")),
  resolveLibraryBlueprint,
  libraryNameById: blueprintLibraryNameById,
  onExecutionBlocked: handleBlueprintExecutionBlocked,
  onViewScopeUpdate: handleViewScopeUpdate,
  nameSpace: () => props.nameSpace,
});

const blueprintDebugToolbar = computed(() => ({
  lifecyclePhase: blueprintDebugSession.selectedLifecycleNodeId.value ?? undefined,
  lifecycleOptions: blueprintDebugSession.lifecycleNodes.value
    .filter((node) => node.canEmit)
    .map((node) => ({
      value: node.id,
      label: node.label,
    })),
  onLifecyclePhaseChange: (id: string) =>
    blueprintDebugSession.selectLifecycleNode(id || null),
}));

function handleAbortClock(nodeId: string) {
  blueprintDebugSession.abortClock(nodeId);
  abortClockNode(activeBlueprintLibraryId.value ?? "local", nodeId);
}

const blueprintCanvasProps = computed(() => ({
  graph: blueprintGraph.value,
  selectedNodeId: selectedBlueprintNodeId.value,
  executionOverlay: blueprintDebugSession.executionOverlay.value,
  libraryNameById: blueprintLibraryNameById.value,
  onSelectNode: requestSelectBlueprintNode,
  onAbortClock: handleAbortClock,
}));

function handleUpdateBlueprintNode(
  nodeId: string,
  patch: Partial<BlueprintGraphNode>
) {
  blueprintGraph.value = blueprintGraph.value.updateNode(nodeId, patch);
}

function handleUpdateAllowFalseSignalPropagation(value: boolean) {
  blueprintGraph.value = blueprintGraph.value.withDocument({
    ...blueprintGraph.value.document,
    allowFalseSignalPropagation: value,
  });
}

async function refreshBlueprintLibrary() {
  blueprintLibraryItems.value = await listBlueprintLibrary(props.nameSpace);
}

watch(
  () => props.nameSpace,
  (nameSpace) => {
    void hydrateApiCollections(nameSpace).catch((error) => {
      console.error("[abuilder] hydrate api collections failed", error);
    });
  },
  { immediate: true }
);

onMounted(() => {
  void refreshBlueprintLibrary();
});

watch(
  () => props.nameSpace,
  (nameSpace, _prev, onCleanup) => {
    onCleanup(subscribeBlueprintLibraryChanged(() => void refreshBlueprintLibrary(), nameSpace));
  },
  { immediate: true }
);

function handleWorkspaceProjectApplied(record: WorkspaceProjectRecord) {
  workspaceBlueprintRef.value = {
    document: record.blueprintDocument,
    meta: {
      name: record.blueprintMeta?.name ?? t("panel.defaults.unnamedBlueprint"),
      remark: record.blueprintMeta?.remark ?? "",
    },
  };
  activeBlueprintLibraryId.value = null;
  blueprintSyncedDocument.value = null;
  selectedBlueprintNodeId.value = null;
  blueprintOpen.value = true;
  configFocus.value = "blueprint";
}

const workspaceProjects = useWorkspaceProjects({
  exportPanelData,
  importPanelData,
  blueprintDocument: computed(() => blueprintGraph.value.document),
  blueprintMeta,
  setBlueprintGraph: (graph) => {
    blueprintGraph.value = graph;
  },
  setBlueprintMeta: (meta) => {
    blueprintMeta.value = meta;
  },
  productName,
  setProductName: (name) => {
    productName.value = name;
  },
  titleIconDataUrl,
  setTitleIconDataUrl: (url) => {
    titleIconDataUrl.value = url;
  },
  panelRevision: computed(() => `${historyCursor.value}|${allElements.value.length}`),
  onProjectApplied: handleWorkspaceProjectApplied,
  initialWorkspace: () => props.initialWorkspace,
  workspaceId: () => props.workspaceId,
  nameSpace: () => props.nameSpace,
});

const viewHandle: AbuilderViewHandle = {
  getNameSpace: () => props.nameSpace ?? null,
  getCurrentWorkspace: () => workspaceProjects.getCurrentWorkspaceRecord(),
  openWorkspace: (idOrRecord) => workspaceProjects.handleOpenProject(idOrRecord),
  createWorkspace: () => workspaceProjects.handleCreateProject(),
  saveWorkspace: () => workspaceProjects.handleSaveProject(),
  syncWorkspace: () => workspaceProjects.handleSyncProject(),
};

defineExpose(viewHandle);
onUnmounted(registerAbuilderViewHandle(viewHandle));

watch(
  [canvasEl, allElements, layers, activeLayerId, () => props.nameSpace],
  () => {
    registerPreviewSnapshotProvider(async () =>
      captureEditorPreviewSnapshot({
        canvasRoot: canvasEl.value,
        allElements: allElements.value,
        layers: layers.value,
        activeLayerId: activeLayerId.value,
        outputScale: readOutputScale(props.nameSpace),
      })
    );
  },
  { immediate: true }
);
onUnmounted(() => registerPreviewSnapshotProvider(null));

const blueprintLifecycleToken = computed(() => {
  const doc = blueprintGraph.value.document;
  const nodes = doc.nodes;
  const edges = doc.edges;
  let sig = `${nodes.length}:${edges.length}`;
  for (const node of nodes) {
    sig += `|${node.id}:${resolveRunnableNodeType(node)}:${node.lifecyclePhase ?? ""}`;
  }
  for (const edge of edges) {
    sig += `>${edge.id}:${edge.source}:${edge.target}`;
  }
  return sig;
});

const { triggerBlueprintNode, emitViewEvent, firedLifecyclePhases } = useBlueprintPageLifecycle({
  graph: blueprintGraph,
  active: blueprintOpen,
  bootKey: computed(() => workspaceProjects.activeProjectId.value ?? undefined),
  onUpdated: computed(() => `${activeLayerId.value}|${blueprintLifecycleToken.value}`),
  resolveLibraryBlueprint,
  libraryNameById: blueprintLibraryNameById,
  rootLibraryBlueprintId: activeBlueprintLibraryId,
  onExecutionBlocked: handleBlueprintExecutionBlocked,
  onViewScopeUpdate: handleViewScopeUpdate,
});

const boundViewEventTypes = computed(() =>
  collectArmedViewEventBindings(
    blueprintGraph.value.document.nodes.map((node) => ({
      id: node.id,
      nodeType: resolveRunnableNodeType(node),
      lifecyclePhase: node.lifecyclePhase,
      viewElementIds: resolveViewElementIds(node),
      eventConfig: node.eventConfig,
    })),
    blueprintGraph.value.document.edges,
    EVENT_NODE_TYPE,
    LIFECYCLE_NODE_TYPE,
    firedLifecyclePhases.value
  )
);

const blueprintNodeOptions = computed(() =>
  blueprintGraph.value.document.nodes.map((node) => ({
    id: node.id,
    label: `${node.label || node.id}${node.nodeType ? ` (${node.nodeType})` : ""}`,
  }))
);
async function loadBlueprintFromLibrary(id: string) {
  await runBusyTask(t("common.loadingBlueprint"), async () => {
    const record = await getBlueprintLibraryRecord(id, props.nameSpace);
    if (!record) {
      message.error(panelMessages().blueprintNotFound);
      void refreshBlueprintLibrary();
      return;
    }
    blueprintGraph.value = BlueprintGraph.fromDocument(record.document);
    blueprintMeta.value = { name: record.name, remark: record.remark ?? "" };
    activeBlueprintLibraryId.value = record.id;
    blueprintSyncedDocument.value = record.document;
    selectedBlueprintNodeId.value = null;
    configFocus.value = "blueprint";
    blueprintOpen.value = true;
  });
}

function snapshotWorkspaceBlueprint() {
  workspaceBlueprintRef.value = {
    document: blueprintGraph.value.document,
    meta: { ...blueprintMeta.value },
  };
}

function returnToWorkspaceBlueprint() {
  const snapshot = workspaceBlueprintRef.value;
  if (snapshot) {
    blueprintGraph.value = BlueprintGraph.fromDocument(snapshot.document);
    blueprintMeta.value = snapshot.meta;
  }
  activeBlueprintLibraryId.value = null;
  blueprintSyncedDocument.value = null;
  selectedBlueprintNodeId.value = null;
}

async function handleSelectBlueprintLibraryItem(id: string) {
  if (activeBlueprintLibraryId.value === id) {
    returnToWorkspaceBlueprint();
    return;
  }
  if (!activeBlueprintLibraryId.value) snapshotWorkspaceBlueprint();
  await loadBlueprintFromLibrary(id);
}

async function syncBlueprintToLibrary() {
  const libraryId = activeBlueprintLibraryId.value;
  if (!libraryId) return;
  await runBusyTask(t("common.syncingBlueprint"), async () => {
    const record = await getBlueprintLibraryRecord(libraryId, props.nameSpace);
    if (!record) return;
    await putBlueprintLibraryRecord({
      ...record,
      document: blueprintGraph.value.document,
      name: blueprintMeta.value.name,
      remark: blueprintMeta.value.remark,
    }, props.nameSpace);
    blueprintSyncedDocument.value = blueprintGraph.value.document;
    message.success(panelMessages().blueprintSyncedToLibrary);
    await refreshBlueprintLibrary();
  });
}

async function saveBlueprintToLibrary(meta: BlueprintMetaDraft) {
  await runBusyTask(t("common.savingBlueprint"), async () => {
    const id = activeBlueprintLibraryId.value ?? createLibraryBlueprintId();
    const record = buildLibraryRecord({
      id,
      document: blueprintGraph.value.document,
      meta,
      source: "saved",
    });
    await putBlueprintLibraryRecord(record, props.nameSpace);
    activeBlueprintLibraryId.value = id;
    blueprintSyncedDocument.value = blueprintGraph.value.document;
    blueprintMeta.value = meta;
    await refreshBlueprintLibrary();
    message.success(panelMessages().blueprintSavedToLibrary);
  });
}

function handleExport() {
  void runBusyTask(t("common.exportingPanel"), async () => {
    const data = exportPanelData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const safeName = ((productName.value ?? "").trim() || "panel")
      .replace(/[\\/:*?"<>|]/g, "-")
      .replace(/\s+/g, "-");
    a.download = `${safeName}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });
}

async function handleImportFile(file: File) {
  try {
    await runBusyTask(t("common.importingPanel"), async () => {
      assertFileSize(file, "json");
      const text = await file.text();
      const parsed = await parseJsonText<State>(text);
      const ok = importPanelData(parsed);
      if (!ok) window.alert(panelMessages().importInvalidFormat);
      else selectedIds.value = [];
    });
  } catch (error) {
    message.error(error instanceof Error ? error.message : panelMessages().importInvalidFormat);
  }
}

function openBlueprintExport() {
  void runBusyTask(t("common.exportingPanel"), async () => {
    downloadBlueprintExport(
      buildBlueprintExportPayload(blueprintGraph.value.document, blueprintMeta.value)
    );
    message.success(panelMessages().blueprintExported);
  });
}

function handleApiCollectionUploadStart(info: {
  fileNames: string[];
  count: number;
}) {
  emitAbuilderEvent(AbuilderEvents.apiCollectionUploadStart, {
    ...info,
    nameSpace: props.nameSpace ?? null,
  });
}

function handleApiCollectionUploadSuccess(info: {
  collections: Array<{
    id: string;
    name: string;
    apiCount: number;
    persistLocal: boolean;
  }>;
}) {
  emitAbuilderEvent(AbuilderEvents.apiCollectionUploadSuccess, {
    ...info,
    nameSpace: props.nameSpace ?? null,
  });
}

function handleApiCollectionSync(record: {
  id: string;
  document: import("@arronqzy/blueprint-dsl").ApiCollectionDocument;
}) {
  const patches = buildApiCollectionSyncPatches({
    collectionId: record.id,
    document: record.document,
    nodes: blueprintGraph.value.document.nodes
      .filter((node) => node.role === "fetch" || Boolean(node.fetchConfig))
      .map((node) => ({
        id: node.id,
        label: node.label,
        fetchConfig: node.fetchConfig,
      })),
  });
  if (patches.length === 0) return toApiCollectionSyncResult([]);
  let next = blueprintGraph.value;
  for (const patch of patches) {
    next = next.updateNode(patch.nodeId, {
      fetchConfig: patch.fetchConfigPatch as import("@arronqzy/blueprint-dsl").FetchRequestConfig,
    });
  }
  blueprintGraph.value = next;
  return toApiCollectionSyncResult(patches);
}

async function handleBlueprintImportFile(file: File) {
  try {
    await runBusyTask(t("common.importingBlueprint"), async () => {
      assertFileSize(file, "json");
      const text = await file.text();
      const payload = parseBlueprintImportFile(await parseJsonText(text));
      const record = libraryRecordFromImport(payload);
      await putBlueprintLibraryRecord(record, props.nameSpace);
      await refreshBlueprintLibrary();
      if (!activeBlueprintLibraryId.value) snapshotWorkspaceBlueprint();
      await loadBlueprintFromLibrary(record.id);
      message.success(panelMessages().blueprintImported);
    });
  } catch (error) {
    message.error(error instanceof Error ? error.message : panelMessages().importInvalidFormat);
  }
}

async function handleWorkspaceCreateProject() {
  try {
    const result = await workspaceProjects.handleCreateProject();
    if (result?.name) message.success(panelMessages().workspaceCreated(result.name));
  } catch (error) {
    message.error(
      error instanceof Error ? error.message : panelMessages().createWorkspaceFailed
    );
  }
}

async function handleWorkspaceOpenProject(id: string) {
  try {
    stopAllClockSchedules();
    clearViewElementScopes();
    await workspaceProjects.handleOpenProject(id);
    selectedIds.value = [];
    message.success(panelMessages().workspaceLoaded);
  } catch (error) {
    message.error(error instanceof Error ? error.message : panelMessages().openWorkspaceFailed);
  }
}

async function handleWorkspaceSyncProject() {
  try {
    const name = await workspaceProjects.handleSyncProject();
    if (name) message.success(panelMessages().blueprintSynced(name));
  } catch (error) {
    message.error(error instanceof Error ? error.message : panelMessages().syncFailed);
  }
}

async function handleWorkspaceDeleteProject(id: string) {
  try {
    await workspaceProjects.handleDeleteProject(id);
    message.success(panelMessages().workspaceDeleted);
  } catch (error) {
    message.error(
      error instanceof Error ? error.message : panelMessages().deleteWorkspaceFailed
    );
  }
}

async function openOnlinePreviewForProject(
  projectId: string,
  options?: { syncFirst?: boolean }
) {
  await workspaceProjects.handlePreviewProject(projectId, options);
}

function startRenameLayer(layerId: string, name: string) {
  editingLayerId.value = layerId;
  editingLayerName.value = name;
}

function commitRenameLayer() {
  if (!editingLayerId.value) return;
  renameLayer(editingLayerId.value, editingLayerName.value);
  editingLayerId.value = null;
  editingLayerName.value = "";
}

function handleMergeLayers() {
  if (!canMergeLayers.value) {
    message.warning(panelMessages().mergeNeedTwoLayers);
    return;
  }
  mergeSelectedLayers(mergeLayerName.value.trim() || undefined);
  isMergingLayers.value = false;
  mergeLayerName.value = "";
}

function handleDeleteSelected() {
  if (!hasUnlockedSelection.value) return;
  deleteElements(selectedIds.value);
  selectedIds.value = [];
}

function onKeyDown(e: KeyboardEvent) {
  const cmdOrCtrl = e.metaKey || e.ctrlKey;
  if (cmdOrCtrl && e.key.toLowerCase() === "z") {
    e.preventDefault();
    if (e.shiftKey) {
      if (canRedo.value) redo();
    } else if (canUndo.value) {
      undo();
    }
    return;
  }
  if ((e.key === "Delete" || e.key === "Backspace") && hasUnlockedSelection.value) {
    const target = e.target as HTMLElement | null;
    if (target?.closest("input, textarea, [contenteditable='true']")) return;
    e.preventDefault();
    handleDeleteSelected();
  }
}

onMounted(() => window.addEventListener("keydown", onKeyDown));
onUnmounted(() => window.removeEventListener("keydown", onKeyDown));
</script>

<template>
  <Layout
    class="abuilder-stage vue-view-panel relative flex h-full min-h-0 w-full flex-col overflow-hidden bg-background text-foreground"
    :class="props.class"
    :key="locale"
    :style="{ '--panel-font-px': panelFontPx + 'px' }"
  >
    <Layout.Header class="rv-topbar panel-font-root relative z-30 flex h-11 shrink-0 items-center gap-2 px-3 text-foreground">
      <span v-if="projectMarkMarkup" class="rv-mark" aria-hidden="true">
        <span
          v-if="projectMarkMarkup.isSvg"
          class="block h-full w-full [&_svg]:h-full [&_svg]:w-full"
          v-html="projectMarkMarkup.value"
        />
        <img v-else :src="projectMarkMarkup.value" alt="" />
      </span>
      <Dropdown :trigger="['click']">
        <Button type="text" class="!text-foreground">{{ t("panel.menubar.file") }}</Button>
        <template #overlay>
          <Menu>
            <Menu.Item @click="handleExport">{{ t("panel.menubar.exportPanelJson") }}</Menu.Item>
            <Menu.Item @click="importInputRef?.click()">{{ t("panel.menubar.importPanelJson") }}</Menu.Item>
          </Menu>
        </template>
      </Dropdown>
      <Dropdown :trigger="['click']">
        <Button type="text" class="!text-foreground">{{ t("panel.menubar.edit") }}</Button>
        <template #overlay>
          <Menu>
            <Menu.Item :disabled="!canUndo" @click="undo">{{ t("panel.menubar.undo") }}</Menu.Item>
            <Menu.Item :disabled="!canRedo" @click="redo">{{ t("panel.menubar.redo") }}</Menu.Item>
            <Menu.Divider />
            <Menu.Item :disabled="!hasUnlockedSelection" @click="bringElementsForward(selectedIds)">{{ t("panel.menubar.bringForward") }}</Menu.Item>
            <Menu.Item :disabled="!hasUnlockedSelection" @click="sendElementsBackward(selectedIds)">{{ t("panel.menubar.sendBackward") }}</Menu.Item>
            <Menu.Item :disabled="!hasUnlockedSelection" @click="bringElementsToFront(selectedIds)">{{ t("panel.menubar.bringToFront") }}</Menu.Item>
            <Menu.Item :disabled="!hasUnlockedSelection" @click="sendElementsToBack(selectedIds)">{{ t("panel.menubar.sendToBack") }}</Menu.Item>
            <Menu.Divider />
            <Menu.Item :disabled="!hasUnlockedSelection" @click="handleDeleteSelected">{{ t("panel.menubar.deleteSelected") }}</Menu.Item>
          </Menu>
        </template>
      </Dropdown>
      <Dropdown :trigger="['click']">
        <Button type="text" class="!text-foreground">{{ t("panel.menubar.blueprint") }}</Button>
        <template #overlay>
          <Menu>
            <Menu.Item @click="openBlueprintExport">{{ t("panel.menubar.exportBlueprint") }}</Menu.Item>
            <Menu.Item @click="blueprintImportInputRef?.click()">{{ t("panel.menubar.importBlueprint") }}</Menu.Item>
            <Menu.Divider />
            <Menu.Item @click="apiCollectionManagerOpen = true">{{ t("panel.menubar.apiCollections") }}</Menu.Item>
          </Menu>
        </template>
      </Dropdown>
      <WorkspaceProjectNav
        :projects="workspaceProjects.projects.value"
        :active-project-id="workspaceProjects.activeProjectId.value"
        :active-project-name="workspaceProjects.activeProjectName.value"
        :dirty="workspaceProjects.dirty.value"
        :previewing-project-ids="workspaceProjects.previewingProjectIds.value"
        @create-project="handleWorkspaceCreateProject"
        @open-project="handleWorkspaceOpenProject"
        @sync-project="handleWorkspaceSyncProject"
        @delete-project="handleWorkspaceDeleteProject"
        @preview-project="openOnlinePreviewForProject"
      />
      <Dropdown :trigger="['click']">
        <Button type="text" class="!text-foreground">{{ t("panel.menubar.settings") }}</Button>
        <template #overlay>
          <Menu>
            <Menu.Item
              :class="{ 'ant-menu-item-selected': panelFontSize === 'sm' }"
              @click="panelFontSize = 'sm'"
            >
              {{ t("panel.menubar.fontSmall") }}
            </Menu.Item>
            <Menu.Item
              :class="{ 'ant-menu-item-selected': panelFontSize === 'md' }"
              @click="panelFontSize = 'md'"
            >
              {{ t("panel.menubar.fontMedium") }}
            </Menu.Item>
            <Menu.Item
              :class="{ 'ant-menu-item-selected': panelFontSize === 'lg' }"
              @click="panelFontSize = 'lg'"
            >
              {{ t("panel.menubar.fontLarge") }}
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item @click="applyTheme(!isDark)">
              {{ isDark ? t("panel.menubar.switchToLight") : t("panel.menubar.switchToDark") }}
            </Menu.Item>
            <Menu.Divider />
            <Menu.ItemGroup :title="t('panel.theme.language')">
              <Menu.Item :class="{ 'ant-menu-item-selected': locale === 'zh-CN' }" @click="setLocale('zh-CN')">{{ t("panel.theme.zhCN") }}</Menu.Item>
              <Menu.Item :class="{ 'ant-menu-item-selected': locale === 'en-US' }" @click="setLocale('en-US')">{{ t("panel.theme.enUS") }}</Menu.Item>
            </Menu.ItemGroup>
            <Menu.Divider />
            <Menu.SubMenu :title="t('panel.menubar.about')" key="about">
              <Menu.Item
                key="version"
                disabled
                class="!cursor-default !opacity-100"
                :data-abuilder-version="props.packageVersion || undefined"
              >
                {{ packageVersionText }}
              </Menu.Item>
            </Menu.SubMenu>
          </Menu>
        </template>
      </Dropdown>
      <div class="flex-1" />
    </Layout.Header>

    <Layout class="min-h-0 flex-1">
      <Layout.Sider :width="leftWidth" theme="light" class="rv-material-sider min-h-0 overflow-hidden !bg-transparent">
        <div class="panel-font-root h-full min-w-0">
          <MaterialSidebar
            :layers="layers"
            :all-elements="allElements"
            :selected-ids="selectedIds"
            :on-select-node="(nodeId, layerId) => { if (activeLayerId !== layerId) setActiveLayer(layerId); selectIds([nodeId]); }"
          />
        </div>
      </Layout.Sider>

      <Layout.Content class="rv-stage relative flex h-full flex-col overflow-hidden bg-background">
        <div class="panel-font-root min-w-0 h-full">
          <div class="flex h-full min-h-0 flex-col">
            <div class="rv-canvas-toolbar relative flex items-center gap-2 px-3 py-1.5 text-foreground">
              <Input
                :value="displayProductName"
                size="small"
                class="h-7 w-[200px] rounded-md border-border/70 bg-background/80 text-xs"
                :placeholder="t('panel.menubar.productNamePlaceholder')"
                :aria-label="t('panel.menubar.productName')"
                @update:value="(value: string) => (productName = value)"
              />
              <Tooltip :title="t('panel.menubar.uploadTitleIcon')">
                <button
                  type="button"
                  class="rounded border border-border p-1 hover:bg-accent"
                  :aria-label="t('panel.menubar.uploadTitleIcon')"
                  @click="titleIconInputRef?.click()"
                >
                  <IconImage />
                </button>
              </Tooltip>
              <Tooltip v-if="titleIconDataUrl" :title="t('panel.menubar.clearTitleIcon')">
                <button
                  type="button"
                  class="rounded border border-border p-1 hover:bg-accent"
                  :aria-label="t('panel.menubar.clearTitleIcon')"
                  @click="titleIconDataUrl = ''"
                >
                  <IconClose />
                </button>
              </Tooltip>
              <span
                v-if="titleIconDataUrl"
                class="h-7 shrink-0 flex min-w-[92px] items-center gap-1.5 rounded border border-border bg-muted/30 px-2 py-1"
              >
                <img
                  :src="titleIconDataUrl"
                  :alt="t('panel.menubar.titleIconThumbAlt')"
                  class="h-5 w-5 shrink-0 rounded border border-border/60 object-cover"
                />
                <span class="text-[10px] text-muted-foreground">Title Icon</span>
              </span>
              <Tooltip :title="t('panel.menubar.undo')">
                <button
                  type="button"
                  class="rounded border border-border p-1 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
                  :disabled="!canUndo"
                  :aria-label="t('panel.menubar.undo')"
                  @click="undo"
                >
                  <IconUndo />
                </button>
              </Tooltip>
              <Tooltip :title="t('panel.menubar.redo')">
                <button
                  type="button"
                  class="rounded border border-border p-1 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
                  :disabled="!canRedo"
                  :aria-label="t('panel.menubar.redo')"
                  @click="redo"
                >
                  <IconRedo />
                </button>
              </Tooltip>
              <Dropdown :trigger="['click']" :disabled="!hasUnlockedSelection">
                <button
                  type="button"
                  class="rounded border border-border p-1 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
                  :disabled="!hasUnlockedSelection"
                  :aria-label="t('panel.menubar.nodeZOrderAria')"
                >
                  <IconLayers />
                </button>
                <template #overlay>
                  <Menu>
                    <Menu.Item :disabled="!hasUnlockedSelection" @click="bringElementsForward(selectedIds)">
                      <span class="mr-2 inline-flex"><IconForward /></span>
                      {{ t("panel.menubar.bringForward") }}
                    </Menu.Item>
                    <Menu.Item :disabled="!hasUnlockedSelection" @click="sendElementsBackward(selectedIds)">
                      <span class="mr-2 inline-flex"><IconBackward /></span>
                      {{ t("panel.menubar.sendBackward") }}
                    </Menu.Item>
                    <Menu.Item :disabled="!hasUnlockedSelection" @click="bringElementsToFront(selectedIds)">
                      <span class="mr-2 inline-flex"><IconBringFront /></span>
                      {{ t("panel.menubar.bringToFront") }}
                    </Menu.Item>
                    <Menu.Item :disabled="!hasUnlockedSelection" @click="sendElementsToBack(selectedIds)">
                      <span class="mr-2 inline-flex"><IconSendBack /></span>
                      {{ t("panel.menubar.sendToBack") }}
                    </Menu.Item>
                  </Menu>
                </template>
              </Dropdown>
              <div class="flex-1" />
              <div class="inline-flex items-center gap-1">
                <Tooltip :title="t('panel.menubar.showBlueprintPanel')">
                  <button
                    type="button"
                    data-blueprint-toggle
                    class="inline-flex h-7 w-7 items-center justify-center rounded-md border transition-colors"
                    :class="
                      blueprintOpen
                        ? 'border-primary/50 bg-primary/15 text-primary'
                        : 'border-border/70 bg-background/80 text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    "
                    :aria-pressed="blueprintOpen"
                    :aria-label="t('panel.menubar.showBlueprintPanel')"
                    @click="blueprintOpen = !blueprintOpen"
                  >
                    <IconBlueprint :active="blueprintOpen" />
                  </button>
                </Tooltip>
                <Tooltip :title="t('panel.menubar.toggleTheme')">
                  <button
                    type="button"
                    class="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border/70 bg-background/80 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    :aria-label="t('panel.menubar.toggleTheme')"
                    :aria-pressed="isDark"
                    @click="applyTheme(!isDark)"
                  >
                    <IconMoon v-if="isDark" />
                    <IconSun v-else />
                  </button>
                </Tooltip>
              </div>
              <Tooltip :title="t('panel.menubar.zoomOutCanvas')">
                <button
                  type="button"
                  class="rounded-md border border-border bg-secondary px-2 py-1 text-xs text-secondary-foreground hover:bg-secondary/80"
                  @click="adjustUniformZoom((z) => z - 0.1)"
                >
                  -
                </button>
              </Tooltip>
              <span class="w-20 text-center text-xs">
                {{
                  zoom.x === zoom.y
                    ? `${(zoom.x * 100).toFixed(0)}%`
                    : `${(zoom.x * 100).toFixed(0)}%×${(zoom.y * 100).toFixed(0)}%`
                }}
              </span>
              <Tooltip :title="t('panel.menubar.zoomInCanvas')">
                <button
                  type="button"
                  class="rounded-md border border-border bg-secondary px-2 py-1 text-xs text-secondary-foreground hover:bg-secondary/80"
                  @click="adjustUniformZoom((z) => z + 0.1)"
                >
                  +
                </button>
              </Tooltip>
            </div>

            <WorkspaceStageSplit
              :blueprint-open="blueprintOpen"
              :blueprint-props="blueprintCanvasProps"
              :blueprint-library-items="blueprintLibraryItems"
              :active-blueprint-library-id="activeBlueprintLibraryId"
              :current-blueprint-label="displayBlueprintName"
              :can-sync-blueprint="blueprintLibraryDirty"
              :blueprint-debug="blueprintDebugToolbar"
              :on-select-blueprint-library-item="(id) => void handleSelectBlueprintLibraryItem(id)"
              :on-save-blueprint="() => void saveBlueprintToLibrary(blueprintMeta)"
              :on-sync-blueprint="() => void syncBlueprintToLibrary()"
              @graph-change="(g) => (blueprintGraph = g)"
            >
              <div class="relative min-h-0 flex-1">
                <PanelRulers
                  :zoom-x="zoom.x"
                  :zoom-y="zoom.y"
                  :scroll-left="scroll.left"
                  :scroll-top="scroll.top"
                />
                <PanelCanvas
                  class="h-full w-full"
                  :zoom="zoom"
                  :scroll-ref="syncScrollRef"
                  :canvas-ref="syncCanvasRef"
                  :viewport-sync-ref="viewportSyncRef"
                  :on-drop-material="onDropMaterial"
                  :on-canvas-mouse-down-capture="onCanvasMouseDownCapture"
                  @zoom-change="(z) => (zoom = z)"
                  @scroll-change="onViewportScrollChange"
                >
                  <ElementsLayer
                    :elements="scopedCanvasElements"
                    :all-elements="allElements"
                    :selected-ids="selectedIds"
                    :update-element="updateElement"
                    :layer-locked="Boolean(activeLayer?.locked)"
                    :on-table-cell-action="
                      (payload) => {
                        void triggerBlueprintNode(payload.blueprintNodeId, payload);
                      }
                    "
                    :bound-view-event-types="boundViewEventTypes"
                    :on-view-ui-event="
                      (payload) => {
                        void emitViewEvent(payload);
                      }
                    "
                    @select-ids="selectIds"
                  />
                  <SelectLayer
                    :container="canvasEl"
                    :drag-container="viewportEl"
                    :root-container="viewportEl"
                    :selected-ids="selectedIds"
                    @selected-ids-change="selectIds"
                  />
                  <template #viewport-overlay>
                    <MoveableLayer
                      :zoom-x="zoom.x"
                      :zoom-y="zoom.y"
                      :canvas-container="canvasEl"
                      :drag-container="viewportEl"
                      :selected-targets="selectedTargets"
                      :elements-by-id="byId"
                      :update-element="updateElement"
                      :refresh-token="historyCursor"
                      :viewport-sync-ref="viewportSyncRef"
                    />
                  </template>
                </PanelCanvas>
              </div>
            </WorkspaceStageSplit>

            <div class="rv-layer-dock">
              <PanelLayerDock
                :t="t"
                :is-layer-panel-expanded="isLayerPanelExpanded"
                :set-is-layer-panel-expanded="(v) => (isLayerPanelExpanded = v)"
                :add-layer="addLayer"
                :can-merge-layers="canMergeLayers"
                :set-is-merging-layers="(v) => (isMergingLayers = v)"
                :is-merging-layers="isMergingLayers"
                :layers="layers"
                :active-layer-id="activeLayerId"
                :set-active-layer="setActiveLayer"
                :themed-scrollbar-class="themedScrollbarClass"
                :active-layer="activeLayer ?? null"
                :editing-layer-id="editingLayerId"
                :set-editing-layer-id="(id) => (editingLayerId = id)"
                :editing-layer-name="editingLayerName"
                :set-editing-layer-name="(name) => (editingLayerName = name)"
                :rename-layer="renameLayer"
                :set-primary-layer="setPrimaryLayer"
                :toggle-layer-lock="toggleLayerLock"
                :on-delete-layer="deleteLayer"
                :toggle-layer-merge-selected="toggleLayerMergeSelected"
                :merge-layer-name="mergeLayerName"
                :set-merge-layer-name="(name) => (mergeLayerName = name)"
                :merge-selected-layers="mergeSelectedLayers"
              />
            </div>
          </div>
        </div>
      </Layout.Content>

      <Layout.Sider :width="rightWidth" theme="light" class="rv-config-sider min-h-0 overflow-hidden !bg-transparent">
        <div class="panel-font-root h-full min-w-0">
          <WorkspaceConfigSidebar
            :config-focus="configFocus"
            :selected-element="selectedElement"
            :selected-elements="selectedElements"
            :layers="layers"
            :update-element="updateElement"
            :view-element-scope="viewElementScope"
            :set-reference-copy-mode="setReferenceCopyMode"
            :node-z-order-label="selectedNodeZOrderLabel"
            :on-exclude-selected-node="excludeSelectedNode"
            :on-adjust-node-z-order="adjustNodeZOrder"
            :selected-blueprint-node="selectedBlueprintNode"
            :blueprint-graph-nodes="blueprintGraph.document.nodes"
            :blueprint-graph-edges="blueprintGraph.document.edges"
            :blueprint-trace-entries="blueprintDebugSession.entries.value"
            :allow-false-signal-propagation="blueprintGraph.document.allowFalseSignalPropagation"
            :blueprint-library-options="blueprintLibraryOptions"
            :blueprint-node-options="blueprintNodeOptions"
            :all-view-elements="allElements"
            :on-update-blueprint-node="handleUpdateBlueprintNode"
            :on-update-allow-false-signal-propagation="handleUpdateAllowFalseSignalPropagation"
          />
        </div>
      </Layout.Sider>
    </Layout>

    <BusyOverlay />
    <input ref="importInputRef" type="file" accept="application/json" class="hidden" @change="async (e) => { const f = (e.target as HTMLInputElement).files?.[0]; (e.target as HTMLInputElement).value = ''; if (f) await handleImportFile(f); }" />
    <input ref="blueprintImportInputRef" type="file" accept="application/json" class="hidden" @change="async (e) => { const f = (e.target as HTMLInputElement).files?.[0]; (e.target as HTMLInputElement).value = ''; if (f) await handleBlueprintImportFile(f); }" />
    <input
      ref="titleIconInputRef"
      type="file"
      accept="image/*"
      class="hidden"
      @change="onTitleIconFileChange"
    />

    <ApiCollectionManagerDialog
      :open="apiCollectionManagerOpen"
      :on-open-change="(open) => (apiCollectionManagerOpen = open)"
      :on-upload-start="handleApiCollectionUploadStart"
      :on-upload-success="handleApiCollectionUploadSuccess"
      :on-sync-collection="handleApiCollectionSync"
    />
  </Layout>
</template>

<style>
/* 功能说明视觉层次：主标签醒目、辅助说明更轻（类苹果） */
.panel-font-root {
  font-size: var(--panel-font-px);
  font-weight: 400;
  letter-spacing: -0.011em;
}
.panel-font-root [data-typo="title"] {
  font-size: calc(var(--panel-font-px) * 1.08) !important;
  font-weight: 600 !important;
  letter-spacing: -0.022em;
}
.panel-font-root [data-typo="label"] {
  font-size: var(--panel-font-px) !important;
  font-weight: 510 !important;
  letter-spacing: -0.015em;
}
.panel-font-root [data-typo="caption"] {
  font-size: calc(var(--panel-font-px) * 0.85) !important;
  font-weight: 400 !important;
  letter-spacing: -0.008em;
}
.panel-font-root [data-typo="micro"] {
  font-size: calc(var(--panel-font-px) * 0.77) !important;
  font-weight: 400 !important;
}
/* 画布节点、富文本内容使用各自的字号，不被编辑器 UI 字号强制覆盖 */
.panel-font-root [data-workspace-region="view"] :is(span, label, p, strong, button, input, textarea, select, option, a, li),
.panel-font-root [data-panel-user-text] :is(span, label, p, strong, button, input, textarea, select, option, a, li) {
  font-size: inherit !important;
  font-weight: inherit !important;
  letter-spacing: inherit !important;
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
</style>

<style scoped>
.vue-view-panel :deep(.ant-layout-sider-children) {
  display: flex;
  flex-direction: column;
  min-height: 0;
}
</style>
