import { appStorageKey } from "@arronqzy/blueprint-dsl";

const CHANNEL = "arronqzy-blueprint-library-changed";

export function broadcastBlueprintLibraryChanged(nameSpace?: string | null): void {
  if (typeof BroadcastChannel === "undefined") return;
  const channel = new BroadcastChannel(appStorageKey(CHANNEL, nameSpace));
  channel.postMessage({ type: "changed" });
  channel.close();
}

export function subscribeBlueprintLibraryChanged(
  onChange: () => void,
  nameSpace?: string | null
): () => void {
  if (typeof BroadcastChannel === "undefined") {
    return () => {};
  }
  const channel = new BroadcastChannel(appStorageKey(CHANNEL, nameSpace));
  channel.onmessage = () => onChange();
  return () => channel.close();
}
