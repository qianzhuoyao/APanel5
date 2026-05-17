import { useEffect, useRef, type RefObject } from "react";
import { useReactFlow } from "@xyflow/react";

/** 仅在蓝图面板尺寸变化时 fitView；不批量 updateNodeInternals，避免测量风暴卡死 */
export function useBlueprintFlowViewport(
  containerRef: RefObject<HTMLElement | null>,
  nodeIdSig: string,
  enabled: boolean
) {
  const { fitView } = useReactFlow();
  const lastSizeRef = useRef({ w: 0, h: 0 });
  const fitRafRef = useRef<number | null>(null);
  const hasFittedRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      hasFittedRef.current = false;
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    const scheduleFit = () => {
      if (!nodeIdSig) return;
      if (fitRafRef.current != null) cancelAnimationFrame(fitRafRef.current);
      fitRafRef.current = requestAnimationFrame(() => {
        fitRafRef.current = null;
        fitView({ padding: 0.2, duration: 0, includeHiddenNodes: true });
        hasFittedRef.current = true;
      });
    };

    const syncOnResize = () => {
      const { clientWidth: w, clientHeight: h } = el;
      if (w < 8 || h < 8) return;

      const sizeChanged =
        Math.abs(w - lastSizeRef.current.w) > 2 ||
        Math.abs(h - lastSizeRef.current.h) > 2;
      if (!sizeChanged && hasFittedRef.current) return;

      lastSizeRef.current = { w, h };
      scheduleFit();
    };

    syncOnResize();
    const ro = new ResizeObserver(syncOnResize);
    ro.observe(el);
    return () => {
      ro.disconnect();
      if (fitRafRef.current != null) cancelAnimationFrame(fitRafRef.current);
    };
  }, [containerRef, nodeIdSig, fitView, enabled]);
}
