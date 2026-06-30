<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { Input, InputNumber, Select, Textarea } from "ant-design-vue";
import type { PanelElement } from "../../types";
import ConfigColorField from "./ConfigColorField.vue";
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
    title="几何配置"
    :open="open"
    :force-open="forceOpen"
    @update:open="emit('update:open', $event)"
  >
    <ConfigFieldGroup title="基础形状">
      <label class="block space-y-1">
        <div>形状</div>
        <Select
          size="small"
          class="w-full"
          :value="element.geometryShape ?? 'rect'"
          :disabled="!isEditable"
          @update:value="(v) => patch({ geometryShape: v as PanelElement['geometryShape'] })"
        >
          <Select.Option value="rect">矩形</Select.Option>
          <Select.Option value="circle">圆形</Select.Option>
          <Select.Option value="triangle">三角形</Select.Option>
          <Select.Option value="diamond">菱形</Select.Option>
          <Select.Option value="hexagon">六边形</Select.Option>
          <Select.Option value="star">星形</Select.Option>
          <Select.Option value="heart">爱心</Select.Option>
        </Select>
      </label>
      <ConfigColorField
        label="几何颜色"
        :value="element.geometryColor ?? '#3b82f6'"
        :disabled="!isEditable"
        @update:value="(v) => patch({ geometryColor: v || '#3b82f6' })"
      />
    </ConfigFieldGroup>
    <ConfigFieldGroup title="高级（Canvas 脚本）">
      <template #hint>
        可输入 Canvas 绘制逻辑，变量：ctx、width、height、element。脚本异常会被安全忽略。
      </template>
      <Textarea
        :value="element.geometryScript ?? ''"
        :disabled="!isEditable"
        :rows="6"
        spellcheck="false"
        class="font-mono text-[11px]"
        placeholder="// 例: ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.fillRect(8,8,width-16,height-16);"
        @update:value="(v: string) => patch({ geometryScript: v || undefined })"
      />
    </ConfigFieldGroup>
    <ConfigFieldGroup title="手绘叠加">
      <div class="flex items-center gap-2">
        <label class="block space-y-1">
          <div class="text-[11px]">画笔颜色</div>
          <input
            v-model="geometryDrawPenColor"
            type="color"
            class="h-7 w-10 cursor-pointer rounded border border-gray-200 p-0.5"
            :disabled="!isEditable"
          />
        </label>
        <label class="block space-y-1">
          <div class="text-[11px]">画笔粗细</div>
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
          应用手绘到节点
        </button>
        <button
          type="button"
          class="rounded border border-gray-200 px-2 py-1 text-[11px] hover:bg-gray-50 disabled:opacity-50"
          :disabled="!isEditable"
          @click="clearSketch"
        >
          清空手绘
        </button>
      </div>
    </ConfigFieldGroup>
  </ConfigSection>
</template>
