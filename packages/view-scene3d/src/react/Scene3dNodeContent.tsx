import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Grid,
  Html,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import {
  Box3,
  Color,
  Euler,
  Group,
  MathUtils,
  Mesh,
  MOUSE,
  Object3D,
  PerspectiveCamera,
  Quaternion,
  Vector3,
  type MeshStandardMaterial,
} from "three";
import { useI18n } from "@arronqzy/i18n/react";
import { Scene3dA11y, Scene3dA11yAnnouncer } from "./Scene3dA11y";
import { Scene3dEffects } from "./Scene3dEffects";
import { Scene3dPhysics } from "./Scene3dPhysics";
import {
  collectObjectNames,
  createDefaultScene3dConfig,
  easeInOutCubic,
  getPivotWorldPoint,
  lerpCamera,
  mergeScene3dConfig,
  rotationSign,
  type Scene3dCameraState,
  type Scene3dConfig,
  type Scene3dEnvironmentPreset,
  type Scene3dModelAnimationRule,
  type Scene3dModelAsset,
  type Scene3dObjectTag,
} from "../index";
import { isScene3dObjectVisible } from "../object-state";

type Scene3dCanvasProps = {
  config: Scene3dConfig;
  orbitEnabled: boolean;
  previewMode: boolean;
  onCameraChange?: (camera: Scene3dCameraState) => void;
  onAutoFitCamera?: (camera: Scene3dCameraState) => void;
  onObjectNamesDiscovered?: (modelId: string, names: string[]) => void;
  onHoverName?: (name: string | null) => void;
  onControlsReady?: (controls: OrbitControlsImpl | null) => void;
  onCanvasDomReady?: (canvas: HTMLCanvasElement | null) => void;
};

const ENV_PRESETS: Exclude<Scene3dEnvironmentPreset, "none">[] = [
  "studio",
  "warehouse",
  "city",
  "sunset",
  "apartment",
  "forest",
];

function isEnvPreset(
  value: Scene3dEnvironmentPreset
): value is Exclude<Scene3dEnvironmentPreset, "none"> {
  return ENV_PRESETS.includes(value as Exclude<Scene3dEnvironmentPreset, "none">);
}

