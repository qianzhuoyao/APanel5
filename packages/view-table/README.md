# @arronqzy/view-table

可视化表格的纯 TypeScript 引擎：把任意数据变成行列、做列映射、算条件样式、决定单元格怎么显示。没有 DOM。React 和 Vue 的表格物料都调它。

配置在编辑器右侧完成。下图右侧就是条件样式、行高、表头这些字段，算出来的 Tag 和进度条由双栈表格组件画：

![表格物料：引擎算数据，视图包负责画](https://github.com/qianzhuoyao/APanel5/raw/v5/docs/guide-assets/live-zh/09-table-full.png)

## 安装

```bash
pnpm add @arronqzy/view-table
```

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

`transformToTableCached` 按配置做转换并缓存，得到 `NormalizedTable`。`resolveCellDisplay` 决定这一格是纯文本、Tag、进度条还是条件色。

## 和蓝图

视图节点绑了蓝图输出的 Scope 之后，在表格配置里写：

- `source`: `{scope?.data?.list}`
- 或 `rowsText`: `[...{scope?.items}]`

引擎做 `transform` → `NormalizedTable`。虚拟滚动、列宽拖拽在 `react-view` / `vue-view`，不在本包。

## 许可证

MIT
