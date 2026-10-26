<script setup lang="ts">
import { useI18n } from "@arronqzy/i18n/vue";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { Empty, Input, Select, Tabs, Tooltip } from "ant-design-vue";
import type { PanelElement, PanelLayer, ReferenceCopyMode } from "../types";
import { getPanelMessages } from "../constants/messages";
import {
  concreteGridParentIdForLayer,
  logicalGridParentIdFromConcrete,
} from "../utils/mappingLayerOps";
import MaterialPreview from "./MaterialPreview.vue";
import MaterialSidebarTreeNode from "./MaterialSidebarTreeNode.vue";
import {
  getDefaultCategories,
  getNodeDisplayName,
  themedScrollbarClass,
  type MaterialCategoryId,
  type MaterialItem,
} from "./materialSidebarData";

const { t, locale } = useI18n();
const msgs = () => getPanelMessages(t);

export type MaterialSidebarProps = {
  class?: string;
  onDragMaterialStart?: (material: MaterialItem) => void;
  layers?: PanelLayer[];
  allElements?: PanelElement[];
  selectedIds?: string[];
  onSelectNode?: (nodeId: string, layerId: string) => void;
  onNodeContextMenu?: (payload: {
    nodeId: string;
    layerId: string;
    x: number;
    y: number;
  }) => void;
  onDeleteNode?: (nodeId: string) => void;
  onCopyNode?: (nodeId: string, mode?: ReferenceCopyMode) => void;
  onMoveNodeToLayer?: (nodeId: string, targetLayerId: string) => void;
};

const props = withDefaults(defineProps<MaterialSidebarProps>(), {
  layers: () => [],
  allElements: () => [],
  selectedIds: () => [],
});

const leftTab = ref<"materials" | "tree">("materials");
const activeCategoryId = ref<MaterialCategoryId>("charts");
const keyword = ref("");
const referenceOnlyTree = ref(false);
const draggingTreeNodeId = ref<string | null>(null);
const dragOverLayerId = ref<string | null>(null);
const expandedKeys = ref<Record<string, boolean>>({ root: true });
const sidebarRef = ref<HTMLElement | null>(null);
const materialWrap = ref(false);
let sidebarResizeObserver: ResizeObserver | null = null;

onMounted(() => {
  const el = sidebarRef.value;
  if (!el) return;
  const update = () => {
    materialWrap.value = el.getBoundingClientRect().width >= 160;
  };
  update();
  sidebarResizeObserver = new ResizeObserver(update);
  sidebarResizeObserver.observe(el);
});

onBeforeUnmount(() => {
  sidebarResizeObserver?.disconnect();
  sidebarResizeObserver = null;
});

const categories = computed(() => { void locale.value; return getDefaultCategories(t); });
const normalizedKeyword = computed(() => keyword.value.trim().toLowerCase());
const isSearching = computed(
  () => leftTab.value === "materials" && normalizedKeyword.value.length > 0
);
const isTreeSearching = computed(
  () => leftTab.value === "tree" && normalizedKeyword.value.length > 0
);
const normalizedTreeKeyword = computed(() =>
  isTreeSearching.value ? normalizedKeyword.value : ""
);
const searchPlaceholder = computed(() =>
  leftTab.value === "tree"
    ? t("panel.material.treeSearchPlaceholder")
    : t("panel.material.searchPlaceholder")
);

function onLeftTabChange(key: string | number) {
  leftTab.value = key === "tree" ? "tree" : "materials";
  keyword.value = "";
}

const matchedItems = computed(() => {
  if (!isSearching.value) return [];
  const result: Array<MaterialItem & { categoryTitle: string }> = [];
  categories.value.forEach((category) => {
    category.items.forEach((item) => {
      const haystack = `${item.title} ${item.id} ${category.title}`.toLowerCase();
      if (haystack.includes(normalizedKeyword.value)) {
        result.push({ ...item, categoryTitle: category.title });
      }
    });
  });
  return result;
});

const activeCategory = computed(
  () =>
    categories.value.find((c) => c.id === activeCategoryId.value) ?? categories.value[0]
);

const displayItems = computed(() =>
  isSearching.value ? matchedItems.value : (activeCategory.value?.items ?? [])
);

const elementsByLayer = computed(() => {
  const map = new Map<string, PanelElement[]>();
  for (const layer of props.layers) map.set(layer.id, []);
  for (const el of props.allElements) {
    const list = map.get(el.layerId) ?? [];
    list.push(el);
    map.set(el.layerId, list);
  }
  return map;
});

