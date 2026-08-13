/** Shared visual-table types for Abuilder panel material `table`. */

export type TableAlign = "left" | "center" | "right";

export type TableCellWidget =
  | "text"
  | "tag"
  | "badge"
  | "link"
  | "progress"
  | "image"
  | "boolean";

export type TableStyleProps = {
  backgroundColor?: string;
  color?: string;
  fontSize?: number;
  fontWeight?: string | number;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  padding?: string | number;
  textAlign?: TableAlign;
  opacity?: number;
};

export type ConditionOp =
  | "eq"
  | "neq"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "contains"
  | "startsWith"
  | "endsWith"
  | "in"
  | "empty"
  | "notEmpty"
  | "regex"
  | "truthy"
  | "falsy";

export type ConditionLeaf = {
  op: ConditionOp;
  /** Field on row; defaults to current cell field when resolving cell rules */
  field?: string;
  value?: unknown;
};

export type ConditionGroup = {
  op: "and" | "or" | "not";
  items: Condition[];
};

export type ConditionExpr = {
  op: "expr";
  /** Evaluated with Function against { row, value, column, scope } */
  expr: string;
};

export type Condition = ConditionLeaf | ConditionGroup | ConditionExpr;

export type TableValueMapRule = {
  when: Condition;
  value: string | number | boolean;
};

export type TableStyleRule = {
  when: Condition;
  style: TableStyleProps;
};

export type TableGlobalCellStyleRule = {
  /** Limit to column fields; omit = all columns */
  columns?: string[];
  when: Condition;
  style: TableStyleProps;
};

/** Tag/badge: match display or raw value → color (no condition DSL needed) */
export type TableColorMapEntry = {
  value: string;
  color: string;
};

/** Link: first matching rule wins; href supports {value}/{row.xxx} and Scope-resolved static */
export type TableHrefRule = {
  when: Condition;
  href: string;
};

/** Progress: first matching rule wins; value is number or numeric string */
export type TableProgressRule = {
  when: Condition;
  value: number | string;
};

/**
 * Optional blueprint triggers from cell interaction.
 * Empty / omitted = do not trigger.
 */
export type TableCellActions = {
  /** link / tag / image / cell click */
  onClickBlueprintNodeId?: string;
  /** boolean switch → true */
  onTrueBlueprintNodeId?: string;
  /** boolean switch → false */
  onFalseBlueprintNodeId?: string;
};

export type TableTextStyle = {
  color?: string;
  fontSize?: number;
  fontWeight?: string | number;
  fontFamily?: string;
  fontStyle?: "normal" | "italic";
  textDecoration?: "none" | "underline" | "line-through";
  textAlign?: TableAlign;
  /** text overflow: ellipsis (default) or wrap */
  overflow?: "ellipsis" | "wrap";
};

export type TableProgressDisplay = "bar" | "barLabel" | "label" | "circle";

export type TableWidgetProps = {
  /** tag/badge: map display value → color */
  colorMap?: Record<string, string>;
  /** easier editor form; synced to colorMap at resolve time if present */
  colorMapEntries?: TableColorMapEntry[];
  /** tag / progress track color */
  color?: string;
  /** text widget typography */
  textStyle?: TableTextStyle;
  /** link: field holding href, or template with {value} / {row.xxx} */
  hrefField?: string;
  hrefTemplate?: string;
  /** conditional href list (first match); falls back to field/template/value */
  hrefRules?: TableHrefRule[];
  openInNewTab?: boolean;
  /**
   * progress source:
   * - field: numeric row field (default column.field)
   * - static: progressStatic (number or Scope-resolved string)
   * - rules: first matching progressRules value
   */
  progressMode?: "field" | "static" | "rules";
  progressField?: string;
  progressStatic?: number | string;
  progressRules?: TableProgressRule[];
  max?: number;
  /**
   * progress look:
   * - bar: track only
   * - barLabel: track + percent text (default)
   * - label: percent text only
   * - circle: circular progress (+ optional percent inside)
   * Legacy `showLabel === false` maps to `bar`.
   */
  progressDisplay?: TableProgressDisplay;
  /** @deprecated prefer progressDisplay */
  showLabel?: boolean;
  /** circle diameter (px); default 28 */
  progressSize?: number;
  /** circle stroke width (px); default 3 */
  progressStrokeWidth?: number;
  /**
   * image URL source:
   * - field: row[imageUrlField || column.field]
   * - static: imageUrl (paste / upload / Scope 模版解析后的固定地址)
   * - prefix: imageUrlPrefix + row[field] + imageUrlSuffix
   * - template: imageUrlTemplate with {value} / {row.xxx}
   */
  imageUrlMode?: "field" | "static" | "prefix" | "template";
  /** static / uploaded URL (also accepts Scope template before resolve) */
  imageUrl?: string;
  /** row field that holds path or full URL */
  imageUrlField?: string;
  imageUrlPrefix?: string;
  imageUrlSuffix?: string;
  /** e.g. `{prefix}{row.avatar}` or `https://cdn/{row.id}.png` — use {value}/{row.xxx} */
  imageUrlTemplate?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageObjectFit?: "cover" | "contain" | "fill";
  /** boolean labels */
  trueLabel?: string;
  falseLabel?: string;
  /** interactive → blueprint */
  actions?: TableCellActions;
};