function CameraRig({
  config,
  orbitEnabled,
  previewMode,
  onCameraChange,
  cameraAnimating,
  focusPoint,
  onControlsReady,
  onOrbitInteractionChange,
}: {
  config: Scene3dConfig;
  orbitEnabled: boolean;
  previewMode: boolean;
  onCameraChange?: (camera: Scene3dCameraState) => void;
  cameraAnimating: boolean;
  focusPoint: Vector3 | null;
  onControlsReady?: (controls: OrbitControlsImpl | null) => void;
  onOrbitInteractionChange?: (active: boolean) => void;
}) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const { camera, invalidate } = useThree();
  const lastEmitRef = useRef(0);
  const resumeCameraAnimRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pausePreviewCameraAnimation = useCallback(() => {
    if (!previewMode || !onOrbitInteractionChange) return;
    onOrbitInteractionChange(true);
    if (resumeCameraAnimRef.current) clearTimeout(resumeCameraAnimRef.current);
    resumeCameraAnimRef.current = setTimeout(() => {
      onOrbitInteractionChange(false);
      resumeCameraAnimRef.current = null;
    }, 1500);
  }, [onOrbitInteractionChange, previewMode]);
  const setControlsRef = useCallback(
    (controls: OrbitControlsImpl | null) => {
      controlsRef.current = controls;
      onControlsReady?.(controls);
    },
    [onControlsReady]
  );
  useEffect(
    () => () => {
      if (resumeCameraAnimRef.current) clearTimeout(resumeCameraAnimRef.current);
    },
    []
  );
  const autoRotateActive = !cameraAnimating && config.orbit.autoRotate && (previewMode || !orbitEnabled) && !focusPoint;
  const controlsEnabled = orbitEnabled || autoRotateActive;

  useEffect(() => {
    if (cameraAnimating || controlsEnabled) return;
    if (!(camera instanceof PerspectiveCamera)) return;
    camera.position.set(...config.camera.position);
    camera.fov = config.camera.fov;
    camera.near = config.camera.near ?? 0.1;
    camera.far = config.camera.far ?? 200;
    camera.updateProjectionMatrix();
    if (controlsRef.current) {
      controlsRef.current.target.set(...config.camera.target);
      controlsRef.current.update();
    }
    invalidate();
  }, [
    camera,
    cameraAnimating,
    config.camera.far,
    config.camera.fov,
    config.camera.near,
    config.camera.position,
    config.camera.target,
    invalidate,
    controlsEnabled,
  ]);

  useFrame(() => {
    if (cameraAnimating && camera instanceof PerspectiveCamera) {
      camera.position.set(...config.camera.position);
      camera.fov = config.camera.fov;
      camera.near = config.camera.near ?? 0.1;
      camera.far = config.camera.far ?? 200;
      camera.updateProjectionMatrix();
      if (controlsRef.current) {
        controlsRef.current.target.set(...config.camera.target);
        controlsRef.current.update();
      }
      invalidate();
      return;
    }
    if (focusPoint && controlsRef.current) {
      controlsRef.current.target.lerp(focusPoint, 0.12);
      controlsRef.current.update();
      invalidate();
    }
    if (!orbitEnabled || !onCameraChange || !controlsRef.current) return;
    const now = performance.now();
    if (now - lastEmitRef.current < 120) return;
    lastEmitRef.current = now;
    onCameraChange({
      position: [camera.position.x, camera.position.y, camera.position.z],
      target: [
        controlsRef.current.target.x,
        controlsRef.current.target.y,
        controlsRef.current.target.z,
      ],
      fov: config.camera.fov,
      near: config.camera.near,
      far: config.camera.far,
    });
  });

  return (
    <OrbitControls
      ref={setControlsRef}
      enabled={controlsEnabled}
      enablePan={orbitEnabled}
      enableZoom={orbitEnabled}
      enableRotate={orbitEnabled}
      screenSpacePanning
      enableDamping={config.orbit.enableDamping}
      autoRotate={autoRotateActive}
      autoRotateSpeed={config.orbit.autoRotateSpeed}
      mouseButtons={{
        LEFT: MOUSE.ROTATE,
        MIDDLE: MOUSE.DOLLY,
        RIGHT: MOUSE.PAN,
      }}
      makeDefault
      onChange={() => {
        invalidate();
        pausePreviewCameraAnimation();
      }}
      onStart={() => {
        if (resumeCameraAnimRef.current) clearTimeout(resumeCameraAnimRef.current);
        onOrbitInteractionChange?.(true);
      }}
      onEnd={() => {
        pausePreviewCameraAnimation();
      }}
    />
  );
}

function AnimatedModelPart({
  root,
  objectName,
  rule,
  playing,
}: {
  root: Object3D;
  objectName: string;
  rule: Scene3dModelAnimationRule;
  playing: boolean;
}) {
  const targetRef = useRef<Object3D | null>(null);
  const baseRotationRef = useRef<Euler | null>(null);
  const basePositionRef = useRef<Vector3 | null>(null);
  const startedAtRef = useRef<number | null>(null);

  useEffect(() => {
    targetRef.current = root.getObjectByName(objectName) ?? null;
    if (targetRef.current) {
      baseRotationRef.current = targetRef.current.rotation.clone();
      basePositionRef.current = targetRef.current.position.clone();
    }
    startedAtRef.current = null;
  }, [objectName, root, rule.id]);

  useFrame(({ clock }) => {
    const target = targetRef.current;
    const baseRot = baseRotationRef.current;
    const basePos = basePositionRef.current;
    if (!target || !baseRot || !basePos || !playing) return;
    if (startedAtRef.current === null) {
      startedAtRef.current = clock.elapsedTime + (rule.delaySec ?? 0);
    }
    const elapsed = clock.elapsedTime - startedAtRef.current;
    if (elapsed < 0) return;
    const duration = Math.max(0.05, rule.durationSec);
    let progress = elapsed / duration;
    progress = rule.loop ? progress % 1 : Math.min(1, progress);
    const eased = easeInOutCubic(progress);
    const angleRad =
      MathUtils.degToRad(rule.angleDeg) * rotationSign(rule.direction) * eased;

    target.rotation.copy(baseRot);
    target.position.copy(basePos);
    target.updateMatrixWorld(true);

    const box = new Box3().setFromObject(target);
    const pivot = getPivotWorldPoint(box, rule.pivot);
    const axis =
      rule.axis === "x"
        ? new Vector3(1, 0, 0)
        : rule.axis === "y"
          ? new Vector3(0, 1, 0)
          : new Vector3(0, 0, 1);
    const q = new Quaternion().setFromAxisAngle(axis, angleRad);
    target.position.sub(pivot);
    target.position.applyQuaternion(q);
    target.position.add(pivot);
    target.quaternion.premultiply(q);
  });

  return null;
}

