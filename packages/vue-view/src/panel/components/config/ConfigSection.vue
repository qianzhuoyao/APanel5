<script setup lang="ts">
import { computed } from "vue";
import ConfigHintIcon from "../ConfigHintIcon.vue";

const props = withDefaults(
  defineProps<{
    title: string;
    open: boolean;
    forceOpen?: boolean;
  }>(),
  { forceOpen: false }
);

const emit = defineEmits<{
  "update:open": [value: boolean];
}>();

const isOpen = computed(() => props.forceOpen || props.open);

function toggle() {
  if (props.forceOpen) return;
  emit("update:open", !props.open);
}
</script>

<template>
  <div class="rounded-xl border border-gray-200/80 bg-white shadow-sm">
    <div class="flex items-center gap-1.5 px-3 py-2">
      <button
        type="button"
        class="flex h-6 w-6 items-center justify-center rounded-md text-xs hover:bg-gray-100"
        @click="toggle"
      >
        {{ isOpen ? "▾" : "▸" }}
      </button>
      <div class="flex min-w-0 flex-1 items-center gap-1">
        <div class="text-[11px] font-semibold tracking-wide text-gray-500">{{ title }}</div>
        <ConfigHintIcon v-if="$slots.hint" :label="title">
          <slot name="hint" />
        </ConfigHintIcon>
      </div>
    </div>
    <div
      v-show="isOpen"
      class="space-y-3 border-t border-gray-200/60 bg-gray-50/50 px-3 pb-3 pt-2.5"
    >
      <slot />
    </div>
  </div>
</template>
