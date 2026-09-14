# @arronqzy/ui

React 编辑器和蓝图用的组件：Button、Dialog、Menu、Toast、可调面板等。基于 Radix 和 Tailwind，视觉和 `@arronqzy/tailwind` 的令牌一致。

这是编辑器内部 UI，不是给业务大屏用的组件库。大屏上的图表、表格、三维在 `react-view` 的物料里。

下图顶栏、侧栏、按钮都来自本包：

![编辑器界面由本包的菜单、按钮和面板拼出来](https://github.com/qianzhuoyao/APanel5/raw/v5/docs/guide-assets/live-zh/01-overview.png)

## 安装

```bash
pnpm add @arronqzy/ui
```

```ts
import "@arronqzy/ui/styles.css";
```

## 用法

```tsx
import { ThemeProvider, Button, toast } from "@arronqzy/ui";
import "@arronqzy/ui/styles.css";

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <Button onClick={() => toast({ title: "Hello" })}>点击</Button>
    </ThemeProvider>
  );
}
```

```ts
import { cn, UI_Z_INDEX } from "@arronqzy/ui";
```

浮层 z-index 用 `UI_Z_INDEX` / `MODAL_Z_INDEX`，不要在蓝图或配置面板里另写一个魔法数字，否则菜单会被画布盖住。

## 导出

- `@arronqzy/ui` — 组件、`cn`、`ThemeProvider`、`useToast`
- `@arronqzy/ui/styles.css` — 编好的 Tailwind

源码在 `src/ui/`，按 shadcn 的方式组合。加组件时放进这个包，不要在 `react-view` 里复制一份 Dialog。

## 构建样式

```bash
pnpm -C packages/ui build:css
pnpm -C packages/ui dev:css
```

`apps/web` 的 `predev` 会构建一次。改组件 class 时开 `dev:css`，否则演示页看不到样式变化。

## 许可证

MIT