function ObjectHtmlTag({
  root,
  tag,
}: {
  root: Object3D;
  tag: Scene3dObjectTag;
}) {
  const groupRef = useRef<Group>(null);

  useFrame(() => {
    const group = groupRef.current;
    if (!group || !tag.html.trim()) return;
    const target = root.getObjectByName(tag.objectName);
    if (!target) {
      group.visible = false;
      return;
    }
    target.updateMatrixWorld(true);
    const box = new Box3().setFromObject(target);
    if (box.isEmpty()) {
      group.visible = false;
      return;
    }
    const world = getPivotWorldPoint(box, tag.anchor);
    if (tag.offset) world.add(new Vector3(...tag.offset));
    const parent = group.parent;
    if (parent) parent.worldToLocal(world);
    group.position.copy(world);
    group.visible = target.visible;
  });

  if (!tag.html.trim()) return null;

  return (
    <group ref={groupRef}>
      <Html center zIndexRange={[40, 0]} style={{ pointerEvents: "none" }}>
        <div
          className="scene3d-object-tag"
          style={{
            maxWidth: 240,
            padding: "6px 8px",
            borderRadius: 8,
            background: "rgba(15, 17, 21, 0.82)",
            color: "#fff",
            fontSize: 12,
            lineHeight: 1.45,
            boxShadow: "0 6px 18px rgba(0,0,0,.28)",
            pointerEvents: "none",
            whiteSpace: "normal",
          }}
          dangerouslySetInnerHTML={{ __html: tag.html }}
        />
      </Html>
    </group>
  );
}

function GltfModel({
  asset,
  onObjectNamesDiscovered,
  animations,
  playing,
  interactive,
  highlightOnHover,
  clickToFocus,
  onFocus,
  onHoverName,
  onLoaded,
  hiddenObjectKeys,
  soloObjectKey,
  selectedObjectKey,
  objectTags,
  highlightSelection,
}: {
  asset: Scene3dModelAsset;
  onObjectNamesDiscovered?: (modelId: string, names: string[]) => void;
  animations: Scene3dModelAnimationRule[];
  playing: boolean;
  interactive: boolean;
  highlightOnHover: boolean;
  clickToFocus: boolean;
  onFocus?: (point: Vector3) => void;
  onHoverName?: (name: string | null) => void;
  onLoaded?: () => void;
  hiddenObjectKeys?: string[];
  soloObjectKey?: string | null;
  selectedObjectKey?: string | null;
  objectTags: Scene3dObjectTag[];
  highlightSelection: boolean;
}) {
  const gltf = useGLTF(asset.url);
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);
  const hoveredRef = useRef<Mesh | null>(null);
  const hoveredColorRef = useRef<Color | null>(null);

  useEffect(() => {
    const box = new Box3().setFromObject(scene);
    const center = box.getCenter(new Vector3());
    scene.position.x -= center.x;
    scene.position.z -= center.z;
    scene.position.y -= box.min.y;

    const names = collectObjectNames(scene);
    onObjectNamesDiscovered?.(asset.id, names);
    onLoaded?.();
    return () => {
      scene.traverse((obj) => {
        if (!(obj instanceof Mesh)) return;
        obj.geometry?.dispose();
      });
    };
  }, [asset.id, onLoaded, onObjectNamesDiscovered, scene]);

  useEffect(() => {
    const named = new Set(asset.objectNames ?? collectObjectNames(scene));
    scene.traverse((obj) => {
      if (!obj.name || !named.has(obj.name)) return;
      obj.visible = isScene3dObjectVisible({
        modelId: asset.id,
        objectName: obj.name,
        hiddenObjectKeys,
        soloObjectKey,
      });
    });
  }, [asset.id, asset.objectNames, hiddenObjectKeys, scene, soloObjectKey]);

  useEffect(() => {
    if (!highlightSelection) return;
    const parsed = selectedObjectKey?.startsWith(`${asset.id}|||`)
      ? selectedObjectKey.slice(asset.id.length + 3)
      : null;
    const target = parsed ? scene.getObjectByName(parsed) : null;
    const originals: Array<{ mesh: Mesh; material: Mesh["material"] }> = [];
    target?.traverse((obj) => {
      if (!(obj instanceof Mesh) || !obj.material) return;
      originals.push({ mesh: obj, material: obj.material });
      const cloned = Array.isArray(obj.material)
        ? obj.material.map((m) => m.clone())
        : obj.material.clone();
      const list = Array.isArray(cloned) ? cloned : [cloned];
      for (const mat of list) {
        if ("emissive" in mat) {
          (mat as MeshStandardMaterial).emissive.set("#38bdf8");
          (mat as MeshStandardMaterial).emissiveIntensity = 0.9;
        }
      }
      obj.material = cloned;
    });
    return () => {
      for (const item of originals) item.mesh.material = item.material;
    };
  }, [asset.id, highlightSelection, scene, selectedObjectKey]);

  const clearHover = useCallback(() => {
    const mesh = hoveredRef.current;
    const color = hoveredColorRef.current;
    if (mesh && color && mesh.material && "emissive" in mesh.material) {
      (mesh.material as MeshStandardMaterial).emissive.copy(color);
    }
    hoveredRef.current = null;
    hoveredColorRef.current = null;
    onHoverName?.(null);
  }, [onHoverName]);

  const onPointerOver = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      if (!interactive || !highlightOnHover) return;
      event.stopPropagation();
      const mesh = event.object;
      if (!(mesh instanceof Mesh) || !mesh.material || !("emissive" in mesh.material)) {
        return;
      }
      clearHover();
      const mat = mesh.material as MeshStandardMaterial;
      hoveredRef.current = mesh;
      hoveredColorRef.current = mat.emissive.clone();
      mat.emissive.set("#3b82f6");
      onHoverName?.(mesh.name || asset.label);
    },
    [asset.label, clearHover, highlightOnHover, interactive, onHoverName]
  );

  const onPointerOut = useCallback(() => {
    if (!interactive) return;
    clearHover();
  }, [clearHover, interactive]);

  const onClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      if (!interactive || !clickToFocus) return;
      event.stopPropagation();
      const box = new Box3().setFromObject(event.object);
      onFocus?.(box.getCenter(new Vector3()));
    },
    [clickToFocus, interactive, onFocus]
  );

  const pos = asset.position ?? [0, 0, 0];
  const rot = asset.rotation ?? [0, 0, 0];
  const scale = asset.scale ?? [1, 1, 1];

  return (
    <group position={pos} rotation={rot} scale={scale}>
      <primitive
        object={scene}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onClick={onClick}
      />
      {animations.map((rule) => (
        <AnimatedModelPart
          key={rule.id}
          root={scene}
          objectName={rule.objectName}
          rule={rule}
          playing={playing}
        />
      ))}
      {objectTags
        .filter((tag) => tag.modelId === asset.id && tag.html.trim())
        .map((tag) => (
          <ObjectHtmlTag key={tag.id} root={scene} tag={tag} />
        ))}
    </group>
  );
}

