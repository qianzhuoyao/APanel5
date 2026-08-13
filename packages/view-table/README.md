# @arronqzy/view-table

Abuilder 可视化表格的纯 TS 引擎：任意数据转换、条件 DSL、列映射与单元格展示解析。无 UI，供 `@arronqzy/react-view` / `@arronqzy/vue-view` 使用。

## API

```ts
import {
  transformToTableCached,
  resolveCellDisplay,
  createDefaultTableConfig,
} from "@arronqzy/view-table";

const config = createDefaultTableConfig();
const model = transformToTableCached(config.rows, config);
const cell = resolveCellDisplay(model.rows[0], model.columns[0], config);
```

## 蓝图接入

视图节点绑定蓝图输出 Scope 后，在表格配置中设置：

- `source`: `{scope?.data?.list}`
- 或 `rowsText`: `[...{scope?.items}]`

引擎负责 `transform` → `NormalizedTable`，再由双栈虚拟化表格渲染（Tag / 条件样式等）。

## 许可证

MIT
