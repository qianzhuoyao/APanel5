import { useEffect, useRef } from "react";
import {
  BlueprintGraphRunner,
  detectBlueprintReferenceCycle,
  type LibraryBlueprintResolver,
  type PageLifecyclePhase,
} from "@arron/blueprint-dsl";

import type { BlueprintGraph } from "../graph/blueprint-graph";
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

export type UseBlueprintPageLifecycleOptions = {
  graph: BlueprintGraph;
  /** 页面（工作区）是否处于激活状态，用于 activated / deactivated */
  active?: boolean;
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

async function emitPhases(
  graph: BlueprintGraph,
  phases: PageLifecyclePhase[],
  options: RunnerOptions
) {
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
      return;
    }
  }

  const runner = createRunner(graph, options);
  for (const phase of phases) {
    await runner.emitLifecycle(phase);
  }
}

/**
 * 将蓝图中的生命周期节点与当前页面生命周期对齐。
 * 在编辑器工作区挂载/卸载、图层切换时自动触发对应钩子。
 */
export function useBlueprintPageLifecycle({
  graph,
  active = true,
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

  useEffect(() => {
    void emitPhases(graphRef.current, PAGE_BOOT_PHASES, runnerOptionsRef.current);
    return () => {
      void emitPhases(
        graphRef.current,
        PAGE_TEARDOWN_PHASES,
        runnerOptionsRef.current
      );
    };
  }, []);

  useEffect(() => {
    if (!active) {
      void emitPhases(graphRef.current, ["deactivated"], runnerOptionsRef.current);
      return;
    }
    void emitPhases(graphRef.current, ["activated"], runnerOptionsRef.current);
  }, [active]);

  useEffect(() => {
    void emitPhases(graphRef.current, ["updated"], runnerOptionsRef.current);
  }, [onUpdated]);
}
