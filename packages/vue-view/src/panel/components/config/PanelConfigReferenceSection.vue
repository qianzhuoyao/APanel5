<script setup lang="ts">
import { useI18n } from "@arronqzy/i18n/vue";
import { Select } from "ant-design-vue";
import type { PanelElement, PanelLayer, ReferenceCopyMode } from "../../types";
import ConfigFieldGroup from "./ConfigFieldGroup.vue";
import ConfigSection from "./ConfigSection.vue";

const { t, locale } = useI18n();
const props = defineProps<{
  element: PanelElement;
  layers: PanelLayer[];
  isEditable: boolean;
  open: boolean;
  forceOpen?: boolean;
  setReferenceCopyMode?: (id: string, mode: ReferenceCopyMode) => void;
  updateElement: (
    id: string,
    patch: Partial<PanelElement>,
    options?: { batchId?: string; meta?: Record<string, unknown> }
  ) => void;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
}>();

function patch(patch: Partial<PanelElement>) {
  props.updateElement(props.element.id, patch);
}
</script>

<template>
  <ConfigSection
    :title="t('panel.config.sectionReference')"
    :open="open"
    :force-open="forceOpen"
    @update:open="emit('update:open', $event)"
  >
    <ConfigFieldGroup :title="t('panel.config.groupRefSource')">
      <label class="block space-y-1">
        <div>{{ t("panel.config.refLayer") }}</div>
        <Select
          size="small"
          class="w-full"
          :value="element.refLayerId ?? '__none__'"
          :disabled="!isEditable"
          @update:value="(v) => patch({ refLayerId: v === '__none__' ? undefined : String(v) })"
        >
          <Select.Option value="__none__">{{ t("panel.config.noneNoRef") }}</Select.Option>
          <Select.Option
            v-for="layer in layers.filter((l) => l.id !== element.layerId)"
            :key="layer.id"
            :value="layer.id"
          >
            {{ layer.name }}
          </Select.Option>
        </Select>
      </label>
    </ConfigFieldGroup>
    <ConfigFieldGroup :title="t('panel.config.groupCopyStrategy')">
      <template #hint>
        {{ t("panel.config.copyStrategyHint") }}
      </template>
      <label class="block space-y-1">
        <div>{{ t("panel.config.copyMode") }}</div>
        <Select
          size="small"
          class="w-full"
          :value="element.refCopyMode ?? 'shallow'"
          :disabled="!isEditable"
          @update:value="(v) => setReferenceCopyMode?.(element.id, v as ReferenceCopyMode)"
        >
          <Select.Option value="shallow">{{ t("panel.config.shallowFollow") }}</Select.Option>
          <Select.Option value="deep">{{ t("panel.config.deepFreeze") }}</Select.Option>
        </Select>
      </label>
    </ConfigFieldGroup>
  </ConfigSection>
</template>