const elementsById = computed(() => {
  const map = new Map<string, PanelElement>();
  for (const el of props.allElements) map.set(el.id, el);
  return map;
});

const layerById = computed(() => {
  const map = new Map<string, PanelLayer>();
  for (const layer of props.layers) map.set(layer.id, layer);
  return map;
});

const effectiveGridParentByElementId = computed(() => {
  const byId = new Map<string, PanelElement>();
  for (const el of props.allElements) byId.set(el.id, el);
  const map = new Map<string, string | undefined>();
  for (const el of props.allElements) {
    const pg = el.parentGridId;
    if (!pg) {
      map.set(el.id, undefined);
      continue;
    }
    const parent = byId.get(pg);
    if (parent?.layerId === el.layerId && parent.materialType === "grid") {
      map.set(el.id, pg);
      continue;
    }
    const logical = logicalGridParentIdFromConcrete(pg, byId);
    if (logical !== undefined) {
      const concrete = concreteGridParentIdForLayer(
        logical,
        el.layerId,
        props.allElements
      );
      map.set(el.id, concrete ?? undefined);
      continue;
    }
    map.set(el.id, undefined);
  }
  return map;
});

const childrenByGridByLayer = computed(() => {
  const outer = new Map<string, Map<string, PanelElement[]>>();
  for (const el of props.allElements) {
    const gridParentId = effectiveGridParentByElementId.value.get(el.id);
    if (!gridParentId) continue;
    let inner = outer.get(el.layerId);
    if (!inner) {
      inner = new Map();
      outer.set(el.layerId, inner);
    }
    const list = inner.get(gridParentId) ?? [];
    list.push(el);
    inner.set(gridParentId, list);
  }
  return outer;
});

function isExpanded(key: string, defaultValue = false) {
  return expandedKeys.value[key] ?? defaultValue;
}

function setExpanded(key: string, next: boolean) {
  expandedKeys.value = { ...expandedKeys.value, [key]: next };
}

function hasRefInSubtree(node: PanelElement, visited: Set<string>): boolean {
  if (node.materialType === "reference" || node.materialType === "viewport") return true;
  if (visited.has(node.id)) return false;
  const nextVisited = new Set(visited);
  nextVisited.add(node.id);
  const children = getTreeChildren(node);
  return children.some((child) => hasRefInSubtree(child, nextVisited));
}

function getTreeChildren(node: PanelElement, sourceOverride?: PanelElement[]) {
  if (node.materialType === "reference" || node.materialType === "viewport") {
    return node.refCopyMode === "deep"
      ? node.refSnapshot ?? sourceOverride ?? []
      : node.refLayerId
        ? elementsByLayer.value.get(node.refLayerId) ?? []
        : [];
  }
  if (node.materialType === "grid") {
    return [...(childrenByGridByLayer.value.get(node.layerId)?.get(node.id) ?? [])];
  }
  return [];
}

function nodeMatchesTreeSearch(node: PanelElement, visited: Set<string>): boolean {
  if (!isTreeSearching.value) return true;
  const selfText = `${getNodeDisplayName(node, t)} ${node.materialType ?? ""} ${node.id}`.toLowerCase();
  if (selfText.includes(normalizedTreeKeyword.value)) return true;
  if (visited.has(node.id)) return false;
  const nextVisited = new Set(visited);
  nextVisited.add(node.id);
  return getTreeChildren(node).some((child) => nodeMatchesTreeSearch(child, nextVisited));
}

function getRootNodes(layerId: string) {
  const layerNodes = elementsByLayer.value.get(layerId) ?? [];
  return layerNodes
    .filter((node) => !effectiveGridParentByElementId.value.get(node.id))
    .filter((node) => !referenceOnlyTree.value || hasRefInSubtree(node, new Set()))
    .filter((node) => nodeMatchesTreeSearch(node, new Set()));
}

function getLayerDropState(layer: PanelLayer) {
  const draggingNode = draggingTreeNodeId.value
    ? elementsById.value.get(draggingTreeNodeId.value) ?? null
    : null;
  const draggingSourceLayer = draggingNode
    ? layerById.value.get(draggingNode.layerId) ?? null
    : null;
  const dropBlockReason = !draggingNode
    ? ""
    : draggingNode.locked
      ? msgs().nodeMoveLocked
      : draggingSourceLayer?.locked
        ? msgs().nodeMoveSourceLayerLocked
        : layer.locked
          ? msgs().nodeMoveTargetLayerLocked
          : draggingNode.layerId === layer.id
            ? msgs().nodeMoveSameLayer
            : "";
  const canDropIntoLayer = Boolean(draggingNode) && !dropBlockReason;
  return { draggingNode, dropBlockReason, canDropIntoLayer };
}

