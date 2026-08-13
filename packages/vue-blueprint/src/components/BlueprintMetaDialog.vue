<script setup lang="ts">
import { useI18n } from "@arronqzy/i18n/vue";
import { ref, watch } from "vue";
import { Button, Input, Modal } from "ant-design-vue";

import type { BlueprintMetaDraft } from "../library/types";

const { t } = useI18n();
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

const title = () =>
  props.mode === "export"
    ? t("blueprint.dialog.exportTitle")
    : t("blueprint.dialog.saveTitle");
const description = () =>
  props.mode === "export"
    ? t("blueprint.dialog.exportDescription")
    : t("blueprint.dialog.saveDescription");
const confirmLabel = () =>
  props.mode === "export" ? t("blueprint.dialog.export") : t("blueprint.dialog.save");

function handleConfirm() {
  props.onConfirm({
    name: name.value.trim() || t("blueprint.dialog.unnamedBlueprint"),
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
    :cancel-text="t('common.cancel')"
    @update:open="onOpenChange"
    @ok="handleConfirm"
  >
    <p class="mb-3 text-xs text-muted-foreground">{{ description() }}</p>
    <div class="space-y-3">
      <label class="block space-y-1">
        <span class="text-sm">{{ t("blueprint.dialog.blueprintName") }}</span>
        <Input
          id="blueprint-meta-name"
          v-model:value="name"
          :placeholder="t('blueprint.dialog.namePlaceholder')"
          autofocus
        />
      </label>
      <label class="block space-y-1">
        <span class="text-sm">{{ t("blueprint.dialog.remark") }}</span>
        <Input.TextArea
          id="blueprint-meta-remark"
          v-model:value="remark"
          :placeholder="t('blueprint.dialog.remarkPlaceholder')"
          :rows="3"
        />
      </label>
    </div>
    <template #footer>
      <Button @click="onOpenChange(false)">{{ t("common.cancel") }}</Button>
      <Button type="primary" @click="handleConfirm">{{ confirmLabel() }}</Button>
    </template>
  </Modal>
</template>
