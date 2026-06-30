<script setup lang="ts">
import { ref } from "vue";
import { Input, Select } from "ant-design-vue";
import type { PanelElement } from "../../types";
import {
  PANEL_MESSAGES,
  readFileAsDataUrl,
  uploadFileToRemote,
} from "./shared";
import ConfigFieldGroup from "./ConfigFieldGroup.vue";
import ConfigSection from "./ConfigSection.vue";
import ConfigHintIcon from "../ConfigHintIcon.vue";

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
  const base64 = await readFileAsDataUrl(file, PANEL_MESSAGES.readImageFailed);
  patchStyle({ backgroundImage: `url("${base64}")` });
  uploadStatus.value = "已写入 base64";
  const url = await uploadFileToRemote(file);
  if (url) {
    patchStyle({ backgroundImageRemoteUrl: url });
    uploadStatus.value = "已上传服务器并写入 base64";
  } else {
    uploadStatus.value = "服务器上传失败，仅保留 base64";
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
    title="图片配置"
    :open="open"
    :force-open="forceOpen"
    @update:open="emit('update:open', $event)"
  >
    <ConfigFieldGroup title="图片来源">
      <label class="block space-y-1">
        <div class="flex items-center gap-1">
          <span>图片 URL / CSS</span>
          <ConfigHintIcon label="图片地址">
            可填写远程 URL 或 url("data:...") 形式；上传后会自动写入 base64。
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
          上传图片
          <input type="file" accept="image/*" class="hidden" :disabled="!isEditable" @change="onFileChange" />
        </label>
        <span v-if="uploadStatus" class="text-[11px] text-gray-500">{{ uploadStatus }}</span>
      </div>
    </ConfigFieldGroup>
    <ConfigFieldGroup title="显示方式">
      <label class="block space-y-1">
        <div>适应方式（object-fit / background-size）</div>
        <Select
          size="small"
          class="w-full"
          :value="element.style?.backgroundSize ?? 'cover'"
          :disabled="!isEditable"
          @update:value="(v) => patchStyle({ backgroundSize: String(v) })"
        >
          <Select.Option value="cover">cover（裁剪铺满）</Select.Option>
          <Select.Option value="contain">contain（完整显示）</Select.Option>
          <Select.Option value="100% 100%">fill（拉伸填满）</Select.Option>
          <Select.Option value="auto">auto</Select.Option>
        </Select>
      </label>
      <label class="block space-y-1">
        <div>对齐位置</div>
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
