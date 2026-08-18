<script setup lang="ts">
import { computed, reactive, useTemplateRef } from "vue";
import { useI18n } from "@arronqzy/i18n/vue";
import { Button, Checkbox, Input, Select } from "ant-design-vue";
import {
  inferModelFormat,
  makeScene3dObjectKey,
  mergeScene3dConfig,
  purposePresetPatch,
  type Scene3dCameraAnimationRule,
  type Scene3dConfig,
  type Scene3dModelAnimationRule,
  type Scene3dObjectTag,
  type Scene3dPivot,
  type Scene3dPurpose,
} from "@arronqzy/view-scene3d";
import type { PanelElement } from "../../types";
import { readFileAsDataUrl } from "../../utils/async-work";
import { randomId } from "../../utils/panelElementDefaults";
import ConfigFieldGroup from "./ConfigFieldGroup.vue";
import ConfigSection from "./ConfigSection.vue";
import ConfigHintIcon from "../ConfigHintIcon.vue";

const { t } = useI18n();

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

const emit = defineEmits<{ "update:open": [value: boolean] }>();

const fileInputRef = useTemplateRef<HTMLInputElement>("fileInputRef");
const config = computed(() => mergeScene3dConfig(props.element.scene3d));
type CameraAnimPreset = "orbit" | "pushIn" | "pullBack" | "truckLeft" | "craneUp";

function patch(next: Partial<Scene3dConfig>) {
  props.updateElement(props.element.id, {
    scene3d: mergeScene3dConfig({ ...props.element.scene3d, ...next }),
  });
}

async function handleUploadModels(files: FileList | null) {
  if (!files?.length) return;
  const nextModels = [...config.value.models];
  for (const file of Array.from(files)) {
    try {
      const url = await readFileAsDataUrl(file, t("panel.messages.readModelFailed"), "model3d");
      nextModels.push({
        id: randomId("mdl"),
        label: file.name.replace(/\.[^.]+$/, "") || file.name,
        url,
        fileName: file.name,
        format: inferModelFormat(file.name),
      });
    } catch (error) {
      window.alert(error instanceof Error ? error.message : t("panel.messages.readModelFailed"));
    }
  }
  patch({ models: nextModels });
}

function updateModelAnimation(id: string, next: Partial<Scene3dModelAnimationRule>) {
  patch({
    modelAnimations: config.value.modelAnimations.map((rule) =>
      rule.id === id ? { ...rule, ...next } : rule
    ),
  });
}

function addModelAnimation() {
  const firstModel = config.value.models[0];
  const rule: Scene3dModelAnimationRule = {
    id: randomId("anim"),
    modelId: firstModel?.id ?? "",
    objectName: firstModel?.objectNames?.[0] ?? "",
    axis: "y",
    direction: "clockwise",
    pivot: "right",
    angleDeg: 90,
    durationSec: 1.2,
    loop: false,
  };
  patch({ modelAnimations: [...config.value.modelAnimations, rule] });
}

function updateCameraAnimation(id: string, next: Partial<Scene3dCameraAnimationRule>) {
  patch({
    cameraAnimations: config.value.cameraAnimations.map((rule) =>
      rule.id === id ? { ...rule, ...next } : rule
    ),
  });
}

function updateCameraAnimationOffset(
  rule: Scene3dCameraAnimationRule,
  index: number,
  value: string
) {
  const nextPos: [number, number, number] = [
    rule.to.position[0],
    rule.to.position[1],
    rule.to.position[2],
  ];
  nextPos[index] = rule.from.position[index] + (Number(value) || 0);
  updateCameraAnimation(rule.id, { to: { ...rule.to, position: nextPos } });
}

