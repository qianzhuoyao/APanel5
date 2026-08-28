import type { PanelElement, PanelLayer } from "../types";
import { CHART_TYPES, buildChartOption } from "../utils/chartOptionBuilder";
import {
  computePanelSceneBounds,
  resolvePreviewLayerElements,
} from "../utils/panelStateIO";
import {
  capturePreviewLayerSnapshot,
  capturePreviewSceneElement,
  scaleDataUrl,
  type CapturePreviewSceneOptions,
} from "./capture-preview-snapshot";

export type GetPreviewSnapshotOptions = CapturePreviewSceneOptions;

type PreviewSnapshotProvider = () => Promise<string | null>;

let previewSnapshotProvider: PreviewSnapshotProvider | null = null;

export function registerPreviewSnapshotProvider(provider: PreviewSnapshotProvider | null) {
  previewSnapshotProvider = provider;
}

function serializeNodeDom(
  sourceNode: HTMLElement,
  sourceElement: PanelElement,
  minX: number,
  minY: number,
  isChartNode: boolean
): string {
  const clone = sourceNode.cloneNode(true) as HTMLElement;
  clone.className = clone.className
    .split(/\s+/)
    .filter((cls) => cls && !cls.startsWith("ring-"))
    .join(" ");
  clone.removeAttribute("data-moveable-target");
  clone.style.left = `${sourceElement.x - minX}px`;
  clone.style.top = `${sourceElement.y - minY}px`;
  const sourceCanvases = Array.from(sourceNode.querySelectorAll("canvas"));
  const cloneCanvases = Array.from(clone.querySelectorAll("canvas"));
  if (isChartNode) return clone.outerHTML;
  sourceCanvases.forEach((srcCanvas, idx) => {
    const clonedCanvas = cloneCanvases[idx];
    if (!clonedCanvas) return;
    try {
      const dataUrl = srcCanvas.toDataURL("image/png");
      const img = document.createElement("img");
      img.src = dataUrl;
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "fill";
      img.style.display = "block";
      clonedCanvas.replaceWith(img);
    } catch {
      // ignore tainted canvas
    }
  });
  return clone.outerHTML;
}

