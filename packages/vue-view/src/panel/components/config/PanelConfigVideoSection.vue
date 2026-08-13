<script setup lang="ts">
import { useI18n } from "@arronqzy/i18n/vue";
import { ref } from "vue";
import { Checkbox, Input } from "ant-design-vue";
import type { PanelElement } from "../../types";
import { readFileAsDataUrl, uploadFileToRemote } from "./shared";
import { getPanelMessages } from "../../constants/messages";
import ConfigFieldGroup from "./ConfigFieldGroup.vue";
import ConfigSection from "./ConfigSection.vue";

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

const videoStatus = ref("");

function patch(patch: Partial<PanelElement>) {
  if (props.element.materialType !== "video") return;
  props.updateElement(props.element.id, patch);
}

async function handleUploadVideoFile(file: File) {
  const base64 = await readFileAsDataUrl(file, msgs().readVideoFailed);
  patch({ videoSrc: base64 });
  videoStatus.value = msgs().videoLocalSaved;
  const url = await uploadFileToRemote(file);
  if (url) {
    patch({ videoRemoteUrl: url });
    videoStatus.value = msgs().videoRemoteUploaded;
  } else {
    videoStatus.value = msgs().videoServerUploadFailed;
  }
}

function onVideoFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  (e.target as HTMLInputElement).value = "";
  if (file) void handleUploadVideoFile(file);
}
</script>

<template>
  <ConfigSection
    :title="t('panel.config.sectionVideo')"
    :open="open"
    :force-open="forceOpen"
    @update:open="emit('update:open', $event)"
  >
    <ConfigFieldGroup :title="t('panel.config.groupVideoSource')">
      <label class="block space-y-1">
        <div>{{ t("panel.config.videoUrl") }}</div>
        <Input
          size="small"
          :value="element.videoRemoteUrl ?? ''"
          :disabled="!isEditable"
          placeholder="https://example.com/video.mp4"
          @update:value="(v: string) => patch({
            videoRemoteUrl: v || undefined,
            videoSrc: v || element.videoSrc,
          })"
        />
      </label>
      <div class="flex items-center gap-2">
        <label
          class="inline-flex cursor-pointer items-center rounded border border-gray-200 px-2 py-1 text-[11px] hover:bg-gray-50"
          :class="{ 'pointer-events-none opacity-50': !isEditable }"
        >
          {{ t("panel.config.uploadVideo") }}
          <input type="file" accept="video/*" class="hidden" :disabled="!isEditable" @change="onVideoFileChange" />
        </label>
      </div>
      <div
        v-if="videoStatus"
        class="rounded border border-gray-200/60 bg-white px-2 py-1.5 text-[11px] text-gray-500"
      >
        {{ videoStatus }}
      </div>
      <video
        controls
        class="h-36 w-full rounded border border-gray-200/60 bg-black/80 object-contain"
        :src="element.videoSrc || element.videoRemoteUrl || ''"
      />
      <label class="flex items-center gap-2">
        <Checkbox
          :checked="element.mediaAutoPauseOnEdit !== false"
          :disabled="!isEditable"
          @update:checked="(v) => patch({ mediaAutoPauseOnEdit: v !== false })"
        />
        <span>{{ t("panel.config.autoPauseMedia") }}</span>
      </label>
    </ConfigFieldGroup>
  </ConfigSection>
</template>
