<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "@arronqzy/i18n/vue";
import { Button, Input, InputNumber, Modal, Select, Switch, Textarea, message } from "ant-design-vue";
import type {
  Condition,
  PanelTableConfig,
  TableCellActions,
  TableCellWidget,
  TableColumnConfig,
  TableStyleProps,
  TableTooltipPlacement,
  TableWidgetProps,
  TableMockLocale,
} from "@arronqzy/view-table";
import {
  coerceBooleanMapTarget,
  createDefaultCondition,
  findBooleanValueMapConflicts,
  generateMockTableRows,
  stringifyMockTableRows,
} from "@arronqzy/view-table";
import type { PanelElement } from "../../types";
import ConfigColorField from "../config/ConfigColorField.vue";
import ConfigFieldGroup from "../config/ConfigFieldGroup.vue";
import ConfigSection from "../config/ConfigSection.vue";
import ConfigHintIcon from "../ConfigHintIcon.vue";
import ConditionEditor from "./ConditionEditor.vue";
import JsonCodeEditor from "./JsonCodeEditor.vue";

const { t } = useI18n();

const WIDGET_OPTIONS: TableCellWidget[] = [
  "text",
  "tag",
  "badge",
  "link",
  "progress",
  "image",
  "boolean",
];

const TRANSFORM_MODES = ["auto", "records", "matrix", "path"] as const;

const props = withDefaults(
  defineProps<{
    element: PanelElement;
    isEditable: boolean;
    open: boolean;
    forceOpen?: boolean;
    updateElement: (
      id: string,
      patch: Partial<PanelElement>,
      options?: { batchId?: string; meta?: Record<string, unknown> }
    ) => void;
    blueprintNodeOptions?: { id: string; label: string }[];
  }>(),
  { blueprintNodeOptions: () => [] }
);

const emit = defineEmits<{
  "update:open": [value: boolean];
}>();

const selectedColumnIndex = ref(0);
const rowsEditorOpen = ref(false);
const rowsEditorDraft = ref("");
const mockOpen = ref(false);
const mockRowCount = ref(5);
const mockSeed = ref("");
const mockNamePrefix = ref("");
const mockLocale = ref<TableMockLocale>("zh");
const mockIncludeId = ref(true);
const mockIncludeTimestamp = ref(false);
const mockIncludeExtras = ref(true);
const mockStatusValues = ref("active,idle,pending,done");
const mockScoreMin = ref(0);
const mockScoreMax = ref(100);

function openRowsEditor() {
  rowsEditorDraft.value = table.value.rowsText ?? "";
  rowsEditorOpen.value = true;
}

/** Return a rejected Promise to keep Modal open on validation failure. */
function saveRowsEditor() {
  const trimmed = rowsEditorDraft.value.trim();
  if (!trimmed) {
    updateTable({ rowsText: "" });
    rowsEditorOpen.value = false;
    return Promise.resolve();
  }
  try {
    const parsed = JSON.parse(trimmed);
    if (!Array.isArray(parsed)) {
      message.error(t("panel.config.tableRowsEditNeedArray"));
      return Promise.reject();
    }
    updateTable({ rowsText: JSON.stringify(parsed, null, 2) });
    rowsEditorOpen.value = false;
    return Promise.resolve();
  } catch {
    message.error(t("panel.config.tableRowsEditInvalidJson"));
    return Promise.reject();
  }
}

function applyMockRows() {
  const rows = generateMockTableRows(columns.value, {
    rowCount: mockRowCount.value ?? 5,
    seed: mockSeed.value || undefined,
    namePrefix: mockNamePrefix.value || undefined,
    locale: mockLocale.value,
    includeId: mockIncludeId.value,
    includeTimestamp: mockIncludeTimestamp.value,
    includeExtras: mockIncludeExtras.value,
    statusValues: mockStatusValues.value.split(/[,，]/),
    scoreMin: mockScoreMin.value ?? 0,
    scoreMax: mockScoreMax.value ?? 100,
  });
  updateTable({ rowsText: stringifyMockTableRows(rows) });
  mockOpen.value = false;
}

const table = computed(() => (props.element.table ?? {}) as PanelTableConfig);
const columns = computed(() => table.value.columns ?? []);

const selectedColumn = computed(() => {
  const cols = columns.value;
  if (cols.length === 0) return null;
  const idx = Math.min(Math.max(0, selectedColumnIndex.value), cols.length - 1);
  return { index: idx, column: cols[idx]! };
});

const booleanValueMapConflicts = computed(() => {
  const col = selectedColumn.value?.column;
  if (!col || col.widget !== "boolean") return [];
  return findBooleanValueMapConflicts(col.valueMap);
});

function booleanMapSelectValue(value: unknown): "true" | "false" {
  return coerceBooleanMapTarget(value) === false ? "false" : "true";
}

function blueprintSelectValue(id?: string): string {
  return id?.trim() ? id : "__none__";
}

/** ant-design-vue Switch emits `CheckedType` (boolean | string). */
function asSwitchChecked(v: unknown): boolean {
  return v === true;
}

/** ant-design-vue Select emits `SelectValue` (string | number | array | undefined). */
function asSelectString(v: unknown): string {
  if (Array.isArray(v)) return String(v[0] ?? "");
  return v == null ? "" : String(v);
}

function onBlueprintSelect(
  index: number,
  key: keyof TableCellActions,
  v: unknown
) {
  const next = asSelectString(v);
  patchActions(index, {
    [key]: next === "__none__" || !next ? undefined : next,
  });
}

function updateTable(patch: Partial<PanelTableConfig>) {
  props.updateElement(props.element.id, {
    table: { ...table.value, ...patch },
  });
}

function updateTransform(
  patch: Partial<NonNullable<PanelTableConfig["transform"]>>
) {
  updateTable({
    transform: { ...(table.value.transform ?? {}), ...patch },
  });
}

function updateTableStyle(patch: Partial<NonNullable<PanelTableConfig["tableStyle"]>>) {
  updateTable({
    tableStyle: { ...(table.value.tableStyle ?? {}), ...patch },
  });
}

function updateHeaderStyle(patch: Partial<TableStyleProps>) {
  updateTable({
    headerStyle: { ...(table.value.headerStyle ?? {}), ...patch },
  });
}

function setColumns(next: TableColumnConfig[]) {
  updateTable({ columns: next });
}

function addColumn() {
  const n = columns.value.length + 1;
  const next: TableColumnConfig[] = [
    ...columns.value,
    {
      id: `col-${Date.now().toString(36)}`,
      field: `field${n}`,
      title: t("panel.config.tableColumnUntitled", { n }),
      width: 120,
      widget: "text",
    },
  ];
  setColumns(next);
  selectedColumnIndex.value = next.length - 1;
}

function removeColumn(index: number) {
  const next = columns.value.filter((_, i) => i !== index);
  setColumns(next);
  selectedColumnIndex.value = Math.max(0, Math.min(index, next.length - 1));
}

function moveColumn(index: number, delta: -1 | 1) {
  const target = index + delta;
  if (target < 0 || target >= columns.value.length) return;
  const next = [...columns.value];
  const [item] = next.splice(index, 1);
  if (!item) return;
  next.splice(target, 0, item);
  setColumns(next);
  selectedColumnIndex.value = target;
}

function patchColumn(index: number, patch: Partial<TableColumnConfig>) {
  const next = columns.value.map((col, i) => (i === index ? { ...col, ...patch } : col));
  setColumns(next);
}

function patchWidgetProps(index: number, patch: Partial<TableWidgetProps>) {
  const col = columns.value[index];
  if (!col) return;
  patchColumn(index, {
    widgetProps: { ...(col.widgetProps ?? {}), ...patch },
  });
}

function patchActions(index: number, patch: Partial<TableCellActions>) {
  const col = columns.value[index];
  if (!col) return;
  patchWidgetProps(index, {
    actions: { ...(col.widgetProps?.actions ?? {}), ...patch },
  });
}

const imageUploadHint = ref("");

async function uploadImageForColumn(index: number, file: File) {
  try {
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ""));
      reader.onerror = () => reject(new Error("read failed"));
      reader.readAsDataURL(file);
    });
    patchWidgetProps(index, { imageUrlMode: "static", imageUrl: base64 });
    imageUploadHint.value = t("panel.config.uploadWrittenBase64");
    try {
      const form = new FormData();
      form.append("file", file);
      const resp = await fetch("/api/upload", { method: "POST", body: form });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = (await resp.json()) as { url?: string };
      if (data.url) {
        patchWidgetProps(index, { imageUrlMode: "static", imageUrl: data.url });
        imageUploadHint.value = t("panel.config.uploadServerAndBase64");
      }
    } catch {
      imageUploadHint.value = t("panel.config.uploadServerFailedKeepBase64");
    }
  } catch {
    imageUploadHint.value = t("panel.messages.readImageFailed");
  }
}

function onImageFileChange(index: number, e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = "";
  if (file) void uploadImageForColumn(index, file);
}

function addValueMapRule(index: number) {
  const col = columns.value[index];
  if (!col) return;
  const valueMap = [
    ...(col.valueMap ?? []),
    {
      when: createDefaultCondition(),
      value: col.widget === "boolean" ? true : "",
    },
  ];
  patchColumn(index, { valueMap });
}

