declare module "echarts" {
  export type EChartsOption = Record<string, unknown>;
  export interface ECharts {
    setOption(option: EChartsOption, notMerge?: boolean): void;
    resize(): void;
    dispose(): void;
  }
  export function init(
    dom: HTMLElement,
    theme?: unknown,
    opts?: { renderer?: "canvas" | "svg" }
  ): ECharts;
}

declare module "infinite-viewer" {
  export type InfiniteViewerOptions = {
    margin?: number;
    threshold?: number;
    useMouseDrag?: boolean;
    useWheelScroll?: boolean;
    preventWheelClick?: boolean;
    displayVerticalScroll?: boolean;
    displayHorizontalScroll?: boolean;
  };

  export default class InfiniteViewer {
    constructor(
      containerElement: HTMLElement,
      viewportElement?: HTMLElement,
      options?: InfiniteViewerOptions
    );
    on(eventName: "scroll", handler: () => void): void;
    scrollTo(scrollLeft: number, scrollTop: number): void;
    getScrollLeft(): number;
    getScrollTop(): number;
    getContainer(): HTMLElement;
    destroy(): void;
  }
}

declare module "moveable" {
  export type MoveableOptions = Record<string, unknown>;

  export default class Moveable {
    constructor(container: HTMLElement, options?: MoveableOptions);
    target: HTMLElement | HTMLElement[] | null;
    zoom: number;
    on(eventName: string, handler: (e: any) => void): void;
    updateRect(): void;
    destroy(): void;
  }
}

declare module "selecto" {
  export type SelectoOptions = Record<string, unknown>;

  export default class Selecto {
    constructor(options?: SelectoOptions);
    on(eventName: string, handler: (e: any) => void): void;
    destroy(): void;
  }
}
