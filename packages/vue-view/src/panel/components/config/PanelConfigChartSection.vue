<script setup lang="ts">
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
    optionJsonError.value = "JSON 格式错误，修正后会自动应用";
  }
}
</script>

<template>
  <ConfigSection
    title="图表配置 / 基础"
    :open="basicOpen"
    :force-open="forceOpen"
    @update:open="emit('update:basicOpen', $event)"
  >
    <ConfigFieldGroup title="基础显示">
      <label class="block space-y-1.5">
        <div>标题</div>
        <Input
          size="small"
          :value="element.chart?.title ?? ''"
          :disabled="!isEditable"
          @update:value="(v: string) => updateChart({ title: v })"
        />
      </label>
      <ConfigColorField
        label="主色"
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
        <span>主色使用渐变</span>
      </label>
      <div v-if="element.chart?.colorMode === 'gradient'" class="grid grid-cols-2 gap-2">
        <ConfigColorField
          label="渐变起始色"
          :value="element.chart?.gradientFrom ?? element.chart?.color ?? '#3b82f6'"
          :disabled="!isEditable"
          @update:value="(v) => updateChart({ gradientFrom: v || '#3b82f6' })"
        />
        <ConfigColorField
          label="渐变结束色"
          :value="element.chart?.gradientTo ?? '#22d3ee'"
          :disabled="!isEditable"
          @update:value="(v) => updateChart({ gradientTo: v || '#22d3ee' })"
        />
        <label class="col-span-2 block space-y-1">
          <div>渐变方向</div>
          <Select
            size="small"
            class="w-full"
            :value="element.chart?.gradientDirection ?? 'to-right'"
            :disabled="!isEditable"
            @update:value="(v) => updateChart({ gradientDirection: v as PanelChartConfig['gradientDirection'] })"
          >
            <Select.Option value="to-right">左 → 右</Select.Option>
            <Select.Option value="to-bottom">上 → 下</Select.Option>
            <Select.Option value="to-bottom-right">左上 → 右下</Select.Option>
            <Select.Option value="to-top-right">左下 → 右上</Select.Option>
          </Select>
        </label>
        <div class="col-span-2 space-y-1">
          <div class="text-[11px] text-gray-500">渐变预览</div>
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
        <div>显示模式</div>
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

    <ConfigFieldGroup title="提示框 Tooltip">
      <div class="grid grid-cols-2 gap-2">
        <label class="flex items-center gap-2">
          <Checkbox
            :checked="element.chart?.tooltipShow ?? true"
            :disabled="!isEditable"
            @update:checked="(v) => updateChart({ tooltipShow: v === true })"
          />
          <span>显示 Tooltip</span>
        </label>
        <label class="block space-y-1">
          <div>Tooltip 触发方式</div>
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
          label="Tooltip 背景色"
          :value="element.chart?.tooltipBackgroundColor ?? '#0f172a'"
          :disabled="!isEditable"
          @update:value="(v) => updateChart({ tooltipBackgroundColor: v || '#0f172a' })"
        />
        <ConfigColorField
          label="Tooltip 文字色"
          :value="element.chart?.tooltipTextColor ?? '#f8fafc'"
          :disabled="!isEditable"
          @update:value="(v) => updateChart({ tooltipTextColor: v || '#f8fafc' })"
        />
      </div>
      <label class="block space-y-1">
        <div class="flex items-center gap-1">
          <span>Tooltip Formatter（可选）</span>
          <ConfigHintIcon label="Tooltip Formatter" content-class="max-w-[360px]">
            <div class="font-medium">可用占位符</div>
            <div>{"{a}=系列名, {b}=类目名, {c}=数值, {d}=百分比(饼图)"}</div>
          </ConfigHintIcon>
        </div>
        <Input
          size="small"
          :value="element.chart?.tooltipFormatter ?? ''"
          :disabled="!isEditable"
          placeholder="例如：{b}: {c}"
          @update:value="(v: string) => updateChart({ tooltipFormatter: v || undefined })"
        />
      </label>
    </ConfigFieldGroup>

    <ConfigFieldGroup title="数据">
      <label class="block space-y-1">
        <div>类目（逗号分隔）</div>
        <Input
          size="small"
          :value="getChartLabelsDisplayText(element.chart)"
          :disabled="!isEditable"
          @update:value="(v: string) => updateChart({ labelsText: v })"
        />
      </label>
      <label class="block space-y-1">
        <div>数值（逗号分隔）</div>
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
      title="坐标轴"
    >
      <div class="grid grid-cols-2 gap-2">
        <label class="block">
          <div class="mb-1">X 轴名称</div>
          <Input
            size="small"
            :value="element.chart?.xAxisName ?? ''"
            :disabled="!isEditable"
            @update:value="(v: string) => updateChart({ xAxisName: v })"
          />
        </label>
        <label class="block">
          <div class="mb-1">Y 轴名称</div>
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
          <span>X 轴刻度线</span>
        </label>
        <label class="flex items-center gap-2">
          <Checkbox
            :checked="element.chart?.yAxisTickShow ?? true"
            :disabled="!isEditable"
            @update:checked="(v) => updateChart({ yAxisTickShow: v === true })"
          />
          <span>Y 轴刻度线</span>
        </label>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <ConfigColorField
          label="X 轴刻度线颜色"
          :value="element.chart?.xAxisTickColor ?? '#94a3b8'"
          :disabled="!isEditable"
          @update:value="(v) => updateChart({ xAxisTickColor: v || '#94a3b8' })"
        />
        <ConfigColorField
          label="Y 轴刻度线颜色"
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
          <span>X 轴分割线</span>
        </label>
        <label class="flex items-center gap-2">
          <Checkbox
            :checked="element.chart?.yAxisSplitLineShow ?? true"
            :disabled="!isEditable"
            @update:checked="(v) => updateChart({ yAxisSplitLineShow: v === true })"
          />
          <span>Y 轴分割线</span>
        </label>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <ConfigColorField
          label="X 轴标签颜色"
          :value="element.chart?.xAxisLabelColor ?? '#64748b'"
          :disabled="!isEditable"
          @update:value="(v) => updateChart({ xAxisLabelColor: v || '#64748b' })"
        />
        <ConfigColorField
          label="Y 轴标签颜色"
          :value="element.chart?.yAxisLabelColor ?? '#64748b'"
          :disabled="!isEditable"
          @update:value="(v) => updateChart({ yAxisLabelColor: v || '#64748b' })"
        />
      </div>
      <div class="grid grid-cols-2 gap-2">
        <label class="block">
          <div class="mb-1">X 轴标签字号</div>
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
          <div class="mb-1">Y 轴标签字号</div>
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
      title="系列"
    >
      <label v-if="selectedChartType === 'bar'" class="block space-y-1">
        <div>柱宽（px）</div>
        <InputNumber
          size="small"
          class="w-full"
          :min="1"
          :value="element.chart?.barWidth ?? 24"
          :disabled="!isEditable"
          @update:value="(v) => {
            const n = Number(v);
            if (!Number.isNaN(n)) updateChart({ barWidth: Math.max(1, n) });
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
        <span>平滑曲线</span>
      </label>
      <div v-if="selectedChartType === 'pie'" class="grid grid-cols-2 gap-2">
        <label class="block space-y-1">
          <div>内半径（%）</div>
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
          <div>外半径（%）</div>
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
    title="图表配置 / 高级"
    :open="advancedOpen"
    :force-open="forceOpen"
    @update:open="emit('update:advancedOpen', $event)"
  >
    <ConfigFieldGroup title="常用项（表单）">
      <Collapse ghost size="small">
        <Collapse.Panel key="layout" header="布局与坐标">
          <div class="grid grid-cols-2 gap-2">
            <label class="block space-y-1">
              <div class="text-[11px]">网格左距（grid.left）</div>
              <InputNumber
                size="small"
                class="w-full"
                :value="Number(chartOption.grid?.left ?? 28)"
                :disabled="!isEditable"
                @update:value="(v) => updateOptionForm({ grid: { left: Number(v) || 0 } })"
              />
            </label>
            <label class="block space-y-1">
              <div class="text-[11px]">网格右距（grid.right）</div>
              <InputNumber
                size="small"
                class="w-full"
                :value="Number(chartOption.grid?.right ?? 10)"
                :disabled="!isEditable"
                @update:value="(v) => updateOptionForm({ grid: { right: Number(v) || 0 } })"
              />
            </label>
            <label class="block space-y-1">
              <div class="text-[11px]">图例位置（legend.top）</div>
              <Select
                size="small"
                class="w-full"
                :value="String(chartOption.legend?.top ?? 'top')"
                :disabled="!isEditable"
                @update:value="(v) => updateOptionForm({ legend: { top: v } })"
              >
                <Select.Option value="top">顶部</Select.Option>
                <Select.Option value="bottom">底部</Select.Option>
                <Select.Option value="left">左侧</Select.Option>
                <Select.Option value="right">右侧</Select.Option>
              </Select>
            </label>
            <label class="block space-y-1">
              <div class="text-[11px]">图例排列（legend.orient）</div>
              <Select
                size="small"
                class="w-full"
                :value="String(chartOption.legend?.orient ?? 'horizontal')"
                :disabled="!isEditable"
                @update:value="(v) => updateOptionForm({ legend: { orient: v } })"
              >
                <Select.Option value="horizontal">横向</Select.Option>
                <Select.Option value="vertical">纵向</Select.Option>
              </Select>
            </label>
          </div>
        </Collapse.Panel>
        <Collapse.Panel key="highfreq" header="高频项">
          <div class="space-y-2">
            <label class="flex items-center gap-2">
              <Checkbox
                :checked="Boolean(chartOption.legend?.show ?? true)"
                :disabled="!isEditable"
                @update:checked="(v) => updateOptionForm({ legend: { show: v === true } })"
              />
              <span>显示图例</span>
            </label>
            <label class="flex items-center gap-2">
              <Checkbox
                :checked="Boolean(chartOption.grid?.containLabel ?? false)"
                :disabled="!isEditable"
                @update:checked="(v) => updateOptionForm({ grid: { containLabel: v === true } })"
              />
              <span>网格包含标签</span>
            </label>
            <label class="flex items-center gap-2">
              <Checkbox
                :checked="hasDataZoomType('inside')"
                :disabled="!isEditable"
                @update:checked="(v) => toggleDataZoom('inside', v === true)"
              />
              <span>内置缩放</span>
            </label>
            <label class="flex items-center gap-2">
              <Checkbox
                :checked="hasDataZoomType('slider')"
                :disabled="!isEditable"
                @update:checked="(v) => toggleDataZoom('slider', v === true)"
              />
              <span>滑块缩放</span>
            </label>
            <label class="flex items-center gap-2">
              <Checkbox
                :checked="Boolean(chartOption.animation ?? false)"
                :disabled="!isEditable"
                @update:checked="(v) => updateOptionForm({ animation: v === true })"
              />
              <span>开启动画</span>
            </label>
            <label class="block space-y-1">
              <div class="text-[11px]">动画时长（ms）</div>
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
        <Collapse.Panel key="axisPointer" header="轴指示器与对齐">
          <div class="space-y-2">
            <label class="flex items-center gap-2">
              <Checkbox
                :checked="Boolean(chartOption.axisPointer?.show ?? false)"
                :disabled="!isEditable"
                @update:checked="(v) => updateOptionForm({ axisPointer: { show: v === true } })"
              />
              <span>显示轴指示器</span>
            </label>
            <label class="block space-y-1">
              <div class="text-[11px]">轴指示器类型</div>
              <Select
                size="small"
                class="w-full"
                :value="String(chartOption.axisPointer?.type ?? 'line')"
                :disabled="!isEditable"
                @update:value="(v) => updateOptionForm({ axisPointer: { type: v } })"
              >
                <Select.Option value="line">线</Select.Option>
                <Select.Option value="shadow">阴影</Select.Option>
                <Select.Option value="cross">十字</Select.Option>
              </Select>
            </label>
          </div>
        </Collapse.Panel>
      </Collapse>
    </ConfigFieldGroup>

    <ConfigFieldGroup title="JSON 高级模式">
      <label class="flex items-center gap-2">
        <Checkbox
          v-model:checked="isAdvancedOptionMode"
          :disabled="!isEditable"
        />
        <span>开启高级模式（直接编辑图表 JSON 配置）</span>
        <ConfigHintIcon label="图表 JSON 高级模式">
          基础配置会先生成图表配置，高级模式会在此基础上覆盖（深度合并）。
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
          JSON 有效，已实时应用到当前图表。
        </div>
      </template>
    </ConfigFieldGroup>
  </ConfigSection>
</template>
