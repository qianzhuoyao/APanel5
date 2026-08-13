<script setup lang="ts">
import { computed, watch } from "vue";
import { ConfigProvider, theme } from "ant-design-vue";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import enUS from "ant-design-vue/es/locale/en_US";
import {
  VueViewPanel,
  VueViewOnlinePreview,
  parseOnlinePreviewSearchParams,
} from "@arronqzy/vue-view";
import { provideI18n } from "@arronqzy/i18n/vue";
import { isLocale } from "@arronqzy/i18n";
import type { AbuilderVueAppProps } from "./types";

const props = withDefaults(defineProps<AbuilderVueAppProps>(), {
  initialZoom: 1,
  defaultTheme: "dark",
  locale: null,
});

const i18n = provideI18n({ locale: props.locale });

watch(
  () => props.locale,
  (next) => {
    if (isLocale(next)) i18n.setLocale(next);
  }
);

const search =
  props.previewSearch ??
  (typeof window !== "undefined" ? window.location.search : "");

const previewParams = computed(() => parseOnlinePreviewSearchParams(search));

const isDark = computed(() => props.defaultTheme === "dark");

const antdLocale = computed(() =>
  i18n.locale.value === "en-US" ? enUS : zhCN
);
</script>

<template>
  <ConfigProvider
    :locale="antdLocale"
    :theme="{
      algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    }"
  >
    <VueViewOnlinePreview
      v-if="previewParams"
      :project-id="previewParams.projectId"
      :preview-instance-id="previewParams.previewInstanceId"
    />
    <VueViewPanel
      v-else
      :class="props.class"
      :initial-zoom="props.initialZoom"
    />
  </ConfigProvider>
</template>
