import type { PanelElement } from "../types";

const STYLE_PROPS = [
  "display",
  "position",
  "left",
  "top",
  "width",
  "height",
  "margin",
  "padding",
  "border",
  "borderRadius",
  "background",
  "backgroundColor",
  "backgroundImage",
  "backgroundSize",
  "backgroundPosition",
  "backgroundRepeat",
  "color",
  "fontFamily",
  "fontSize",
  "fontWeight",
  "fontStyle",
  "lineHeight",
  "textAlign",
  "textDecoration",
  "letterSpacing",
  "wordBreak",
  "overflow",
  "opacity",
  "boxSizing",
  "flexDirection",
  "alignItems",
  "justifyContent",
  "gap",
  "gridTemplateColumns",
  "gridTemplateRows",
  "objectFit",
  "filter",
  "boxShadow",
  "transform",
  "transformOrigin",
  "zIndex",
] as const;

function loadImage(
  src: string,
  crossOrigin?: "anonymous" | "use-credentials"
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (crossOrigin && !src.startsWith("data:") && !src.startsWith("blob:")) {
      img.crossOrigin = crossOrigin;
    }
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image-load-failed"));
    img.src = src;
  });
}

function canvasToDataUrl(
  canvas: HTMLCanvasElement,
  mimeType = "image/png",
  quality?: number
): string | null {
  try {
    return canvas.toDataURL(mimeType, quality);
  } catch {
    return null;
  }
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("file-read-failed"));
    reader.readAsDataURL(blob);
  });
}

function absoluteUrl(src: string): string {
  try {
    return new URL(src, document.baseURI).href;
  } catch {
    return src;
  }
}

async function urlToDataUrl(src: string): Promise<string | null> {
  if (!src || src === "none") return null;
  if (src.startsWith("data:")) return src;

  const href = absoluteUrl(src);
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(href, { signal: controller.signal });
    if (res.ok) {
      return blobToDataUrl(await res.blob());
    }
  } catch {
    // CORS / network: fall through to image + anonymous canvas
  } finally {
    window.clearTimeout(timer);
  }

  try {
    const img = await loadImage(href, "anonymous");
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, img.naturalWidth || img.width);
    canvas.height = Math.max(1, img.naturalHeight || img.height);
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0);
    return canvasToDataUrl(canvas);
  } catch {
    return null;
  }
}

function parseCssUrl(value: string | undefined | null): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed === "none") return null;
  const start = trimmed.indexOf("url(");
  if (start < 0) return null;
  let i = start + 4;
  while (i < trimmed.length && /\s/.test(trimmed[i]!)) i += 1;
  const quote = trimmed[i] === '"' || trimmed[i] === "'" ? trimmed[i]! : "";
  if (quote) i += 1;
  const end = quote ? trimmed.lastIndexOf(quote) : trimmed.lastIndexOf(")");
  if (end <= i) return null;
  const url = trimmed.slice(i, end).trim();
  return url && url !== "none" ? url : null;
}

async function replaceCssUrls(value: string): Promise<string> {
  const url = parseCssUrl(value);
  if (!url || url.startsWith("data:")) return value;
  const dataUrl = await urlToDataUrl(url);
  if (!dataUrl) return value.replace(/url\(([\s\S]*?)\)/, "none");
  return value.replace(/url\(([\s\S]*?)\)/, `url("${dataUrl}")`);
}

async function inlineStyleUrls(el: HTMLElement) {
  const updates: Array<[string, string]> = [];
  for (let i = 0; i < el.style.length; i += 1) {
    const prop = el.style.item(i);
    const value = el.style.getPropertyValue(prop);
    if (value.includes("url(")) {
      updates.push([prop, await replaceCssUrls(value)]);
    }
  }
  for (const [prop, value] of updates) {
    el.style.setProperty(prop, value);
  }
}

