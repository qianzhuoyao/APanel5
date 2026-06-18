import { useCallback, useEffect, useRef, useState } from "react";

export function useRafThrottledScroll() {
  const scrollRef = useRef({ left: 0, top: 0 });
  const [scroll, setScroll] = useState({ left: 0, top: 0 });
  const rafRef = useRef<number | null>(null);

  const onScrollChange = useCallback((next: { left: number; top: number }) => {
    scrollRef.current = next;
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const latest = scrollRef.current;
      setScroll((prev) =>
        prev.left === latest.left && prev.top === latest.top ? prev : latest
      );
    });
  }, []);

  useEffect(
    () => () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
      }
    },
    []
  );

  return { scroll, scrollRef, onScrollChange };
}
