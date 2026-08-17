<script setup lang="ts">
import { useI18n } from "@arronqzy/i18n/vue";
import { onMounted, ref, watch } from "vue";
import { Input, InputNumber, Select, Textarea } from "ant-design-vue";
import type { PanelElement } from "../../types";
import ConfigColorField from "./ConfigColorField.vue";
import ConfigFieldGroup from "./ConfigFieldGroup.vue";
import ConfigSection from "./ConfigSection.vue";

const { t, locale } = useI18n();
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

const geometryDrawPenColor = ref("#111827");
const geometryDrawPenWidth = ref(3);
const isGeometryDrawing = ref(false);
const geometryDrawCanvasRef = ref<HTMLCanvasElement | null>(null);
const geometryLastPointRef = ref<{ x: number; y: number } | null>(null);

function patch(patch: Partial<PanelElement>) {
  if (props.element.materialType !== "geometry") return;
  props.updateElement(props.element.id, patch);
}

function redrawGeometryPadFromElement() {
  const canvas = geometryDrawCanvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  const sketch = props.element.geometrySketchDataUrl;
  if (!sketch) return;
  const img = new Image();
  img.onload = () => ctx.drawImage(img, 0, 0, width, height);
  img.src = sketch;
}

onMounted(redrawGeometryPadFromElement);
watch(() => [props.element.id, props.element.geometrySketchDataUrl], redrawGeometryPadFromElement);

function onPointerDown(e: PointerEvent) {
  const canvas = geometryDrawCanvasRef.value;
  if (!canvas || !props.isEditable) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const rect = canvas.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
  const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
  geometryLastPointRef.value = { x, y };
  isGeometryDrawing.value = true;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = geometryDrawPenColor.value;
  ctx.lineWidth = geometryDrawPenWidth.value;
  ctx.beginPath();
  ctx.moveTo(x, y);
}

function onPointerMove(e: PointerEvent) {
  if (!isGeometryDrawing.value) return;
  const canvas = geometryDrawCanvasRef.value;
  const last = geometryLastPointRef.value;
  if (!canvas || !last) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const rect = canvas.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
  const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
  ctx.lineTo(x, y);
  ctx.stroke();
  geometryLastPointRef.value = { x, y };
}

function endDrawing() {
  isGeometryDrawing.value = false;
  geometryLastPointRef.value = null;
}

function applySketch() {
  const canvas = geometryDrawCanvasRef.value;
  if (!canvas) return;
  patch({ geometrySketchDataUrl: canvas.toDataURL("image/png") });
}

function clearSketch() {
  patch({ geometrySketchDataUrl: undefined });
  redrawGeometryPadFromElement();
}
</script>

<template>
  <ConfigSection
    :title="t('panel.config.sectionGeometry')"
    :open="open"
    :force-open="forceOpen"
    @update:open="emit('update:open', $event)"
  >
    <ConfigFieldGroup :title="t('panel.config.groupBasicShape')">
      <label class="block space-y-1">
        <div>{{ t("panel.config.shape") }}</div>
        <Select
          size="small"
          class="w-full"
          :value="element.geometryShape ?? 'rect'"
          :disabled="!isEditable"
          @update:value="(v) => patch({ geometryShape: v as PanelElement['geometryShape'] })"
        >
          <Select.Option value="rect">{{ t("panel.config.shapeRect") }}</Select.Option>
          <Select.Option value="circle">{{ t("panel.config.shapeCircle") }}</Select.Option>
          <Select.Option value="triangle">{{ t("panel.config.shapeTriangle") }}</Select.Option>
          <Select.Option value="diamond">{{ t("panel.config.shapeDiamond") }}</Select.Option>
          <Select.Option value="hexagon">{{ t("panel.config.shapeHexagon") }}</Select.Option>
          <Select.Option value="star">{{ t("panel.config.shapeStar") }}</Select.Option>
          <Select.Option value="heart">{{ t("panel.config.shapeHeart") }}</Select.Option>
        </Select>
      </label>
      <ConfigColorField
        :label="t('panel.scope.fieldGeometryColor')"
        :value="element.geometryColor ?? '#3b82f6'"
        :disabled="!isEditable"
        @update:value="(v) => patch({ geometryColor: v || '#3b82f6' })"
      />
    </ConfigFieldGroup>
    <ConfigFieldGroup
      :title="t('panel.config.groupCanvasScript')"
      collapsible
      :default-open="false"
    >
      <template #hint>
        {{ t("panel.config.canvasScriptHint") }}
      </template>
      <Textarea
        :value="element.geometryScript ?? ''"
        :disabled="!isEditable"
        :rows="6"
        spellcheck="false"
        class="font-mono text-[11px]"
        :placeholder="t('panel.config.geometryScriptPlaceholder')"
        @update:value="(v: string) => patch({ geometryScript: v || undefined })"
      />
    </ConfigFieldGroup>
    <ConfigFieldGroup
      :title="t('panel.config.groupSketchOverlay')"
      collapsible
      :default-open="false"
    >
      <div class="flex items-center gap-2">
        <label class="block space-y-1">
          <div class="text-[11px]">{{ t("panel.config.penColor") }}</div>
          <input
            v-model="geometryDrawPenColor"
            type="color"
            class="h-7 w-10 cursor-pointer rounded border border-gray-200 p-0.5"
            :disabled="!isEditable"
          />
        </label>
        <label class="block space-y-1">
          <div class="text-[11px]">{{ t("panel.config.penWidth") }}</div>
          <InputNumber
            size="small"
            class="w-20"
            :min="1"
            :max="24"
            :value="geometryDrawPenWidth"
            :disabled="!isEditable"
            @update:value="(v) => { const n = Number(v); if (!Number.isNaN(n)) geometryDrawPenWidth = Math.max(1, Math.min(24, n)); }"
          />
        </label>
      </div>
      <div class="rounded border border-gray-200/60 bg-white p-2">
        <canvas
          ref="geometryDrawCanvasRef"
          width="320"
          height="180"
          class="h-[180px] w-full cursor-crosshair rounded border border-gray-200/60"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="endDrawing"
          @pointerleave="endDrawing"
        />
      </div>
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="rounded border border-gray-200 px-2 py-1 text-[11px] hover:bg-gray-50 disabled:opacity-50"
          :disabled="!isEditable"
          @click="applySketch"
        >
          {{ t("panel.config.applySketch") }}
        </button>
        <button
          type="button"
          class="rounded border border-gray-200 px-2 py-1 text-[11px] hover:bg-gray-50 disabled:opacity-50"
          :disabled="!isEditable"
          @click="clearSketch"
        >
          {{ t("panel.config.clearSketch") }}
        </button>
      </div>
    </ConfigFieldGroup>
  </ConfigSection>
</template>
