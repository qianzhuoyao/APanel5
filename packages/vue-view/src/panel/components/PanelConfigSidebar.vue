<script setup lang="ts">
import { useI18n } from "@arronqzy/i18n/vue";
import { computed, onMounted, provide, ref, watch } from "vue";
import { Empty, Input } from "ant-design-vue";
import type { PanelElement, PanelLayer, ReferenceCopyMode } from "../types";
import { CHART_TYPES } from "../utils/chartOptionBuilder";
import { getPanelMessages } from "../constants/messages";
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
import PanelConfigTableSection from "./table/PanelConfigTableSection.vue";

const { t, locale } = useI18n();
const msgs = () => getPanelMessages(t);
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
    blueprintNodeOptions?: { id: string; label: string }[];
  }>(),
  {
    selectedElements: () => [],
    blueprintNodeOptions: () => [],
  }
);

const configSearch = ref("");
const isSearchCollapsed = ref(false);
const sidebarScrollRef = ref<HTMLElement | null>(null);

const expandedSections = ref<Record<string, boolean>>({
  nodeInfo: true,
  styleBackground: false,
  styleBorder: false,
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
  tableConfig: true,
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
  return collectElementScopeWarnings(props.selectedElement, props.viewElementScope, t);
});

const materialType = computed(() => props.selectedElement?.materialType ?? "");

