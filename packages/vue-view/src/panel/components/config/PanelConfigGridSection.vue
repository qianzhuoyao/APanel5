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
    title="网格布局配置"
    :open="open"
    :force-open="forceOpen"
    @update:open="emit('update:open', $event)"
  >
    <template #hint>
      其他节点拖拽靠近该网格槽位中心时会自动吸附，并在节点树显示为该网格子节点。
    </template>
    <ConfigFieldGroup title="网格参数">
      <div class="grid grid-cols-2 gap-2">
        <label class="block space-y-1">
          <div>行数</div>
          <InputNumber
            size="small"
            class="w-full"
            :min="1"
            :max="12"
            :value="element.gridRows ?? 2"
            :disabled="!isEditable"
            @update:value="(v) => { const n = Number(v); if (!Number.isNaN(n)) patch({ gridRows: Math.max(1, Math.min(12, n)) }); }"
          />
        </label>
        <label class="block space-y-1">
          <div>列数</div>
          <InputNumber
            size="small"
            class="w-full"
            :min="1"
            :max="12"
            :value="element.gridCols ?? 3"
            :disabled="!isEditable"
            @update:value="(v) => { const n = Number(v); if (!Number.isNaN(n)) patch({ gridCols: Math.max(1, Math.min(12, n)) }); }"
          />
        </label>
        <label class="block space-y-1">
          <div>间距（px）</div>
          <InputNumber
            size="small"
            class="w-full"
            :min="0"
            :max="80"
            :value="element.gridGap ?? 8"
            :disabled="!isEditable"
            @update:value="(v) => { const n = Number(v); if (!Number.isNaN(n)) patch({ gridGap: Math.max(0, Math.min(80, n)) }); }"
          />
        </label>
        <label class="block space-y-1">
          <div>内边距（px）</div>
          <InputNumber
            size="small"
            class="w-full"
            :min="0"
            :max="100"
            :value="element.gridPadding ?? 10"
            :disabled="!isEditable"
            @update:value="(v) => { const n = Number(v); if (!Number.isNaN(n)) patch({ gridPadding: Math.max(0, Math.min(100, n)) }); }"
          />
        </label>
        <label class="block space-y-1">
          <div>吸附阈值（px）</div>
          <InputNumber
            size="small"
            class="w-full"
            :min="8"
            :max="120"
            :value="element.gridSnapThreshold ?? 36"
            :disabled="!isEditable"
            @update:value="(v) => { const n = Number(v); if (!Number.isNaN(n)) patch({ gridSnapThreshold: Math.max(8, Math.min(120, n)) }); }"
          />
        </label>
      </div>
    </ConfigFieldGroup>
  </ConfigSection>
</template>
