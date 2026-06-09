import { useCallback, useSyncExternalStore } from "react";

import type { ParsedSwaggerDocument } from "@arron/blueprint-dsl";

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

const tasks = new Map<string, TaskEntry>();
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribeFetchConfigTasks(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSwaggerLoadTask(nodeId: string): SwaggerLoadTaskRecord {
  return tasks.get(nodeId)?.record ?? IDLE_SWAGGER_LOAD_TASK;
}

export function findActiveSwaggerLoadTaskNodeId(): string | null {
  for (const [nodeId, task] of tasks) {
    if (task.record.status === "loading") return nodeId;
  }
  return null;
}

export function isSwaggerLoadTaskActive(nodeId: string): boolean {
  return getSwaggerLoadTask(nodeId).status === "loading";
}

export function cancelSwaggerLoadTask(nodeId: string) {
  const task = tasks.get(nodeId);
  if (!task) return;
  task.abortController.abort();
  tasks.delete(nodeId);
  emit();
}

export function useSwaggerLoadTask(nodeId: string): SwaggerLoadTaskRecord {
  const getSnapshot = useCallback(() => getSwaggerLoadTask(nodeId), [nodeId]);
  return useSyncExternalStore(subscribeFetchConfigTasks, getSnapshot, getSnapshot);
}

export function startSwaggerLoadTask(params: {
  nodeId: string;
  docsUrl: string;
  onSuccess: (parsed: ParsedSwaggerDocument, docsUrl: string) => void;
}) {
  cancelSwaggerLoadTask(params.nodeId);

  const abortController = new AbortController();
  tasks.set(params.nodeId, {
    record: LOADING_SWAGGER_LOAD_TASK,
    abortController,
  });
  emit();

  void (async () => {
    try {
      const parsed = await loadSwaggerDocument(params.docsUrl, abortController.signal);
      if (abortController.signal.aborted) return;

      tasks.delete(params.nodeId);
      emit();
      params.onSuccess(parsed, params.docsUrl);
    } catch (error) {
      if (abortController.signal.aborted) {
        tasks.delete(params.nodeId);
        emit();
        return;
      }

      const message =
        error instanceof Error ? error.message : "Swagger 文档解析失败";
      tasks.set(params.nodeId, {
        record: { status: "error", error: message },
        abortController,
      });
      emit();
    }
  })();
}
