import type { ReactNode } from "react";
import type { Scene3dPurpose } from "../types";

type Scene3dPhysicsProps = {
  purpose: Scene3dPurpose;
  children: ReactNode;
};

/**
 * 物理世界包装必须结构稳定。切换 sandbox 时再挂载/卸载 Physics，
 * 会把整棵场景卸掉，模型看起来就像空白。目前没有刚体节点，先直通。
 */
export function Scene3dPhysics({ children }: Scene3dPhysicsProps) {
  return <>{children}</>;
}
