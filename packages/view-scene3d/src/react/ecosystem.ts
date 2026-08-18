/**
 * React Three Fiber 生态统一出口。
 * 与 @react-three/fiber@8 / React 18 对齐；升级 fiber 9 时可同步 bump 各 @react-three/* 主版本。
 *
 * 未纳入：create-r3f-app（CLI 脚手架）、composer-suite（非 npm 标准包）、
 * framer-motion-3d（已废弃，与 framer-motion@12+ 不兼容；3D 动画请用 @react-spring/three）。
 */
export * as Fiber from "@react-three/fiber";
export * as Drei from "@react-three/drei";
export * as Postprocessing from "@react-three/postprocessing";
export * as A11y from "@react-three/a11y";
export * as XR from "@react-three/xr";
export * as Flex from "@react-three/flex";
export * as CSG from "@react-three/csg";
export * as Cannon from "@react-three/cannon";
export * as Rapier from "@react-three/rapier";
export * as P2 from "@react-three/p2";
export * as GpuPathtracer from "@react-three/gpu-pathtracer";
export * as Spring from "@react-spring/three";
export * as Gesture from "@use-gesture/react";
export * as Leva from "leva";
export * as Maath from "maath";
export * as Valtio from "valtio";
export * as Miniplex from "miniplex";
export * as Lamina from "lamina";

export * as PostprocessingCore from "postprocessing";
export * as ThreeStdlib from "three-stdlib";
