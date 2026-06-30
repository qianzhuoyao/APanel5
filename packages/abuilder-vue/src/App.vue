<script setup lang="ts">
import { computed } from "vue";
import { ConfigProvider, theme } from "ant-design-vue";
import {
  VueViewPanel,
  VueViewOnlinePreview,
  parseOnlinePreviewSearchParams,
} from "@arronqzy/vue-view";
import type { AbuilderVueAppProps } from "./types";

const props = withDefaults(defineProps<AbuilderVueAppProps>(), {
  initialZoom: 1,
  defaultTheme: "dark",
});

const search =
  props.previewSearch ??
  (typeof window !== "undefined" ? window.location.search : "");

const previewParams = computed(() => parseOnlinePreviewSearchParams(search));

const isDark = computed(() => props.defaultTheme === "dark");
</script>

<template>
  <ConfigProvider
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
