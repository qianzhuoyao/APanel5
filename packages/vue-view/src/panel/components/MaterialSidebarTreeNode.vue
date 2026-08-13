<script setup lang="ts">
import { useI18n } from "@arronqzy/i18n/vue";
import { computed } from "vue";
import { Card, Tooltip } from "ant-design-vue";
import type { PanelElement, PanelLayer, ReferenceCopyMode } from "../types";
import {
  compareGridTreeChildOrder,
  getNodeDisplayName,
} from "./materialSidebarData";

const { t, locale } = useI18n();

const props = defineProps<{
  node: PanelElement;
  level: number;
  path: string;
  visited: Set<string>;
  sourceOverride?: PanelElement[];
  selectedIds: string[];
  layerById: Map<string, PanelLayer>;
  elementsByLayer: Map<string, PanelElement[]>;
  childrenByGridByLayer: Map<string, Map<string, PanelElement[]>>;
  expandedKeys: Record<string, boolean>;
  normalizedTreeKeyword: string;
  isTreeSearching: boolean;
  draggingTreeNodeId: string | null;
}>();

const emit = defineEmits<{
  toggleExpanded: [key: string, open: boolean];
  selectNode: [nodeId: string, layerId: string];
  nodeContextMenu: [payload: { nodeId: string; layerId: string; x: number; y: number }];
  deleteNode: [nodeId: string];
  copyNode: [nodeId: string, mode?: ReferenceCopyMode];
  dragStart: [nodeId: string];
  dragEnd: [];
}>();

const nodeKey = computed(() => `node:${props.path}`);
const selected = computed(() => props.selectedIds.includes(props.node.id));
const isRef = computed(() => props.node.materialType === "reference");
const refMode = computed(() => props.node.refCopyMode ?? "shallow");
const isDeepRef = computed(() => isRef.value && refMode.value === "deep");
const nodeHomeLayer = computed(() => props.layerById.get(props.node.layerId));
const isExpanded = computed(() => props.expandedKeys[nodeKey.value] ?? true);

const children = computed(() => {
  const node = props.node;
  const isGrid = node.materialType === "grid";
  const gridChildren = isGrid
    ? [...(props.childrenByGridByLayer.get(node.layerId)?.get(node.id) ?? [])].sort(
        compareGridTreeChildOrder
      )
    : [];
  if (isRef.value) {
    return refMode.value === "deep"
      ? node.refSnapshot ?? props.sourceOverride ?? []
      : node.refLayerId
        ? props.elementsByLayer.get(node.refLayerId) ?? []
        : [];
  }
  return gridChildren;
});

const hasChildren = computed(() => children.value.length > 0);

const nextVisited = computed(() => {
  const set = new Set(props.visited);
  set.add(props.node.id);
  return set;
});

function nodeMatchesTreeSearch(
  node: PanelElement,
  visited: Set<string>,
  sourceOverride?: PanelElement[]
): boolean {
  if (!props.isTreeSearching) return true;
  const selfText = `${getNodeDisplayName(node)} ${node.materialType ?? ""} ${node.id}`.toLowerCase();
  if (selfText.includes(props.normalizedTreeKeyword)) return true;
  if (visited.has(node.id)) return false;
  const next = new Set(visited);
  next.add(node.id);
  const childList =
    node.materialType === "reference"
      ? node.refCopyMode === "deep"
        ? node.refSnapshot ?? sourceOverride ?? []
        : node.refLayerId
          ? props.elementsByLayer.get(node.refLayerId) ?? []
          : []
      : node.materialType === "grid"
        ? [...(props.childrenByGridByLayer.get(node.layerId)?.get(node.id) ?? [])].sort(
            compareGridTreeChildOrder
          )
        : [];
  return childList.some((child) => nodeMatchesTreeSearch(child, next, node.refSnapshot));
}

const visible = computed(() =>
  nodeMatchesTreeSearch(props.node, props.visited, props.sourceOverride)
);

