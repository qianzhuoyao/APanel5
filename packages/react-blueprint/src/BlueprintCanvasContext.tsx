import {
  createContext,
  useContext,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";

type BlueprintCanvasContextValue = {
  onSelectNodeRef: RefObject<((nodeId: string | null) => void) | undefined>;
};

const BlueprintCanvasContext = createContext<BlueprintCanvasContextValue | null>(
  null
);

export function BlueprintCanvasProvider({
  onSelectNode,
  children,
}: {
  onSelectNode?: (nodeId: string | null) => void;
  children: ReactNode;
}) {
  const onSelectNodeRef = useRef(onSelectNode);
  onSelectNodeRef.current = onSelectNode;

  return (
    <BlueprintCanvasContext.Provider value={{ onSelectNodeRef }}>
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
