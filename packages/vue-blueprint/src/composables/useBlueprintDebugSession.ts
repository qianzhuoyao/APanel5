import { computed, ref, shallowRef, toValue, watch, type MaybeRefOrGetter } from "vue";
import {
  BlueprintGraphRunner,
  detectBlueprintReferenceCycle,
  type ExecutionRunRecord,
  type ExecutionTraceEntry,
  type LibraryBlueprintResolver,
} from "@arronqzy/blueprint-dsl";

import type { BlueprintGraph } from "../graph/blueprint-graph";
import {
  clearAllExecutionRunRecords,
  downloadExecutionRunExport,
  listExecutionRunRecords,
  purgeExecutionRunsOlderThan,
  putExecutionRunRecord,
  trimExecutionRunRecordsToMax,
} from "../library/execution-log-db";
import {
  readExecutionLogSettings,
  retentionCutoffMs,
  writeExecutionLogSettings,
  type ExecutionLogSettings,
} from "../library/execution-log-settings";
import { documentToRunnableGraph } from "../runtime/document-to-runnable-graph";
import { buildExecutionOverlay, shouldHaltDebugOnFalseSignal } from "../runtime/execution-overlay";
import { edgeListSignature } from "../graph/sync-edges";
import { nodeStructureSignature } from "../graph/sync-nodes";

export type LifecycleNodeOption = {
  id: string;
  label: string;
  phase?: string;
};

export type UseBlueprintDebugSessionOptions = {
  graph: MaybeRefOrGetter<BlueprintGraph>;
  blueprintId: MaybeRefOrGetter<string | null>;
  blueprintName: MaybeRefOrGetter<string>;
  resolveLibraryBlueprint?: LibraryBlueprintResolver;
  libraryNameById?: MaybeRefOrGetter<ReadonlyMap<string, string> | undefined>;
  onExecutionBlocked?: (message: string) => void;
  onViewScopeUpdate?: (viewElementIds: string[], scope: unknown) => void;
  nameSpace?: MaybeRefOrGetter<string | null | undefined>;
};

function buildNodeLabelMap(graph: BlueprintGraph): Record<string, string> {
  return Object.fromEntries(
    graph.document.nodes.map((node) => [node.id, node.label || node.id])
  );
}