function addCameraAnimationPreset(preset: CameraAnimPreset) {
  const [px, py, pz] = config.value.camera.position;
  const [tx, ty, tz] = config.value.camera.target;
  const dx = tx - px;
  const dy = ty - py;
  const dz = tz - pz;
  const dist = Math.max(0.001, Math.hypot(dx, dy, dz));
  const nx = dx / dist;
  const ny = dy / dist;
  const nz = dz / dist;
  let rule: Scene3dCameraAnimationRule;

  if (preset === "pushIn") {
    rule = {
      id: randomId("cam"),
      label: t("panel.config.scene3dCameraAnimPushIn"),
      from: { ...config.value.camera },
      to: {
        ...config.value.camera,
        position: [px + nx * dist * 0.28, py + ny * dist * 0.28, pz + nz * dist * 0.28],
      },
      durationSec: 1.6,
      loop: false,
    };
  } else if (preset === "pullBack") {
    rule = {
      id: randomId("cam"),
      label: t("panel.config.scene3dCameraAnimPullBack"),
      from: { ...config.value.camera },
      to: {
        ...config.value.camera,
        position: [px - nx * dist * 0.35, py - ny * dist * 0.35, pz - nz * dist * 0.35],
      },
      durationSec: 1.8,
      loop: false,
    };
  } else if (preset === "truckLeft") {
    rule = {
      id: randomId("cam"),
      label: t("panel.config.scene3dCameraAnimTruckLeft"),
      from: { ...config.value.camera },
      to: {
        ...config.value.camera,
        position: [px - 1.6, py, pz],
        target: [tx - 1.6, ty, tz],
      },
      durationSec: 1.8,
      loop: false,
    };
  } else if (preset === "craneUp") {
    rule = {
      id: randomId("cam"),
      label: t("panel.config.scene3dCameraAnimCraneUp"),
      from: { ...config.value.camera },
      to: {
        ...config.value.camera,
        position: [px, py + 1.5, pz],
        target: [tx, ty + 0.6, tz],
      },
      durationSec: 1.8,
      loop: false,
    };
  } else {
    rule = {
      id: randomId("cam"),
      label: t("panel.config.scene3dCameraAnimDefault"),
      mode: "orbit",
      orbitSpeedDegPerSec: 24,
      from: { ...config.value.camera },
      to: {
        ...config.value.camera,
        position: [
          px + Math.max(1.5, dist * 0.32),
          py + Math.max(0.5, dist * 0.08),
          pz + Math.max(1, dist * 0.2),
        ],
      },
      durationSec: 6,
      loop: true,
      pingPong: false,
    };
  }
  patch({ cameraAnimations: [...config.value.cameraAnimations, rule] });
}

function addCameraAnimation() {
  addCameraAnimationPreset("orbit");
}

const nameQuery = reactive<Record<string, string>>({});
const openTagKeys = reactive<Record<string, boolean>>({});
const PIVOTS: Scene3dPivot[] = ["center", "top", "bottom", "left", "right", "front", "back"];

function filteredObjectNames(modelId: string, names: string[]) {
  const q = (nameQuery[modelId] ?? "").trim().toLowerCase();
  if (!q) return names;
  return names.filter((name) => name.toLowerCase().includes(q));
}

function selectObject(modelId: string, objectName: string) {
  const key = makeScene3dObjectKey(modelId, objectName);
  patch({ selectedObjectKey: config.value.selectedObjectKey === key ? null : key });
}

function toggleHidden(modelId: string, objectName: string) {
  const key = makeScene3dObjectKey(modelId, objectName);
  const hidden = new Set(config.value.hiddenObjectKeys ?? []);
  if (hidden.has(key)) hidden.delete(key);
  else hidden.add(key);
  patch({
    hiddenObjectKeys: [...hidden],
    soloObjectKey: config.value.soloObjectKey === key ? null : config.value.soloObjectKey,
  });
}

function toggleSolo(modelId: string, objectName: string) {
  const key = makeScene3dObjectKey(modelId, objectName);
  patch({
    soloObjectKey: config.value.soloObjectKey === key ? null : key,
    selectedObjectKey: key,
  });
}

function objectTag(modelId: string, objectName: string) {
  return (config.value.objectTags ?? []).find(
    (tag) => tag.modelId === modelId && tag.objectName === objectName
  );
}

function upsertObjectTag(modelId: string, objectName: string, next: Partial<Scene3dObjectTag>) {
  const tags = [...(config.value.objectTags ?? [])];
  const index = tags.findIndex((tag) => tag.modelId === modelId && tag.objectName === objectName);
  if (index >= 0) tags[index] = { ...tags[index], ...next };
  else {
    tags.push({
      id: randomId("tag"),
      modelId,
      objectName,
      html: "",
      anchor: "top",
      ...next,
    });
  }
  patch({ objectTags: tags });
}

