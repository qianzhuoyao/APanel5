<script setup lang="ts">
import { useI18n } from "@arronqzy/i18n/vue";
import { computed } from "vue";
import { Input, Switch } from "ant-design-vue";
import { isCssTransparent } from "@arronqzy/view-table";

const { t } = useI18n();
const props = withDefaults(
  defineProps<{
    label: string;
    value: string;
    disabled?: boolean;
    allowTransparent?: boolean;
    fallbackHex?: string;
  }>(),
  { allowTransparent: false, fallbackHex: "#ffffff" }
);

const emit = defineEmits<{
  "update:value": [value: string];
}>();

const transparent = computed(
  () => props.allowTransparent && isCssTransparent(props.value)
);

const pickerValue = computed(() =>
  /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(props.value || "")
    ? props.value
    : props.fallbackHex.startsWith("#")
      ? props.fallbackHex
      : "#000000"
);

function onTextChange(v: string) {
  emit("update:value", v);
}

function onColorInput(e: Event) {
  const target = e.target as HTMLInputElement;
  emit("update:value", target.value);
}

function onTransparentChange(v: unknown) {
  emit("update:value", v === true ? "transparent" : props.fallbackHex);
}
</script>

<template>
  <label class="block space-y-1.5">
    <div class="text-[11px] text-gray-500">{{ label }}</div>
    <div v-if="allowTransparent" class="flex items-center gap-2">
      <Switch size="small" :checked="transparent" :disabled="disabled" @update:checked="onTransparentChange" />
      <span class="text-[11px] text-gray-600">{{ t("panel.config.tableBgTransparent") }}</span>
    </div>
    <div v-if="transparent" class="text-[10px] text-gray-500">
      {{ t("panel.config.tableBgTransparentHint") }}
    </div>
    <div v-else class="flex items-center gap-2">
      <Input
        size="small"
        :value="value"
        :disabled="disabled"
        placeholder="#000000"
        @update:value="onTextChange"
      />
      <input
        type="color"
        class="h-7 w-10 shrink-0 cursor-pointer rounded border border-gray-200 p-0.5"
        :value="pickerValue"
        :disabled="disabled"
        :aria-label="t('common.colorPickerAria', { label })"
        @input="onColorInput"
      />
    </div>
  </label>
</template>

