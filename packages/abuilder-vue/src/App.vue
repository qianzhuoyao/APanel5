<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { ConfigProvider, theme } from "ant-design-vue";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import enUS from "ant-design-vue/es/locale/en_US";
import {
  VueViewPanel,
  VueViewOnlinePreview,
  parseOnlinePreviewSearchParams,
  type AbuilderViewHandle,
} from "@arronqzy/vue-view";
import { provideI18n } from "@arronqzy/i18n/vue";
import { isLocale, LOCALE_STORAGE_KEY } from "@arronqzy/i18n";
import type { AbuilderVueAppProps } from "./types";
import { ABUILDER_VUE_PACKAGE_NAME, ABUILDER_VUE_VERSION } from "./version";

const props = withDefaults(defineProps<AbuilderVueAppProps>(), {
  initialZoom: 1,
  defaultTheme: "dark",
  locale: null,
  nameSpace: null,
  workspaceId: null,
  preview: false,
});

const panelRef = ref<AbuilderViewHandle | null>(null);
defineExpose({
  getNameSpace: () => panelRef.value?.getNameSpace() ?? props.nameSpace ?? null,
  getCurrentWorkspace: () => panelRef.value?.getCurrentWorkspace() ?? null,
  openWorkspace: (idOrRecord: Parameters<AbuilderViewHandle["openWorkspace"]>[0]) =>
    panelRef.value?.openWorkspace(idOrRecord) ??
    Promise.reject(new Error("Abuilder panel is not mounted")),
  createWorkspace: () =>
    panelRef.value?.createWorkspace() ??
    Promise.reject(new Error("Abuilder panel is not mounted")),
  saveWorkspace: () =>
    panelRef.value?.saveWorkspace() ??
    Promise.reject(new Error("Abuilder panel is not mounted")),
  syncWorkspace: () =>
    panelRef.value?.syncWorkspace() ??
    Promise.reject(new Error("Abuilder panel is not mounted")),
} satisfies AbuilderViewHandle);

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
      ref="panelRef"
      :class="props.class"
      :initial-zoom="props.initialZoom"
      :name-space="props.nameSpace"
      :initial-workspace="props.initialWorkspace"
      :workspace-id="props.workspaceId"
      :package-name="ABUILDER_VUE_PACKAGE_NAME"
      :package-version="ABUILDER_VUE_VERSION"
    />
  </ConfigProvider>
</template>
