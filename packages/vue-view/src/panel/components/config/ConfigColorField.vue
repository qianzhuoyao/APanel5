<script setup lang="ts">
import { useI18n } from "@arronqzy/i18n/vue";
import { computed } from "vue";
import { Input } from "ant-design-vue";

const { t, locale } = useI18n();
const props = defineProps<{
  label: string;
  value: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  "update:value": [value: string];
}>();

const pickerValue = computed(() =>
  /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(props.value || "")
    ? props.value
    : "#000000"
);

function onTextChange(v: string) {
  emit("update:value", v);
}

function onColorInput(e: Event) {
  const target = e.target as HTMLInputElement;
  emit("update:value", target.value);
}
</script>

<template>
  <label class="block space-y-1.5">
    <div class="text-[11px] text-gray-500">{{ label }}</div>
    <div class="flex items-center gap-2">
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
