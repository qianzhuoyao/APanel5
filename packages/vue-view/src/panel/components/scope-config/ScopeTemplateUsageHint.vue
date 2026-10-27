<script setup lang="ts">
import { useI18n } from "@arronqzy/i18n/vue";
import { TemplateConceptText } from "@arronqzy/vue-blueprint";

const { t } = useI18n();
</script>

<template>
  <div class="space-y-2">
    <p><TemplateConceptText :text="t('panel.scope.usageHint1')" /></p>
    <p><TemplateConceptText :text="t('panel.scope.usageHint2')" /></p>
    <p><TemplateConceptText :text="t('panel.scope.usageHintSystem')" /></p>
  </div>
</template>
