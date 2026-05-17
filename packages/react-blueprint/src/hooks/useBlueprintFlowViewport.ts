import { useEffect, useRef, type RefObject } from "react";
import { useReactFlow, useUpdateNodeInternals } from "@xyflow/react";

/** 面板展开后测量节点 Handle；仅在容器尺寸变化时 fitView（连线不触发，避免卡死） */
export function useBlueprintFlowViewport(
  containerRef: RefObject<HTMLElement | null>,
  nodeIdSig: string
) {
  const { fitView } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();
  const lastSizeRef = useRef({ w: 0, h: 0 });
  const lastNodeSigRef = useRef("");
  const fitRafRef = useRef<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scheduleFit = () => {
      if (fitRafRef.current != null) cancelAnimationFrame(fitRafRef.current);
      fitRafRef.current = requestAnimationFrame(() => {
        fitRafRef.current = null;
        if (!nodeIdSig) return;
        fitView({ padding: 0.2, duration: 0, includeHiddenNodes: true });
      });
    };

    const syncOnResize = () => {
      const { clientWidth: w, clientHeight: h } = el;
      if (w < 8 || h < 8) return;

      const sizeChanged =
        Math.abs(w - lastSizeRef.current.w) > 2 ||
        Math.abs(h - lastSizeRef.current.h) > 2;
      if (!sizeChanged) return;

      lastSizeRef.current = { w, h };
      scheduleFit();
    };

    const ro = new ResizeObserver(syncOnResize);
    ro.observe(el);
    return () => {
      ro.disconnect();
      if (fitRafRef.current != null) cancelAnimationFrame(fitRafRef.current);
    };
  }, [containerRef, nodeIdSig, fitView]);

  useEffect(() => {
    if (!nodeIdSig || nodeIdSig === lastNodeSigRef.current) return;
    lastNodeSigRef.current = nodeIdSig;

    for (const id of nodeIdSig.split(",").filter(Boolean)) {
      updateNodeInternals(id);
    }
  }, [nodeIdSig, updateNodeInternals]);
}
