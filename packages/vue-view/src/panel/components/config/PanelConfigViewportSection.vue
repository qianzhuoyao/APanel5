<script setup lang="ts">
import { useI18n } from "@arronqzy/i18n/vue";
import { Select } from "ant-design-vue";
import type { PanelElement, PanelLayer, ReferenceCopyMode } from "../../types";
import {
  VIEWPORT_OVERFLOW_MODES,
  normalizeViewportOverflow,
  type ViewportOverflowMode,
} from "../../utils/viewportPlacement";
import ConfigFieldGroup from "./ConfigFieldGroup.vue";
import ConfigSection from "./ConfigSection.vue";

const { t } = useI18n();
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

const overflowLabelKey: Record<ViewportOverflowMode, string> = {
  "scroll-x": "panel.config.viewportOverflowScrollX",
  "scroll-y": "panel.config.viewportOverflowScrollY",
  scroll: "panel.config.viewportOverflowScroll",
  clip: "panel.config.viewportOverflowClip",
};

function patch(next: Partial<PanelElement>) {
  props.updateElement(props.element.id, next);
}
</script>

<template>
  <ConfigSection
    :title="t('panel.config.sectionViewport')"
    :open="open"
    :force-open="forceOpen"
    @update:open="emit('update:open', $event)"
  >
    <template #hint>
      {{ t("panel.config.viewportHint") }}
    </template>
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
    <ConfigFieldGroup
      :title="t('panel.config.groupCopyStrategy')"
      collapsible
      :default-open="false"
    >
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
    <ConfigFieldGroup :title="t('panel.config.groupViewportOverflow')">
      <label class="block space-y-1">
        <div>{{ t("panel.config.viewportOverflow") }}</div>
        <Select
          size="small"
          class="w-full"
          :value="normalizeViewportOverflow(element.viewportOverflow)"
          :disabled="!isEditable"
          @update:value="(v) => patch({ viewportOverflow: v as ViewportOverflowMode })"
        >
          <Select.Option v-for="mode in VIEWPORT_OVERFLOW_MODES" :key="mode" :value="mode">
            {{ t(overflowLabelKey[mode]) }}
          </Select.Option>
        </Select>
      </label>
    </ConfigFieldGroup>
  </ConfigSection>
</template>
