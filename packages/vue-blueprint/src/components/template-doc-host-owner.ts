const hostIds: symbol[] = [];
let hostOwner: symbol | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function retainVueDocHost(id: symbol) {
  hostIds.push(id);
  if (!hostOwner) hostOwner = id;
  emit();
  return () => {
    const index = hostIds.indexOf(id);
    if (index >= 0) hostIds.splice(index, 1);
    if (hostOwner === id) {
      hostOwner = hostIds[0] ?? null;
      emit();
    }
  };
}

export function subscribeVueDocHost(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getVueDocHostOwner() {
  return hostOwner;
}