function onDragStart(e: DragEvent) {
  e.stopPropagation();
  if (props.node.locked) {
    e.preventDefault();
    return;
  }
  emit("dragStart", props.node.id);
  e.dataTransfer?.setData(
    "application/x-arronqzy-tree-node",
    JSON.stringify({ nodeId: props.node.id, sourceLayerId: props.node.layerId })
  );
  if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
}
</script>

<template>
  <template v-if="visible">
    <div
      :class="[
        'mb-1 flex items-center gap-1 rounded py-1',
        selected ? 'bg-primary/15 text-foreground' : 'text-muted-foreground hover:bg-accent/60',
      ]"
      :style="{ paddingLeft: `${6 + level * 14}px`, paddingRight: '6px' }"
    >
      <button
        v-if="hasChildren"
        type="button"
        class="flex h-7 w-7 items-center justify-center rounded text-sm hover:bg-accent"
        @click="emit('toggleExpanded', nodeKey, !isExpanded)"
      >
        {{ isExpanded ? "▾" : "▸" }}
      </button>
      <span v-else class="inline-flex h-7 w-7 items-center justify-center text-sm opacity-40">•</span>

      <button
        type="button"
        class="min-w-0 flex-1 truncate text-left"
        :title="getNodeDisplayName(node)"
        :draggable="!node.locked"
        @click="emit('selectNode', node.id, node.layerId)"
        @contextmenu.prevent.stop="
          emit('nodeContextMenu', {
            nodeId: node.id,
            layerId: node.layerId,
            x: $event.clientX,
            y: $event.clientY,
          })
        "
        @dragstart="onDragStart"
        @dragend="emit('dragEnd')"
      >
        {{ getNodeDisplayName(node, t) }}
      </button>

      <span
        v-if="nodeHomeLayer?.isMapping"
        class="inline-flex shrink-0 items-center rounded-md border-2 border-violet-600 bg-violet-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-violet-950 shadow-sm dark:border-violet-400 dark:bg-violet-500/35 dark:text-violet-50"
        :title="
          nodeHomeLayer.mappingBaseLayerId
            ? t('panel.material.mappingLayerWithBase', {
                name: nodeHomeLayer.name,
                base:
                  layerById.get(nodeHomeLayer.mappingBaseLayerId)?.name ??
                  nodeHomeLayer.mappingBaseLayerId,
              })
            : t('panel.material.mappingLayerTitle', { name: nodeHomeLayer.name })
        "
      >
        {{ t("panel.material.mappingLayerNode") }}
      </span>
      <span
        v-if="node.mappingSourceNodeId"
        class="inline-flex shrink-0 items-center rounded border border-primary/40 bg-primary/10 px-1 text-[10px] text-primary"
        :title="t('panel.material.sameSourceTitle', { id: node.mappingSourceNodeId })"
      >
        {{ t("panel.material.sameSource") }}
      </span>
      <span
        v-if="node.locked"
        class="inline-flex h-5 w-5 items-center justify-center rounded border border-border/80 bg-background/80 text-muted-foreground"
        :title="t('panel.config.nodeLockedTitle')"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" class="h-3.5 w-3.5">
          <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
          <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
          <circle cx="12" cy="15.5" r="1.2" />
        </svg>
      </span>

      <template v-if="isRef">
        <span
          :class="[
            'rounded border px-1 text-[10px]',
            isDeepRef
              ? 'border-violet-500/50 bg-violet-500/15 text-violet-300'
              : 'border-sky-500/40 bg-sky-500/10 text-sky-300',
          ]"
          :title="isDeepRef ? t('panel.material.deepCopyTitle') : t('panel.material.shallowCopyTitle')"
        >
          {{ isDeepRef ? t("panel.material.deepCopy") : t("panel.material.shallowCopy") }}
        </span>
        <Tooltip :title="t('panel.material.shallowCopy')">
          <button
            type="button"
            class="inline-flex h-5 w-5 items-center justify-center rounded border border-border hover:bg-accent"
            :aria-label="t('panel.material.shallowCopy')"
            @click.stop="emit('copyNode', node.id, 'shallow')"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" class="h-3.5 w-3.5">
              <rect x="8.5" y="8.5" width="10" height="10" rx="2" />
              <rect x="5.5" y="5.5" width="10" height="10" rx="2" />
              <path d="M7.5 16.5 16.5 7.5" stroke-dasharray="2 2" />
            </svg>
          </button>
        </Tooltip>
        <Tooltip :title="t('panel.material.deepCopy')">
          <button
            type="button"
            class="inline-flex h-5 w-5 items-center justify-center rounded border border-border hover:bg-accent"
            :aria-label="t('panel.material.deepCopy')"
            @click.stop="emit('copyNode', node.id, 'deep')"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" class="h-3.5 w-3.5">
              <rect x="4.5" y="4.5" width="15" height="4.2" rx="1.6" />
              <rect x="4.5" y="9.9" width="15" height="4.2" rx="1.6" />
              <rect x="4.5" y="15.3" width="15" height="4.2" rx="1.6" />
            </svg>
          </button>
        </Tooltip>
      </template>
      <Tooltip v-else :title="t('panel.material.duplicateNode')">
        <button
          type="button"
          class="inline-flex h-5 w-5 items-center justify-center rounded border border-border hover:bg-accent"
          :aria-label="t('panel.material.duplicateNode')"
          @click.stop="emit('copyNode', node.id)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" class="h-3.5 w-3.5">
            <rect x="9" y="9" width="10" height="10" rx="2" />
            <rect x="5" y="5" width="10" height="10" rx="2" />
          </svg>
        </button>
      </Tooltip>
      <Tooltip :title="node.locked ? t('panel.material.lockedNodeCannotDelete') : t('panel.material.deleteNode')">
        <button
          type="button"
          :disabled="node.locked"
          class="inline-flex h-5 w-5 items-center justify-center rounded border border-border hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
          :aria-label="node.locked ? t('panel.material.lockedNodeCannotDelete') : t('panel.material.deleteNode')"
          @click.stop="!node.locked && emit('deleteNode', node.id)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" class="h-3.5 w-3.5">
            <path d="M4 7h16" />
            <path d="M9 7V5h6v2" />
            <path d="M7 7l1 12h8l1-12" />
            <path d="M10 11v5M14 11v5" />
          </svg>
        </button>
      </Tooltip>
    </div>

    <template v-if="hasChildren && isExpanded">
      <template v-for="child in children" :key="`${path}->${child.id}`">
        <div
          v-if="nextVisited.has(child.id)"
          class="py-1 text-[10px] text-muted-foreground/80"
          :style="{ paddingLeft: `${6 + (level + 1) * 14}px` }"
          :title="t('panel.material.circularRefStopped')"
        >
          {{ getNodeDisplayName(child, t) }}{{ t("panel.material.circularRefSuffix") }}
        </div>
        <MaterialSidebarTreeNode
          v-else
          :node="child"
          :level="level + 1"
          :path="`${path}->${child.id}`"
          :visited="nextVisited"
          :source-override="node.refSnapshot"
          :selected-ids="selectedIds"
          :layer-by-id="layerById"
          :elements-by-layer="elementsByLayer"
          :children-by-grid-by-layer="childrenByGridByLayer"
          :expanded-keys="expandedKeys"
          :normalized-tree-keyword="normalizedTreeKeyword"
          :is-tree-searching="isTreeSearching"
          :dragging-tree-node-id="draggingTreeNodeId"
          @toggle-expanded="(k, o) => emit('toggleExpanded', k, o)"
          @select-node="(...args) => emit('selectNode', ...args)"
          @node-context-menu="(p) => emit('nodeContextMenu', p)"
          @delete-node="(id) => emit('deleteNode', id)"
          @copy-node="(id, mode) => emit('copyNode', id, mode)"
          @drag-start="(id) => emit('dragStart', id)"
          @drag-end="emit('dragEnd')"
        />
      </template>
    </template>
  </template>
</template>

<script lang="ts">
export default {
  name: "MaterialSidebarTreeNode",
};
</script>
