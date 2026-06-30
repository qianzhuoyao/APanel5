<script setup lang="ts">
import ConfigHintIcon from "../ConfigHintIcon.vue";

defineProps<{
  title: string;
  hint?: boolean;
}>();
</script>

<template>
  <div class="space-y-2.5 rounded-lg border border-gray-200/80 bg-white/80 p-2.5">
    <div class="flex items-center gap-1">
      <div class="text-[11px] font-semibold text-gray-500">{{ title }}</div>
      <ConfigHintIcon v-if="$slots.hint" :label="title">
        <slot name="hint" />
      </ConfigHintIcon>
    </div>
    <slot />
  </div>
</template>
