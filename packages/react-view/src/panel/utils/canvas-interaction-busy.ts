/**
 * While Moveable is actively dragging/resizing/rotating, pause expensive
 * canvas-wide work (e.g. ellipsis overflow measurement via MutationObserver).
 */
let busyDepth = 0;
const listeners = new Set<() => void>();

export function isCanvasInteractionBusy(): boolean {
  return busyDepth > 0;
}

export function setCanvasInteractionBusy(busy: boolean): void {
  const prev = busyDepth > 0;
  if (busy) busyDepth += 1;
  else busyDepth = Math.max(0, busyDepth - 1);
  const next = busyDepth > 0;
  if (prev === next) return;
  listeners.forEach((listener) => listener());
}

export function subscribeCanvasInteractionBusy(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Run `fn` with busy=true; always clears one busy level afterward. */
export function withCanvasInteractionBusy<T>(fn: () => T): T {
  setCanvasInteractionBusy(true);
  try {
    return fn();
  } finally {
    setCanvasInteractionBusy(false);
  }
}