function CameraAnimationDriver({
  config,
  playing,
  onCameraUpdate,
}: {
  config: Scene3dConfig;
  playing: boolean;
  onCameraUpdate: (camera: Scene3dCameraState) => void;
}) {
  const startedAtRef = useRef<number | null>(null);
  const rule = config.cameraAnimations[config.cameraAnimations.length - 1];

  useEffect(() => {
    startedAtRef.current = null;
  }, [rule?.id]);

  useFrame(({ clock }) => {
    if (!playing || !rule) return;
    if (startedAtRef.current === null) startedAtRef.current = clock.elapsedTime;
    const elapsed = clock.elapsedTime - startedAtRef.current;
    const duration = Math.max(0.05, rule.durationSec);
    let t = elapsed / duration;
    if (rule.loop) {
      t = rule.pingPong ? Math.abs((t % 2) - 1) : t % 1;
    } else {
      t = Math.min(1, t);
    }
    if (rule.mode === "orbit") {
      const [tx, ty, tz] = rule.from.target;
      const ox = rule.from.position[0] - tx;
      const oy = rule.from.position[1] - ty;
      const oz = rule.from.position[2] - tz;
      const radius = Math.max(0.001, Math.hypot(ox, oz));
      const baseTheta = Math.atan2(oz, ox);
      const speedRad = MathUtils.degToRad(rule.orbitSpeedDegPerSec ?? 24);
      const angle = rule.loop ? elapsed * speedRad : Math.min(elapsed, duration) * speedRad;
      const theta = baseTheta + angle;
      onCameraUpdate({
        ...rule.from,
        position: [tx + Math.cos(theta) * radius, ty + oy, tz + Math.sin(theta) * radius],
        target: rule.from.target,
      });
      return;
    }
    onCameraUpdate(lerpCamera(rule.from, rule.to, easeInOutCubic(t)));
  });

  return null;
}

