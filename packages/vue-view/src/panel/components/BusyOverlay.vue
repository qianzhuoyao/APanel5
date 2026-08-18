<script setup lang="ts">
import { useI18n } from "@arronqzy/i18n/vue";
import { busyOverlayMessage } from "../utils/async-work";

const { t } = useI18n();
</script>

<template>
  <Teleport to="body">
    <div
      v-if="busyOverlayMessage"
      class="fixed inset-0 flex flex-col items-center justify-center gap-3 bg-black/45 px-6"
      style="z-index: 40000"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div class="h-9 w-9 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      <div class="max-w-sm text-center text-sm text-white">
        {{ busyOverlayMessage || t("common.loading") }}
      </div>
    </div>
  </Teleport>
</template>
