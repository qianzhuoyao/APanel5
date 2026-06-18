# Abuilder

面向数据驱动界面的**可视化低代码编辑器**：拖拽画布搭建视图、用蓝图编排逻辑、工作区持久化与在线预览，可一键嵌入任意 React 应用。

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
pnpm dev
```

浏览器访问 Vite 开发服务器即可使用完整编辑器。若修改了 UI / 视图样式，可另开终端监听 CSS：

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

## 仓库结构

```
Abuilder26/
├── apps/
│   └── web/                 # Vite 本地演示应用
├── packages/
│   ├── abuilder/            # 聚合入口，对外发布的主包
│   ├── react-view/          # 视图画布与工作区
│   ├── react-blueprint/     # 蓝图编辑器 UI
│   ├── blueprint-dsl/       # 蓝图 DSL 与运行时
│   ├── rx-store/            # 画布状态（Immer + RxJS）
│   ├── react-rx-store/      # rx-store 的 React Hooks
│   ├── ui/                  # 共享 UI 组件（shadcn/Radix）
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

### 依赖关系（简图）

```
@arronqzy/abuilder
  ├── @arronqzy/react-view
  │     ├── @arronqzy/ui
  │     ├── @arronqzy/rx-store
  │     ├── @arronqzy/react-blueprint
  │     └── @arronqzy/blueprint-dsl
  └── （间接依赖上述包）

@arronqzy/react-blueprint
  ├── @arronqzy/blueprint-dsl
  ├── @arronqzy/react-rx-store → @arronqzy/rx-store
  └── @arronqzy/ui
```

## 常用脚本

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动 monorepo 开发（Turbo） |
| `pnpm build` | 构建所有包 |
| `pnpm lint` | 全仓库 ESLint |
| `pnpm -C packages/abuilder build` | 构建对外发布的 abuilder 产物 |
| `pnpm -C apps/web build` | 构建演示应用 |

## 技术栈

- **React 18+** / **TypeScript**
- **Vite**、**Turborepo**、**pnpm workspace**
- **RxJS** + **Immer**（状态）
- **React Flow**（蓝图）
- **ECharts**（图表）
- **Moveable** / **Selecto** / **Infinite Viewer**（画布交互）
- **Tailwind CSS** + **Radix UI**（样式与组件）

## 发布

在 GitHub 创建 **Release** 后，CI 会按依赖顺序将以下包发布到 npm：`blueprint-dsl` → `rx-store` → `react-rx-store` → `ui` → `react-blueprint` → `react-view` → `abuilder`。

详见 [.github/workflows/publish.yml](./.github/workflows/publish.yml)。

## 许可证

各包许可证见对应 `package.json`（核心包多为 MIT）。
