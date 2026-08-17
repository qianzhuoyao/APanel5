<script setup lang="ts">
import { useI18n } from "@arronqzy/i18n/vue";
import { Checkbox, Input, InputNumber, Select } from "ant-design-vue";
import type { PanelElement, PanelLayer } from "../../types";
import { getPanelMessages } from "../../constants/messages";
import ConfigSection from "./ConfigSection.vue";
import ConfigFieldGroup from "./ConfigFieldGroup.vue";

const { t, locale } = useI18n();
const msgs = () => getPanelMessages(t);
const props = defineProps<{
  element: PanelElement;
  layers: PanelLayer[];
  isEditable: boolean;
  canToggleNodeLock: boolean;
  nodeZOrderLabel?: string;
  open: boolean;
  forceOpen?: boolean;
  onAdjustNodeZOrder?: (
    nodeId: string,
    action: "bringForward" | "sendBackward" | "bringToFront" | "sendToBack"
  ) => void;
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
    :title="t('panel.config.sectionNodeInfo')"
    :open="open"
    :force-open="forceOpen"
    @update:open="emit('update:open', $event)"
  >
    <label class="block space-y-1">
      <div>{{ t("panel.config.nodeName") }}</div>
      <Input
        size="small"
        :value="element.name ?? ''"
        :disabled="!isEditable"
        :placeholder="t('panel.config.nodeNamePlaceholder')"
        @update:value="(v: string) => patch({ name: v || undefined })"
      />
    </label>
    <div class="grid grid-cols-2 gap-2">
      <label class="block space-y-1">
        <div>X</div>
        <InputNumber
          size="small"
          class="w-full"
          :value="element.x"
          :disabled="!isEditable"
          @update:value="(v) => { const n = Number(v); if (!Number.isNaN(n)) patch({ x: n }); }"
        />
      </label>
      <label class="block space-y-1">
        <div>Y</div>
        <InputNumber
          size="small"
          class="w-full"
          :value="element.y"
          :disabled="!isEditable"
          @update:value="(v) => { const n = Number(v); if (!Number.isNaN(n)) patch({ y: n }); }"
        />
      </label>
    </div>
    <div class="grid grid-cols-2 gap-2">
      <label class="block space-y-1">
        <div>{{ t("panel.config.width") }}</div>
        <InputNumber
          size="small"
          class="w-full"
          :min="1"
          :value="element.width"
          :disabled="!isEditable"
          @update:value="(v) => { const n = Number(v); if (!Number.isNaN(n)) patch({ width: Math.max(1, n) }); }"
        />
      </label>
      <label class="block space-y-1">
        <div>{{ t("panel.config.height") }}</div>
        <InputNumber
          size="small"
          class="w-full"
          :min="1"
          :value="element.height"
          :disabled="!isEditable"
          @update:value="(v) => { const n = Number(v); if (!Number.isNaN(n)) patch({ height: Math.max(1, n) }); }"
        />
      </label>
    </div>
    <ConfigFieldGroup
      :title="t('panel.config.groupNodeMore')"
      collapsible
      :default-open="false"
    >
    <div class="grid grid-cols-2 gap-2">
      <label class="block space-y-1">
        <div>{{ t("panel.config.rotate") }}</div>
        <InputNumber
          size="small"
          class="w-full"
          :value="element.rotate ?? 0"
          :disabled="!isEditable"
          @update:value="(v) => { const n = Number(v); if (!Number.isNaN(n)) patch({ rotate: n }); }"
        />
      </label>
    </div>
    <div class="space-y-1.5">
      <div class="text-[11px] text-gray-500">{{ t("panel.config.nodeZOrder") }}</div>
      <div class="text-[11px] text-gray-400">{{ t("panel.config.currentZIndex", { value: nodeZOrderLabel ?? "-" }) }}</div>
      <div v-if="onAdjustNodeZOrder" class="grid grid-cols-2 gap-2">
        <button
          type="button"
          class="rounded border border-gray-200 bg-white px-2 py-1 text-[11px] hover:bg-gray-50 disabled:opacity-50"
          :disabled="!isEditable"
          @click="onAdjustNodeZOrder(element.id, 'bringForward')"
        >
          {{ t("panel.menubar.bringForward") }}
        </button>
        <button
          type="button"
          class="rounded border border-gray-200 bg-white px-2 py-1 text-[11px] hover:bg-gray-50 disabled:opacity-50"
          :disabled="!isEditable"
          @click="onAdjustNodeZOrder(element.id, 'sendBackward')"
        >
          {{ t("panel.menubar.sendBackward") }}
        </button>
        <button
          type="button"
          class="rounded border border-gray-200 bg-white px-2 py-1 text-[11px] hover:bg-gray-50 disabled:opacity-50"
          :disabled="!isEditable"
          @click="onAdjustNodeZOrder(element.id, 'bringToFront')"
        >
          {{ t("panel.menubar.bringToFront") }}
        </button>
        <button
          type="button"
          class="rounded border border-gray-200 bg-white px-2 py-1 text-[11px] hover:bg-gray-50 disabled:opacity-50"
          :disabled="!isEditable"
          @click="onAdjustNodeZOrder(element.id, 'sendToBack')"
        >
          {{ t("panel.menubar.sendToBack") }}
        </button>
      </div>
    </div>
    <div class="truncate text-gray-400">ID: {{ element.id }}</div>
    <div class="text-gray-400">{{ t("panel.config.type") }}: {{ element.materialType ?? element.id }}</div>
    </ConfigFieldGroup>
    <div class="rounded-lg border border-gray-200/60 bg-white/80 px-2.5 py-2">
      <label class="flex items-center gap-2">
        <Checkbox
          :checked="element.locked === true"
          :disabled="!canToggleNodeLock"
          @update:checked="(v) => patch({ locked: v === true })"
        />
        <span>{{ t("panel.config.lockNode") }}</span>
      </label>
    </div>
    <div
      v-if="!isEditable"
      class="rounded border border-amber-500/40 bg-amber-500/10 px-2 py-1.5 text-[11px] text-amber-700"
    >
      {{ element.locked ? msgs().nodeConfigLocked : msgs().nodeConfigLayerLocked }}
    </div>
  </ConfigSection>
</template>
