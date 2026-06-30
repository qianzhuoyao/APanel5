<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { Empty, Input } from "ant-design-vue";
import type { PanelElement, PanelLayer, ReferenceCopyMode } from "../types";
import { CHART_TYPES } from "../utils/chartOptionBuilder";
import { PANEL_MESSAGES } from "../constants/messages";
import { hasViewElementScope } from "../scope/view-scope-store";
import { collectElementScopeWarnings } from "../utils/scope-template-warnings";
import { sectionMatchesSearch } from "./config/shared";
import ScopeConfigProvider from "./scope-config/ScopeConfigProvider.vue";
import ScopeTemplateWarningsPanel from "./scope-config/ScopeTemplateWarningsPanel.vue";
import ViewElementScopePanel from "./ViewElementScopePanel.vue";
import PanelConfigMultiSelect from "./config/PanelConfigMultiSelect.vue";
import PanelConfigNodeInfo from "./config/PanelConfigNodeInfo.vue";
import PanelConfigStyleSections from "./config/PanelConfigStyleSections.vue";
import PanelConfigImageSection from "./config/PanelConfigImageSection.vue";
import PanelConfigChartSection from "./config/PanelConfigChartSection.vue";
import PanelConfigTextSection from "./config/PanelConfigTextSection.vue";
import PanelConfigAudioSection from "./config/PanelConfigAudioSection.vue";
import PanelConfigVideoSection from "./config/PanelConfigVideoSection.vue";
import PanelConfigGeometrySection from "./config/PanelConfigGeometrySection.vue";
import PanelConfigGridSection from "./config/PanelConfigGridSection.vue";
import PanelConfigGridChildSpan from "./config/PanelConfigGridChildSpan.vue";
import PanelConfigReferenceSection from "./config/PanelConfigReferenceSection.vue";

const SEARCH_COLLAPSE_STORAGE_KEY = "panel:config-search-collapsed";

const props = withDefaults(
  defineProps<{
    selectedElement: PanelElement | null;
    selectedElements?: PanelElement[];
    layers: PanelLayer[];
    updateElement: (
      id: string,
      patch: Partial<PanelElement>,
      options?: { batchId?: string; meta?: Record<string, unknown> }
    ) => void;
    setReferenceCopyMode?: (id: string, mode: ReferenceCopyMode) => void;
    nodeZOrderLabel?: string;
    onExcludeSelectedNode?: (nodeId: string) => void;
    onAdjustNodeZOrder?: (
      nodeId: string,
      action: "bringForward" | "sendBackward" | "bringToFront" | "sendToBack"
    ) => void;
    viewElementScope?: unknown;
  }>(),
  {
    selectedElements: () => [],
  }
);

const configSearch = ref("");
const isSearchCollapsed = ref(false);
const sidebarScrollRef = ref<HTMLElement | null>(null);

const expandedSections = ref<Record<string, boolean>>({
  nodeInfo: true,
  styleBackground: true,
  styleBorder: true,
  chartBasic: true,
  chartAdvanced: false,
  textConfig: true,
  audioConfig: true,
  videoConfig: true,
  geometryConfig: true,
  gridConfig: true,
  gridChildSpan: true,
  reference: true,
  imageConfig: true,
});

const normalizedSearch = computed(() => configSearch.value.trim().toLowerCase());
const hasSearch = computed(() => normalizedSearch.value.length > 0);

const effectiveSelectedElements = computed(() => {
  if (props.selectedElements.length > 0) return props.selectedElements;
  return props.selectedElement ? [props.selectedElement] : [];
});

const isMultiSelectMode = computed(() => effectiveSelectedElements.value.length > 1);

const selectedLayer = computed(() => {
  if (!props.selectedElement) return null;
  return props.layers.find((l) => l.id === props.selectedElement?.layerId) ?? null;
});

const canToggleNodeLock = computed(
  () => Boolean(props.selectedElement) && !selectedLayer.value?.locked
);

const isNodeEditable = computed(
  () =>
    Boolean(props.selectedElement) &&
    !props.selectedElement?.locked &&
    !selectedLayer.value?.locked
);

const isChartElement = computed(
  () =>
    Boolean(props.selectedElement) &&
    CHART_TYPES.has(props.selectedElement?.materialType ?? "")
);

