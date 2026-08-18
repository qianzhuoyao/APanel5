<script setup lang="ts">
import { useI18n } from "@arronqzy/i18n/vue";
import { ref } from "vue";
import { Input, Select } from "ant-design-vue";
import type { PanelElement, PanelElementStyle } from "../../types";
import { readFileAsDataUrl, uploadFileToRemote } from "./shared";
import { getPanelMessages } from "../../constants/messages";
import ConfigColorField from "./ConfigColorField.vue";
import ConfigFieldGroup from "./ConfigFieldGroup.vue";
import ConfigSection from "./ConfigSection.vue";

const { t, locale } = useI18n();
const msgs = () => getPanelMessages(t);

const props = defineProps<{
  element: PanelElement;
  isEditable: boolean;
  backgroundOpen: boolean;
  borderOpen: boolean;
  showBackground?: boolean;
  showBorder?: boolean;
  forceOpen?: boolean;
  updateElement: (
    id: string,
    patch: Partial<PanelElement>,
    options?: { batchId?: string; meta?: Record<string, unknown> }
  ) => void;
}>();

const emit = defineEmits<{
  "update:backgroundOpen": [value: boolean];
  "update:borderOpen": [value: boolean];
}>();

const uploadStatus = ref("");

function patchStyle(patch: Partial<PanelElementStyle>) {
  props.updateElement(props.element.id, {
    style: { ...(props.element.style ?? {}), ...patch },
  });
}

async function handleUploadBackgroundImage(file: File) {
  try {
    const base64 = await readFileAsDataUrl(file, msgs().readImageFailed);
    patchStyle({ backgroundImage: `url("${base64}")` });
    uploadStatus.value = t("panel.config.uploadWrittenBase64");
    const url = await uploadFileToRemote(file);
    if (url) {
      patchStyle({ backgroundImageRemoteUrl: url });
      uploadStatus.value = t("panel.config.uploadServerAndBase64");
    } else {
      uploadStatus.value = t("panel.config.uploadServerFailedKeepBase64");
    }
  } catch (error) {
    uploadStatus.value = error instanceof Error ? error.message : msgs().readImageFailed;
  }
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = "";
  if (file) void handleUploadBackgroundImage(file);
}
</script>

