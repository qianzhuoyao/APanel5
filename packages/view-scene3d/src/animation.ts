import type { Scene3dCameraState } from "./types";

export function lerpCamera(
  from: Scene3dCameraState,
  to: Scene3dCameraState,
  t: number
): Scene3dCameraState {
  const clamp = Math.min(1, Math.max(0, t));
  const lerp3 = (a: [number, number, number], b: [number, number, number]) =>
    [
      a[0] + (b[0] - a[0]) * clamp,
      a[1] + (b[1] - a[1]) * clamp,
      a[2] + (b[2] - a[2]) * clamp,
    ] as [number, number, number];
  return {
    position: lerp3(from.position, to.position),
    target: lerp3(from.target, to.target),
    fov: from.fov + (to.fov - from.fov) * clamp,
    near: from.near,
    far: from.far,
  };
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
