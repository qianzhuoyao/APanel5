import { computed, onMounted, ref, shallowRef, toValue, type MaybeRefOrGetter } from "vue";
import {
  BlueprintGraph,
  type BlueprintDocument,
  type BlueprintMetaDraft,
} from "@arronqzy/vue-blueprint";
import type { State } from "@arronqzy/rx-store";
import { useI18nOptional } from "@arronqzy/i18n/vue";
import {
  createWorkspaceProjectId,
  deleteWorkspaceProject,
  getWorkspaceProject,
  listWorkspaceProjects,
  putWorkspaceProject,
  type WorkspaceProjectListItem,
  type WorkspaceProjectRecord,
} from "../library/workspace-project-db";
import { broadcastWorkspaceProjectUpdate } from "../library/workspace-project-sync";
import { writeWorkspacePreviewCache, readWorkspacePreviewCache } from "../library/workspace-project-cache";
import {
  cloneWorkspaceSnapshot,
  workspaceSnapshotsEqual,
  type WorkspaceSnapshot,
} from "../library/workspace-snapshot";

export type UseWorkspaceProjectsOptions = {
  exportPanelData: () => State;
  importPanelData: (state: State) => boolean;
  blueprintDocument: MaybeRefOrGetter<BlueprintDocument>;
  blueprintMeta: MaybeRefOrGetter<BlueprintMetaDraft>;
  setBlueprintGraph: (graph: ReturnType<typeof BlueprintGraph.fromDocument>) => void;
  setBlueprintMeta: (meta: BlueprintMetaDraft) => void;
  productName: MaybeRefOrGetter<string>;
  setProductName: (name: string) => void;
  titleIconDataUrl: MaybeRefOrGetter<string>;
  setTitleIconDataUrl: (url: string) => void;
  /** 视图面板修订号，用于检测未同步修改 */
  panelRevision: MaybeRefOrGetter<unknown>;
  /** 工作区记录应用到编辑器后的回调（用于恢复蓝图面板等 UI 状态） */
  onProjectApplied?: (record: WorkspaceProjectRecord) => void;
};

export function buildOnlinePreviewUrl(projectId: string): string {
  const url = new URL(window.location.href);
  url.search = "";
  url.searchParams.set("preview", "online");
  url.searchParams.set("projectId", projectId);
  const previewInstanceId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `pv-${Date.now()}`;
  url.searchParams.set("pid", previewInstanceId);
  return url.toString();
}

