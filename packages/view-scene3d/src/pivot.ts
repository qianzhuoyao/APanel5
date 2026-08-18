import { Box3, Vector3 } from "three";
import type { Scene3dPivot } from "./types";

export function getPivotWorldPoint(box: Box3, pivot: Scene3dPivot): Vector3 {
  const center = new Vector3();
  box.getCenter(center);
  const { min, max } = box;
  switch (pivot) {
    case "left":
      return new Vector3(min.x, center.y, center.z);
    case "right":
      return new Vector3(max.x, center.y, center.z);
    case "front":
      return new Vector3(center.x, center.y, max.z);
    case "back":
      return new Vector3(center.x, center.y, min.z);
    case "top":
      return new Vector3(center.x, max.y, center.z);
    case "bottom":
      return new Vector3(center.x, min.y, center.z);
    case "center":
    default:
      return center.clone();
  }
}

export function rotationSign(direction: "clockwise" | "counterclockwise"): number {
  return direction === "clockwise" ? -1 : 1;
}
