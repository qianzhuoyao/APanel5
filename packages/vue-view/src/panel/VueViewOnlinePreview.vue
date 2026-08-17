<script setup lang="ts">
import { useI18n } from "@arronqzy/i18n/vue";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import {
  BlueprintGraph,
  documentToRunnableGraph,
  getBlueprintLibraryRecord,
  listBlueprintLibrary,
  useBlueprintPageLifecycle,
  type BlueprintLibraryListItem,
} from "@arronqzy/vue-blueprint";
import type { LibraryBlueprintResolver, PageLifecyclePhase } from "@arronqzy/blueprint-dsl";
import type { State } from "@arronqzy/rx-store";
import ElementsLayer from "./components/ElementsLayer.vue";
import {
  clearViewElementScopes,
  getViewElementScope,
  setViewElementScopes,
  useViewScopeStoreVersion,
} from "./scope/view-scope-store";
import { resolvePanelElementScope } from "./utils/scope-template";
import { getWorkspaceProject } from "./library/workspace-project-db";
import { readWorkspacePreviewCache } from "./library/workspace-project-cache";
import { subscribeWorkspaceProjectUpdates } from "./library/workspace-project-sync";
import {
  computePanelSceneBounds,
  getActiveLayerId,
  normalizeImportedPanelState,
  notifyPreviewLayoutChanged,
  parseAllPanelElements,
  parsePanelLayers,
  resolvePreviewLayerElements,
} from "./utils/panelStateIO";
import { applyPreviewSceneFill, readOutputScale } from "./utils/outputScale";

const { t, locale } = useI18n();

const PREVIEW_BOOT_PHASES: PageLifecyclePhase[] = ["mounted"];

const props = defineProps<{
  projectId: string;
  previewInstanceId?: string;
}>();

const loadError = ref<string | null>(null);
const panelState = ref<State | null>(null);
const projectRevision = ref(0);
const blueprintGraph = ref(BlueprintGraph.empty());
const blueprintLibraryItems = ref<BlueprintLibraryListItem[]>([]);
const layoutRevision = ref(0);
const layoutReady = ref(false);
const sceneRef = ref<HTMLDivElement | null>(null);
const outputScale = ref(readOutputScale());
const fillScale = ref({ scaleX: 1, scaleY: 1 });

const layers = computed(() => (panelState.value ? parsePanelLayers(panelState.value) : []));
const activeLayerId = computed(() =>
  panelState.value ? getActiveLayerId(panelState.value) : "layer-1"
);
const allElements = computed(() =>
  panelState.value ? parseAllPanelElements(panelState.value) : []
);

async function loadWorkspaceRecord(projectId: string) {
  const fromDb = await getWorkspaceProject(projectId);
  if (fromDb) return fromDb;
  return readWorkspacePreviewCache(projectId);
}

function applyTitleIcon(titleIconDataUrl?: string) {
  if (!titleIconDataUrl) return;
  for (const rel of ["icon", "shortcut icon"]) {
    document.querySelector(`link[rel='${rel}']`)?.remove();
    const link = document.createElement("link");
    link.rel = rel;
    link.type = "image/png";
    link.href = titleIconDataUrl;
    document.head.appendChild(link);
  }
}

async function loadProject() {
  const record = await loadWorkspaceRecord(props.projectId);
  if (!record) {
    loadError.value = t("panel.messages.workspaceNotFound");
    panelState.value = null;
    return;
  }
  const normalized = normalizeImportedPanelState(record.panelState);
  if (!normalized) {
    loadError.value = t("panel.messages.workspaceDataInvalid");
    panelState.value = null;
    return;
  }
  loadError.value = null;
  clearViewElementScopes();
  panelState.value = normalized;
  blueprintGraph.value = BlueprintGraph.fromDocument(record.blueprintDocument);
  document.title = record.productName.trim() || record.name || t("panel.workspace.previewDocTitle");
  applyTitleIcon(record.titleIconDataUrl);
  projectRevision.value += 1;
}

onMounted(() => {
  void loadProject();
});

onMounted(() => {
  const unsub = subscribeWorkspaceProjectUpdates(props.projectId, () => {
    void loadProject();
  });
  onUnmounted(unsub);
});

watch(projectRevision, () => {
  void listBlueprintLibrary().then((items) => {
    blueprintLibraryItems.value = items;
  });
});

const blueprintLibraryNameById = computed(
  () => new Map(blueprintLibraryItems.value.map((item) => [item.id, item.name]))
);

const resolveLibraryBlueprint: LibraryBlueprintResolver = async (libraryBlueprintId) => {
  const record = await getBlueprintLibraryRecord(libraryBlueprintId);
  if (!record) return null;
  const items = await listBlueprintLibrary();
  const nameById = new Map(items.map((item) => [item.id, item.name]));
  return documentToRunnableGraph(record.document, { libraryNameById: nameById });
};

function handleViewScopeUpdate(viewElementIds: string[], scope: unknown) {
  setViewElementScopes(viewElementIds, scope);
}