function InvalidateOnChange({ revision }: { revision: string }) {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    invalidate();
  }, [invalidate, revision]);
  return null;
}

function Scene3dScene({
  config,
  orbitEnabled,
  onCameraChange,
  onAutoFitCamera,
  onObjectNamesDiscovered,
  previewMode,
  onHoverName,
  onControlsReady,
}: Scene3dCanvasProps) {
  const [runtimeCamera, setRuntimeCamera] = useState(config.camera);
  const [focusPoint, setFocusPoint] = useState<Vector3 | null>(null);
  const [orbitInteracting, setOrbitInteracting] = useState(false);
  const [loadedEpoch, setLoadedEpoch] = useState(0);
  const contentRef = useRef<Object3D | null>(null);
  const { size } = useThree();
  const playbackActive = previewMode || !orbitEnabled;
  const manualOrbitEnabled = previewMode
    ? orbitEnabled
    : orbitEnabled && !(config.cameraAnimations.length > 0 && playbackActive);
  const cameraAnimating =
    config.cameraAnimations.length > 0 &&
    playbackActive &&
    !(previewMode && manualOrbitEnabled && orbitInteracting);
  const presentation = config.presentation;
  const env = presentation.environmentPreset;
  const defaultCamera = useMemo(() => createDefaultScene3dConfig().camera, []);
  const purpose = presentation.purpose;

  useEffect(() => {
    setRuntimeCamera(config.camera);
    setFocusPoint(null);
  }, [config.camera]);

  useEffect(() => {
    if (previewMode) return;
    const sameCamera =
      config.camera.fov === defaultCamera.fov &&
      config.camera.near === defaultCamera.near &&
      config.camera.far === defaultCamera.far &&
      config.camera.position.every((v, i) => Math.abs(v - defaultCamera.position[i]) < 0.0001) &&
      config.camera.target.every((v, i) => Math.abs(v - defaultCamera.target[i]) < 0.0001);
    if (!sameCamera) return;
    if (cameraAnimating || orbitEnabled) return;
    if (!contentRef.current) return;

    const box = new Box3().setFromObject(contentRef.current);
    if (box.isEmpty()) return;
    const center = box.getCenter(new Vector3());
    const size3 = box.getSize(new Vector3());
    const aspect = Math.max(0.0001, size.width / Math.max(1, size.height));
    const fovRad = MathUtils.degToRad(config.camera.fov);
    const fitHeight = size3.y / (2 * Math.tan(fovRad / 2));
    const fitWidth = size3.x / (2 * Math.tan(fovRad / 2)) / aspect;
    const distance = Math.max(fitHeight, fitWidth, size3.z * 0.7) * 1.35;
    const dir = new Vector3()
      .fromArray(defaultCamera.position)
      .sub(new Vector3().fromArray(defaultCamera.target))
      .normalize();
    const nextPos = center.clone().add(dir.multiplyScalar(distance));

    const fittedCamera = {
      ...config.camera,
      position: [nextPos.x, nextPos.y, nextPos.z],
      target: [center.x, center.y, center.z],
    };
    setRuntimeCamera(fittedCamera);
    onAutoFitCamera?.(fittedCamera);
  }, [cameraAnimating, config.camera, defaultCamera, loadedEpoch, onAutoFitCamera, orbitEnabled, previewMode, size.height, size.width]);

  const interactive = !previewMode;

  const sceneBody = (
    <>
      <InvalidateOnChange
        revision={`${purpose}|${env}|${config.lighting.backgroundColor}|${config.lighting.ambientIntensity}|${config.lighting.directionalIntensity}|${String(config.enableShadows)}`}
      />
      <color attach="background" args={[config.lighting.backgroundColor]} />
      <Suspense fallback={null}>
        {isEnvPreset(env) ? <Environment preset={env} /> : null}
      </Suspense>
      <hemisphereLight intensity={0.22} groundColor="#1b1b1b" />
      <ambientLight intensity={config.lighting.ambientIntensity} />
      <directionalLight
        position={[6, 10, 4]}
        intensity={config.lighting.directionalIntensity}
        castShadow={config.enableShadows}
      />
      {presentation.showGrid ? (
        <Grid
          args={[24, 24]}
          cellSize={0.5}
          cellThickness={0.6}
          sectionSize={2}
          sectionThickness={1.1}
          fadeDistance={28}
          fadeStrength={1.2}
          infiniteGrid
        />
      ) : null}
      {presentation.showContactShadows ? (
        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.42}
          scale={16}
          blur={1.4}
          far={6}
        />
      ) : null}
      <CameraRig
        config={{ ...config, camera: runtimeCamera }}
        orbitEnabled={manualOrbitEnabled}
        previewMode={previewMode}
        onCameraChange={previewMode ? undefined : onCameraChange}
        cameraAnimating={cameraAnimating}
        focusPoint={focusPoint}
        onControlsReady={onControlsReady}
        onOrbitInteractionChange={previewMode ? setOrbitInteracting : undefined}
      />
      {cameraAnimating ? (
        <CameraAnimationDriver
          config={config}
          playing={playbackActive}
          onCameraUpdate={setRuntimeCamera}
        />
      ) : null}
      <group ref={contentRef}>
        {config.models.map((asset) => (
          <Suspense key={asset.id} fallback={null}>
            <GltfModel
              asset={asset}
              onObjectNamesDiscovered={
                previewMode ? undefined : onObjectNamesDiscovered
              }
              animations={config.modelAnimations.filter((a) => a.modelId === asset.id)}
              playing={playbackActive}
              interactive={interactive}
              highlightOnHover={!previewMode && presentation.highlightOnHover}
              clickToFocus={!previewMode && presentation.clickToFocus}
              onFocus={!previewMode ? setFocusPoint : undefined}
              onHoverName={previewMode ? undefined : onHoverName}
              onLoaded={previewMode ? undefined : () => setLoadedEpoch((v) => v + 1)}
              hiddenObjectKeys={config.hiddenObjectKeys}
              soloObjectKey={config.soloObjectKey}
              selectedObjectKey={config.selectedObjectKey}
              objectTags={config.objectTags ?? []}
              highlightSelection={!previewMode}
            />
          </Suspense>
        ))}
      </group>
      <Scene3dEffects purpose={purpose} enabled />
    </>
  );

  if (previewMode) return sceneBody;

  return (
    <Scene3dA11y description="3D scene">
      <Scene3dPhysics purpose={purpose}>{sceneBody}</Scene3dPhysics>
    </Scene3dA11y>
  );
}

