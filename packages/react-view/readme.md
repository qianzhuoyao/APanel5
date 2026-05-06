# @arron/react-view

## Tailwind 使用方式

本包内已内置 Tailwind 配置，并提供可直接引入的样式产物：

- 生成样式：`pnpm -C packages/react-view build:css`
- 使用样式：在你的应用入口中引入

```ts
import "@arron/react-view/styles.css";
```

如果你希望由应用侧的 Tailwind 来扫描本包源码（不引入上面的 `styles.css`），请把本包路径加入应用的 `content` 配置，例如：

```ts
content: [
  "./src/**/*.{ts,tsx}",
  "./node_modules/@arron/react-view/src/**/*.{ts,tsx}",
]
```
