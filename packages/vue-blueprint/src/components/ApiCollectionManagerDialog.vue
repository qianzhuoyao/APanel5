<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useI18n } from "@arronqzy/i18n/vue";
import { Button, Checkbox, Input, Modal } from "ant-design-vue";
import {
  downloadApiCollectionTemplate,
  getApiCollectionTemplateJson,
  type ApiCollectionRecord,
  type ApiCollectionSyncResult,
} from "@arronqzy/blueprint-dsl";

import {
  getApiCollectionRecords,
  removeApiCollection,
  subscribeApiCollections,
  upsertApiCollectionFromJson,
} from "../library/api-collection-store";

export type ApiCollectionUploadStartInfo = {
  fileNames: string[];
  count: number;
};

export type ApiCollectionUploadSuccessInfo = {
  collections: Array<{
    id: string;
    name: string;
    apiCount: number;
    persistLocal: boolean;
  }>;
};

export type ApiCollectionManagerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadStart?: (info: ApiCollectionUploadStartInfo) => void;
  onUploadSuccess?: (info: ApiCollectionUploadSuccessInfo) => void;
  onSyncCollection?: (
    record: ApiCollectionRecord
  ) => ApiCollectionSyncResult | Promise<ApiCollectionSyncResult>;
};

const props = defineProps<ApiCollectionManagerDialogProps>();

const emit = defineEmits<{
  uploadStart: [info: ApiCollectionUploadStartInfo];
  uploadSuccess: [info: ApiCollectionUploadSuccessInfo];
}>();

const { t } = useI18n();

function formatSyncResultMessage(result: ApiCollectionSyncResult): string {
  if (result.updatedCount <= 0) {
    return t("blueprint.apiCollection.syncNone");
  }
  const names = result.nodes.map((node) => node.label).join("、");
  return t("blueprint.apiCollection.syncSuccessDetail", {
    count: result.updatedCount,
    names,
  });
}
const fileInputRef = ref<HTMLInputElement | null>(null);
const records = ref<ApiCollectionRecord[]>([...getApiCollectionRecords()]);
const persistLocalDefault = ref(true);
const error = ref<string | null>(null);
const busy = ref(false);

const editorOpen = ref(false);
const editingId = ref<string | null>(null);
const editorJson = ref("");
const editorPersistLocal = ref(true);
const editorError = ref<string | null>(null);

watch(
  () => props.open,
  (open, _prev, onCleanup) => {
    if (!open) return;
    records.value = [...getApiCollectionRecords()];
    const unsubscribe = subscribeApiCollections(() => {
      records.value = [...getApiCollectionRecords()];
    });
    onCleanup(unsubscribe);
  }
);

const sorted = computed(() =>
  [...records.value].sort((a, b) => b.updatedAt - a.updatedAt)
);

function notifyUploadStart(info: ApiCollectionUploadStartInfo) {
  props.onUploadStart?.(info);
  emit("uploadStart", info);
}

function notifyUploadSuccess(info: ApiCollectionUploadSuccessInfo) {
  props.onUploadSuccess?.(info);
  emit("uploadSuccess", info);
}

function openCreateEditor() {
  editingId.value = null;
  editorJson.value = getApiCollectionTemplateJson();
  editorPersistLocal.value = persistLocalDefault.value;
  editorError.value = null;
  editorOpen.value = true;
}

function openEditEditor(record: ApiCollectionRecord) {
  editingId.value = record.id;
  editorJson.value = record.rawJson;
  editorPersistLocal.value = record.persistLocal;
  editorError.value = null;
  editorOpen.value = true;
}

async function handleSaveEditor() {
  busy.value = true;
  editorError.value = null;
  try {
    const result = await upsertApiCollectionFromJson({
      id: editingId.value ?? undefined,
      rawJson: editorJson.value,
      persistLocal: editorPersistLocal.value,
    });
    if (!result.ok) {
      editorError.value = result.error;
      return;
    }
    editorOpen.value = false;
  } finally {
    busy.value = false;
  }
}

