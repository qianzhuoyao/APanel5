import { onUnmounted, ref, shallowRef } from "vue";

export function useRafThrottledScroll() {
  const scrollRef = shallowRef({ left: 0, top: 0 });
  const scroll = ref({ left: 0, top: 0 });
  let rafRef: number | null = null;

  function onScrollChange(next: { left: number; top: number }) {
    scrollRef.value = next;
    if (rafRef != null) return;
    rafRef = requestAnimationFrame(() => {
      rafRef = null;
      const latest = scrollRef.value;
      if (scroll.value.left !== latest.left || scroll.value.top !== latest.top) {
        scroll.value = { ...latest };
      }
    });
  }

  onUnmounted(() => {
    if (rafRef != null) cancelAnimationFrame(rafRef);
  });

  return { scroll, scrollRef, onScrollChange };
}