export function Scene3dCanvas({
  config,
  orbitEnabled,
  previewMode,
  onCameraChange,
  onAutoFitCamera,
  onObjectNamesDiscovered,
  onHoverName,
  onControlsReady,
  onCanvasDomReady,
}: Scene3dCanvasProps) {
  const merged = useMemo(() => mergeScene3dConfig(config), [config]);
  const playbackActive = previewMode || !orbitEnabled;
  const hasAnimation =
    playbackActive &&
    (merged.modelAnimations.length > 0 ||
      merged.cameraAnimations.length > 0 ||
      merged.orbit.autoRotate);
  const live = previewMode
    ? orbitEnabled || hasAnimation
    : hasAnimation || orbitEnabled;

  return (
    <>
      {!previewMode ? <Scene3dA11yAnnouncer /> : null}
      <Canvas
        onCreated={({ gl }) => {
          onCanvasDomReady?.(gl.domElement);
        }}
        shadows
        dpr={[1, 2]}
        frameloop={live ? "always" : "demand"}
        resize={{ scroll: false, debounce: 0, offsetSize: true }}
        camera={{
          position: merged.camera.position,
          fov: merged.camera.fov,
          near: merged.camera.near ?? 0.1,
          far: merged.camera.far ?? 200,
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          stencil: false,
        }}
        style={{ width: "100%", height: "100%", display: "block", touchAction: "none" }}
      >
        <Scene3dScene
          config={merged}
          orbitEnabled={orbitEnabled}
          previewMode={previewMode}
          onCameraChange={onCameraChange}
          onAutoFitCamera={onAutoFitCamera}
          onObjectNamesDiscovered={onObjectNamesDiscovered}
          onHoverName={onHoverName}
          onControlsReady={onControlsReady}
        />
      </Canvas>
    </>
  );
}

export type Scene3dNodeContentProps = {
  config?: Scene3dConfig | null;
  previewMode?: boolean;
  selected?: boolean;
  updateConfig?: (patch: Partial<Scene3dConfig>) => void;
  onObjectNamesDiscovered?: (modelId: string, names: string[]) => void;
};

