# @arronqzy/tailwind

仓库内部的 Tailwind 预设和 CSS 构建命令。`ui`、`react-view` 用它保证颜色、圆角和暗色变量一致。不单独面向业务项目发布。

## 预设

```ts
import preset from "@arronqzy/tailwind";

export default {
  presets: [preset],
  content: ["./src/**/*.{ts,tsx}"],
};
```

消费包仍要自己写 `content`，扫不到 class 时样式会在构建时被丢掉。

## 编译 CSS

包脚本里一般包一层：

```bash
arronqzy-tailwind -c tailwind.config.ts -i ./src/styles.css -o ./dist/styles.css
```

监听：

```bash
arronqzy-tailwind -c tailwind.config.ts -i ./src/styles.css -o ./dist/styles.css --watch
```

改编辑器外观时，同时开 `packages/ui` 和 `packages/react-view` 的 `dev:css`。只改预设、不重新编译消费包的 CSS，浏览器里不会变。

## 许可证

MIT
