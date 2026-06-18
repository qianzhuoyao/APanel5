# @arronqzy/blueprint-dsl

Abuilder 蓝图的 **DSL 与运行时** 包，定义节点类型、行为注册与图执行逻辑，不依赖 React。

## 功能概览

- **节点定义**：Flow / Data 端口、节点元数据与默认行为
- **行为注册表**：`BehaviorRegistry` 注册 JS / 内置行为
- **执行器**：按 Token 驱动节点执行、Scope 传递
- **图运行器**：整图调度、循环检测、执行轨迹
- **内置节点**：逻辑判断、HTTP 请求、JSON 处理、时钟定时、Swagger 等
- **时钟调度**：多 tick 输出、中止与活跃状态订阅

## 安装

```bash
pnpm add @arronqzy/blueprint-dsl rxjs
```

## 快速开始

```ts
import {
  BehaviorRegistry,
  Executor,
  type NodeDefinition,
} from "@arronqzy/blueprint-dsl";

const behaviors = new BehaviorRegistry();

behaviors.registerJS("print-js", async ({ io }) => {
  console.log(await io.getInput("msg"));
  io.emitFlow("out");
});

const PrintNode: NodeDefinition = {
  type: "Print",
  inputs: [{ name: "msg", kind: "data" }],
  outputs: [{ name: "out", kind: "flow" }],
  behavior: { kind: "js", ref: "print-js" },
};

const executor = new Executor(behaviors);

await executor.executeToken({
  tokenId: "t1",
  nodeId: "n1",
  nodeType: "Print",
  inPort: "in",
  scope: { vars: new Map() },
});
```

## 核心模块

| 路径 | 说明 |
|------|------|
| `core/behavior.js` | 行为接口与 IO |
| `core/behavior-registry.js` | 行为注册 |
| `core/executor.js` | 单节点执行 |
| `runtime/graph-runner.js` | 整图运行 |
| `runtime/execution-trace.js` | 执行轨迹 |
| `runtime/clock-scheduler.js` | 时钟节点调度 |
| `nodes/definitions.js` | 内置节点定义 |
| `fetch-config.js` / `logic-config.js` 等 | 各类型节点配置结构 |

## 与上层包的关系

- **`@arronqzy/react-blueprint`**：React Flow 画布、调试 UI、蓝图库
- **`@arronqzy/react-view`**：蓝图执行结果通过 Scope 驱动视图节点

## 许可证

MIT
