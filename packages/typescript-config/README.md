# @arronqzy/typescript-config

Abuilder monorepo 的**共享 TypeScript 配置**，供各包与应用继承，保持编译选项一致。

## 提供的配置

| 文件 | 用途 |
|------|------|
| `base.json` | 基础严格模式、模块解析、ES 目标 |
| `vite.json` | 面向 Vite 应用的扩展 |
| `react-library.json` | React 组件库（JSX、DOM 类型） |

## 使用

在包的 `tsconfig.json` 中继承：

```json
{
  "extends": "@arronqzy/typescript-config/react-library.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

Vite 应用示例：

```json
{
  "extends": "@arronqzy/typescript-config/vite.json",
  "include": ["src"]
}
```

## 安装

```bash
pnpm add -D @arronqzy/typescript-config
```

Monorepo 内通常使用 `workspace:*`。

## 许可证

MIT
