<script setup lang="ts">
import { useI18n } from "@arronqzy/i18n/vue";
import { computed, ref } from "vue";
import { Card, Empty, Input, Switch, Tabs } from "ant-design-vue";
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
const treeKeyword = ref("");
const referenceOnlyTree = ref(false);
const draggingTreeNodeId = ref<string | null>(null);
const dragOverLayerId = ref<string | null>(null);
const expandedKeys = ref<Record<string, boolean>>({ root: true });

const categories = computed(() => { void locale.value; return getDefaultCategories(t); });
const normalizedKeyword = computed(() => keyword.value.trim().toLowerCase());
const isSearching = computed(() => normalizedKeyword.value.length > 0);
const normalizedTreeKeyword = computed(() => treeKeyword.value.trim().toLowerCase());
const isTreeSearching = computed(() => normalizedTreeKeyword.value.length > 0);

const activeCategory = computed(
  () => categories.value.find((c) => c.id === activeCategoryId.value) ?? categories.value[0]
);

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
    :class="[
      'grid h-full w-full border-r border-border bg-muted/30 text-foreground',
      props.class ?? '',
    ]"
    style="grid-template-rows: auto 1fr"
  >
    <div class="border-b border-border bg-background/80 px-3 py-2 backdrop-blur-sm">
      <Input
        v-model:value="keyword"
        size="small"
        :placeholder="t('panel.material.searchPlaceholder')"
        class="text-xs"
      />
    </div>

    <Tabs v-model:active-key="leftTab" class="flex min-h-0 h-full flex-col">
      <Tabs.TabPane key="materials" :tab="t('panel.material.tabMaterials')" class="min-h-0 flex-1">
        <div class="grid h-full min-h-0 grid-cols-[110px_1fr]">
          <div :class="`overflow-auto border-r border-border ${themedScrollbarClass}`">
            <button
              v-for="c in categories"
              :key="c.id"
              type="button"
              :class="[
                'w-full cursor-pointer border-b border-border/40 px-2.5 py-2.5 text-left text-xs',
                c.id === activeCategoryId
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent/60 hover:text-accent-foreground',
              ]"
              @click="activeCategoryId = c.id"
            >
              {{ c.title }}
            </button>
          </div>

          <div :class="`overflow-auto ${themedScrollbarClass}`">
            <div class="px-2.5 py-2.5 text-xs font-semibold">
              {{ isSearching ? t("panel.material.searchResults", { count: matchedItems.length }) : activeCategory.title }}
            </div>
            <div class="grid gap-2 px-2.5 pb-3">
              <button
                v-for="it in isSearching ? matchedItems : activeCategory.items"
                :key="isSearching ? `${it.id}-${(it as any).categoryTitle}` : it.id"
                type="button"
                draggable="true"
                class="cursor-pointer rounded-xl border border-border bg-card px-2 py-2 text-left text-xs text-card-foreground hover:bg-accent/60"
                @dragstart="onMaterialDragStart($event, it)"
              >
                <div class="flex flex-col items-stretch gap-2">
                  <MaterialPreview :id="it.id" />
                  <div class="min-w-0">
                    <div class="truncate">{{ it.title }}</div>
                    <div
                      v-if="isSearching"
                      class="mt-1 text-[11px] text-muted-foreground"
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
                  <span class="text-xs">{{ t("panel.material.emptyMaterialsTitle") }}</span>
                  <div class="text-[11px] text-muted-foreground">
                    {{ t("panel.material.emptyMaterialsDesc") }}
                  </div>
                </template>
              </Empty>
            </div>
          </div>
        </div>
      </Tabs.TabPane>

      <Tabs.TabPane key="tree" :tab="t('panel.material.tabTree')" class="min-h-0 flex-1">
        <div :class="`h-full overflow-auto px-2 py-2 text-xs ${themedScrollbarClass}`">
          <div class="mb-2">
            <Input
              v-model:value="treeKeyword"
              size="small"
              :placeholder="t('panel.material.treeSearchPlaceholder')"
              class="text-xs"
            />
          </div>
          <div class="mb-2 flex items-center justify-between rounded border border-border bg-card px-2 py-1.5">
            <span class="text-[11px] text-muted-foreground">{{ t("panel.material.referenceOnlyTree") }}</span>
            <Switch v-model:checked="referenceOnlyTree" size="small" :aria-label="t('panel.material.referenceOnlyTree')" />
          </div>

          <div class="rounded border border-border bg-card">
            <div class="flex items-center gap-1 px-2 py-1.5 font-medium">
              <button
                type="button"
                class="flex h-7 w-7 items-center justify-center rounded text-sm hover:bg-accent"
                @click="setExpanded('root', !isExpanded('root', true))"
              >
                {{ isExpanded("root", true) ? "▾" : "▸" }}
              </button>
              <span>root</span>
            </div>

            <div v-show="isExpanded('root', true)" class="space-y-1 border-t border-border/60 py-1">
              <template v-for="layer in layers" :key="layer.id">
                <div v-if="!(isTreeSearching && getRootNodes(layer.id).length === 0)">
                  <Card
                    :class="[
                      'mb-2 overflow-hidden transition-shadow',
                      layer.isMapping
                        ? 'border-2 border-violet-500/70 bg-gradient-to-br from-violet-500/14 via-violet-600/10 to-fuchsia-500/12'
                        : '',
                      dragOverLayerId === layer.id
                        ? getLayerDropState(layer).canDropIntoLayer
                          ? 'ring-2 ring-primary/45 ring-offset-2 ring-offset-background'
                          : 'ring-2 ring-destructive/45 ring-offset-2 ring-offset-background'
                        : '',
                    ]"
                    size="small"
                    :body-style="{ padding: '10px' }"
                  >
                    <div class="mb-1.5 flex flex-wrap items-center gap-1">
                      <span
                        v-if="dragOverLayerId === layer.id"
                        :class="[
                          'inline-flex h-5 w-5 shrink-0 items-center justify-center rounded text-[11px]',
                          getLayerDropState(layer).canDropIntoLayer
                            ? 'bg-primary/15 text-primary'
                            : 'bg-destructive/15 text-destructive',
                        ]"
                        :title="
                          getLayerDropState(layer).canDropIntoLayer
                            ? t('panel.material.targetLayer')
                            : getLayerDropState(layer).dropBlockReason
                        "
                      >
                        ➜
                      </span>
                      <button
                        type="button"
                        class="flex h-7 w-7 shrink-0 items-center justify-center rounded text-sm text-muted-foreground hover:bg-accent"
                        @click="
                          setExpanded(`layer:${layer.id}`, !isExpanded(`layer:${layer.id}`, true))
                        "
                      >
                        {{
                          isExpanded(`layer:${layer.id}`, true) ? "▾" : "▸"
                        }}
                      </button>
                      <span class="min-w-0 flex-1 truncate text-xs font-medium text-foreground">
                        {{ layer.name }}
                        <span class="font-normal text-muted-foreground">
                          （{{ getRootNodes(layer.id).length }}）
                        </span>
                      </span>
                      <span
                        v-if="layer.isMapping"
                        class="shrink-0 rounded-md border-2 border-violet-600 bg-violet-500/22 px-1.5 py-0.5 text-[10px] font-semibold text-violet-950 dark:border-violet-400 dark:bg-violet-500/35 dark:text-violet-50"
                      >
                        {{ t("panel.material.mappingLayer") }}
                      </span>
                      <span
                        v-if="dragOverLayerId === layer.id"
                        :class="[
                          'ml-auto shrink-0 rounded px-1.5 py-0.5 text-[10px]',
                          getLayerDropState(layer).canDropIntoLayer
                            ? 'bg-primary/15 text-primary'
                            : 'bg-destructive/15 text-destructive',
                        ]"
                      >
                        {{
                          getLayerDropState(layer).canDropIntoLayer
                            ? t("panel.material.willMoveToLayer")
                            : getLayerDropState(layer).dropBlockReason
                        }}
                      </span>
                    </div>

                    <div
                      :class="[
                        'mb-2 rounded-md border border-dashed px-2 py-1.5 text-[10px] transition-colors',
                        dragOverLayerId === layer.id
                          ? getLayerDropState(layer).canDropIntoLayer
                            ? 'border-primary/50 bg-primary/10 text-primary'
                            : 'border-destructive/50 bg-destructive/10 text-destructive'
                          : 'border-border/50 bg-muted/20 text-muted-foreground hover:border-border hover:bg-muted/35',
                      ]"
                      :title="t('panel.material.dragToThisLayer')"
                      @dragover="onLayerDragOver($event, layer)"
                      @dragleave="dragOverLayerId === layer.id && (dragOverLayerId = null)"
                      @drop="onLayerDrop($event, layer)"
                    >
                      {{
                        draggingTreeNodeId
                          ? getLayerDropState(layer).canDropIntoLayer
                            ? t("panel.material.releaseToMove")
                            : getLayerDropState(layer).dropBlockReason || t("panel.material.cannotMoveToLayer")
                          : t("panel.material.dragToLayer")
                      }}
                    </div>

                    <div v-show="isExpanded(`layer:${layer.id}`, true)">
                      <div
                        v-if="getRootNodes(layer.id).length === 0"
                        class="rounded border border-border/40 bg-muted/15 py-2 pl-3 text-[11px] text-muted-foreground"
                      >
                        {{ t("panel.material.emptyLayer") }}
                      </div>
                      <MaterialSidebarTreeNode
                        v-for="node in getRootNodes(layer.id)"
                        :key="node.id"
                        :node="node"
                        :level="2"
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
                  </Card>
                </div>
              </template>

              <Empty v-if="treeSearchEmpty" class="mx-2 my-2 py-5" :description="t('panel.material.emptyNodesTitle')">
                <template #description>
                  <span class="text-xs">{{ t("panel.material.emptyNodesTitle") }}</span>
                  <div class="text-[11px] text-muted-foreground">
                    {{ t("panel.material.emptyNodesDesc") }}
                  </div>
                </template>
              </Empty>
            </div>
          </div>
        </div>
      </Tabs.TabPane>
    </Tabs>
  </aside>
</template>
