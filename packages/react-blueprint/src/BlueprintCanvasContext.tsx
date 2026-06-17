import {
  createContext,
  useContext,
  useRef,
  useSyncExternalStore,
  type ReactNode,
  type RefObject,
} from "react";
import { isClockNodeActive, subscribeActiveClockNodes } from "@arron/blueprint-dsl";

type BlueprintCanvasContextValue = {
  onSelectNodeRef: RefObject<((nodeId: string | null) => void) | undefined>;
  onAbortClockRef: RefObject<((nodeId: string) => void) | undefined>;
};

const BlueprintCanvasContext = createContext<BlueprintCanvasContextValue | null>(
  null
);

export function BlueprintCanvasProvider({
  onSelectNode,
  onAbortClock,
  children,
}: {
  onSelectNode?: (nodeId: string | null) => void;
  onAbortClock?: (nodeId: string) => void;
  children: ReactNode;
}) {
  const onSelectNodeRef = useRef(onSelectNode);
  onSelectNodeRef.current = onSelectNode;
  const onAbortClockRef = useRef(onAbortClock);
  onAbortClockRef.current = onAbortClock;

  return (
    <BlueprintCanvasContext.Provider value={{ onSelectNodeRef, onAbortClockRef }}>
      {children}
    </BlueprintCanvasContext.Provider>
  );
}

export function useBlueprintNodeSelect() {
  const ctx = useContext(BlueprintCanvasContext);
  return (nodeId: string) => {
    ctx?.onSelectNodeRef.current?.(nodeId);
  };
}

export function useBlueprintClockAbort() {
  const ctx = useContext(BlueprintCanvasContext);
  return (nodeId: string) => {
    ctx?.onAbortClockRef.current?.(nodeId);
  };
}

export function useClockNodeCanAbort(nodeId: string) {
  return useSyncExternalStore(
    subscribeActiveClockNodes,
    () => isClockNodeActive(nodeId),
    () => false
  );
}