function onMaterialDragStart(e: DragEvent, item: MaterialItem) {
  e.dataTransfer?.setData(
    "application/x-arronqzy-material",
    JSON.stringify({ id: item.id, title: item.title })
  );
  if (e.dataTransfer) e.dataTransfer.effectAllowed = "copy";
  props.onDragMaterialStart?.(item);
}

function onLayerDragOver(e: DragEvent, layer: PanelLayer) {
  const hasNodeData = e.dataTransfer?.types.includes("application/x-arronqzy-tree-node");
  if (!hasNodeData) return;
  const { canDropIntoLayer } = getLayerDropState(layer);
  if (canDropIntoLayer) {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
  } else if (e.dataTransfer) {
    e.dataTransfer.dropEffect = "none";
  }
  if (dragOverLayerId.value !== layer.id) dragOverLayerId.value = layer.id;
}

function onLayerDrop(e: DragEvent, layer: PanelLayer) {
  const payload = e.dataTransfer?.getData("application/x-arronqzy-tree-node");
  if (!payload) return;
  e.preventDefault();
  try {
    const data = JSON.parse(payload) as { nodeId?: string; sourceLayerId?: string };
    const { canDropIntoLayer } = getLayerDropState(layer);
    if (!data.nodeId || !layer.id) return;
    if (!canDropIntoLayer) return;
    if (data.sourceLayerId === layer.id) return;
    props.onMoveNodeToLayer?.(data.nodeId, layer.id);
  } catch {
    // ignore invalid payload
  } finally {
    draggingTreeNodeId.value = null;
    dragOverLayerId.value = null;
  }
}

const treeSearchEmpty = computed(
  () =>
    isTreeSearching.value &&
    props.layers.every((layer) => getRootNodes(layer.id).length === 0)
);
</script>

