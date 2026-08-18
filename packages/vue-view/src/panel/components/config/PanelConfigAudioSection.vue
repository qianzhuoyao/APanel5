<script setup lang="ts">
import { useI18n } from "@arronqzy/i18n/vue";
import { onUnmounted, ref } from "vue";
import { Checkbox, Input, Select } from "ant-design-vue";
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

const audioStatus = ref("");
const isRecordingAudio = ref(false);
const recorderRef = ref<MediaRecorder | null>(null);
const recordStreamRef = ref<MediaStream | null>(null);
const audioChunksRef = ref<BlobPart[]>([]);

onUnmounted(() => {
  recordStreamRef.value?.getTracks().forEach((track) => track.stop());
});

function patch(patch: Partial<PanelElement>) {
  if (props.element.materialType !== "audio") return;
  props.updateElement(props.element.id, patch);
}

async function handleUploadAudioFile(file: File) {
  try {
    const base64 = await readFileAsDataUrl(file, msgs().readAudioFailed, "audio");
    patch({ audioSrc: base64 });
    audioStatus.value = msgs().audioLocalSaved;
    const url = await uploadFileToRemote(file);
    if (url) {
      patch({ audioRemoteUrl: url });
      audioStatus.value = msgs().audioRemoteUploaded;
    } else {
      audioStatus.value = msgs().audioServerUploadFailed;
    }
  } catch (error) {
    audioStatus.value = error instanceof Error ? error.message : msgs().readAudioFailed;
  }
}

async function handleUploadAudioPoster(file: File) {
  try {
    const base64 = await readFileAsDataUrl(file, msgs().readImageFailed);
    patch({ audioPosterImage: base64 });
    audioStatus.value = msgs().audioPosterSet;
  } catch (error) {
    audioStatus.value = error instanceof Error ? error.message : msgs().readImageFailed;
  }
}

function stopRecordingAudio() {
  recorderRef.value?.stop();
}

async function startRecordingAudio() {
  if (props.element.materialType !== "audio") return;
  if (!navigator.mediaDevices?.getUserMedia) {
    audioStatus.value = msgs().audioRecordUnsupported;
    return;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recordStreamRef.value = stream;
    const recorder = new MediaRecorder(stream);
    recorderRef.value = recorder;
    audioChunksRef.value = [];
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) audioChunksRef.value.push(event.data);
    };
    recorder.onstop = async () => {
      const blob = new Blob(audioChunksRef.value, {
        type: recorder.mimeType || "audio/webm",
      });
      try {
        const dataUrl = await readFileAsDataUrl(
          new File([blob], "recording.webm", { type: blob.type }),
          msgs().readRecordAudioFailed,
          "audio"
        );
        patch({ audioSrc: dataUrl });
        audioStatus.value = msgs().audioRecordSaved;
      } catch (error) {
        audioStatus.value =
          error instanceof Error ? error.message : msgs().readRecordAudioFailed;
      }
      recordStreamRef.value?.getTracks().forEach((track) => track.stop());
      recordStreamRef.value = null;
      recorderRef.value = null;
      isRecordingAudio.value = false;
    };
    recorder.start();
    isRecordingAudio.value = true;
    audioStatus.value = msgs().audioRecording;
  } catch {
    audioStatus.value = msgs().audioRecordStartFailed;
    isRecordingAudio.value = false;
  }
}

function onAudioFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  (e.target as HTMLInputElement).value = "";
  if (file) void handleUploadAudioFile(file);
}

function onPosterFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  (e.target as HTMLInputElement).value = "";
  if (file) void handleUploadAudioPoster(file);
}
</script>

