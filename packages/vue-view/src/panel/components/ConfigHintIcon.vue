<script setup lang="ts">
import { Tooltip } from "ant-design-vue";

withDefaults(
  defineProps<{
    label?: string;
    contentClass?: string;
    buttonClass?: string;
  }>(),
  { label: "说明" }
);
</script>

<template>
  <Tooltip
    placement="top"
    :overlay-class-name="`z-[10120] max-w-[360px] text-[11px] leading-5 ${contentClass ?? ''}`"
    :mouse-enter-delay="0.12"
  >
    <template #title>
      <slot />
    </template>
    <button
      type="button"
      :class="
        buttonClass ??
        'inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-border text-[10px] leading-none text-muted-foreground hover:bg-accent/50'
      "
      :aria-label="`${label}说明`"
    >
      ?
    </button>
  </Tooltip>
</template>
