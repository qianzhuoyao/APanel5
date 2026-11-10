<script setup lang="ts">
import { Checkbox, Input, Tabs, Tooltip } from "ant-design-vue";
import { ref } from "vue";
import {
  IconCheck,
  IconChevron,
  IconClose,
  IconEdit,
  IconEyeOff,
  IconLayers,
  IconLock,
  IconMerge,
  IconPlus,
  IconStar,
  IconTrash,
} from "../icons";
import type { PanelLayer } from "../types";

export type PanelLayerDockProps = {
  t: (key: string, params?: Record<string, string | number>) => string;
  isLayerPanelExpanded: boolean;
  setIsLayerPanelExpanded: (value: boolean) => void;
  addLayer: () => void;
  canMergeLayers: boolean;
  setIsMergingLayers: (value: boolean) => void;
  isMergingLayers: boolean;
  layers: PanelLayer[];
  activeLayerId: string;
  setActiveLayer: (layerId: string) => void;
  themedScrollbarClass: string;
  activeLayer: PanelLayer | null;
  editingLayerId: string | null;
  setEditingLayerId: (id: string | null) => void;
  editingLayerName: string;
  setEditingLayerName: (name: string) => void;
  renameLayer: (layerId: string, name: string) => void;
  setPrimaryLayer: (layerId: string) => void;
  toggleLayerLock: (layerId: string) => void;
  getLayerDeleteBlockReason?: (layerId: string) => string | null;
  showActionHint?: (message: string) => void;
  onDeleteLayer: (layerId: string) => void;
  toggleLayerMergeSelected: (layerId: string) => void;
  mergeLayerName: string;
  setMergeLayerName: (name: string) => void;
  mergeSelectedLayers: (name?: string) => void;
};

const props = defineProps<PanelLayerDockProps>();

const iconBtn =
  "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-border/60 bg-background/80 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-40";

const dockVisible = ref(true);

function onActiveKeyChange(key: string | number) {
  props.setActiveLayer(String(key));
}

function toggleExpanded() {
  props.setIsLayerPanelExpanded(!props.isLayerPanelExpanded);
}

function startMerge() {
  if (!props.canMergeLayers) return;
  props.setIsMergingLayers(true);
  props.setIsLayerPanelExpanded(true);
}

function commitRename() {
  if (!props.editingLayerId) return;
  props.renameLayer(props.editingLayerId, props.editingLayerName);
  props.setEditingLayerId(null);
  props.setEditingLayerName("");
}

function cancelRename() {
  props.setEditingLayerId(null);
  props.setEditingLayerName("");
}

function onRenameKeydown(e: KeyboardEvent) {
  if (e.key === "Enter") {
    e.preventDefault();
    commitRename();
    return;
  }
  if (e.key === "Escape") {
    e.preventDefault();
    cancelRename();
  }
}

function handleDelete() {
  const layer = props.activeLayer;
  if (!layer) return;
  if (props.getLayerDeleteBlockReason) {
    const blockReason = props.getLayerDeleteBlockReason(layer.id);
    if (blockReason) {
      props.showActionHint?.(blockReason);
      return;
    }
  }
  props.onDeleteLayer(layer.id);
}

function confirmMerge() {
  if (!props.canMergeLayers) return;
  props.mergeSelectedLayers(props.mergeLayerName || undefined);
  props.setIsMergingLayers(false);
  props.setMergeLayerName("");
}

function cancelMerge() {
  props.setIsMergingLayers(false);
  props.setMergeLayerName("");
}

function deleteAriaLabel(layer: PanelLayer): string {
  if (!layer.editable) return props.t("panel.layers.cannotDeleteDefault");
  if (layer.locked) return props.t("panel.layers.cannotDeleteLocked");
  return props.t("panel.layers.delete");
}
</script>

