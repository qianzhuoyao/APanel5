<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useI18n } from "@arronqzy/i18n/vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
  collectObjectNames,
  easeInOutCubic,
  getPivotWorldPoint,
  isScene3dObjectVisible,
  lerpCamera,
  mergeScene3dConfig,
  rotationSign,
  type Scene3dCameraState,
  type Scene3dConfig,
} from "../index";

const props = withDefaults(
  defineProps<{
    config?: Scene3dConfig | null;
    previewMode?: boolean;
    selected?: boolean;
  }>(),
  { previewMode: false, selected: false }
);

const emit = defineEmits<{
  updateConfig: [patch: Partial<Scene3dConfig>];
}>();

const { t } = useI18n();
const rootRef = ref<HTMLDivElement | null>(null);
const cKeyHeld = ref(false);
const merged = computed(() => mergeScene3dConfig(props.config));
const cameraEditMode = computed(() => !props.previewMode && cKeyHeld.value);
const orbitEnabled = computed(() =>
  props.previewMode ? merged.value.orbit.enableMouseControl : cameraEditMode.value
);
const playbackActive = computed(() => props.previewMode || !cameraEditMode.value);
const cameraAnimating = computed(
  () => merged.value.cameraAnimations.length > 0 && playbackActive.value
);
const autoRotateActive = computed(
  () => !cameraAnimating.value && merged.value.orbit.autoRotate && playbackActive.value
);

let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let controls: OrbitControls | null = null;
let raf = 0;
let clock = new THREE.Clock();
let resizeObserver: ResizeObserver | null = null;
let onKeyDownHandler: ((e: KeyboardEvent) => void) | null = null;
let onKeyUpHandler: ((e: KeyboardEvent) => void) | null = null;
let orbitInteracting = false;
let resumeCameraAnimTimer: ReturnType<typeof setTimeout> | null = null;
const tagOverlays = ref<Array<{ id: string; html: string; x: number; y: number }>>([]);
const highlightOriginals = new Map<THREE.Mesh, THREE.Material | THREE.Material[]>();
const modelRoots = new Map<string, THREE.Object3D>();
const loader = new GLTFLoader();

function syncCameraFromConfig(cfg: Scene3dConfig) {
  if (!camera || !controls) return;
  camera.position.set(...cfg.camera.position);
  camera.fov = cfg.camera.fov;
  camera.near = cfg.camera.near ?? 0.1;
  camera.far = cfg.camera.far ?? 200;
  camera.updateProjectionMatrix();
  controls.target.set(...cfg.camera.target);
  controls.update();
}

function emitCamera() {
  if (!camera || !controls || props.previewMode) return;
  const next: Scene3dCameraState = {
    position: [camera.position.x, camera.position.y, camera.position.z],
    target: [controls.target.x, controls.target.y, controls.target.z],
    fov: camera.fov,
    near: camera.near,
    far: camera.far,
  };
  emit("updateConfig", { camera: next });
}

function disposeModel(id: string) {
  const root = modelRoots.get(id);
  if (!root) return;
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.geometry?.dispose();
      const mat = obj.material;
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
      else mat?.dispose();
    }
  });
  scene?.remove(root);
  modelRoots.delete(id);
}

async function loadModels(cfg: Scene3dConfig) {
  if (!scene) return;
  const ids = new Set(cfg.models.map((m) => m.id));
  for (const id of [...modelRoots.keys()]) {
    if (!ids.has(id)) disposeModel(id);
  }
  for (const asset of cfg.models) {
    if (modelRoots.has(asset.id)) continue;
    try {
      const gltf = await loader.loadAsync(asset.url);
      const root = gltf.scene.clone(true);
      const box = new THREE.Box3().setFromObject(root);
      const center = box.getCenter(new THREE.Vector3());
      const basePos = asset.position ?? [0, 0, 0];
      root.position.set(basePos[0] - center.x, basePos[1] - box.min.y, basePos[2] - center.z);
      root.rotation.set(...(asset.rotation ?? [0, 0, 0]));
      root.scale.set(...(asset.scale ?? [1, 1, 1]));
      scene.add(root);
      modelRoots.set(asset.id, root);
      applyObjectState(cfg);
      const names = collectObjectNames(root);
      if (!props.previewMode) {
        emit("updateConfig", {
          models: cfg.models.map((m) =>
            m.id === asset.id ? { ...m, objectNames: names } : m
          ),
        });
      }
    } catch {
      /* ignore broken model url */
    }
  }
}

