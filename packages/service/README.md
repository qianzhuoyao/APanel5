# @arronqzy/service

占位包。目录里只有工程配置，没有可调用的客户端。

蓝图里的 HTTP 请求由 `@arronqzy/blueprint-dsl` 在运行时直接发出，不经过本包。宿主自己的后端通信写在宿主应用里，订阅 `workspace:add` / `workspace:sync` 即可。

不要 `pnpm add @arronqzy/service`，也不要在新代码里 import 它。等真的有统一请求层时再补导出和示例。