export function useWorkspaceProjects(options: UseWorkspaceProjectsOptions) {
  const { t, locale } = useI18nOptional();
  const projects = ref<WorkspaceProjectListItem[]>([]);
  const activeProjectId = ref<string | null>(null);
  const activeProjectName = ref<string | null>(null);
  const syncedSnapshotRef = shallowRef<WorkspaceSnapshot | null>(null);

  function resolveProjectName() {
    void locale.value;
    return toValue(options.productName).trim() || t("panel.defaults.unnamedProduct");
  }

  function buildCurrentSnapshot(): WorkspaceSnapshot {
    return {
      panelState: options.exportPanelData(),
      blueprintDocument: toValue(options.blueprintDocument),
      blueprintMeta: { ...toValue(options.blueprintMeta) },
      productName: toValue(options.productName),
      titleIconDataUrl: toValue(options.titleIconDataUrl),
    };
  }

  async function refreshProjects() {
    projects.value = await listWorkspaceProjects();
  }

  onMounted(() => {
    void refreshProjects();
  });

  const dirty = computed(() => {
    if (!activeProjectId.value || !syncedSnapshotRef.value) return false;
    void toValue(options.panelRevision);
    void toValue(options.blueprintDocument);
    void toValue(options.blueprintMeta);
    void toValue(options.productName);
    void toValue(options.titleIconDataUrl);
    return !workspaceSnapshotsEqual(buildCurrentSnapshot(), syncedSnapshotRef.value);
  });

  function applyProjectRecord(record: WorkspaceProjectRecord) {
    const blueprintDocument =
      record.blueprintDocument ?? BlueprintGraph.empty().document;
    const blueprintMeta: BlueprintMetaDraft = {
      name: record.blueprintMeta?.name ?? t("panel.defaults.unnamedBlueprint"),
      remark: record.blueprintMeta?.remark ?? "",
    };

    options.importPanelData(record.panelState);
    options.setBlueprintGraph(BlueprintGraph.fromDocument(blueprintDocument));
    options.setBlueprintMeta(blueprintMeta);
    options.setProductName(record.productName);
    options.setTitleIconDataUrl(record.titleIconDataUrl ?? "");
    activeProjectId.value = record.id;
    activeProjectName.value = record.name;
    syncedSnapshotRef.value = cloneWorkspaceSnapshot({
      panelState: record.panelState,
      blueprintDocument,
      blueprintMeta,
      productName: record.productName,
      titleIconDataUrl: record.titleIconDataUrl ?? "",
    });
    options.onProjectApplied?.({
      ...record,
      blueprintDocument,
      blueprintMeta,
    });
  }

  async function persistProject(persistOptions: {
    id?: string;
    name: string;
    createdAt?: number;
  }) {
    const snapshot = buildCurrentSnapshot();
    const now = Date.now();
    const id = persistOptions.id ?? createWorkspaceProjectId();
    const createdAt = persistOptions.createdAt ?? now;
    const name = persistOptions.name.trim() || resolveProjectName();

    const record: WorkspaceProjectRecord = {
      id,
      name,
      createdAt,
      updatedAt: now,
      panelState: snapshot.panelState,
      blueprintDocument: snapshot.blueprintDocument,
      blueprintMeta: snapshot.blueprintMeta,
      productName: snapshot.productName,
      titleIconDataUrl: snapshot.titleIconDataUrl || undefined,
    };

    await putWorkspaceProject(record);
    writeWorkspacePreviewCache(record);
    broadcastWorkspaceProjectUpdate(id, now);
    activeProjectId.value = id;
    activeProjectName.value = name;
    syncedSnapshotRef.value = cloneWorkspaceSnapshot(snapshot);
    await refreshProjects();
    return record;
  }

  async function handleCreateProject() {
    const name = resolveProjectName();
    const record = await persistProject({ name });
    return { name, id: record.id };
  }

  async function handleSaveProject() {
    if (!activeProjectId.value) {
      return handleCreateProject();
    }
    const existing = await getWorkspaceProject(activeProjectId.value);
    const name = resolveProjectName();
    const record = await persistProject({
      id: activeProjectId.value,
      name,
      createdAt: existing?.createdAt,
    });
    return { name, id: record.id };
  }

  async function handleOpenProject(id: string) {
    const record = await getWorkspaceProject(id);
    if (!record) {
      await refreshProjects();
      throw new Error(t("panel.messages.workspaceNotFound"));
    }
    applyProjectRecord(record);
  }

  async function handleSyncProject() {
    if (!activeProjectId.value) {
      throw new Error(t("panel.messages.saveWorkspaceFirst"));
    }
    const existing = await getWorkspaceProject(activeProjectId.value);
    if (!existing) {
      activeProjectId.value = null;
      activeProjectName.value = null;
      syncedSnapshotRef.value = null;
      await refreshProjects();
      throw new Error(t("panel.messages.workspaceNotFound"));
    }
    const name = resolveProjectName() || existing.name;
    await persistProject({
      id: activeProjectId.value,
      name,
      createdAt: existing.createdAt,
    });
    return name;
  }

  async function handleDeleteProject(id: string) {
    await deleteWorkspaceProject(id);
    if (activeProjectId.value === id) {
      activeProjectId.value = null;
      activeProjectName.value = null;
      syncedSnapshotRef.value = null;
    }
    await refreshProjects();
  }

  async function handlePreviewProject(id: string, previewOptions?: { syncFirst?: boolean }) {
    if (previewOptions?.syncFirst && activeProjectId.value === id && dirty.value) {
      await handleSyncProject();
    }
    const record =
      (await getWorkspaceProject(id)) ?? readWorkspacePreviewCache(id);
    if (record) {
      writeWorkspacePreviewCache(record);
    }
    window.open(buildOnlinePreviewUrl(id), "_blank", "noopener,noreferrer");
  }

  return {
    projects,
    activeProjectId,
    activeProjectName,
    dirty,
    handleCreateProject,
    handleSaveProject,
    handleOpenProject,
    handleSyncProject,
    handleDeleteProject,
    handlePreviewProject,
    refreshProjects,
  };
}
