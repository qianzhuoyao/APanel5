<script setup lang="ts">
import type { Condition, ConditionLeaf, ConditionOp } from "@arronqzy/view-table";
import {
  addConditionItem,
  getConditionLogic,
  isConditionLeaf,
  listConditionItems,
  removeConditionItem,
  setConditionLogic,
  updateConditionLeaf,
  type ConditionLogic,
} from "@arronqzy/view-table";
import { useI18n } from "@arronqzy/i18n/vue";
import { Button, Input, Select } from "ant-design-vue";
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue?: Condition;
    showField?: boolean;
    disabled?: boolean;
  }>(),
  { showField: false, disabled: false }
);

const emit = defineEmits<{
  "update:modelValue": [value: Condition];
}>();

const { t } = useI18n();

const CONDITION_OPS: ConditionOp[] = [
  "eq",
  "neq",
  "gt",
  "gte",
  "lt",
  "lte",
  "contains",
  "startsWith",
  "endsWith",
  "in",
  "empty",
  "notEmpty",
  "regex",
  "truthy",
  "falsy",
];

const logic = computed(() => getConditionLogic(props.modelValue));
const items = computed(() => listConditionItems(props.modelValue));

function opLabel(op: ConditionOp) {
  return t(`panel.config.tableOp.${op}`);
}

function leafOf(item: Condition): ConditionLeaf {
  return isConditionLeaf(item) ? item : { op: "eq", value: "" };
}

function leafValueText(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  try {
    return JSON.stringify(value);
  } catch {
    return "";
  }
}

function parseLeafValue(text: string): unknown {
  const trimmed = text.trim();
  if (trimmed === "") return "";
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
  return text;
}

function setLogic(v: string) {
  emit("update:modelValue", setConditionLogic(props.modelValue, v as ConditionLogic));
}

function patchLeaf(index: number, patch: Partial<ConditionLeaf>) {
  emit("update:modelValue", updateConditionLeaf(props.modelValue, index, patch));
}
</script>

<template>
  <div class="space-y-2">
    <div class="flex items-center justify-between gap-2">
      <label class="min-w-0 flex-1 space-y-1">
        <div class="text-[11px] text-gray-500">{{ t("panel.config.tableConditionLogic") }}</div>
        <Select
          size="small"
          class="w-full"
          :value="logic"
          :disabled="disabled"
          @update:value="(v) => setLogic(String(v))"
        >
          <Select.Option value="and">{{ t("panel.config.tableConditionLogicAnd") }}</Select.Option>
          <Select.Option value="or">{{ t("panel.config.tableConditionLogicOr") }}</Select.Option>
          <Select.Option value="not">{{ t("panel.config.tableConditionLogicNot") }}</Select.Option>
        </Select>
      </label>
      <Button
        size="small"
        class="mt-4"
        :disabled="disabled"
        @click="emit('update:modelValue', addConditionItem(modelValue))"
      >
        {{ t("panel.config.tableConditionAddItem") }}
      </Button>
    </div>
    <div class="text-[10px] text-gray-500">{{ t("panel.config.tableConditionLogicHint") }}</div>
    <div
      v-for="(item, index) in items"
      :key="index"
      class="space-y-1.5 rounded-md border border-gray-200 bg-white/70 p-2"
    >
      <div class="flex items-center justify-between gap-2">
        <div class="text-[10px] font-medium text-gray-500">
          {{ t("panel.config.tableConditionItem", { n: index + 1 }) }}
        </div>
        <Button
          size="small"
          danger
          type="text"
          :disabled="disabled || items.length <= 1"
          @click="emit('update:modelValue', removeConditionItem(modelValue, index))"
        >
          ×
        </Button>
      </div>
      <div
        class="grid grid-cols-1 gap-1.5"
        :class="showField ? 'sm:grid-cols-3' : 'sm:grid-cols-2'"
      >
        <label class="block space-y-1">
          <div class="text-[11px] text-gray-500">{{ t("panel.config.tableConditionOp") }}</div>
          <Select
            size="small"
            class="w-full"
            :value="leafOf(item).op"
            :disabled="disabled"
            @update:value="(v) => patchLeaf(index, { op: String(v) as ConditionOp })"
          >
            <Select.Option v-for="op in CONDITION_OPS" :key="op" :value="op">
              {{ opLabel(op) }}
            </Select.Option>
          </Select>
        </label>
        <label v-if="showField" class="block space-y-1">
          <div class="text-[11px] text-gray-500">{{ t("panel.config.tableConditionField") }}</div>
          <Input
            size="small"
            :value="leafOf(item).field ?? ''"
            :disabled="disabled"
            :placeholder="t('panel.config.tableConditionFieldPlaceholder')"
            @update:value="(v: string) => patchLeaf(index, { field: v || undefined })"
          />
        </label>
        <label
          v-if="!['empty', 'notEmpty', 'truthy', 'falsy'].includes(leafOf(item).op)"
          class="block space-y-1"
        >
          <div class="text-[11px] text-gray-500">{{ t("panel.config.tableConditionValue") }}</div>
          <Input
            size="small"
            :value="leafValueText(leafOf(item).value)"
            :disabled="disabled"
            :placeholder="t('panel.config.tableConditionValuePlaceholder')"
            @update:value="(v: string) => patchLeaf(index, { value: parseLeafValue(v) })"
          />
        </label>
      </div>
    </div>
  </div>
</template>