function patchValueMapRule(
  colIndex: number,
  ruleIndex: number,
  patch: { value?: string | boolean; when?: Condition }
) {
  const col = columns.value[colIndex];
  if (!col?.valueMap) return;
  const valueMap = col.valueMap.map((rule, i) => {
    if (i !== ruleIndex) return rule;
    return {
      ...rule,
      value: patch.value !== undefined ? patch.value : rule.value,
      when: patch.when !== undefined ? patch.when : rule.when,
    };
  });
  patchColumn(colIndex, { valueMap });
}

function removeValueMapRule(colIndex: number, ruleIndex: number) {
  const col = columns.value[colIndex];
  if (!col?.valueMap) return;
  patchColumn(colIndex, {
    valueMap: col.valueMap.filter((_, i) => i !== ruleIndex),
  });
}

function addCellStyleRule(index: number) {
  const col = columns.value[index];
  if (!col) return;
  const cellStyleRules = [
    ...(col.cellStyleRules ?? []),
    {
      when: createDefaultCondition(),
      style: { backgroundColor: "#fef3c7" },
    },
  ];
  patchColumn(index, { cellStyleRules });
}

function patchCellStyleRule(
  colIndex: number,
  ruleIndex: number,
  patch: { when?: Condition; backgroundColor?: string }
) {
  const col = columns.value[colIndex];
  if (!col?.cellStyleRules) return;
  const cellStyleRules = col.cellStyleRules.map((rule, i) => {
    if (i !== ruleIndex) return rule;
    return {
      ...rule,
      when: patch.when !== undefined ? patch.when : rule.when,
      style: {
        ...rule.style,
        backgroundColor:
          patch.backgroundColor !== undefined
            ? patch.backgroundColor
            : rule.style.backgroundColor,
      },
    };
  });
  patchColumn(colIndex, { cellStyleRules });
}

function removeCellStyleRule(colIndex: number, ruleIndex: number) {
  const col = columns.value[colIndex];
  if (!col?.cellStyleRules) return;
  patchColumn(colIndex, {
    cellStyleRules: col.cellStyleRules.filter((_, i) => i !== ruleIndex),
  });
}

function addRowStyleRule() {
  const rowStyleRules = [
    ...(table.value.rowStyleRules ?? []),
    {
      when: createDefaultCondition(),
      style: { backgroundColor: "#eff6ff" },
    },
  ];
  updateTable({ rowStyleRules });
}

function patchRowStyleRule(
  ruleIndex: number,
  patch: { when?: Condition; backgroundColor?: string }
) {
  const rules = table.value.rowStyleRules ?? [];
  const rowStyleRules = rules.map((rule, i) => {
    if (i !== ruleIndex) return rule;
    return {
      ...rule,
      when: patch.when !== undefined ? patch.when : rule.when,
      style: {
        ...rule.style,
        backgroundColor:
          patch.backgroundColor !== undefined
            ? patch.backgroundColor
            : rule.style.backgroundColor,
      },
    };
  });
  updateTable({ rowStyleRules });
}

function removeRowStyleRule(ruleIndex: number) {
  updateTable({
    rowStyleRules: (table.value.rowStyleRules ?? []).filter((_, i) => i !== ruleIndex),
  });
}

function patchHrefRuleWhen(ruleIndex: number, when: Condition) {
  if (!selectedColumn.value) return;
  const next = [...(selectedColumn.value.column.widgetProps?.hrefRules ?? [])];
  const rule = next[ruleIndex];
  if (!rule) return;
  next[ruleIndex] = { ...rule, when };
  patchWidgetProps(selectedColumn.value.index, { hrefRules: next });
}

function patchProgressRuleWhen(ruleIndex: number, when: Condition) {
  if (!selectedColumn.value) return;
  const next = [...(selectedColumn.value.column.widgetProps?.progressRules ?? [])];
  const rule = next[ruleIndex];
  if (!rule) return;
  next[ruleIndex] = { ...rule, when };
  patchWidgetProps(selectedColumn.value.index, { progressRules: next });
}
</script>

