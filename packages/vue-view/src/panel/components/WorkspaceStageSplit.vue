<script setup lang="ts">
import { useI18n } from "@arronqzy/i18n/vue";
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from "vue";
import { Button, Select, Space, Tooltip } from "ant-design-vue";
import {
  BluePrintVueRoot,
  type BlueprintGraph,
  type BlueprintExecutionOverlay,
} from "@arronqzy/vue-blueprint";

const { t, locale } = useI18n();

export type BlueprintLibraryListItem = {
  id: string;
  name: string;
  remark?: string;
  source: "saved" | "imported";
  updatedAt: number;
};

export type BlueprintVueRootProps = {
  graph: BlueprintGraph;
  selectedNodeId?: string | null;
  executionOverlay?: BlueprintExecutionOverlay | null;
  libraryNameById?: ReadonlyMap<string, string>;
  onSelectNode?: (nodeId: string | null) => void;
  onAbortClock?: (nodeId: string) => void;
  style?: Record<string, string | number>;
};

export type BlueprintDebugToolbarProps = {
  lifecyclePhase?: string;
  lifecycleOptions?: { value: string; label: string }[];
  onLifecyclePhaseChange?: (phase: string) => void;
};

const MIN_BLUEPRINT_HEIGHT = 48;
const MIN_VIEW_RATIO = 0.1;
const MIN_BLUEPRINT_RATIO = 0.15;

const props = withDefaults(
  defineProps<{
    blueprintOpen: boolean;
    blueprintProps: BlueprintVueRootProps;
    blueprintLibraryItems?: BlueprintLibraryListItem[];
    activeBlueprintLibraryId?: string | null;
    currentBlueprintLabel?: string;
    onSelectBlueprintLibraryItem?: (id: string) => void;
    onRenameBlueprintLibraryItem?: (id: string, name: string) => void;
    onDeleteBlueprintLibraryItem?: (id: string) => void;
    onSaveBlueprint?: () => void;
    onSyncBlueprint?: () => void;
    canSyncBlueprint?: boolean;
    blueprintDebug?: BlueprintDebugToolbarProps;
  }>(),
  {
    blueprintLibraryItems: () => [],
    activeBlueprintLibraryId: null,
    canSyncBlueprint: false,
  }
);

const emit = defineEmits<{
  graphChange: [graph: BlueprintGraph];
}>();

const splitRef = ref<HTMLElement | null>(null);
const blueprintWrapRef = ref<HTMLElement | null>(null);
const layoutReady = ref(false);
const viewRatio = ref(1);
const dragging = ref(false);

const libraryOptions = computed(() =>
  props.blueprintLibraryItems.map((item) => ({
    value: item.id,
    label: item.name,
  }))
);

let resizeObserver: ResizeObserver | null = null;

function checkBlueprintLayout() {
  const el = blueprintWrapRef.value;
  if (!el) {
    layoutReady.value = false;
    return;
  }
  layoutReady.value = el.clientHeight >= MIN_BLUEPRINT_HEIGHT;
}

function applyBlueprintOpenState() {
  if (props.blueprintOpen) {
    viewRatio.value = 0.55;
  } else {
    viewRatio.value = 1;
  }
}

function onPointerDownHandle(event: PointerEvent) {
  if (!props.blueprintOpen) return;
  dragging.value = true;
  (event.target as HTMLElement).setPointerCapture(event.pointerId);
}

function onPointerMove(event: PointerEvent) {
  if (!dragging.value || !splitRef.value) return;
  const rect = splitRef.value.getBoundingClientRect();
  const next = (event.clientY - rect.top) / rect.height;
  viewRatio.value = Math.min(1 - MIN_BLUEPRINT_RATIO, Math.max(MIN_VIEW_RATIO, next));
}

function onPointerUp(event: PointerEvent) {
  if (!dragging.value) return;
  dragging.value = false;
  (event.target as HTMLElement).releasePointerCapture(event.pointerId);
}

function onGraphChange(graph: BlueprintGraph) {
  emit("graphChange", graph);
}

