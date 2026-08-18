import { onUnmounted, ref, shallowRef, toValue, watch, type MaybeRefOrGetter, type Ref } from "vue";
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
  graph: Ref<BlueprintGraph> | BlueprintGraph;
  active?: Ref<boolean> | boolean;
  enabled?: Ref<boolean> | boolean;
  bootPhases?: PageLifecyclePhase[];
  bootKey?: Ref<unknown> | unknown;
  waitForPageReady?: boolean;
  onUpdated?: Ref<unknown> | unknown;
  resolveLibraryBlueprint?: LibraryBlueprintResolver;
  libraryNameById?: MaybeRefOrGetter<ReadonlyMap<string, string>>;
  rootLibraryBlueprintId?: MaybeRefOrGetter<string | null>;
  onExecutionBlocked?: (message: string) => void;
  onViewScopeUpdate?: (viewElementIds: string[], scope: unknown) => void;
};

type RunnerOptions = Pick<
  UseBlueprintPageLifecycleOptions,
  | "resolveLibraryBlueprint"
  | "libraryNameById"
  | "rootLibraryBlueprintId"
  | "onExecutionBlocked"
  | "onViewScopeUpdate"
>;

function resolveValue<T>(value: Ref<T> | T): T {
  return value && typeof value === "object" && "value" in value
    ? (value as Ref<T>).value
    : (value as T);
}

function resolveBlueprintName(
  libraryNameById: ReadonlyMap<string, string> | undefined,
  id: string
) {
  return libraryNameById?.get(id) ?? id;
}

