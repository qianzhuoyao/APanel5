<script setup lang="ts">
import { onUnmounted, ref } from "vue";
import { Checkbox, Input, Select } from "ant-design-vue";
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
  const base64 = await readFileAsDataUrl(file, PANEL_MESSAGES.readAudioFailed);
  patch({ audioSrc: base64 });
  audioStatus.value = PANEL_MESSAGES.audioLocalSaved;
  const url = await uploadFileToRemote(file);
  if (url) {
    patch({ audioRemoteUrl: url });
    audioStatus.value = PANEL_MESSAGES.audioRemoteUploaded;
  } else {
    audioStatus.value = PANEL_MESSAGES.audioServerUploadFailed;
  }
}

async function handleUploadAudioPoster(file: File) {
  const base64 = await readFileAsDataUrl(file, PANEL_MESSAGES.readImageFailed);
  patch({ audioPosterImage: base64 });
  audioStatus.value = PANEL_MESSAGES.audioPosterSet;
}

function stopRecordingAudio() {
  recorderRef.value?.stop();
}

async function startRecordingAudio() {
  if (props.element.materialType !== "audio") return;
  if (!navigator.mediaDevices?.getUserMedia) {
    audioStatus.value = PANEL_MESSAGES.audioRecordUnsupported;
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
      const dataUrl = await readFileAsDataUrl(
        new File([blob], "recording.webm", { type: blob.type }),
        PANEL_MESSAGES.readRecordAudioFailed
      );
      patch({ audioSrc: dataUrl });
      audioStatus.value = PANEL_MESSAGES.audioRecordSaved;
      recordStreamRef.value?.getTracks().forEach((track) => track.stop());
      recordStreamRef.value = null;
      recorderRef.value = null;
      isRecordingAudio.value = false;
    };
    recorder.start();
    isRecordingAudio.value = true;
    audioStatus.value = PANEL_MESSAGES.audioRecording;
  } catch {
    audioStatus.value = PANEL_MESSAGES.audioRecordStartFailed;
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
    title="音频配置"
    :open="open"
    :force-open="forceOpen"
    @update:open="emit('update:open', $event)"
  >
    <ConfigFieldGroup title="音频来源">
      <label class="block space-y-1">
        <div>音频 URL</div>
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
          上传音频
          <input type="file" accept="audio/*" class="hidden" :disabled="!isEditable" @change="onAudioFileChange" />
        </label>
        <button
          type="button"
          class="rounded border border-gray-200 px-2 py-1 text-[11px] hover:bg-gray-50 disabled:opacity-50"
          :disabled="!isEditable"
          @click="isRecordingAudio ? stopRecordingAudio() : startRecordingAudio()"
        >
          {{ isRecordingAudio ? "停止录音" : "开始录音" }}
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
    <ConfigFieldGroup title="展示样式">
      <label class="flex items-center gap-2">
        <Checkbox
          :checked="element.mediaAutoPauseOnEdit !== false"
          :disabled="!isEditable"
          @update:checked="(v) => patch({ mediaAutoPauseOnEdit: v !== false })"
        />
        <span>编辑时自动暂停媒体</span>
      </label>
      <label class="block space-y-1">
        <div>预设喇叭图标</div>
        <Select
          size="small"
          class="w-full"
          :value="element.audioIconPreset ?? '__none__'"
          :disabled="!isEditable"
          @update:value="(v) => patch({
            audioIconPreset: v === '__none__' ? undefined : v as PanelElement['audioIconPreset'],
          })"
        >
          <Select.Option value="__none__">默认（显示进度条）</Select.Option>
          <Select.Option value="speaker">喇叭</Select.Option>
          <Select.Option value="music">音符</Select.Option>
          <Select.Option value="headphone">耳机</Select.Option>
          <Select.Option value="wave">声波</Select.Option>
        </Select>
      </label>
      <label class="block space-y-1">
        <div>播放动效</div>
        <Select
          size="small"
          class="w-full"
          :value="element.audioVisualEffect ?? 'pulse'"
          :disabled="!isEditable"
          @update:value="(v) => patch({ audioVisualEffect: v as PanelElement['audioVisualEffect'] })"
        >
          <Select.Option value="none">无动效</Select.Option>
          <Select.Option value="pulse">呼吸高亮</Select.Option>
          <Select.Option value="ripple">波纹扩散</Select.Option>
        </Select>
      </label>
      <label class="block space-y-1">
        <div>动效速度</div>
        <Select
          size="small"
          class="w-full"
          :value="element.audioVisualSpeed ?? 'normal'"
          :disabled="!isEditable"
          @update:value="(v) => patch({ audioVisualSpeed: v as PanelElement['audioVisualSpeed'] })"
        >
          <Select.Option value="slow">慢</Select.Option>
          <Select.Option value="normal">中</Select.Option>
          <Select.Option value="fast">快</Select.Option>
        </Select>
      </label>
      <div class="flex items-center gap-2">
        <label
          class="inline-flex cursor-pointer items-center rounded border border-gray-200 px-2 py-1 text-[11px] hover:bg-gray-50"
          :class="{ 'pointer-events-none opacity-50': !isEditable }"
        >
          上传占位图
          <input type="file" accept="image/*" class="hidden" :disabled="!isEditable" @change="onPosterFileChange" />
        </label>
        <button
          type="button"
          class="rounded border border-gray-200 px-2 py-1 text-[11px] hover:bg-gray-50 disabled:opacity-50"
          :disabled="!isEditable"
          @click="patch({ audioPosterImage: undefined })"
        >
          清空占位图
        </button>
      </div>
      <img
        v-if="element.audioPosterImage"
        :src="element.audioPosterImage"
        alt="音频占位图预览"
        class="h-20 w-full rounded border border-gray-200/60 object-cover"
      />
      <div class="flex items-center gap-1">
        <div class="text-[11px] text-gray-500">音频占位图</div>
        <ConfigHintIcon label="音频占位图">
          设置占位图或图标后，节点上将隐藏进度条，改为点击图标播放/暂停。
        </ConfigHintIcon>
      </div>
    </ConfigFieldGroup>
  </ConfigSection>
</template>
