<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, shallowRef, watch } from "vue";
import type { State } from "@arronqzy/rx-store";
import {
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
} from "@arronqzy/vue-blueprint";
import type { LibraryBlueprintResolver } from "@arronqzy/blueprint-dsl";
import {
  Button,
  Checkbox,
  Dropdown,
  Input,
  Layout,
  Menu,
  Modal,
  Slider,
  Space,
  Switch,
  Tabs,
  Tag,
  message,
} from "ant-design-vue";
import { usePanelElements } from "./hooks/usePanelElements";
import {
  buildOnlinePreviewUrl,
  useWorkspaceProjects,
} from "./hooks/useWorkspaceProjects";
import type { WorkspaceProjectRecord } from "./library/workspace-project-db";
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
import {
  clearViewElementScopes,
  setViewElementScopes,
  useViewElementScope,
} from "./scope/view-scope-store";
import { useRafThrottledScroll } from "./hooks/useRafThrottledScroll";
import { useI18n } from "@arronqzy/i18n/vue";
import { getPanelMessages } from "./constants/messages";
import "../tailwind.css";

const { t, locale, setLocale } = useI18n();
const panelMessages = () => getPanelMessages(t);

const props = withDefaults(
  defineProps<{
    class?: string;
    initialZoom?: number;
  }>(),
  { initialZoom: 1 }
);

const {
  elements,
  allElements,
  byId,
  layers,
  activeLayerId,
  updateElement,
  deleteElements,
  bringElementsToFront,
  sendElementsToBack,
  bringElementsForward,
  sendElementsBackward,
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
const titleIconDataUrl = ref("");
const editingLayerId = ref<string | null>(null);
const editingLayerName = ref("");
const isMergingLayers = ref(false);
const mergeLayerName = ref("");
const leftWidth = ref(240);
const rightWidth = ref(300);
const importInputRef = ref<HTMLInputElement | null>(null);
const blueprintImportInputRef = ref<HTMLInputElement | null>(null);

const viewportEl = ref<HTMLDivElement | null>(null);
const canvasEl = ref<HTMLDivElement | null>(null);
const viewportSyncRef = ref<{ current: (() => void) | null }>({ current: null });
const selectedTargets = ref<HTMLElement[]>([]);

const { onScrollChange: onViewportScrollChange } = useRafThrottledScroll();

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

function getSelectedTargetsFromIds(container: HTMLElement | null, ids: string[]) {
  if (!container) return [];
  const targets: HTMLElement[] = [];
  for (const id of ids) {
    const el = container.querySelector<HTMLElement>(`[data-element-id="${id}"]`);
    if (el) targets.push(el);
  }
  return targets;
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
  if (target?.closest(".rv-selectable")) return;
  if (target?.closest("[data-workspace-region='blueprint'], [data-blueprint-toggle]")) return;
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
  const record = await getBlueprintLibraryRecord(libraryBlueprintId);
  if (!record) return null;
  const items = await listBlueprintLibrary();
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
  blueprintName: computed(() => { void locale.value; return blueprintMeta.value.name || t("panel.defaults.unnamedBlueprint"); }),
  resolveLibraryBlueprint,
  libraryNameById: blueprintLibraryNameById,
  onExecutionBlocked: handleBlueprintExecutionBlocked,
  onViewScopeUpdate: handleViewScopeUpdate,
});

const blueprintDebugToolbar = computed(() => ({
  lifecyclePhase: blueprintDebugSession.selectedLifecycleNodeId.value ?? undefined,
  lifecycleOptions: blueprintDebugSession.lifecycleNodes.value.map((node) => ({
    value: node.id,
    label: node.label,
  })),
  onLifecyclePhaseChange: (id: string) => blueprintDebugSession.selectLifecycleNode(id),
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
  blueprintLibraryItems.value = await listBlueprintLibrary();
}

onMounted(() => {
  void refreshBlueprintLibrary();
});

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
});

const { triggerBlueprintNode } = useBlueprintPageLifecycle({
  graph: blueprintGraph,
  active: blueprintOpen,
  bootKey: computed(() => workspaceProjects.activeProjectId.value ?? undefined),
  onUpdated: computed(() => `${activeLayerId.value}|${historyCursor.value}`),
  resolveLibraryBlueprint,
  libraryNameById: blueprintLibraryNameById,
  rootLibraryBlueprintId: activeBlueprintLibraryId,
  onExecutionBlocked: handleBlueprintExecutionBlocked,
  onViewScopeUpdate: handleViewScopeUpdate,
});

