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

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image-load-failed"));
    img.src = src;
  });
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
      clonedCanvas.remove();
    }
  });
}

async function nodeToDataUrlViaSvg(node: HTMLElement, width: number, height: number): Promise<string> {
  const clone = node.cloneNode(true) as HTMLElement;
  inlineComputedStyles(node, clone);
  replaceCanvasesInClone(node, clone);
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
    return canvas.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(url);
  }
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
  let source: CanvasImageSource | null = null;

  const canvases = Array.from(node.querySelectorAll("canvas"));
  if (canvases.length === 1) {
    source = canvases[0]!;
  } else if (canvases.length > 1) {
    const merged = document.createElement("canvas");
    merged.width = w;
    merged.height = h;
    const mctx = merged.getContext("2d");
    if (mctx) {
      for (const canvas of canvases) {
        try {
          mctx.drawImage(canvas, 0, 0, w, h);
        } catch {
          // ignore tainted canvas
        }
      }
      source = merged;
    }
  } else {
    const imgs = Array.from(node.querySelectorAll("img"));
    if (imgs.length === 1) {
      source = imgs[0]!;
    } else if (imgs.length > 1) {
      const merged = document.createElement("canvas");
      merged.width = w;
      merged.height = h;
      const mctx = merged.getContext("2d");
      if (mctx) {
        for (const img of imgs) {
          try {
            mctx.drawImage(img, 0, 0, w, h);
          } catch {
            // ignore
          }
        }
        source = merged;
      }
    }
  }

  let image: HTMLImageElement;
  if (source) {
    if (source instanceof HTMLImageElement) {
      image = source;
      if (!image.complete) await loadImage(image.src);
    } else {
      const dataUrl =
        source instanceof HTMLCanvasElement
          ? source.toDataURL("image/png")
          : "";
      image = await loadImage(dataUrl);
    }
  } else {
    const dataUrl = await nodeToDataUrlViaSvg(node, w, h);
    image = await loadImage(dataUrl);
  }

  ctx.save();
  ctx.translate(x + w / 2, y + h / 2);
  ctx.rotate((rotateDeg * Math.PI) / 180);
  ctx.drawImage(image, -w / 2, -h / 2, w, h);
  ctx.restore();
}

export type CapturePreviewSceneOptions = {
  backgroundColor?: string;
  maxWidth?: number;
  maxHeight?: number;
  mimeType?: "image/png" | "image/jpeg";
  quality?: number;
};

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

  const nodes = Array.from(scene.querySelectorAll<HTMLElement>("[data-element-id]"));
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
    await drawNodeOntoCanvas(ctx, node, left, top, nodeWidth, nodeHeight, rotateDeg);
  }

  const mimeType = options?.mimeType ?? "image/png";
  const quality = options?.quality ?? 0.92;
  let dataUrl = canvas.toDataURL(mimeType, quality);

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
  return canvas.toDataURL(mimeType, quality);
}
