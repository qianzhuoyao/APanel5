import { useCallback, useMemo, useState } from "react";
import type { PanelElement } from "../types";

const initialElements: PanelElement[] = [
  { id: "el-1", x: 80, y: 80, width: 160, height: 96, rotate: 0 },
  { id: "el-2", x: 300, y: 140, width: 220, height: 120, rotate: 0 },
  { id: "el-3", x: 180, y: 300, width: 140, height: 140, rotate: 0 },
];

export function usePanelElements() {
  const [elements, setElements] = useState<PanelElement[]>(initialElements);

  const byId = useMemo(() => {
    const map = new Map<string, PanelElement>();
    for (const el of elements) map.set(el.id, el);
    return map;
  }, [elements]);

  const updateElement = useCallback(
    (id: string, patch: Partial<PanelElement>) => {
      setElements((prev) =>
        prev.map((el) => (el.id === id ? { ...el, ...patch } : el))
      );
    },
    []
  );

  return { elements, byId, updateElement };
}

