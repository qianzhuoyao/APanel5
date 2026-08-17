<script setup lang="ts">
import { useI18n } from "@arronqzy/i18n/vue";
import { computed, ref, watch } from "vue";
import { Checkbox, Collapse, Input, InputNumber, Select, Textarea } from "ant-design-vue";
import type { PanelChartConfig, PanelElement } from "../../types";
import {
  buildChartOption,
  CHART_TYPES,
  getChartLabelsDisplayText,
  getChartValuesDisplayText,
} from "../../utils/chartOptionBuilder";
import { mergeOptionPatch } from "./shared";
import ConfigColorField from "./ConfigColorField.vue";
import ConfigFieldGroup from "./ConfigFieldGroup.vue";
import ConfigHintIcon from "../ConfigHintIcon.vue";
import ConfigSection from "./ConfigSection.vue";

const { t, locale } = useI18n();

type ChartType =
  | "bar"
  | "line"
  | "pie"
  | "area"
  | "scatter"
  | "radar"
  | "gauge"
  | "funnel"
  | "";

const props = defineProps<{
  element: PanelElement;
  isEditable: boolean;
  basicOpen: boolean;
  advancedOpen: boolean;
  forceOpen?: boolean;
  updateElement: (
    id: string,
    patch: Partial<PanelElement>,
    options?: { batchId?: string; meta?: Record<string, unknown> }
  ) => void;
}>();

const emit = defineEmits<{
  "update:basicOpen": [value: boolean];
  "update:advancedOpen": [value: boolean];
}>();

const isAdvancedOptionMode = ref(false);
const optionJsonText = ref("{}");
const optionJsonError = ref<string | null>(null);

const selectedChartType = computed(
  () => (props.element.materialType ?? "") as ChartType
);

const chartOption = computed(
  () => (props.element.chart?.option ?? {}) as Record<string, any>
);

watch(
  () => props.element.id,
  () => {
    if (CHART_TYPES.has(props.element.materialType ?? "")) {
      optionJsonText.value = JSON.stringify(buildChartOption(props.element), null, 2);
    } else {
      optionJsonText.value = "{}";
    }
    optionJsonError.value = null;
  },
  { immediate: true }
);

function updateChart(patch: Partial<PanelChartConfig>) {
  props.updateElement(props.element.id, {
    chart: { ...(props.element.chart ?? {}), ...patch },
  });
}

function updateOptionForm(patch: Record<string, unknown>) {
  updateChart({
    option: mergeOptionPatch(chartOption.value, patch),
  });
}

function gradientCss(direction: string | undefined, from: string, to: string) {
  const map: Record<string, string> = {
    "to-bottom": "to bottom",
    "to-bottom-right": "to bottom right",
    "to-top-right": "to top right",
    "to-right": "to right",
  };
  return `linear-gradient(${map[direction ?? "to-right"] ?? "to right"}, ${from}, ${to})`;
}

function hasDataZoomType(type: string) {
  const zoom = chartOption.value.dataZoom;
  return Array.isArray(zoom) && zoom.some((z) => z?.type === type);
}

function toggleDataZoom(type: "inside" | "slider", checked: boolean) {
  const prev = Array.isArray(chartOption.value.dataZoom)
    ? [...chartOption.value.dataZoom]
    : [];
  const next = checked
    ? [...prev.filter((z) => z?.type !== type), { type }]
    : prev.filter((z) => z?.type !== type);
  updateOptionForm({ dataZoom: next });
}

function onOptionJsonChange(v: string) {
  optionJsonText.value = v;
  try {
    const parsed = JSON.parse(v) as Record<string, unknown>;
    updateChart({ option: parsed });
    optionJsonError.value = null;
  } catch {
    optionJsonError.value = t("panel.config.jsonInvalid");
  }
}
</script>

