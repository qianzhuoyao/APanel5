import { useSyncExternalStore } from "react";
import { resolveLocale, tForLocale } from "@arronqzy/i18n";

export type MediaFileKind = "image" | "audio" | "video" | "json" | "model3d";

export const FILE_SIZE_LIMITS: Record<MediaFileKind, number> = {
  image: 8 * 1024 * 1024,
  audio: 20 * 1024 * 1024,
  video: 40 * 1024 * 1024,
  json: 24 * 1024 * 1024,
  model3d: 48 * 1024 * 1024,
};

const JSON_WORKER_THRESHOLD = 128 * 1024;

let busyMessage: string | null = null;
let busyDepth = 0;
const busyListeners = new Set<() => void>();

function emitBusy() {
  busyListeners.forEach((listener) => listener());
}

function setBusyMessage(message: string | null) {
  busyMessage = message;
  emitBusy();
}

export function getBusyOverlayMessage() {
  return busyMessage;
}

export function subscribeBusyOverlay(listener: () => void) {
  busyListeners.add(listener);
  return () => busyListeners.delete(listener);
}

export function useBusyOverlayMessage() {
  return useSyncExternalStore(
    subscribeBusyOverlay,
    getBusyOverlayMessage,
    () => null
  );
}

export function yieldToPaint(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof requestAnimationFrame === "undefined") {
      setTimeout(resolve, 0);
      return;
    }
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

export async function runBusyTask<T>(
  message: string,
  task: () => Promise<T> | T
): Promise<T> {
  const previous = busyMessage;
  busyDepth += 1;
  setBusyMessage(message);
  await yieldToPaint();
  try {
    return await task();
  } finally {
    busyDepth = Math.max(0, busyDepth - 1);
    setBusyMessage(busyDepth === 0 ? null : previous);
  }
}

function formatFileSize(bytes: number) {
  if (bytes >= 1024 * 1024) return `${Math.round(bytes / (1024 * 1024))} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

export function assertFileSize(file: Blob, kind: MediaFileKind) {
  const limit = FILE_SIZE_LIMITS[kind];
  if (file.size <= limit) return;
  const t = tForLocale(resolveLocale());
  throw new Error(
    t("common.fileTooLarge", { max: formatFileSize(limit) })
  );
}

export function readFileAsDataUrl(
  file: Blob,
  errorMessage: string,
  kind: MediaFileKind = "image"
): Promise<string> {
  assertFileSize(file, kind);
  const t = tForLocale(resolveLocale());
  return runBusyTask(t("common.uploadingFile"), () => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ""));
      reader.onerror = () => reject(new Error(errorMessage));
      reader.readAsDataURL(file);
    });
  });
}

let jsonWorker: Worker | null = null;
let jsonWorkerObjectUrl: string | null = null;
let jsonRequestId = 0;
const jsonPending = new Map<
  number,
  { resolve: (value: unknown) => void; reject: (error: Error) => void }
>();

function ensureJsonWorker(): Worker | null {
  if (typeof Worker === "undefined") return null;
  if (jsonWorker) return jsonWorker;
  const source = `
    self.onmessage = (event) => {
      const { id, text } = event.data || {};
      try {
        self.postMessage({ id, ok: true, value: JSON.parse(text) });
      } catch (error) {
        self.postMessage({
          id,
          ok: false,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    };
  `;
  jsonWorkerObjectUrl = URL.createObjectURL(
    new Blob([source], { type: "text/javascript" })
  );
  jsonWorker = new Worker(jsonWorkerObjectUrl);
  jsonWorker.onmessage = (event: MessageEvent) => {
    const { id, ok, value, error } = event.data ?? {};
    const pending = jsonPending.get(id);
    if (!pending) return;
    jsonPending.delete(id);
    if (ok) pending.resolve(value);
    else pending.reject(new Error(String(error ?? "json-parse-failed")));
  };
  jsonWorker.onerror = () => {
    jsonPending.forEach(({ reject }) => reject(new Error("json-worker-failed")));
    jsonPending.clear();
    disposeJsonWorker();
  };
  if (typeof window !== "undefined") {
    window.addEventListener("pagehide", disposeJsonWorker, { once: true });
  }
  return jsonWorker;
}

function disposeJsonWorker() {
  jsonPending.forEach(({ reject }) => reject(new Error("json-worker-disposed")));
  jsonPending.clear();
  jsonWorker?.terminate();
  jsonWorker = null;
  if (jsonWorkerObjectUrl) {
    URL.revokeObjectURL(jsonWorkerObjectUrl);
    jsonWorkerObjectUrl = null;
  }
}

export async function parseJsonText<T>(text: string): Promise<T> {
  if (text.length < JSON_WORKER_THRESHOLD) {
    return JSON.parse(text) as T;
  }
  const worker = ensureJsonWorker();
  if (!worker) return JSON.parse(text) as T;
  const id = ++jsonRequestId;
  return new Promise<T>((resolve, reject) => {
    jsonPending.set(id, {
      resolve: (value) => resolve(value as T),
      reject,
    });
    worker.postMessage({ id, text });
  });
}
