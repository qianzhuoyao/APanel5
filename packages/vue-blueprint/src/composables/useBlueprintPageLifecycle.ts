import { onUnmounted, ref, shallowRef, toValue, watch, type MaybeRefOrGetter, type Ref } from "vue";
import {
  BlueprintGraphRunner,
  detectBlueprintReferenceCycle,
  type LibraryBlueprintResolver,
  type PageLifecyclePhase,
} from "@arronqzy/blueprint-dsl";

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

async function emitPhases(
  graph: BlueprintGraph,
  phases: PageLifecyclePhase[],
  options: RunnerOptions
) {
  if (!phases.length) return;

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
      return;
    }
  }

  const runner = createRunner(graph, options);
  for (const phase of phases) {
    await runner.emitLifecycle(phase);
  }
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
  const hadBoot = ref(false);
  const prevActive = ref<boolean | undefined>(undefined);
  let bootCancelled = false;

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
      return;
    }

    bootCancelled = false;
    const waitForPageReady = options.waitForPageReady ?? false;

    if (waitForPageReady) {
      await waitForPagePaint();
    }
    if (bootCancelled) return;

    await emitPhases(graphRef.value, bootPhases, runnerOptionsRef.value);
    if (bootCancelled) return;

    const active = resolveValue(options.active ?? true);
    if (active) {
      await emitPhases(graphRef.value, ["activated"], runnerOptionsRef.value);
    }
    if (bootCancelled) return;

    hadBoot.value = true;
    prevActive.value = active;
    bootCompleted.value = true;
  };

  const teardownBoot = () => {
    bootCancelled = true;
    bootCompleted.value = false;
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
      void emitPhases(
        graphRef.value,
        [active ? "activated" : "deactivated"],
        runnerOptionsRef.value
      );
    }
  );

  watch(
    () => [bootCompleted.value, resolveValue(options.enabled ?? true), resolveValue(options.onUpdated)],
    ([completed, enabled]) => {
      if (!enabled || !completed) return;
      void emitPhases(graphRef.value, ["updated"], runnerOptionsRef.value);
    }
  );

  onUnmounted(() => {
    teardownBoot();
  });
}
