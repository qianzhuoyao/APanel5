import { useTheme } from "@arron/ui";

/** 与 next-themes 全局主题对齐，勿用 React Flow 的 system（会跟 OS 走） */
export function useBlueprintFlowColorMode(): "light" | "dark" {
  const { resolvedTheme, theme } = useTheme();
  const current = resolvedTheme ?? theme;
  return current === "dark" ? "dark" : "light";
}