const forceOpenSections = computed(() => hasSearch.value);
provide("configHasSearch", hasSearch);

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
    ["nodeInfo", t("panel.config.sectionNodeInfo"), [t("panel.config.name"), "id", t("panel.config.type")]],
    ["styleBackground", t("panel.config.sectionStyleBackground"), [t("panel.config.backgroundColor"), "background"]],
    ["styleBorder", t("panel.config.sectionStyleBorder"), [t("panel.config.searchKwBorder")]],
  ];
  if (isChartElement.value) {
    checks.push(["chartBasic", t("panel.config.sectionChartBasic"), [t("panel.material.charts")]]);
    checks.push(["chartAdvanced", t("panel.config.sectionChartAdvanced"), ["json", t("panel.config.searchKwAdvanced")]]);
  }
  if (materialType.value === "text") checks.push(["textConfig", t("panel.config.sectionText"), [t("panel.defaults.text")]]);
  if (materialType.value === "audio") checks.push(["audioConfig", t("panel.config.sectionAudio"), [t("panel.defaults.audio")]]);
  if (materialType.value === "video") checks.push(["videoConfig", t("panel.config.sectionVideo"), [t("panel.defaults.video")]]);
  if (materialType.value === "image") checks.push(["imageConfig", t("panel.config.sectionImage"), [t("panel.defaults.image")]]);
  if (materialType.value === "geometry") checks.push(["geometryConfig", t("panel.config.sectionGeometry"), [t("panel.defaults.geometry")]]);
  if (materialType.value === "grid") checks.push(["gridConfig", t("panel.config.sectionGrid"), [t("panel.config.searchKwGrid")]]);
  if (props.selectedElement?.parentGridId) {
    checks.push(["gridChildSpan", t("panel.config.sectionGridChildSpan"), [t("panel.config.searchKwCrossCol")]]);
  }
  if (materialType.value === "reference") checks.push(["reference", t("panel.config.sectionReference"), [t("panel.material.reference")]]);
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
        <div class="text-xs font-semibold tracking-wide">{{ t("panel.config.panelTitle") }}</div>
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
              {{ isSearchCollapsed ? t("panel.config.expandSearch") : t("panel.config.collapseSearch") }}
            </button>
          </div>
          <div v-if="!isSearchCollapsed" class="mt-2">
            <Input
              v-model:value="configSearch"
              size="small"
              :placeholder="t('panel.config.searchPlaceholder')"
              data-scope-autocomplete="off"
            />
            <div v-if="hasSearch" class="mt-1 text-[11px] text-gray-500">
              {{ t("panel.config.searching", { query: configSearch }) }}
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
        :description="t('panel.config.emptyNoNodeDesc')"
      />

      <div v-else class="space-y-3">
        <fieldset :disabled="!isNodeEditable" :class="!isNodeEditable ? 'opacity-60' : ''">
          <div class="space-y-3.5 text-xs">
            <PanelConfigNodeInfo
              v-if="shouldShowSection('nodeInfo', t('panel.config.sectionNodeInfo'), [t('panel.config.name'), 'id', t('panel.config.type'), t('panel.layers.lockShort')])"
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

            <PanelConfigChartSection
              v-if="isChartElement && shouldShowSection('chartBasic', t('panel.config.sectionChartBasic'), [t('panel.material.charts'), 'tooltip'])"
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
              v-if="materialType === 'text' && shouldShowSection('textConfig', t('panel.config.sectionText'), [t('panel.defaults.text'), t('panel.config.fontFamily'), t('panel.config.color')])"
              :element="selectedElement"
              :is-editable="isNodeEditable"
              :open="isSectionExpanded('textConfig')"
              :force-open="forceOpenSections"
              :update-element="updateElement"
              @update:open="(v) => setSectionExpanded('textConfig', v)"
            />

            <PanelConfigTableSection
              v-if="materialType === 'table' && shouldShowSection('tableConfig', t('panel.config.sectionTable'), [t('panel.material.table'), 'table', t('panel.config.tableSource'), t('panel.config.tableColumns'), t('panel.config.tableRowsText')])"
              :element="selectedElement"
              :is-editable="isNodeEditable"
              :open="isSectionExpanded('tableConfig')"
              :force-open="forceOpenSections"
              :update-element="updateElement"
              :blueprint-node-options="blueprintNodeOptions"
              @update:open="(v) => setSectionExpanded('tableConfig', v)"
            />

            <PanelConfigAudioSection
              v-if="materialType === 'audio' && shouldShowSection('audioConfig', t('panel.config.sectionAudio'), [t('panel.defaults.audio'), 'url', t('panel.config.searchKwRecord')])"
              :element="selectedElement"
              :is-editable="isNodeEditable"
              :open="isSectionExpanded('audioConfig')"
              :force-open="forceOpenSections"
              :update-element="updateElement"
              @update:open="(v) => setSectionExpanded('audioConfig', v)"
            />

            <PanelConfigVideoSection
              v-if="materialType === 'video' && shouldShowSection('videoConfig', t('panel.config.sectionVideo'), [t('panel.defaults.video'), 'url'])"
              :element="selectedElement"
              :is-editable="isNodeEditable"
              :open="isSectionExpanded('videoConfig')"
              :force-open="forceOpenSections"
              :update-element="updateElement"
              @update:open="(v) => setSectionExpanded('videoConfig', v)"
            />

            <PanelConfigImageSection
              v-if="materialType === 'image' && shouldShowSection('imageConfig', t('panel.config.sectionImage'), [t('panel.defaults.image'), 'src', 'fit'])"
              :element="selectedElement"
              :is-editable="isNodeEditable"
              :open="isSectionExpanded('imageConfig')"
              :force-open="forceOpenSections"
              :update-element="updateElement"
              @update:open="(v) => setSectionExpanded('imageConfig', v)"
            />

            <PanelConfigGeometrySection
              v-if="materialType === 'geometry' && shouldShowSection('geometryConfig', t('panel.config.sectionGeometry'), [t('panel.defaults.geometry'), t('panel.config.shape')])"
              :element="selectedElement"
              :is-editable="isNodeEditable"
              :open="isSectionExpanded('geometryConfig')"
              :force-open="forceOpenSections"
              :update-element="updateElement"
              @update:open="(v) => setSectionExpanded('geometryConfig', v)"
            />

            <PanelConfigGridSection
              v-if="materialType === 'grid' && shouldShowSection('gridConfig', t('panel.config.sectionGrid'), [t('panel.config.searchKwGrid'), t('panel.config.rowsShort'), t('panel.config.colsShort'), t('panel.config.searchKwGap')])"
              :element="selectedElement"
              :is-editable="isNodeEditable"
              :open="isSectionExpanded('gridConfig')"
              :force-open="forceOpenSections"
              :update-element="updateElement"
              @update:open="(v) => setSectionExpanded('gridConfig', v)"
            />

            <PanelConfigGridChildSpan
              v-if="selectedElement.parentGridId && shouldShowSection('gridChildSpan', t('panel.config.sectionGridChildSpan'), [t('panel.config.searchKwCrossCol'), t('panel.config.searchKwCrossRow')])"
              :element="selectedElement"
              :is-editable="isNodeEditable"
              :open="isSectionExpanded('gridChildSpan')"
              :force-open="forceOpenSections"
              :update-element="updateElement"
              @update:open="(v) => setSectionExpanded('gridChildSpan', v)"
            />

            <PanelConfigReferenceSection
              v-if="materialType === 'reference' && shouldShowSection('reference', t('panel.config.sectionReference'), [t('panel.material.reference'), t('panel.material.shallowCopy'), t('panel.material.deepCopy')])"
              :element="selectedElement"
              :layers="layers"
              :is-editable="isNodeEditable"
              :open="isSectionExpanded('reference')"
              :force-open="forceOpenSections"
              :set-reference-copy-mode="setReferenceCopyMode"
              :update-element="updateElement"
              @update:open="(v) => setSectionExpanded('reference', v)"
            />

            <PanelConfigStyleSections
              v-if="
                shouldShowSection('styleBackground', t('panel.config.sectionStyleBackground'), [t('panel.config.backgroundColor'), 'background']) ||
                shouldShowSection('styleBorder', t('panel.config.sectionStyleBorder'), [t('panel.config.searchKwBorder'), 'border'])
              "
              :element="selectedElement"
              :is-editable="isNodeEditable"
              :show-background="shouldShowSection('styleBackground', t('panel.config.sectionStyleBackground'), [t('panel.config.backgroundColor'), 'background'])"
              :show-border="shouldShowSection('styleBorder', t('panel.config.sectionStyleBorder'), [t('panel.config.searchKwBorder'), 'border'])"
              :background-open="isSectionExpanded('styleBackground')"
              :border-open="isSectionExpanded('styleBorder')"
              :force-open="forceOpenSections"
              :update-element="updateElement"
              @update:background-open="(v) => setSectionExpanded('styleBackground', v)"
              @update:border-open="(v) => setSectionExpanded('styleBorder', v)"
            />

            <div
              v-if="!isChartElement && materialType && !['text', 'table', 'audio', 'video', 'image', 'geometry', 'grid', 'reference'].includes(materialType)"
              class="text-xs leading-6 text-gray-500"
            >
              {{ t("panel.config.notChartType") }}
            </div>

            <div
              v-if="hasSearch && visibleSectionCount === 0"
              class="rounded border border-gray-200/60 bg-white px-2 py-1.5 text-[11px] text-gray-500"
            >
              {{ t("panel.config.noMatch") }}
            </div>
          </div>
        </fieldset>

        <div
          v-if="selectedElement.locked"
          class="rounded border border-amber-500/40 bg-amber-500/10 px-2 py-1.5 text-[11px] text-amber-700"
        >
          {{ msgs().nodeConfigLocked }}
        </div>
        <div
          v-else-if="selectedLayer?.locked"
          class="rounded border border-amber-500/40 bg-amber-500/10 px-2 py-1.5 text-[11px] text-amber-700"
        >
          {{ msgs().nodeConfigLayerLocked }}
        </div>
      </div>
    </aside>
  </ScopeConfigProvider>
</template>
