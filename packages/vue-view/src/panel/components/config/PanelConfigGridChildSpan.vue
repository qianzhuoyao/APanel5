<script setup lang="ts">
import { InputNumber } from "ant-design-vue";
import type { PanelElement } from "../../types";
import ConfigFieldGroup from "./ConfigFieldGroup.vue";
import ConfigSection from "./ConfigSection.vue";

const props = defineProps<{
  element: PanelElement;
  isEditable: boolean;
  open: boolean;
  forceOpen?: boolean;
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
    v-if="element.parentGridId"
    title="网格子节点占位"
    :open="open"
    :force-open="forceOpen"
    @update:open="emit('update:open', $event)"
  >
    <template #hint>
      网格子节点可跨越多格，占据更大区域，便于复杂布局。
    </template>
    <ConfigFieldGroup title="跨槽位">
      <div class="grid grid-cols-2 gap-2">
        <label class="block space-y-1">
          <div>跨列（colSpan）</div>
          <InputNumber
            size="small"
            class="w-full"
            :min="1"
            :max="12"
            :value="element.gridColSpan ?? 1"
            :disabled="!isEditable"
            @update:value="(v) => { const n = Number(v); if (!Number.isNaN(n)) patch({ gridColSpan: Math.max(1, Math.min(12, n)) }); }"
          />
        </label>
        <label class="block space-y-1">
          <div>跨行（rowSpan）</div>
          <InputNumber
            size="small"
            class="w-full"
            :min="1"
            :max="12"
            :value="element.gridRowSpan ?? 1"
            :disabled="!isEditable"
            @update:value="(v) => { const n = Number(v); if (!Number.isNaN(n)) patch({ gridRowSpan: Math.max(1, Math.min(12, n)) }); }"
          />
        </label>
      </div>
    </ConfigFieldGroup>
  </ConfigSection>
</template>
