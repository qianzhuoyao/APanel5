<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "@arronqzy/i18n/vue";
import { Tooltip } from "ant-design-vue";

const { t } = useI18n();
const props = defineProps<{
  label?: string;
  contentClass?: string;
  buttonClass?: string;
}>();

const resolvedLabel = computed(() => props.label || t("common.hint"));
</script>

<template>
  <Tooltip
    placement="top"
    :overlay-class-name="`z-[10120] max-w-[360px] text-[11px] leading-5 ${contentClass ?? ''}`"
    :mouse-enter-delay="0.12"
  >
    <template #title>
      <div class="space-y-1.5">
        <slot />
      </div>
    </template>
    <button
      type="button"
      :class="
        buttonClass ??
        'inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
      "
      :aria-label="t('common.hintAria', { label: resolvedLabel })"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="h-3.5 w-3.5"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <path d="M12 17h.01" />
      </svg>
    </button>
  </Tooltip>
</template>