async function handleDelete(id: string) {
  const ok = window.confirm(t("blueprint.apiCollection.confirmDelete"));
  if (!ok) return;
  busy.value = true;
  error.value = null;
  try {
    await removeApiCollection(id);
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err);
  } finally {
    busy.value = false;
  }
}

async function handleSync(record: ApiCollectionRecord) {
  if (!props.onSyncCollection) {
    error.value = t("blueprint.apiCollection.syncUnavailable");
    return;
  }
  busy.value = true;
  error.value = null;
  try {
    const result = await props.onSyncCollection(record);
    window.alert(formatSyncResultMessage(result));
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err);
  } finally {
    busy.value = false;
  }
}

async function handleSyncFromEditor() {
  busy.value = true;
  editorError.value = null;
  try {
    const result = await upsertApiCollectionFromJson({
      id: editingId.value ?? undefined,
      rawJson: editorJson.value,
      persistLocal: editorPersistLocal.value,
    });
    if (!result.ok) {
      editorError.value = result.error;
      return;
    }
    editingId.value = result.record.id;
    if (!props.onSyncCollection) {
      editorError.value = t("blueprint.apiCollection.syncUnavailable");
      return;
    }
    const syncResult = await props.onSyncCollection(result.record);
    window.alert(formatSyncResultMessage(syncResult));
  } catch (err) {
    editorError.value = err instanceof Error ? err.message : String(err);
  } finally {
    busy.value = false;
  }
}

async function handleFiles(files: FileList | null) {
  if (!files || files.length === 0) return;
  const list = Array.from(files);
  busy.value = true;
  error.value = null;
  notifyUploadStart({
    fileNames: list.map((file) => file.name),
    count: list.length,
  });

  const uploaded: ApiCollectionUploadSuccessInfo["collections"] = [];
  const errors: string[] = [];

  try {
    for (const file of list) {
      const text = await file.text();
      const result = await upsertApiCollectionFromJson({
        rawJson: text,
        persistLocal: persistLocalDefault.value,
        fallbackName: file.name,
      });
      if (!result.ok) {
        errors.push(`${file.name}: ${result.error}`);
        continue;
      }
      uploaded.push({
        id: result.record.id,
        name: result.record.name,
        apiCount: result.record.document.apis.length,
        persistLocal: result.record.persistLocal,
      });
    }
    if (uploaded.length > 0) {
      notifyUploadSuccess({ collections: uploaded });
    }
    if (errors.length > 0) {
      error.value = errors.join("\n");
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err);
  } finally {
    busy.value = false;
    if (fileInputRef.value) fileInputRef.value.value = "";
  }
}
</script>

