<script setup lang="ts">
import { computed } from "vue";
import { Checkbox, Input } from "ant-design-vue";
import type { ClockNodeConfig } from "@arronqzy/blueprint-dsl";

import type { BlueprintGraphNode } from "../graph/document";
import { resolveNodeClockConfig } from "../graph/document";

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
    <div class="font-medium text-foreground">时钟节点</div>
    <p class="text-[11px] text-muted-foreground">
      收到<strong>真信号</strong>后才开始计时输出；每次输出向下游发出
      <strong>真信号</strong>，值包含当前时间（formatted / timestamp / isoTime）。
      假信号会原样向下游传递。
    </p>

    <label class="block space-y-1">
      <span class="text-muted-foreground">时钟信号间隔（秒）</span>
      <Input
        type="number"
        :min="0"
        :step="1"
        size="small"
        :value="clockConfig.intervalSeconds"
        @update:value="handleIntervalChange"
      />
      <p class="text-[11px] text-muted-foreground">
        两次输出之间的间隔 n 秒；多次输出或未开启「立即发送」时须大于 0。
      </p>
    </label>

    <label class="block space-y-1">
      <span class="text-muted-foreground">输出次数</span>
      <Input
        type="number"
        :min="1"
        :step="1"
        size="small"
        :value="clockConfig.outputCount"
        @update:value="handleOutputCountChange"
      />
      <p class="text-[11px] text-muted-foreground">
        收到真信号后总共输出的次数，默认 1。
      </p>
    </label>

    <label class="flex items-start gap-2">
      <Checkbox
        :checked="clockConfig.emitImmediately"
        class="mt-0.5"
        @update:checked="handleEmitImmediatelyChange"
      />
      <span class="text-[11px] leading-relaxed text-muted-foreground">
        收到信号立即发送：开启且输出次数大于 1 时，会立刻执行第 1 次，剩余次数按间隔 m
        秒依次执行；仅输出 1 次时也会立刻执行。关闭则每次（含首次）都先等待 m 秒。
      </span>
    </label>

    <label class="block space-y-1">
      <span class="text-muted-foreground">时间格式</span>
      <Input
        size="small"
        :value="clockConfig.timeFormat"
        spellcheck="false"
        class="font-mono text-[11px]"
        placeholder="YYYY-MM-DD HH:mm:ss"
        @input="handleFormatChange"
      />
      <p class="text-[11px] text-muted-foreground">
        支持 YYYY、MM、DD、HH、mm、ss，默认 YYYY-MM-DD HH:mm:ss。
      </p>
    </label>
  </div>
</template>