const blueprintNodeOptions = computed(() =>
  blueprintGraph.value.document.nodes.map((node) => ({
    id: node.id,
    label: `${node.label || node.id}${node.nodeType ? ` (${node.nodeType})` : ""}`,
  }))
);
async function loadBlueprintFromLibrary(id: string) {
  const record = await getBlueprintLibraryRecord(id);
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
  if (!activeBlueprintLibraryId.value) return;
  const record = await getBlueprintLibraryRecord(activeBlueprintLibraryId.value);
  if (!record) return;
  await putBlueprintLibraryRecord({
    ...record,
    document: blueprintGraph.value.document,
    name: blueprintMeta.value.name,
    remark: blueprintMeta.value.remark,
  });
  blueprintSyncedDocument.value = blueprintGraph.value.document;
  message.success(panelMessages().blueprintSyncedToLibrary);
  await refreshBlueprintLibrary();
}

async function saveBlueprintToLibrary(meta: BlueprintMetaDraft) {
  const id = activeBlueprintLibraryId.value ?? createLibraryBlueprintId();
  const record = buildLibraryRecord({
    id,
    document: blueprintGraph.value.document,
    meta,
    source: "saved",
  });
  await putBlueprintLibraryRecord(record);
  activeBlueprintLibraryId.value = id;
  blueprintSyncedDocument.value = blueprintGraph.value.document;
  blueprintMeta.value = meta;
  await refreshBlueprintLibrary();
  message.success(panelMessages().blueprintSavedToLibrary);
}

