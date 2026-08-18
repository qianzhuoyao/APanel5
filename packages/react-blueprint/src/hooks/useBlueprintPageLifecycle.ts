import { useCallback, useEffect, useRef, useState } from "react";
import {
  BlueprintGraphRunner,
  collectArmedViewEventNodeIds,
  detectBlueprintReferenceCycle,
  EVENT_NODE_TYPE,
  LIFECYCLE_NODE_TYPE,
  type LibraryBlueprintResolver,
  type PageLifecyclePhase,
  type ViewEventSignal,
} from "@arronqzy/blueprint-dsl";

import type { BlueprintGraph } from "../graph/blueprint-graph";
import { resolveRunnableNodeType } from "../graph/document";
import { documentToRunnableGraph } from "../runtime/document-to-runnable-graph";

const PAGE_BOOT_PHASES: PageLifecyclePhase[] = [
  "created",
  "beforeMount",
  "mounted",
];

const PAGE_TEARDOWN_PHASES: PageLifecyclePhase[] = [
  "beforeDestroy",
  "destroy",
];

async function waitForPagePaint() {
  if (document.readyState !== "complete") {
    await new Promise<void>((resolve) => {
      window.addEventListener("load", () => resolve(), { once: true });
    });
  }
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

export type UseBlueprintPageLifecycleOptions = {
  graph: BlueprintGraph;
  /** 页面（工作区）是否处于激活状态，用于 activated / deactivated */
  active?: boolean;
  /** 为 false 时不触发任何生命周期阶段 */
  enabled?: boolean;
  /** 挂载时要执行的阶段；默认 created → beforeMount → mounted */
  bootPhases?: PageLifecyclePhase[];
  /**
   * 挂载流程的触发键。提供后会在键变化时重新执行 bootPhases；
   * 未提供时仅在首次满足 enabled 时执行一次。
   */
  bootKey?: unknown;
  /** 为 true 时在执行 bootPhases 前等待 window load 与双 rAF（页面绘制完成） */
  waitForPageReady?: boolean;
  /** 元素或图层变更时是否触发 updated */
  onUpdated?: unknown;
  /** 解析蓝图库记录为可执行子图 */
  resolveLibraryBlueprint?: LibraryBlueprintResolver;
  /** 蓝图库 id -> 名称，用于 signal 中的 blueprintName */
  libraryNameById?: ReadonlyMap<string, string>;
  /** 当前蓝图在蓝图库中的 id；未入库时为 null */
  rootLibraryBlueprintId?: string | null;
  /** 检测到蓝图相互引用死循环时回调 */
  onExecutionBlocked?: (message: string) => void;
  /** 视图绑定节点收到真信号时，为关联视图元素写入 scope */
  onViewScopeUpdate?: (
    viewElementIds: string[],
    scope: unknown
  ) => void;
};

type RunnerOptions = Pick<
  UseBlueprintPageLifecycleOptions,
  | "resolveLibraryBlueprint"
  | "libraryNameById"
  | "rootLibraryBlueprintId"
  | "onExecutionBlocked"
  | "onViewScopeUpdate"
>;

function resolveBlueprintName(
  libraryNameById: ReadonlyMap<string, string> | undefined,
  id: string
) {
  return libraryNameById?.get(id) ?? id;
}

function createRunner(graph: BlueprintGraph, options: RunnerOptions) {
  return new BlueprintGraphRunner(
    documentToRunnableGraph(graph.document, {
      libraryNameById: options.libraryNameById,
    }),
    {
      resolveLibraryBlueprint: options.resolveLibraryBlueprint,
      rootLibraryBlueprintId: options.rootLibraryBlueprintId,
      resolveBlueprintName: (id) =>
        resolveBlueprintName(options.libraryNameById, id),
      onViewScopeUpdate: options.onViewScopeUpdate,
    }
  );
}

function collectArmedIds(
  graph: BlueprintGraph,
  firedPhases: ReadonlySet<string>
) {
  return collectArmedViewEventNodeIds(
    graph.document.nodes.map((node) => ({
      id: node.id,
      nodeType: resolveRunnableNodeType(node),
      lifecyclePhase: node.lifecyclePhase,
    })),
    graph.document.edges,
    EVENT_NODE_TYPE,
    LIFECYCLE_NODE_TYPE,
    firedPhases
  );
}

async function emitPhases(
  graph: BlueprintGraph,
  phases: PageLifecyclePhase[],
  options: RunnerOptions,
  onPhaseFired?: (phase: PageLifecyclePhase) => void
): Promise<boolean> {
  if (!phases.length) return true;

  if (options.resolveLibraryBlueprint) {
    const result = await detectBlueprintReferenceCycle({
      rootGraph: documentToRunnableGraph(graph.document, {
        libraryNameById: options.libraryNameById,
      }),
      rootLibraryBlueprintId: options.rootLibraryBlueprintId,
      resolveLibraryBlueprint: options.resolveLibraryBlueprint,
      resolveBlueprintName: (id) =>
        resolveBlueprintName(options.libraryNameById, id),
    });
    if (!result.ok) {
      options.onExecutionBlocked?.(result.message);
      return false;
    }
  }

  const runner = createRunner(graph, options);
  for (const phase of phases) {
    await runner.emitLifecycle(phase);
    onPhaseFired?.(phase);
  }
  return true;
}

/**
 * 将蓝图中的生命周期节点与当前页面生命周期对齐。
 * 在编辑器工作区挂载/卸载、图层切换时自动触发对应钩子。
 */
export function useBlueprintPageLifecycle({
  graph,
  active = true,
  enabled = true,
  bootPhases = PAGE_BOOT_PHASES,
  bootKey,
  waitForPageReady = false,
  onUpdated,
  resolveLibraryBlueprint,
  libraryNameById,
  rootLibraryBlueprintId = null,
  onExecutionBlocked,
  onViewScopeUpdate,
}: UseBlueprintPageLifecycleOptions) {
  const graphRef = useRef(graph);
  graphRef.current = graph;

  const runnerOptionsRef = useRef<RunnerOptions>({
    resolveLibraryBlueprint,
    libraryNameById,
    rootLibraryBlueprintId,
    onExecutionBlocked,
    onViewScopeUpdate,
  });
  runnerOptionsRef.current = {
    resolveLibraryBlueprint,
    libraryNameById,
    rootLibraryBlueprintId,
    onExecutionBlocked,
    onViewScopeUpdate,
  };

  const bootPhasesKey = bootPhases.join("|");
  const bootTrigger = bootKey ?? "__initial__";
  const [bootCompleted, setBootCompleted] = useState(false);
  const [firedLifecyclePhases, setFiredLifecyclePhases] = useState<
    ReadonlySet<PageLifecyclePhase>
  >(() => new Set());
  const firedLifecyclePhasesRef = useRef(firedLifecyclePhases);
  firedLifecyclePhasesRef.current = firedLifecyclePhases;
  const hadBootRef = useRef(false);
  const activeRef = useRef(active);
  activeRef.current = active;
  const prevActiveRef = useRef<boolean | undefined>(undefined);

  const resetFiredPhases = useCallback(() => {
    setFiredLifecyclePhases(new Set());
  }, []);

  const markPhaseFired = useCallback((phase: PageLifecyclePhase) => {
    setFiredLifecyclePhases((prev) => {
      if (prev.has(phase)) return prev;
      const next = new Set(prev);
      next.add(phase);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!enabled) {
      setBootCompleted(false);
      resetFiredPhases();
      return;
    }

    let cancelled = false;

    const runBoot = async () => {
      resetFiredPhases();
      if (waitForPageReady) {
        await waitForPagePaint();
      }
      if (cancelled) return;

      const bootOk = await emitPhases(
        graphRef.current,
        bootPhases,
        runnerOptionsRef.current,
        (phase) => {
          if (!cancelled) markPhaseFired(phase);
        }
      );
      if (cancelled) return;
      if (!bootOk) return;

      if (activeRef.current) {
        await emitPhases(
          graphRef.current,
          ["activated"],
          runnerOptionsRef.current,
          (phase) => {
            if (!cancelled) markPhaseFired(phase);
          }
        );
      }
      if (cancelled) return;

      hadBootRef.current = true;
      prevActiveRef.current = activeRef.current;
      setBootCompleted(true);
    };

    void runBoot();

    return () => {
      cancelled = true;
      setBootCompleted(false);
      resetFiredPhases();
      prevActiveRef.current = undefined;
      if (hadBootRef.current) {
        hadBootRef.current = false;
        void emitPhases(
          graphRef.current,
          PAGE_TEARDOWN_PHASES,
          runnerOptionsRef.current
        );
      }
    };
  }, [
    bootPhasesKey,
    bootTrigger,
    enabled,
    waitForPageReady,
    markPhaseFired,
    resetFiredPhases,
  ]);

  useEffect(() => {
    if (!enabled || !bootCompleted) return;

    const prev = prevActiveRef.current;
    if (prev === undefined || prev === active) {
      prevActiveRef.current = active;
      return;
    }
    prevActiveRef.current = active;

    const phase: PageLifecyclePhase = active ? "activated" : "deactivated";
    void emitPhases(
      graphRef.current,
      [phase],
      runnerOptionsRef.current,
      markPhaseFired
    );
  }, [active, bootCompleted, enabled, markPhaseFired]);

  useEffect(() => {
    if (!enabled || !bootCompleted) return;
    void emitPhases(
      graphRef.current,
      ["updated"],
      runnerOptionsRef.current,
      markPhaseFired
    );
  }, [bootCompleted, enabled, onUpdated, markPhaseFired]);

  const triggerBlueprintNode = useCallback(
    async (nodeId: string, inputValue?: unknown) => {
      const id = nodeId.trim();
      if (!id) return;
      const opts = runnerOptionsRef.current;
      if (opts.resolveLibraryBlueprint) {
        const result = await detectBlueprintReferenceCycle({
          rootGraph: documentToRunnableGraph(graphRef.current.document, {
            libraryNameById: opts.libraryNameById,
          }),
          rootLibraryBlueprintId: opts.rootLibraryBlueprintId,
          resolveLibraryBlueprint: opts.resolveLibraryBlueprint,
          resolveBlueprintName: (libId) =>
            resolveBlueprintName(opts.libraryNameById, libId),
        });
        if (!result.ok) {
          opts.onExecutionBlocked?.(result.message);
          return;
        }
      }
      const runner = createRunner(graphRef.current, opts);
      await runner.triggerNode(id, inputValue);
    },
    []
  );

  const emitViewEvent = useCallback(async (payload: ViewEventSignal) => {
    if (!payload?.node?.id || !payload.eventType) return;
    const opts = runnerOptionsRef.current;
    if (opts.resolveLibraryBlueprint) {
      const result = await detectBlueprintReferenceCycle({
        rootGraph: documentToRunnableGraph(graphRef.current.document, {
          libraryNameById: opts.libraryNameById,
        }),
        rootLibraryBlueprintId: opts.rootLibraryBlueprintId,
        resolveLibraryBlueprint: opts.resolveLibraryBlueprint,
        resolveBlueprintName: (libId) =>
          resolveBlueprintName(opts.libraryNameById, libId),
      });
      if (!result.ok) {
        opts.onExecutionBlocked?.(result.message);
        return;
      }
    }
    const runner = createRunner(graphRef.current, opts);
    await runner.emitViewEvent(
      payload,
      collectArmedIds(graphRef.current, firedLifecyclePhasesRef.current)
    );
  }, []);

  return { triggerBlueprintNode, emitViewEvent, firedLifecyclePhases };
}
