<script setup lang="ts">
import { useI18n } from "@arronqzy/i18n/vue";
import { computed } from "vue";
import { Select } from "ant-design-vue";

const { t } = useI18n();

export type ViewElementMultiSelectOption = {
  id: string;
  label: string;
};

const props = withDefaults(
  defineProps<{
    options: ViewElementMultiSelectOption[];
    value: string[];
    placeholder?: string;
    disabled?: boolean;
  }>(),
  {
    placeholder: undefined,
    disabled: false,
  }
);

const emit = defineEmits<{
  change: [next: string[]];
}>();

const selectOptions = computed(() =>
  props.options.map((opt) => ({ value: opt.id, label: opt.label }))
);

const emptyOptions = computed(() => props.options.length === 0);
</script>

<template>
  <Select
    mode="multiple"
    show-search
    :value="value"
    :disabled="disabled || emptyOptions"
    :placeholder="emptyOptions ? t('blueprint.config.noViewOnCanvas') : (placeholder ?? t('blueprint.config.selectViewNode'))"
    :options="selectOptions"
    :filter-option="
      (input, option) =>
        (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
    "
    class="w-full"
    size="small"
    @change="(next) => emit('change', next as string[])"
  />
</template>