function createRunner(graph: BlueprintGraph, options: RunnerOptions) {
  const rootLibraryBlueprintId = toValue(options.rootLibraryBlueprintId ?? null);
  const libraryNameById = toValue(options.libraryNameById);
  return new BlueprintGraphRunner(
    documentToRunnableGraph(graph.document, {
      libraryNameById,
    }),
    {
      resolveLibraryBlueprint: options.resolveLibraryBlueprint,
      rootLibraryBlueprintId,
      resolveBlueprintName: (id) =>
        resolveBlueprintName(libraryNameById, id),
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

  const rootLibraryBlueprintId = toValue(options.rootLibraryBlueprintId ?? null);
  const libraryNameById = toValue(options.libraryNameById);

  if (options.resolveLibraryBlueprint) {
    const result = await detectBlueprintReferenceCycle({
      rootGraph: documentToRunnableGraph(graph.document, {
        libraryNameById,
      }),
      rootLibraryBlueprintId,
      resolveLibraryBlueprint: options.resolveLibraryBlueprint,
      resolveBlueprintName: (id) =>
        resolveBlueprintName(libraryNameById, id),
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

export function useBlueprintPageLifecycle(options: UseBlueprintPageLifecycleOptions) {
  const graphRef = shallowRef(resolveValue(options.graph));
  const runnerOptionsRef = shallowRef<RunnerOptions>({
    resolveLibraryBlueprint: options.resolveLibraryBlueprint,
    libraryNameById: options.libraryNameById,
    rootLibraryBlueprintId: options.rootLibraryBlueprintId,
    onExecutionBlocked: options.onExecutionBlocked,
    onViewScopeUpdate: options.onViewScopeUpdate,
  });

  const bootPhases = options.bootPhases ?? PAGE_BOOT_PHASES;
  const bootPhasesKey = bootPhases.join("|");
  const bootTrigger = options.bootKey ?? "__initial__";
  const bootCompleted = ref(false);
  const firedLifecyclePhases = ref<ReadonlySet<PageLifecyclePhase>>(new Set());
  const hadBoot = ref(false);
  const prevActive = ref<boolean | undefined>(undefined);
  let bootCancelled = false;

  const resetFiredPhases = () => {
    firedLifecyclePhases.value = new Set();
  };

  const markPhaseFired = (phase: PageLifecyclePhase) => {
    if (firedLifecyclePhases.value.has(phase)) return;
    const next = new Set(firedLifecyclePhases.value);
    next.add(phase);
    firedLifecyclePhases.value = next;
  };

  watch(
    () => resolveValue(options.graph),
    (next) => {
      graphRef.value = next;
    },
    { deep: true }
  );

  watch(
    () => ({
      resolveLibraryBlueprint: options.resolveLibraryBlueprint,
      libraryNameById: options.libraryNameById,
      rootLibraryBlueprintId: options.rootLibraryBlueprintId,
      onExecutionBlocked: options.onExecutionBlocked,
      onViewScopeUpdate: options.onViewScopeUpdate,
    }),
    (next) => {
      runnerOptionsRef.value = next;
    },
    { deep: true }
  );

  const runBootCycle = async () => {
    const enabled = resolveValue(options.enabled ?? true);
    if (!enabled) {
      bootCompleted.value = false;
      resetFiredPhases();
      return;
    }

    bootCancelled = false;
    resetFiredPhases();
    const waitForPageReady = options.waitForPageReady ?? false;

    if (waitForPageReady) {
      await waitForPagePaint();
    }
    if (bootCancelled) return;

    const bootOk = await emitPhases(
      graphRef.value,
      bootPhases,
      runnerOptionsRef.value,
      (phase) => {
        if (!bootCancelled) markPhaseFired(phase);
      }
    );
    if (bootCancelled) return;
    if (!bootOk) return;

    const active = resolveValue(options.active ?? true);
    if (active) {
      await emitPhases(
        graphRef.value,
        ["activated"],
        runnerOptionsRef.value,
        (phase) => {
          if (!bootCancelled) markPhaseFired(phase);
        }
      );
    }
    if (bootCancelled) return;

    hadBoot.value = true;
    prevActive.value = active;
    bootCompleted.value = true;
  };

  const teardownBoot = () => {
    bootCancelled = true;
    bootCompleted.value = false;
    resetFiredPhases();
    prevActive.value = undefined;
    if (hadBoot.value) {
      hadBoot.value = false;
      void emitPhases(graphRef.value, PAGE_TEARDOWN_PHASES, runnerOptionsRef.value);
    }
  };

  watch(
    () => [
      bootPhasesKey,
      resolveValue(bootTrigger),
      resolveValue(options.enabled ?? true),
      options.waitForPageReady ?? false,
    ],
    () => {
      teardownBoot();
      void runBootCycle();
    },
    { immediate: true }
  );

  watch(
    () => [resolveValue(options.active ?? true), bootCompleted.value, resolveValue(options.enabled ?? true)],
    ([active, completed, enabled]) => {
      if (!enabled || !completed) return;
      const prev = prevActive.value;
      if (prev === undefined || prev === active) {
        prevActive.value = active;
        return;
      }
      prevActive.value = active;
      const phase: PageLifecyclePhase = active ? "activated" : "deactivated";
      void emitPhases(
        graphRef.value,
        [phase],
        runnerOptionsRef.value,
        markPhaseFired
      );
    }
  );

  watch(
    () => [bootCompleted.value, resolveValue(options.enabled ?? true), resolveValue(options.onUpdated)],
    ([completed, enabled]) => {
      if (!enabled || !completed) return;
      void emitPhases(
        graphRef.value,
        ["updated"],
        runnerOptionsRef.value,
        markPhaseFired
      );
    }
  );

  onUnmounted(() => {
    teardownBoot();
  });

  async function triggerBlueprintNode(nodeId: string, inputValue?: unknown) {
    const id = nodeId.trim();
    if (!id) return;
    const opts = runnerOptionsRef.value;
    const libraryNameById = toValue(opts.libraryNameById);
    const rootLibraryBlueprintId = toValue(opts.rootLibraryBlueprintId ?? null);
    if (opts.resolveLibraryBlueprint) {
      const result = await detectBlueprintReferenceCycle({
        rootGraph: documentToRunnableGraph(graphRef.value.document, {
          libraryNameById,
        }),
        rootLibraryBlueprintId,
        resolveLibraryBlueprint: opts.resolveLibraryBlueprint,
        resolveBlueprintName: (libId) =>
          resolveBlueprintName(libraryNameById, libId),
      });
      if (!result.ok) {
        opts.onExecutionBlocked?.(result.message);
        return;
      }
    }
    const runner = createRunner(graphRef.value, opts);
    await runner.triggerNode(id, inputValue);
  }

  async function emitViewEvent(payload: ViewEventSignal) {
    if (!payload?.node?.id || !payload.eventType) return;
    const opts = runnerOptionsRef.value;
    const libraryNameById = toValue(opts.libraryNameById);
    const rootLibraryBlueprintId = toValue(opts.rootLibraryBlueprintId ?? null);
    if (opts.resolveLibraryBlueprint) {
      const result = await detectBlueprintReferenceCycle({
        rootGraph: documentToRunnableGraph(graphRef.value.document, {
          libraryNameById,
        }),
        rootLibraryBlueprintId,
        resolveLibraryBlueprint: opts.resolveLibraryBlueprint,
        resolveBlueprintName: (libId) =>
          resolveBlueprintName(libraryNameById, libId),
      });
      if (!result.ok) {
        opts.onExecutionBlocked?.(result.message);
        return;
      }
    }
    const runner = createRunner(graphRef.value, opts);
    await runner.emitViewEvent(
      payload,
      collectArmedIds(graphRef.value, firedLifecyclePhases.value)
    );
  }

  return { triggerBlueprintNode, emitViewEvent, firedLifecyclePhases };
}
