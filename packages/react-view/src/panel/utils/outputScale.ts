/** 产物预览是否缩放内部内容（字体等）。默认 false：块仍按视口撑满，内容保持原尺寸以免失真。 */
import { appStorageKey } from "@arronqzy/blueprint-dsl";

export const OUTPUT_SCALE_STORAGE_KEY = "panel:outputScale";

export function readOutputScale(nameSpace?: string | null): boolean {
  try {
    return localStorage.getItem(appStorageKey(OUTPUT_SCALE_STORAGE_KEY, nameSpace)) === "1";
  } catch {
    return false;
  }
}

export function writeOutputScale(enabled: boolean, nameSpace?: string | null) {
  try {
    localStorage.setItem(
      appStorageKey(OUTPUT_SCALE_STORAGE_KEY, nameSpace),
      enabled ? "1" : "0"
    );
  } catch {
    // ignore storage errors
  }
}

export type PreviewFillScale = {
  vw: number;
  vh: number;
  scaleX: number;
  scaleY: number;
};

export function getPreviewFillScale(
  sceneWidth: number,
  sceneHeight: number
): PreviewFillScale {
  const vw = window.innerWidth || 1;
  const vh = window.innerHeight || 1;
  const sw = Math.max(1, sceneWidth);
  const sh = Math.max(1, sceneHeight);
  return {
    vw,
    vh,
    scaleX: vw / sw,
    scaleY: vh / sh,
  };
}

/**
 * 预览始终按视口宽高比把场景块撑满。
 * outputScale=true：CSS transform 缩放整棵内容（含字体）。
 * outputScale=false：只把场景盒拉到视口大小，节点几何由调用方按 scale 映射，字体不跟着拉伸。
 */
export function applyPreviewSceneFill(
  scene: HTMLElement | null,
  sceneWidth: number,
  sceneHeight: number,
  outputScale: boolean
): PreviewFillScale {
  const fill = getPreviewFillScale(sceneWidth, sceneHeight);
  if (!Number.isFinite(fill.scaleX) || !Number.isFinite(fill.scaleY)) return fill;
  if (!scene) return fill;
  const root = scene.parentElement;
  if (root) root.style.overflow = "hidden";
  if (outputScale) {
    scene.style.width = `${Math.max(1, sceneWidth)}px`;
    scene.style.height = `${Math.max(1, sceneHeight)}px`;
    scene.style.transform = `translate(0px,0px) scale(${fill.scaleX},${fill.scaleY})`;
  } else {
    scene.style.width = `${fill.vw}px`;
    scene.style.height = `${fill.vh}px`;
    scene.style.transform = "none";
  }
  return fill;
}
