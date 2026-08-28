import { computed, onMounted, onUnmounted, ref, shallowRef, toValue, watch, type MaybeRefOrGetter } from "vue";
import {
  BlueprintGraph,
  parseBlueprintData,
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
import { createEmptyPanelState, normalizeImportedPanelState } from "../utils/panelStateIO";
import { AbuilderEvents, emitAbuilderEvent } from "../library/event-subscription";

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
  /** 外部传入的初始工作区，挂载后自动加载（不触发 onProjectApplied） */
  initialWorkspace?: MaybeRefOrGetter<WorkspaceProjectRecord | null | undefined>;
  nameSpace?: MaybeRefOrGetter<string | null | undefined>;
};

export function buildOnlinePreviewUrl(
  projectId: string,
  nameSpace?: string | null
): string {
  const url = new URL(window.location.href);
  url.search = "";
  url.searchParams.set("preview", "online");
  url.searchParams.set("projectId", projectId);
  const ns = (nameSpace ?? "").trim();
  if (ns) url.searchParams.set("ns", ns);
  const previewInstanceId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `pv-${Date.now()}`;
  url.searchParams.set("pid", previewInstanceId);
  return url.toString();
}

function previewWindowName(projectId: string, nameSpace?: string | null): string {
  const ns = (nameSpace ?? "").trim();
  return ns ? `abuilder-preview-${ns}-${projectId}` : `abuilder-preview-${projectId}`;
}

function hasWorkspacePayload(
  record?: WorkspaceProjectRecord | null
): record is WorkspaceProjectRecord {
  if (!record || typeof record !== "object") return false;
  return Boolean(
    record.panelState ||
      record.blueprintDocument ||
      record.id ||
      record.productName ||
      record.titleIconDataUrl
  );
}

function workspaceApplyKey(record: WorkspaceProjectRecord): string {
  return `${record.id ?? "anon"}:${record.updatedAt ?? 0}`;
}