function restoreHighlight() {
  for (const [mesh, material] of highlightOriginals) mesh.material = material;
  highlightOriginals.clear();
}

function applyObjectState(cfg: Scene3dConfig) {
  for (const asset of cfg.models) {
    const root = modelRoots.get(asset.id);
    if (!root) continue;
    const named = new Set(asset.objectNames ?? collectObjectNames(root));
    root.traverse((obj) => {
      if (!obj.name || !named.has(obj.name)) return;
      obj.visible = isScene3dObjectVisible({
        modelId: asset.id,
        objectName: obj.name,
        hiddenObjectKeys: cfg.hiddenObjectKeys,
        soloObjectKey: cfg.soloObjectKey,
      });
    });
  }
  restoreHighlight();
  if (props.previewMode || !cfg.selectedObjectKey) return;
  const sep = "|||";
  const splitAt = cfg.selectedObjectKey.indexOf(sep);
  if (splitAt < 0) return;
  const modelId = cfg.selectedObjectKey.slice(0, splitAt);
  const objectName = cfg.selectedObjectKey.slice(splitAt + sep.length);
  const root = modelRoots.get(modelId);
  const target = root?.getObjectByName(objectName);
  target?.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh) || !obj.material) return;
    highlightOriginals.set(obj, obj.material);
    const cloned = Array.isArray(obj.material)
      ? obj.material.map((m) => m.clone())
      : obj.material.clone();
    const list = Array.isArray(cloned) ? cloned : [cloned];
    for (const mat of list) {
      if ("emissive" in mat) {
        (mat as THREE.MeshStandardMaterial).emissive.set("#38bdf8");
        (mat as THREE.MeshStandardMaterial).emissiveIntensity = 0.9;
      }
    }
    obj.material = cloned;
  });
}

function updateTagOverlays(cfg: Scene3dConfig) {
  const el = rootRef.value;
  if (!el || !camera) {
    tagOverlays.value = [];
    return;
  }
  const w = Math.max(1, el.clientWidth);
  const h = Math.max(1, el.clientHeight);
  const next: Array<{ id: string; html: string; x: number; y: number }> = [];
  for (const tag of cfg.objectTags ?? []) {
    if (!tag.html.trim()) continue;
    const root = modelRoots.get(tag.modelId);
    const target = root?.getObjectByName(tag.objectName);
    if (!target?.visible) continue;
    target.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(target);
    if (box.isEmpty()) continue;
    const world = getPivotWorldPoint(box, tag.anchor);
    if (tag.offset) world.add(new THREE.Vector3(...tag.offset));
    const ndc = world.project(camera);
    if (ndc.z < -1 || ndc.z > 1) continue;
    next.push({
      id: tag.id,
      html: tag.html,
      x: (ndc.x * 0.5 + 0.5) * w,
      y: (-ndc.y * 0.5 + 0.5) * h,
    });
  }
  tagOverlays.value = next;
}

function applyModelAnimations(cfg: Scene3dConfig, elapsed: number) {
  if (!playbackActive.value) return;
  for (const rule of cfg.modelAnimations) {
    const root = modelRoots.get(rule.modelId);
    if (!root) continue;
    const target = root.getObjectByName(rule.objectName);
    if (!target) continue;
    const delay = rule.delaySec ?? 0;
    if (elapsed < delay) continue;
    const duration = Math.max(0.05, rule.durationSec);
    let progress = (elapsed - delay) / duration;
    progress = rule.loop ? progress % 1 : Math.min(1, progress);
    const eased = easeInOutCubic(progress);
    const angle =
      THREE.MathUtils.degToRad(rule.angleDeg) * rotationSign(rule.direction) * eased;
    target.rotation.set(0, 0, 0);
    target.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(target);
    const pivot = getPivotWorldPoint(box, rule.pivot);
    const axis =
      rule.axis === "x"
        ? new THREE.Vector3(1, 0, 0)
        : rule.axis === "y"
          ? new THREE.Vector3(0, 1, 0)
          : new THREE.Vector3(0, 0, 1);
    const q = new THREE.Quaternion().setFromAxisAngle(axis, angle);
    target.position.sub(pivot);
    target.position.applyQuaternion(q);
    target.position.add(pivot);
    target.quaternion.premultiply(q);
  }
}

