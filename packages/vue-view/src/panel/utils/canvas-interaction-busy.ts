/**
 * While Moveable is actively dragging/resizing/rotating, pause expensive
 * canvas-wide work and flip `html[data-rv-interacting]` for CSS.
 */
let busyDepth = 0;
const listeners = new Set<() => void>();

export function isCanvasInteractionBusy(): boolean {
  return busyDepth > 0;
}

function syncDocumentInteractingFlag(busy: boolean) {
  if (typeof document === "undefined") return;
  if (busy) document.documentElement.dataset.rvInteracting = "1";
  else delete document.documentElement.dataset.rvInteracting;
}

export function setCanvasInteractionBusy(busy: boolean): void {
  const prev = busyDepth > 0;
  if (busy) busyDepth += 1;
  else busyDepth = Math.max(0, busyDepth - 1);
  const next = busyDepth > 0;
  if (prev === next) return;
  syncDocumentInteractingFlag(next);
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
