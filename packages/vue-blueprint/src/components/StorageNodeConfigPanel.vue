<script setup lang="ts">
import { useI18n } from "@arronqzy/i18n/vue";
import { computed, ref } from "vue";
import { Checkbox, Input, Select } from "ant-design-vue";
import type {
  ExecutionTraceEntry,
  StorageKind,
  StorageReadConfig,
  StorageSetConfig,
} from "@arronqzy/blueprint-dsl";
import {
  latestTraceOutputsByNode,
  resolveFetchIncomingScope,
  resolveFetchScopeAutocompleteRoot,
  uniqueStorageKinds,
} from "@arronqzy/blueprint-dsl";

import type { BlueprintGraphEdge, BlueprintGraphNode } from "../graph/document";
import { resolveNodeStorageConfig } from "../graph/document";
import ConfigHintIcon from "./ConfigHintIcon.vue";
import ScopeTemplateAutocompleteHost from "./ScopeTemplateAutocompleteHost.vue";

const { t } = useI18n();

export type StorageNodeConfigPanelProps = {
  node: BlueprintGraphNode;
  graphNodes?: BlueprintGraphNode[];
  graphEdges?: BlueprintGraphEdge[];
  traceEntries?: ExecutionTraceEntry[];
  onUpdateNode: (
    nodeId: string,
    patch: Partial<Pick<BlueprintGraphNode, "storageConfig" | "configSource">>
  ) => void;
};

const props = withDefaults(defineProps<StorageNodeConfigPanelProps>(), {
  graphNodes: () => [],
  graphEdges: () => [],
  traceEntries: () => [],
});

const formRef = ref<HTMLDivElement | null>(null);
const storageConfig = computed(() => resolveNodeStorageConfig(props.node));
const incomingScope = computed(() => {
  const outputs = latestTraceOutputsByNode(props.traceEntries);
  return resolveFetchIncomingScope({
    fetchNodeId: props.node.id,
    nodes: props.graphNodes,
    edges: props.graphEdges,
    getOutput: (sourceId, port) => outputs[sourceId]?.[port],
  });
});
const autocompleteScope = computed(() =>
  resolveFetchScopeAutocompleteRoot(incomingScope.value)
);

function patchStorageConfig(
  node: BlueprintGraphNode,
  patch: {
    read?: Partial<StorageReadConfig>;
    set?: Partial<StorageSetConfig>;
  }
) {
  const current = resolveNodeStorageConfig(node);
  return {
    storageConfig: {
      read: { ...current.read, ...patch.read },
      set: { ...current.set, ...patch.set },
    },
    configSource: "storage" as const,
  };
}

function handleReadStorageChange(value: string) {
  props.onUpdateNode(
    props.node.id,
    patchStorageConfig(props.node, {
      read: { storage: value === "session" ? "session" : "local" },
    })
  );
}

function handleReadKeyChange(value: string) {
  props.onUpdateNode(
    props.node.id,
    patchStorageConfig(props.node, { read: { key: String(value ?? "") } })
  );
}

function handleSetStorageToggle(kind: StorageKind, checked: boolean) {
  const next = new Set(storageConfig.value.set.storages);
  if (checked) next.add(kind);
  else next.delete(kind);
  props.onUpdateNode(
    props.node.id,
    patchStorageConfig(props.node, {
      set: { storages: uniqueStorageKinds([...next]) },
    })
  );
}

function handleSetKeyChange(value: string) {
  props.onUpdateNode(
    props.node.id,
    patchStorageConfig(props.node, { set: { key: String(value ?? "") } })
  );
}

function handleSetValueChange(value: string) {
  props.onUpdateNode(
    props.node.id,
    patchStorageConfig(props.node, { set: { value: String(value ?? "") } })
  );
}
</script>

