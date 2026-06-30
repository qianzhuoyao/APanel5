<script setup lang="ts">
import { ref, watch } from "vue";
import { Button, Input, Modal } from "ant-design-vue";

import type { BlueprintMetaDraft } from "../library/types";

export type BlueprintMetaDialogProps = {
  open: boolean;
  mode: "export" | "save";
  initialMeta: BlueprintMetaDraft;
  onOpenChange: (open: boolean) => void;
  onConfirm: (meta: BlueprintMetaDraft) => void;
};

const props = defineProps<BlueprintMetaDialogProps>();

const name = ref(props.initialMeta.name);
const remark = ref(props.initialMeta.remark);

watch(
  () => [props.open, props.initialMeta.name, props.initialMeta.remark] as const,
  ([open, nextName, nextRemark]) => {
    if (!open) return;
    name.value = nextName;
    remark.value = nextRemark;
  }
);

const title = () => (props.mode === "export" ? "导出蓝图" : "保存蓝图");
const description = () =>
  props.mode === "export"
    ? "填写蓝图名称与备注，将当前蓝图导出为 JSON 文件。"
    : "填写蓝图名称与备注，将当前蓝图保存到本地蓝图库。";
const confirmLabel = () => (props.mode === "export" ? "导出" : "保存");

function handleConfirm() {
  props.onConfirm({
    name: name.value.trim() || "未命名蓝图",
    remark: remark.value.trim(),
  });
  props.onOpenChange(false);
}
</script>

<template>
  <Modal
    :open="open"
    :title="title()"
    :ok-text="confirmLabel()"
    cancel-text="取消"
    @update:open="onOpenChange"
    @ok="handleConfirm"
  >
    <p class="mb-3 text-xs text-muted-foreground">{{ description() }}</p>
    <div class="space-y-3">
      <label class="block space-y-1">
        <span class="text-sm">蓝图名称</span>
        <Input
          id="blueprint-meta-name"
          v-model:value="name"
          placeholder="例如：首页初始化流程"
          autofocus
        />
      </label>
      <label class="block space-y-1">
        <span class="text-sm">蓝图备注</span>
        <Input.TextArea
          id="blueprint-meta-remark"
          v-model:value="remark"
          placeholder="可选：描述蓝图用途、触发条件等"
          :rows="3"
        />
      </label>
    </div>
    <template #footer>
      <Button @click="onOpenChange(false)">取消</Button>
      <Button type="primary" @click="handleConfirm">{{ confirmLabel() }}</Button>
    </template>
  </Modal>
</template>