<template>
  <aside
    ref="sidebarRef"
    :data-material-wrap="materialWrap ? 'true' : 'false'"
    :class="[
      'rv-material-sidebar grid h-full min-h-0 w-full overflow-hidden border-r border-border/60 bg-muted/20 text-foreground',
      props.class ?? '',
    ]"
    style="grid-template-rows: auto 1fr"
  >
    <div class="border-b border-border/50 bg-background/70 px-2 py-1.5 backdrop-blur-sm">
      <Input
        v-model:value="keyword"
        size="small"
        :placeholder="searchPlaceholder"
        :aria-label="searchPlaceholder"
        class="text-[12px]"
      />
    </div>

    <Tabs
      :active-key="leftTab"
      class="flex h-full min-h-0 flex-col overflow-hidden"
      size="small"
      @update:active-key="onLeftTabChange"
    >
      <Tabs.TabPane key="materials" :tab="t('panel.material.tabMaterials')" class="min-h-0 flex-1">
        <div class="flex h-full min-h-0 flex-col overflow-hidden">
          <div
            v-if="!isSearching"
            class="shrink-0 border-b border-border/40 bg-background/80 px-2 py-1.5"
          >
            <Select
              v-model:value="activeCategoryId"
              size="small"
              class="w-full text-[12px] font-semibold"
              :aria-label="activeCategory?.title"
            >
              <Select.Option
                v-for="category in categories"
                :key="category.id"
                :value="category.id"
              >
                <span class="inline-flex w-full min-w-0 items-center justify-between gap-2">
                  <span class="truncate font-medium">{{ category.title }}</span>
                  <span class="tabular-nums text-[11px] font-normal text-muted-foreground">
                    {{ category.items.length }}
                  </span>
                </span>
              </Select.Option>
            </Select>
          </div>
          <div :class="`min-h-0 flex-1 overflow-auto ${themedScrollbarClass}`">
            <div class="px-2 pb-2.5 pt-1.5">
              <div class="mb-1.5 flex items-baseline justify-between gap-2 px-0.5">
                <div class="truncate text-[12px] font-semibold text-foreground/90">
                  <template v-if="isSearching">
                    {{ t("panel.material.searchResults", { count: matchedItems.length }) }}
                  </template>
                  <template v-else>{{ activeCategory?.title }}</template>
                </div>
                <div
                  v-if="!isSearching"
                  class="tabular-nums text-[11px] text-muted-foreground"
                >
                  {{ activeCategory?.items.length ?? 0 }}
                </div>
              </div>
              <div class="rv-material-grid">
                <button
                  v-for="it in displayItems"
                  :key="isSearching ? `${it.id}-${(it as any).categoryTitle}` : it.id"
                  type="button"
                  draggable="true"
                  class="rv-material-card cursor-pointer rounded-lg border border-border/50 bg-card px-1.5 py-1.5 text-left text-card-foreground shadow-[0_1px_1px_hsl(var(--foreground)/0.03)] transition-colors hover:border-border hover:bg-accent/40"
                  @dragstart="onMaterialDragStart($event, it)"
                >
                  <div class="flex flex-col gap-1">
                    <MaterialPreview :id="it.id" />
                    <div class="min-w-0 px-0.5">
                      <div class="truncate text-center text-[11px] font-normal text-muted-foreground">
                        {{ it.title }}
                      </div>
                      <div
                        v-if="isSearching"
                        class="mt-0.5 truncate text-center text-[10px] text-muted-foreground"
                      >
                        {{ (it as any).categoryTitle }}
                      </div>
                    </div>
                  </div>
                </button>
                <Empty
                  v-if="isSearching && matchedItems.length === 0"
                  class="py-5"
                  :description="t('panel.material.emptyMaterialsTitle')"
                >
                  <template #description>
                    <span class="text-[12px] font-medium">{{ t("panel.material.emptyMaterialsTitle") }}</span>
                    <div class="text-[11px] text-muted-foreground">
                      {{ t("panel.material.emptyMaterialsDesc") }}
                    </div>
                  </template>
                </Empty>
                <div
                  v-else-if="!isSearching && (activeCategory?.items.length ?? 0) === 0"
                  class="px-1 py-3 text-[11px] text-muted-foreground"
                >
                  {{ t("panel.material.emptyMaterialsTitle") }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Tabs.TabPane>

      <Tabs.TabPane key="tree" :tab="t('panel.material.tabTree')" class="min-h-0 flex-1">
        <div :class="`h-full overflow-auto px-1.5 py-1.5 text-xs ${themedScrollbarClass}`">
          <div class="flex items-center gap-0.5 rounded-sm px-0.5 py-0.5 font-medium hover:bg-accent/40">
            <button
              type="button"
              class="flex h-5 w-4 shrink-0 items-center justify-center rounded text-[11px] text-muted-foreground hover:bg-accent"
              @click="setExpanded('root', !isExpanded('root', true))"
            >
              {{ isExpanded("root", true) ? "▾" : "▸" }}
            </button>
            <span class="min-w-0 flex-1 truncate text-[12px]">root</span>
            <Tooltip :title="t('panel.material.referenceOnlyTree')">
              <button
                type="button"
                class="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors"
                :class="
                  referenceOnlyTree
                    ? 'border-primary/50 bg-primary/15 text-primary'
                    : 'border-border/70 bg-background/80 text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                "
                :aria-label="t('panel.material.referenceOnlyTree')"
                :aria-pressed="referenceOnlyTree"
                @click="referenceOnlyTree = !referenceOnlyTree"
              >
                <svg
                  viewBox="0 0 24 24"
                  class="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  :stroke-width="referenceOnlyTree ? 2.2 : 2"
                >
                  <path
                    d="M4 5h16l-5.5 6.5V18l-5 2.5v-9L4 5Z"
                    :fill="referenceOnlyTree ? 'currentColor' : 'none'"
                    :fill-opacity="referenceOnlyTree ? 0.2 : 0"
                  />
                  <circle cx="16.5" cy="16.5" r="2.2" />
                  <path d="M14.8 15.2 12 12.5" />
                </svg>
              </button>
            </Tooltip>
          </div>

          <div v-show="isExpanded('root', true)" class="ml-[7px] border-l border-border/45 pl-1.5">
            <template v-for="layer in layers" :key="layer.id">
              <div v-if="!(isTreeSearching && getRootNodes(layer.id).length === 0)">
                <div
                  :class="[
                    'flex min-w-0 items-center gap-0.5 rounded-sm py-0.5 pr-0.5 transition-colors',
                    layer.isMapping ? 'text-violet-800 dark:text-violet-200' : 'text-foreground',
                    dragOverLayerId === layer.id
                      ? getLayerDropState(layer).canDropIntoLayer
                        ? 'bg-primary/12 ring-1 ring-inset ring-primary/35'
                        : 'bg-destructive/10 ring-1 ring-inset ring-destructive/35'
                      : 'hover:bg-accent/50',
                  ]"
                  :title="t('panel.material.dragToThisLayer')"
                  @dragover="onLayerDragOver($event, layer)"
                  @dragleave="dragOverLayerId === layer.id && (dragOverLayerId = null)"
                  @drop="onLayerDrop($event, layer)"
                >
                  <button
                    type="button"
                    class="flex h-5 w-4 shrink-0 items-center justify-center rounded text-[11px] text-muted-foreground hover:bg-accent"
                    @click="setExpanded(`layer:${layer.id}`, !isExpanded(`layer:${layer.id}`, true))"
                  >
                    {{ isExpanded(`layer:${layer.id}`, true) ? "▾" : "▸" }}
                  </button>
                  <svg
                    viewBox="0 0 24 24"
                    class="h-3.5 w-3.5 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
                  </svg>
                  <div class="flex min-w-0 flex-1 items-center gap-0.5">
                    <span class="min-w-0 truncate text-[12px] font-medium">
                      {{ layer.name }}
                    </span>
                    <span
                      v-if="layer.isMapping"
                      class="shrink-0 rounded border border-violet-500/60 bg-violet-500/15 px-1 text-[10px] font-medium"
                    >
                      {{ t("panel.material.mappingLayer") }}
                    </span>
                  </div>
                  <span class="ml-auto shrink-0 pl-1 tabular-nums text-[11px] text-muted-foreground">
                    {{ getRootNodes(layer.id).length }}
                  </span>
                </div>

                <div
                  v-show="isExpanded(`layer:${layer.id}`, true)"
                  class="ml-[7px] border-l border-border/45 pl-1.5"
                >
                  <div
                    v-if="getRootNodes(layer.id).length === 0"
                    class="py-1 pl-1 text-[11px] text-muted-foreground"
                  >
                    {{ t("panel.material.emptyLayer") }}
                  </div>
                  <MaterialSidebarTreeNode
                    v-for="node in getRootNodes(layer.id)"
                    :key="node.id"
                    :node="node"
                    :level="0"
                    :path="`${layer.id}/${node.id}`"
                    :visited="new Set()"
                    :selected-ids="selectedIds"
                    :layer-by-id="layerById"
                    :elements-by-layer="elementsByLayer"
                    :children-by-grid-by-layer="childrenByGridByLayer"
                    :expanded-keys="expandedKeys"
                    :normalized-tree-keyword="normalizedTreeKeyword"
                    :is-tree-searching="isTreeSearching"
                    :dragging-tree-node-id="draggingTreeNodeId"
                    @toggle-expanded="setExpanded"
                    @select-node="(id, lid) => onSelectNode?.(id, lid)"
                    @node-context-menu="(p) => onNodeContextMenu?.(p)"
                    @delete-node="(id) => onDeleteNode?.(id)"
                    @copy-node="(id, mode) => onCopyNode?.(id, mode)"
                    @drag-start="(id) => (draggingTreeNodeId = id)"
                    @drag-end="
                      draggingTreeNodeId = null;
                      dragOverLayerId = null;
                    "
                  />
                </div>
              </div>
            </template>

            <Empty v-if="treeSearchEmpty" class="my-2 py-5" :description="t('panel.material.emptyNodesTitle')">
              <template #description>
                <span class="text-xs">{{ t("panel.material.emptyNodesTitle") }}</span>
                <div class="text-[11px] text-muted-foreground">
                  {{ t("panel.material.emptyNodesDesc") }}
                </div>
              </template>
            </Empty>
          </div>
        </div>
      </Tabs.TabPane>
    </Tabs>
  </aside>
</template>

<style scoped>
:deep(.ant-tabs) {
  display: flex;
  min-height: 0;
  height: 100%;
  flex-direction: column;
}
:deep(.ant-tabs-nav) {
  margin: 0;
  padding: 0.5rem 0.5rem 0;
  flex-shrink: 0;
}
:deep(.ant-tabs-content-holder),
:deep(.ant-tabs-content) {
  display: flex;
  min-height: 0;
  height: 100%;
  flex: 1 1 auto;
  flex-direction: column;
  overflow: hidden;
}
/* 勿给未激活 pane 设 display:flex，否则会盖掉 antd 的 display:none 留下大块空白 */
:deep(.ant-tabs-tabpane-active) {
  display: flex !important;
  min-height: 0;
  height: 100%;
  flex: 1 1 auto;
  flex-direction: column;
  overflow: hidden;
}
:deep(.ant-select-selector) {
  white-space: nowrap !important;
}
:deep(.ant-select-selection-item) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap !important;
}
</style>