function applyCameraAnimation(cfg: Scene3dConfig, elapsed: number) {
  const rule = cfg.cameraAnimations[cfg.cameraAnimations.length - 1];
  if (!playbackActive.value || !rule || !camera || !controls) return;
  if (props.previewMode && orbitEnabled.value && orbitInteracting) return;
  const duration = Math.max(0.05, rule.durationSec);
  let tVal = elapsed / duration;
  if (rule.loop) tVal = rule.pingPong ? Math.abs((tVal % 2) - 1) : tVal % 1;
  else tVal = Math.min(1, tVal);
  if (rule.mode === "orbit") {
    const [tx, ty, tz] = rule.from.target;
    const ox = rule.from.position[0] - tx;
    const oy = rule.from.position[1] - ty;
    const oz = rule.from.position[2] - tz;
    const radius = Math.max(0.001, Math.hypot(ox, oz));
    const baseTheta = Math.atan2(oz, ox);
    const speedRad = THREE.MathUtils.degToRad(rule.orbitSpeedDegPerSec ?? 24);
    const angle = rule.loop ? elapsed * speedRad : Math.min(elapsed, duration) * speedRad;
    camera.position.set(tx + Math.cos(baseTheta + angle) * radius, ty + oy, tz + Math.sin(baseTheta + angle) * radius);
    camera.fov = rule.from.fov;
    camera.updateProjectionMatrix();
    controls.target.set(...rule.from.target);
    controls.update();
    return;
  }
  const next = lerpCamera(rule.from, rule.to, easeInOutCubic(tVal));
  camera.position.set(...next.position);
  camera.fov = next.fov;
  camera.updateProjectionMatrix();
  controls.target.set(...next.target);
  controls.update();
}