<template>
  <ConfigSection
    :title="t('panel.config.sectionTable')"
    :open="open"
    :force-open="forceOpen"
    @update:open="emit('update:open', $event)"
  >
        <ConfigFieldGroup :title="t('panel.config.groupTableData')">
      <template #hint>{{ t("panel.config.groupTableDataHint") }}</template>
      <label class="block space-y-1.5">
        <div class="flex items-center gap-1">
          <span>{{ t("panel.config.tableSource") }}</span>
          <ConfigHintIcon :label="t('panel.config.tableSource')">
            <div>{{ t("panel.config.tableSourceHint") }}</div>
          </ConfigHintIcon>
        </div>
        <Input
          size="small"
          :value="table.source ?? ''"
          placeholder="{scope?.list}"
          :disabled="!isEditable"
          @update:value="(v: unknown) => updateTable({ source: asSelectString(v) })"
        />
      </label>
      <label class="block space-y-1.5">
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-1">
            <span>{{ t("panel.config.tableRowsText") }}</span>
            <ConfigHintIcon :label="t('panel.config.tableRowsText')">
              <div>{{ t("panel.config.tableRowsTextHint") }}</div>
            </ConfigHintIcon>
          </div>
          <div class="flex items-center gap-0.5">
            <Button
              size="small"
              type="text"
              class="!px-1"
              :disabled="!isEditable"
              :title="t('panel.config.tableRowsEdit')"
              :aria-label="t('panel.config.tableRowsEdit')"
              @click="openRowsEditor"
            >
              <svg viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
            </Button>
            <Button
              size="small"
              type="text"
              class="!px-1"
              :disabled="!isEditable"
              :title="t('panel.config.tableRowsMock')"
              :aria-label="t('panel.config.tableRowsMock')"
              @click="mockOpen = true"
            >
              <svg viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
                <circle cx="12" cy="12" r="4" />
                <path d="M5.6 5.6 7.7 7.7M16.3 16.3l2.1 2.1M16.3 7.7l2.1-2.1M5.6 18.4 7.7 16.3" />
              </svg>
            </Button>
          </div>
        </div>
        <Textarea
          :value="table.rowsText ?? ''"
          :rows="8"
          :disabled="!isEditable"
          placeholder='[{"name":"A"}]'
          @update:value="(v: unknown) => updateTable({ rowsText: asSelectString(v) })"
        />
      </label>
      <details class="rounded-md border border-gray-200 bg-gray-50/60 px-2 py-1.5">
        <summary class="cursor-pointer text-[11px] font-medium text-gray-600">
          {{ t("panel.config.tableAdvancedData") }}
        </summary>
        <div class="mt-2 space-y-2 border-t border-gray-100 pt-2">
          <p class="text-[10px] text-gray-500">{{ t("panel.config.tableAdvancedDataHint") }}</p>
          <div class="grid grid-cols-2 gap-2">
            <label class="block space-y-1.5">
              <div class="flex items-center gap-1">
                <span>{{ t("panel.config.tableTransformMode") }}</span>
                <ConfigHintIcon :label="t('panel.config.tableTransformMode')">
                  <div>{{ t("panel.config.tableTransformModeHint") }}</div>
                </ConfigHintIcon>
              </div>
              <Select
                size="small"
                class="w-full"
                :value="table.transform?.mode ?? 'auto'"
                :disabled="!isEditable"
                @update:value="(v) => updateTransform({ mode: v as (typeof TRANSFORM_MODES)[number] })"
              >
                <Select.Option v-for="mode in TRANSFORM_MODES" :key="mode" :value="mode">
                  {{ t(`panel.config.tableMode.${mode}`) }}
                </Select.Option>
              </Select>
            </label>
            <label class="block space-y-1.5">
              <div class="flex items-center gap-1">
                <span>{{ t("panel.config.tableRowIdField") }}</span>
                <ConfigHintIcon :label="t('panel.config.tableRowIdField')">
                  <div>{{ t("panel.config.tableRowIdFieldHint") }}</div>
                </ConfigHintIcon>
              </div>
              <Input
                size="small"
                :value="table.transform?.rowIdField ?? ''"
                :disabled="!isEditable"
                @update:value="(v: unknown) => updateTransform({ rowIdField: asSelectString(v) })"
              />
            </label>
          </div>
          <label class="block space-y-1.5">
            <div class="flex items-center gap-1">
              <span>{{ t("panel.config.tableTransformPath") }}</span>
              <ConfigHintIcon :label="t('panel.config.tableTransformPath')">
                <div>{{ t("panel.config.tableTransformPathHint") }}</div>
              </ConfigHintIcon>
            </div>
            <Input
              size="small"
              :value="table.transform?.path ?? ''"
              placeholder="data.list"
              :disabled="!isEditable"
              @update:value="(v: unknown) => updateTransform({ path: asSelectString(v) })"
            />
          </label>
        </div>
      </details>
    </ConfigFieldGroup>

    <ConfigFieldGroup :title="t('panel.config.groupTableColumns')">
      <template #hint>{{ t("panel.config.groupTableColumnsHint") }}</template>
      <div class="flex justify-end">
        <Button size="small" type="dashed" :disabled="!isEditable" @click="addColumn">
          {{ t("panel.config.tableAddColumn") }}
        </Button>
      </div>
      <div v-if="!columns.length" class="text-[11px] text-gray-500">
        {{ t("panel.config.tableNoColumns") }}
      </div>
      <div class="space-y-1.5">
        <div
          v-for="(col, index) in columns"
          :key="col.id ?? col.field ?? index"
          class="flex items-center gap-1.5 rounded-md border px-1.5 py-1.5"
          :class="
            selectedColumn?.index === index
              ? 'border-blue-400 bg-blue-50 ring-1 ring-blue-200'
              : 'border-gray-200 hover:bg-gray-50'
          "
          role="button"
          tabindex="0"
          @click="selectedColumnIndex = index"
          @keydown.enter.prevent="selectedColumnIndex = index"
        >
          <div class="flex shrink-0 flex-col gap-0.5">
            <Button
              size="small"
              type="text"
              class="!h-5 !w-5 !p-0 text-[10px]"
              :disabled="!isEditable || index === 0"
              :title="t('panel.config.tableMoveColumnUp')"
              @click.stop="moveColumn(index, -1)"
            >
              ↑
            </Button>
            <Button
              size="small"
              type="text"
              class="!h-5 !w-5 !p-0 text-[10px]"
              :disabled="!isEditable || index >= columns.length - 1"
              :title="t('panel.config.tableMoveColumnDown')"
              @click.stop="moveColumn(index, 1)"
            >
              ↓
            </Button>
          </div>
          <div class="min-w-0 flex-1">
            <div class="truncate text-[11px] font-medium">
              {{ col.title || col.field || t('panel.config.tableColumnUntitled', { n: index + 1 }) }}
            </div>
            <div class="truncate text-[10px] text-gray-500">
              {{ col.field }} · {{ t(`panel.config.tableWidget.${col.widget ?? 'text'}`) }}
            </div>
          </div>
          <label class="flex shrink-0 items-center gap-1 text-[10px] text-gray-500" @click.stop>
            <span class="whitespace-nowrap">{{ t("panel.config.tableColumnWidth") }}</span>
            <InputNumber
              size="small"
              class="!w-16"
              :min="40"
              :max="800"
              :value="col.width"
              :disabled="!isEditable"
              @update:value="(v) => patchColumn(index, { width: typeof v === 'number' ? v : undefined })"
            />
          </label>
          <Button
            size="small"
            danger
            type="text"
            class="!px-1"
            :disabled="!isEditable"
            :title="t('panel.config.tableRemoveColumn')"
            @click.stop="removeColumn(index)"
          >
            ×
          </Button>
        </div>
      </div>

      <div v-if="selectedColumn" class="space-y-2 rounded border border-gray-200/70 bg-white p-2">
        <div class="text-[11px] font-medium text-gray-600">
          {{
            t("panel.config.groupTableColumnDetail", {
              name: selectedColumn.column.title || selectedColumn.column.field,
            })
          }}
        </div>
        <div class="grid grid-cols-2 gap-2">
          <label class="block space-y-1">
            <div class="flex items-center gap-1">
              <span>{{ t("panel.config.tableColumnField") }}</span>
              <ConfigHintIcon :label="t('panel.config.tableColumnField')">
                <div>{{ t("panel.config.tableColumnFieldHint") }}</div>
              </ConfigHintIcon>
            </div>
            <Input
              size="small"
              :value="selectedColumn.column.field"
              :disabled="!isEditable"
              @update:value="(v: unknown) => patchColumn(selectedColumn!.index, { field: asSelectString(v) })"
            />
          </label>
          <label class="block space-y-1">
            <div class="flex items-center gap-1">
              <span>{{ t("panel.config.tableColumnTitle") }}</span>
              <ConfigHintIcon :label="t('panel.config.tableColumnTitle')">
                <div>{{ t("panel.config.tableColumnTitleHint") }}</div>
              </ConfigHintIcon>
            </div>
            <Input
              size="small"
              :value="selectedColumn.column.title ?? ''"
              :disabled="!isEditable"
              @update:value="(v: unknown) => patchColumn(selectedColumn!.index, { title: asSelectString(v) })"
            />
          </label>
          <label class="block space-y-1">
            <div>{{ t("panel.config.tableColumnWidth") }}</div>
            <InputNumber
              size="small"
              class="w-full"
              :min="40"
              :value="selectedColumn.column.width"
              :disabled="!isEditable"
              @update:value="(v) => patchColumn(selectedColumn!.index, { width: typeof v === 'number' ? v : undefined })"
            />
          </label>
          <label class="block space-y-1">
            <div class="flex items-center gap-1">
              <span>{{ t("panel.config.tableColumnWidget") }}</span>
              <ConfigHintIcon :label="t('panel.config.tableColumnWidget')">
                <div>{{ t("panel.config.tableColumnWidgetHint") }}</div>
              </ConfigHintIcon>
            </div>
            <Select
              size="small"
              class="w-full"
              :value="selectedColumn.column.widget ?? 'text'"
              :disabled="!isEditable"
              @update:value="(v) => patchColumn(selectedColumn!.index, { widget: v as TableCellWidget })"
            >
              <Select.Option v-for="w in WIDGET_OPTIONS" :key="w" :value="w">
                {{ t(`panel.config.tableWidget.${w}`) }}
              </Select.Option>
            </Select>
          </label>
        </div>

        <div class="space-y-2 rounded-md border border-gray-200 bg-gray-50/70 p-2">
          <div class="flex items-center justify-between gap-2">
            <div class="inline-flex items-center gap-1 text-[11px] font-medium text-gray-600">
              <span>{{ t("panel.config.tableTooltipEnabled") }}</span>
              <ConfigHintIcon :label="t('panel.config.tableTooltipEnabled')">
                <div>{{ t("panel.config.tableTooltipEnabledHint") }}</div>
              </ConfigHintIcon>
            </div>
            <Switch
              size="small"
              :checked="Boolean(selectedColumn.column.tooltipEnabled)"
              :disabled="!isEditable"
              @update:checked="
                (v) =>
                  patchColumn(selectedColumn!.index, { tooltipEnabled: asSwitchChecked(v) || undefined })
              "
            />
          </div>
          <template v-if="selectedColumn.column.tooltipEnabled">
            <label class="block space-y-1">
              <div>{{ t("panel.config.tableTooltipPlacementLabel") }}</div>
              <Select
                size="small"
                class="w-full"
                :value="selectedColumn.column.tooltipPlacement ?? 'top'"
                :disabled="!isEditable"
                @update:value="
                  (v) =>
                    patchColumn(selectedColumn!.index, {
                      tooltipPlacement: v as TableTooltipPlacement,
                    })
                "
              >
                <Select.Option value="top">{{ t("panel.config.tableTooltipPlacement.top") }}</Select.Option>
                <Select.Option value="right">{{ t("panel.config.tableTooltipPlacement.right") }}</Select.Option>
                <Select.Option value="bottom">{{ t("panel.config.tableTooltipPlacement.bottom") }}</Select.Option>
                <Select.Option value="left">{{ t("panel.config.tableTooltipPlacement.left") }}</Select.Option>
              </Select>
            </label>
            <label class="block space-y-1">
              <div class="flex items-center gap-1">
                <span>{{ t("panel.config.tableTooltipTemplate") }}</span>
                <ConfigHintIcon :label="t('panel.config.tableTooltipTemplate')">
                  <div>{{ t("panel.config.tableTooltipTemplateHint") }}</div>
                </ConfigHintIcon>
              </div>
              <Input
                size="small"
                :value="selectedColumn.column.tooltipTemplate ?? ''"
                :disabled="!isEditable"
                placeholder="{current}"
                @update:value="
                  (v: unknown) => {
                    const s = asSelectString(v).trim();
                    patchColumn(selectedColumn!.index, {
                      tooltipTemplate: s ? s : undefined,
                    });
                  }
                "
              />
            </label>
          </template>
        </div>

        <div class="space-y-2 rounded-md border border-gray-200 bg-gray-50/70 p-2">
          <div class="inline-flex items-center gap-1 text-[11px] font-medium text-gray-600">
            {{ t("panel.config.tableWidgetProps") }}
            <ConfigHintIcon :label="t('panel.config.tableWidgetProps')">
              <div>{{ t("panel.config.tableWidgetPropsHint") }}</div>
            </ConfigHintIcon>
          </div>

          <template v-if="(selectedColumn.column.widget ?? 'text') === 'text'">
            <div class="grid grid-cols-2 gap-2">
              <label class="block space-y-1">
                <div>{{ t("panel.config.tableTextFontSize") }}</div>
                <InputNumber
                  size="small"
                  class="w-full"
                  :min="8"
                  :max="72"
                  :value="selectedColumn.column.widgetProps?.textStyle?.fontSize"
                  :disabled="!isEditable"
                  @update:value="
                    (v) =>
                      patchWidgetProps(selectedColumn!.index, {
                        textStyle: {
                          ...(selectedColumn!.column.widgetProps?.textStyle ?? {}),
                          fontSize: typeof v === 'number' ? v : undefined,
                        },
                      })
                  "
                />
              </label>
              <label class="block space-y-1">
                <div>{{ t("panel.config.tableTextFontWeight") }}</div>
                <Select
                  size="small"
                  class="w-full"
                  :value="String(selectedColumn.column.widgetProps?.textStyle?.fontWeight ?? 'normal')"
                  :disabled="!isEditable"
                  @update:value="
                    (v) => {
                      const s = asSelectString(v);
                      patchWidgetProps(selectedColumn!.index, {
                        textStyle: {
                          ...(selectedColumn!.column.widgetProps?.textStyle ?? {}),
                          fontWeight: s === 'normal' ? undefined : s,
                        },
                      });
                    }
                  "
                >
                  <Select.Option value="normal">{{ t("panel.config.tableTextWeightNormal") }}</Select.Option>
                  <Select.Option value="500">500</Select.Option>
                  <Select.Option value="600">600</Select.Option>
                  <Select.Option value="700">{{ t("panel.config.tableTextWeightBold") }}</Select.Option>
                </Select>
              </label>
              <ConfigColorField
                :label="t('panel.config.tableTextColor')"
                :value="selectedColumn.column.widgetProps?.textStyle?.color ?? '#111827'"
                :disabled="!isEditable"
                @update:value="
                  (v) =>
                    patchWidgetProps(selectedColumn!.index, {
                      textStyle: {
                        ...(selectedColumn!.column.widgetProps?.textStyle ?? {}),
                        color: v || undefined,
                      },
                    })
                "
              />
              <label class="block space-y-1">
                <div>{{ t("panel.config.tableTextFontFamily") }}</div>
                <Input
                  size="small"
                  :value="selectedColumn.column.widgetProps?.textStyle?.fontFamily ?? ''"
                  placeholder="inherit"
                  :disabled="!isEditable"
                  @update:value="
                    (v: unknown) =>
                      patchWidgetProps(selectedColumn!.index, {
                        textStyle: {
                          ...(selectedColumn!.column.widgetProps?.textStyle ?? {}),
                          fontFamily: asSelectString(v) || undefined,
                        },
                      })
                  "
                />
              </label>
              <label class="block space-y-1">
                <div>{{ t("panel.config.tableTextFontStyle") }}</div>
                <Select
                  size="small"
                  class="w-full"
                  :value="selectedColumn.column.widgetProps?.textStyle?.fontStyle ?? 'normal'"
                  :disabled="!isEditable"
                  @update:value="
                    (v) =>
                      patchWidgetProps(selectedColumn!.index, {
                        textStyle: {
                          ...(selectedColumn!.column.widgetProps?.textStyle ?? {}),
                          fontStyle: asSelectString(v) as 'normal' | 'italic',
                        },
                      })
                  "
                >
                  <Select.Option value="normal">{{ t("panel.config.tableTextStyleNormal") }}</Select.Option>
                  <Select.Option value="italic">{{ t("panel.config.tableTextStyleItalic") }}</Select.Option>
                </Select>
              </label>
              <label class="block space-y-1">
                <div>{{ t("panel.config.tableTextDecoration") }}</div>
                <Select
                  size="small"
                  class="w-full"
                  :value="selectedColumn.column.widgetProps?.textStyle?.textDecoration ?? 'none'"
                  :disabled="!isEditable"
                  @update:value="
                    (v) =>
                      patchWidgetProps(selectedColumn!.index, {
                        textStyle: {
                          ...(selectedColumn!.column.widgetProps?.textStyle ?? {}),
                          textDecoration: asSelectString(v) as 'none' | 'underline' | 'line-through',
                        },
                      })
                  "
                >
                  <Select.Option value="none">{{ t("panel.config.tableTextDecoNone") }}</Select.Option>
                  <Select.Option value="underline">{{ t("panel.config.tableTextDecoUnderline") }}</Select.Option>
                  <Select.Option value="line-through">{{ t("panel.config.tableTextDecoLineThrough") }}</Select.Option>
                </Select>
              </label>
              <label class="block space-y-1">
                <div class="inline-flex items-center gap-1">
                  {{ t("panel.config.tableTextOverflow") }}
                  <ConfigHintIcon :label="t('panel.config.tableTextOverflow')">
                    <div>{{ t("panel.config.tableTextOverflowHint") }}</div>
                  </ConfigHintIcon>
                </div>
                <Select
                  size="small"
                  class="w-full"
                  :value="selectedColumn.column.widgetProps?.textStyle?.overflow ?? 'ellipsis'"
                  :disabled="!isEditable"
                  @update:value="
                    (v: unknown) =>
                      patchWidgetProps(selectedColumn!.index, {
                        textStyle: {
                          ...(selectedColumn!.column.widgetProps?.textStyle ?? {}),
                          overflow: asSelectString(v) as 'ellipsis' | 'wrap',
                        },
                      })
                  "
                >
                  <Select.Option value="ellipsis">{{ t("panel.config.tableTextOverflowEllipsis") }}</Select.Option>
                  <Select.Option value="wrap">{{ t("panel.config.tableTextOverflowWrap") }}</Select.Option>
                </Select>
              </label>
            </div>
            <label class="block space-y-1">
              <div class="inline-flex items-center gap-1">
                {{ t("panel.config.tableActionOnClick") }}
                <ConfigHintIcon :label="t('panel.config.tableActionOnClick')">
                  <div>{{ t("panel.config.tableActionBlueprintHint") }}</div>
                </ConfigHintIcon>
              </div>
              <Select
                size="small"
                class="w-full"
                :value="blueprintSelectValue(selectedColumn.column.widgetProps?.actions?.onClickBlueprintNodeId)"
                :disabled="!isEditable"
                @update:value="(v) => onBlueprintSelect(selectedColumn!.index, 'onClickBlueprintNodeId', v)"
              >
                <Select.Option value="__none__">{{ t("panel.config.tableActionBlueprintNone") }}</Select.Option>
                <Select.Option
                  v-for="opt in blueprintNodeOptions"
                  :key="opt.id"
                  :value="opt.id"
                >
                  {{ opt.label }}
                </Select.Option>
              </Select>
            </label>
          </template>

          <template v-else-if="selectedColumn.column.widget === 'image'">
            <label class="block space-y-1">
              <div class="flex items-center gap-1">
                <span>{{ t("panel.config.tableImageUrlMode") }}</span>
                <ConfigHintIcon :label="t('panel.config.tableImageUrlMode')">
                  <div>{{ t("panel.config.tableImageUrlModeHint") }}</div>
                </ConfigHintIcon>
              </div>
              <Select
                size="small"
                class="w-full"
                :value="selectedColumn.column.widgetProps?.imageUrlMode ?? 'field'"
                :disabled="!isEditable"
                @update:value="
                  (v) =>
                    patchWidgetProps(selectedColumn!.index, {
                      imageUrlMode: v as NonNullable<TableWidgetProps['imageUrlMode']>,
                    })
                "
              >
                <Select.Option value="field">{{ t("panel.config.tableImageUrlModeField") }}</Select.Option>
                <Select.Option value="static">{{ t("panel.config.tableImageUrlModeStatic") }}</Select.Option>
                <Select.Option value="prefix">{{ t("panel.config.tableImageUrlModePrefix") }}</Select.Option>
                <Select.Option value="template">{{ t("panel.config.tableImageUrlModeTemplate") }}</Select.Option>
              </Select>
            </label>

            <label
              v-if="
                (selectedColumn.column.widgetProps?.imageUrlMode ?? 'field') === 'field' ||
                (selectedColumn.column.widgetProps?.imageUrlMode ?? 'field') === 'prefix'
              "
              class="block space-y-1"
            >
              <div>{{ t("panel.config.tableImageUrlField") }}</div>
              <Input
                size="small"
                :value="selectedColumn.column.widgetProps?.imageUrlField ?? ''"
                :placeholder="selectedColumn.column.field"
                :disabled="!isEditable"
                @update:value="
                  (v: unknown) => patchWidgetProps(selectedColumn!.index, { imageUrlField: asSelectString(v) || undefined })
                "
              />
            </label>

            <div
              v-if="(selectedColumn.column.widgetProps?.imageUrlMode ?? 'field') === 'static'"
              class="space-y-1.5"
            >
              <label class="block space-y-1">
                <div class="flex items-center gap-1">
                  <span>{{ t("panel.config.tableImageUrl") }}</span>
                  <ConfigHintIcon :label="t('panel.config.tableImageUrl')">
                    <div>{{ t("panel.config.tableImageUrlHint") }}</div>
                  </ConfigHintIcon>
                </div>
                <Input
                  size="small"
                  :value="selectedColumn.column.widgetProps?.imageUrl ?? ''"
                  placeholder="{scope?.avatar} / https://…"
                  :disabled="!isEditable"
                  @update:value="
                    (v: unknown) => patchWidgetProps(selectedColumn!.index, { imageUrl: asSelectString(v) || undefined })
                  "
                />
              </label>
              <div class="flex flex-wrap items-center gap-2">
                <label class="inline-flex cursor-pointer items-center">
                  <span
                    class="rounded border border-gray-300 bg-white px-2 py-0.5 text-[11px]"
                    :class="!isEditable ? 'opacity-50' : ''"
                  >
                    {{ t("panel.config.tableImageUpload") }}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    class="hidden"
                    :disabled="!isEditable"
                    @change="onImageFileChange(selectedColumn!.index, $event)"
                  />
                </label>
                <span v-if="imageUploadHint" class="text-[11px] text-gray-500">{{ imageUploadHint }}</span>
              </div>
            </div>

            <div
              v-if="(selectedColumn.column.widgetProps?.imageUrlMode ?? 'field') === 'prefix'"
              class="grid grid-cols-2 gap-2"
            >
              <label class="block space-y-1">
                <div>{{ t("panel.config.tableImageUrlPrefix") }}</div>
                <Input
                  size="small"
                  :value="selectedColumn.column.widgetProps?.imageUrlPrefix ?? ''"
                  placeholder="{scope?.cdn}/"
                  :disabled="!isEditable"
                  @update:value="
                    (v: unknown) =>
                      patchWidgetProps(selectedColumn!.index, { imageUrlPrefix: asSelectString(v) || undefined })
                  "
                />
              </label>
              <label class="block space-y-1">
                <div>{{ t("panel.config.tableImageUrlSuffix") }}</div>
                <Input
                  size="small"
                  :value="selectedColumn.column.widgetProps?.imageUrlSuffix ?? ''"
                  placeholder=".png"
                  :disabled="!isEditable"
                  @update:value="
                    (v: unknown) =>
                      patchWidgetProps(selectedColumn!.index, { imageUrlSuffix: asSelectString(v) || undefined })
                  "
                />
              </label>
            </div>

            <label
              v-if="(selectedColumn.column.widgetProps?.imageUrlMode ?? 'field') === 'template'"
              class="block space-y-1"
            >
              <div>{{ t("panel.config.tableImageUrlTemplate") }}</div>
              <Input
                size="small"
                :value="selectedColumn.column.widgetProps?.imageUrlTemplate ?? ''"
                placeholder="https://cdn/{row.id}.png"
                :disabled="!isEditable"
                @update:value="
                  (v: unknown) =>
                    patchWidgetProps(selectedColumn!.index, { imageUrlTemplate: asSelectString(v) || undefined })
                "
              />
            </label>

            <div class="grid grid-cols-3 gap-2">
              <label class="block space-y-1">
                <div>{{ t("panel.config.tableImageWidth") }}</div>
                <InputNumber
                  size="small"
                  class="w-full"
                  :min="12"
                  :max="240"
                  :value="selectedColumn.column.widgetProps?.imageWidth ?? 28"
                  :disabled="!isEditable"
                  @update:value="
                    (v) =>
                      patchWidgetProps(selectedColumn!.index, {
                        imageWidth: typeof v === 'number' ? v : 28,
                      })
                  "
                />
              </label>
              <label class="block space-y-1">
                <div>{{ t("panel.config.tableImageHeight") }}</div>
                <InputNumber
                  size="small"
                  class="w-full"
                  :min="12"
                  :max="240"
                  :value="selectedColumn.column.widgetProps?.imageHeight ?? 28"
                  :disabled="!isEditable"
                  @update:value="
                    (v) =>
                      patchWidgetProps(selectedColumn!.index, {
                        imageHeight: typeof v === 'number' ? v : 28,
                      })
                  "
                />
              </label>
              <label class="block space-y-1">
                <div>{{ t("panel.config.tableImageObjectFit") }}</div>
                <Select
                  size="small"
                  class="w-full"
                  :value="selectedColumn.column.widgetProps?.imageObjectFit ?? 'cover'"
                  :disabled="!isEditable"
                  @update:value="
                    (v) =>
                      patchWidgetProps(selectedColumn!.index, {
                        imageObjectFit: v as NonNullable<TableWidgetProps['imageObjectFit']>,
                      })
                  "
                >
                  <Select.Option value="cover">{{ t("panel.config.tableImageFitCover") }}</Select.Option>
                  <Select.Option value="contain">{{ t("panel.config.tableImageFitContain") }}</Select.Option>
                  <Select.Option value="fill">{{ t("panel.config.tableImageFitFill") }}</Select.Option>
                </Select>
              </label>
            </div>
          </template>

          <template v-else-if="selectedColumn.column.widget === 'link'">
            <label class="block space-y-1">
              <div>{{ t("panel.config.tableLinkHrefField") }}</div>
              <Input
                size="small"
                :value="selectedColumn.column.widgetProps?.hrefField ?? ''"
                :placeholder="selectedColumn.column.field"
                :disabled="!isEditable"
                @update:value="
                  (v: unknown) => patchWidgetProps(selectedColumn!.index, { hrefField: asSelectString(v) || undefined })
                "
              />
            </label>
            <label class="block space-y-1">
              <div>{{ t("panel.config.tableLinkHrefTemplate") }}</div>
              <Input
                size="small"
                :value="selectedColumn.column.widgetProps?.hrefTemplate ?? ''"
                placeholder="/detail/{row.id}"
                :disabled="!isEditable"
                @update:value="
                  (v: unknown) =>
                    patchWidgetProps(selectedColumn!.index, { hrefTemplate: asSelectString(v) || undefined })
                "
              />
            </label>
            <div class="space-y-1.5">
              <div class="flex items-center justify-between gap-2">
                <span class="inline-flex items-center gap-1 text-[11px] text-gray-600">
                  {{ t("panel.config.tableHrefRules") }}
                  <ConfigHintIcon :label="t('panel.config.tableHrefRules')">
                    <div>{{ t("panel.config.tableHrefRulesHint") }}</div>
                  </ConfigHintIcon>
                </span>
                <Button
                  size="small"
                  type="link"
                  :disabled="!isEditable"
                  @click="
                    patchWidgetProps(selectedColumn!.index, {
                      hrefRules: [
                        ...(selectedColumn!.column.widgetProps?.hrefRules ?? []),
                        { when: createDefaultCondition(), href: '' },
                      ],
                    })
                  "
                >
                  {{ t("panel.config.tableAddHrefRule") }}
                </Button>
              </div>
              <div
                v-for="(rule, ruleIndex) in selectedColumn.column.widgetProps?.hrefRules ?? []"
                :key="ruleIndex"
                class="space-y-1.5 rounded-md border border-gray-200 bg-gray-50/70 p-2"
              >
                <div class="flex items-center justify-between">
                  <span class="text-[11px] text-gray-500">
                    {{ t("panel.config.tableHrefRuleItem", { n: ruleIndex + 1 }) }}
                  </span>
                  <Button
                    size="small"
                    danger
                    type="text"
                    :disabled="!isEditable"
                    @click="
                      (() => {
                        const next = (selectedColumn!.column.widgetProps?.hrefRules ?? []).filter(
                          (_, i) => i !== ruleIndex
                        );
                        patchWidgetProps(selectedColumn!.index, {
                          hrefRules: next.length ? next : undefined,
                        });
                      })()
                    "
                  >
                    ×
                  </Button>
                </div>
                <ConditionEditor
                  :model-value="rule.when"
                  :show-field="false"
                  :disabled="!isEditable"
                  @update:model-value="(when) => patchHrefRuleWhen(ruleIndex, when)"
                />
                <Input
                  size="small"
                  :value="rule.href"
                  :placeholder="t('panel.config.tableHrefRuleHref')"
                  :disabled="!isEditable"
                  @update:value="
                    (v: unknown) => {
                      const next = [...(selectedColumn!.column.widgetProps?.hrefRules ?? [])];
                      next[ruleIndex] = { ...rule, href: asSelectString(v) };
                      patchWidgetProps(selectedColumn!.index, { hrefRules: next });
                    }
                  "
                />
              </div>
            </div>
            <label class="flex items-center justify-between gap-2">
              <span>{{ t("panel.config.tableLinkOpenNewTab") }}</span>
              <Switch
                size="small"
                :checked="selectedColumn.column.widgetProps?.openInNewTab !== false"
                :disabled="!isEditable"
                @update:checked="(v) => patchWidgetProps(selectedColumn!.index, { openInNewTab: asSwitchChecked(v) })"
              />
            </label>
            <label class="block space-y-1">
              <div class="inline-flex items-center gap-1">
                {{ t("panel.config.tableActionOnClick") }}
                <ConfigHintIcon :label="t('panel.config.tableActionOnClick')">
                  <div>{{ t("panel.config.tableActionBlueprintHint") }}</div>
                </ConfigHintIcon>
              </div>
              <Select
                size="small"
                class="w-full"
                :value="blueprintSelectValue(selectedColumn.column.widgetProps?.actions?.onClickBlueprintNodeId)"
                :disabled="!isEditable"
                @update:value="(v) => onBlueprintSelect(selectedColumn!.index, 'onClickBlueprintNodeId', v)"
              >
                <Select.Option value="__none__">{{ t("panel.config.tableActionBlueprintNone") }}</Select.Option>
                <Select.Option
                  v-for="opt in blueprintNodeOptions"
                  :key="opt.id"
                  :value="opt.id"
                >
                  {{ opt.label }}
                </Select.Option>
              </Select>
            </label>
          </template>

          <template v-else-if="selectedColumn.column.widget === 'progress'">
            <label class="block space-y-1">
              <div class="inline-flex items-center gap-1">
                {{ t("panel.config.tableProgressMode") }}
                <ConfigHintIcon :label="t('panel.config.tableProgressMode')">
                  <div>{{ t("panel.config.tableProgressModeHint") }}</div>
                </ConfigHintIcon>
              </div>
              <Select
                size="small"
                class="w-full"
                :value="selectedColumn.column.widgetProps?.progressMode ?? 'field'"
                :disabled="!isEditable"
                @update:value="
                  (v) =>
                    patchWidgetProps(selectedColumn!.index, {
                      progressMode: asSelectString(v) as NonNullable<TableWidgetProps['progressMode']>,
                    })
                "
              >
                <Select.Option value="field">{{ t("panel.config.tableProgressModeField") }}</Select.Option>
                <Select.Option value="static">{{ t("panel.config.tableProgressModeStatic") }}</Select.Option>
                <Select.Option value="rules">{{ t("panel.config.tableProgressModeRules") }}</Select.Option>
              </Select>
            </label>
            <label
              v-if="(selectedColumn.column.widgetProps?.progressMode ?? 'field') === 'field'"
              class="block space-y-1"
            >
              <div>{{ t("panel.config.tableProgressField") }}</div>
              <Input
                size="small"
                :value="selectedColumn.column.widgetProps?.progressField ?? ''"
                :placeholder="selectedColumn.column.field"
                :disabled="!isEditable"
                @update:value="
                  (v: unknown) =>
                    patchWidgetProps(selectedColumn!.index, { progressField: asSelectString(v) || undefined })
                "
              />
            </label>
            <label
              v-else-if="selectedColumn.column.widgetProps?.progressMode === 'static'"
              class="block space-y-1"
            >
              <div>{{ t("panel.config.tableProgressStatic") }}</div>
              <Input
                size="small"
                :value="String(selectedColumn.column.widgetProps?.progressStatic ?? '')"
                placeholder="80 或 {scope?.pct}"
                :disabled="!isEditable"
                @update:value="
                  (v: unknown) =>
                    patchWidgetProps(selectedColumn!.index, { progressStatic: asSelectString(v) || undefined })
                "
              />
            </label>
            <div
              v-else-if="selectedColumn.column.widgetProps?.progressMode === 'rules'"
              class="space-y-1.5"
            >
              <div class="flex items-center justify-between gap-2">
                <span class="text-[11px] text-gray-600">{{ t("panel.config.tableProgressRules") }}</span>
                <Button
                  size="small"
                  type="link"
                  :disabled="!isEditable"
                  @click="
                    patchWidgetProps(selectedColumn!.index, {
                      progressRules: [
                        ...(selectedColumn!.column.widgetProps?.progressRules ?? []),
                        { when: createDefaultCondition(), value: 0 },
                      ],
                    })
                  "
                >
                  {{ t("panel.config.tableAddProgressRule") }}
                </Button>
              </div>
              <div
                v-for="(rule, ruleIndex) in selectedColumn.column.widgetProps?.progressRules ?? []"
                :key="ruleIndex"
                class="space-y-1.5 rounded-md border border-gray-200 bg-gray-50/70 p-2"
              >
                <div class="flex items-center justify-between">
                  <span class="text-[11px] text-gray-500">
                    {{ t("panel.config.tableProgressRuleItem", { n: ruleIndex + 1 }) }}
                  </span>
                  <Button
                    size="small"
                    danger
                    type="text"
                    :disabled="!isEditable"
                    @click="
                      (() => {
                        const next = (selectedColumn!.column.widgetProps?.progressRules ?? []).filter(
                          (_, i) => i !== ruleIndex
                        );
                        patchWidgetProps(selectedColumn!.index, {
                          progressRules: next.length ? next : undefined,
                        });
                      })()
                    "
                  >
                    ×
                  </Button>
                </div>
                <ConditionEditor
                  :model-value="rule.when"
                  :show-field="false"
                  :disabled="!isEditable"
                  @update:model-value="(when) => patchProgressRuleWhen(ruleIndex, when)"
                />
                <Input
                  size="small"
                  :value="String(rule.value ?? '')"
                  :placeholder="t('panel.config.tableProgressRuleValue')"
                  :disabled="!isEditable"
                  @update:value="
                    (v: unknown) => {
                      const next = [...(selectedColumn!.column.widgetProps?.progressRules ?? [])];
                      const s = asSelectString(v);
                      const num = Number(s);
                      next[ruleIndex] = {
                        ...rule,
                        value: s !== '' && !Number.isNaN(num) ? num : s,
                      };
                      patchWidgetProps(selectedColumn!.index, { progressRules: next });
                    }
                  "
                />
              </div>
            </div>
            <label class="block space-y-1">
              <div class="inline-flex items-center gap-1">
                {{ t("panel.config.tableProgressDisplay") }}
                <ConfigHintIcon :label="t('panel.config.tableProgressDisplay')">
                  <div>{{ t("panel.config.tableProgressDisplayHint") }}</div>
                </ConfigHintIcon>
              </div>
              <Select
                size="small"
                class="w-full"
                :value="
                  selectedColumn.column.widgetProps?.progressDisplay ??
                  (selectedColumn.column.widgetProps?.showLabel === false ? 'bar' : 'barLabel')
                "
                :disabled="!isEditable"
                @update:value="
                  (v) =>
                    patchWidgetProps(selectedColumn!.index, {
                      progressDisplay: asSelectString(v) as NonNullable<TableWidgetProps['progressDisplay']>,
                      showLabel: undefined,
                    })
                "
              >
                <Select.Option value="barLabel">{{ t("panel.config.tableProgressDisplayBarLabel") }}</Select.Option>
                <Select.Option value="bar">{{ t("panel.config.tableProgressDisplayBar") }}</Select.Option>
                <Select.Option value="label">{{ t("panel.config.tableProgressDisplayLabel") }}</Select.Option>
                <Select.Option value="circle">{{ t("panel.config.tableProgressDisplayCircle") }}</Select.Option>
              </Select>
            </label>
            <div class="grid grid-cols-2 gap-2">
              <label class="block space-y-1">
                <div>{{ t("panel.config.tableProgressMax") }}</div>
                <InputNumber
                  size="small"
                  class="w-full"
                  :min="1"
                  :value="selectedColumn.column.widgetProps?.max ?? 100"
                  :disabled="!isEditable"
                  @update:value="
                    (v) =>
                      patchWidgetProps(selectedColumn!.index, {
                        max: typeof v === 'number' ? v : 100,
                      })
                  "
                />
              </label>
              <label
                v-if="
                  (selectedColumn.column.widgetProps?.progressDisplay ?? 'barLabel') === 'circle'
                "
                class="block space-y-1"
              >
                <div>{{ t("panel.config.tableProgressSize") }}</div>
                <InputNumber
                  size="small"
                  class="w-full"
                  :min="16"
                  :max="64"
                  :value="selectedColumn.column.widgetProps?.progressSize ?? 28"
                  :disabled="!isEditable"
                  @update:value="
                    (v) =>
                      patchWidgetProps(selectedColumn!.index, {
                        progressSize: typeof v === 'number' ? v : 28,
                      })
                  "
                />
              </label>
            </div>
          </template>

          <template
            v-else-if="
              selectedColumn.column.widget === 'tag' || selectedColumn.column.widget === 'badge'
            "
          >
            <ConfigColorField
              :label="t('panel.config.tableTagColor')"
              :value="selectedColumn.column.widgetProps?.color ?? '#3b82f6'"
              :disabled="!isEditable"
              @update:value="
                (v) => patchWidgetProps(selectedColumn!.index, { color: v || undefined })
              "
            />
            <div class="space-y-1.5">
              <div class="flex items-center justify-between gap-2">
                <span class="inline-flex items-center gap-1 text-[11px] text-gray-600">
                  {{ t("panel.config.tableColorMap") }}
                  <ConfigHintIcon :label="t('panel.config.tableColorMap')">
                    <div>{{ t("panel.config.tableColorMapHint") }}</div>
                  </ConfigHintIcon>
                </span>
                <Button
                  size="small"
                  type="link"
                  :disabled="!isEditable"
                  @click="
                    patchWidgetProps(selectedColumn!.index, {
                      colorMapEntries: [
                        ...(selectedColumn!.column.widgetProps?.colorMapEntries ?? []),
                        { value: '', color: '#3b82f6' },
                      ],
                    })
                  "
                >
                  {{ t("panel.config.tableAddColorMap") }}
                </Button>
              </div>
              <div
                v-for="(entry, entryIndex) in selectedColumn.column.widgetProps?.colorMapEntries ?? []"
                :key="entryIndex"
                class="grid grid-cols-[1fr_1fr_auto] items-end gap-1.5 rounded-md border border-gray-200 bg-gray-50/70 p-2"
              >
                <label class="block space-y-1">
                  <div class="text-[11px]">{{ t("panel.config.tableColorMapValue") }}</div>
                  <Input
                    size="small"
                    :value="entry.value"
                    placeholder="ok"
                    :disabled="!isEditable"
                    @update:value="
                      (v: unknown) => {
                        const next = [
                          ...(selectedColumn!.column.widgetProps?.colorMapEntries ?? []),
                        ];
                        next[entryIndex] = { ...entry, value: asSelectString(v) };
                        patchWidgetProps(selectedColumn!.index, { colorMapEntries: next });
                      }
                    "
                  />
                </label>
                <ConfigColorField
                  :label="t('panel.config.tableColorMapColor')"
                  :value="entry.color"
                  :disabled="!isEditable"
                  @update:value="
                    (v) => {
                      const next = [...(selectedColumn!.column.widgetProps?.colorMapEntries ?? [])];
                      next[entryIndex] = { ...entry, color: v || '#3b82f6' };
                      patchWidgetProps(selectedColumn!.index, { colorMapEntries: next });
                    }
                  "
                />
                <Button
                  size="small"
                  danger
                  type="text"
                  :disabled="!isEditable"
                  @click="
                    (() => {
                      const next = (selectedColumn!.column.widgetProps?.colorMapEntries ?? []).filter(
                        (_, i) => i !== entryIndex
                      );
                      patchWidgetProps(selectedColumn!.index, {
                        colorMapEntries: next.length ? next : undefined,
                      });
                    })()
                  "
                >
                  ×
                </Button>
              </div>
            </div>
          </template>

          <template v-else-if="selectedColumn.column.widget === 'boolean'">
            <div class="grid grid-cols-2 gap-2">
              <label class="block space-y-1">
                <div>{{ t("panel.config.tableBooleanTrueLabel") }}</div>
                <Input
                  size="small"
                  :value="selectedColumn.column.widgetProps?.trueLabel ?? ''"
                  :disabled="!isEditable"
                  @update:value="
                    (v: unknown) =>
                      patchWidgetProps(selectedColumn!.index, { trueLabel: asSelectString(v) || undefined })
                  "
                />
              </label>
              <label class="block space-y-1">
                <div>{{ t("panel.config.tableBooleanFalseLabel") }}</div>
                <Input
                  size="small"
                  :value="selectedColumn.column.widgetProps?.falseLabel ?? ''"
                  :disabled="!isEditable"
                  @update:value="
                    (v: unknown) =>
                      patchWidgetProps(selectedColumn!.index, { falseLabel: asSelectString(v) || undefined })
                  "
                />
              </label>
            </div>
            <label class="block space-y-1">
              <div class="inline-flex items-center gap-1">
                {{ t("panel.config.tableActionOnTrue") }}
                <ConfigHintIcon :label="t('panel.config.tableActionOnTrue')">
                  <div>{{ t("panel.config.tableActionBlueprintHint") }}</div>
                </ConfigHintIcon>
              </div>
              <Select
                size="small"
                class="w-full"
                :value="blueprintSelectValue(selectedColumn.column.widgetProps?.actions?.onTrueBlueprintNodeId)"
                :disabled="!isEditable"
                @update:value="(v) => onBlueprintSelect(selectedColumn!.index, 'onTrueBlueprintNodeId', v)"
              >
                <Select.Option value="__none__">{{ t("panel.config.tableActionBlueprintNone") }}</Select.Option>
                <Select.Option
                  v-for="opt in blueprintNodeOptions"
                  :key="opt.id"
                  :value="opt.id"
                >
                  {{ opt.label }}
                </Select.Option>
              </Select>
            </label>
            <label class="block space-y-1">
              <div class="inline-flex items-center gap-1">
                {{ t("panel.config.tableActionOnFalse") }}
                <ConfigHintIcon :label="t('panel.config.tableActionOnFalse')">
                  <div>{{ t("panel.config.tableActionBlueprintHint") }}</div>
                </ConfigHintIcon>
              </div>
              <Select
                size="small"
                class="w-full"
                :value="blueprintSelectValue(selectedColumn.column.widgetProps?.actions?.onFalseBlueprintNodeId)"
                :disabled="!isEditable"
                @update:value="(v) => onBlueprintSelect(selectedColumn!.index, 'onFalseBlueprintNodeId', v)"
              >
                <Select.Option value="__none__">{{ t("panel.config.tableActionBlueprintNone") }}</Select.Option>
                <Select.Option
                  v-for="opt in blueprintNodeOptions"
                  :key="opt.id"
                  :value="opt.id"
                >
                  {{ opt.label }}
                </Select.Option>
              </Select>
            </label>
          </template>
        </div>

        <div class="space-y-1.5 border-t border-gray-100 pt-2">
          <div class="flex items-center justify-between">
            <span class="inline-flex items-center gap-1 font-medium text-gray-600">
              {{ t("panel.config.tableValueMap") }}
              <ConfigHintIcon :label="t('panel.config.tableValueMap')">
                <div>
                  {{
                    selectedColumn.column.widget === "boolean"
                      ? t("panel.config.tableValueMapBooleanHint")
                      : t("panel.config.tableValueMapHint")
                  }}
                </div>
              </ConfigHintIcon>
            </span>
            <Button size="small" type="link" :disabled="!isEditable" @click="addValueMapRule(selectedColumn.index)">
              {{ t("panel.config.tableAddValueMap") }}
            </Button>
          </div>
          <div
            v-if="selectedColumn.column.widget === 'boolean' && booleanValueMapConflicts.length"
            class="rounded-md border border-amber-300 bg-amber-50 px-2 py-1.5 text-[11px] text-amber-800"
          >
            <div v-for="conflict in booleanValueMapConflicts" :key="conflict.key">
              {{
                t("panel.config.tableValueMapBooleanConflict", {
                  indexes: conflict.ruleIndexes.join(", "),
                })
              }}
            </div>
          </div>
          <div
            v-for="(rule, ruleIndex) in selectedColumn.column.valueMap ?? []"
            :key="ruleIndex"
            class="space-y-2 rounded-md border border-gray-200 bg-gray-50/70 p-2"
          >
            <div class="flex items-center justify-between gap-2">
              <div class="text-[11px] font-medium text-gray-500">
                {{ t("panel.config.tableMapItem", { n: ruleIndex + 1 }) }}
              </div>
              <Button
                size="small"
                danger
                type="text"
                :disabled="!isEditable"
                @click="removeValueMapRule(selectedColumn!.index, ruleIndex)"
              >
                ×
              </Button>
            </div>
            <ConditionEditor
              :model-value="rule.when"
              :show-field="false"
              :disabled="!isEditable"
              @update:model-value="(when) => patchValueMapRule(selectedColumn!.index, ruleIndex, { when })"
            />
            <Select
              v-if="selectedColumn.column.widget === 'boolean'"
              size="small"
              class="w-full"
              :value="booleanMapSelectValue(rule.value)"
              :disabled="!isEditable"
              @update:value="
                (v) =>
                  patchValueMapRule(selectedColumn!.index, ruleIndex, {
                    value: String(v) === 'true',
                  })
              "
            >
              <Select.Option value="true">{{ t("panel.config.tableBooleanYes") }}</Select.Option>
              <Select.Option value="false">{{ t("panel.config.tableBooleanNo") }}</Select.Option>
            </Select>
            <Input
              v-else
              size="small"
              :value="String(rule.value ?? '')"
              placeholder="{current}"
              :disabled="!isEditable"
              @update:value="(v: unknown) => patchValueMapRule(selectedColumn!.index, ruleIndex, { value: asSelectString(v) })"
            />
          </div>
          <label class="block space-y-1">
            <div class="flex items-center gap-1">
              <span>{{ t("panel.config.tableDisplayTemplate") }}</span>
              <ConfigHintIcon :label="t('panel.config.tableDisplayTemplate')">
                <div>{{ t("panel.config.tableDisplayTemplateHint") }}</div>
              </ConfigHintIcon>
            </div>
            <Input
              size="small"
              :value="selectedColumn.column.displayTemplate ?? ''"
              :disabled="!isEditable"
              placeholder="{current}分"
              @update:value="
                (v: unknown) => {
                  const s = asSelectString(v).trim();
                  patchColumn(selectedColumn!.index, {
                    displayTemplate: s ? s : undefined,
                  });
                }
              "
            />
          </label>
        </div>

        <div class="space-y-1.5 border-t border-gray-100 pt-2">
          <div class="flex items-center justify-between">
            <span class="inline-flex items-center gap-1 font-medium text-gray-600">
              {{ t("panel.config.tableCellStyleRules") }}
              <ConfigHintIcon :label="t('panel.config.tableCellStyleRules')">
                <div>{{ t("panel.config.tableCellStyleRulesHint") }}</div>
              </ConfigHintIcon>
            </span>
            <Button size="small" type="link" :disabled="!isEditable" @click="addCellStyleRule(selectedColumn.index)">
              {{ t("panel.config.tableAddCellStyleRule") }}
            </Button>
          </div>
          <div
            v-for="(rule, ruleIndex) in selectedColumn.column.cellStyleRules ?? []"
            :key="ruleIndex"
            class="space-y-2 rounded-md border border-gray-200 bg-gray-50/70 p-2"
          >
            <div class="flex items-center justify-between gap-2">
              <div class="text-[11px] font-medium text-gray-500">
                {{ t("panel.config.tableStyleRuleItem", { n: ruleIndex + 1 }) }}
              </div>
              <Button
                size="small"
                danger
                type="text"
                :disabled="!isEditable"
                @click="removeCellStyleRule(selectedColumn!.index, ruleIndex)"
              >
                ×
              </Button>
            </div>
            <ConditionEditor
              :model-value="rule.when"
              :show-field="true"
              :disabled="!isEditable"
              @update:model-value="(when) => patchCellStyleRule(selectedColumn!.index, ruleIndex, { when })"
            />
            <ConfigColorField
              :label="t('panel.config.tableBgColor')"
              :value="(rule.style.backgroundColor as string) ?? '#fef3c7'"
              :disabled="!isEditable"
              @update:value="(v) => patchCellStyleRule(selectedColumn!.index, ruleIndex, { backgroundColor: v || '#fef3c7' })"
            />
          </div>
        </div>
      </div>
    </ConfigFieldGroup>

