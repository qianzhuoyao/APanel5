<script setup lang="ts">
import { computed, watch } from "vue";
import { Checkbox, Input, Select } from "ant-design-vue";
import {
  LIFECYCLE_NODE_TYPE,
  PAGE_LIFECYCLE_LABELS,
  PAGE_LIFECYCLE_PHASES,
  type PageLifecyclePhase,
} from "@arronqzy/blueprint-dsl";

import FetchNodeConfigPanel from "./components/FetchNodeConfigPanel.vue";
import ClockNodeConfigPanel from "./components/ClockNodeConfigPanel.vue";
import JsonNodeConfigPanel from "./components/JsonNodeConfigPanel.vue";
import LogicNodeConfigPanel from "./components/LogicNodeConfigPanel.vue";
import ViewElementMultiSelect from "./components/ViewElementMultiSelect.vue";
import {
  patchNodeConfigSource,
  pruneViewElementIds,
  resolveBlueprintConfigSource,
  resolveViewElementIds,
  type BlueprintConfigSource,
  type BlueprintGraphNode,
} from "./graph/document";

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

const roleLabel = computed(() => {
  const role = props.node.role;
  if (role === "blueprint") return "蓝图节点";
  if (role === "lifecycle") return "生命周期节点";
  if (role === "and") return "并运算节点";
  if (role === "fetch") return "数据源节点";
  if (role === "json") return "JSON 节点";
  return "逻辑节点";
});

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
      <div class="text-xs font-semibold">蓝图节点配置</div>
      <div class="mt-0.5 text-[11px] text-muted-foreground">
        {{ roleLabel }} · {{ node.id }}
      </div>
    </div>
    <div class="min-h-0 flex-1 space-y-3 overflow-auto p-3 text-xs">
      <label class="block space-y-1">
        <span class="text-muted-foreground">节点名称</span>
        <Input
          size="small"
          :value="node.label"
          @update:value="(v) => onUpdateNode(node.id, { label: String(v) })"
        />
      </label>

      <label class="block space-y-1">
        <span class="text-muted-foreground">配置类型</span>
        <Select
          size="small"
          class="w-full"
          :value="configSource"
          @change="(v) => handleConfigSourceChange(String(v))"
        >
          <Select.Option value="blueprint">蓝图配置</Select.Option>
          <Select.Option value="logic">逻辑配置</Select.Option>
          <Select.Option value="and">并运算</Select.Option>
          <Select.Option value="lifecycle">生命周期配置</Select.Option>
          <Select.Option value="fetch">数据源获取</Select.Option>
          <Select.Option value="json">JSON 节点</Select.Option>
          <Select.Option value="clock">时钟</Select.Option>
          <Select.Option value="view">视图节点配置</Select.Option>
        </Select>
      </label>

      <div v-if="configSource === 'view'" class="block space-y-1">
        <span class="text-muted-foreground">关联视图节点</span>
        <ViewElementMultiSelect
          :options="viewElementOptions"
          :value="linkedViewElementIds"
          placeholder="选择视图节点"
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
          可多选视图画布节点；关联后仍在此配置蓝图节点，视图属性请在视图面板中编辑。
        </p>
        <p v-else class="text-[11px] text-muted-foreground">
          已关联 {{ linkedViewElementIds.length }} 个视图节点：{{
            linkedViewElementIds
              .map((id) => viewElementLabelById.get(id) ?? id)
              .join("、")
          }}。
        </p>
      </div>

      <div
        v-if="configSource === 'blueprint'"
        class="space-y-2 rounded-md border border-border/70 bg-muted/20 p-2.5"
      >
        <div class="font-medium text-foreground">蓝图属性</div>
        <p class="text-[11px] text-muted-foreground">
          选中蓝图库中的蓝图后，当输入端收到<strong>真信号</strong>
          时才会执行该蓝图；执行完成后从输出端发出
          <strong>真信号</strong>（含嵌套蓝图输出值与当前节点信息），执行失败则发出
          <strong>假信号</strong>。
        </p>
        <label class="block space-y-1">
          <span class="text-muted-foreground">引用蓝图库</span>
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
            <Select.Option value="__none__">未关联</Select.Option>
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
          请先从蓝图库选择要引用的蓝图。
        </p>
        <label class="flex items-start gap-2 pt-1">
          <Checkbox
            :checked="allowFalseSignalPropagation"
            class="mt-0.5"
            @update:checked="(v) => onUpdateAllowFalseSignalPropagation?.(Boolean(v))"
          />
          <span class="text-[11px] leading-relaxed text-muted-foreground">
            允许假信号传递：开启后，节点输出假信号时不会阻塞任务链，错误信息会继续向下游传递。
          </span>
        </label>
      </div>

      <div
        v-if="configSource === 'lifecycle'"
        class="space-y-2 rounded-md border border-border/70 bg-muted/20 p-2.5"
      >
        <div class="font-medium text-foreground">生命周期钩子</div>
        <p class="text-[11px] text-muted-foreground">
          生命周期节点<strong>没有输入口</strong>，仅右侧输出口。
          {{
            node.lifecyclePhase === "blueprintActivated"
              ? "当本蓝图被其他蓝图的蓝图配置节点引用且收到真信号时，自动向下游发出真信号，输出值为父级传入的输入数据。"
              : "当页面进入对应生命周期时，自动向下游发出真/假信号。"
          }}
        </p>
        <label class="block space-y-1">
          <span class="text-muted-foreground">监听阶段</span>
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
              {{ PAGE_LIFECYCLE_LABELS[phase] }}
            </Select.Option>
          </Select>
        </label>
        <p v-if="node.parentId" class="text-[11px] text-muted-foreground">
          所属蓝图节点：{{ node.parentId }}
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
        <div class="font-medium text-foreground">并运算</div>
        <p class="text-[11px] text-muted-foreground">
          左侧两个输入口 <strong>inA</strong>、<strong>inB</strong>。
          每个输入口可连 n 条线，同端口任一为真则该端口视为真（或）。
          仅当 <strong>inA 与 inB 均为真信号</strong> 时，从输出口发出真信号；
          否则发出假信号。
        </p>
      </div>

      <template v-if="configSource === 'logic'">
        <LogicNodeConfigPanel :node="node" :on-update-node="onUpdateNode" />
        <p v-if="node.parentId" class="text-[11px] text-muted-foreground">
          所属蓝图节点：{{ node.parentId }}
        </p>
      </template>

      <div
        v-if="configSource !== 'blueprint' && configSource !== 'and'"
        class="space-y-2 rounded-md border border-border/70 bg-muted/20 p-2.5"
      >
        <div class="font-medium text-foreground">任务链执行</div>
        <label class="flex items-start gap-2">
          <Checkbox
            :checked="allowFalseSignalPropagation"
            class="mt-0.5"
            @update:checked="(v) => onUpdateAllowFalseSignalPropagation?.(Boolean(v))"
          />
          <span class="text-[11px] leading-relaxed text-muted-foreground">
            允许假信号传递：默认假信号会阻塞任务链；开启后继续向下游传递假信号与错误信息。
          </span>
        </label>
      </div>
    </div>
  </div>
</template>