<template>
  <ConfigSection
    :title="t('panel.config.sectionAudio')"
    :open="open"
    :force-open="forceOpen"
    @update:open="emit('update:open', $event)"
  >
    <ConfigFieldGroup :title="t('panel.config.groupAudioSource')">
      <label class="block space-y-1">
        <div>{{ t("panel.config.audioUrl") }}</div>
        <Input
          size="small"
          :value="element.audioRemoteUrl ?? ''"
          :disabled="!isEditable"
          placeholder="https://example.com/audio.mp3"
          @update:value="(v: string) => patch({
            audioRemoteUrl: v || undefined,
            audioSrc: v || element.audioSrc,
          })"
        />
      </label>
      <div class="flex items-center gap-2">
        <label
          class="inline-flex cursor-pointer items-center rounded border border-gray-200 px-2 py-1 text-[11px] hover:bg-gray-50"
          :class="{ 'pointer-events-none opacity-50': !isEditable }"
        >
          {{ t("panel.config.uploadAudio") }}
          <input type="file" accept="audio/*" class="hidden" :disabled="!isEditable" @change="onAudioFileChange" />
        </label>
        <button
          type="button"
          class="rounded border border-gray-200 px-2 py-1 text-[11px] hover:bg-gray-50 disabled:opacity-50"
          :disabled="!isEditable"
          @click="isRecordingAudio ? stopRecordingAudio() : startRecordingAudio()"
        >
          {{ isRecordingAudio ? t("panel.config.stopRecord") : t("panel.config.startRecord") }}
        </button>
      </div>
      <div
        v-if="audioStatus"
        class="rounded border border-gray-200/60 bg-white px-2 py-1.5 text-[11px] text-gray-500"
      >
        {{ audioStatus }}
      </div>
      <audio
        controls
        class="h-8 w-full"
        :src="element.audioSrc || element.audioRemoteUrl || ''"
      />
    </ConfigFieldGroup>
    <ConfigFieldGroup
      :title="t('panel.config.groupDisplayStyle')"
      collapsible
      :default-open="false"
    >
      <label class="flex items-center gap-2">
        <Checkbox
          :checked="element.mediaAutoPauseOnEdit !== false"
          :disabled="!isEditable"
          @update:checked="(v) => patch({ mediaAutoPauseOnEdit: v !== false })"
        />
        <span>{{ t("panel.config.autoPauseMedia") }}</span>
      </label>
      <label class="block space-y-1">
        <div>{{ t("panel.config.audioIconPreset") }}</div>
        <Select
          size="small"
          class="w-full"
          :value="element.audioIconPreset ?? '__none__'"
          :disabled="!isEditable"
          @update:value="(v) => patch({
            audioIconPreset: v === '__none__' ? undefined : v as PanelElement['audioIconPreset'],
          })"
        >
          <Select.Option value="__none__">{{ t("panel.config.iconDefaultProgress") }}</Select.Option>
          <Select.Option value="speaker">{{ t("panel.config.iconSpeaker") }}</Select.Option>
          <Select.Option value="music">{{ t("panel.config.iconMusic") }}</Select.Option>
          <Select.Option value="headphone">{{ t("panel.config.iconHeadphone") }}</Select.Option>
          <Select.Option value="wave">{{ t("panel.config.iconWave") }}</Select.Option>
        </Select>
      </label>
      <label class="block space-y-1">
        <div>{{ t("panel.config.visualEffect") }}</div>
        <Select
          size="small"
          class="w-full"
          :value="element.audioVisualEffect ?? 'pulse'"
          :disabled="!isEditable"
          @update:value="(v) => patch({ audioVisualEffect: v as PanelElement['audioVisualEffect'] })"
        >
          <Select.Option value="none">{{ t("panel.config.effectNone") }}</Select.Option>
          <Select.Option value="pulse">{{ t("panel.config.effectPulse") }}</Select.Option>
          <Select.Option value="ripple">{{ t("panel.config.effectRipple") }}</Select.Option>
        </Select>
      </label>
      <label class="block space-y-1">
        <div>{{ t("panel.config.effectSpeed") }}</div>
        <Select
          size="small"
          class="w-full"
          :value="element.audioVisualSpeed ?? 'normal'"
          :disabled="!isEditable"
          @update:value="(v) => patch({ audioVisualSpeed: v as PanelElement['audioVisualSpeed'] })"
        >
          <Select.Option value="slow">{{ t("panel.config.speedSlow") }}</Select.Option>
          <Select.Option value="normal">{{ t("panel.config.speedNormal") }}</Select.Option>
          <Select.Option value="fast">{{ t("panel.config.speedFast") }}</Select.Option>
        </Select>
      </label>
      <div class="flex items-center gap-2">
        <label
          class="inline-flex cursor-pointer items-center rounded border border-gray-200 px-2 py-1 text-[11px] hover:bg-gray-50"
          :class="{ 'pointer-events-none opacity-50': !isEditable }"
        >
          {{ t("panel.config.uploadPoster") }}
          <input type="file" accept="image/*" class="hidden" :disabled="!isEditable" @change="onPosterFileChange" />
        </label>
        <button
          type="button"
          class="rounded border border-gray-200 px-2 py-1 text-[11px] hover:bg-gray-50 disabled:opacity-50"
          :disabled="!isEditable"
          @click="patch({ audioPosterImage: undefined })"
        >
          {{ t("panel.config.clearPoster") }}
        </button>
      </div>
      <img
        v-if="element.audioPosterImage"
        :src="element.audioPosterImage"
        :alt="t('panel.config.audioPosterAlt')"
        class="h-20 w-full rounded border border-gray-200/60 object-cover"
      />
      <div class="flex items-center gap-1">
        <div class="text-[11px] text-gray-500">{{ t("panel.config.audioPoster") }}</div>
        <ConfigHintIcon :label="t('panel.config.audioPoster')">
          {{ t("panel.config.audioPosterHint") }}
        </ConfigHintIcon>
      </div>
    </ConfigFieldGroup>
  </ConfigSection>
</template>
