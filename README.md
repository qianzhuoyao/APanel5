# Abuilder

面向数据驱动界面的**可视化低代码编辑器**：拖拽画布搭建视图、用蓝图编排逻辑、工作区持久化与在线预览。提供 **React** 与 **Vue 3** 两套 UI 栈，可嵌入对应框架应用。

基于 **pnpm + Turborepo** 的 monorepo，核心能力拆分为多个可独立发布的 `@arronqzy/*` 包。

## 功能特性

- **视图画布**：无限平移/缩放、标尺、多选、Moveable 拖拽/缩放/旋转
- **丰富物料**：图表（ECharts）、文本、图片、音视频、几何、网格、引用节点等
- **图层系统**：多图层、映射图层、主图层、锁定与合并
- **蓝图逻辑**：节点连线编辑、调试执行、时钟/请求/逻辑等内置节点
- **Scope 驱动**：蓝图执行结果通过 Scope 表达式驱动视图节点属性
- **工作区**：IndexedDB 多项目、导入导出、跨标签页同步
- **在线预览**：独立预览页，支持 URL 打开指定工作区

## 快速开始

### 本地开发（演示应用）

```bash
pnpm install
```

**React 演示**（默认 `pnpm dev`）：

```bash
pnpm dev
```

**Vue 3 演示**（端口 `31012`）：

```bash
pnpm -C apps/web-vue dev
```

若修改了 React UI / 视图样式，可另开终端监听 CSS：

```bash
pnpm -C packages/ui dev:css
pnpm -C packages/react-view dev:css
```

### 集成到自有 React 项目

```bash
pnpm add @arronqzy/abuilder react react-dom
```

```tsx
import { createRoot } from "react-dom/client";
import { App } from "@arronqzy/abuilder";
import "@arronqzy/abuilder/styles.css";

createRoot(document.getElementById("root")!).render(<App />);
```

更多配置见 [packages/abuilder/README.md](./packages/abuilder/README.md)。

### 集成到自有 Vue 3 项目

```bash
pnpm add @arronqzy/abuilder-vue vue ant-design-vue
```

```ts
import { createApp } from "vue";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
import { App } from "@arronqzy/abuilder-vue";

createApp(App).use(Antd).mount("#app");
```

Vue 栈功能与 React 版对齐：无限画布、Moveable/Selecto、完整配置侧栏、工作区、Scope 模版、蓝图调试与在线预览。详见 [packages/abuilder-vue/README.md](./packages/abuilder-vue/README.md)。

## 仓库结构

```
Abuilder26/
├── apps/
│   ├── web/                 # React 演示应用
│   └── web-vue/             # Vue 3 演示应用
├── packages/
│   ├── abuilder/            # React 聚合入口
│   ├── abuilder-vue/        # Vue 3 聚合入口
│   ├── react-view/          # React 视图画布与工作区
│   ├── vue-view/            # Vue 3 视图画布（Ant Design Vue）
│   ├── react-blueprint/     # React 蓝图编辑器
│   ├── vue-blueprint/       # Vue 3 蓝图编辑器（Vue Flow）
│   ├── blueprint-dsl/       # 蓝图 DSL 与运行时（框架无关）
│   ├── rx-store/            # 画布状态（Immer + RxJS，框架无关）
│   ├── react-rx-store/      # rx-store 的 React Hooks
│   ├── vue-rx-store/        # rx-store 的 Vue Composables
│   ├── ui/                  # React UI（shadcn/Radix）
│   ├── tailwind/            # 共享 Tailwind 预设与构建 CLI
│   ├── typescript-config/   # 共享 TS 配置
│   ├── eslint-config/       # 共享 ESLint 配置
│   └── service/             # 服务层占位（规划中）
└── pnpm-workspace.yaml
```

## 包说明

| 包 | 说明 | 文档 |
|----|------|------|
| `@arronqzy/abuilder` | 一站式编辑器入口 `<App />` | [README](./packages/abuilder/README.md) |
| `@arronqzy/react-view` | 视图面板、画布、预览、工作区 | [README](./packages/react-view/readme.md) |
| `@arronqzy/react-blueprint` | 蓝图画布、调试、蓝图库 | [README](./packages/react-blueprint/README.md) |
| `@arronqzy/blueprint-dsl` | 节点定义、行为注册、图执行 | [README](./packages/blueprint-dsl/readme.md) |
| `@arronqzy/rx-store` | 编辑器状态、Undo/Redo、路径订阅 | [README](./packages/rx-store/readme.md) |
| `@arronqzy/react-rx-store` | `useStore` / `useNode` 等 Hooks | [README](./packages/react-rx-store/README.md) |
| `@arronqzy/ui` | Button、Dialog、Toast 等 UI 组件 | [README](./packages/ui/README.md) |
| `@arronqzy/tailwind` | Tailwind 预设（monorepo 内部） | [README](./packages/tailwind/README.md) |
| `@arronqzy/typescript-config` | 共享 `tsconfig` | [README](./packages/typescript-config/README.md) |
| `@arronqzy/eslint-config` | 共享 ESLint 规则 | [README](./packages/eslint-config/README.md) |
| `@arronqzy/service` | HTTP 服务层（规划中） | [README](./packages/service/README.md) |