<template>
  <ConfigSection
    :title="t('panel.config.sectionChartBasic')"
    :open="basicOpen"
    :force-open="forceOpen"
    @update:open="emit('update:basicOpen', $event)"
  >
    <ConfigFieldGroup :title="t('panel.config.groupBasicDisplay')">
      <label class="block space-y-1.5">
        <div>{{ t("panel.config.title") }}</div>
        <Input
          size="small"
          :value="element.chart?.title ?? ''"
          :disabled="!isEditable"
          @update:value="(v: string) => updateChart({ title: v })"
        />
      </label>
      <ConfigColorField
        :label="t('panel.config.primaryColor')"
        :value="element.chart?.color ?? '#3b82f6'"
        :disabled="!isEditable"
        @update:value="(v) => updateChart({ color: v || '#3b82f6' })"
      />
      <label class="flex items-center gap-2">
        <Checkbox
          :checked="element.chart?.colorMode === 'gradient'"
          :disabled="!isEditable"
          @update:checked="(v) => updateChart({ colorMode: v ? 'gradient' : 'solid' })"
        />
        <span>{{ t("panel.config.usePrimaryGradient") }}</span>
      </label>
      <div v-if="element.chart?.colorMode === 'gradient'" class="grid grid-cols-2 gap-2">
        <ConfigColorField
          :label="t('panel.scope.fieldChartGradientFrom')"
          :value="element.chart?.gradientFrom ?? element.chart?.color ?? '#3b82f6'"
          :disabled="!isEditable"
          @update:value="(v) => updateChart({ gradientFrom: v || '#3b82f6' })"
        />
        <ConfigColorField
          :label="t('panel.scope.fieldChartGradientTo')"
          :value="element.chart?.gradientTo ?? '#22d3ee'"
          :disabled="!isEditable"
          @update:value="(v) => updateChart({ gradientTo: v || '#22d3ee' })"
        />
        <label class="col-span-2 block space-y-1">
          <div>{{ t("panel.config.gradientDirection") }}</div>
          <Select
            size="small"
            class="w-full"
            :value="element.chart?.gradientDirection ?? 'to-right'"
            :disabled="!isEditable"
            @update:value="(v) => updateChart({ gradientDirection: v as PanelChartConfig['gradientDirection'] })"
          >
            <Select.Option value="to-right">{{ t("panel.config.dirToRight") }}</Select.Option>
            <Select.Option value="to-bottom">{{ t("panel.config.dirToBottom") }}</Select.Option>
            <Select.Option value="to-bottom-right">{{ t("panel.config.dirToBottomRight") }}</Select.Option>
            <Select.Option value="to-top-right">{{ t("panel.config.dirToTopRight") }}</Select.Option>
          </Select>
        </label>
        <div class="col-span-2 space-y-1">
          <div class="text-[11px] text-gray-500">{{ t("panel.config.gradientPreview") }}</div>
          <div
            class="h-6 rounded border border-gray-200/60"
            :style="{
              backgroundImage: gradientCss(
                element.chart?.gradientDirection,
                element.chart?.gradientFrom ?? element.chart?.color ?? '#3b82f6',
                element.chart?.gradientTo ?? '#22d3ee'
              ),
            }"
          />
        </div>
      </div>
      <label class="block space-y-1.5">
        <div>{{ t("panel.config.renderMode") }}</div>
        <Select
          size="small"
          class="w-full"
          :value="element.chart?.renderMode ?? 'canvas'"
          :disabled="!isEditable"
          @update:value="(v) => updateChart({ renderMode: v as 'canvas' | 'svg' })"
        >
          <Select.Option value="canvas">Canvas</Select.Option>
          <Select.Option value="svg">SVG</Select.Option>
        </Select>
      </label>
    </ConfigFieldGroup>

    <ConfigFieldGroup :title="t('panel.config.groupTooltip')">
      <div class="grid grid-cols-2 gap-2">
        <label class="flex items-center gap-2">
          <Checkbox
            :checked="element.chart?.tooltipShow ?? true"
            :disabled="!isEditable"
            @update:checked="(v) => updateChart({ tooltipShow: v === true })"
          />
          <span>{{ t("panel.config.showTooltip") }}</span>
        </label>
        <label class="block space-y-1">
          <div>{{ t("panel.config.tooltipTrigger") }}</div>
          <Select
            size="small"
            class="w-full"
            :value="element.chart?.tooltipTrigger ?? 'axis'"
            :disabled="!isEditable"
            @update:value="(v) => updateChart({ tooltipTrigger: v as 'axis' | 'item' })"
          >
            <Select.Option value="axis">axis</Select.Option>
            <Select.Option value="item">item</Select.Option>
          </Select>
        </label>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <ConfigColorField
          :label="t('panel.scope.fieldChartTooltipBackgroundColor')"
          :value="element.chart?.tooltipBackgroundColor ?? '#0f172a'"
          :disabled="!isEditable"
          @update:value="(v) => updateChart({ tooltipBackgroundColor: v || '#0f172a' })"
        />
        <ConfigColorField
          :label="t('panel.scope.fieldChartTooltipTextColor')"
          :value="element.chart?.tooltipTextColor ?? '#f8fafc'"
          :disabled="!isEditable"
          @update:value="(v) => updateChart({ tooltipTextColor: v || '#f8fafc' })"
        />
      </div>
      <label class="block space-y-1">
        <div class="flex items-center gap-1">
          <span>{{ t("panel.config.tooltipFormatter") }}</span>
          <ConfigHintIcon label="Tooltip Formatter" content-class="max-w-[360px]">
            <div class="font-medium">{{ t("panel.config.formatterPlaceholdersTitle") }}</div>
            <div>{{ t("panel.config.formatterPlaceholders") }}</div>
          </ConfigHintIcon>
        </div>
        <Input
          size="small"
          :value="element.chart?.tooltipFormatter ?? ''"
          :disabled="!isEditable"
          :placeholder="t('panel.config.tooltipFormatterPlaceholder')" 
          @update:value="(v: string) => updateChart({ tooltipFormatter: v || undefined })"
        />
      </label>
    </ConfigFieldGroup>

    <ConfigFieldGroup :title="t('panel.config.groupData')">
      <label class="block space-y-1">
        <div>{{ t("panel.config.labelsCsv") }}</div>
        <Input
          size="small"
          :value="getChartLabelsDisplayText(element.chart)"
          :disabled="!isEditable"
          @update:value="(v: string) => updateChart({ labelsText: v })"
        />
      </label>
      <label class="block space-y-1">
        <div>{{ t("panel.config.valuesCsv") }}</div>
        <Input
          size="small"
          :value="getChartValuesDisplayText(element.chart)"
          :disabled="!isEditable"
          @update:value="(v: string) => updateChart({ valuesText: v })"
        />
      </label>
    </ConfigFieldGroup>

    <ConfigFieldGroup
      v-if="['bar', 'line', 'area', 'scatter'].includes(selectedChartType)"
      :title="t('panel.config.groupAxes')"
    >
      <div class="grid grid-cols-2 gap-2">
        <label class="block">
          <div class="mb-1">{{ t("panel.scope.fieldChartXAxisName") }}</div>
          <Input
            size="small"
            :value="element.chart?.xAxisName ?? ''"
            :disabled="!isEditable"
            @update:value="(v: string) => updateChart({ xAxisName: v })"
          />
        </label>
        <label class="block">
          <div class="mb-1">{{ t("panel.scope.fieldChartYAxisName") }}</div>
          <Input
            size="small"
            :value="element.chart?.yAxisName ?? ''"
            :disabled="!isEditable"
            @update:value="(v: string) => updateChart({ yAxisName: v })"
          />
        </label>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <label class="flex items-center gap-2">
          <Checkbox
            :checked="element.chart?.xAxisTickShow ?? true"
            :disabled="!isEditable"
            @update:checked="(v) => updateChart({ xAxisTickShow: v === true })"
          />
          <span>{{ t("panel.config.xAxisTick") }}</span>
        </label>
        <label class="flex items-center gap-2">
          <Checkbox
            :checked="element.chart?.yAxisTickShow ?? true"
            :disabled="!isEditable"
            @update:checked="(v) => updateChart({ yAxisTickShow: v === true })"
          />
          <span>{{ t("panel.config.yAxisTick") }}</span>
        </label>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <ConfigColorField
          :label="t('panel.config.xAxisTickColor')"
          :value="element.chart?.xAxisTickColor ?? '#94a3b8'"
          :disabled="!isEditable"
          @update:value="(v) => updateChart({ xAxisTickColor: v || '#94a3b8' })"
        />
        <ConfigColorField
          :label="t('panel.config.yAxisTickColor')"
          :value="element.chart?.yAxisTickColor ?? '#94a3b8'"
          :disabled="!isEditable"
          @update:value="(v) => updateChart({ yAxisTickColor: v || '#94a3b8' })"
        />
      </div>
      <div class="grid grid-cols-2 gap-2">
        <label class="flex items-center gap-2">
          <Checkbox
            :checked="element.chart?.xAxisSplitLineShow ?? false"
            :disabled="!isEditable"
            @update:checked="(v) => updateChart({ xAxisSplitLineShow: v === true })"
          />
          <span>{{ t("panel.config.xAxisSplitLine") }}</span>
        </label>
        <label class="flex items-center gap-2">
          <Checkbox
            :checked="element.chart?.yAxisSplitLineShow ?? true"
            :disabled="!isEditable"
            @update:checked="(v) => updateChart({ yAxisSplitLineShow: v === true })"
          />
          <span>{{ t("panel.config.yAxisSplitLine") }}</span>
        </label>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <ConfigColorField
          :label="t('panel.scope.fieldChartXAxisLabelColor')"
          :value="element.chart?.xAxisLabelColor ?? '#64748b'"
          :disabled="!isEditable"
          @update:value="(v) => updateChart({ xAxisLabelColor: v || '#64748b' })"
        />
        <ConfigColorField
          :label="t('panel.scope.fieldChartYAxisLabelColor')"
          :value="element.chart?.yAxisLabelColor ?? '#64748b'"
          :disabled="!isEditable"
          @update:value="(v) => updateChart({ yAxisLabelColor: v || '#64748b' })"
        />
      </div>
      <div class="grid grid-cols-2 gap-2">
        <label class="block">
          <div class="mb-1">{{ t("panel.config.xAxisLabelFontSize") }}</div>
          <InputNumber
            size="small"
            class="w-full"
            :min="8"
            :max="48"
            :value="element.chart?.xAxisLabelFontSize ?? 10"
            :disabled="!isEditable"
            @update:value="(v) => {
              const n = Number(v);
              if (!Number.isNaN(n)) updateChart({ xAxisLabelFontSize: Math.max(8, Math.min(48, n)) });
            }"
          />
        </label>
        <label class="block">
          <div class="mb-1">{{ t("panel.config.yAxisLabelFontSize") }}</div>
          <InputNumber
            size="small"
            class="w-full"
            :min="8"
            :max="48"
            :value="element.chart?.yAxisLabelFontSize ?? 10"
            :disabled="!isEditable"
            @update:value="(v) => {
              const n = Number(v);
              if (!Number.isNaN(n)) updateChart({ yAxisLabelFontSize: Math.max(8, Math.min(48, n)) });
            }"
          />
        </label>
      </div>
    </ConfigFieldGroup>

    <ConfigFieldGroup
      v-if="['bar', 'line', 'area', 'pie'].includes(selectedChartType)"
      :title="t('panel.config.groupSeries')"
    >
      <label v-if="selectedChartType === 'bar'" class="block space-y-1">
        <div>{{ t("panel.config.barWidthPx") }}</div>
        <InputNumber
          size="small"
          class="w-full"
          :min="1"
          :placeholder="t('panel.config.barWidthAuto')"
          :value="element.chart?.barWidth ?? null"
          :disabled="!isEditable"
          @update:value="(v) => {
            if (v == null || v === '') {
              updateChart({ barWidth: undefined });
              return;
            }
            const n = Number(v);
            if (!Number.isNaN(n) && n > 0) updateChart({ barWidth: Math.max(1, n) });
          }"
        />
      </label>
      <label
        v-if="selectedChartType === 'line' || selectedChartType === 'area'"
        class="flex items-center gap-2"
      >
        <Checkbox
          :checked="element.chart?.smooth ?? true"
          :disabled="!isEditable"
          @update:checked="(v) => updateChart({ smooth: v === true })"
        />
        <span>{{ t("panel.config.smooth") }}</span>
      </label>
      <div v-if="selectedChartType === 'pie'" class="grid grid-cols-2 gap-2">
        <label class="block space-y-1">
          <div>{{ t("panel.config.pieInnerRadiusPct") }}</div>
          <InputNumber
            size="small"
            class="w-full"
            :min="0"
            :max="99"
            :value="element.chart?.pieInnerRadius ?? 30"
            :disabled="!isEditable"
            @update:value="(v) => {
              const n = Number(v);
              if (!Number.isNaN(n)) updateChart({ pieInnerRadius: Math.max(0, Math.min(99, n)) });
            }"
          />
        </label>
        <label class="block space-y-1">
          <div>{{ t("panel.config.pieOuterRadiusPct") }}</div>
          <InputNumber
            size="small"
            class="w-full"
            :min="1"
            :max="100"
            :value="element.chart?.pieOuterRadius ?? 65"
            :disabled="!isEditable"
            @update:value="(v) => {
              const n = Number(v);
              if (!Number.isNaN(n)) updateChart({ pieOuterRadius: Math.max(1, Math.min(100, n)) });
            }"
          />
        </label>
      </div>
    </ConfigFieldGroup>
  </ConfigSection>

  <ConfigSection
    :title="t('panel.config.sectionChartAdvanced')"
    :open="advancedOpen"
    :force-open="forceOpen"
    @update:open="emit('update:advancedOpen', $event)"
  >
    <ConfigFieldGroup :title="t('panel.config.groupCommonForm')">
      <Collapse ghost size="small">
        <Collapse.Panel key="layout" :header="t('panel.config.groupLayoutAndCoord')">
          <div class="grid grid-cols-2 gap-2">
            <label class="block space-y-1">
              <div class="text-[11px]">{{ t("panel.config.gridLeftForm") }}</div>
              <InputNumber
                size="small"
                class="w-full"
                :value="Number(chartOption.grid?.left ?? 28)"
                :disabled="!isEditable"
                @update:value="(v) => updateOptionForm({ grid: { left: Number(v) || 0 } })"
              />
            </label>
            <label class="block space-y-1">
              <div class="text-[11px]">{{ t("panel.config.gridRightForm") }}</div>
              <InputNumber
                size="small"
                class="w-full"
                :value="Number(chartOption.grid?.right ?? 10)"
                :disabled="!isEditable"
                @update:value="(v) => updateOptionForm({ grid: { right: Number(v) || 0 } })"
              />
            </label>
            <label class="block space-y-1">
              <div class="text-[11px]">{{ t("panel.config.legendPositionForm") }}</div>
              <Select
                size="small"
                class="w-full"
                :value="String(chartOption.legend?.top ?? 'top')"
                :disabled="!isEditable"
                @update:value="(v) => updateOptionForm({ legend: { top: v } })"
              >
                <Select.Option value="top">{{ t("panel.config.legendTop") }}</Select.Option>
                <Select.Option value="bottom">{{ t("panel.config.legendBottom") }}</Select.Option>
                <Select.Option value="left">{{ t("panel.config.legendLeft") }}</Select.Option>
                <Select.Option value="right">{{ t("panel.config.legendRight") }}</Select.Option>
              </Select>
            </label>
            <label class="block space-y-1">
              <div class="text-[11px]">{{ t("panel.config.legendOrientForm") }}</div>
              <Select
                size="small"
                class="w-full"
                :value="String(chartOption.legend?.orient ?? 'horizontal')"
                :disabled="!isEditable"
                @update:value="(v) => updateOptionForm({ legend: { orient: v } })"
              >
                <Select.Option value="horizontal">{{ t("panel.config.legendHorizontal") }}</Select.Option>
                <Select.Option value="vertical">{{ t("panel.config.legendVertical") }}</Select.Option>
              </Select>
            </label>
          </div>
        </Collapse.Panel>
        <Collapse.Panel key="highfreq" :header="t('panel.config.groupHighFreq')">
          <div class="space-y-2">
            <label class="flex items-center gap-2">
              <Checkbox
                :checked="Boolean(chartOption.legend?.show ?? true)"
                :disabled="!isEditable"
                @update:checked="(v) => updateOptionForm({ legend: { show: v === true } })"
              />
              <span>{{ t("panel.config.showLegend") }}</span>
            </label>
            <label class="flex items-center gap-2">
              <Checkbox
                :checked="Boolean(chartOption.grid?.containLabel ?? false)"
                :disabled="!isEditable"
                @update:checked="(v) => updateOptionForm({ grid: { containLabel: v === true } })"
              />
              <span>{{ t("panel.config.gridContainLabel") }}</span>
            </label>
            <label class="flex items-center gap-2">
              <Checkbox
                :checked="hasDataZoomType('inside')"
                :disabled="!isEditable"
                @update:checked="(v) => toggleDataZoom('inside', v === true)"
              />
              <span>{{ t("panel.config.zoomInside") }}</span>
            </label>
            <label class="flex items-center gap-2">
              <Checkbox
                :checked="hasDataZoomType('slider')"
                :disabled="!isEditable"
                @update:checked="(v) => toggleDataZoom('slider', v === true)"
              />
              <span>{{ t("panel.config.zoomSlider") }}</span>
            </label>
            <label class="flex items-center gap-2">
              <Checkbox
                :checked="Boolean(chartOption.animation ?? false)"
                :disabled="!isEditable"
                @update:checked="(v) => updateOptionForm({ animation: v === true })"
              />
              <span>{{ t("panel.config.enableAnimation") }}</span>
            </label>
            <label class="block space-y-1">
              <div class="text-[11px]">{{ t("panel.config.animationDurationMs") }}</div>
              <InputNumber
                size="small"
                class="w-full"
                :min="0"
                :value="Number(chartOption.animationDuration ?? 300)"
                :disabled="!isEditable"
                @update:value="(v) => updateOptionForm({ animationDuration: Math.max(0, Number(v) || 0) })"
              />
            </label>
          </div>
        </Collapse.Panel>
        <Collapse.Panel key="axisPointer" :header="t('panel.config.groupAxisPointer')">
          <div class="space-y-2">
            <label class="flex items-center gap-2">
              <Checkbox
                :checked="Boolean(chartOption.axisPointer?.show ?? false)"
                :disabled="!isEditable"
                @update:checked="(v) => updateOptionForm({ axisPointer: { show: v === true } })"
              />
              <span>{{ t("panel.config.showAxisPointer") }}</span>
            </label>
            <label class="block space-y-1">
              <div class="text-[11px]">{{ t("panel.config.axisPointerType") }}</div>
              <Select
                size="small"
                class="w-full"
                :value="String(chartOption.axisPointer?.type ?? 'line')"
                :disabled="!isEditable"
                @update:value="(v) => updateOptionForm({ axisPointer: { type: v } })"
              >
                <Select.Option value="line">{{ t("panel.config.axisPointerLine") }}</Select.Option>
                <Select.Option value="shadow">{{ t("panel.config.axisPointerShadow") }}</Select.Option>
                <Select.Option value="cross">{{ t("panel.config.axisPointerCross") }}</Select.Option>
              </Select>
            </label>
          </div>
        </Collapse.Panel>
      </Collapse>
    </ConfigFieldGroup>

    <ConfigFieldGroup :title="t('panel.config.groupJsonAdvanced')">
      <label class="flex items-center gap-2">
        <Checkbox
          v-model:checked="isAdvancedOptionMode"
          :disabled="!isEditable"
        />
        <span>{{ t("panel.config.enableAdvancedJson") }}</span>
        <ConfigHintIcon :label="t('panel.config.advancedJsonHintLabel')">
          {{ t("panel.config.advancedJsonHint") }}
        </ConfigHintIcon>
      </label>
      <template v-if="isAdvancedOptionMode">
        <Textarea
          :value="optionJsonText"
          :disabled="!isEditable"
          :rows="8"
          spellcheck="false"
          class="font-mono text-[11px]"
          @update:value="onOptionJsonChange"
        />
        <div
          v-if="optionJsonError"
          class="rounded border border-red-400/40 bg-red-50 px-2 py-1.5 text-[11px] text-red-700"
        >
          {{ optionJsonError }}
        </div>
        <div
          v-else
          class="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-1.5 text-[11px] text-emerald-700"
        >
          {{ t("panel.config.jsonValidApplied") }}
        </div>
      </template>
    </ConfigFieldGroup>
  </ConfigSection>
</template>
