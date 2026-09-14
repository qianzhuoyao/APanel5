# @arronqzy/blueprint-dsl

蓝图的节点定义和运行时。没有 UI。React Flow / Vue Flow 只负责画；节点收到信号后做什么，在这个包里。

上层画布见 `@arronqzy/react-blueprint` 和 `@arronqzy/vue-blueprint`。

![这些节点卡片背后的行为都在本包](https://github.com/qianzhuoyao/APanel5/raw/v5/docs/guide-assets/live-zh/41-blueprint-nodes.png)

## 内置节点在干什么

| 类型 | 作用 |
|------|------|
| 生命周期 | 页面挂载、卸载等阶段发信号，常作为一条链的起点 |
| 事件 | 视图节点点击等事件进来 |
| 请求 | HTTP，URL / 头 / 体可带 Scope 模版 |
| JSON | 解析、取值、拼对象 |
| 存储 | 读写本地存储，key 可补全 |
| 逻辑 | 条件分支 |
| 与门 | 多路信号汇合 |
| 时钟 | 定时 tick，可中止 |
| 蓝图 | 引用蓝图库里的另一张图 |

假信号默认会堵住下游。节点上可以打开「允许假信号传递」，错误结果也继续往下走。视图侧用 `{scope.xxx}` 读这些节点写进 Scope 的值，模版解析也在本包（`scope-template`）。

## 安装

```bash
pnpm add @arronqzy/blueprint-dsl rxjs
```

## 注册自己的行为

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

编辑器里的内置节点已经注册好。上面这段是扩展点，不是使用 Abuilder 的必经步骤。

## 模块

| 导出所在 | 说明 |
|----------|------|
| `core/behavior` | 行为接口与 IO |
| `core/behavior-registry` | 注册 JS / 内置行为 |
| `core/executor` | 单节点执行 |
| `runtime/graph-runner` | 整图调度、环检测 |
| `runtime/execution-trace` | 执行轨迹（日志面板的数据源） |
| `runtime/clock-scheduler` | 时钟 tick、中止、活跃订阅 |
| `nodes/definitions` | 内置节点定义 |
| `scope-template` / `scope-autocomplete` | `{scope.xxx}` 解析与补全 |
| `fetch-config` / `logic-config` / `clock-config` / `json-config` / `storage-config` / `event-config` | 各节点配置结构 |

## 许可证

MIT
