import { useEffect, useRef } from "react";
import {
  BlueprintGraphRunner,
  type PageLifecyclePhase,
} from "@arron/blueprint-dsl";

import type { BlueprintGraph } from "../graph/blueprint-graph";

function toRunnableGraph(graph: BlueprintGraph) {
  return {
    nodes: graph.document.nodes.map((node) => ({
      id: node.id,
      nodeType: node.nodeType,
      lifecyclePhase: node.lifecyclePhase,
    })),
    edges: graph.document.edges.map((edge) => ({
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
    })),
  };
}

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
};

async function emitPhases(graph: BlueprintGraph, phases: PageLifecyclePhase[]) {
  const runner = new BlueprintGraphRunner(toRunnableGraph(graph));
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
}: UseBlueprintPageLifecycleOptions) {
  const graphRef = useRef(graph);
  graphRef.current = graph;

  useEffect(() => {
    void emitPhases(graphRef.current, PAGE_BOOT_PHASES);
    return () => {
      void emitPhases(graphRef.current, PAGE_TEARDOWN_PHASES);
    };
  }, []);

  useEffect(() => {
    if (!active) {
      void emitPhases(graphRef.current, ["deactivated"]);
      return;
    }
    void emitPhases(graphRef.current, ["activated"]);
  }, [active]);

  useEffect(() => {
    void emitPhases(graphRef.current, ["updated"]);
  }, [onUpdated]);
}
