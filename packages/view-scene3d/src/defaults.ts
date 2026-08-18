import type {
  Scene3dConfig,
  Scene3dPresentation,
  Scene3dPurpose,
} from "./types";

export function createDefaultPresentation(
  purpose: Scene3dPurpose = "product"
): Scene3dPresentation {
  if (purpose === "twin") {
    return {
      purpose,
      environmentPreset: "warehouse",
      showContactShadows: true,
      showGrid: true,
      clickToFocus: true,
      highlightOnHover: true,
    };
  }
  if (purpose === "sandbox") {
    return {
      purpose,
      environmentPreset: "none",
      showContactShadows: false,
      showGrid: true,
      clickToFocus: true,
      highlightOnHover: true,
    };
  }
  return {
    purpose: "product",
    environmentPreset: "studio",
    showContactShadows: true,
    showGrid: false,
    clickToFocus: true,
    highlightOnHover: true,
  };
}

export function purposePresetPatch(purpose: Scene3dPurpose): Partial<Scene3dConfig> {
  const presentation = createDefaultPresentation(purpose);
  if (purpose === "product") {
    return {
      presentation,
      lighting: {
        ambientIntensity: 0.35,
        directionalIntensity: 1.4,
        backgroundColor: "#0f1115",
      },
      orbit: {
        enableMouseControl: true,
        autoRotate: false,
        autoRotateSpeed: 0.6,
        enableDamping: true,
      },
      enableShadows: true,
    };
  }
  if (purpose === "twin") {
    return {
      presentation,
      lighting: {
        ambientIntensity: 0.5,
        directionalIntensity: 1.05,
        backgroundColor: "#12161c",
      },
      orbit: {
        enableMouseControl: true,
        autoRotate: false,
        autoRotateSpeed: 0.8,
        enableDamping: true,
      },
      enableShadows: true,
    };
  }
  return {
    presentation,
    lighting: {
      ambientIntensity: 0.7,
      directionalIntensity: 0.9,
      backgroundColor: "#1a1f27",
    },
    orbit: {
      enableMouseControl: true,
      autoRotate: false,
      autoRotateSpeed: 0.8,
      enableDamping: true,
    },
    enableShadows: false,
  };
}

export function createDefaultScene3dConfig(): Scene3dConfig {
  return {
    models: [],
    camera: {
      position: [4, 3, 6],
      target: [0, 0.5, 0],
      fov: 45,
      near: 0.1,
      far: 200,
    },
    orbit: {
      enableMouseControl: true,
      autoRotate: false,
      autoRotateSpeed: 0.6,
      enableDamping: true,
    },
    lighting: {
      ambientIntensity: 0.35,
      directionalIntensity: 1.4,
      backgroundColor: "#0f1115",
    },
    presentation: createDefaultPresentation("product"),
    modelAnimations: [],
    cameraAnimations: [],
    enableShadows: true,
    hiddenObjectKeys: [],
    soloObjectKey: null,
    selectedObjectKey: null,
    objectTags: [],
  };
}

export function mergeScene3dConfig(
  partial?: Partial<Scene3dConfig> | null
): Scene3dConfig {
  const base = createDefaultScene3dConfig();
  if (!partial) return base;
  return {
    ...base,
    ...partial,
    camera: { ...base.camera, ...partial.camera },
    orbit: { ...base.orbit, ...partial.orbit },
    lighting: { ...base.lighting, ...partial.lighting },
    presentation: { ...base.presentation, ...partial.presentation },
    models: partial.models ?? base.models,
    modelAnimations: partial.modelAnimations ?? base.modelAnimations,
    cameraAnimations: partial.cameraAnimations ?? base.cameraAnimations,
    hiddenObjectKeys: partial.hiddenObjectKeys ?? base.hiddenObjectKeys,
    soloObjectKey:
      partial.soloObjectKey === undefined ? base.soloObjectKey : partial.soloObjectKey,
    selectedObjectKey:
      partial.selectedObjectKey === undefined
        ? base.selectedObjectKey
        : partial.selectedObjectKey,
    objectTags: partial.objectTags ?? base.objectTags,
  };
}
