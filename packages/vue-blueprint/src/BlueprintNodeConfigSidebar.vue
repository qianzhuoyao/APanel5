<script setup lang="ts">
import { useI18n } from "@arronqzy/i18n/vue";
import { computed, watch } from "vue";
import { Checkbox, Input, Select } from "ant-design-vue";
import {
  LIFECYCLE_NODE_TYPE,
  PAGE_LIFECYCLE_PHASES,
  type PageLifecyclePhase,
} from "@arronqzy/blueprint-dsl";

import FetchNodeConfigPanel from "./components/FetchNodeConfigPanel.vue";
import ClockNodeConfigPanel from "./components/ClockNodeConfigPanel.vue";
import JsonNodeConfigPanel from "./components/JsonNodeConfigPanel.vue";
import LogicNodeConfigPanel from "./components/LogicNodeConfigPanel.vue";
import ViewElementMultiSelect from "./components/ViewElementMultiSelect.vue";
import {
  getLifecyclePhaseLabel,
  patchNodeConfigSource,
  pruneViewElementIds,
  resolveBlueprintConfigSource,
  resolveViewElementIds,
  type BlueprintConfigSource,
  type BlueprintGraphNode,
  type BlueprintNodeRole,
} from "./graph/document";

const { t } = useI18n();

export type BlueprintViewElementOption = {
  id: string;
  label: string;
};

export type BlueprintLibraryOption = {
  id: string;
  label: string;
};