function waitFrames(count = 2): Promise<void> {
  return new Promise((resolve) => {
    let remaining = count;
    const step = () => {
      remaining -= 1;
      if (remaining <= 0) resolve();
      else requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

export type BuildEditorPreviewSnapshotSceneOptions = {
  canvasRoot: HTMLElement | null;
  allElements: PanelElement[];
  layers: PanelLayer[];
  activeLayerId: string;
  outputScale: boolean;
  retryCount?: number;
};

export async function buildEditorPreviewSnapshotScene(
  options: BuildEditorPreviewSnapshotSceneOptions
): Promise<{ scene: HTMLElement; width: number; height: number } | null> {
  const retryCount = options.retryCount ?? 0;
  const layerElements = resolvePreviewLayerElements(
    options.allElements,
    options.layers,
    options.activeLayerId
  );
  if (!layerElements.length) return null;

  const sceneBounds = computePanelSceneBounds(layerElements);
  const mountedNodes = layerElements.map((el) => ({
    el,
    node:
      options.canvasRoot?.querySelector<HTMLElement>(`[data-element-id="${el.id}"]`) ??
      null,
  }));
  const mountedCount = mountedNodes.filter((item) => !!item.node).length;
  if (mountedCount < layerElements.length && retryCount < 20) {
    await new Promise((resolve) => window.setTimeout(resolve, 80));
    return buildEditorPreviewSnapshotScene({ ...options, retryCount: retryCount + 1 });
  }

  const previewNodesHtml = mountedNodes
    .map((item) => {
      if (!item.node) return "";
      return serializeNodeDom(
        item.node,
        item.el,
        sceneBounds.minX,
        sceneBounds.minY,
        CHART_TYPES.has(item.el.materialType ?? "")
      );
    })
    .filter(Boolean)
    .join("");
  if (!previewNodesHtml && retryCount < 20) {
    await new Promise((resolve) => window.setTimeout(resolve, 80));
    return buildEditorPreviewSnapshotScene({ ...options, retryCount: retryCount + 1 });
  }
  if (!previewNodesHtml) return null;

  const host = document.createElement("div");
  host.setAttribute("data-preview-snapshot-host", "true");
  host.style.position = "fixed";
  host.style.left = "-100000px";
  host.style.top = "0";
  host.style.width = `${sceneBounds.width}px`;
  host.style.height = `${sceneBounds.height}px`;
  host.style.overflow = "hidden";
  host.style.pointerEvents = "none";
  host.style.background = "#ffffff";

  const scene = document.createElement("div");
  scene.id = "preview-scene";
  scene.className = "relative shrink-0 origin-top-left";
  scene.style.width = `${sceneBounds.width}px`;
  scene.style.height = `${sceneBounds.height}px`;
  scene.style.transformOrigin = "left top";
  scene.innerHTML = previewNodesHtml;
  host.appendChild(scene);
  document.body.appendChild(host);

  const gridNodeIds = layerElements
    .filter((el) => el.materialType === "grid")
    .map((el) => el.id);
  for (const id of gridNodeIds) {
    const gridNode = scene.querySelector<HTMLElement>(`[data-element-id="${id}"]`);
    const content = gridNode?.firstElementChild as HTMLElement | null;
    if (content) {
      content.innerHTML = "";
      content.removeAttribute("style");
    }
  }

  const chartNodes = layerElements.filter((el) =>
    CHART_TYPES.has(el.materialType ?? "")
  );
  for (const el of chartNodes) {
    const hostEl = scene.querySelector<HTMLElement>(`[data-element-id="${el.id}"] > div`);
    if (!hostEl) continue;
    hostEl.innerHTML = "";
    const chart = (
      await import("echarts")
    ).init(hostEl, null, { renderer: el.chart?.renderMode ?? "canvas" });
    chart.setOption(buildChartOption(el) ?? {}, true);
    chart.resize();
  }

  await waitFrames(2);
  return { scene, width: sceneBounds.width, height: sceneBounds.height };
}

export function disposePreviewSnapshotScene(scene: HTMLElement) {
  const host = scene.parentElement;
  host?.remove();
}

async function finalizePreviewSnapshot(
  dataUrl: string,
  options?: GetPreviewSnapshotOptions
): Promise<string> {
  if (!options) return dataUrl;
  const mimeType = options.mimeType ?? "image/png";
  const quality = options.quality ?? 0.92;
  if (options.maxWidth || options.maxHeight) {
    return scaleDataUrl(dataUrl, options.maxWidth, options.maxHeight, mimeType, quality);
  }
  if (mimeType === "image/jpeg" && !dataUrl.startsWith("data:image/jpeg")) {
    return scaleDataUrl(dataUrl, undefined, undefined, mimeType, quality);
  }
  return dataUrl;
}

/**
 * 获取当前预览画面的 base64 图片（data URL），可用于工作区缩略图等场景。
 * 优先使用编辑器或在线预览页注册的截图提供者，其次尝试页面上的 `#preview-scene`。
 */
export async function getPreviewSnapshot(
  options?: GetPreviewSnapshotOptions
): Promise<string> {
  let dataUrl: string | null = null;
  if (previewSnapshotProvider) {
    dataUrl = await previewSnapshotProvider();
  }

  if (!dataUrl) {
    const scene = document.getElementById("preview-scene");
    if (scene instanceof HTMLElement) {
      const width = scene.offsetWidth || Number.parseFloat(scene.style.width) || 1;
      const height = scene.offsetHeight || Number.parseFloat(scene.style.height) || 1;
      return capturePreviewSceneElement(scene, width, height, options);
    }
    throw new Error(
      "Preview snapshot is unavailable. Mount the editor or open online preview first."
    );
  }

  return finalizePreviewSnapshot(dataUrl, options);
}

export async function captureEditorPreviewSnapshot(
  options: BuildEditorPreviewSnapshotSceneOptions & GetPreviewSnapshotOptions
): Promise<string | null> {
  const retryCount = options.retryCount ?? 0;
  const layerElements = resolvePreviewLayerElements(
    options.allElements,
    options.layers,
    options.activeLayerId
  );
  if (!layerElements.length) return null;

  const mountedCount = layerElements.filter((el) =>
    Boolean(options.canvasRoot?.querySelector(`[data-element-id="${el.id}"]`))
  ).length;
  if (mountedCount < layerElements.length && retryCount < 20) {
    await new Promise((resolve) => window.setTimeout(resolve, 80));
    return captureEditorPreviewSnapshot({ ...options, retryCount: retryCount + 1 });
  }

  return capturePreviewLayerSnapshot({
    canvasRoot: options.canvasRoot,
    elements: layerElements,
    backgroundColor: options.backgroundColor,
    maxWidth: options.maxWidth,
    maxHeight: options.maxHeight,
    mimeType: options.mimeType,
    quality: options.quality,
  });
}
