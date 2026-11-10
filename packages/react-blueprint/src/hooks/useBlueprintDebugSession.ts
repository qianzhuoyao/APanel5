import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BlueprintGraphRunner,
  detectBlueprintReferenceCycle,
  findEmittableLifecycleNodeId,
  LIFECYCLE_NODE_TYPE,
  shouldEmitLifecycleNode,
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
  /** 同阶段多个时：false 表示停用，不可作为调试起点 */
  enabled: boolean;
  /** 当前是否可发出信号（单独存在或已启用） */
  canEmit: boolean;
};

export type UseBlueprintDebugSessionOptions = {
  graph: BlueprintGraph;
  blueprintId: string | null;
  blueprintName: string;
  resolveLibraryBlueprint?: LibraryBlueprintResolver;
  libraryNameById?: ReadonlyMap<string, string>;
  /** 检测到蓝图相互引用死循环时回调 */
  onExecutionBlocked?: (message: string) => void;
  /** 视图绑定节点收到真信号时，为关联视图元素写入 scope */
  onViewScopeUpdate?: (
    viewElementIds: string[],
    scope: unknown
  ) => void;
  /** 隔离 IndexedDB / localStorage；空则用全局库 */
  nameSpace?: string | null;
};

function buildNodeLabelMap(graph: BlueprintGraph): Record<string, string> {
  return Object.fromEntries(
    graph.document.nodes.map((node) => [node.id, node.label || node.id])
  );
}

