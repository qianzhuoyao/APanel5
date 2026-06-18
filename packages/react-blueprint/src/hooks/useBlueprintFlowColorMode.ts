import { useSyncExternalStore } from "react";

export type BlueprintColorMode = "light" | "dark";

function readDocumentColorMode(): BlueprintColorMode {
  if (typeof document === "undefined") return "light";
  const root = document.documentElement;
  if (root.classList.contains("dark")) return "dark";
  if (root.classList.contains("light")) return "light";
  const dataTheme = root.dataset.theme;
  if (dataTheme === "dark" || dataTheme === "light") return dataTheme;
  return "light";
}

function subscribeDocumentColorMode(onChange: () => void) {
  const root = document.documentElement;
  const observer = new MutationObserver(onChange);
  observer.observe(root, {
    attributes: true,
    attributeFilter: ["class", "data-theme"],
  });
  return () => observer.disconnect();
}

/** 与 document 上的全局主题（class / data-theme）对齐，避免与 panel 手动切换脱节 */
export function useBlueprintFlowColorMode(): BlueprintColorMode {
  return useSyncExternalStore(
    subscribeDocumentColorMode,
    readDocumentColorMode,
    () => "light"
  );
}