<template>
  <div
    ref="formRef"
    class="space-y-2 rounded-md border border-border/70 bg-muted/20 p-2.5"
  >
    <ScopeTemplateAutocompleteHost :scope="autocompleteScope" :container-ref="formRef" />
    <div class="flex items-center gap-1.5">
      <div class="font-medium text-foreground">{{ t("blueprint.config.storageTitle") }}</div>
      <ConfigHintIcon :label="t('blueprint.config.storageTitle')">
        {{ t("blueprint.config.storageHint") }}
      </ConfigHintIcon>
    </div>

    <div class="space-y-2 rounded-md border border-border/60 bg-background/70 p-2">
      <div class="flex items-center gap-1.5">
        <div class="font-medium text-foreground">{{ t("blueprint.config.storageReadTitle") }}</div>
        <ConfigHintIcon :label="t('blueprint.config.storageReadTitle')">
          {{ t("blueprint.config.storageReadHint") }}
        </ConfigHintIcon>
      </div>
      <label class="block space-y-1">
        <span class="text-muted-foreground">{{ t("blueprint.config.storageTarget") }}</span>
        <Select
          size="small"
          class="w-full"
          :value="storageConfig.read.storage"
          @change="(v) => handleReadStorageChange(String(v))"
        >
          <Select.Option value="session">{{ t("blueprint.config.storageSession") }}</Select.Option>
          <Select.Option value="local">{{ t("blueprint.config.storageLocal") }}</Select.Option>
        </Select>
      </label>
      <label class="block space-y-1">
        <span class="text-muted-foreground">{{ t("blueprint.config.storageKey") }}</span>
        <Input
          size="small"
          :value="storageConfig.read.key"
          spellcheck="false"
          class="font-mono text-[11px]"
          placeholder="key"
          @update:value="(v) => handleReadKeyChange(String(v ?? ''))"
        />
      </label>
    </div>

    <div class="space-y-2 rounded-md border border-border/60 bg-background/70 p-2">
      <div class="flex items-center gap-1.5">
        <div class="font-medium text-foreground">{{ t("blueprint.config.storageSetTitle") }}</div>
        <ConfigHintIcon :label="t('blueprint.config.storageSetTitle')">
          {{ t("blueprint.config.storageSetHint") }}
        </ConfigHintIcon>
      </div>
      <div class="space-y-1.5">
        <span class="text-muted-foreground">{{ t("blueprint.config.storageTarget") }}</span>
        <label class="flex items-center gap-2">
          <Checkbox
            :checked="storageConfig.set.storages.includes('session')"
            class="mt-0.5"
            @update:checked="(v) => handleSetStorageToggle('session', Boolean(v))"
          />
          <span>{{ t("blueprint.config.storageSession") }}</span>
        </label>
        <label class="flex items-center gap-2">
          <Checkbox
            :checked="storageConfig.set.storages.includes('local')"
            class="mt-0.5"
            @update:checked="(v) => handleSetStorageToggle('local', Boolean(v))"
          />
          <span>{{ t("blueprint.config.storageLocal") }}</span>
        </label>
      </div>
      <label class="block space-y-1">
        <span class="text-muted-foreground">{{ t("blueprint.config.storageKey") }}</span>
        <Input
          size="small"
          :value="storageConfig.set.key"
          spellcheck="false"
          class="font-mono text-[11px]"
          placeholder="key"
          @update:value="(v) => handleSetKeyChange(String(v ?? ''))"
        />
      </label>
      <label class="block space-y-1">
        <span class="inline-flex items-center gap-1 text-muted-foreground">
          {{ t("blueprint.config.storageValue") }}
          <ConfigHintIcon :label="t('blueprint.config.storageValue')">
            {{ t("blueprint.config.storageValueHint") }}
          </ConfigHintIcon>
        </span>
        <Input
          size="small"
          :value="storageConfig.set.value"
          spellcheck="false"
          class="font-mono text-[11px]"
          placeholder="{scope.value}"
          @update:value="(v) => handleSetValueChange(String(v ?? ''))"
        />
      </label>
    </div>
  </div>
</template>