export type TableColumnConfig = {
  id?: string;
  field: string;
  title?: string;
  width?: number;
  minWidth?: number;
  align?: TableAlign;
  hidden?: boolean;
  valueMap?: TableValueMapRule[];
  widget?: TableCellWidget;
  widgetProps?: TableWidgetProps;
  cellStyleRules?: TableStyleRule[];
};

export type TableTransformConfig = {
  mode?: "auto" | "records" | "matrix" | "path";
  /** Dot path into raw payload when mode is path/auto */
  path?: string;
  columnsFrom?: "keys" | "firstRow" | "explicit";
  rowIdField?: string;
};

export type PanelTableConfig = {
  /**
   * Dynamic Scope binding, e.g. `{scope?.list}`.
   * Non-empty resolved data wins over static `rows` / `rowsText`.
   */
  source?: string;
  /**
   * Resolved / injected row payload (often from Scope materialize).
   * Empty / missing → fall back to `rowsText`.
   */
  rows?: unknown;
  /** Static JSON rows (default demo data for new tables). */
  rowsText?: string;
  transform?: TableTransformConfig;
  columns?: TableColumnConfig[];
  rowStyleRules?: TableStyleRule[];
  cellStyleRules?: TableGlobalCellStyleRule[];
  headerStyle?: TableStyleProps;
  tableStyle?: TableStyleProps & {
    stripe?: boolean;
    stripeBackgroundColor?: string;
    borderCollapse?: boolean;
    stickyHeader?: boolean;
  };
  showHeader?: boolean;
  stripe?: boolean;
  rowHeight?: number;
  emptyText?: string;
};

export type NormalizedColumn = {
  id: string;
  field: string;
  title: string;
  width?: number;
  minWidth?: number;
  align: TableAlign;
  hidden: boolean;
  widget: TableCellWidget;
  widgetProps?: TableWidgetProps;
  valueMap?: TableValueMapRule[];
  cellStyleRules?: TableStyleRule[];
};

export type NormalizedRow = {
  id: string;
  values: Record<string, unknown>;
  index: number;
};

export type NormalizedTable = {
  columns: NormalizedColumn[];
  rows: NormalizedRow[];
};

export type CellDisplayContext = {
  scope?: unknown;
};

export type CellDisplay = {
  raw: unknown;
  text: string;
  widget: TableCellWidget;
  widgetProps?: TableWidgetProps;
  style: TableStyleProps;
  href?: string;
  progress?: number;
  booleanValue?: boolean;
  imageUrl?: string;
  color?: string;
};

export type RowDisplay = {
  style: TableStyleProps;
  stripe?: boolean;
};

export type TableCellActionKind = "click" | "toggleOn" | "toggleOff";

export type TableCellActionPayload = {
  kind: TableCellActionKind;
  blueprintNodeId: string;
  elementId?: string;
  columnField: string;
  rowId: string;
  row: Record<string, unknown>;
  value: unknown;
};
