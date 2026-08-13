# @arronqzy/i18n

Abuilder 共享国际化包，默认支持 **zh-CN** / **en-US**，可同时用于 React 与 Vue。

## 安装

```bash
pnpm add @arronqzy/i18n
```

## React

```tsx
import { I18nProvider, useI18n } from "@arronqzy/i18n/react";

<I18nProvider locale="zh-CN">
  <App />
</I18nProvider>

const { t, locale, setLocale } = useI18n();
t("panel.menubar.file");
```

## Vue

```ts
import { abuilderI18n, useI18n, provideI18n } from "@arronqzy/i18n/vue";

app.use(abuilderI18n, { locale: "en-US" });
// 或在组件内 provideI18n({ locale: "zh-CN" })
```

## 语言解析优先级

1. 显式 `locale` prop
2. `localStorage`（默认 key：`abuilder.locale`）
3. 浏览器语言（`zh*` → zh-CN，否则 en-US）
4. 回退 `zh-CN`

## 许可证

MIT