export function Scene3dNodeContent({
  config,
  previewMode = false,
  selected = false,
  updateConfig,
  onObjectNamesDiscovered,
}: Scene3dNodeContentProps) {
  const { t } = useI18n();
  const merged = useMemo(() => mergeScene3dConfig(config), [config]);
  const [cKeyHeld, setCKeyHeld] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const canvasDomRef = useRef<HTMLCanvasElement | null>(null);
  const commitCurrentCamera = useCallback(() => {
    const controls = controlsRef.current as
      | (OrbitControlsImpl & { object?: PerspectiveCamera; target: Vector3 })
      | null;
    const camera = controls?.object;
    if (!controls || !camera) return;
    updateConfig?.({
      camera: {
        position: [camera.position.x, camera.position.y, camera.position.z],
        target: [controls.target.x, controls.target.y, controls.target.z],
        fov: camera.fov,
        near: camera.near,
        far: camera.far,
      },
    });
  }, [updateConfig]);

  useEffect(() => {
    if (previewMode) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "c" || e.key === "C") setCKeyHeld(true);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "c" || e.key === "C") {
        commitCurrentCamera();
        setCKeyHeld(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [commitCurrentCamera, previewMode]);

  const cameraEditMode = !previewMode && cKeyHeld;
  const orbitEnabled = previewMode
    ? merged.orbit.enableMouseControl
    : cameraEditMode;

  const handleCameraChange = useCallback(
    (camera: Scene3dCameraState) => {
      if (!cameraEditMode) return;
      updateConfig?.({ camera });
    },
    [cameraEditMode, updateConfig]
  );

  const handleDiscover = useCallback(
    (modelId: string, names: string[]) => {
      if (previewMode) return;
      onObjectNamesDiscovered?.(modelId, names);
      const current = merged.models.find((m) => m.id === modelId);
      if (
        current?.objectNames &&
        current.objectNames.length === names.length &&
        current.objectNames.every((n, i) => n === names[i])
      ) {
        return;
      }
      const models = merged.models.map((m) =>
        m.id === modelId ? { ...m, objectNames: names } : m
      );
      updateConfig?.({ models });
    },
    [merged.models, onObjectNamesDiscovered, previewMode, updateConfig]
  );

  useEffect(() => {
    if (previewMode || !cameraEditMode) return;

    let mode: "rotate" | "pan" | null = null;
    let activePointerId: number | null = null;
    let lastX = 0;
    let lastY = 0;

    type ExtControls = OrbitControlsImpl & {
      object: PerspectiveCamera;
      target: Vector3;
      getAzimuthalAngle: () => number;
      getPolarAngle: () => number;
      setAzimuthalAngle: (angle: number) => void;
      setPolarAngle: (angle: number) => void;
      dollyIn: (scale: number) => void;
      dollyOut: (scale: number) => void;
    };
    const getControls = () => controlsRef.current as ExtControls | null;
    const isInsideScene3d = (clientX: number, clientY: number) => {
      const root = rootRef.current;
      if (!root) return false;
      const rect = root.getBoundingClientRect();
      return (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      );
    };

    const kill = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    };
    const panCamera = (controls: ExtControls, dx: number, dy: number) => {
      const element = canvasDomRef.current;
      if (!element) return;
      const camera = controls.object;
      const offset = new Vector3().subVectors(camera.position, controls.target);
      const targetDistance =
        offset.length() * Math.tan(((camera.fov || 45) / 2) * (Math.PI / 180));
      const panX = (2 * dx * targetDistance) / Math.max(1, element.clientHeight);
      const panY = (2 * dy * targetDistance) / Math.max(1, element.clientHeight);
      const xAxis = new Vector3().setFromMatrixColumn(camera.matrix, 0).multiplyScalar(-panX);
      const yAxis = new Vector3()
        .setFromMatrixColumn(camera.matrix, 1)
        .multiplyScalar(panY);
      const delta = xAxis.add(yAxis);
      controls.target.add(delta);
      camera.position.add(delta);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!isInsideScene3d(e.clientX, e.clientY)) return;
      const controls = getControls();
      if (!controls) return;
      if (e.button === 0) mode = "rotate";
      else if (e.button === 2) mode = "pan";
      else return;
      activePointerId = e.pointerId;
      lastX = e.clientX;
      lastY = e.clientY;
      kill(e);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (activePointerId !== null && e.pointerId !== activePointerId) return;
      if (!mode) {
        if (!isInsideScene3d(e.clientX, e.clientY)) return;
        if (e.buttons & 1) mode = "rotate";
        else if (e.buttons & 2) mode = "pan";
        else return;
        activePointerId = e.pointerId;
        lastX = e.clientX;
        lastY = e.clientY;
        kill(e);
        return;
      }
      const controls = getControls();
      if (!controls) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      if (mode === "rotate") {
        controls.setAzimuthalAngle(controls.getAzimuthalAngle() - dx * 0.01);
        controls.setPolarAngle(
          MathUtils.clamp(
            controls.getPolarAngle() - dy * 0.01,
            0.01,
            Math.PI - 0.01
          )
        );
      } else {
        panCamera(controls, dx, dy);
      }
      controls.update();
      kill(e);
    };

    const onPointerUp = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (activePointerId !== null && e.pointerId !== activePointerId) return;
      if (!mode) return;
      mode = null;
      activePointerId = null;
      kill(e);
    };

    const onWheel = (e: WheelEvent) => {
      if (!isInsideScene3d(e.clientX, e.clientY)) return;
      const controls = getControls();
      if (!controls) return;
      if (e.deltaY > 0) controls.dollyOut(1.08);
      else controls.dollyIn(1.08);
      controls.update();
      kill(e);
    };

    const onContextMenu = (e: MouseEvent) => {
      if (!isInsideScene3d(e.clientX, e.clientY)) return;
      kill(e);
    };

    window.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("pointermove", onPointerMove, true);
    window.addEventListener("pointerup", onPointerUp, true);
    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("contextmenu", onContextMenu, true);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("pointermove", onPointerMove, true);
      window.removeEventListener("pointerup", onPointerUp, true);
      window.removeEventListener("wheel", onWheel, true);
      window.removeEventListener("contextmenu", onContextMenu, true);
      mode = null;
      activePointerId = null;
    };
  }, [cameraEditMode, previewMode]);

  if (merged.models.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded border border-dashed border-border/70 bg-muted/15 px-2 text-center text-[11px] text-muted-foreground">
        {t("panel.config.scene3dPlaceholder")}
      </div>
    );
  }

  return (
    <div ref={rootRef} className="relative h-full w-full overflow-hidden rounded">
      {cameraEditMode ? (
        <div className="pointer-events-none absolute left-1 top-1 z-10 rounded bg-black/65 px-1.5 py-0.5 text-[10px] text-white">
          {t("panel.config.scene3dCameraEditHint")}
        </div>
      ) : null}
      {!previewMode && selected && !cameraEditMode ? (
        <div className="pointer-events-none absolute bottom-1 left-1 z-10 rounded bg-black/45 px-1.5 py-0.5 text-[10px] text-white/90">
          {t("panel.config.scene3dHoldCHint")}
        </div>
      ) : null}
      <div
        className="h-full w-full"
        data-scene3d-orbit-active={
          !previewMode && orbitEnabled ? "true" : undefined
        }
        onPointerDown={(e) => {
          if (!previewMode && orbitEnabled) e.stopPropagation();
        }}
        onPointerUp={(e) => {
          if (!previewMode && orbitEnabled) e.stopPropagation();
        }}
        onPointerMove={(e) => {
          if (!previewMode && orbitEnabled) e.stopPropagation();
        }}
        onMouseDown={(e) => {
          if (!previewMode && orbitEnabled) e.stopPropagation();
        }}
        onClick={(e) => {
          if (!previewMode && orbitEnabled) e.stopPropagation();
        }}
        onDoubleClick={(e) => {
          if (!previewMode && orbitEnabled) e.stopPropagation();
        }}
        onWheel={(e) => {
          if (!previewMode && orbitEnabled) e.stopPropagation();
        }}
        onContextMenu={(e) => {
          if (!previewMode && orbitEnabled) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        <Suspense
          fallback={
            <div className="flex h-full w-full items-center justify-center text-[11px] text-muted-foreground">
              {t("common.loading")}
            </div>
          }
        >
          <Scene3dCanvas
            config={merged}
            orbitEnabled={orbitEnabled}
            previewMode={previewMode}
            onCameraChange={handleCameraChange}
            onAutoFitCamera={
              previewMode
                ? undefined
                : (camera) => {
                    updateConfig?.({ camera });
                  }
            }
            onObjectNamesDiscovered={handleDiscover}
            onControlsReady={(controls) => {
              controlsRef.current = controls;
            }}
            onCanvasDomReady={(canvas) => {
              canvasDomRef.current = canvas;
            }}
          />
        </Suspense>
      </div>
    </div>
  );
}