### Vue 3 栈

| 包 | 说明 | 文档 |
|----|------|------|
| `@arronqzy/abuilder-vue` | Vue 一站式入口 `<App />` | [README](./packages/abuilder-vue/README.md) |
| `@arronqzy/vue-view` | Vue 视图面板（Ant Design Vue） | [README](./packages/vue-view/README.md) |
| `@arronqzy/vue-blueprint` | Vue 蓝图画布（Vue Flow） | [README](./packages/vue-blueprint/README.md) |
| `@arronqzy/vue-rx-store` | `useStoreRef` / `useNode` 等 | [README](./packages/vue-rx-store/README.md) |

### 依赖关系（简图）

```
@arronqzy/abuilder                          @arronqzy/abuilder-vue
  ├── @arronqzy/react-view                     ├── @arronqzy/vue-view
  │     ├── @arronqzy/ui                       │     ├── ant-design-vue
  │     ├── @arronqzy/rx-store                 │     ├── @arronqzy/rx-store
  │     ├── @arronqzy/react-blueprint          │     ├── @arronqzy/vue-blueprint
  │     └── @arronqzy/blueprint-dsl            │     ├── @arronqzy/vue-rx-store
  └── （间接依赖上述包）                        │     └── @arronqzy/blueprint-dsl
                                               └── （间接依赖上述包）

@arronqzy/react-blueprint                   @arronqzy/vue-blueprint
  ├── @arronqzy/blueprint-dsl                 ├── @arronqzy/blueprint-dsl
  ├── @arronqzy/react-rx-store → rx-store     ├── @arronqzy/vue-rx-store → rx-store
  └── @arronqzy/ui                             └── ant-design-vue + @vue-flow/core
```

## 常用脚本

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动 monorepo 开发（Turbo） |
| `pnpm build` | 构建所有包 |
| `pnpm lint` | 全仓库 ESLint |
| `pnpm -C packages/abuilder build` | 构建对外发布的 React abuilder 产物 |
| `pnpm -C packages/abuilder-vue build` | 校验 Vue abuilder 包（typecheck） |
| `pnpm -C apps/web build` | 构建 React 演示应用 |
| `pnpm -C apps/web-vue dev` | 启动 Vue 3 演示应用（端口 31012） |
| `pnpm -C apps/web-vue build` | 构建 Vue 3 演示应用 |

## 技术栈

**共享**

- **TypeScript**、**Vite**、**Turborepo**、**pnpm workspace**
- **RxJS** + **Immer**（画布状态）
- **ECharts**（图表物料）
- **Moveable** / **Selecto** / **Infinite Viewer**（画布交互）

**React 栈**

- **React 18+**、**React Flow**（蓝图）
- **Tailwind CSS** + **Radix UI**（`@arronqzy/ui`）

**Vue 3 栈**

- **Vue 3**、**@vue-flow/core**（蓝图）
- **Ant Design Vue**（UI 组件）

## 发布

在 GitHub 创建 **Release** 后，CI 会按依赖顺序将包发布到 npm：

| 顺序 | React 栈 | Vue 栈 |
|------|----------|--------|
| 1 | `blueprint-dsl` | （同上，共享） |
| 2 | `rx-store` | （同上，共享） |
| 3 | `react-rx-store` | `vue-rx-store` |
| 4 | `ui` | — |
| 5 | `react-blueprint` | `vue-blueprint` |
| 6 | `react-view` | `vue-view` |
| 7 | `abuilder` | `abuilder-vue` |

Vue 栈当前以源码 + `typecheck` 形式发布（`exports` 指向 `src/`）；React 栈的 `abuilder` 会构建 `dist/` 与 CSS 产物。

详见 [.github/workflows/publish.yml](./.github/workflows/publish.yml)。

## 许可证

各包许可证见对应 `package.json`（核心包多为 MIT）。