const layerElements = computed(() =>
  resolvePreviewLayerElements(allElements.value, layers.value, activeLayerId.value)
);

const scopeStoreVersion = useViewScopeStoreVersion();
const scopedLayerElements = computed(() => {
  void scopeStoreVersion.value;
  return layerElements.value.map((el) =>
    resolvePanelElementScope(el, getViewElementScope(el.id))
  );
});

const sceneBounds = computed(() => computePanelSceneBounds(scopedLayerElements.value));

const displayElements = computed(() =>
  scopedLayerElements.value.map((el) => {
    const x = el.x - sceneBounds.value.minX;
    const y = el.y - sceneBounds.value.minY;
    if (outputScale.value) return { ...el, x, y };
    return {
      ...el,
      x: x * fillScale.value.scaleX,
      y: y * fillScale.value.scaleY,
      width: el.width * fillScale.value.scaleX,
      height: el.height * fillScale.value.scaleY,
    };
  })
);

function applySceneFit() {
  const enabled = readOutputScale();
  outputScale.value = enabled;
  const fill = applyPreviewSceneFill(
    sceneRef.value,
    sceneBounds.value.width,
    sceneBounds.value.height,
    enabled
  );
  fillScale.value = { scaleX: fill.scaleX, scaleY: fill.scaleY };
  layoutRevision.value += 1;
  notifyPreviewLayoutChanged();
}

watch(
  [
    panelState,
    () => displayElements.value.length,
    () => layerElements.value.length,
    sceneBounds,
    projectRevision,
  ],
  () => {
    if (!panelState.value || layerElements.value.length === 0) return;
    layoutReady.value = false;
    applySceneFit();
    requestAnimationFrame(() => {
      applySceneFit();
      requestAnimationFrame(() => {
        notifyPreviewLayoutChanged();
        layoutReady.value = true;
      });
    });
  },
  { deep: true }
);

const lifecycleReady = computed(
  () => Boolean(panelState.value && layerElements.value.length > 0 && layoutReady.value)
);

const { triggerBlueprintNode } = useBlueprintPageLifecycle({
  graph: blueprintGraph,
  active: ref(true),
  enabled: lifecycleReady,
  bootPhases: PREVIEW_BOOT_PHASES,
  bootKey: computed(() => projectRevision.value),
  waitForPageReady: true,
  onUpdated: computed(
    () => `${activeLayerId.value}|${layerElements.value.length}|${projectRevision.value}|${layoutRevision.value}`
  ),
  resolveLibraryBlueprint,
  libraryNameById: blueprintLibraryNameById,
  rootLibraryBlueprintId: ref(null),
  onViewScopeUpdate: handleViewScopeUpdate,
});

onMounted(() => {
  const onResize = () => applySceneFit();
  window.addEventListener("resize", onResize);
  onUnmounted(() => window.removeEventListener("resize", onResize));
});

function noopUpdate() {}
function noopSelect() {}
</script>

<template>
  <div
    v-if="loadError"
    class="flex min-h-screen w-full items-center justify-center bg-white px-6 text-center text-sm text-gray-600"
  >
    {{ loadError }}
  </div>

  <div
    v-else-if="!panelState"
    class="flex min-h-screen w-full items-center justify-center bg-white text-sm text-gray-600"
  >
    {{ t("panel.workspace.previewLoading") }}
  </div>

  <div
    v-else-if="layerElements.length === 0"
    class="flex min-h-screen w-full flex-col items-center justify-center gap-2 bg-white px-6 text-center text-sm text-gray-600"
  >
    <div>{{ t("panel.workspace.previewNoNodes") }}</div>
    <div class="text-xs text-gray-400">{{ t("panel.workspace.previewHint") }}</div>
  </div>

  <div
    v-else
    class="min-h-screen w-full overflow-hidden bg-white text-gray-900"
    data-preview-mode="online"
    :data-project-id="projectId"
    :data-preview-instance-id="previewInstanceId ?? ''"
    :data-preview-node-count="String(displayElements.length)"
  >
    <div id="preview-root" class="overflow-hidden" style="width: 100vw; height: 100vh">
      <div
        ref="sceneRef"
        id="preview-scene"
        class="relative shrink-0 origin-top-left"
        :style="{
          width: `${outputScale ? sceneBounds.width : sceneBounds.width * fillScale.scaleX}px`,
          height: `${outputScale ? sceneBounds.height : sceneBounds.height * fillScale.scaleY}px`,
          transformOrigin: 'left top',
          transform: outputScale ? `scale(${fillScale.scaleX}, ${fillScale.scaleY})` : 'none',
        }"
      >
        <ElementsLayer
          :elements="displayElements"
          :all-elements="allElements"
          :selected-ids="[]"
          :update-element="noopUpdate"
          :layer-locked="true"
          :preview-mode="true"
          :preview-layout-key="layoutRevision"
          :on-table-cell-action="
            (payload) => {
              void triggerBlueprintNode(payload.blueprintNodeId, payload);
            }
          "
          @select-ids="noopSelect"
        />
      </div>
    </div>
  </div>
</template>