const showScopePanel = computed(
  () =>
    Boolean(props.selectedElement) &&
    props.viewElementScope !== undefined &&
    hasViewElementScope(props.selectedElement!.id)
);

const scopeWarnings = computed(() => {
  if (!props.selectedElement || props.viewElementScope === undefined) return [];
  return collectElementScopeWarnings(props.selectedElement, props.viewElementScope);
});

const materialType = computed(() => props.selectedElement?.materialType ?? "");

const forceOpenSections = computed(() => hasSearch.value);

function isSectionExpanded(key: string, defaultValue = true) {
  return expandedSections.value[key] ?? defaultValue;
}

function setSectionExpanded(key: string, next: boolean) {
  expandedSections.value = { ...expandedSections.value, [key]: next };
}

function shouldShowSection(key: string, title: string, searchTerms: string[] = []) {
  return sectionMatchesSearch(title, searchTerms, normalizedSearch.value, hasSearch.value);
}

const visibleSectionCount = computed(() => {
  if (!props.selectedElement || isMultiSelectMode.value) return 0;
  let count = 0;
  const checks: Array<[string, string, string[]]> = [
    ["nodeInfo", "节点信息", ["名称", "id", "类型"]],
    ["styleBackground", "通用样式 / 背景", ["背景"]],
    ["styleBorder", "通用样式 / 边框", ["边框"]],
  ];
  if (isChartElement.value) {
    checks.push(["chartBasic", "图表配置 / 基础", ["图表"]]);
    checks.push(["chartAdvanced", "图表配置 / 高级", ["json", "高级"]]);
  }
  if (materialType.value === "text") checks.push(["textConfig", "文本配置", ["文本"]]);
  if (materialType.value === "audio") checks.push(["audioConfig", "音频配置", ["音频"]]);
  if (materialType.value === "video") checks.push(["videoConfig", "视频配置", ["视频"]]);
  if (materialType.value === "image") checks.push(["imageConfig", "图片配置", ["图片"]]);
  if (materialType.value === "geometry") checks.push(["geometryConfig", "几何配置", ["几何"]]);
  if (materialType.value === "grid") checks.push(["gridConfig", "网格布局配置", ["网格"]]);
  if (props.selectedElement?.parentGridId) {
    checks.push(["gridChildSpan", "网格子节点占位", ["跨列"]]);
  }
  if (materialType.value === "reference") checks.push(["reference", "引用组件配置", ["引用"]]);
  for (const [, title, terms] of checks) {
    if (shouldShowSection("", title, terms)) count += 1;
  }
  return count;
});

onMounted(() => {
  const saved = window.localStorage.getItem(SEARCH_COLLAPSE_STORAGE_KEY);
  if (saved === "1") isSearchCollapsed.value = true;
});

watch(isSearchCollapsed, (next) => {
  window.localStorage.setItem(SEARCH_COLLAPSE_STORAGE_KEY, next ? "1" : "0");
});

watch(
  () => [props.selectedElement?.id, props.selectedElement?.materialType],
  () => {
    if (isChartElement.value) {
      setSectionExpanded("chartBasic", true);
    }
  }
);
</script>

