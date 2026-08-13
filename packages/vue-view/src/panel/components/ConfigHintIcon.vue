<script setup lang="ts">
import { useI18n } from "@arronqzy/i18n/vue";
import { Tooltip } from "ant-design-vue";

const { t, locale } = useI18n();
withDefaults(
  defineProps<{
    label?: string;
    contentClass?: string;
    buttonClass?: string;
  }>(),
  { label: t("common.hint") }
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
      :aria-label="t('common.hintAria', { label })"
    >
      ?
    </button>
  </Tooltip>
</template>
