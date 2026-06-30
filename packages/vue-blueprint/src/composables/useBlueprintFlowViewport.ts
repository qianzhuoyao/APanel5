import { onBeforeUnmount, onMounted, watch, type Ref } from "vue";
import { useVueFlow } from "@vue-flow/core";

/** 仅在蓝图面板尺寸变化时 fitView；不批量 updateNodeInternals，避免测量风暴卡死 */
export function useBlueprintFlowViewport(
  containerRef: Ref<HTMLElement | null>,
  enabled = true
) {
  const { fitView, getNodes } = useVueFlow();
  const lastSize = { w: 0, h: 0 };
  let fitRaf: number | null = null;
  let hasFitted = false;
  let ro: ResizeObserver | null = null;

  function scheduleFit() {
    if (getNodes.value.length === 0) return;
    if (fitRaf != null) cancelAnimationFrame(fitRaf);
    fitRaf = requestAnimationFrame(() => {
      fitRaf = null;
      fitView({ padding: 0.2, duration: 0, includeHiddenNodes: true });
      hasFitted = true;
    });
  }

  function syncOnResize(el: HTMLElement) {
    const { clientWidth: w, clientHeight: h } = el;
    if (w < 8 || h < 8) return;

    const sizeChanged =
      Math.abs(w - lastSize.w) > 2 || Math.abs(h - lastSize.h) > 2;
    if (!sizeChanged && hasFitted) return;

    lastSize.w = w;
    lastSize.h = h;
    scheduleFit();
  }

  function attach(el: HTMLElement) {
    syncOnResize(el);
    ro = new ResizeObserver(() => syncOnResize(el));
    ro.observe(el);
  }

  function detach() {
    ro?.disconnect();
    ro = null;
    if (fitRaf != null) cancelAnimationFrame(fitRaf);
    fitRaf = null;
    hasFitted = false;
  }

  onMounted(() => {
    watch(
      containerRef,
      (el) => {
        detach();
        if (!enabled || !el) return;
        attach(el);
      },
      { immediate: true }
    );
  });

  onBeforeUnmount(detach);
}
