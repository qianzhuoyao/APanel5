<script setup lang="ts">
import { computed, inject, ref, type ComputedRef } from "vue";
import ConfigHintIcon from "../ConfigHintIcon.vue";

export type ConfigExpandState = {
  isExpanded: (key: string, defaultValue?: boolean) => boolean;
  setExpanded: (key: string, next: boolean) => void;
};

const props = withDefaults(
  defineProps<{
    title: string;
    hint?: boolean;
    collapsible?: boolean;
    defaultOpen?: boolean;
    /** Stable key for remembering expand state per view node */
    groupKey?: string;
  }>(),
  { defaultOpen: true, collapsible: false }
);

const hasSearch = inject<ComputedRef<boolean>>(
  "configHasSearch",
  computed(() => false)
);
const expandState = inject<ConfigExpandState | null>("configExpandState", null);

const localOpen = ref(props.defaultOpen);
const storageKey = computed(
  () => props.groupKey?.trim() || `fg:${props.title}`
);

const isOpen = computed(() => {
  if (!props.collapsible) return true;
  if (hasSearch.value) return true;
  if (expandState) {
    return expandState.isExpanded(storageKey.value, props.defaultOpen);
  }
  return localOpen.value;
});

function toggle() {
  if (!props.collapsible || hasSearch.value) return;
  const next = !isOpen.value;
  if (expandState) {
    expandState.setExpanded(storageKey.value, next);
    return;
  }
  localOpen.value = next;
}
</script>

<template>
  <div class="space-y-2.5 rounded-lg border border-gray-200/80 bg-white/80 p-2.5">
    <div class="flex items-center gap-1.5">
      <button
        v-if="collapsible"
        type="button"
        class="flex h-5 w-5 items-center justify-center rounded text-[11px] hover:bg-gray-100"
        @click="toggle"
      >
        {{ isOpen ? "▾" : "▸" }}
      </button>
      <div class="text-[11px] font-semibold text-gray-500">{{ title }}</div>
      <ConfigHintIcon v-if="$slots.hint" :label="title">
        <slot name="hint" />
      </ConfigHintIcon>
    </div>
    <div v-show="isOpen" class="space-y-2.5">
      <slot />
    </div>
  </div>
</template>
