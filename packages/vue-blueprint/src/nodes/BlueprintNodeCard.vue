<script setup lang="ts">
import { useI18n } from "@arronqzy/i18n/vue";
import { computed } from "vue";
import { cn } from "../utils/cn";

const { t } = useI18n();

export type BlueprintNodeCardProps = {
  nodeId: string;
  label: string;
  meta?: string;
  subtitle?: string;
  progressLabel?: string;
  variant?: "blueprint" | "view" | "logic" | "and" | "lifecycle" | "event" | "fetch" | "json" | "storage" | "clock";
  selected?: boolean;
  hideLeadingDot?: boolean;
};

const props = withDefaults(defineProps<BlueprintNodeCardProps>(), {
  variant: "blueprint",
  selected: false,
  hideLeadingDot: false,
});

const emit = defineEmits<{
  select: [nodeId: string];
}>();

const showMeta = computed(() => Boolean(props.meta && props.meta !== props.label));
</script>

<template>
  <div
    data-blueprint-node-card
    :class="cn('bp-node-card bp-flow-drag-handle', selected && 'bp-node-card--selected')"
    :title="t('blueprint.node.dragToMove')"
  >
    <button
      type="button"
      class="bp-node-card__body"
      @click.stop="emit('select', nodeId)"
    >
      <span
        :class="cn('bp-node-icon', `bp-node-icon--${variant}`)"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <template v-if="variant === 'logic'">
            <path d="M6 4v6a4 4 0 0 0 4 4h4" />
            <path d="M14 14v6" />
            <circle cx="6" cy="4" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="14" cy="20" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="18" cy="14" r="1.5" fill="currentColor" stroke="none" />
          </template>
          <template v-else-if="variant === 'and'">
            <path d="M8 6v12" />
            <path d="M8 12h8" />
            <path d="M16 6v12" />
          </template>
          <template v-else-if="variant === 'lifecycle'">
            <circle cx="12" cy="12" r="7" />
            <path d="M12 8v4l2.5 1.5" />
          </template>
          <template v-else-if="variant === 'event'">
            <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />
          </template>
          <template v-else-if="variant === 'fetch'">
            <path d="M12 3v12" />
            <path d="m7 10 5 5 5-5" />
            <path d="M5 19h14" />
          </template>
          <template v-else-if="variant === 'json'">
            <path d="M8 4c-2 0-3 1.5-3 4s1 4 3 4" />
            <path d="M8 12c-2 0-3 1.5-3 4s1 4 3 4" />
            <path d="M16 4c2 0 3 1.5 3 4s-1 4-3 4" />
            <path d="M16 12c2 0 3 1.5 3 4s-1 4-3 4" />
          </template>
          <template v-else-if="variant === 'storage'">
            <ellipse cx="12" cy="6" rx="7" ry="3" />
            <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
            <path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
          </template>
          <template v-else-if="variant === 'clock'">
            <circle cx="12" cy="12" r="8" />
            <path d="M12 8v4.5L15 15" />
          </template>
          <template v-else-if="variant === 'view'">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 9h18" />
            <path d="M8 14h4" />
          </template>
          <template v-else>
            <circle cx="7" cy="7" r="2.5" />
            <circle cx="17" cy="7" r="2.5" />
            <circle cx="12" cy="17" r="2.5" />
            <path d="M9.2 8.2 14.8 8.2" />
            <path d="M8.2 9.2 11 14.8" />
            <path d="M15.8 9.2 13 14.8" />
          </template>
        </svg>
      </span>
      <div class="bp-node-card__content">
        <div class="bp-node-card__title-row">
          <div class="bp-node-card__title">{{ label }}</div>
          <span
            v-if="progressLabel"
            :class="cn('bp-node-card__badge', `bp-node-card__badge--${variant}`)"
            :title="t('blueprint.node.signalSentCount')"
          >
            {{ progressLabel }}
          </span>
        </div>
        <div v-if="showMeta" class="bp-node-card__meta" :title="meta">
          {{ meta }}
        </div>
        <div v-if="subtitle" class="bp-node-card__subtitle" :title="subtitle">
          {{ subtitle }}
        </div>
      </div>
    </button>
  </div>
</template>