<template>
  <div
    v-if="!dockVisible"
    class="flex justify-center border-t border-border/50 bg-muted/5 px-2 py-0.5"
  >
    <Tooltip :title="t('panel.layers.title')">
      <button
        type="button"
        :aria-label="t('panel.layers.title')"
        class="inline-flex h-6 items-center gap-1 rounded-md border border-border/60 bg-background/90 px-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        @click="dockVisible = true"
      >
        <IconLayers />
        <span data-typo="caption" class="hidden text-[11px] font-medium sm:inline">
          {{ t("panel.layers.title") }}
        </span>
      </button>
    </Tooltip>
  </div>

  <div v-else class="border-t border-border/50 bg-muted/5 px-2.5 py-1.5">
    <div class="flex min-w-0 items-center gap-1">
      <Tooltip :title="t('panel.layers.title')">
        <span class="inline-flex h-6 w-6 shrink-0 items-center justify-center text-muted-foreground">
          <IconLayers />
        </span>
      </Tooltip>

      <Tooltip
        :title="
          isLayerPanelExpanded ? t('panel.layers.collapseInput') : t('panel.layers.expandInput')
        "
      >
        <button
          type="button"
          :aria-label="
            isLayerPanelExpanded
              ? t('panel.layers.collapseInputAria')
              : t('panel.layers.expandInputAria')
          "
          :class="iconBtn"
          @click="toggleExpanded"
        >
          <IconChevron :expanded="isLayerPanelExpanded" />
        </button>
      </Tooltip>

      <Tooltip :title="t('panel.layers.add')">
        <button
          type="button"
          :aria-label="t('panel.layers.add')"
          :class="iconBtn"
          @click="addLayer"
        >
          <IconPlus />
        </button>
      </Tooltip>

      <Tooltip
        :title="canMergeLayers ? t('panel.layers.merge') : t('panel.layers.mergeNeedTwo')"
      >
        <button
          type="button"
          :aria-label="t('panel.layers.merge')"
          :disabled="!canMergeLayers"
          :class="iconBtn"
          @click="startMerge"
        >
          <IconMerge />
        </button>
      </Tooltip>

      <Tabs
        size="small"
        :active-key="activeLayerId"
        :class="[
          'panel-layer-dock-tabs ml-0.5 h-6 min-w-0 flex-1 overflow-x-auto rounded-md bg-muted/30 p-0.5',
          themedScrollbarClass,
        ]"
        @update:active-key="onActiveKeyChange"
      >
        <Tabs.TabPane v-for="layer in layers" :key="layer.id">
          <template #tab>
            <span
              class="inline-flex h-5 max-w-[120px] min-w-[64px] items-center gap-1 rounded px-0.5 text-[11px] font-medium"
            >
              <span class="truncate">{{ layer.name }}</span>
              <span
                v-if="layer.isPrimary"
                class="text-emerald-500"
                :title="t('panel.layers.primary')"
              >
                <IconStar :filled="true" />
              </span>
              <IconLock v-if="layer.locked" :locked="true" />
            </span>
          </template>
        </Tabs.TabPane>
      </Tabs>

      <div
        v-if="activeLayer"
        class="flex shrink-0 items-center gap-0.5 border-l border-border/50 pl-1"
      >
        <Input
          v-if="editingLayerId === activeLayer.id"
          :value="editingLayerName"
          class="!h-6 w-24 min-w-0 text-[11px]"
          :placeholder="t('panel.layers.namePlaceholder')"
          autofocus
          @update:value="setEditingLayerName"
          @keydown="onRenameKeydown"
        />

        <Tooltip
          :title="
            activeLayer.isPrimary
              ? t('panel.layers.isPrimaryHint')
              : t('panel.layers.setPrimaryHint')
          "
        >
          <button
            type="button"
            :disabled="activeLayer.isPrimary"
            :aria-label="
              activeLayer.isPrimary
                ? t('panel.layers.isPrimary')
                : t('panel.layers.setPrimary')
            "
            :class="[iconBtn, activeLayer.isPrimary ? 'text-emerald-500' : '']"
            @click="setPrimaryLayer(activeLayer.id)"
          >
            <IconStar :filled="Boolean(activeLayer.isPrimary)" />
          </button>
        </Tooltip>

        <Tooltip
          :title="activeLayer.locked ? t('panel.layers.unlock') : t('panel.layers.lock')"
        >
          <button
            type="button"
            :disabled="!activeLayer.editable"
            :aria-label="
              activeLayer.locked ? t('panel.layers.unlock') : t('panel.layers.lock')
            "
            :class="iconBtn"
            @click="toggleLayerLock(activeLayer.id)"
          >
            <IconLock :locked="activeLayer.locked" />
          </button>
        </Tooltip>

        <Tooltip
          :title="
            editingLayerId === activeLayer.id
              ? t('panel.layers.saveName')
              : t('panel.layers.rename')
          "
        >
          <button
            v-if="editingLayerId === activeLayer.id"
            type="button"
            :aria-label="t('panel.layers.saveName')"
            :class="iconBtn"
            @click="commitRename"
          >
            <IconCheck />
          </button>
          <button
            v-else
            type="button"
            :disabled="!activeLayer.editable"
            :aria-label="t('panel.layers.rename')"
            :class="iconBtn"
            @click="
              () => {
                if (!activeLayer) return;
                setEditingLayerId(activeLayer.id);
                setEditingLayerName(activeLayer.name);
              }
            "
          >
            <IconEdit />
          </button>
        </Tooltip>

        <Tooltip
          v-if="editingLayerId === activeLayer.id"
          :title="t('panel.layers.cancelEdit')"
        >
          <button
            type="button"
            :aria-label="t('panel.layers.cancelEditName')"
            :class="iconBtn"
            @click="cancelRename"
          >
            <IconClose />
          </button>
        </Tooltip>

        <Tooltip :title="deleteAriaLabel(activeLayer)">
          <button
            type="button"
            :disabled="!activeLayer.editable || activeLayer.locked"
            :aria-label="deleteAriaLabel(activeLayer)"
            :class="iconBtn"
            @click="handleDelete"
          >
            <IconTrash />
          </button>
        </Tooltip>
      </div>

      <Tooltip :title="t('panel.layers.collapseInput')">
        <button
          type="button"
          :aria-label="t('panel.layers.collapseInputAria')"
          :class="iconBtn"
          @click="dockVisible = false"
        >
          <IconEyeOff />
        </button>
      </Tooltip>
    </div>

    <div v-if="isLayerPanelExpanded" class="mt-1 space-y-1">
      <div class="rounded-md border border-border/50 bg-card/80 px-2 py-1.5">
        <div
          data-typo="caption"
          class="mb-1 text-[11px] font-medium text-muted-foreground"
        >
          {{ t("panel.layers.selectMergeLayers") }}
        </div>
        <div class="flex flex-wrap gap-x-3 gap-y-1">
          <label
            v-for="layer in layers"
            :key="layer.id"
            class="flex min-w-0 items-center gap-1.5 text-[11px]"
          >
            <Checkbox
              :checked="Boolean(layer.mergeSelected)"
              :disabled="layer.isMapping"
              class="!h-3.5 !w-3.5"
              @change="() => toggleLayerMergeSelected(layer.id)"
            />
            <span
              class="max-w-[120px] truncate font-medium text-foreground/90"
              :title="
                layer.isMapping ? t('panel.layers.mappingCannotMerge') : layer.name
              "
            >
              {{ layer.name
              }}{{ layer.isMapping ? t("panel.layers.cannotMergeSuffix") : "" }}
            </span>
          </label>
        </div>
      </div>

      <div
        v-if="isMergingLayers"
        class="flex items-center gap-1.5 rounded-md border border-border/50 bg-card/80 px-2 py-1"
      >
        <span data-typo="caption" class="shrink-0 text-[11px] text-muted-foreground">
          {{ t("panel.layers.mergedName") }}
        </span>
        <Input
          :value="mergeLayerName"
          class="!h-6 min-w-0 flex-1 text-[11px]"
          :placeholder="t('panel.layers.mergedNamePlaceholder')"
          autofocus
          @update:value="setMergeLayerName"
        />
        <Tooltip :title="t('panel.layers.confirmMerge')">
          <button
            type="button"
            :aria-label="t('panel.layers.confirmMergeAria')"
            :disabled="!canMergeLayers"
            :class="iconBtn"
            @click="confirmMerge"
          >
            <IconCheck />
          </button>
        </Tooltip>
        <Tooltip :title="t('panel.layers.cancelMerge')">
          <button
            type="button"
            :aria-label="t('panel.layers.cancelMergeAria')"
            :class="iconBtn"
            @click="cancelMerge"
          >
            <IconClose />
          </button>
        </Tooltip>
      </div>
    </div>
  </div>
</template>

<style scoped>
.panel-layer-dock-tabs :deep(.ant-tabs-nav) {
  margin: 0;
  height: 100%;
}
.panel-layer-dock-tabs :deep(.ant-tabs-nav::before) {
  border-bottom: none;
}
.panel-layer-dock-tabs :deep(.ant-tabs-nav-list) {
  gap: 0.125rem;
}
.panel-layer-dock-tabs :deep(.ant-tabs-tab) {
  margin: 0 !important;
  padding: 0 0.375rem !important;
  border: none !important;
  background: transparent !important;
  line-height: 1.25rem;
}
.panel-layer-dock-tabs :deep(.ant-tabs-tab-active) {
  font-weight: 600;
  background: hsl(var(--background) / 0.9) !important;
  border-radius: 0.25rem;
}
.panel-layer-dock-tabs :deep(.ant-tabs-ink-bar) {
  display: none;
}
.panel-layer-dock-tabs :deep(.ant-tabs-content-holder) {
  display: none;
}
</style>
