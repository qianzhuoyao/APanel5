# @arronqzy/ui

Abuilder 的**共享 UI 组件库**，基于 [shadcn/ui](https://ui.shadcn.com/) + Radix UI + Tailwind CSS，为编辑器与蓝图提供统一视觉与交互。

## 功能概览

- **基础组件**：Button、Input、Dialog、Dropdown、Tabs、Tooltip、Toast 等
- **表单**：与 `react-hook-form`、`zod` 集成的表单控件
- **布局**：Resizable Panels、ScrollArea、Separator
- **主题**：`ThemeProvider` 支持亮/暗色与 `class` 策略
- **层级管理**：`UI_Z_INDEX` / `MODAL_Z_INDEX` 统一浮层 z-index
- **图表**：封装 Recharts 常用图表（按需使用）

## 安装

```bash
pnpm add @arronqzy/ui
```

```ts
import "@arronqzy/ui/styles.css";
```

## 使用

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

### 工具函数

```ts
import { cn } from "@arronqzy/ui";
import { UI_Z_INDEX } from "@arronqzy/ui";
```

## 导出说明

- `@arronqzy/ui` — 全部组件、`cn`、`ThemeProvider`、`useToast`
- `@arronqzy/ui/styles.css` — 编译后的 Tailwind 样式

组件源码位于 `src/ui/`，遵循 shadcn 可组合模式，可按需在本包内扩展。

## 构建样式

```bash
pnpm -C packages/ui build:css
```

依赖 `@arronqzy/tailwind` 预设保持与设计令牌一致。

## 许可证

MIT
