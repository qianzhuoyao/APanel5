<script setup lang="ts">
import { computed } from "vue";
import { Button, Modal } from "ant-design-vue";

export type BlueprintNodeSwitchTaskDialogProps = {
  open: boolean;
  fromNodeId: string;
  toNodeId: string | null;
  onOpenChange: (open: boolean) => void;
  onKeepTaskAndSwitch: () => void;
  onCancelTaskAndSwitch: () => void;
};

const props = defineProps<BlueprintNodeSwitchTaskDialogProps>();

const targetLabel = computed(() =>
  props.toNodeId === null ? "取消选中" : `节点 ${props.toNodeId}`
);
</script>

<template>
  <Modal
    :open="open"
    title="节点正在执行任务"
    :footer="null"
    @update:open="onOpenChange"
  >
    <p class="text-sm text-muted-foreground">
      节点 <span class="font-mono text-foreground">{{ fromNodeId }}</span>
      正在执行任务（Swagger 解析或请求调试）。是否切换到 {{ targetLabel }}？
    </p>
    <p class="mt-2 text-xs text-muted-foreground">
      选择「保留并切换」将在后台继续执行，回到该节点时仍能看到进度；选择「取消并切换」会中止当前任务。
    </p>
    <div class="mt-4 flex flex-wrap justify-end gap-2">
      <Button @click="onOpenChange(false)">留在此节点</Button>
      <Button @click="onCancelTaskAndSwitch">取消并切换</Button>
      <Button type="primary" @click="onKeepTaskAndSwitch">保留并切换</Button>
    </div>
  </Modal>
</template>
