export const VIEWPORT_OVERFLOW_MODES = [
  "scroll-x",
  "scroll-y",
  "scroll",
  "clip",
] as const;

export type ViewportOverflowMode = (typeof VIEWPORT_OVERFLOW_MODES)[number];

export const DEFAULT_VIEWPORT_OVERFLOW: ViewportOverflowMode = "clip";

export function isViewportOverflowMode(
  value: unknown
): value is ViewportOverflowMode {
  return (
    value === "scroll-x" ||
    value === "scroll-y" ||
    value === "scroll" ||
    value === "clip"
  );
}

export function normalizeViewportOverflow(
  value: unknown
): ViewportOverflowMode {
  return isViewportOverflowMode(value) ? value : DEFAULT_VIEWPORT_OVERFLOW;
}

export function viewportOverflowStyle(mode: ViewportOverflowMode): {
  overflowX: "hidden" | "auto";
  overflowY: "hidden" | "auto";
} {
  switch (mode) {
    case "scroll-x":
      return { overflowX: "auto", overflowY: "hidden" };
    case "scroll-y":
      return { overflowX: "hidden", overflowY: "auto" };
    case "scroll":
      return { overflowX: "auto", overflowY: "auto" };
    default:
      return { overflowX: "hidden", overflowY: "hidden" };
  }
}

export function isViewportNode(
  el: { materialType?: string } | undefined
): boolean {
  return el?.materialType === "viewport";
}

/** 引用节点与视窗节点都通过选择图层来预览内容 */
export function isLayerPreviewNode(
  el: { materialType?: string } | undefined
): boolean {
  return el?.materialType === "reference" || el?.materialType === "viewport";
}

/**
 * 视窗按自身宽高开窗；预览里节点会被整体拉满视口，
 * 内部引用内容必须用同一套缩放，滚动比例才和编辑态一致。
 */
export function viewportWindowContentScale(
  current: { id: string; width: number; height: number },
  originals: ReadonlyArray<{ id: string; width: number; height: number }>
): { scaleX: number; scaleY: number } {
  const original = originals.find((n) => n.id === current.id);
  const ow = Math.max(1, original?.width ?? current.width);
  const oh = Math.max(1, original?.height ?? current.height);
  return {
    scaleX: Math.max(1, current.width) / ow,
    scaleY: Math.max(1, current.height) / oh,
  };
}
