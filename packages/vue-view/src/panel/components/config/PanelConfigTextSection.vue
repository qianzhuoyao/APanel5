<script setup lang="ts">
import { useI18n } from "@arronqzy/i18n/vue";
import { onMounted, ref, watch } from "vue";
import { Checkbox, Input, InputNumber, Select } from "ant-design-vue";
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
  const nextHtml =
    props.element.textHtml ?? `<p>${t("panel.defaults.doubleClickTextHtml")}</p>`;
  if (textEditorRef.value && textEditorRef.value.innerHTML !== nextHtml) {
    textEditorRef.value.innerHTML = nextHtml;
  }
}

onMounted(syncEditorHtml);
watch(() => [props.element.id, props.element.textHtml], syncEditorHtml);
</script>

<template>
  <ConfigSection
    :title="t('panel.config.sectionText')"
    :open="open"
    :force-open="forceOpen"
    @update:open="emit('update:open', $event)"
  >
    <ConfigFieldGroup :title="t('panel.config.groupTextContent')">
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
    <ConfigFieldGroup :title="t('panel.config.groupTextStyle')">
      <label class="block space-y-1">
        <div>{{ t("panel.config.fontFamily") }}</div>
        <Input
          size="small"
          :value="element.textFontFamily ?? ''"
          :disabled="!isEditable"
          :placeholder="t('panel.config.fontFamilyPlaceholder')"
          @update:value="(v: string) => patch({ textFontFamily: v || undefined })"
        />
      </label>
      <div class="grid grid-cols-2 gap-2">
        <label class="block space-y-1">
          <div>{{ t("panel.config.fontSizePx") }}</div>
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
          <div>{{ t("panel.config.fontWeight") }}</div>
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
          <div>{{ t("panel.config.textAlign") }}</div>
          <Select
            size="small"
            class="w-full"
            :value="element.textAlign ?? 'left'"
            :disabled="!isEditable"
            @update:value="(v) => patch({ textAlign: v as PanelElement['textAlign'] })"
          >
            <Select.Option value="left">{{ t("panel.config.alignLeft") }}</Select.Option>
            <Select.Option value="center">{{ t("panel.config.alignCenter") }}</Select.Option>
            <Select.Option value="right">{{ t("panel.config.alignRight") }}</Select.Option>
            <Select.Option value="justify">{{ t("panel.config.alignJustify") }}</Select.Option>
          </Select>
        </label>
        <label class="block space-y-1">
          <div>{{ t("panel.config.lineHeight") }}</div>
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
        :label="t('panel.config.textColor')"
        :value="element.textColor ?? ''"
        :disabled="!isEditable"
        @update:value="(v) => patch({ textColor: v || undefined })"
      />
    </ConfigFieldGroup>
    <ConfigFieldGroup :title="t('panel.config.groupInputAbility')">
      <label class="flex items-center gap-2">
        <Checkbox
          :checked="element.textAllowInput ?? true"
          :disabled="!isEditable"
          @update:checked="(v) => patch({ textAllowInput: v !== false })"
        />
        <span>{{ t("panel.config.allowCanvasInput") }}</span>
      </label>
    </ConfigFieldGroup>
  </ConfigSection>
</template>
