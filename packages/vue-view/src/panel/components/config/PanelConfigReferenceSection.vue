<script setup lang="ts">
import { Select } from "ant-design-vue";
import type { PanelElement, PanelLayer, ReferenceCopyMode } from "../../types";
import ConfigFieldGroup from "./ConfigFieldGroup.vue";
import ConfigSection from "./ConfigSection.vue";

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
    title="引用组件配置"
    :open="open"
    :force-open="forceOpen"
    @update:open="emit('update:open', $event)"
  >
    <ConfigFieldGroup title="引用源">
      <label class="block space-y-1">
        <div>引用图层</div>
        <Select
          size="small"
          class="w-full"
          :value="element.refLayerId ?? '__none__'"
          :disabled="!isEditable"
          @update:value="(v) => patch({ refLayerId: v === '__none__' ? undefined : String(v) })"
        >
          <Select.Option value="__none__">无（不引用）</Select.Option>
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
    <ConfigFieldGroup title="拷贝策略">
      <template #hint>
        浅拷贝会实时同步被引用图层；深拷贝会固定当前快照，不再随源变化。
      </template>
      <label class="block space-y-1">
        <div>拷贝模式</div>
        <Select
          size="small"
          class="w-full"
          :value="element.refCopyMode ?? 'shallow'"
          :disabled="!isEditable"
          @update:value="(v) => setReferenceCopyMode?.(element.id, v as ReferenceCopyMode)"
        >
          <Select.Option value="shallow">浅拷贝（跟随源图层变化）</Select.Option>
          <Select.Option value="deep">深拷贝（冻结当前引用快照）</Select.Option>
        </Select>
      </label>
    </ConfigFieldGroup>
  </ConfigSection>
</template>
