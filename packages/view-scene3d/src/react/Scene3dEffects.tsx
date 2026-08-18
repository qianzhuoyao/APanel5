import type { Scene3dPurpose } from "../types";

type Scene3dEffectsProps = {
  purpose: Scene3dPurpose;
  enabled?: boolean;
};

/**
 * 后处理会在切换场景用途时挂载/卸载 EffectComposer，容易把画布尺寸量错、画面缩到一角变空白。
 * 产品展示的质感改由灯光和环境贴图承担，这里保持空实现以免切用途闪空白。
 */
export function Scene3dEffects(_props: Scene3dEffectsProps) {
  return null;
}