function toggleTagEditor(modelId: string, objectName: string) {
  const key = makeScene3dObjectKey(modelId, objectName);
  openTagKeys[key] = !openTagKeys[key];
  if (!objectTag(modelId, objectName)) upsertObjectTag(modelId, objectName, {});
}

function isSelected(modelId: string, objectName: string) {
  return config.value.selectedObjectKey === makeScene3dObjectKey(modelId, objectName);
}

function isHidden(modelId: string, objectName: string) {
  return (config.value.hiddenObjectKeys ?? []).includes(makeScene3dObjectKey(modelId, objectName));
}

function isSolo(modelId: string, objectName: string) {
  return config.value.soloObjectKey === makeScene3dObjectKey(modelId, objectName);
}

function isTagOpen(modelId: string, objectName: string) {
  return Boolean(openTagKeys[makeScene3dObjectKey(modelId, objectName)]);
}

function setNameQuery(modelId: string, value: string) {
  nameQuery[modelId] = value;
}

function updateTagAnchor(modelId: string, objectName: string, value: string) {
  upsertObjectTag(modelId, objectName, { anchor: value as Scene3dPivot });
}

function onTagHtmlInput(modelId: string, objectName: string, event: Event) {
  const target = event.target;
  if (target instanceof HTMLTextAreaElement) updateTagHtml(modelId, objectName, target.value);
}
</script>