function onSelectNode(nodeId: string | null) {
  props.blueprintProps.onSelectNode?.(nodeId);
}

function onAbortClock(nodeId: string) {
  props.blueprintProps.onAbortClock?.(nodeId);
}

watch(
  () => props.blueprintOpen,
  () => {
    applyBlueprintOpenState();
  },
  { immediate: true }
);

onMounted(() => {
  applyBlueprintOpenState();
  const el = blueprintWrapRef.value;
  if (el) {
    resizeObserver = new ResizeObserver(checkBlueprintLayout);
    resizeObserver.observe(el);
    checkBlueprintLayout();
  }
});

onUnmounted(() => {
  resizeObserver?.disconnect();
});

watch(blueprintWrapRef, (el) => {
  resizeObserver?.disconnect();
  if (!el) return;
  resizeObserver = new ResizeObserver(checkBlueprintLayout);
  resizeObserver.observe(el);
  checkBlueprintLayout();
});
</script>

<template>
  <div
    ref="splitRef"
    class="relative flex min-h-0 flex-1 flex-col"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <div
      class="min-h-0 overflow-hidden"
      :style="{ flex: `${viewRatio} 1 0%` }"
    >
      <slot />
    </div>

    <div
      v-show="blueprintOpen"
      class="group relative z-10 flex h-2 shrink-0 cursor-row-resize items-center justify-center border-y border-border bg-muted/30"
      @pointerdown="onPointerDownHandle"
    >
      <div
        class="h-1 w-10 rounded-full bg-border transition-colors group-hover:bg-primary/50"
      />
    </div>

    <div
      v-show="blueprintOpen"
      class="flex min-h-0 flex-col overflow-hidden bg-background"
      :style="{ flex: `${1 - viewRatio} 1 0%` }"
    >
      <div
        class="flex shrink-0 flex-wrap items-center gap-2 border-b border-border bg-background/90 px-2 py-1"
      >
        <Space size="small" wrap>
          <Select
            size="small"
            class="min-w-[140px]"
            :value="activeBlueprintLibraryId ?? undefined"
            :options="libraryOptions"
            :placeholder="t('panel.workspace.blueprintLibrary')"
            @change="(id) => id && onSelectBlueprintLibraryItem?.(String(id))"
          />
          <span
            v-if="currentBlueprintLabel"
            class="max-w-[160px] truncate text-[11px] text-muted-foreground"
          >
            {{ currentBlueprintLabel }}
          </span>
          <Tooltip :title="t('panel.workspace.saveBlueprintToLibrary')">
            <Button size="small" @click="onSaveBlueprint?.()">{{ t("common.save") }}</Button>
          </Tooltip>
          <Tooltip :title="canSyncBlueprint ? t('panel.workspace.syncBlueprint') : t('panel.workspace.noSyncChanges')">
            <Button
              size="small"
              type="primary"
              :disabled="!canSyncBlueprint"
              @click="onSyncBlueprint?.()"
            >
              {{ t("common.sync") }}
            </Button>
          </Tooltip>
          <Select
            v-if="blueprintDebug?.lifecycleOptions?.length"
            size="small"
            class="min-w-[120px]"
            :value="blueprintDebug.lifecyclePhase"
            :options="blueprintDebug.lifecycleOptions"
            :placeholder="t('panel.workspace.lifecycle')"
            @change="(v) => v && blueprintDebug?.onLifecyclePhaseChange?.(String(v))"
          />
        </Space>
      </div>
      <div
        ref="blueprintWrapRef"
        data-workspace-region="blueprint"
        class="relative min-h-0 flex-1"
      >
        <BluePrintVueRoot
          v-if="layoutReady"
          v-bind="blueprintProps"
          :style="{ width: '100%', height: '100%' }"
          @graph-change="onGraphChange"
          @select-node="onSelectNode"
          @abort-clock="onAbortClock"
        />
        <div
          v-else
          class="flex h-full items-center justify-center text-[11px] text-muted-foreground"
        >
          {{ blueprintOpen ? t("panel.workspace.canvasLoading") : "" }}
        </div>
      </div>
    </div>
  </div>
</template>
