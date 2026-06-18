# @arronqzy/tailwind

Abuilder monorepo 的**共享 Tailwind CSS 预设与构建 CLI**，统一各包的 design tokens、动画与主题变量。

## 功能概览

- **共享 preset**：`@arronqzy/tailwind` 导出 `tailwind.config` 预设（颜色、圆角、accordion 动画等）
- **CLI**：`arronqzy-tailwind` 封装 PostCSS + Tailwind 编译，供 `ui`、`react-view` 等包构建 `dist/styles.css`

## 安装

Monorepo 内通过 workspace 引用：

```json
{
  "devDependencies": {
    "@arronqzy/tailwind": "workspace:*"
  }
}
```

## 在包中使用预设

```ts
// tailwind.config.ts
import preset from "@arronqzy/tailwind";

export default {
  presets: [preset],
  content: ["./src/**/*.{ts,tsx}"],
};
```

## 构建 CSS

```bash
arronqzy-tailwind -c tailwind.config.ts -i ./src/styles.css -o ./dist/styles.css
```

监听模式：

```bash
arronqzy-tailwind -c tailwind.config.ts -i ./src/tailwind.css -o ./dist/styles.css --watch
```

## 说明

- 本包为 **private**，主要服务 monorepo 内部，不单独发布到 npm
- 各消费包仍需自行配置 `content` 路径以扫描组件类名

## 许可证

MIT（随 monorepo）
