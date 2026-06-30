import { isClockNodeActive, subscribeActiveClockNodes } from "@arronqzy/blueprint-dsl";
import {
  inject,
  onScopeDispose,
  provide,
  ref,
  type InjectionKey,
  type Ref,
} from "vue";

type BlueprintCanvasContextValue = {
  onSelectNodeRef: Ref<((nodeId: string | null) => void) | undefined>;
  onAbortClockRef: Ref<((nodeId: string) => void) | undefined>;
};

const blueprintCanvasContextKey: InjectionKey<BlueprintCanvasContextValue> =
  Symbol("BlueprintCanvasContext");

export function provideBlueprintCanvasContext(options: {
  onSelectNode?: (nodeId: string | null) => void;
  onAbortClock?: (nodeId: string) => void;
}) {
  const onSelectNodeRef = ref(options.onSelectNode);
  const onAbortClockRef = ref(options.onAbortClock);

  provide(blueprintCanvasContextKey, { onSelectNodeRef, onAbortClockRef });

  return {
    onSelectNodeRef,
    onAbortClockRef,
  };
}

export function syncBlueprintCanvasContext(
  ctx: ReturnType<typeof provideBlueprintCanvasContext>,
  options: {
    onSelectNode?: (nodeId: string | null) => void;
    onAbortClock?: (nodeId: string) => void;
  }
) {
  ctx.onSelectNodeRef.value = options.onSelectNode;
  ctx.onAbortClockRef.value = options.onAbortClock;
}

export function useBlueprintNodeSelect() {
  const ctx = inject(blueprintCanvasContextKey, null);
  return (nodeId: string) => {
    ctx?.onSelectNodeRef.value?.(nodeId);
  };
}

export function useBlueprintClockAbort() {
  const ctx = inject(blueprintCanvasContextKey, null);
  return (nodeId: string) => {
    ctx?.onAbortClockRef.value?.(nodeId);
  };
}

export function useClockNodeCanAbort(nodeId: string) {
  const canAbort = ref(isClockNodeActive(nodeId));

  const unsubscribe = subscribeActiveClockNodes(() => {
    canAbort.value = isClockNodeActive(nodeId);
  });

  onScopeDispose(() => {
    unsubscribe();
  });

  return canAbort;
}
