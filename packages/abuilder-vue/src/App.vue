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
import { isLocale, LOCALE_STORAGE_KEY } from "@arronqzy/i18n";
import type { AbuilderVueAppProps } from "./types";

const props = withDefaults(defineProps<AbuilderVueAppProps>(), {
  initialZoom: 1,
  defaultTheme: "dark",
  locale: null,
  nameSpace: null,
  preview: false,
});

const localeStorageKey = (() => {
  const ns = (props.nameSpace ?? "").trim();
  return ns ? `${LOCALE_STORAGE_KEY}__${ns.slice(0, 120)}` : LOCALE_STORAGE_KEY;
})();

const i18n = provideI18n({
  locale: props.locale,
  storageKey: localeStorageKey,
});

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
      v-if="props.preview"
      :workspace="props.initialWorkspace"
      :project-id="props.initialWorkspace?.id"
      :name-space="props.nameSpace"
    />
    <VueViewOnlinePreview
      v-else-if="previewParams"
      :project-id="previewParams.projectId"
      :preview-instance-id="previewParams.previewInstanceId"
      :name-space="previewParams.nameSpace ?? props.nameSpace"
    />
    <VueViewPanel
      v-else
      :class="props.class"
      :initial-zoom="props.initialZoom"
      :name-space="props.nameSpace"
      :initial-workspace="props.initialWorkspace"
    />
  </ConfigProvider>
</template>
