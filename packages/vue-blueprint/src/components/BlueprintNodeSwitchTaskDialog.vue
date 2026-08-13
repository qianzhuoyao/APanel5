<script setup lang="ts">
import { useI18n } from "@arronqzy/i18n/vue";
import { computed } from "vue";
import { Button, Modal } from "ant-design-vue";

const { t } = useI18n();
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
  props.toNodeId === null
    ? t("blueprint.dialog.cancelSelection")
    : t("blueprint.dialog.nodeTarget", { id: props.toNodeId })
);
</script>

<template>
  <Modal
    :open="open"
    :title="t('blueprint.dialog.taskRunningTitle')"
    :footer="null"
    @update:open="onOpenChange"
  >
    <p class="text-sm text-muted-foreground">
      {{
        t("blueprint.dialog.taskRunningDescription", {
          fromNodeId,
          target: targetLabel,
        })
      }}
    </p>
    <p class="mt-2 text-xs text-muted-foreground">
      {{ t("blueprint.dialog.taskSwitchHint") }}
    </p>
    <div class="mt-4 flex flex-wrap justify-end gap-2">
      <Button @click="onOpenChange(false)">{{ t("blueprint.dialog.stayOnNode") }}</Button>
      <Button @click="onCancelTaskAndSwitch">{{ t("blueprint.dialog.cancelAndSwitch") }}</Button>
      <Button type="primary" @click="onKeepTaskAndSwitch">{{ t("blueprint.dialog.keepAndSwitch") }}</Button>
    </div>
  </Modal>
</template>
