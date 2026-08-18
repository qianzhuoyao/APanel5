export const SCENE3D_OBJECT_KEY_SEP = "|||";

export function makeScene3dObjectKey(modelId: string, objectName: string): string {
  return `${modelId}${SCENE3D_OBJECT_KEY_SEP}${objectName}`;
}

export function parseScene3dObjectKey(
  key: string | null | undefined
): { modelId: string; objectName: string } | null {
  if (!key) return null;
  const index = key.indexOf(SCENE3D_OBJECT_KEY_SEP);
  if (index < 0) return null;
  return {
    modelId: key.slice(0, index),
    objectName: key.slice(index + SCENE3D_OBJECT_KEY_SEP.length),
  };
}

export function isScene3dObjectVisible(options: {
  modelId: string;
  objectName: string;
  hiddenObjectKeys?: string[];
  soloObjectKey?: string | null;
}): boolean {
  const key = makeScene3dObjectKey(options.modelId, options.objectName);
  if (options.soloObjectKey) return options.soloObjectKey === key;
  return !options.hiddenObjectKeys?.includes(key);
}
