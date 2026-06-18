const activeClockNodeIds = new Set<string>();
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function markClockNodeActive(nodeId: string) {
  if (activeClockNodeIds.has(nodeId)) return;
  activeClockNodeIds.add(nodeId);
  emit();
}

export function markClockNodeInactive(nodeId: string) {
  if (!activeClockNodeIds.delete(nodeId)) return;
  emit();
}

export function isClockNodeActive(nodeId: string): boolean {
  return activeClockNodeIds.has(nodeId);
}

export function getActiveClockNodeIds(): string[] {
  return [...activeClockNodeIds];
}

export function subscribeActiveClockNodes(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
