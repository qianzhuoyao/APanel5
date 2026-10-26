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
  <div class="rounded-lg border border-border/60 bg-card/90 shadow-[0_1px_1px_hsl(var(--foreground)/0.03)]">
    <div class="flex items-center gap-1 px-2 py-1.5">
      <button
        type="button"
        class="flex h-5 w-5 items-center justify-center rounded text-xs hover:bg-accent"
        @click="toggle"
      >
        {{ isOpen ? "▾" : "▸" }}
      </button>
      <div class="flex min-w-0 flex-1 items-center gap-1">
        <div class="text-[11px] font-semibold tracking-wide text-muted-foreground">{{ title }}</div>
        <ConfigHintIcon v-if="$slots.hint" :label="title">
          <slot name="hint" />
        </ConfigHintIcon>
      </div>
    </div>
    <div
      v-show="isOpen"
      class="space-y-2 border-t border-border/50 bg-muted/[0.08] px-2 pb-2 pt-1.5"
    >
      <slot />
    </div>
  </div>
</template>
