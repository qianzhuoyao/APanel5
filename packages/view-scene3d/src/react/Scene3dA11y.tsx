import type { ReactNode } from "react";
import { A11y, A11yAnnouncer } from "@react-three/a11y";

type Scene3dA11yProps = {
  description: string;
  children: ReactNode;
};

/** 为 Canvas 内场景提供基础无障碍语义与播报。 */
export function Scene3dA11y({ description, children }: Scene3dA11yProps) {
  return (
    <A11y role="contentinfo" description={description}>
      {children}
    </A11y>
  );
}

/** A11yAnnouncer 会渲染 DOM，必须放在 Canvas 外。 */
export function Scene3dA11yAnnouncer() {
  return (
    <A11yAnnouncer />
  );
}