async function inlineCloneResources(root: HTMLElement) {
  const images = Array.from(root.querySelectorAll("img"));
  await Promise.all(
    images.map(async (img) => {
      const src = img.currentSrc || img.getAttribute("src") || "";
      const dataUrl = await urlToDataUrl(src);
      if (dataUrl) {
        img.setAttribute("src", dataUrl);
        img.removeAttribute("srcset");
        img.removeAttribute("crossorigin");
      } else {
        img.removeAttribute("src");
        img.removeAttribute("srcset");
      }
    })
  );

  const elements = [root, ...Array.from(root.querySelectorAll<HTMLElement>("*"))];
  await Promise.all(elements.map((el) => inlineStyleUrls(el)));
}

function fallbackNodeDataUrl(node: HTMLElement, width: number, height: number): string {
  const emptyPng =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, width);
  canvas.height = Math.max(1, height);
  const ctx = canvas.getContext("2d");
  if (!ctx) return emptyPng;
  const bg = window.getComputedStyle(node).backgroundColor;
  ctx.fillStyle = bg && bg !== "rgba(0, 0, 0, 0)" ? bg : "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  return canvasToDataUrl(canvas) ?? emptyPng;
}

async function sourceToSafeImage(source: CanvasImageSource): Promise<HTMLImageElement | null> {
  try {
    if (source instanceof HTMLCanvasElement) {
      const dataUrl = canvasToDataUrl(source);
      return dataUrl ? loadImage(dataUrl) : null;
    }
    if (!(source instanceof HTMLImageElement)) return null;
    const src = source.currentSrc || source.src;
    if (!src) return null;
    if (src.startsWith("data:")) {
      return source.complete ? source : loadImage(src);
    }
    try {
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, source.naturalWidth || source.width);
      canvas.height = Math.max(1, source.naturalHeight || source.height);
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(source, 0, 0);
        const dataUrl = canvasToDataUrl(canvas);
        if (dataUrl) return loadImage(dataUrl);
      }
    } catch {
      // image is cross-origin without CORS; refetch below
    }
    const fetched = await urlToDataUrl(src);
    return fetched ? loadImage(fetched) : null;
  } catch {
    return null;
  }
}