function resize() {
  const el = rootRef.value;
  if (!el || !renderer || !camera) return;
  const w = Math.max(1, el.clientWidth);
  const h = Math.max(1, el.clientHeight);
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

function animate() {
  raf = requestAnimationFrame(animate);
  const cfg = merged.value;
  const elapsed = clock.getElapsedTime();
  applyModelAnimations(cfg, elapsed);
  if (cfg.cameraAnimations.length === 0 && !props.previewMode) {
    syncCameraFromConfig(cfg);
  } else if (cfg.cameraAnimations.length > 0) {
    applyCameraAnimation(cfg, elapsed);
  }
  controls?.update();
  updateTagOverlays(cfg);
  if (renderer && scene && camera) renderer.render(scene, camera);
}

function onControlsChange() {
  emitCamera();
}

function pausePreviewCameraAnimation() {
  if (!props.previewMode || !orbitEnabled.value) return;
  orbitInteracting = true;
  if (resumeCameraAnimTimer) clearTimeout(resumeCameraAnimTimer);
  resumeCameraAnimTimer = setTimeout(() => {
    orbitInteracting = false;
    resumeCameraAnimTimer = null;
  }, 1500);
}

function onControlsInteraction() {
  onControlsChange();
  pausePreviewCameraAnimation();
}

onMounted(() => {
  const el = rootRef.value;
  if (!el) return;
  scene = new THREE.Scene();
  scene.background = new THREE.Color(merged.value.lighting.backgroundColor);
  camera = new THREE.PerspectiveCamera(
    merged.value.camera.fov,
    Math.max(1, el.clientWidth) / Math.max(1, el.clientHeight),
    merged.value.camera.near ?? 0.1,
    merged.value.camera.far ?? 200
  );
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(Math.max(1, el.clientWidth), Math.max(1, el.clientHeight), false);
  el.appendChild(renderer.domElement);

  const ambient = new THREE.AmbientLight(0xffffff, merged.value.lighting.ambientIntensity);
  const dir = new THREE.DirectionalLight(0xffffff, merged.value.lighting.directionalIntensity);
  dir.position.set(6, 10, 4);
  scene.add(ambient, dir);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = merged.value.orbit.enableDamping;
  controls.autoRotate = autoRotateActive.value;
  controls.autoRotateSpeed = merged.value.orbit.autoRotateSpeed;
  controls.enabled = orbitEnabled.value || autoRotateActive.value;
  controls.enableRotate = orbitEnabled.value;
  controls.enablePan = orbitEnabled.value;
  controls.enableZoom = orbitEnabled.value;
  controls.addEventListener("change", onControlsInteraction);
  controls.addEventListener("start", () => {
    if (resumeCameraAnimTimer) clearTimeout(resumeCameraAnimTimer);
    orbitInteracting = true;
  });
  controls.addEventListener("end", pausePreviewCameraAnimation);
  syncCameraFromConfig(merged.value);
  void loadModels(merged.value);
  resize();
  animate();

  resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(el);
  onKeyDownHandler = (e: KeyboardEvent) => {
    if (e.key === "c" || e.key === "C") cKeyHeld.value = true;
  };
  onKeyUpHandler = (e: KeyboardEvent) => {
    if (e.key === "c" || e.key === "C") {
      emitCamera();
      cKeyHeld.value = false;
    }
  };
  if (!props.previewMode) {
    window.addEventListener("keydown", onKeyDownHandler);
    window.addEventListener("keyup", onKeyUpHandler);
  }
});

onUnmounted(() => {
  cancelAnimationFrame(raf);
  restoreHighlight();
  tagOverlays.value = [];
  if (resumeCameraAnimTimer) clearTimeout(resumeCameraAnimTimer);
  resumeCameraAnimTimer = null;
  orbitInteracting = false;
  resizeObserver?.disconnect();
  if (onKeyDownHandler) window.removeEventListener("keydown", onKeyDownHandler);
  if (onKeyUpHandler) window.removeEventListener("keyup", onKeyUpHandler);
  controls?.removeEventListener("change", onControlsChange);
  controls?.dispose();
  for (const id of [...modelRoots.keys()]) disposeModel(id);
  renderer?.dispose();
  renderer?.domElement.remove();
  renderer = null;
  scene = null;
  camera = null;
  controls = null;
});

watch(orbitEnabled, (enabled) => {
  if (!controls) return;
  controls.enabled = enabled || autoRotateActive.value;
  controls.enableRotate = enabled;
  controls.enablePan = enabled;
  controls.enableZoom = enabled;
});

watch(autoRotateActive, (active) => {
  if (!controls) return;
  controls.autoRotate = active;
  controls.enabled = orbitEnabled.value || active;
});

watch(
  () => merged.value.models,
  (models) => {
    void loadModels({ ...merged.value, models });
  },
  { deep: true }
);

watch(
  () => merged.value.lighting.backgroundColor,
  (color) => {
    if (scene) scene.background = new THREE.Color(color);
  }
);

watch(
  () => [
    merged.value.hiddenObjectKeys,
    merged.value.soloObjectKey,
    merged.value.selectedObjectKey,
  ],
  () => applyObjectState(merged.value),
  { deep: true }
);

watch(
  () => [
    merged.value.lighting.ambientIntensity,
    merged.value.lighting.directionalIntensity,
  ],
  ([ambientIntensity, directionalIntensity]) => {
    scene?.traverse((obj) => {
      if (obj instanceof THREE.AmbientLight) obj.intensity = Number(ambientIntensity) || 0;
      if (obj instanceof THREE.DirectionalLight) obj.intensity = Number(directionalIntensity) || 0;
    });
  }
);

function stopPointer(e: Event) {
  if (!props.previewMode && orbitEnabled.value) e.stopPropagation();
}
</script>

<template>
  <div v-if="merged.models.length === 0" class="flex h-full w-full items-center justify-center rounded border border-dashed border-gray-300 bg-gray-50 px-2 text-center text-[11px] text-gray-500">
    {{ t("panel.config.scene3dPlaceholder") }}
  </div>
  <div v-else class="relative h-full w-full overflow-hidden rounded">
    <div
      v-if="cameraEditMode"
      class="pointer-events-none absolute left-1 top-1 z-10 rounded bg-black/65 px-1.5 py-0.5 text-[10px] text-white"
    >
      {{ t("panel.config.scene3dCameraEditHint") }}
    </div>
    <div
      v-else-if="!previewMode && selected"
      class="pointer-events-none absolute bottom-1 left-1 z-10 rounded bg-black/45 px-1.5 py-0.5 text-[10px] text-white/90"
    >
      {{ t("panel.config.scene3dHoldCHint") }}
    </div>
    <div
      ref="rootRef"
      class="h-full w-full"
      @pointerdown="stopPointer"
      @mousedown="stopPointer"
    />
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        v-for="tag in tagOverlays"
        :key="tag.id"
        class="absolute -translate-x-1/2 -translate-y-full rounded-lg bg-black/80 px-2 py-1 text-[12px] leading-snug text-white shadow-lg"
        :style="{ left: tag.x + 'px', top: tag.y + 'px' }"
        v-html="tag.html"
      />
    </div>
  </div>
</template>
