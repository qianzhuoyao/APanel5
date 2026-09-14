# @arronqzy/eslint-config

仓库共享的 ESLint 规则：`eslint:recommended`、`@typescript-eslint/recommended`，并用 `eslint-config-prettier` 避开和 Prettier 冲突的格式规则。

默认关掉 `@typescript-eslint/no-non-null-assertion`。编辑器代码里对画布节点做非空断言很常见，开着会全仓库报噪。

## 用法

```js
// .eslintrc.cjs
module.exports = {
  root: true,
  extends: ["@arronqzy/eslint-config"],
};
```

```bash
pnpm add -D @arronqzy/eslint-config eslint
```

各包的 `lint` 脚本已经 extend 本包。改规则时先在一个包里跑 `pnpm lint`，确认不是把历史代码一次性打红。

本包版本仍是 `0.0.0`，只在 monorepo 内用，不要当成稳定的对外配置发布。

## 许可证

MIT
