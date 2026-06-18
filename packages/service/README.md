# @arronqzy/service

Abuilder monorepo 中的**服务层占位包**，规划用于封装与后端 API 的通信（HTTP 客户端、请求校验、RxJS 数据流等）。

## 当前状态

包内尚未实现业务代码，仅保留工程配置（`package.json`、`tsconfig.json`）。蓝图中的 HTTP 请求节点目前由 `@arronqzy/blueprint-dsl` 在运行时直接处理。

## 规划能力

- 基于 `axios` 的统一请求封装
- 使用 `zod` 校验请求/响应结构
- 与 `rxjs` 集成的可订阅数据源

## 安装

```bash
pnpm add @arronqzy/service
```

待 API 稳定后再补充使用示例与导出说明。

## 许可证

ISC
