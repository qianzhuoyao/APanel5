<script setup lang="ts">
import { computed, inject, ref, type ComputedRef } from "vue";
import ConfigHintIcon from "../ConfigHintIcon.vue";

const props = withDefaults(
  defineProps<{
    title: string;
    hint?: boolean;
    collapsible?: boolean;
    defaultOpen?: boolean;
  }>(),
  { defaultOpen: true, collapsible: false }
);

const hasSearch = inject<ComputedRef<boolean>>(
  "configHasSearch",
  computed(() => false)
);

const open = ref(props.defaultOpen);
const isOpen = computed(() => !props.collapsible || hasSearch.value || open.value);

function toggle() {
  if (!props.collapsible || hasSearch.value) return;
  open.value = !open.value;
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
