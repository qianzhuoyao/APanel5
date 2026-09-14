# @arronqzy/typescript-config

仓库共享的 `tsconfig`，让各包的 `strict`、模块解析和 JSX 选项一致。新包继承这里，不要从零抄一份。

## 文件

| 文件 | 给谁用 |
|------|--------|
| `base.json` | 纯 TS 包（DSL、store、工具） |
| `vite.json` | Vite 应用 |
| `react-library.json` | React 组件库（JSX、DOM 类型） |

## 用法

库：

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

Vite 应用：

```json
{
  "extends": "@arronqzy/typescript-config/vite.json",
  "include": ["src"]
}
```

```bash
pnpm add -D @arronqzy/typescript-config
```

仓库内用 `workspace:*`。

## 许可证

MIT