export function useWorkspaceProjects(options: UseWorkspaceProjectsOptions) {
  const { t, locale } = useI18nOptional();
  const nameSpace = () => toValue(options.nameSpace) ?? null;
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
    const name = toValue(options.productName);
    return (typeof name === "string" ? name : "").trim() || t("panel.defaults.unnamedProduct");
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
    projects.value = await listWorkspaceProjects(nameSpace());
  }

  watch(
    () => nameSpace(),
    () => {
      void refreshProjects();
    }
  );

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

  function applyProjectRecord(
    record: WorkspaceProjectRecord,
    applyOptions?: { notifyApplied?: boolean }
  ) {
    const parsedBlueprint = parseBlueprintData(record.blueprintDocument);
    const blueprintDocument =
      parsedBlueprint.value ?? BlueprintGraph.empty().document;
    const blueprintMeta: BlueprintMetaDraft = {
      name: record.blueprintMeta?.name ?? t("panel.defaults.unnamedBlueprint"),
      remark: record.blueprintMeta?.remark ?? "",
    };
    const panelState =
      normalizeImportedPanelState(record.panelState) ?? createEmptyPanelState();
    const productName =
      typeof record.productName === "string" && record.productName.trim()
        ? record.productName
        : t("panel.defaults.unnamedProduct");
    const titleIconDataUrl = record.titleIconDataUrl ?? "";

    options.importPanelData(panelState);
    options.setBlueprintGraph(BlueprintGraph.fromDocument(blueprintDocument));
    options.setBlueprintMeta(blueprintMeta);
    options.setProductName(productName);
    options.setTitleIconDataUrl(titleIconDataUrl);
    activeProjectId.value = record.id || null;
    activeProjectName.value = record.name ?? null;
    syncedSnapshotRef.value = cloneWorkspaceSnapshot({
      blueprintDocument,
      blueprintMeta,
      productName,
      titleIconDataUrl,
    });
    syncedPanelRevision = toValue(options.panelRevision);
    pendingRevisionSync = true;
    if (applyOptions?.notifyApplied !== false) {
      options.onProjectApplied?.({
        ...record,
        blueprintDocument,
        blueprintMeta,
        panelState,
        productName,
        titleIconDataUrl: titleIconDataUrl || undefined,
      });
    }
  }

  function applyEmptyWorkspace() {
    options.importPanelData(createEmptyPanelState());
    options.setBlueprintGraph(BlueprintGraph.empty());
    options.setBlueprintMeta({
      name: t("panel.defaults.unnamedBlueprint"),
      remark: "",
    });
    options.setProductName(t("panel.defaults.unnamedProduct"));
    options.setTitleIconDataUrl("");
    activeProjectId.value = null;
    activeProjectName.value = null;
    syncedSnapshotRef.value = null;
  }

  let bootstrapped = false;
  let appliedWorkspaceKey: string | null = null;

  function bootstrapInitialWorkspace() {
    const initialWorkspace = toValue(options.initialWorkspace) ?? null;
    if (!bootstrapped) {
      bootstrapped = true;
      if (hasWorkspacePayload(initialWorkspace)) {
        applyProjectRecord(initialWorkspace, { notifyApplied: false });
        appliedWorkspaceKey = workspaceApplyKey(initialWorkspace);
      } else {
        applyEmptyWorkspace();
      }
      return;
    }
    if (!hasWorkspacePayload(initialWorkspace)) return;
    const key = workspaceApplyKey(initialWorkspace);
    if (appliedWorkspaceKey === key) return;
    appliedWorkspaceKey = key;
    applyProjectRecord(initialWorkspace, { notifyApplied: false });
  }

  onMounted(() => {
    bootstrapInitialWorkspace();
    void refreshProjects();
    previewPollTimer = window.setInterval(refreshPreviewing, 2000);
  });

  watch(
    () => {
      const record = toValue(options.initialWorkspace);
      return record ? workspaceApplyKey(record) : "";
    },
    () => {
      bootstrapInitialWorkspace();
    }
  );

  async function persistProject(persistOptions: {
    id?: string;
    name: string;
    createdAt?: number;
  }) {
    const snapshot = cloneWorkspaceSnapshot(buildCurrentSnapshot());
    const now = Date.now();
    const id = persistOptions.id ?? createWorkspaceProjectId();
    const createdAt = persistOptions.createdAt ?? now;
    const name = (persistOptions.name ?? "").trim() || resolveProjectName();

    const record: WorkspaceProjectRecord = {
      id,
      name,
      createdAt,
      updatedAt: now,
      panelState: options.exportPanelData(),
      blueprintDocument: snapshot.blueprintDocument,
      blueprintMeta: snapshot.blueprintMeta,
      productName:
        typeof snapshot.productName === "string" ? snapshot.productName : resolveProjectName(),
      titleIconDataUrl: snapshot.titleIconDataUrl || undefined,
    };

    await putWorkspaceProject(record, nameSpace());
    writeWorkspacePreviewCache(record, nameSpace());
    broadcastWorkspaceProjectUpdate(id, now, nameSpace());
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
      emitAbuilderEvent(AbuilderEvents.workspaceAdd, record);
      return { name, id: record.id };
    });
  }

  async function handleSaveProject() {
    const projectId = activeProjectId.value;
    if (!projectId) {
      return handleCreateProject();
    }
    return runBusyTask(t("common.savingWorkspace"), async () => {
      const existing = await getWorkspaceProject(projectId, nameSpace());
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
      const record = await getWorkspaceProject(id, nameSpace());
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
      const existing = await getWorkspaceProject(activeProjectId.value, nameSpace());
      if (!existing) {
        activeProjectId.value = null;
        activeProjectName.value = null;
        syncedSnapshotRef.value = null;
        await refreshProjects();
        throw new Error(t("panel.messages.workspaceNotFound"));
      }
      const name = resolveProjectName() || existing.name;
      const record = await persistProject({
        id: activeProjectId.value,
        name,
        createdAt: existing.createdAt,
      });
      emitAbuilderEvent(AbuilderEvents.workspaceSync, record);
      return name;
    });
  }

  async function handleDeleteProject(id: string) {
    await runBusyTask(t("common.deletingWorkspace"), async () => {
      await deleteWorkspaceProject(id, nameSpace());
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
        (await getWorkspaceProject(id, nameSpace())) ??
        readWorkspacePreviewCache(id, nameSpace());
      if (record) {
        writeWorkspacePreviewCache(record, nameSpace());
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
      const ns = nameSpace();
      const win = window.open(
        buildOnlinePreviewUrl(id, ns),
        previewWindowName(id, ns)
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
