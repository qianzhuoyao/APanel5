<script setup lang="ts">
import { useI18n } from "@arronqzy/i18n/vue";
const { t } = useI18n();
</script>

<template>
  <div class="space-y-2">
    <p>{{ t("panel.scope.usageHint1") }}</p>
    <p>{{ t("panel.scope.usageHint2") }}</p>
  </div>
</template>
