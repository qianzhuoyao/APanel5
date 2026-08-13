<script setup lang="ts">
import { useI18n } from "@arronqzy/i18n/vue";
import { computed } from "vue";
import { Empty } from "ant-design-vue";
import {
  BlueprintExecutionLogPanel,
  BlueprintNodeConfigSidebar,
  type BlueprintGraphNode,
  type ExecutionLogSettings,
  type ExecutionTraceEntry,
} from "@arronqzy/vue-blueprint";
import type { PanelElement, PanelLayer, ReferenceCopyMode } from "../types";
import PanelConfigSidebar from "./PanelConfigSidebar.vue";

const { t, locale } = useI18n();

export type WorkspaceConfigFocus = "view" | "blueprint" | "blueprint-log";

export type PanelConfigSidebarProps = {
  selectedElement: PanelElement | null;
  selectedElements?: PanelElement[];
  layers: PanelLayer[];
  updateElement: (
    id: string,
    patch: Partial<PanelElement>,
    options?: { batchId?: string; meta?: Record<string, unknown> }
  ) => void;
  setReferenceCopyMode?: (id: string, mode: ReferenceCopyMode) => void;
  nodeZOrderLabel?: string;
  onExcludeSelectedNode?: (nodeId: string) => void;
  onAdjustNodeZOrder?: (
    nodeId: string,
    action: "bringForward" | "sendBackward" | "bringToFront" | "sendToBack"
  ) => void;
  viewElementScope?: unknown;
};

export type BlueprintExecutionLogViewProps = {
  entries: ExecutionTraceEntry[];
  settings: ExecutionLogSettings;
  onUpdateSettings: (patch: Partial<ExecutionLogSettings>) => void;
  onSave: () => void;
  onExport: () => void;
  onClear: () => void;
  onClearAllSaved?: () => void | Promise<void>;
  onApplyRetention: () => void;
  hasSavedRuns?: boolean;
  lifecyclePhase?: string;
};

export type WorkspaceConfigSidebarProps = Omit<
  PanelConfigSidebarProps,
  "selectedElement" | "selectedElements"
> & {
  configFocus: WorkspaceConfigFocus;
  executionLog?: BlueprintExecutionLogViewProps;
  selectedBlueprintNode: BlueprintGraphNode | null;
  allowFalseSignalPropagation?: boolean;
  onUpdateAllowFalseSignalPropagation?: (value: boolean) => void;
  onUpdateBlueprintNode: (
    nodeId: string,
    patch: Partial<
      Pick<
        BlueprintGraphNode,
        | "label"
        | "role"
        | "nodeType"
        | "configSource"
        | "viewElementId"
        | "viewElementIds"
        | "nestedBlueprintId"
        | "libraryBlueprintId"
        | "lifecyclePhase"
        | "fetchConfig"
        | "jsonConfig"
        | "logicConfig"
        | "clockConfig"
      >
    >
  ) => void;
  blueprintLibraryOptions?: { id: string; label: string }[];
  selectedElement: PanelElement | null;
  selectedElements?: PanelElement[];
  allViewElements: PanelElement[];
};

const props = withDefaults(
  defineProps<WorkspaceConfigSidebarProps>(),
  {
    allowFalseSignalPropagation: false,
    blueprintLibraryOptions: () => [],
    selectedElements: () => [],
  }
);

const viewElementOptions = computed(() =>
  props.allViewElements.map((el) => ({
    id: el.id,
    label: el.name?.trim() || el.chart?.title || el.materialType || el.id,
  }))
);
</script>

<template>
  <div class="flex h-full flex-col overflow-hidden bg-white">
    <PanelConfigSidebar
      v-if="configFocus === 'view'"
      :selected-element="selectedElement"
      :selected-elements="selectedElements"
      :layers="layers"
      :update-element="updateElement"
      :view-element-scope="viewElementScope"
      :set-reference-copy-mode="setReferenceCopyMode"
      :node-z-order-label="nodeZOrderLabel"
      :on-exclude-selected-node="onExcludeSelectedNode"
      :on-adjust-node-z-order="onAdjustNodeZOrder"
    />

    <BlueprintExecutionLogPanel
      v-else-if="configFocus === 'blueprint-log' && executionLog"
      :entries="executionLog.entries"
      :settings="executionLog.settings"
      :on-update-settings="executionLog.onUpdateSettings"
      :on-save="() => { if (executionLog) void executionLog.onSave(); }"
      :on-export="executionLog.onExport"
      :on-clear="executionLog.onClear"
      :on-clear-all-saved="executionLog.onClearAllSaved"
      :has-saved-runs="executionLog.hasSavedRuns"
      :on-apply-retention="() => { if (executionLog) void executionLog.onApplyRetention(); }"
      :lifecycle-phase="executionLog.lifecyclePhase"
    />

    <div
      v-else-if="!selectedBlueprintNode"
      class="flex h-full flex-col overflow-hidden bg-background text-foreground"
    >
      <Empty class="py-10" :description="t('panel.workspace.configEmptyDesc')" />
    </div>

    <BlueprintNodeConfigSidebar
      v-else
      :node="selectedBlueprintNode"
      :allow-false-signal-propagation="allowFalseSignalPropagation"
      :on-update-allow-false-signal-propagation="onUpdateAllowFalseSignalPropagation"
      :view-element-options="viewElementOptions"
      :blueprint-library-options="blueprintLibraryOptions"
      :on-update-node="onUpdateBlueprintNode"
    />
  </div>
</template>
