# @arronqzy/view-scene3d

三维物料的共享类型和渲染器。场景描述（物体、相机、动画、轴心）与框架无关；真正画出来的是 React（React Three Fiber）和 Vue 两套薄封装。

在编辑器里它是左侧「三维」物料。选中后右侧改相机、物体和引用，画布上是一块三维视口：

![三维节点在画布上，右侧是视图配置](https://github.com/qianzhuoyao/APanel5/raw/v5/docs/guide-assets/live-zh/40-blueprint-open.png)

## 安装

一般不用单独装，随 `@arronqzy/react-view` / `@arronqzy/vue-view` 进来。单独用：

```bash
pnpm add @arronqzy/view-scene3d three
```

React 渲染器还需要 `@react-three/fiber` 及相关生态（由视图包声明）。

## 用什么

共享导出（`@arronqzy/view-scene3d`）：

- 场景类型、默认值、模型名
- 轴心、动画、物体状态辅助函数

React（`@arronqzy/view-scene3d/react`）：

- `Scene3dNodeContent` / `Scene3dCanvas` — 节点内容
- `Scene3dA11y`、`Scene3dEffects`、`Scene3dPhysics` — 无障碍、效果、物理

Vue 入口是 `@arronqzy/view-scene3d/vue`（`Scene3dNodeContent.vue`），由 `vue-view` 引用。

不要在视图包里再写一套 Three.js 场景图。物体增删和属性以本包类型为准，两边渲染器只负责把同一份配置画出来。

## 许可证

MIT