<template>
  <ConfigSection
    :title="t('panel.config.sectionScene3d')"
    :open="open"
    :force-open="forceOpen"
    @update:open="emit('update:open', $event)"
  >
    <ConfigFieldGroup :title="t('panel.config.groupScene3dPurpose')">
      <Select
        size="small"
        class="w-full"
        :disabled="!isEditable"
        :value="config.presentation.purpose"
        :options="[
          { value: 'product', label: t('panel.config.scene3dPurposeProduct') },
          { value: 'twin', label: t('panel.config.scene3dPurposeTwin') },
          { value: 'sandbox', label: t('panel.config.scene3dPurposeSandbox') },
        ]"
        @update:value="(v) => patch(purposePresetPatch(String(v) as Scene3dPurpose))"
      />
      <div class="text-[10px] text-gray-500">{{ t("panel.config.scene3dPurposeHint") }}</div>
    </ConfigFieldGroup>

    <ConfigFieldGroup :title="t('panel.config.groupScene3dModels')">
      <div class="flex justify-end">
        <Button size="small" :disabled="!isEditable" @click="fileInputRef?.click()">
          {{ t("panel.config.scene3dUploadModels") }}
        </Button>
        <input
          ref="fileInputRef"
          type="file"
          accept=".glb,.gltf,.obj,.fbx"
          multiple
          class="hidden"
          @change="(e) => { void handleUploadModels((e.target as HTMLInputElement).files); (e.target as HTMLInputElement).value = ''; }"
        />
      </div>
      <div v-if="config.models.length === 0" class="text-[11px] text-gray-500">
        {{ t("panel.config.scene3dNoModels") }}
      </div>
      <div v-for="model in config.models" :key="model.id" class="space-y-1 rounded border border-gray-200 p-2">
        <Input
          size="small"
          :disabled="!isEditable"
          :value="model.label"
          @update:value="(v: string) => patch({ models: config.models.map((m) => m.id === model.id ? { ...m, label: v } : m) })"
        />
        <div v-if="model.objectNames?.length" class="space-y-1">
          <details :open="model.objectNames.length <= 12">
            <summary class="cursor-pointer text-[10px] text-gray-500">
              {{ t("panel.config.scene3dObjectNames") }} · {{ t("panel.config.scene3dObjectCount", { n: model.objectNames.length }) }}
            </summary>
            <Input
              size="small"
              class="mt-1"
              :disabled="!isEditable"
              :placeholder="t('panel.config.scene3dSearchObject')"
              :value="nameQuery[model.id] ?? ''"
              @update:value="(v) => setNameQuery(model.id, String(v ?? ''))"
            />
            <div class="mt-1 max-h-44 overflow-auto rounded border border-gray-200">
              <div
                v-for="name in filteredObjectNames(model.id, model.objectNames)"
                :key="model.id + name"
                class="border-b border-gray-100 last:border-b-0"
                :class="{
                  'bg-sky-50': isSelected(model.id, name),
                  'opacity-50': isHidden(model.id, name) && !isSolo(model.id, name),
                }"
              >
                <div class="flex items-center gap-0.5 px-1 py-0.5">
                  <button type="button" class="min-w-0 flex-1 truncate text-left text-[10px]" @click="selectObject(model.id, name)">{{ name }}</button>
                  <Button size="small" type="text" :disabled="!isEditable" @click="toggleHidden(model.id, name)">
                    {{ isHidden(model.id, name) ? t("panel.config.scene3dShowShort") : t("panel.config.scene3dHideShort") }}
                  </Button>
                  <Button size="small" type="text" :disabled="!isEditable" @click="toggleSolo(model.id, name)">
                    {{ t("panel.config.scene3dSoloShort") }}
                  </Button>
                  <Button size="small" type="text" :disabled="!isEditable" @click="toggleTagEditor(model.id, name)">
                    {{ t("panel.config.scene3dTagShort") }}
                  </Button>
                </div>
                <div v-if="isTagOpen(model.id, name)" class="space-y-1 px-1 pb-1.5">
                  <Select
                    size="small"
                    class="w-full"
                    :disabled="!isEditable"
                    :value="objectTag(model.id, name)?.anchor ?? 'top'"
                    :options="PIVOTS.map((p) => ({ value: p, label: t(`panel.config.scene3dPivot_${p}`) }))"
                    @update:value="(v) => updateTagAnchor(model.id, name, String(v))"
                  />
                  <textarea
                    class="min-h-[64px] w-full rounded border border-gray-200 p-1 text-[10px]"
                    :disabled="!isEditable"
                    :placeholder="t('panel.config.scene3dObjectTagPlaceholder')"
                    :value="objectTag(model.id, name)?.html ?? ''"
                    @input="(e) => onTagHtmlInput(model.id, name, e)"
                  />
                </div>
              </div>
            </div>
          </details>
        </div>
        <div v-else class="text-[10px] text-gray-500">{{ t("panel.config.scene3dNoObjectNames") }}</div>
        <Button size="small" type="text" :disabled="!isEditable" @click="patch({ models: config.models.filter((m) => m.id !== model.id) })">
          {{ t("common.remove") }}
        </Button>
      </div>
    </ConfigFieldGroup>

    <ConfigFieldGroup :title="t('panel.config.groupScene3dCamera')">
      <div class="text-[10px] text-gray-500">{{ t("panel.config.scene3dCameraEditDesc") }}</div>
      <div class="grid grid-cols-3 gap-1">
        <Input
          v-for="(axis, index) in ['x', 'y', 'z']"
          :key="'pos-' + axis"
          size="small"
          type="number"
          :disabled="!isEditable"
          :value="String(config.camera.position[index])"
          @update:value="(v: string) => {
            const next = [...config.camera.position] as [number, number, number];
            next[index] = Number(v) || 0;
            patch({ camera: { ...config.camera, position: next } });
          }"
        />
      </div>
      <Checkbox
        :checked="config.orbit.enableMouseControl"
        :disabled="!isEditable"
        @update:checked="(v) => patch({ orbit: { ...config.orbit, enableMouseControl: Boolean(v) } })"
      >
        {{ t("panel.config.scene3dEnableMouseControl") }}
        <ConfigHintIcon :label="t('panel.config.scene3dEnableMouseControl')">
          {{ t("panel.config.scene3dEnableMouseControlHint") }}
        </ConfigHintIcon>
      </Checkbox>
    </ConfigFieldGroup>

    <ConfigFieldGroup :title="t('panel.config.groupScene3dModelAnim')">
      <Button size="small" :disabled="!isEditable" @click="addModelAnimation">{{ t("common.add") }}</Button>
      <div v-for="rule in config.modelAnimations" :key="rule.id" class="mt-2 space-y-1 rounded border border-gray-200 p-2">
        <Select
          size="small"
          class="w-full"
          :disabled="!isEditable"
          :value="rule.modelId"
          :options="config.models.map((m) => ({ value: m.id, label: m.label }))"
          @update:value="(v) => updateModelAnimation(rule.id, { modelId: String(v) })"
        />
        <Select
          size="small"
          class="w-full"
          :disabled="!isEditable"
          :value="rule.objectName"
          :options="(config.models.find((m) => m.id === rule.modelId)?.objectNames ?? []).map((n) => ({ value: n, label: n }))"
          @update:value="(v) => updateModelAnimation(rule.id, { objectName: String(v) })"
        />
        <div class="grid grid-cols-3 gap-1">
          <Select size="small" :disabled="!isEditable" :value="rule.axis" :options="[{value:'x',label:'X'},{value:'y',label:'Y'},{value:'z',label:'Z'}]" @update:value="(v) => updateModelAnimation(rule.id, { axis: v as 'x'|'y'|'z' })" />
          <Select size="small" :disabled="!isEditable" :value="rule.pivot" :options="['center','left','right','front','back','top','bottom'].map((p) => ({ value: p, label: t(`panel.config.scene3dPivot_${p}`) }))" @update:value="(v) => updateModelAnimation(rule.id, { pivot: v as typeof rule.pivot })" />
          <Select size="small" :disabled="!isEditable" :value="rule.direction" :options="[{value:'clockwise',label:t('panel.config.scene3dDirClockwise')},{value:'counterclockwise',label:t('panel.config.scene3dDirCounter')}]" @update:value="(v) => updateModelAnimation(rule.id, { direction: v as typeof rule.direction })" />
        </div>
        <Input size="small" type="number" :disabled="!isEditable" :value="String(rule.angleDeg)" @update:value="(v) => updateModelAnimation(rule.id, { angleDeg: Number(v) || 0 })" />
        <Button size="small" type="text" :disabled="!isEditable" @click="patch({ modelAnimations: config.modelAnimations.filter((a) => a.id !== rule.id) })">{{ t("common.remove") }}</Button>
      </div>
    </ConfigFieldGroup>

    <ConfigFieldGroup :title="t('panel.config.groupScene3dCameraAnim')">
      <Button size="small" :disabled="!isEditable" @click="addCameraAnimation">{{ t("common.add") }}</Button>
      <div class="mt-2 flex flex-wrap gap-1">
        <Button size="small" :disabled="!isEditable" @click="addCameraAnimationPreset('orbit')">{{ t("panel.config.scene3dCameraAnimDefault") }}</Button>
        <Button size="small" :disabled="!isEditable" @click="addCameraAnimationPreset('pushIn')">{{ t("panel.config.scene3dCameraAnimPushIn") }}</Button>
        <Button size="small" :disabled="!isEditable" @click="addCameraAnimationPreset('pullBack')">{{ t("panel.config.scene3dCameraAnimPullBack") }}</Button>
        <Button size="small" :disabled="!isEditable" @click="addCameraAnimationPreset('truckLeft')">{{ t("panel.config.scene3dCameraAnimTruckLeft") }}</Button>
        <Button size="small" :disabled="!isEditable" @click="addCameraAnimationPreset('craneUp')">{{ t("panel.config.scene3dCameraAnimCraneUp") }}</Button>
      </div>
      <div v-for="rule in config.cameraAnimations" :key="rule.id" class="mt-2 text-[10px] text-gray-600">
        <div>{{ rule.label ?? rule.id }} · {{ t("panel.config.scene3dCameraAnimDuration", { sec: rule.durationSec }) }}</div>
        <div v-if="rule.mode === 'orbit'" class="mt-1 grid grid-cols-1 gap-1">
          <Input
            size="small"
            type="number"
            :disabled="!isEditable"
            :value="String(rule.orbitSpeedDegPerSec ?? 24)"
            @update:value="(v) => updateCameraAnimation(rule.id, { orbitSpeedDegPerSec: Number(v) || 0 })"
          />
        </div>
        <div v-else class="mt-1 grid grid-cols-3 gap-1">
          <Input
            v-for="(axis, index) in ['x', 'y', 'z']"
            :key="'cam-offset-' + axis"
            size="small"
            type="number"
            :disabled="!isEditable"
            :value="String(Number((rule.to.position[index] - rule.from.position[index]).toFixed(3)))"
            @update:value="(v) => updateCameraAnimationOffset(rule, index, v)"
          />
        </div>
        <Button size="small" type="text" :disabled="!isEditable" @click="patch({ cameraAnimations: config.cameraAnimations.filter((a) => a.id !== rule.id) })">{{ t("common.remove") }}</Button>
      </div>
    </ConfigFieldGroup>
  </ConfigSection>
</template>
