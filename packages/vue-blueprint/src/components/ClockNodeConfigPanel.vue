<script setup lang="ts">
import { useI18n } from "@arronqzy/i18n/vue";
import { computed } from "vue";
import { Checkbox, Input } from "ant-design-vue";
import type { ClockNodeConfig } from "@arronqzy/blueprint-dsl";

import ConfigHintIcon from "./ConfigHintIcon.vue";
import type { BlueprintGraphNode } from "../graph/document";
import { resolveNodeClockConfig } from "../graph/document";

const { t } = useI18n();

export type ClockNodeConfigPanelProps = {
  node: BlueprintGraphNode;
  onUpdateNode: (
    nodeId: string,
    patch: Partial<Pick<BlueprintGraphNode, "clockConfig" | "configSource">>
  ) => void;
};

const props = defineProps<ClockNodeConfigPanelProps>();

function patchClockConfig(node: BlueprintGraphNode, patch: Partial<ClockNodeConfig>) {
  return {
    clockConfig: { ...resolveNodeClockConfig(node), ...patch },
    configSource: "clock" as const,
  };
}

const clockConfig = computed(() => resolveNodeClockConfig(props.node));

function handleIntervalChange(value: string | number) {
  const raw = Number(value);
  const intervalSeconds =
    Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 0;
  props.onUpdateNode(props.node.id, patchClockConfig(props.node, { intervalSeconds }));
}

function handleOutputCountChange(value: string | number) {
  const raw = Number(value);
  const outputCount = Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 1;
  props.onUpdateNode(props.node.id, patchClockConfig(props.node, { outputCount }));
}

function handleFormatChange(event: Event) {
  props.onUpdateNode(
    props.node.id,
    patchClockConfig(props.node, {
      timeFormat: (event.target as HTMLInputElement).value,
    })
  );
}

function handleEmitImmediatelyChange(checked: boolean) {
  props.onUpdateNode(
    props.node.id,
    patchClockConfig(props.node, { emitImmediately: checked })
  );
}
</script>

<template>
  <div class="space-y-2 rounded-md border border-border/70 bg-muted/20 p-2.5">
    <div class="flex items-center gap-1.5">
      <div class="font-medium text-foreground">{{ t("blueprint.config.clockTitle") }}</div>
      <ConfigHintIcon :label="t('blueprint.config.clockTitle')">
        {{ t("blueprint.config.clockHint") }}
      </ConfigHintIcon>
    </div>

    <label class="block space-y-1">
      <span class="inline-flex items-center gap-1 text-muted-foreground">
        {{ t("blueprint.config.clockIntervalSeconds") }}
        <ConfigHintIcon :label="t('blueprint.config.clockIntervalSeconds')">
          {{ t("blueprint.config.clockIntervalHint") }}
        </ConfigHintIcon>
      </span>
      <Input
        type="number"
        :min="0"
        :step="1"
        size="small"
        :value="clockConfig.intervalSeconds"
        @update:value="handleIntervalChange"
      />
    </label>

    <label class="block space-y-1">
      <span class="inline-flex items-center gap-1 text-muted-foreground">
        {{ t("blueprint.config.outputCount") }}
        <ConfigHintIcon :label="t('blueprint.config.outputCount')">
          {{ t("blueprint.config.outputCountHint") }}
        </ConfigHintIcon>
      </span>
      <Input
        type="number"
        :min="1"
        :step="1"
        size="small"
        :value="clockConfig.outputCount"
        @update:value="handleOutputCountChange"
      />
    </label>

    <label class="flex items-start gap-2">
      <Checkbox
        :checked="clockConfig.emitImmediately"
        class="mt-0.5"
        @update:checked="handleEmitImmediatelyChange"
      />
      <span class="text-[11px] leading-relaxed text-muted-foreground">
        {{ t("blueprint.config.emitImmediately") }}
      </span>
    </label>

    <label class="block space-y-1">
      <span class="inline-flex items-center gap-1 text-muted-foreground">
        {{ t("blueprint.config.timeFormat") }}
        <ConfigHintIcon :label="t('blueprint.config.timeFormat')">
          {{ t("blueprint.config.timeFormatHint") }}
        </ConfigHintIcon>
      </span>
      <Input
        size="small"
        :value="clockConfig.timeFormat"
        spellcheck="false"
        class="font-mono text-[11px]"
        placeholder="YYYY-MM-DD HH:mm:ss"
        @input="handleFormatChange"
      />
    </label>
  </div>
</template>
