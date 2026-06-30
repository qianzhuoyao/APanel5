export type ViewportZoom = {
  x: number;
  y: number;
};

export function uniformViewportZoom(zoom: ViewportZoom): number {
  return Math.min(zoom.x, zoom.y);
}

export function clampViewportZoom(value: number): number {
  return Math.min(4, Math.max(0.25, value));
}

export function clampViewportZoomXY(zoom: ViewportZoom): ViewportZoom {
  return { x: clampViewportZoom(zoom.x), y: clampViewportZoom(zoom.y) };
}

export function scaleViewportZoom(
  zoom: ViewportZoom,
  factor: number
): ViewportZoom {
  return clampViewportZoomXY({
    x: zoom.x * factor,
    y: zoom.y * factor,
  });
}