<ConfigFieldGroup :title="t('panel.config.groupTableAppearance')">
      <template #hint>{{ t("panel.config.groupTableAppearanceHint") }}</template>
      <label class="flex items-center justify-between gap-2">
        <span>{{ t("panel.config.tableShowHeader") }}</span>
        <Switch
          size="small"
          :checked="table.showHeader !== false"
          :disabled="!isEditable"
          @update:checked="(v) => updateTable({ showHeader: asSwitchChecked(v) })"
        />
      </label>
      <label class="flex items-center justify-between gap-2">
        <span class="inline-flex items-center gap-1">
          {{ t("panel.config.tableStripe") }}
          <ConfigHintIcon :label="t('panel.config.tableStripe')">
            <div>{{ t("panel.config.tableStripeHint") }}</div>
          </ConfigHintIcon>
        </span>
        <Switch
          size="small"
          :checked="Boolean(table.stripe ?? table.tableStyle?.stripe)"
          :disabled="!isEditable"
          @update:checked="(v) => updateTable({ stripe: asSwitchChecked(v) })"
        />
      </label>
      <label class="block space-y-1.5">
        <div class="flex items-center gap-1">
          <span>{{ t("panel.config.tableRowHeight") }}</span>
          <ConfigHintIcon :label="t('panel.config.tableRowHeight')">
            <div>{{ t("panel.config.tableRowHeightHint") }}</div>
          </ConfigHintIcon>
        </div>
        <InputNumber
          size="small"
          class="w-full"
          :min="24"
          :max="120"
          :value="table.rowHeight ?? 36"
          :disabled="!isEditable"
          @update:value="(v) => updateTable({ rowHeight: typeof v === 'number' ? v : 36 })"
        />
      </label>
      <label class="block space-y-1.5">
        <div>{{ t("panel.config.tableEmpty") }}</div>
        <Input
          size="small"
          :value="table.emptyText ?? ''"
          :disabled="!isEditable"
          @update:value="(v: unknown) => updateTable({ emptyText: asSelectString(v) })"
        />
      </label>
      <div class="grid grid-cols-2 gap-2">
        <ConfigColorField
          :label="t('panel.config.tableHeaderBg')"
          :value="(table.headerStyle?.backgroundColor as string) ?? 'rgba(0,0,0,0.04)'"
          :disabled="!isEditable"
          @update:value="(v) => updateHeaderStyle({ backgroundColor: v || 'rgba(0,0,0,0.04)' })"
        />
        <label class="block space-y-1.5">
          <div>{{ t("panel.config.tableHeaderFontSize") }}</div>
          <InputNumber
            size="small"
            class="w-full"
            :min="10"
            :max="24"
            :value="table.headerStyle?.fontSize ?? 12"
            :disabled="!isEditable"
            @update:value="(v) => updateHeaderStyle({ fontSize: typeof v === 'number' ? v : 12 })"
          />
        </label>
        <ConfigColorField
          :label="t('panel.config.tableStyleColor')"
          :value="(table.tableStyle?.color as string) ?? '#111827'"
          :disabled="!isEditable"
          @update:value="(v) => updateTableStyle({ color: v || '#111827' })"
        />
        <label class="block space-y-1.5">
          <div>{{ t("panel.config.tableStyleFontSize") }}</div>
          <InputNumber
            size="small"
            class="w-full"
            :min="10"
            :max="24"
            :value="table.tableStyle?.fontSize ?? 12"
            :disabled="!isEditable"
            @update:value="(v) => updateTableStyle({ fontSize: typeof v === 'number' ? v : 12 })"
          />
        </label>
      </div>
    </ConfigFieldGroup>

