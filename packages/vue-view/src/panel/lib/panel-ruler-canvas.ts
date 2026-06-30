export type RulerType = "horizontal" | "vertical";

export type RulerOptions = {
  type?: RulerType;
  zoom?: number;
  unit?: number;
  segment?: number;
  backgroundColor?: string;
  lineColor?: string;
  textColor?: string;
  font?: string;
  longLineSize?: number;
  shortLineSize?: number;
};

/** 轻量标尺实现，API 对齐 @scena/ruler，避免额外原生依赖 */
export class PanelRuler {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private options: Required<RulerOptions>;
  private scrollPos = 0;
  private ro: ResizeObserver | null = null;

  constructor(container: HTMLElement, options: RulerOptions = {}) {
    this.canvas = document.createElement("canvas");
    this.canvas.style.display = "block";
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    container.appendChild(this.canvas);
    const ctx = this.canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D not supported");
    this.ctx = ctx;
    this.options = {
      type: options.type ?? "horizontal",
      zoom: options.zoom ?? 1,
      unit: options.unit ?? 100,
      segment: options.segment ?? 10,
      backgroundColor: options.backgroundColor ?? "rgba(255,255,255,0.98)",
      lineColor: options.lineColor ?? "rgba(15,23,42,0.22)",
      textColor: options.textColor ?? "rgba(15,23,42,0.75)",
      font: options.font ?? "10px system-ui, sans-serif",
      longLineSize: options.longLineSize ?? 8,
      shortLineSize: options.shortLineSize ?? 4,
    };
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(container);
    this.resize();
  }

  scroll(scrollPos: number) {
    this.scrollPos = scrollPos;
    this.draw();
  }

  setState(patch: Partial<RulerOptions>) {
    Object.assign(this.options, patch);
    this.draw();
  }

  resize() {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    const dpr = window.devicePixelRatio || 1;
    const width = parent.clientWidth;
    const height = parent.clientHeight;
    this.canvas.width = Math.max(1, Math.floor(width * dpr));
    this.canvas.height = Math.max(1, Math.floor(height * dpr));
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.draw();
  }

  destroy() {
    this.ro?.disconnect();
    this.canvas.remove();
  }

  private draw() {
    const {
      type,
      zoom,
      unit,
      segment,
      backgroundColor,
      lineColor,
      textColor,
      font,
      longLineSize,
      shortLineSize,
    } = this.options;
    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);
    const ctx = this.ctx;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    const step = (unit / segment) * zoom;
    if (step <= 0) return;

    const isHorizontal = type === "horizontal";
    const span = isHorizontal ? width : height;
    const startWorld = -this.scrollPos;
    const startIndex = Math.floor(startWorld / step) - 1;
    const endIndex = Math.ceil((startWorld + span) / step) + 1;

    ctx.strokeStyle = lineColor;
    ctx.fillStyle = textColor;
    ctx.font = font;
    ctx.textBaseline = "top";

    for (let i = startIndex; i <= endIndex; i += 1) {
      const world = i * step;
      const px = world + this.scrollPos;
      if (px < -step || px > span + step) continue;
      const isMajor = i % segment === 0;
      const lineLen = isMajor ? longLineSize : shortLineSize;
      ctx.beginPath();
      if (isHorizontal) {
        ctx.moveTo(px + 0.5, height);
        ctx.lineTo(px + 0.5, height - lineLen);
        if (isMajor) {
          const label = String(Math.round((i * unit) / segment));
          ctx.fillText(label, px + 2, 2);
        }
      } else {
        ctx.moveTo(width, px + 0.5);
        ctx.lineTo(width - lineLen, px + 0.5);
        if (isMajor) {
          const label = String(Math.round((i * unit) / segment));
          ctx.save();
          ctx.translate(2, px + 2);
          ctx.fillText(label, 0, 0);
          ctx.restore();
        }
      }
      ctx.stroke();
    }
  }
}