<template>
  <ConfigSection
    v-if="showBackground !== false"
    :title="t('panel.config.sectionStyleBackground')"
    :open="backgroundOpen"
    :force-open="forceOpen"
    @update:open="emit('update:backgroundOpen', $event)"
  >
    <ConfigFieldGroup :title="t('panel.config.groupBgFill')">
      <ConfigColorField
        :label="t('panel.scope.fieldStyleBackgroundColor')"
        :value="element.style?.backgroundColor ?? ''"
        :disabled="!isEditable"
        @update:value="(v) => patchStyle({ backgroundColor: v || undefined })"
      />
    </ConfigFieldGroup>
    <ConfigFieldGroup
      :title="t('panel.config.groupBgLayout')"
      collapsible
      :default-open="false"
    >
      <label class="block space-y-1">
        <div>{{ t("panel.scope.fieldStyleBackgroundImage") }}</div>
        <Input
          size="small"
          :value="element.style?.backgroundImage ?? ''"
          :disabled="!isEditable"
          placeholder='url("https://...") / linear-gradient(...)'
          @update:value="(v: string) => patchStyle({ backgroundImage: v || undefined })"
        />
      </label>
      <div class="flex items-center gap-2">
        <label
          class="inline-flex cursor-pointer items-center rounded border border-gray-200 px-2 py-1 text-[11px] hover:bg-gray-50"
          :class="{ 'pointer-events-none opacity-50': !isEditable }"
        >
          {{ t("panel.config.uploadImage") }}
          <input
            type="file"
            accept="image/*"
            class="hidden"
            :disabled="!isEditable"
            @change="onFileChange"
          />
        </label>
        <span v-if="uploadStatus" class="text-[11px] text-gray-500">{{ uploadStatus }}</span>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <label class="block space-y-1">
          <div>{{ t("panel.scope.fieldStyleBackgroundSize") }}</div>
          <Select
            size="small"
            class="w-full"
            :value="element.style?.backgroundSize ?? '__none__'"
            :disabled="!isEditable"
            @update:value="(v) => patchStyle({ backgroundSize: v === '__none__' ? undefined : String(v) })"
          >
            <Select.Option value="__none__">{{ t("common.default") }}</Select.Option>
            <Select.Option value="cover">cover</Select.Option>
            <Select.Option value="contain">contain</Select.Option>
            <Select.Option value="100% 100%">100% 100%</Select.Option>
            <Select.Option value="auto">auto</Select.Option>
          </Select>
        </label>
        <label class="block space-y-1">
          <div>{{ t("panel.scope.fieldStyleBackgroundPosition") }}</div>
          <Select
            size="small"
            class="w-full"
            :value="element.style?.backgroundPosition ?? '__none__'"
            :disabled="!isEditable"
            @update:value="(v) => patchStyle({ backgroundPosition: v === '__none__' ? undefined : String(v) })"
          >
            <Select.Option value="__none__">{{ t("common.default") }}</Select.Option>
            <Select.Option value="center">center</Select.Option>
            <Select.Option value="top">top</Select.Option>
            <Select.Option value="bottom">bottom</Select.Option>
            <Select.Option value="left">left</Select.Option>
            <Select.Option value="right">right</Select.Option>
            <Select.Option value="top left">top left</Select.Option>
            <Select.Option value="top right">top right</Select.Option>
            <Select.Option value="bottom left">bottom left</Select.Option>
            <Select.Option value="bottom right">bottom right</Select.Option>
          </Select>
        </label>
      </div>
    </ConfigFieldGroup>
  </ConfigSection>

  <ConfigSection
    v-if="showBorder !== false"
    :title="t('panel.config.sectionStyleBorder')"
    :open="borderOpen"
    :force-open="forceOpen"
    @update:open="emit('update:borderOpen', $event)"
  >
    <ConfigFieldGroup :title="t('panel.config.groupBorderGeometry')">
      <div class="grid grid-cols-2 gap-2">
        <label class="block space-y-1">
          <div>{{ t("panel.config.borderWidth") }}</div>
          <Input
            size="small"
            type="number"
            :min="0"
            :value="String(element.style?.borderWidth ?? 0)"
            :disabled="!isEditable"
            @update:value="(v) => patchStyle({ borderWidth: Math.max(0, Number(v) || 0) })"
          />
        </label>
        <label class="block space-y-1">
          <div>{{ t("panel.config.borderRadius") }}</div>
          <Input
            size="small"
            type="number"
            :min="0"
            :value="String(element.style?.borderRadius ?? 0)"
            :disabled="!isEditable"
            @update:value="(v) => patchStyle({ borderRadius: Math.max(0, Number(v) || 0) })"
          />
        </label>
      </div>
    </ConfigFieldGroup>
    <ConfigFieldGroup :title="t('panel.config.groupBorderVisual')">
      <div class="grid grid-cols-2 gap-2">
        <label class="block space-y-1">
          <div>{{ t("panel.config.borderStyle") }}</div>
          <Select
            size="small"
            class="w-full"
            :value="element.style?.borderStyle ?? 'solid'"
            :disabled="!isEditable"
            @update:value="(v) => patchStyle({ borderStyle: v as PanelElementStyle['borderStyle'] })"
          >
            <Select.Option value="none">none</Select.Option>
            <Select.Option value="solid">solid</Select.Option>
            <Select.Option value="dashed">dashed</Select.Option>
            <Select.Option value="dotted">dotted</Select.Option>
            <Select.Option value="double">double</Select.Option>
          </Select>
        </label>
        <ConfigColorField
          :label="t('panel.scope.fieldStyleBorderColor')"
          :value="element.style?.borderColor ?? ''"
          :disabled="!isEditable"
          @update:value="(v) => patchStyle({ borderColor: v || undefined })"
        />
      </div>
    </ConfigFieldGroup>
  </ConfigSection>
</template>
