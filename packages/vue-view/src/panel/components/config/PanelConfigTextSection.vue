<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { Checkbox, Input, InputNumber, Select } from "ant-design-vue";
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

const textEditorRef = ref<HTMLDivElement | null>(null);

function patch(patch: Partial<PanelElement>) {
  if (props.element.materialType !== "text") return;
  props.updateElement(props.element.id, patch);
}

function execTextCommand(cmd: "bold" | "italic" | "underline") {
  textEditorRef.value?.focus();
  document.execCommand(cmd);
  const next = textEditorRef.value?.innerHTML ?? "";
  patch({ textHtml: next || "<p><br/></p>" });
}

function syncEditorHtml() {
  if (props.element.materialType !== "text") return;
  const nextHtml = props.element.textHtml ?? "<p>双击输入文本</p>";
  if (textEditorRef.value && textEditorRef.value.innerHTML !== nextHtml) {
    textEditorRef.value.innerHTML = nextHtml;
  }
}

onMounted(syncEditorHtml);
watch(() => [props.element.id, props.element.textHtml], syncEditorHtml);
</script>

<template>
  <ConfigSection
    title="文本配置"
    :open="open"
    :force-open="forceOpen"
    @update:open="emit('update:open', $event)"
  >
    <ConfigFieldGroup title="文本内容">
      <div class="flex items-center gap-1">
        <button
          type="button"
          class="rounded border border-gray-200 px-2 py-1 text-[11px] hover:bg-gray-50 disabled:opacity-50"
          :disabled="!isEditable"
          @click="execTextCommand('bold')"
        >
          B
        </button>
        <button
          type="button"
          class="rounded border border-gray-200 px-2 py-1 text-[11px] italic hover:bg-gray-50 disabled:opacity-50"
          :disabled="!isEditable"
          @click="execTextCommand('italic')"
        >
          I
        </button>
        <button
          type="button"
          class="rounded border border-gray-200 px-2 py-1 text-[11px] underline hover:bg-gray-50 disabled:opacity-50"
          :disabled="!isEditable"
          @click="execTextCommand('underline')"
        >
          U
        </button>
      </div>
      <div
        ref="textEditorRef"
        class="min-h-[120px] rounded border border-gray-200 bg-white px-2 py-1.5 text-xs leading-6 outline-none"
        :contenteditable="isEditable"
        :style="{
          fontFamily: element.textFontFamily || undefined,
          fontSize: element.textFontSize ? `${element.textFontSize}px` : undefined,
          fontWeight: element.textFontWeight || undefined,
          color: element.textColor || undefined,
          lineHeight: element.textLineHeight ? String(element.textLineHeight) : undefined,
          textAlign: element.textAlign ?? 'left',
        }"
        @input="(e) => {
          const nextHtml = (e.target as HTMLDivElement).innerHTML;
          patch({ textHtml: nextHtml || '<p><br/></p>' });
        }"
      />
    </ConfigFieldGroup>
    <ConfigFieldGroup title="文字样式">
      <label class="block space-y-1">
        <div>字体</div>
        <Input
          size="small"
          :value="element.textFontFamily ?? ''"
          :disabled="!isEditable"
          placeholder="如：Inter, PingFang SC, Microsoft YaHei"
          @update:value="(v: string) => patch({ textFontFamily: v || undefined })"
        />
      </label>
      <div class="grid grid-cols-2 gap-2">
        <label class="block space-y-1">
          <div>字号（px）</div>
          <InputNumber
            size="small"
            class="w-full"
            :min="8"
            :max="200"
            :value="element.textFontSize ?? 14"
            :disabled="!isEditable"
            @update:value="(v) => { const n = Number(v); if (!Number.isNaN(n)) patch({ textFontSize: Math.max(8, n) }); }"
          />
        </label>
        <label class="block space-y-1">
          <div>字重</div>
          <Select
            size="small"
            class="w-full"
            :value="element.textFontWeight ?? '400'"
            :disabled="!isEditable"
            @update:value="(v) => patch({ textFontWeight: String(v) })"
          >
            <Select.Option value="300">300</Select.Option>
            <Select.Option value="400">400</Select.Option>
            <Select.Option value="500">500</Select.Option>
            <Select.Option value="600">600</Select.Option>
            <Select.Option value="700">700</Select.Option>
          </Select>
        </label>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <label class="block space-y-1">
          <div>对齐</div>
          <Select
            size="small"
            class="w-full"
            :value="element.textAlign ?? 'left'"
            :disabled="!isEditable"
            @update:value="(v) => patch({ textAlign: v as PanelElement['textAlign'] })"
          >
            <Select.Option value="left">左对齐</Select.Option>
            <Select.Option value="center">居中</Select.Option>
            <Select.Option value="right">右对齐</Select.Option>
            <Select.Option value="justify">两端对齐</Select.Option>
          </Select>
        </label>
        <label class="block space-y-1">
          <div>行高</div>
          <InputNumber
            size="small"
            class="w-full"
            :min="1"
            :max="3"
            :step="0.1"
            :value="element.textLineHeight ?? 1.6"
            :disabled="!isEditable"
            @update:value="(v) => {
              const n = Number(v);
              if (!Number.isNaN(n)) patch({ textLineHeight: Math.min(3, Math.max(1, n)) });
            }"
          />
        </label>
      </div>
      <ConfigColorField
        label="文字颜色"
        :value="element.textColor ?? ''"
        :disabled="!isEditable"
        @update:value="(v) => patch({ textColor: v || undefined })"
      />
    </ConfigFieldGroup>
    <ConfigFieldGroup title="输入能力">
      <label class="flex items-center gap-2">
        <Checkbox
          :checked="element.textAllowInput ?? true"
          :disabled="!isEditable"
          @update:checked="(v) => patch({ textAllowInput: v !== false })"
        />
        <span>允许在画布内直接输入（默认开启）</span>
      </label>
    </ConfigFieldGroup>
  </ConfigSection>
</template>