<ConfigFieldGroup :title="t('panel.config.tableRowStyleRules')">
      <template #hint>{{ t("panel.config.tableRowStyleRulesHint") }}</template>
      <div class="flex justify-end">
        <Button size="small" type="dashed" :disabled="!isEditable" @click="addRowStyleRule">
          {{ t("panel.config.tableAddRowStyleRule") }}
        </Button>
      </div>
      <div v-if="!(table.rowStyleRules ?? []).length" class="text-[11px] text-gray-500">
        {{ t("panel.config.tableNoRowStyleRules") }}
      </div>
      <div
        v-for="(rule, ruleIndex) in table.rowStyleRules ?? []"
        :key="ruleIndex"
        class="space-y-2 rounded-md border border-gray-200 bg-gray-50/70 p-2"
      >
        <div class="flex items-center justify-between gap-2">
          <div class="text-[11px] font-medium text-gray-500">
            {{ t("panel.config.tableStyleRuleItem", { n: ruleIndex + 1 }) }}
          </div>
          <Button size="small" danger type="text" :disabled="!isEditable" @click="removeRowStyleRule(ruleIndex)">
            ×
          </Button>
        </div>
        <ConditionEditor
          :model-value="rule.when"
          :show-field="true"
          :disabled="!isEditable"
          @update:model-value="(when) => patchRowStyleRule(ruleIndex, { when })"
        />
        <ConfigColorField
          :label="t('panel.config.tableBgColor')"
          :value="(rule.style.backgroundColor as string) ?? '#eff6ff'"
          :disabled="!isEditable"
          @update:value="(v) => patchRowStyleRule(ruleIndex, { backgroundColor: v || '#eff6ff' })"
        />
      </div>
    </ConfigFieldGroup>

  </ConfigSection>

  <Modal
    v-model:open="rowsEditorOpen"
    :title="t('panel.config.tableRowsEditTitle')"
    :ok-text="t('common.save')"
    :cancel-text="t('common.cancel')"
    width="640px"
    :styles="{
      body: {
        height: '480px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        padding: '8px',
      },
    }"
    @ok="saveRowsEditor"
  >
    <div class="mb-1.5 shrink-0 text-xs leading-4 text-gray-500">
      {{ t("panel.config.tableRowsEditDesc") }}
    </div>
    <div class="relative min-h-0 flex-1 overflow-hidden">
      <div class="absolute inset-0">
        <JsonCodeEditor v-model="rowsEditorDraft" class="h-full" />
      </div>
    </div>
  </Modal>

  <Modal
    v-model:open="mockOpen"
    :title="t('panel.config.tableRowsMockTitle')"
    :ok-text="t('panel.config.tableMockGenerate')"
    :cancel-text="t('common.cancel')"
    width="560px"
    @ok="applyMockRows"
  >
    <div class="mb-3 text-xs text-gray-500">{{ t("panel.config.tableRowsMockDesc") }}</div>
    <div class="grid grid-cols-2 gap-2">
      <label class="block space-y-1">
        <div class="text-[11px]">{{ t("panel.config.tableMockRowCount") }}</div>
        <InputNumber v-model:value="mockRowCount" class="w-full" :min="1" :max="200" />
      </label>
      <label class="block space-y-1">
        <div class="text-[11px]">{{ t("panel.config.tableMockLocale") }}</div>
        <Select v-model:value="mockLocale" class="w-full" size="small">
          <Select.Option value="zh">{{ t("panel.config.tableMockLocaleZh") }}</Select.Option>
          <Select.Option value="en">{{ t("panel.config.tableMockLocaleEn") }}</Select.Option>
        </Select>
      </label>
      <label class="block space-y-1">
        <div class="text-[11px]">{{ t("panel.config.tableMockNamePrefix") }}</div>
        <Input v-model:value="mockNamePrefix" size="small" placeholder="Demo" />
      </label>
      <label class="block space-y-1">
        <div class="text-[11px]">{{ t("panel.config.tableMockSeed") }}</div>
        <Input v-model:value="mockSeed" size="small" placeholder="optional" />
      </label>
      <label class="col-span-2 block space-y-1">
        <div class="text-[11px]">{{ t("panel.config.tableMockStatusValues") }}</div>
        <Input v-model:value="mockStatusValues" size="small" placeholder="active,idle,pending" />
      </label>
      <label class="block space-y-1">
        <div class="text-[11px]">{{ t("panel.config.tableMockScoreMin") }}</div>
        <InputNumber v-model:value="mockScoreMin" class="w-full" />
      </label>
      <label class="block space-y-1">
        <div class="text-[11px]">{{ t("panel.config.tableMockScoreMax") }}</div>
        <InputNumber v-model:value="mockScoreMax" class="w-full" />
      </label>
    </div>
    <div class="mt-3 flex flex-wrap gap-x-4 gap-y-2">
      <label class="inline-flex items-center gap-2 text-[11px]">
        <Switch v-model:checked="mockIncludeId" size="small" />
        <span>{{ t("panel.config.tableMockIncludeId") }}</span>
      </label>
      <label class="inline-flex items-center gap-2 text-[11px]">
        <Switch v-model:checked="mockIncludeTimestamp" size="small" />
        <span>{{ t("panel.config.tableMockIncludeTimestamp") }}</span>
      </label>
      <label class="inline-flex items-center gap-2 text-[11px]">
        <Switch v-model:checked="mockIncludeExtras" size="small" />
        <span>{{ t("panel.config.tableMockIncludeExtras") }}</span>
      </label>
    </div>
  </Modal>
</template>
