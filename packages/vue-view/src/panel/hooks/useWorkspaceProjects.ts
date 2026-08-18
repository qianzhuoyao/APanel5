import { computed, onMounted, onUnmounted, ref, shallowRef, toValue, watch, type MaybeRefOrGetter } from "vue";
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
import { runBusyTask } from "../utils/async-work";

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
  let syncedPanelRevision: unknown = null;
  let pendingRevisionSync = false;
  const previewWindows = new Map<string, Window>();
  const previewingProjectIds = ref<string[]>([]);
  let previewPollTimer: number | undefined;

  function refreshPreviewing() {
    const ids: string[] = [];
    for (const [id, win] of previewWindows) {
      if (!win.closed) ids.push(id);
      else previewWindows.delete(id);
    }
    previewingProjectIds.value = ids;
  }

  function resolveProjectName() {
    void locale.value;
    return toValue(options.productName).trim() || t("panel.defaults.unnamedProduct");
  }

  function buildCurrentSnapshot(): WorkspaceSnapshot {
    return {
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
    previewPollTimer = window.setInterval(refreshPreviewing, 2000);
  });

  onUnmounted(() => {
    if (previewPollTimer !== undefined) window.clearInterval(previewPollTimer);
  });

  watch(
    () => toValue(options.panelRevision),
    (revision) => {
      if (!pendingRevisionSync) return;
      syncedPanelRevision = revision;
      pendingRevisionSync = false;
    }
  );

  const dirty = computed(() => {
    if (!activeProjectId.value || !syncedSnapshotRef.value) return false;
    if (pendingRevisionSync) return false;
    void toValue(options.blueprintDocument);
    void toValue(options.blueprintMeta);
    void toValue(options.productName);
    void toValue(options.titleIconDataUrl);
    if (toValue(options.panelRevision) !== syncedPanelRevision) return true;
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
      blueprintDocument,
      blueprintMeta,
      productName: record.productName,
      titleIconDataUrl: record.titleIconDataUrl ?? "",
    });
    syncedPanelRevision = toValue(options.panelRevision);
    pendingRevisionSync = true;
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
    const snapshot = cloneWorkspaceSnapshot(buildCurrentSnapshot());
    const now = Date.now();
    const id = persistOptions.id ?? createWorkspaceProjectId();
    const createdAt = persistOptions.createdAt ?? now;
    const name = persistOptions.name.trim() || resolveProjectName();

    const record: WorkspaceProjectRecord = {
      id,
      name,
      createdAt,
      updatedAt: now,
      panelState: options.exportPanelData(),
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
    syncedSnapshotRef.value = snapshot;
    syncedPanelRevision = toValue(options.panelRevision);
    pendingRevisionSync = false;
    await refreshProjects();
    return record;
  }

  async function handleCreateProject() {
    return runBusyTask(t("common.savingWorkspace"), async () => {
      const name = resolveProjectName();
      const record = await persistProject({ name });
      return { name, id: record.id };
    });
  }

  async function handleSaveProject() {
    const projectId = activeProjectId.value;
    if (!projectId) {
      return handleCreateProject();
    }
    return runBusyTask(t("common.savingWorkspace"), async () => {
      const existing = await getWorkspaceProject(projectId);
      const name = resolveProjectName();
      const record = await persistProject({
        id: projectId,
        name,
        createdAt: existing?.createdAt,
      });
      return { name, id: record.id };
    });
  }

  async function handleOpenProject(id: string) {
    await runBusyTask(t("common.loadingWorkspace"), async () => {
      const record = await getWorkspaceProject(id);
      if (!record) {
        await refreshProjects();
        throw new Error(t("panel.messages.workspaceNotFound"));
      }
      applyProjectRecord(record);
    });
  }

  async function handleSyncProject() {
    return runBusyTask(t("common.syncingWorkspace"), async () => {
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
    });
  }

  async function handleDeleteProject(id: string) {
    await runBusyTask(t("common.deletingWorkspace"), async () => {
      await deleteWorkspaceProject(id);
      if (activeProjectId.value === id) {
        activeProjectId.value = null;
        activeProjectName.value = null;
        syncedSnapshotRef.value = null;
      }
      previewWindows.delete(id);
      refreshPreviewing();
      await refreshProjects();
    });
  }

  async function handlePreviewProject(id: string, previewOptions?: { syncFirst?: boolean }) {
    await runBusyTask(t("common.openingPreview"), async () => {
      if (previewOptions?.syncFirst && activeProjectId.value === id && dirty.value) {
        await handleSyncProject();
      }
      const record =
        (await getWorkspaceProject(id)) ?? readWorkspacePreviewCache(id);
      if (record) {
        writeWorkspacePreviewCache(record);
      }
      const existing = previewWindows.get(id);
      if (existing && !existing.closed) {
        try {
          existing.focus();
        } catch {
          /* ignore */
        }
        refreshPreviewing();
        return;
      }
      const win = window.open(
        buildOnlinePreviewUrl(id),
        `abuilder-preview-${id}`
      );
      if (win) {
        previewWindows.set(id, win);
        try {
          win.opener = null;
          win.focus();
        } catch {
          /* ignore */
        }
      }
      refreshPreviewing();
    });
  }

  return {
    projects,
    activeProjectId,
    activeProjectName,
    dirty,
    previewingProjectIds,
    handleCreateProject,
    handleSaveProject,
    handleOpenProject,
    handleSyncProject,
    handleDeleteProject,
    handlePreviewProject,
    refreshProjects,
  };
}
