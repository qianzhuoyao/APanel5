import type { PanelElementStyle } from "../types";

/** Build a CSS `url('...')` value from a plain URL / template string. */
export function cssUrlFromValue(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^url\(/i.test(trimmed) || /gradient\(/i.test(trimmed)) return trimmed;
  const escaped = trimmed.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
  return `url('${escaped}')`;
}

/** Prefer explicit backgroundImage; fall back to remote URL (supports scope templates after resolve). */
export function resolveBackgroundImageStyle(
  style?: PanelElementStyle | null
): string | undefined {
  if (!style) return undefined;
  if (style.backgroundImage?.trim()) return style.backgroundImage;
  if (style.backgroundImageRemoteUrl?.trim()) {
    return cssUrlFromValue(style.backgroundImageRemoteUrl);
  }
  return undefined;
}

/** Normalize config input: plain URL/template → both css + remote; css/gradient → backgroundImage only. */
export function patchBackgroundImageFromInput(
  value: string
): Partial<PanelElementStyle> {
  const trimmed = value.trim();
  if (!trimmed) {
    return { backgroundImage: undefined, backgroundImageRemoteUrl: undefined };
  }
  if (/^url\(/i.test(trimmed) || /gradient\(/i.test(trimmed)) {
    return { backgroundImage: trimmed, backgroundImageRemoteUrl: undefined };
  }
  return {
    backgroundImage: cssUrlFromValue(trimmed),
    backgroundImageRemoteUrl: trimmed,
  };
}