function createRunId() {
  return `run_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function useBlueprintDebugSession({
  graph,
  blueprintId,
  blueprintName,
  resolveLibraryBlueprint,
  libraryNameById,
  onExecutionBlocked,
  onViewScopeUpdate,
  nameSpace = null,
}: UseBlueprintDebugSessionOptions) {
  const runnerRef = useRef<BlueprintGraphRunner | null>(null);
  const runIdRef = useRef<string | null>(null);
  const runStartedAtRef = useRef<number>(0);

  const [selectedLifecycleNodeId, setSelectedLifecycleNodeId] = useState<
    string | null
  >(null);
  const [entries, setEntries] = useState<ExecutionTraceEntry[]>([]);
  const [chainComplete, setChainComplete] = useState(false);
  const [logPanelOpen, setLogPanelOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [settings, setSettings] = useState<ExecutionLogSettings>(() =>
    readExecutionLogSettings(nameSpace)
  );

  useEffect(() => {
    setSettings(readExecutionLogSettings(nameSpace));
  }, [nameSpace]);
  const [savedRuns, setSavedRuns] = useState<ExecutionRunRecord[]>([]);
  const [totalSavedRunCount, setTotalSavedRunCount] = useState(0);

  const lifecycleNodes = useMemo<LifecycleNodeOption[]>(() => {
    const nodes = graph.document.nodes;
    return nodes
      .filter((node) => node.role === "lifecycle")
      .map((node) => {
        const canEmit = shouldEmitLifecycleNode(
          node,
          nodes,
          LIFECYCLE_NODE_TYPE
        );
        return {
          id: node.id,
          label: node.label || node.id,
          phase: node.lifecyclePhase,
          enabled: node.lifecycleEnabled !== false,
          canEmit,
        };
      });
  }, [graph.document.nodes]);

  const hasLifecycleNodes = lifecycleNodes.length > 0;

  // 互斥切换后：若当前选中的已停用，自动切到同阶段可发出信号的节点；全部停用则清空选中（只纠正一次）
  useEffect(() => {
    if (!selectedLifecycleNodeId) return;
    const selected = lifecycleNodes.find(
      (node) => node.id === selectedLifecycleNodeId
    );
    if (selected?.canEmit) return;
    const nextId = findEmittableLifecycleNodeId(
      graph.document.nodes,
      selectedLifecycleNodeId,
      LIFECYCLE_NODE_TYPE
    );
    if (nextId === selectedLifecycleNodeId) return;
    setSelectedLifecycleNodeId(nextId);
    // 全部停用时 nextId 为 null：清掉调试高亮；用 bailout 避免无意义重渲染导致步进按钮闪烁
    runnerRef.current?.clearDebugSession();
    runnerRef.current = null;
    runIdRef.current = null;
    setEntries((prev) => (prev.length === 0 ? prev : []));
    setChainComplete((prev) => (prev ? false : prev));
  }, [graph.document.nodes, lifecycleNodes, selectedLifecycleNodeId]);

  const graphDebugSig = useMemo(
    () =>
      `${nodeStructureSignature(graph.document.nodes)}|${edgeListSignature(graph.document.edges)}`,
    [graph.document.nodes, graph.document.edges]
  );

  const allowFalseSignalPropagation =
    graph.document.allowFalseSignalPropagation ?? false;

  const buildRunnableGraph = useCallback(
    () => documentToRunnableGraph(graph.document, { libraryNameById }),
    [graph.document, libraryNameById]
  );

  const syncRunnerGraphConfig = useCallback(() => {
    const runner = runnerRef.current;
    if (!runner?.isDebugSessionActive()) return;
    runner.updateGraph(buildRunnableGraph());
    if (selectedLifecycleNodeId) {
      runner.refreshDebugLifecycleScope(selectedLifecycleNodeId);
    }
  }, [buildRunnableGraph, selectedLifecycleNodeId]);

  const syncRunnerWithLatestGraph = useCallback(() => {
    syncRunnerGraphConfig();
    const runner = runnerRef.current;
    if (!runner?.isDebugSessionActive()) return;
    runner.refreshPendingQueueFromLatestGraph();
  }, [syncRunnerGraphConfig]);

  const resolveBlueprintName = useCallback(
    (id: string) => libraryNameById?.get(id) ?? id,
    [libraryNameById]
  );

  const validateBlueprintGraph = useCallback(async () => {
    if (!resolveLibraryBlueprint) return true;
    const result = await detectBlueprintReferenceCycle({
      rootGraph: buildRunnableGraph(),
      rootLibraryBlueprintId: blueprintId,
      resolveLibraryBlueprint,
      resolveBlueprintName,
    });
    if (!result.ok) {
      onExecutionBlocked?.(result.message);
      return false;
    }
    return true;
  }, [
    blueprintId,
    buildRunnableGraph,
    onExecutionBlocked,
    resolveBlueprintName,
    resolveLibraryBlueprint,
  ]);

  const ensureRunner = useCallback(() => {
    const runner = new BlueprintGraphRunner(buildRunnableGraph(), {
      resolveLibraryBlueprint,
      rootLibraryBlueprintId: blueprintId,
      resolveBlueprintName,
      onViewScopeUpdate,
    });
    runnerRef.current = runner;
    return runner;
  }, [
    blueprintId,
    buildRunnableGraph,
    onViewScopeUpdate,
    resolveBlueprintName,
    resolveLibraryBlueprint,
  ]);

  const refreshSavedRuns = useCallback(async () => {
    const all = await listExecutionRunRecords(undefined, nameSpace);
    setTotalSavedRunCount(all.length);
    const items = blueprintId
      ? all.filter((item) => item.blueprintId === blueprintId)
      : all;
    setSavedRuns(items);
  }, [blueprintId, nameSpace]);

  useEffect(() => {
    if (!logPanelOpen) return;
    void refreshSavedRuns();
  }, [logPanelOpen, refreshSavedRuns]);

  const enforceSavedRunLimits = useCallback(async () => {
    const cutoff = retentionCutoffMs(settings.retentionDays);
    await purgeExecutionRunsOlderThan(cutoff, nameSpace);
    await trimExecutionRunRecordsToMax(settings.maxSavedRuns, nameSpace);
    await refreshSavedRuns();
  }, [nameSpace, refreshSavedRuns, settings.maxSavedRuns, settings.retentionDays]);

  const applyRetention = enforceSavedRunLimits;

  const clearAllSavedRuns = useCallback(async () => {
    const removed = await clearAllExecutionRunRecords(nameSpace);
    setSavedRuns([]);
    setTotalSavedRunCount(0);
    return removed;
  }, [nameSpace]);

  const buildRunRecord = useCallback(
    (
      status: ExecutionRunRecord["status"],
      nextEntries: ExecutionTraceEntry[]
    ): ExecutionRunRecord => {
      const lifecycleNode = lifecycleNodes.find(
        (item) => item.id === selectedLifecycleNodeId
      );
      return {
        runId: runIdRef.current ?? createRunId(),
        blueprintId,
        blueprintName,
        lifecycleNodeId: selectedLifecycleNodeId ?? "",
        lifecycleNodeLabel: lifecycleNode?.label,
        lifecyclePhase: lifecycleNode?.phase,
        startedAt: runStartedAtRef.current || Date.now(),
        finishedAt:
          status === "completed" || status === "failed" ? Date.now() : undefined,
        status,
        entries: nextEntries,
      };
    },
    [blueprintId, blueprintName, lifecycleNodes, selectedLifecycleNodeId]
  );

  const persistRunIfNeeded = useCallback(
    async (record: ExecutionRunRecord) => {
      if (!settings.autoSave) return;
      await putExecutionRunRecord(record, nameSpace);
      await enforceSavedRunLimits();
    },
    [enforceSavedRunLimits, nameSpace, settings.autoSave]
  );

  const beginRun = useCallback((): {
    runner: BlueprintGraphRunner;
    lifecycleNodeId: string;
  } | null => {
    if (!selectedLifecycleNodeId) return null;
    const emitId = findEmittableLifecycleNodeId(
      graph.document.nodes,
      selectedLifecycleNodeId,
      LIFECYCLE_NODE_TYPE
    );
    if (!emitId) return null;
    if (emitId !== selectedLifecycleNodeId) {
      setSelectedLifecycleNodeId(emitId);
    }
    runIdRef.current = createRunId();
    runStartedAtRef.current = Date.now();
    const runner = ensureRunner();
    runner.beginDebugSession(emitId);
    setChainComplete(false);
    return { runner, lifecycleNodeId: emitId };
  }, [ensureRunner, graph.document.nodes, selectedLifecycleNodeId]);

  useEffect(() => {
    const runner = runnerRef.current;
    if (!runner?.isDebugSessionActive()) return;
    syncRunnerGraphConfig();
    runner.refreshPendingQueueFromLatestGraph();
  }, [graphDebugSig, syncRunnerGraphConfig]);

  useEffect(() => {
    if (running) return;
    const halted = shouldHaltDebugOnFalseSignal(
      entries,
      allowFalseSignalPropagation
    );
    if (halted) {
      setChainComplete(true);
      return;
    }
    const runner = runnerRef.current;
    if (
      runner?.isDebugSessionActive() &&
      runner.isDebugQueueEmpty() &&
      entries.length > 0
    ) {
      setChainComplete(true);
    }
  }, [allowFalseSignalPropagation, entries, running]);

  const runAll = useCallback(async () => {
    if (!selectedLifecycleNodeId) return;
    if (!(await validateBlueprintGraph())) return;
    setRunning(true);
    setLogPanelOpen(true);
    try {
      const started = beginRun();
      if (!started) return;
      const { runner, lifecycleNodeId } = started;
      runner.updateGraph(buildRunnableGraph());
      runner.refreshDebugLifecycleScope(lifecycleNodeId);
      const labels = buildNodeLabelMap(graph);
      const onProgress = (trace: ExecutionTraceEntry[]) => {
        setEntries([...trace]);
      };
      const result = await runner.debugRunAll(labels, onProgress);
      setEntries(result);
      setChainComplete(
        shouldHaltDebugOnFalseSignal(result, allowFalseSignalPropagation) ||
          (runner.isDebugQueueEmpty() && result.length > 0)
      );
      const record = buildRunRecord("completed", result);
      await persistRunIfNeeded(record);
    } finally {
      setRunning(false);
    }
  }, [
    allowFalseSignalPropagation,
    beginRun,
    buildRunRecord,
    buildRunnableGraph,
    graph,
    persistRunIfNeeded,
    selectedLifecycleNodeId,
    validateBlueprintGraph,
  ]);

  const stepNext = useCallback(async () => {
    if (
      !selectedLifecycleNodeId ||
      chainComplete ||
      shouldHaltDebugOnFalseSignal(entries, allowFalseSignalPropagation)
    ) {
      return;
    }
    setRunning(true);
    setLogPanelOpen(true);
    try {
      let runner: BlueprintGraphRunner | null = runnerRef.current;
      if (!runner?.isDebugSessionActive()) {
        if (!(await validateBlueprintGraph())) return;
        const started = beginRun();
        if (!started) return;
        runner = started.runner;
      } else {
        syncRunnerWithLatestGraph();
      }
      if (runner.isDebugQueueEmpty()) {
        setChainComplete(true);
        return;
      }

      const labels = buildNodeLabelMap(graph);
      const onProgress = (trace: ExecutionTraceEntry[]) => {
        setEntries([...trace]);
      };
      const { done, haltedByFalseSignal } = await runner.debugStep(
        labels,
        onProgress
      );
      const nextEntries = runner.getTraceEntries();
      setEntries(nextEntries);
      setChainComplete(done || haltedByFalseSignal === true);

      if (done) {
        const record = buildRunRecord("completed", nextEntries);
        await persistRunIfNeeded(record);
      }
    } finally {
      setRunning(false);
    }
  }, [
    allowFalseSignalPropagation,
    beginRun,
    buildRunRecord,
    chainComplete,
    entries,
    graph,
    persistRunIfNeeded,
    selectedLifecycleNodeId,
    syncRunnerWithLatestGraph,
    validateBlueprintGraph,
  ]);

  const stepBack = useCallback(() => {
    if (!selectedLifecycleNodeId) return;
    const runner = runnerRef.current;
    if (!runner?.isDebugSessionActive() || !runner.canDebugStepBack()) return;

    setRunning(true);
    setLogPanelOpen(true);
    try {
      runner.debugStepBack();
      const nextEntries = runner.getTraceEntries();
      setEntries(nextEntries);
      setChainComplete(
        shouldHaltDebugOnFalseSignal(
          nextEntries,
          allowFalseSignalPropagation
        ) ||
          (runner.isDebugSessionActive() && runner.isDebugQueueEmpty())
      );
    } finally {
      setRunning(false);
    }
  }, [allowFalseSignalPropagation, selectedLifecycleNodeId]);

  const resetToStart = useCallback(() => {
    if (!selectedLifecycleNodeId || entries.length === 0) return;
    const runner = runnerRef.current;
    if (!runner?.isDebugSessionActive()) return;
    const emitId = findEmittableLifecycleNodeId(
      graph.document.nodes,
      selectedLifecycleNodeId,
      LIFECYCLE_NODE_TYPE
    );
    if (!emitId) return;
    if (emitId !== selectedLifecycleNodeId) {
      setSelectedLifecycleNodeId(emitId);
    }

    setRunning(true);
    setLogPanelOpen(true);
    try {
      syncRunnerWithLatestGraph();
      runner.beginDebugSession(emitId);
      setEntries([]);
      setChainComplete(false);
    } finally {
      setRunning(false);
    }
  }, [
    entries.length,
    graph.document.nodes,
    selectedLifecycleNodeId,
    syncRunnerWithLatestGraph,
  ]);

  const falseSignalHalt = shouldHaltDebugOnFalseSignal(
    entries,
    allowFalseSignalPropagation
  );
  const canResetToStart = entries.length > 0;
  const canStepBack = entries.length > 0;
  const canStepNext =
    Boolean(selectedLifecycleNodeId) && !chainComplete && !falseSignalHalt;

  const saveCurrentRun = useCallback(async () => {
    if (entries.length === 0) return;
    const record = buildRunRecord(
      runnerRef.current?.isDebugQueueEmpty() ? "completed" : "paused",
      entries
    );
    await putExecutionRunRecord(record, nameSpace);
    await enforceSavedRunLimits();
  }, [buildRunRecord, enforceSavedRunLimits, entries, nameSpace]);

  const exportCurrentRun = useCallback(() => {
    if (entries.length === 0) return;
    const record = buildRunRecord(
      runnerRef.current?.isDebugQueueEmpty() ? "completed" : "paused",
      entries
    );
    downloadExecutionRunExport(record);
  }, [buildRunRecord, entries]);

  const updateSettings = useCallback(
    (patch: Partial<ExecutionLogSettings>) => {
      setSettings((prev) => {
        const next = { ...prev, ...patch };
        writeExecutionLogSettings(next, nameSpace);
        return next;
      });
      if (patch.maxSavedRuns !== undefined) {
        const maxSavedRuns = Math.max(1, Math.floor(patch.maxSavedRuns));
        void trimExecutionRunRecordsToMax(maxSavedRuns, nameSpace).then(() =>
          refreshSavedRuns()
        );
      }
    },
    [nameSpace, refreshSavedRuns]
  );

  const resetSession = useCallback(() => {
    runnerRef.current?.clearDebugSession();
    runnerRef.current = null;
    runIdRef.current = null;
    // 避免 setEntries([]) 在已为空时仍触发重渲染（步进按钮会跟着闪）
    setEntries((prev) => (prev.length === 0 ? prev : []));
    setChainComplete((prev) => (prev ? false : prev));
  }, []);

  const abortClock = useCallback((nodeId: string) => {
    runnerRef.current?.abortClockNode(nodeId);
  }, []);

  const clearLog = resetSession;

  const selectLifecycleNode = useCallback(
    (nodeId: string | null) => {
      if (!nodeId) {
        if (selectedLifecycleNodeId === null) return;
        setSelectedLifecycleNodeId(null);
        resetSession();
        return;
      }
      // 全部停用时 findEmittable 为 null：必须保持 null，不能回退到停用节点（否则与画布选中同步会死循环闪烁）
      const emitId = findEmittableLifecycleNodeId(
        graph.document.nodes,
        nodeId,
        LIFECYCLE_NODE_TYPE
      );
      if (selectedLifecycleNodeId === emitId) return;
      setSelectedLifecycleNodeId(emitId);
      resetSession();
    },
    [graph.document.nodes, resetSession, selectedLifecycleNodeId]
  );

  const executionOverlay = useMemo(
    () => buildExecutionOverlay(graph, entries),
    [graph, entries]
  );

  return {
    lifecycleNodes,
    hasLifecycleNodes,
    selectedLifecycleNodeId,
    selectLifecycleNode,
    entries,
    executionOverlay,
    logPanelOpen,
    setLogPanelOpen,
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
    applyRetention,
    clearAllSavedRuns,
    resetSession,
    clearLog,
    totalSavedRunCount,
    abortClock,
  };
}

export type UseBlueprintDebugSessionReturn = ReturnType<
  typeof useBlueprintDebugSession
>;
