# @arronqzy/eslint-config

Abuilder monorepo 的**共享 ESLint 配置**，统一 TypeScript 与 Prettier 规则。

## 规则集

基于：

- `eslint:recommended`
- `plugin:@typescript-eslint/recommended`
- `eslint-config-prettier`（避免与 Prettier 冲突）

默认关闭 `@typescript-eslint/no-non-null-assertion`，适配编辑器类代码习惯。

## 使用

在包根目录创建 `eslint.config` 或 `.eslintrc.cjs`：

```js
module.exports = {
  root: true,
  extends: ["@arronqzy/eslint-config"],
};
```

若使用扁平配置，可在 `eslint.config.js` 中 require 本包导出的规则（与仓库内各包 `lint` 脚本保持一致即可）。

## 安装

```bash
pnpm add -D @arronqzy/eslint-config eslint
```

## 许可证

MIT