export type BlueprintNodeConfigSidebarProps = {
  node: BlueprintGraphNode;
  viewElementOptions?: BlueprintViewElementOption[];
  blueprintLibraryOptions?: BlueprintLibraryOption[];
  allowFalseSignalPropagation?: boolean;
  onUpdateAllowFalseSignalPropagation?: (value: boolean) => void;
  onUpdateNode: (
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
};

const props = withDefaults(defineProps<BlueprintNodeConfigSidebarProps>(), {
  viewElementOptions: () => [],
  blueprintLibraryOptions: () => [],
  allowFalseSignalPropagation: false,
});

const configSource = computed(() => resolveBlueprintConfigSource(props.node));
const linkedViewElementIds = computed(() => resolveViewElementIds(props.node));
const existingViewElementIdSet = computed(
  () => new Set(props.viewElementOptions.map((opt) => opt.id))
);
const viewElementLabelById = computed(
  () => new Map(props.viewElementOptions.map((opt) => [opt.id, opt.label]))
);

const ROLE_LABEL_KEYS: Record<BlueprintNodeRole, string> = {
  blueprint: "blueprint.config.roleBlueprint",
  lifecycle: "blueprint.config.roleLifecycle",
  and: "blueprint.config.roleAnd",
  fetch: "blueprint.config.roleFetch",
  json: "blueprint.config.roleJson",
  logic: "blueprint.config.roleLogic",
  clock: "blueprint.config.roleClock",
};

const roleLabel = computed(() =>
  t(ROLE_LABEL_KEYS[props.node.role] ?? "blueprint.config.roleLogic")
);

watch(
  [
    configSource,
    existingViewElementIdSet,
    () => props.node.id,
    () => props.node.viewElementId,
    () => props.node.viewElementIds,
    () => props.viewElementOptions.length,
  ],
  () => {
    if (configSource.value !== "view") return;
    if (props.viewElementOptions.length === 0) return;
    const linked = resolveViewElementIds(props.node);
    if (linked.length === 0) return;
    const pruned = pruneViewElementIds(linked, existingViewElementIdSet.value);
    if (pruned.length === linked.length) return;
    props.onUpdateNode(props.node.id, {
      viewElementIds: pruned.length > 0 ? pruned : undefined,
      viewElementId: undefined,
      configSource: "view",
    });
  }
);

function handleConfigSourceChange(value: string) {
  const nextSource = value as BlueprintConfigSource;
  props.onUpdateNode(props.node.id, {
    ...patchNodeConfigSource(props.node, nextSource),
    ...(nextSource === "view"
      ? {
          viewElementIds: linkedViewElementIds.value,
          viewElementId: undefined,
        }
      : {
          viewElementIds: undefined,
          viewElementId: undefined,
        }),
  });
}
</script>

<template>
  <div class="flex h-full min-h-0 flex-col overflow-hidden bg-background text-foreground">
    <div class="shrink-0 border-b border-border px-3 py-2">
      <div class="text-xs font-semibold">{{ t("blueprint.config.title") }}</div>
      <div class="mt-0.5 text-[11px] text-muted-foreground">
        {{ roleLabel }} · {{ node.id }}
      </div>
    </div>
    <div class="min-h-0 flex-1 space-y-3 overflow-auto p-3 text-xs">
      <label class="block space-y-1">
        <span class="text-muted-foreground">{{ t("blueprint.config.nodeName") }}</span>
        <Input
          size="small"
          :value="node.label"
          @update:value="(v) => onUpdateNode(node.id, { label: String(v) })"
        />
      </label>

      <label class="block space-y-1">
        <span class="text-muted-foreground">{{ t("blueprint.config.configType") }}</span>
        <Select
          size="small"
          class="w-full"
          :value="configSource"
          @change="(v) => handleConfigSourceChange(String(v))"
        >
          <Select.Option value="blueprint">{{ t("blueprint.config.configBlueprint") }}</Select.Option>
          <Select.Option value="logic">{{ t("blueprint.config.configLogic") }}</Select.Option>
          <Select.Option value="and">{{ t("blueprint.config.configAnd") }}</Select.Option>
          <Select.Option value="lifecycle">{{ t("blueprint.config.configLifecycle") }}</Select.Option>
          <Select.Option value="fetch">{{ t("blueprint.config.configFetch") }}</Select.Option>
          <Select.Option value="json">{{ t("blueprint.config.configJson") }}</Select.Option>
          <Select.Option value="clock">{{ t("blueprint.config.configClock") }}</Select.Option>
          <Select.Option value="view">{{ t("blueprint.config.configView") }}</Select.Option>
        </Select>
      </label>

      <div v-if="configSource === 'view'" class="block space-y-1">
        <span class="text-muted-foreground">{{ t("blueprint.config.linkedViewNodes") }}</span>
        <ViewElementMultiSelect
          :options="viewElementOptions"
          :value="linkedViewElementIds"
          :placeholder="t('blueprint.config.selectViewNode')"
          @change="
            (next) =>
              onUpdateNode(node.id, {
                viewElementIds: next,
                viewElementId: undefined,
                configSource: 'view',
              })
          "
        />
        <p v-if="linkedViewElementIds.length === 0" class="text-[11px] text-muted-foreground">
          {{ t("blueprint.config.viewMultiHint") }}
        </p>
        <p v-else class="text-[11px] text-muted-foreground">
          {{
            t("blueprint.config.linkedViewCount", {
              count: linkedViewElementIds.length,
              names: linkedViewElementIds
                .map((id) => viewElementLabelById.get(id) ?? id)
                .join("、"),
            })
          }}
        </p>
      </div>

      <div
        v-if="configSource === 'blueprint'"
        class="space-y-2 rounded-md border border-border/70 bg-muted/20 p-2.5"
      >
        <div class="font-medium text-foreground">{{ t("blueprint.config.blueprintAttrs") }}</div>
        <p class="text-[11px] text-muted-foreground">{{ t("blueprint.config.blueprintAttrsHint") }}</p>
        <label class="block space-y-1">
          <span class="text-muted-foreground">{{ t("blueprint.config.refLibrary") }}</span>
          <Select
            size="small"
            class="w-full"
            :value="node.libraryBlueprintId ?? '__none__'"
            :dropdown-style="{ zIndex: 10100 }"
            @change="
              (v) =>
                onUpdateNode(node.id, {
                  libraryBlueprintId: String(v) === '__none__' ? undefined : String(v),
                  configSource: 'blueprint',
                })
            "
          >
            <Select.Option value="__none__">{{ t("blueprint.config.unlinked") }}</Select.Option>
            <Select.Option
              v-for="opt in blueprintLibraryOptions"
              :key="opt.id"
              :value="opt.id"
            >
              {{ opt.label }}
            </Select.Option>
          </Select>
        </label>
        <p v-if="!node.libraryBlueprintId" class="text-[11px] text-muted-foreground">
          {{ t("blueprint.config.selectLibraryFirst") }}
        </p>
        <label class="flex items-start gap-2 pt-1">
          <Checkbox
            :checked="allowFalseSignalPropagation"
            class="mt-0.5"
            @update:checked="(v) => onUpdateAllowFalseSignalPropagation?.(Boolean(v))"
          />
          <span class="text-[11px] leading-relaxed text-muted-foreground">
            {{ t("blueprint.config.allowFalsePropagateBlueprint") }}
          </span>
        </label>
      </div>

      <div
        v-if="configSource === 'lifecycle'"
        class="space-y-2 rounded-md border border-border/70 bg-muted/20 p-2.5"
      >
        <div class="font-medium text-foreground">{{ t("blueprint.config.lifecycleHook") }}</div>
        <p class="text-[11px] text-muted-foreground">
          {{ t("blueprint.config.lifecycleNoInput") }}
          {{
            node.lifecyclePhase === "blueprintActivated"
              ? t("blueprint.config.lifecycleBlueprintActivatedHint")
              : t("blueprint.config.lifecyclePageHint")
          }}
        </p>
        <label class="block space-y-1">
          <span class="text-muted-foreground">{{ t("blueprint.config.listenPhase") }}</span>
          <Select
            size="small"
            class="w-full"
            :value="node.lifecyclePhase ?? 'mounted'"
            @change="
              (v) =>
                onUpdateNode(node.id, {
                  role: 'lifecycle',
                  nodeType: LIFECYCLE_NODE_TYPE,
                  lifecyclePhase: v as PageLifecyclePhase,
                  configSource: 'lifecycle',
                })
            "
          >
            <Select.Option v-for="phase in PAGE_LIFECYCLE_PHASES" :key="phase" :value="phase">
              {{ getLifecyclePhaseLabel(t, phase) }}
            </Select.Option>
          </Select>
        </label>
        <p v-if="node.parentId" class="text-[11px] text-muted-foreground">
          {{ t("blueprint.config.parentBlueprintNode", { id: node.parentId }) }}
        </p>
      </div>

      <FetchNodeConfigPanel
        v-if="configSource === 'fetch'"
        :node="node"
        :on-update-node="onUpdateNode"
      />
      <JsonNodeConfigPanel
        v-if="configSource === 'json'"
        :node="node"
        :on-update-node="onUpdateNode"
      />
      <ClockNodeConfigPanel
        v-if="configSource === 'clock'"
        :node="node"
        :on-update-node="onUpdateNode"
      />

      <div
        v-if="configSource === 'and'"
        class="space-y-2 rounded-md border border-border/70 bg-muted/20 p-2.5"
      >
        <div class="font-medium text-foreground">{{ t("blueprint.config.andTitle") }}</div>
        <p class="text-[11px] text-muted-foreground">{{ t("blueprint.config.andHint") }}</p>
      </div>

      <template v-if="configSource === 'logic'">
        <LogicNodeConfigPanel :node="node" :on-update-node="onUpdateNode" />
        <p v-if="node.parentId" class="text-[11px] text-muted-foreground">
          {{ t("blueprint.config.parentBlueprintNode", { id: node.parentId }) }}
        </p>
      </template>

      <div
        v-if="configSource !== 'blueprint' && configSource !== 'and'"
        class="space-y-2 rounded-md border border-border/70 bg-muted/20 p-2.5"
      >
        <div class="font-medium text-foreground">{{ t("blueprint.config.taskChain") }}</div>
        <label class="flex items-start gap-2">
          <Checkbox
            :checked="allowFalseSignalPropagation"
            class="mt-0.5"
            @update:checked="(v) => onUpdateAllowFalseSignalPropagation?.(Boolean(v))"
          />
          <span class="text-[11px] leading-relaxed text-muted-foreground">
            {{ t("blueprint.config.allowFalsePropagateDefault") }}
          </span>
        </label>
      </div>
    </div>
  </div>
</template>
