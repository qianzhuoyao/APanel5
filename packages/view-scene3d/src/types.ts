export type Scene3dPivot =
  | "center"
  | "left"
  | "right"
  | "front"
  | "back"
  | "top"
  | "bottom";

export type Scene3dAxis = "x" | "y" | "z";

export type Scene3dRotationDirection = "clockwise" | "counterclockwise";

export type Scene3dModelFormat = "glb" | "gltf" | "obj" | "fbx" | "unknown";

export type Scene3dModelAsset = {
  id: string;
  /** 配置面板显示名 */
  label: string;
  url: string;
  fileName?: string;
  format?: Scene3dModelFormat;
  /** 从模型解析出的节点 name，按模型缓存 */
  objectNames?: string[];
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
};

export type Scene3dObjectTag = {
  id: string;
  modelId: string;
  objectName: string;
  html: string;
  /** 气泡相对节点包围盒的方向 */
  anchor: Scene3dPivot;
  offset?: [number, number, number];
};

export type Scene3dCameraState = {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
  near?: number;
  far?: number;
};

export type Scene3dOrbitSettings = {
  /** 预览模式下是否允许鼠标操控 */
  enableMouseControl: boolean;
  autoRotate: boolean;
  autoRotateSpeed: number;
  enableDamping: boolean;
};

export type Scene3dLighting = {
  ambientIntensity: number;
  directionalIntensity: number;
  backgroundColor: string;
};

/** 产品展示 / 数字孪生 / 交互沙盘 */
export type Scene3dPurpose = "product" | "twin" | "sandbox";

export type Scene3dEnvironmentPreset =
  | "none"
  | "studio"
  | "warehouse"
  | "city"
  | "sunset"
  | "apartment"
  | "forest";

export type Scene3dPresentation = {
  purpose: Scene3dPurpose;
  environmentPreset: Scene3dEnvironmentPreset;
  showContactShadows: boolean;
  showGrid: boolean;
  clickToFocus: boolean;
  highlightOnHover: boolean;
};

export type Scene3dModelAnimationRule = {
  id: string;
  modelId: string;
  objectName: string;
  axis: Scene3dAxis;
  direction: Scene3dRotationDirection;
  pivot: Scene3dPivot;
  angleDeg: number;
  durationSec: number;
  loop: boolean;
  delaySec?: number;
};

export type Scene3dCameraAnimationRule = {
  id: string;
  label?: string;
  mode?: "lerp" | "orbit";
  orbitSpeedDegPerSec?: number;
  from: Scene3dCameraState;
  to: Scene3dCameraState;
  durationSec: number;
  loop: boolean;
  pingPong?: boolean;
};

export type Scene3dConfig = {
  models: Scene3dModelAsset[];
  camera: Scene3dCameraState;
  orbit: Scene3dOrbitSettings;
  lighting: Scene3dLighting;
  presentation: Scene3dPresentation;
  modelAnimations: Scene3dModelAnimationRule[];
  cameraAnimations: Scene3dCameraAnimationRule[];
  enableShadows?: boolean;
  /** `${modelId}|||${objectName}` */
  hiddenObjectKeys?: string[];
  /** 单独显示某个节点；为 null 时按 hiddenObjectKeys */
  soloObjectKey?: string | null;
  /** 编辑态当前选中的节点，用于高亮 */
  selectedObjectKey?: string | null;
  objectTags?: Scene3dObjectTag[];
};