function createRunId() {
  return `run_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function useBlueprintDebugSession(options: UseBlueprintDebugSessionOptions) {
  const runnerRef = shallowRef<BlueprintGraphRunner | null>(null);
  const runIdRef = shallowRef<string | null>(null);
  const runStartedAtRef = shallowRef(0);

  const selectedLifecycleNodeId = ref<string | null>(null);
  const entries = ref<ExecutionTraceEntry[]>([]);
  const chainComplete = ref(false);
  const logPanelOpen = ref(false);
  const running = ref(false);
  const settings = ref<ExecutionLogSettings>(
    readExecutionLogSettings(toValue(options.nameSpace))
  );
  const savedRuns = ref<ExecutionRunRecord[]>([]);
  const totalSavedRunCount = ref(0);

  const graph = computed(() => toValue(options.graph));
  const blueprintId = computed(() => toValue(options.blueprintId));
  const blueprintName = computed(() => toValue(options.blueprintName));
  const nameSpace = computed(() => toValue(options.nameSpace) ?? null);

  watch(nameSpace, (ns) => {
    settings.value = readExecutionLogSettings(ns);
  });

  const lifecycleNodes = computed<LifecycleNodeOption[]>(() =>
    graph.value.document.nodes
      .filter((node) => node.role === "lifecycle")
      .map((node) => ({
        id: node.id,
        label: node.label || node.id,
        phase: node.lifecyclePhase,
      }))
  );

  const hasLifecycleNodes = computed(() => lifecycleNodes.value.length > 0);

  const graphDebugSig = computed(
    () =>
      `${nodeStructureSignature(graph.value.document.nodes)}|${edgeListSignature(graph.value.document.edges)}`
  );

  const allowFalseSignalPropagation = computed(
    () => graph.value.document.allowFalseSignalPropagation ?? false
  );

  function buildRunnableGraph() {
    return documentToRunnableGraph(graph.value.document, {
      libraryNameById: toValue(options.libraryNameById),
    });
  }

  function syncRunnerGraphConfig() {
    const runner = runnerRef.value;
    if (!runner?.isDebugSessionActive()) return;
    runner.updateGraph(buildRunnableGraph());
    if (selectedLifecycleNodeId.value) {
      runner.refreshDebugLifecycleScope(selectedLifecycleNodeId.value);
    }
  }

  function syncRunnerWithLatestGraph() {
    syncRunnerGraphConfig();
    const runner = runnerRef.value;
    if (!runner?.isDebugSessionActive()) return;
    runner.refreshPendingQueueFromLatestGraph();
  }

  function resolveBlueprintName(id: string) {
    return toValue(options.libraryNameById)?.get(id) ?? id;
  }

  async function validateBlueprintGraph() {
    if (!options.resolveLibraryBlueprint) return true;
    const result = await detectBlueprintReferenceCycle({
      rootGraph: buildRunnableGraph(),
      rootLibraryBlueprintId: blueprintId.value,
      resolveLibraryBlueprint: options.resolveLibraryBlueprint,
      resolveBlueprintName,
    });
    if (!result.ok) {
      options.onExecutionBlocked?.(result.message);
      return false;
    }
    return true;
  }

  function ensureRunner() {
    const runner = new BlueprintGraphRunner(buildRunnableGraph(), {
      resolveLibraryBlueprint: options.resolveLibraryBlueprint,
      rootLibraryBlueprintId: blueprintId.value,
      resolveBlueprintName,
      onViewScopeUpdate: options.onViewScopeUpdate,
    });
    runnerRef.value = runner;
    return runner;
  }

  async function refreshSavedRuns() {
    const all = await listExecutionRunRecords(undefined, nameSpace.value);
    totalSavedRunCount.value = all.length;
    savedRuns.value = blueprintId.value
      ? all.filter((item) => item.blueprintId === blueprintId.value)
      : all;
  }

  watch(logPanelOpen, (open) => {
    if (open) void refreshSavedRuns();
  });

  async function enforceSavedRunLimits() {
    const cutoff = retentionCutoffMs(settings.value.retentionDays);
    await purgeExecutionRunsOlderThan(cutoff, nameSpace.value);
    await trimExecutionRunRecordsToMax(settings.value.maxSavedRuns, nameSpace.value);
    await refreshSavedRuns();
  }

  async function clearAllSavedRuns() {
    const removed = await clearAllExecutionRunRecords(nameSpace.value);
    savedRuns.value = [];
    totalSavedRunCount.value = 0;
    return removed;
  }

  function buildRunRecord(
    status: ExecutionRunRecord["status"],
    nextEntries: ExecutionTraceEntry[]
  ): ExecutionRunRecord {
    const lifecycleNode = lifecycleNodes.value.find(
      (item) => item.id === selectedLifecycleNodeId.value
    );
    return {
      runId: runIdRef.value ?? createRunId(),
      blueprintId: blueprintId.value,
      blueprintName: blueprintName.value,
      lifecycleNodeId: selectedLifecycleNodeId.value ?? "",
      lifecycleNodeLabel: lifecycleNode?.label,
      lifecyclePhase: lifecycleNode?.phase,
      startedAt: runStartedAtRef.value || Date.now(),
      finishedAt:
        status === "completed" || status === "failed" ? Date.now() : undefined,
      status,
      entries: nextEntries,
    };
  }

  async function persistRunIfNeeded(record: ExecutionRunRecord) {
    if (!settings.value.autoSave) return;
    await putExecutionRunRecord(record, nameSpace.value);
    await enforceSavedRunLimits();
  }

  function beginRun() {
    if (!selectedLifecycleNodeId.value) return null;
    runIdRef.value = createRunId();
    runStartedAtRef.value = Date.now();
    const runner = ensureRunner();
    runner.beginDebugSession(selectedLifecycleNodeId.value);
    chainComplete.value = false;
    return runner;
  }

  watch(graphDebugSig, () => {
    const runner = runnerRef.value;
    if (!runner?.isDebugSessionActive()) return;
    syncRunnerGraphConfig();
    runner.refreshPendingQueueFromLatestGraph();
  });

  watch(
    [entries, () => running.value, allowFalseSignalPropagation],
    () => {
      if (running.value) return;
      const halted = shouldHaltDebugOnFalseSignal(
        entries.value,
        allowFalseSignalPropagation.value
      );
      if (halted) {
        chainComplete.value = true;
        return;
      }
      const runner = runnerRef.value;
      if (
        runner?.isDebugSessionActive() &&
        runner.isDebugQueueEmpty() &&
        entries.value.length > 0
      ) {
        chainComplete.value = true;
      }
    },
    { deep: true }
  );

  async function runAll() {
    if (!selectedLifecycleNodeId.value) return;
    if (!(await validateBlueprintGraph())) return;
    running.value = true;
    logPanelOpen.value = true;
    try {
      const runner = beginRun();
      if (!runner) return;
      runner.updateGraph(buildRunnableGraph());
      runner.refreshDebugLifecycleScope(selectedLifecycleNodeId.value);
      const labels = buildNodeLabelMap(graph.value);
      const onProgress = (trace: ExecutionTraceEntry[]) => {
        entries.value = [...trace];
      };
      const result = await runner.debugRunAll(labels, onProgress);
      entries.value = result;
      chainComplete.value =
        shouldHaltDebugOnFalseSignal(result, allowFalseSignalPropagation.value) ||
        (runner.isDebugQueueEmpty() && result.length > 0);
      await persistRunIfNeeded(buildRunRecord("completed", result));
    } finally {
      running.value = false;
    }
  }

  async function stepNext() {
    if (
      !selectedLifecycleNodeId.value ||
      chainComplete.value ||
      shouldHaltDebugOnFalseSignal(entries.value, allowFalseSignalPropagation.value)
    ) {
      return;
    }
    running.value = true;
    logPanelOpen.value = true;
    try {
      let runner: BlueprintGraphRunner | null = runnerRef.value;
      if (!runner?.isDebugSessionActive()) {
        if (!(await validateBlueprintGraph())) return;
        const started = beginRun();
        if (!started) return;
        runner = started;
      } else {
        syncRunnerWithLatestGraph();
      }
      if (runner.isDebugQueueEmpty()) {
        chainComplete.value = true;
        return;
      }
      const labels = buildNodeLabelMap(graph.value);
      const onProgress = (trace: ExecutionTraceEntry[]) => {
        entries.value = [...trace];
      };
      const { done, haltedByFalseSignal } = await runner.debugStep(labels, onProgress);
      const nextEntries = runner.getTraceEntries();
      entries.value = nextEntries;
      chainComplete.value = done || haltedByFalseSignal === true;
      if (done) {
        await persistRunIfNeeded(buildRunRecord("completed", nextEntries));
      }
    } finally {
      running.value = false;
    }
  }

  function stepBack() {
    if (!selectedLifecycleNodeId.value) return;
    const runner = runnerRef.value;
    if (!runner?.isDebugSessionActive() || !runner.canDebugStepBack()) return;
    running.value = true;
    logPanelOpen.value = true;
    try {
      runner.debugStepBack();
      const nextEntries = runner.getTraceEntries();
      entries.value = nextEntries;
      chainComplete.value =
        shouldHaltDebugOnFalseSignal(nextEntries, allowFalseSignalPropagation.value) ||
        (runner.isDebugSessionActive() && runner.isDebugQueueEmpty());
    } finally {
      running.value = false;
    }
  }

  function resetToStart() {
    if (!selectedLifecycleNodeId.value || entries.value.length === 0) return;
    const runner = runnerRef.value;
    if (!runner?.isDebugSessionActive()) return;
    running.value = true;
    logPanelOpen.value = true;
    try {
      syncRunnerWithLatestGraph();
      runner.beginDebugSession(selectedLifecycleNodeId.value);
      entries.value = [];
      chainComplete.value = false;
    } finally {
      running.value = false;
    }
  }

  const falseSignalHalt = computed(() =>
    shouldHaltDebugOnFalseSignal(entries.value, allowFalseSignalPropagation.value)
  );
  const canResetToStart = computed(() => entries.value.length > 0);
  const canStepBack = computed(() => entries.value.length > 0);
  const canStepNext = computed(
    () =>
      Boolean(selectedLifecycleNodeId.value) &&
      !chainComplete.value &&
      !falseSignalHalt.value
  );

  async function saveCurrentRun() {
    if (entries.value.length === 0) return;
    const record = buildRunRecord(
      runnerRef.value?.isDebugQueueEmpty() ? "completed" : "paused",
      entries.value
    );
    await putExecutionRunRecord(record, nameSpace.value);
    await enforceSavedRunLimits();
  }

  function exportCurrentRun() {
    if (entries.value.length === 0) return;
    downloadExecutionRunExport(
      buildRunRecord(
        runnerRef.value?.isDebugQueueEmpty() ? "completed" : "paused",
        entries.value
      )
    );
  }

  function updateSettings(patch: Partial<ExecutionLogSettings>) {
    const next = { ...settings.value, ...patch };
    settings.value = next;
    writeExecutionLogSettings(next, nameSpace.value);
    if (patch.maxSavedRuns !== undefined) {
      const maxSavedRuns = Math.max(1, Math.floor(patch.maxSavedRuns));
      void trimExecutionRunRecordsToMax(maxSavedRuns, nameSpace.value).then(() => refreshSavedRuns());
    }
  }

  function resetSession() {
    runnerRef.value?.clearDebugSession();
    runnerRef.value = null;
    runIdRef.value = null;
    entries.value = [];
    chainComplete.value = false;
  }

  function abortClock(nodeId: string) {
    runnerRef.value?.abortClockNode(nodeId);
  }

  function selectLifecycleNode(nodeId: string | null) {
    selectedLifecycleNodeId.value = nodeId;
    resetSession();
  }

  const executionOverlay = computed(() =>
    buildExecutionOverlay(graph.value, entries.value)
  );

  return {
    lifecycleNodes,
    hasLifecycleNodes,
    selectedLifecycleNodeId,
    selectLifecycleNode,
    entries,
    executionOverlay,
    logPanelOpen,
    setLogPanelOpen: (value: boolean | ((prev: boolean) => boolean)) => {
      logPanelOpen.value = typeof value === "function" ? value(logPanelOpen.value) : value;
    },
    running,
    runAll,
    resetToStart,
    stepNext,
    stepBack,
    canResetToStart,
    canStepBack,
    canStepNext,
    falseSignalHalt,
    allowFalseSignalPropagation,
    chainComplete,
    saveCurrentRun,
    exportCurrentRun,
    settings,
    updateSettings,
    savedRuns,
    refreshSavedRuns,
    applyRetention: enforceSavedRunLimits,
    clearAllSavedRuns,
    resetSession,
    clearLog: resetSession,
    totalSavedRunCount,
    abortClock,
  };
}

export type UseBlueprintDebugSessionReturn = ReturnType<typeof useBlueprintDebugSession>;
