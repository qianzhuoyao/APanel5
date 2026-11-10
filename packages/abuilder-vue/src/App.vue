<script setup lang="ts">
import { computed, ref } from "vue";
import { createRoot } from "react-dom/client";
import { applyPureReactInVue, setVeauryOptions } from "veaury";
import {
  App as ReactAbuilderApp,
  type AbuilderViewHandle,
} from "@arronqzy/abuilder";
import type { AbuilderVueAppProps } from "./types";

setVeauryOptions({
  react: {
    createRoot,
  },
});

const ReactApp = applyPureReactInVue(ReactAbuilderApp);

const props = withDefaults(defineProps<AbuilderVueAppProps>(), {
  initialZoom: 1,
  defaultTheme: "dark",
  locale: null,
  nameSpace: null,
  workspaceId: null,
  preview: false,
  plugins: () => [],
  pIcon: null,
  pTitle: null,
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

const reactProps = computed(() => ({
  className: props.class,
  initialZoom: props.initialZoom,
  defaultTheme: props.defaultTheme,
  locale: props.locale,
  previewSearch: props.previewSearch,
  preview: props.preview,
  initialWorkspace: props.initialWorkspace,
  workspaceId: props.workspaceId,
  nameSpace: props.nameSpace,
  plugins: props.plugins,
  pIcon: props.pIcon,
  pTitle: props.pTitle,
}));
</script>

<template>
  <ReactApp v-bind="reactProps" :react-ref="panelRef" />
</template>
