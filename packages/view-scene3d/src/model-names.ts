import type { Object3D } from "three";

/** 收集 GLTF 场景中所有具名节点（mesh/group），供配置面板选择 */
export function collectObjectNames(root: Object3D): string[] {
  const names = new Set<string>();
  root.traverse((obj) => {
    if (obj.name && obj.name.trim()) {
      names.add(obj.name.trim());
    }
  });
  return Array.from(names).sort((a, b) => a.localeCompare(b));
}

export function inferModelFormat(fileName: string): "glb" | "gltf" | "obj" | "fbx" | "unknown" {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".glb")) return "glb";
  if (lower.endsWith(".gltf")) return "gltf";
  if (lower.endsWith(".obj")) return "obj";
  if (lower.endsWith(".fbx")) return "fbx";
  return "unknown";
}
