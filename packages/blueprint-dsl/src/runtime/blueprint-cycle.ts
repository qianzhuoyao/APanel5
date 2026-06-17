import { BLUEPRINT_NODE_TYPE } from "../nodes/definitions.js";
import type { LibraryBlueprintResolver, RunnableGraph } from "./graph-runner.js";

export const BLUEPRINT_CALL_STACK_KEY = "__blueprintCallStack";

export class BlueprintCycleError extends Error {
  readonly cycleIds: string[];

  constructor(cycleIds: string[], message: string) {
    super(message);
    this.name = "BlueprintCycleError";
    this.cycleIds = cycleIds;
  }
}

export function collectBlueprintLibraryRefs(graph: RunnableGraph): string[] {
  const ids = new Set<string>();
  for (const node of graph.nodes) {
    if (node.nodeType === BLUEPRINT_NODE_TYPE && node.libraryBlueprintId) {
      ids.add(node.libraryBlueprintId);
    }
  }
  return [...ids];
}

export function formatBlueprintCycleMessage(
  cycleIds: string[],
  resolveName?: (libraryBlueprintId: string) => string
): string {
  const labels = cycleIds.map((id) => resolveName?.(id) ?? id);
  return `蓝图引用存在死循环：${labels.join(" → ")}`;
}

export type BlueprintCycleCheckOptions = {
  rootGraph: RunnableGraph;
  /** 当前蓝图对应的蓝图库 id；工作区蓝图未入库时为 null */
  rootLibraryBlueprintId?: string | null;
  resolveLibraryBlueprint: LibraryBlueprintResolver;
  resolveBlueprintName?: (libraryBlueprintId: string) => string;
};

export type BlueprintCycleCheckResult =
  | { ok: true }
  | { ok: false; cycleIds: string[]; message: string };

export async function detectBlueprintReferenceCycle(
  options: BlueprintCycleCheckOptions
): Promise<BlueprintCycleCheckResult> {
  const {
    rootGraph,
    rootLibraryBlueprintId,
    resolveLibraryBlueprint,
    resolveBlueprintName,
  } = options;

  const graphCache = new Map<string, RunnableGraph | null>();

  const loadGraph = async (libraryBlueprintId: string) => {
    if (!graphCache.has(libraryBlueprintId)) {
      graphCache.set(
        libraryBlueprintId,
        await resolveLibraryBlueprint(libraryBlueprintId)
      );
    }
    return graphCache.get(libraryBlueprintId) ?? null;
  };

  const visit = async (
    path: string[],
    graph: RunnableGraph
  ): Promise<string[] | null> => {
    for (const refId of collectBlueprintLibraryRefs(graph)) {
      const cycleIndex = path.indexOf(refId);
      if (cycleIndex !== -1) {
        return [...path.slice(cycleIndex), refId];
      }

      const nested = await loadGraph(refId);
      if (!nested) continue;

      const cycle = await visit([...path, refId], nested);
      if (cycle) return cycle;
    }
    return null;
  };

  const initialPath = rootLibraryBlueprintId ? [rootLibraryBlueprintId] : [];
  const cycleIds = await visit(initialPath, rootGraph);

  if (!cycleIds) {
    return { ok: true };
  }

  return {
    ok: false,
    cycleIds,
    message: formatBlueprintCycleMessage(cycleIds, resolveBlueprintName),
  };
}

export async function assertNoBlueprintReferenceCycle(
  options: BlueprintCycleCheckOptions
): Promise<void> {
  const result = await detectBlueprintReferenceCycle(options);
  if (!result.ok) {
    throw new BlueprintCycleError(result.cycleIds, result.message);
  }
}

export function resolveBlueprintCallStack(
  scopeStack: string[] | undefined,
  rootLibraryBlueprintId?: string | null
): string[] {
  if (scopeStack) return scopeStack;
  return rootLibraryBlueprintId ? [rootLibraryBlueprintId] : [];
}

export function detectRuntimeBlueprintCycle(
  callStack: string[],
  targetLibraryBlueprintId: string,
  resolveName?: (libraryBlueprintId: string) => string
): BlueprintCycleCheckResult {
  const cycleIndex = callStack.indexOf(targetLibraryBlueprintId);
  if (cycleIndex === -1) {
    return { ok: true };
  }
  const cycleIds = [
    ...callStack.slice(cycleIndex),
    targetLibraryBlueprintId,
  ];
  return {
    ok: false,
    cycleIds,
    message: formatBlueprintCycleMessage(cycleIds, resolveName),
  };
}