<template>
  <ScopeConfigProvider
    :scope="showScopePanel ? viewElementScope : undefined"
    :element="selectedElement"
    :warnings="scopeWarnings"
    :scroll-container-ref="sidebarScrollRef"
  >
    <aside
      ref="sidebarScrollRef"
      class="scope-config-sidebar h-full overflow-auto border-l border-gray-200 bg-gray-50/30 px-3 py-3 text-gray-900 [&_.scope-field--highlight]:rounded-md [&_.scope-field--highlight]:ring-2 [&_.scope-field--highlight]:ring-amber-400/80"
    >
      <div class="sticky top-0 z-20 mb-3 rounded-lg border border-gray-200/80 bg-white px-2.5 py-2 shadow-sm">
        <div class="text-xs font-semibold tracking-wide">配置面板</div>
        <ViewElementScopePanel v-if="showScopePanel" :scope="viewElementScope!" />
        <ScopeTemplateWarningsPanel />
        <div
          :class="showScopePanel || scopeWarnings.length > 0 ? 'mt-2 border-t border-gray-200/50 pt-2' : 'mt-2'"
        >
          <div class="flex items-center justify-end gap-2">
            <button
              type="button"
              class="rounded border border-gray-200 px-1.5 py-0.5 text-[11px] text-gray-500 hover:bg-gray-50"
              @click="isSearchCollapsed = !isSearchCollapsed"
            >
              {{ isSearchCollapsed ? "展开搜索" : "收起搜索" }}
            </button>
          </div>
          <div v-if="!isSearchCollapsed" class="mt-2">
            <Input
              v-model:value="configSearch"
              size="small"
              placeholder="搜索配置，如：边框、tooltip、音频、网格..."
              data-scope-autocomplete="off"
            />
            <div v-if="hasSearch" class="mt-1 text-[11px] text-gray-500">
              搜索中：{{ configSearch }}
            </div>
          </div>
        </div>
      </div>

      <PanelConfigMultiSelect
        v-if="isMultiSelectMode"
        :elements="effectiveSelectedElements"
        :layers="layers"
        :normalized-search="normalizedSearch"
        :has-search="hasSearch"
        :update-element="updateElement"
        :set-reference-copy-mode="setReferenceCopyMode"
        :on-exclude-selected-node="onExcludeSelectedNode"
        :on-adjust-node-z-order="onAdjustNodeZOrder"
      />

      <Empty
        v-else-if="!selectedElement"
        class="py-7"
        description="请先在画布中选中一个节点，再到这里进行配置。"
      />

      <div v-else class="space-y-3">
        <fieldset :disabled="!isNodeEditable" :class="!isNodeEditable ? 'opacity-60' : ''">
          <div class="space-y-3.5 text-xs">
            <PanelConfigNodeInfo
              v-if="shouldShowSection('nodeInfo', '节点信息', ['名称', 'id', '类型', '锁定'])"
              :element="selectedElement"
              :layers="layers"
              :is-editable="isNodeEditable"
              :can-toggle-node-lock="canToggleNodeLock"
              :node-z-order-label="nodeZOrderLabel"
              :on-adjust-node-z-order="onAdjustNodeZOrder"
              :update-element="updateElement"
              :open="isSectionExpanded('nodeInfo')"
              :force-open="forceOpenSections"
              @update:open="(v) => setSectionExpanded('nodeInfo', v)"
            />

            <PanelConfigStyleSections
              v-if="
                shouldShowSection('styleBackground', '通用样式 / 背景', ['背景', 'background']) ||
                shouldShowSection('styleBorder', '通用样式 / 边框', ['边框', 'border'])
              "
              :element="selectedElement"
              :is-editable="isNodeEditable"
              :show-background="shouldShowSection('styleBackground', '通用样式 / 背景', ['背景', 'background'])"
              :show-border="shouldShowSection('styleBorder', '通用样式 / 边框', ['边框', 'border'])"
              :background-open="isSectionExpanded('styleBackground')"
              :border-open="isSectionExpanded('styleBorder')"
              :force-open="forceOpenSections"
              :update-element="updateElement"
              @update:background-open="(v) => setSectionExpanded('styleBackground', v)"
              @update:border-open="(v) => setSectionExpanded('styleBorder', v)"
            />

            <PanelConfigChartSection
              v-if="isChartElement && shouldShowSection('chartBasic', '图表配置 / 基础', ['图表', 'tooltip'])"
              :element="selectedElement"
              :is-editable="isNodeEditable"
              :basic-open="isSectionExpanded('chartBasic')"
              :advanced-open="isSectionExpanded('chartAdvanced', false)"
              :force-open="forceOpenSections"
              :update-element="updateElement"
              @update:basic-open="(v) => setSectionExpanded('chartBasic', v)"
              @update:advanced-open="(v) => setSectionExpanded('chartAdvanced', v)"
            />

            <PanelConfigTextSection
              v-if="materialType === 'text' && shouldShowSection('textConfig', '文本配置', ['文本', '字体', '颜色'])"
              :element="selectedElement"
              :is-editable="isNodeEditable"
              :open="isSectionExpanded('textConfig')"
              :force-open="forceOpenSections"
              :update-element="updateElement"
              @update:open="(v) => setSectionExpanded('textConfig', v)"
            />

            <PanelConfigAudioSection
              v-if="materialType === 'audio' && shouldShowSection('audioConfig', '音频配置', ['音频', 'url', '录音'])"
              :element="selectedElement"
              :is-editable="isNodeEditable"
              :open="isSectionExpanded('audioConfig')"
              :force-open="forceOpenSections"
              :update-element="updateElement"
              @update:open="(v) => setSectionExpanded('audioConfig', v)"
            />

            <PanelConfigVideoSection
              v-if="materialType === 'video' && shouldShowSection('videoConfig', '视频配置', ['视频', 'url'])"
              :element="selectedElement"
              :is-editable="isNodeEditable"
              :open="isSectionExpanded('videoConfig')"
              :force-open="forceOpenSections"
              :update-element="updateElement"
              @update:open="(v) => setSectionExpanded('videoConfig', v)"
            />

            <PanelConfigImageSection
              v-if="materialType === 'image' && shouldShowSection('imageConfig', '图片配置', ['图片', 'src', 'fit'])"
              :element="selectedElement"
              :is-editable="isNodeEditable"
              :open="isSectionExpanded('imageConfig')"
              :force-open="forceOpenSections"
              :update-element="updateElement"
              @update:open="(v) => setSectionExpanded('imageConfig', v)"
            />

            <PanelConfigGeometrySection
              v-if="materialType === 'geometry' && shouldShowSection('geometryConfig', '几何配置', ['几何', '形状'])"
              :element="selectedElement"
              :is-editable="isNodeEditable"
              :open="isSectionExpanded('geometryConfig')"
              :force-open="forceOpenSections"
              :update-element="updateElement"
              @update:open="(v) => setSectionExpanded('geometryConfig', v)"
            />

            <PanelConfigGridSection
              v-if="materialType === 'grid' && shouldShowSection('gridConfig', '网格布局配置', ['网格', '行', '列', '间距'])"
              :element="selectedElement"
              :is-editable="isNodeEditable"
              :open="isSectionExpanded('gridConfig')"
              :force-open="forceOpenSections"
              :update-element="updateElement"
              @update:open="(v) => setSectionExpanded('gridConfig', v)"
            />

            <PanelConfigGridChildSpan
              v-if="selectedElement.parentGridId && shouldShowSection('gridChildSpan', '网格子节点占位', ['跨列', '跨行'])"
              :element="selectedElement"
              :is-editable="isNodeEditable"
              :open="isSectionExpanded('gridChildSpan')"
              :force-open="forceOpenSections"
              :update-element="updateElement"
              @update:open="(v) => setSectionExpanded('gridChildSpan', v)"
            />

            <PanelConfigReferenceSection
              v-if="materialType === 'reference' && shouldShowSection('reference', '引用组件配置', ['引用', '浅拷贝', '深拷贝'])"
              :element="selectedElement"
              :layers="layers"
              :is-editable="isNodeEditable"
              :open="isSectionExpanded('reference')"
              :force-open="forceOpenSections"
              :set-reference-copy-mode="setReferenceCopyMode"
              :update-element="updateElement"
              @update:open="(v) => setSectionExpanded('reference', v)"
            />

            <div
              v-if="!isChartElement && materialType && !['text', 'audio', 'video', 'image', 'geometry', 'grid', 'reference'].includes(materialType)"
              class="text-xs leading-6 text-gray-500"
            >
              当前节点不是图表类型，暂无图表配置项。
            </div>

            <div
              v-if="hasSearch && visibleSectionCount === 0"
              class="rounded border border-gray-200/60 bg-white px-2 py-1.5 text-[11px] text-gray-500"
            >
              未找到匹配项，请尝试更换关键词。
            </div>
          </div>
        </fieldset>

        <div
          v-if="selectedElement.locked"
          class="rounded border border-amber-500/40 bg-amber-500/10 px-2 py-1.5 text-[11px] text-amber-700"
        >
          {{ PANEL_MESSAGES.nodeConfigLocked }}
        </div>
        <div
          v-else-if="selectedLayer?.locked"
          class="rounded border border-amber-500/40 bg-amber-500/10 px-2 py-1.5 text-[11px] text-amber-700"
        >
          {{ PANEL_MESSAGES.nodeConfigLayerLocked }}
        </div>
      </div>
    </aside>
  </ScopeConfigProvider>
</template>