<template>
  <Modal
    :open="open"
    :title="t('blueprint.apiCollection.managerTitle')"
    :footer="null"
    width="960px"
    :body-style="{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }"
    @update:open="onOpenChange"
  >
    <p class="mb-3 text-xs text-muted-foreground">
      {{ t("blueprint.apiCollection.managerDescription") }}
    </p>

    <div class="mb-2 flex flex-wrap items-center gap-2 border-b border-border/60 pb-3">
      <Button size="small" type="primary" :disabled="busy" @click="fileInputRef?.click()">
        {{ t("blueprint.apiCollection.upload") }}
      </Button>
      <Button size="small" :disabled="busy" @click="openCreateEditor">
        {{ t("blueprint.apiCollection.create") }}
      </Button>
      <Button size="small" @click="downloadApiCollectionTemplate()">
        {{ t("blueprint.apiCollection.downloadTemplate") }}
      </Button>
      <label class="ml-auto flex cursor-pointer items-center gap-2 text-[11px] text-muted-foreground">
        <Checkbox v-model:checked="persistLocalDefault" />
        {{ t("blueprint.apiCollection.persistLocal") }}
      </label>
      <input
        ref="fileInputRef"
        type="file"
        accept="application/json,.json"
        multiple
        class="hidden"
        @change="(e) => void handleFiles((e.target as HTMLInputElement).files)"
      />
    </div>

    <p class="mb-2 text-[11px] text-muted-foreground">
      {{ t("blueprint.apiCollection.persistLocalHint") }}
    </p>

    <pre
      v-if="error"
      class="mb-2 max-h-24 overflow-auto whitespace-pre-wrap rounded border border-destructive/40 bg-destructive/5 p-2 text-[11px] text-destructive"
    >{{ error }}</pre>

    <div class="min-h-0 flex-1 space-y-2 overflow-auto py-1">
      <p
        v-if="sorted.length === 0"
        class="py-8 text-center text-xs text-muted-foreground"
      >
        {{ t("blueprint.apiCollection.empty") }}
      </p>
      <div
        v-for="record in sorted"
        :key="record.id"
        class="flex items-start gap-2 rounded-md border border-border/70 bg-muted/20 px-2.5 py-2"
      >
        <div class="min-w-0 flex-1">
          <div class="truncate text-xs font-medium text-foreground">
            {{ record.name }}
          </div>
          <div class="mt-0.5 flex flex-wrap gap-x-2 text-[10px] text-muted-foreground">
            <span>
              {{
                t("blueprint.apiCollection.apiCount", {
                  count: record.document.apis.length,
                })
              }}
            </span>
            <span>
              {{
                record.persistLocal
                  ? t("blueprint.apiCollection.persisted")
                  : t("blueprint.apiCollection.memoryOnly")
              }}
            </span>
          </div>
        </div>
        <Button
          size="small"
          :disabled="busy || !onSyncCollection"
          :title="t('blueprint.apiCollection.syncHint')"
          @click="void handleSync(record)"
        >
          {{ t("blueprint.apiCollection.sync") }}
        </Button>
        <Button size="small" :disabled="busy" @click="openEditEditor(record)">
          {{ t("common.edit") }}
        </Button>
        <Button
          size="small"
          danger
          :disabled="busy"
          @click="void handleDelete(record.id)"
        >
          {{ t("common.delete") }}
        </Button>
      </div>
    </div>

    <div class="mt-4 flex justify-end">
      <Button @click="onOpenChange(false)">{{ t("common.close") }}</Button>
    </div>
  </Modal>

  <Modal
    :open="editorOpen"
    :title="
      editingId
        ? t('blueprint.apiCollection.editTitle')
        : t('blueprint.apiCollection.createTitle')
    "
    :footer="null"
    width="1100px"
    :style="{ top: '4vh' }"
    @update:open="(v) => (editorOpen = v)"
  >
    <p class="mb-3 text-xs text-muted-foreground">
      {{ t("blueprint.apiCollection.editorDescription") }}
    </p>

    <div class="space-y-2">
      <div class="flex items-center justify-between gap-2">
        <span class="text-xs">{{ t("blueprint.apiCollection.jsonEditor") }}</span>
        <label class="flex cursor-pointer items-center gap-2 text-[11px] text-muted-foreground">
          <Checkbox v-model:checked="editorPersistLocal" />
          {{ t("blueprint.apiCollection.persistLocal") }}
        </label>
      </div>
      <Input.TextArea
        v-model:value="editorJson"
        :rows="28"
        :spellcheck="false"
        class="!min-h-[62vh] font-mono text-[12px] leading-relaxed"
        :status="editorError ? 'error' : undefined"
      />
      <p v-if="editorError" class="text-[11px] text-destructive">{{ editorError }}</p>
    </div>

    <div class="mt-4 flex flex-wrap justify-end gap-2">
      <Button @click="downloadApiCollectionTemplate()">
        {{ t("blueprint.apiCollection.downloadTemplate") }}
      </Button>
      <Button
        :disabled="busy || !onSyncCollection"
        :title="t('blueprint.apiCollection.syncHint')"
        @click="void handleSyncFromEditor()"
      >
        {{ t("blueprint.apiCollection.sync") }}
      </Button>
      <Button @click="editorOpen = false">{{ t("common.cancel") }}</Button>
      <Button type="primary" :disabled="busy" @click="void handleSaveEditor()">
        {{ t("common.save") }}
      </Button>
    </div>
  </Modal>
</template>