function inlineComputedStyles(source: Element, target: Element) {
  if (!(source instanceof HTMLElement) || !(target instanceof HTMLElement)) return;
  const computed = window.getComputedStyle(source);
  for (const prop of STYLE_PROPS) {
    const value = computed.getPropertyValue(
      prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)
    );
    if (value) {
      target.style.setProperty(
        prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`),
        value
      );
    }
  }
  const sourceChildren = Array.from(source.children);
  const targetChildren = Array.from(target.children);
  sourceChildren.forEach((child, index) => {
    const targetChild = targetChildren[index];
    if (child && targetChild) inlineComputedStyles(child, targetChild);
  });
}

function replaceCanvasesInClone(source: Element, clone: Element) {
  const sourceCanvases = Array.from(source.querySelectorAll("canvas"));
  const cloneCanvases = Array.from(clone.querySelectorAll("canvas"));
  sourceCanvases.forEach((srcCanvas, index) => {
    const clonedCanvas = cloneCanvases[index];
    if (!clonedCanvas) return;
    const dataUrl = canvasToDataUrl(srcCanvas);
    if (!dataUrl) {
      clonedCanvas.remove();
      return;
    }
    const img = document.createElement("img");
    img.src = dataUrl;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "fill";
    img.style.display = "block";
    clonedCanvas.replaceWith(img);
  });
}

function replaceVideosInClone(source: Element, clone: Element) {
  const sourceVideos = Array.from(source.querySelectorAll("video"));
  const cloneVideos = Array.from(clone.querySelectorAll("video"));
  sourceVideos.forEach((video, index) => {
    const clonedVideo = cloneVideos[index];
    if (!clonedVideo) return;
    try {
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, video.videoWidth || video.clientWidth);
      canvas.height = Math.max(1, video.videoHeight || video.clientHeight);
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        clonedVideo.remove();
        return;
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvasToDataUrl(canvas);
      if (!dataUrl) {
        clonedVideo.remove();
        return;
      }
      const img = document.createElement("img");
      img.src = dataUrl;
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "contain";
      img.style.display = "block";
      clonedVideo.replaceWith(img);
    } catch {
      clonedVideo.remove();
    }
  });
}

async function nodeToDataUrlViaSvg(node: HTMLElement, width: number, height: number): Promise<string> {
  const clone = node.cloneNode(true) as HTMLElement;
  inlineComputedStyles(node, clone);
  replaceCanvasesInClone(node, clone);
  replaceVideosInClone(node, clone);
  await inlineCloneResources(clone);
  clone.style.width = `${width}px`;
  clone.style.height = `${height}px`;
  clone.style.margin = "0";
  clone.style.position = "relative";
  clone.style.left = "0";
  clone.style.top = "0";
  clone.style.transform = "none";

  const wrapper = document.createElement("div");
  wrapper.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
  wrapper.style.width = `${width}px`;
  wrapper.style.height = `${height}px`;
  wrapper.style.overflow = "hidden";
  wrapper.style.background = "#ffffff";
  wrapper.appendChild(clone);

  const serialized = new XMLSerializer().serializeToString(wrapper);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <foreignObject width="100%" height="100%">
      ${serialized}
    </foreignObject>
  </svg>`;
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  try {
    const img = await loadImage(url);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas-context-failed");
    ctx.drawImage(img, 0, 0);
    return canvasToDataUrl(canvas) ?? fallbackNodeDataUrl(node, width, height);
  } catch {
    return fallbackNodeDataUrl(node, width, height);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function drawFittedImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  width: number,
  height: number,
  backgroundSize: string
) {
  const iw = Math.max(1, img.naturalWidth || img.width);
  const ih = Math.max(1, img.naturalHeight || img.height);
  if (backgroundSize === "cover" || backgroundSize === "contain") {
    const scale =
      backgroundSize === "cover"
        ? Math.max(width / iw, height / ih)
        : Math.min(width / iw, height / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    ctx.drawImage(img, (width - dw) / 2, (height - dh) / 2, dw, dh);
    return;
  }
  ctx.drawImage(img, 0, 0, width, height);
}

async function paintCssBackgroundToImage(
  node: HTMLElement,
  width: number,
  height: number
): Promise<HTMLImageElement | null> {
  const style = window.getComputedStyle(node);
  const url =
    parseCssUrl(node.style.backgroundImage) ??
    parseCssUrl(style.backgroundImage);
  if (!url) return null;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const bgColor = style.backgroundColor;
  if (bgColor && bgColor !== "rgba(0, 0, 0, 0)") {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
  }
  const dataUrl = url.startsWith("data:") ? url : await urlToDataUrl(url);
  if (!dataUrl) return null;
  try {
    const img = await loadImage(dataUrl);
    drawFittedImage(ctx, img, width, height, style.backgroundSize || "");
  } catch {
    return null;
  }
  const out = canvasToDataUrl(canvas);
  return out ? loadImage(out) : null;
}

async function drawNodeOntoCanvas(
  ctx: CanvasRenderingContext2D,
  node: HTMLElement,
  x: number,
  y: number,
  width: number,
  height: number,
  rotateDeg: number
) {
  const w = Math.max(1, width);
  const h = Math.max(1, height);
  let image: HTMLImageElement | null = null;

  const canvases = Array.from(node.querySelectorAll("canvas"));
  if (canvases.length === 1) {
    image = await sourceToSafeImage(canvases[0]!);
  } else if (canvases.length > 1) {
    const merged = document.createElement("canvas");
    merged.width = w;
    merged.height = h;
    const mctx = merged.getContext("2d");
    if (mctx) {
      for (const canvas of canvases) {
        const safe = await sourceToSafeImage(canvas);
        if (!safe) continue;
        mctx.drawImage(safe, 0, 0, w, h);
      }
      image = await sourceToSafeImage(merged);
    }
  } else {
    const imgs = Array.from(node.querySelectorAll("img"));
    if (imgs.length === 1) {
      image = await sourceToSafeImage(imgs[0]!);
    } else if (imgs.length > 1) {
      const merged = document.createElement("canvas");
      merged.width = w;
      merged.height = h;
      const mctx = merged.getContext("2d");
      if (mctx) {
        for (const img of imgs) {
          const safe = await sourceToSafeImage(img);
          if (!safe) continue;
          mctx.drawImage(safe, 0, 0, w, h);
        }
        image = await sourceToSafeImage(merged);
      }
    }
  }

  if (!image) {
    image = await paintCssBackgroundToImage(node, w, h);
  }

  if (!image) {
    const dataUrl = await nodeToDataUrlViaSvg(node, w, h);
    image = await loadImage(dataUrl);
  }

  ctx.save();
  ctx.translate(x + w / 2, y + h / 2);
  ctx.rotate((rotateDeg * Math.PI) / 180);
  ctx.drawImage(image, -w / 2, -h / 2, w, h);
  ctx.restore();
}

async function loadUrlAsImage(url: string): Promise<HTMLImageElement | null> {
  try {
    if (url.startsWith("data:") || url.startsWith("blob:")) {
      return await loadImage(url);
    }
    const dataUrl = await urlToDataUrl(url);
    return dataUrl ? loadImage(dataUrl) : null;
  } catch {
    return null;
  }
}

function htmlToPlainText(html: string): string {
  const box = document.createElement("div");
  box.innerHTML = html;
  return (box.innerText || box.textContent || "").trim();
}

function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  width: number,
  height: number,
  options: {
    fontSize: number;
    fontFamily: string;
    fontWeight: string;
    color: string;
    align: CanvasTextAlign;
    lineHeight: number;
  }
) {
  const padding = 8;
  const maxWidth = Math.max(1, width - padding * 2);
  ctx.fillStyle = options.color;
  ctx.font = `${options.fontWeight} ${options.fontSize}px ${options.fontFamily}`;
  ctx.textAlign = options.align || "left";
  ctx.textBaseline = "top";
  const x =
    options.align === "center" ? width / 2 : options.align === "right" ? width - padding : padding;
  let y = padding;
  for (const paragraph of text.split("\n")) {
    const words = paragraph.length ? paragraph.split(/(\s+)/) : [""];
    let line = "";
    for (const word of words) {
      const next = line + word;
      if (ctx.measureText(next).width > maxWidth && line) {
        ctx.fillText(line, x, y, maxWidth);
        y += options.lineHeight;
        if (y > height - padding) return;
        line = word.trimStart();
      } else {
        line = next;
      }
    }
    ctx.fillText(line, x, y, maxWidth);
    y += options.lineHeight;
    if (y > height - padding) return;
  }
}

async function paintPanelElementOntoCanvas(
  ctx: CanvasRenderingContext2D,
  el: PanelElement,
  liveNode: HTMLElement | null,
  originX: number,
  originY: number
) {
  const w = Math.max(1, el.width);
  const h = Math.max(1, el.height);
  const x = el.x - originX;
  const y = el.y - originY;

  ctx.save();
  ctx.translate(x + w / 2, y + h / 2);
  ctx.rotate(((el.rotate ?? 0) * Math.PI) / 180);
  ctx.beginPath();
  ctx.rect(-w / 2, -h / 2, w, h);
  ctx.clip();
  ctx.translate(-w / 2, -h / 2);

  const computed = liveNode ? window.getComputedStyle(liveNode) : null;
  const bgColor =
    el.style?.backgroundColor ||
    (computed && computed.backgroundColor !== "rgba(0, 0, 0, 0)"
      ? computed.backgroundColor
      : "");
  if (bgColor) {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, w, h);
  }

  const bgUrl =
    parseCssUrl(el.style?.backgroundImage) ??
    parseCssUrl(liveNode?.style.backgroundImage) ??
    parseCssUrl(computed?.backgroundImage);
  if (bgUrl) {
    const img = await loadUrlAsImage(bgUrl);
    if (img) {
      drawFittedImage(
        ctx,
        img,
        w,
        h,
        el.style?.backgroundSize || computed?.backgroundSize || ""
      );
    }
  }

  if (liveNode) {
    for (const canvas of Array.from(liveNode.querySelectorAll("canvas"))) {
      const safe = await sourceToSafeImage(canvas);
      if (safe) ctx.drawImage(safe, 0, 0, w, h);
    }
    for (const img of Array.from(liveNode.querySelectorAll("img"))) {
      const safe = await sourceToSafeImage(img);
      if (safe) ctx.drawImage(safe, 0, 0, w, h);
    }
    const video = liveNode.querySelector("video");
    if (video) {
      try {
        ctx.drawImage(video, 0, 0, w, h);
      } catch {
        // tainted video frame
      }
    }
  }

  if (el.materialType === "text") {
    const textNode = liveNode?.querySelector<HTMLElement>("[data-panel-user-text]");
    const text = htmlToPlainText(el.textHtml || textNode?.innerHTML || "");
    if (text) {
      const fontSize = el.textFontSize ?? 14;
      drawWrappedText(ctx, text, w, h, {
        fontSize,
        fontFamily: el.textFontFamily || "sans-serif",
        fontWeight: String(el.textFontWeight || "400"),
        color: el.textColor || computed?.color || "#111827",
        align:
          el.textAlign === "center" || el.textAlign === "right" || el.textAlign === "left"
            ? el.textAlign
            : "left",
        lineHeight:
          typeof el.textLineHeight === "number" ? el.textLineHeight : fontSize * 1.4,
      });
    }
  }

  if (
    liveNode &&
    (el.materialType === "reference" ||
      el.materialType === "table" ||
      el.materialType === "grid")
  ) {
    try {
      await drawNodeOntoCanvas(ctx, liveNode, 0, 0, w, h, 0);
    } catch {
      // keep painted background / children
    }
  }

  ctx.restore();
}

export type CapturePreviewSceneOptions = {
  backgroundColor?: string;
  maxWidth?: number;
  maxHeight?: number;
  mimeType?: "image/png" | "image/jpeg";
  quality?: number;
};

export type CapturePreviewLayerOptions = CapturePreviewSceneOptions & {
  canvasRoot: HTMLElement | null;
  elements: PanelElement[];
};

export async function capturePreviewLayerSnapshot(
  options: CapturePreviewLayerOptions
): Promise<string | null> {
  const elements = options.elements;
  if (!elements.length) return null;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const el of elements) {
    const w = Math.max(1, el.width);
    const h = Math.max(1, el.height);
    const rad = ((el.rotate ?? 0) * Math.PI) / 180;
    const absCos = Math.abs(Math.cos(rad));
    const absSin = Math.abs(Math.sin(rad));
    const bw = w * absCos + h * absSin;
    const bh = w * absSin + h * absCos;
    const cx = el.x + w / 2;
    const cy = el.y + h / 2;
    minX = Math.min(minX, cx - bw / 2);
    minY = Math.min(minY, cy - bh / 2);
    maxX = Math.max(maxX, cx + bw / 2);
    maxY = Math.max(maxY, cy + bh / 2);
  }
  const width = Math.max(1, Math.round(maxX - minX));
  const height = Math.max(1, Math.round(maxY - minY));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas-context-failed");
  ctx.fillStyle = options.backgroundColor ?? "#ffffff";
  ctx.fillRect(0, 0, width, height);

  const sorted = [...elements].sort((a, b) => (a.zIndex ?? 1) - (b.zIndex ?? 1));
  for (const el of sorted) {
    const liveNode =
      options.canvasRoot?.querySelector<HTMLElement>(
        `[data-element-id="${el.id.replace(/"/g, '\\"')}"]`
      ) ?? null;
    try {
      await paintPanelElementOntoCanvas(ctx, el, liveNode, minX, minY);
    } catch {
      // keep remaining nodes
    }
  }

  const mimeType = options.mimeType ?? "image/png";
  const quality = options.quality ?? 0.92;
  let dataUrl = canvasToDataUrl(canvas, mimeType, quality);
  if (!dataUrl) return null;
  if (options.maxWidth || options.maxHeight) {
    dataUrl = await scaleDataUrl(
      dataUrl,
      options.maxWidth,
      options.maxHeight,
      mimeType,
      quality
    );
  }
  return dataUrl;
}

export async function capturePreviewSceneElement(
  scene: HTMLElement,
  sceneWidth: number,
  sceneHeight: number,
  options?: CapturePreviewSceneOptions
): Promise<string> {
  const width = Math.max(1, Math.round(sceneWidth));
  const height = Math.max(1, Math.round(sceneHeight));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas-context-failed");

  ctx.fillStyle = options?.backgroundColor ?? "#ffffff";
  ctx.fillRect(0, 0, width, height);

  const nodes = Array.from(scene.querySelectorAll<HTMLElement>("[data-element-id]")).filter(
    (node) => !node.parentElement?.closest("[data-element-id]")
  );
  const sorted = nodes
    .map((node) => {
      const zIndex = Number.parseInt(window.getComputedStyle(node).zIndex || "1", 10);
      return { node, zIndex: Number.isFinite(zIndex) ? zIndex : 1 };
    })
    .sort((a, b) => a.zIndex - b.zIndex);

  for (const { node } of sorted) {
    const left = Number.parseFloat(node.style.left || "0") || 0;
    const top = Number.parseFloat(node.style.top || "0") || 0;
    const nodeWidth = Number.parseFloat(node.style.width || "") || node.offsetWidth || 1;
    const nodeHeight = Number.parseFloat(node.style.height || "") || node.offsetHeight || 1;
    const transform = node.style.transform || "";
    const rotateMatch = /rotate\(([-\d.]+)deg\)/.exec(transform);
    const rotateDeg = rotateMatch ? Number.parseFloat(rotateMatch[1]!) : 0;
    try {
      await drawNodeOntoCanvas(ctx, node, left, top, nodeWidth, nodeHeight, rotateDeg);
    } catch {
      // skip nodes that cannot be snapshotted (tainted canvas / CORS)
    }
  }

  const mimeType = options?.mimeType ?? "image/png";
  const quality = options?.quality ?? 0.92;
  let dataUrl = canvasToDataUrl(canvas, mimeType, quality);
  if (!dataUrl) {
    throw new Error("preview-snapshot-tainted");
  }

  const maxWidth = options?.maxWidth;
  const maxHeight = options?.maxHeight;
  if (maxWidth || maxHeight) {
    dataUrl = await scaleDataUrl(dataUrl, maxWidth, maxHeight, mimeType, quality);
  }
  return dataUrl;
}

export async function scaleDataUrl(
  dataUrl: string,
  maxWidth?: number,
  maxHeight?: number,
  mimeType: "image/png" | "image/jpeg" = "image/png",
  quality = 0.92
): Promise<string> {
  if (!maxWidth && !maxHeight) return dataUrl;
  const img = await loadImage(dataUrl);
  const ratio = img.width / img.height;
  let targetWidth = img.width;
  let targetHeight = img.height;
  if (maxWidth && targetWidth > maxWidth) {
    targetWidth = maxWidth;
    targetHeight = Math.round(targetWidth / ratio);
  }
  if (maxHeight && targetHeight > maxHeight) {
    targetHeight = maxHeight;
    targetWidth = Math.round(targetHeight * ratio);
  }
  if (targetWidth === img.width && targetHeight === img.height) return dataUrl;
  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
  return canvasToDataUrl(canvas, mimeType, quality) ?? dataUrl;
}
