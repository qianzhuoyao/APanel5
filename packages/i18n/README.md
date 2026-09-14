# @arronqzy/i18n

Abuilder 的中英文案，React 和 Vue 共用同一套 key。默认 `zh-CN`，也可切到 `en-US`。

编辑器里的「设置 → 语言」写的是 `localStorage` key `abuilder.locale`。面板、物料名、蓝图节点、配置提示都走这里，不要在视图包里再写一份硬编码中文。

## 安装

```bash
pnpm add @arronqzy/i18n
```

React 和 Vue 都是 optional peer。只用一端时不必装另一端。

## React

```tsx
import { I18nProvider, useI18n } from "@arronqzy/i18n/react";

<I18nProvider locale="zh-CN">
  <App />
</I18nProvider>

const { t, locale, setLocale } = useI18n();
t("panel.menubar.file");
```

`useI18n()` 必须在 **同一份包实例** 的 `I18nProvider` 下面。Umi / pnpm 有时会打出两份 `@arronqzy/i18n`，面板的 Provider 和蓝图的 hook 对不上，就会报 `useI18n must be used within I18nProvider`。

处理方式：

- 库代码用 `useI18nOptional()`：没有 Provider 时回退中文，不抛错。
- 入口用 `EnsureI18nProvider`：本包实例上方没有 Provider 时自己包一层。
- 宿主用 `overrides` / `resolutions` 把 `@arronqzy/i18n` 收成一份，语言切换才能两端同步。

```tsx
import { EnsureI18nProvider, useI18nOptional } from "@arronqzy/i18n/react";
```

## Vue

```ts
import { abuilderI18n, useI18n, provideI18n } from "@arronqzy/i18n/vue";

app.use(abuilderI18n, { locale: "en-US" });
// 或在 setup 里 provideI18n({ locale: "zh-CN" })

const { t, locale, setLocale } = useI18n();
```

没有 `provide` 时 `useI18n()` 会抛错。`useI18nOptional()` 回退到中文。

## 语言怎么定

1. 显式 `locale`
2. `localStorage`（默认 key `abuilder.locale`）
3. 浏览器语言（`zh*` → `zh-CN`，否则 `en-US`）
4. 回退 `zh-CN`

文案在 `src/locales/zh-CN.ts` 和 `en-US.ts`。加 key 时两份一起加，缺的 key 会显示 key 本身。

## 许可证

MIT