function handleExport() {
  const data = exportPanelData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const safeName = (productName.value.trim() || "panel")
    .replace(/[\\/:*?"<>|]/g, "-")
    .replace(/\s+/g, "-");
  a.download = `${safeName}-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

async function handleImportFile(file: File) {
  const text = await file.text();
  const parsed = JSON.parse(text) as State;
  const ok = importPanelData(parsed);
  if (!ok) window.alert(panelMessages().importInvalidFormat);
  else selectedIds.value = [];
}

function openBlueprintExport() {
  downloadBlueprintExport(
    buildBlueprintExportPayload(blueprintGraph.value.document, blueprintMeta.value)
  );
  message.success(panelMessages().blueprintExported);
}

async function handleBlueprintImportFile(file: File) {
  const text = await file.text();
  const payload = parseBlueprintImportFile(JSON.parse(text) as unknown);
  const record = libraryRecordFromImport(payload);
  await putBlueprintLibraryRecord(record);
  await refreshBlueprintLibrary();
  if (!activeBlueprintLibraryId.value) snapshotWorkspaceBlueprint();
  await loadBlueprintFromLibrary(record.id);
  message.success(panelMessages().blueprintImported);
}

async function handleWorkspaceCreateProject() {
  const result = await workspaceProjects.handleCreateProject();
  if (result?.name) message.success(panelMessages().workspaceCreated(result.name));
}

async function handleWorkspaceOpenProject(id: string) {
  try {
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
  await workspaceProjects.handleDeleteProject(id);
  message.success(panelMessages().workspaceDeleted);
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
  <Layout class="vue-view-panel h-screen overflow-hidden" :class="props.class" :key="locale">
    <Layout.Header class="flex h-auto flex-wrap items-center gap-2 bg-[#001529] px-3 py-2">
      <Dropdown :trigger="['click']">
        <Button type="text" class="!text-white">{{ t("panel.menubar.file") }}</Button>
        <template #overlay>
          <Menu>
            <Menu.Item @click="handleExport">{{ t("panel.menubar.exportPanelJson") }}</Menu.Item>
            <Menu.Item @click="importInputRef?.click()">{{ t("panel.menubar.importPanelJson") }}</Menu.Item>
          </Menu>
        </template>
      </Dropdown>
      <Dropdown :trigger="['click']">
        <Button type="text" class="!text-white">{{ t("panel.menubar.edit") }}</Button>
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
        <Button type="text" class="!text-white">{{ t("panel.menubar.blueprint") }}</Button>
        <template #overlay>
          <Menu>
            <Menu.Item @click="openBlueprintExport">{{ t("panel.menubar.exportBlueprint") }}</Menu.Item>
            <Menu.Item @click="blueprintImportInputRef?.click()">{{ t("panel.menubar.importBlueprint") }}</Menu.Item>
          </Menu>
        </template>
      </Dropdown>
      <WorkspaceProjectNav
        :projects="workspaceProjects.projects.value"
        :active-project-id="workspaceProjects.activeProjectId.value"
        :active-project-name="workspaceProjects.activeProjectName.value"
        :dirty="workspaceProjects.dirty.value"
        @create-project="handleWorkspaceCreateProject"
        @open-project="handleWorkspaceOpenProject"
        @sync-project="handleWorkspaceSyncProject"
        @delete-project="handleWorkspaceDeleteProject"
        @preview-project="openOnlinePreviewForProject"
      />
            <Dropdown :trigger="['click']">
        <Button type="text" class="!text-white">{{ t("panel.theme.language") }}</Button>
        <template #overlay>
          <Menu>
            <Menu.Item :class="{ 'ant-menu-item-selected': locale === 'zh-CN' }" @click="setLocale('zh-CN')">{{ t("panel.theme.zhCN") }}</Menu.Item>
            <Menu.Item :class="{ 'ant-menu-item-selected': locale === 'en-US' }" @click="setLocale('en-US')">{{ t("panel.theme.enUS") }}</Menu.Item>
          </Menu>
        </template>
      </Dropdown>
      <div class="flex-1" />
      <Space>
        <Button size="small" :disabled="!canUndo" @click="undo">{{ t("panel.menubar.undo") }}</Button>
        <Button size="small" :disabled="!canRedo" @click="redo">{{ t("panel.menubar.redo") }}</Button>
        <Button
          size="small"
          type="primary"
          :disabled="!workspaceProjects.activeProjectId.value"
          @click="workspaceProjects.activeProjectId.value && openOnlinePreviewForProject(workspaceProjects.activeProjectId.value, { syncFirst: workspaceProjects.dirty.value })"
        >
          {{ t("common.preview") }}
        </Button>
      </Space>
    </Layout.Header>

    <Layout class="min-h-0 flex-1">
      <Layout.Sider :width="leftWidth" theme="light" class="min-h-0 overflow-hidden">
        <MaterialSidebar
          :layers="layers"
          :all-elements="allElements"
          :selected-ids="selectedIds"
          :on-select-node="(nodeId, layerId) => { if (activeLayerId !== layerId) setActiveLayer(layerId); selectIds([nodeId]); }"
        />
      </Layout.Sider>

      <Layout.Content class="relative min-h-0 min-w-0">
        <div class="flex h-full min-h-0 flex-col">
          <div class="flex flex-wrap items-center gap-2 border-b bg-white px-3 py-2">
            <Input
              v-model:value="productName"
              size="small"
              class="w-[200px]"
              :placeholder="t('panel.menubar.productName')"
            />
            <span class="text-xs text-gray-500">{{ t("panel.menubar.zoom") }}</span>
            <Slider
              :min="0.25"
              :max="4"
              :step="0.05"
              :value="uniformZoom"
              style="width: 140px"
              @change="(v: number | [number, number]) => setUniformZoom(Array.isArray(v) ? v[0] : v)"
            />
            <Tag v-if="activeLayer">{{ activeLayer.name }}</Tag>
            <Tag color="blue">{{ t("panel.menubar.selectedCount", { count: selectedIds.length }) }}</Tag>
            <div data-blueprint-toggle class="ml-auto flex items-center gap-2">
              <span class="text-xs text-gray-500">{{ t("panel.menubar.blueprint") }}</span>
              <Switch v-model:checked="blueprintOpen" size="small" />
            </div>
          </div>

          <WorkspaceStageSplit
            :blueprint-open="blueprintOpen"
            :blueprint-props="blueprintCanvasProps"
            :blueprint-library-items="blueprintLibraryItems"
            :active-blueprint-library-id="activeBlueprintLibraryId"
            :current-blueprint-label="blueprintMeta.name"
            :can-sync-blueprint="blueprintLibraryDirty"
            :blueprint-debug="blueprintDebugToolbar"
            :on-select-blueprint-library-item="(id) => void handleSelectBlueprintLibraryItem(id)"
            :on-save-blueprint="() => void saveBlueprintToLibrary(blueprintMeta)"
            :on-sync-blueprint="() => void syncBlueprintToLibrary()"
            @graph-change="(g) => (blueprintGraph = g)"
          >
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
                :elements="elements"
                :all-elements="allElements"
                :selected-ids="selectedIds"
                :update-element="updateElement"
                :layer-locked="Boolean(activeLayer?.locked)"
                :on-table-cell-action="
                  (payload) => {
                    void triggerBlueprintNode(payload.blueprintNodeId, payload);
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
          </WorkspaceStageSplit>

          <div class="border-t bg-white px-2 py-2">
            <div class="mb-2 flex flex-wrap items-center gap-2">
              <span class="text-xs font-semibold text-gray-500">{{ t("panel.layers.title") }}</span>
              <Button size="small" @click="addLayer()">{{ t("panel.layers.addShort") }}</Button>
              <Button size="small" :disabled="!canMergeLayers" @click="isMergingLayers = true">{{ t("panel.layers.mergeShort") }}</Button>
            </div>
            <Tabs
              size="small"
              :active-key="activeLayerId"
              type="card"
              @update:active-key="(k: string | number) => setActiveLayer(String(k))"
            >
              <Tabs.TabPane v-for="layer in layers" :key="layer.id">
                <template #tab>
                  <span class="inline-flex items-center gap-1">
                    {{ layer.name }}
                    <Tag v-if="layer.isMapping" color="blue" class="!m-0">{{ t("panel.layers.mapping") }}</Tag>
                    <Tag v-if="layer.isPrimary" color="green" class="!m-0">{{ t("panel.layers.primary") }}</Tag>
                  </span>
                </template>
              </Tabs.TabPane>
            </Tabs>

            <div v-if="activeLayer" class="mt-2 flex flex-wrap items-center gap-2 rounded border px-2 py-1.5 text-xs">
              <template v-if="editingLayerId === activeLayer.id">
                <Input
                  v-model:value="editingLayerName"
                  size="small"
                  class="w-40"
                  @press-enter="commitRenameLayer"
                />
                <Button size="small" type="primary" @click="commitRenameLayer">{{ t("common.ok") }}</Button>
              </template>
              <template v-else>
                <span class="font-medium">{{ activeLayer.name }}</span>
                <Button size="small" type="link" @click="startRenameLayer(activeLayer.id, activeLayer.name)">{{ t("panel.layers.renameShort") }}</Button>
              </template>
              <Button size="small" @click="toggleLayerLock(activeLayer.id)">
                {{ activeLayer.locked ? t("panel.layers.unlockShort") : t("panel.layers.lockShort") }}
              </Button>
              <Checkbox
                :checked="Boolean(activeLayer.mergeSelected)"
                @change="() => toggleLayerMergeSelected(activeLayer!.id)"
              >
                {{ t("panel.layers.joinMerge") }}
              </Checkbox>
              <Button size="small" :disabled="activeLayer.isPrimary" @click="setPrimaryLayer(activeLayer.id)">
                {{ t("panel.layers.setPrimary") }}
              </Button>
              <Button
                size="small"
                danger
                :disabled="!activeLayer.editable"
                @click="deleteLayer(activeLayer.id)"
              >
                {{ t("panel.layers.delete") }}
              </Button>
            </div>
          </div>
        </div>
      </Layout.Content>

      <Layout.Sider :width="rightWidth" theme="light" class="min-h-0 overflow-hidden border-l">
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
          :allow-false-signal-propagation="blueprintGraph.document.allowFalseSignalPropagation"
          :blueprint-library-options="blueprintLibraryOptions"
          :blueprint-node-options="blueprintNodeOptions"
          :all-view-elements="allElements"
          :on-update-blueprint-node="handleUpdateBlueprintNode"
          :on-update-allow-false-signal-propagation="handleUpdateAllowFalseSignalPropagation"
        />
      </Layout.Sider>
    </Layout>

    <input ref="importInputRef" type="file" accept="application/json" class="hidden" @change="async (e) => { const f = (e.target as HTMLInputElement).files?.[0]; (e.target as HTMLInputElement).value = ''; if (f) await handleImportFile(f); }" />
    <input ref="blueprintImportInputRef" type="file" accept="application/json" class="hidden" @change="async (e) => { const f = (e.target as HTMLInputElement).files?.[0]; (e.target as HTMLInputElement).value = ''; if (f) await handleBlueprintImportFile(f); }" />

    <Modal
      v-model:open="isMergingLayers"
      :title="t('panel.layers.mergeDialogTitle')"
      :ok-text="t('panel.layers.mergeOk')"
      @ok="handleMergeLayers"
    >
      <Input v-model:value="mergeLayerName" :placeholder="t('panel.layers.mergedNamePlaceholderOptional')" />
      <div class="mt-2 text-xs text-gray-500">{{ t("panel.layers.mergeSelectedCount", { count: mergeSelectedCount }) }}</div>
    </Modal>
  </Layout>
</template>

<style scoped>
.vue-view-panel :deep(.ant-layout-sider-children) {
  display: flex;
  flex-direction: column;
  min-height: 0;
}
</style>
