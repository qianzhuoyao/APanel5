<script setup lang="ts">
import { useI18n } from "@arronqzy/i18n/vue";
import { ref } from "vue";
import { Input, Select } from "ant-design-vue";
import type { PanelElement } from "../../types";
import { readFileAsDataUrl, uploadFileToRemote } from "./shared";
import { getPanelMessages } from "../../constants/messages";
import ConfigFieldGroup from "./ConfigFieldGroup.vue";
import ConfigSection from "./ConfigSection.vue";
import ConfigHintIcon from "../ConfigHintIcon.vue";

const { t, locale } = useI18n();
const msgs = () => getPanelMessages(t);

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

const uploadStatus = ref("");

function patchStyle(patch: Record<string, string | undefined>) {
  props.updateElement(props.element.id, {
    style: { ...(props.element.style ?? {}), ...patch },
  });
}

async function handleUploadImage(file: File) {
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
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = "";
  if (file) void handleUploadImage(file);
}
</script>

<template>
  <ConfigSection
    :title="t('panel.config.sectionImage')"
    :open="open"
    :force-open="forceOpen"
    @update:open="emit('update:open', $event)"
  >
    <ConfigFieldGroup :title="t('panel.config.groupImageSource')">
      <label class="block space-y-1">
        <div class="flex items-center gap-1">
          <span>{{ t("panel.config.imageUrlCss") }}</span>
          <ConfigHintIcon :label="t('panel.config.imageUrlHintLabel')">
            {{ t("panel.config.imageUrlHint") }}
          </ConfigHintIcon>
        </div>
        <Input
          size="small"
          :value="element.style?.backgroundImageRemoteUrl ?? element.style?.backgroundImage ?? ''"
          :disabled="!isEditable"
          placeholder="https://example.com/image.png"
          @update:value="(v: string) => {
            if (v.startsWith('url(')) {
              patchStyle({ backgroundImage: v, backgroundImageRemoteUrl: undefined });
            } else {
              patchStyle({
                backgroundImage: v ? `url('${v}')` : undefined,
                backgroundImageRemoteUrl: v || undefined,
              });
            }
          }"
        />
      </label>
      <div class="flex items-center gap-2">
        <label
          class="inline-flex cursor-pointer items-center rounded border border-gray-200 px-2 py-1 text-[11px] hover:bg-gray-50"
          :class="{ 'pointer-events-none opacity-50': !isEditable }"
        >
          {{ t("panel.config.uploadImage") }}
          <input type="file" accept="image/*" class="hidden" :disabled="!isEditable" @change="onFileChange" />
        </label>
        <span v-if="uploadStatus" class="text-[11px] text-gray-500">{{ uploadStatus }}</span>
      </div>
    </ConfigFieldGroup>
    <ConfigFieldGroup
      :title="t('panel.config.groupDisplayMode')"
      collapsible
      :default-open="false"
    >
      <label class="block space-y-1">
        <div>{{ t("panel.config.objectFitFull") }}</div>
        <Select
          size="small"
          class="w-full"
          :value="element.style?.backgroundSize ?? 'cover'"
          :disabled="!isEditable"
          @update:value="(v) => patchStyle({ backgroundSize: String(v) })"
        >
          <Select.Option value="cover">{{ t("panel.config.fitCover") }}</Select.Option>
          <Select.Option value="contain">{{ t("panel.config.fitContain") }}</Select.Option>
          <Select.Option value="100% 100%">{{ t("panel.config.fitFill") }}</Select.Option>
          <Select.Option value="auto">auto</Select.Option>
        </Select>
      </label>
      <label class="block space-y-1">
        <div>{{ t("panel.config.alignPosition") }}</div>
        <Select
          size="small"
          class="w-full"
          :value="element.style?.backgroundPosition ?? 'center'"
          :disabled="!isEditable"
          @update:value="(v) => patchStyle({ backgroundPosition: String(v) })"
        >
          <Select.Option value="center">center</Select.Option>
          <Select.Option value="top">top</Select.Option>
          <Select.Option value="bottom">bottom</Select.Option>
          <Select.Option value="left">left</Select.Option>
          <Select.Option value="right">right</Select.Option>
        </Select>
      </label>
    </ConfigFieldGroup>
  </ConfigSection>
</template>
