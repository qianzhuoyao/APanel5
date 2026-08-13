import { onUnmounted, ref, type Ref } from "vue";
import type {
  FetchRequestConfig,
  FetchResultValue,
  ParsedSwaggerDocument,
} from "@arronqzy/blueprint-dsl";
import { executeFetch } from "@arronqzy/blueprint-dsl";
import { resolveLocale, tForLocale } from "@arronqzy/i18n";

import { loadSwaggerDocument } from "./library/swagger-docs";

export type SwaggerLoadTaskStatus = "idle" | "loading" | "error";

export type SwaggerLoadTaskRecord = {
  status: SwaggerLoadTaskStatus;
  error?: string | null;
};

type TaskEntry = {
  record: SwaggerLoadTaskRecord;
  abortController: AbortController;
};

const IDLE_SWAGGER_LOAD_TASK: SwaggerLoadTaskRecord = { status: "idle" };
const LOADING_SWAGGER_LOAD_TASK: SwaggerLoadTaskRecord = { status: "loading" };

const swaggerTasks = new Map<string, TaskEntry>();
const fetchDebugTasks = new Map<string, FetchDebugTaskEntry>();
const listeners = new Set<() => void>();

export type FetchDebugTaskStatus = "idle" | "loading" | "success" | "error";

export type FetchDebugTaskRecord = {
  status: FetchDebugTaskStatus;
  result?: FetchResultValue;
  error?: string | null;
};

type FetchDebugTaskEntry = {
  record: FetchDebugTaskRecord;
  abortController: AbortController;
};

const IDLE_FETCH_DEBUG_TASK: FetchDebugTaskRecord = { status: "idle" };
const LOADING_FETCH_DEBUG_TASK: FetchDebugTaskRecord = { status: "loading" };

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribeFetchConfigTasks(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSwaggerLoadTask(nodeId: string): SwaggerLoadTaskRecord {
  return swaggerTasks.get(nodeId)?.record ?? IDLE_SWAGGER_LOAD_TASK;
}

export function getFetchDebugTask(nodeId: string): FetchDebugTaskRecord {
  return fetchDebugTasks.get(nodeId)?.record ?? IDLE_FETCH_DEBUG_TASK;
}

export function findActiveSwaggerLoadTaskNodeId(): string | null {
  for (const [nodeId, task] of swaggerTasks) {
    if (task.record.status === "loading") return nodeId;
  }
  return null;
}

export function findActiveFetchDebugTaskNodeId(): string | null {
  for (const [nodeId, task] of fetchDebugTasks) {
    if (task.record.status === "loading") return nodeId;
  }
  return null;
}

export function findActiveFetchConfigTaskNodeId(): string | null {
  return findActiveSwaggerLoadTaskNodeId() ?? findActiveFetchDebugTaskNodeId();
}

export function isSwaggerLoadTaskActive(nodeId: string): boolean {
  return getSwaggerLoadTask(nodeId).status === "loading";
}

export function isFetchDebugTaskActive(nodeId: string): boolean {
  return getFetchDebugTask(nodeId).status === "loading";
}

export function cancelSwaggerLoadTask(nodeId: string) {
  const task = swaggerTasks.get(nodeId);
  if (!task) return;
  task.abortController.abort();
  swaggerTasks.delete(nodeId);
  emit();
}

export function cancelFetchDebugTask(nodeId: string) {
  const task = fetchDebugTasks.get(nodeId);
  if (!task) return;
  task.abortController.abort();
  fetchDebugTasks.delete(nodeId);
  emit();
}

function useFetchConfigTaskSnapshot<T>(
  getSnapshot: () => T
): Ref<T> {
  const snapshot = ref(getSnapshot()) as Ref<T>;
  const update = () => {
    snapshot.value = getSnapshot();
  };
  const unsubscribe = subscribeFetchConfigTasks(update);
  onUnmounted(unsubscribe);
  return snapshot;
}

export function useSwaggerLoadTask(nodeId: string) {
  return useFetchConfigTaskSnapshot(() => getSwaggerLoadTask(nodeId));
}

export function useFetchDebugTask(nodeId: string) {
  return useFetchConfigTaskSnapshot(() => getFetchDebugTask(nodeId));
}

export function startSwaggerLoadTask(params: {
  nodeId: string;
  docsUrl: string;
  onSuccess: (parsed: ParsedSwaggerDocument, docsUrl: string) => void;
}) {
  cancelSwaggerLoadTask(params.nodeId);

  const abortController = new AbortController();
  swaggerTasks.set(params.nodeId, {
    record: LOADING_SWAGGER_LOAD_TASK,
    abortController,
  });
  emit();

  void (async () => {
    try {
      const parsed = await loadSwaggerDocument(params.docsUrl, abortController.signal);
      if (abortController.signal.aborted) return;

      swaggerTasks.delete(params.nodeId);
      emit();
      params.onSuccess(parsed, params.docsUrl);
    } catch (error) {
      if (abortController.signal.aborted) {
        swaggerTasks.delete(params.nodeId);
        emit();
        return;
      }

      const message =
        error instanceof Error
          ? error.message
          : tForLocale(resolveLocale())("blueprint.config.swaggerParseFailed");
      swaggerTasks.set(params.nodeId, {
        record: { status: "error", error: message },
        abortController,
      });
      emit();
    }
  })();
}

export function startFetchDebugTask(params: {
  nodeId: string;
  config: FetchRequestConfig;
}) {
  cancelFetchDebugTask(params.nodeId);

  const abortController = new AbortController();
  fetchDebugTasks.set(params.nodeId, {
    record: LOADING_FETCH_DEBUG_TASK,
    abortController,
  });
  emit();

  void (async () => {
    try {
      const result = await executeFetch(params.config, {
        signal: abortController.signal,
        allowHttpError: true,
      });
      if (abortController.signal.aborted) return;

      fetchDebugTasks.set(params.nodeId, {
        record: { status: "success", result },
        abortController,
      });
      emit();
    } catch (error) {
      if (abortController.signal.aborted) {
        fetchDebugTasks.delete(params.nodeId);
        emit();
        return;
      }

      const message =
        error instanceof Error
          ? error.message
          : tForLocale(resolveLocale())("blueprint.config.requestFailed");
      fetchDebugTasks.set(params.nodeId, {
        record: { status: "error", error: message },
        abortController,
      });
      emit();
    }
  })();
}
