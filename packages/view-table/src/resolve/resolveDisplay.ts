import { coerceTableBoolean } from "../boolean/coerce";
import { evaluateCondition } from "../condition/evaluate";
import type {
  CellDisplay,
  CellDisplayContext,
  NormalizedColumn,
  NormalizedRow,
  PanelTableConfig,
  RowDisplay,
  TableProgressDisplay,
  TableStyleProps,
  TableWidgetProps,
} from "../types";

function asString(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

function asNumber(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) {
    return Number(v);
  }
  return null;
}

function mergeStyle(...parts: Array<TableStyleProps | undefined>): TableStyleProps {
  return Object.assign({}, ...parts.filter(Boolean));
}

function applyValueMap(
  column: NormalizedColumn,
  row: NormalizedRow,
  raw: unknown,
  scope?: unknown
): unknown {
  if (!column.valueMap?.length) return raw;
  for (const rule of column.valueMap) {
    if (
      evaluateCondition(rule.when, {
        row: row.values,
        value: raw,
        column: column.field,
        scope,
      })
    ) {
      const v = rule.value;
      // String targets support templates; {current}/{value} = original cell value.
      if (typeof v === "string") {
        return resolveTemplate(v, row, raw, false);
      }
      return v;
    }
  }
  return raw;
}

function resolveHref(
  column: NormalizedColumn,
  row: NormalizedRow,
  displayValue: unknown,
  scope?: unknown
): string | undefined {
  const props = column.widgetProps;
  const raw = row.values[column.field];

  if (props?.hrefRules?.length) {
    for (const rule of props.hrefRules) {
      if (
        evaluateCondition(rule.when, {
          row: row.values,
          value: raw,
          column: column.field,
          scope,
        })
      ) {
        return resolveTemplate(rule.href, row, displayValue, false);
      }
    }
  }

  if (!props) {
    if (column.widget === "link") return asString(displayValue);
    return undefined;
  }
  if (props.hrefField && row.values[props.hrefField] != null) {
    return asString(row.values[props.hrefField]);
  }
  if (props.hrefTemplate) {
    return resolveTemplate(props.hrefTemplate, row, displayValue, true);
  }
  if (column.widget === "link") return asString(displayValue);
  return undefined;
}

function resolveTemplate(
  template: string,
  row: NormalizedRow,
  displayValue: unknown,
  encode = false
): string {
  const enc = (v: unknown) => {
    const s = asString(v);
    return encode ? encodeURIComponent(s) : s;
  };
  return template
    .replace(/\{current\}/g, enc(displayValue))
    .replace(/\{value\}/g, enc(displayValue))
    .replace(/\{row\.(\w+)\}/g, (_, key: string) => enc(row.values[key]));
}

function resolveImageUrl(
  column: NormalizedColumn,
  row: NormalizedRow,
  displayValue: unknown
): string {
  const props = column.widgetProps ?? {};
  const mode = props.imageUrlMode ?? "field";
  const fieldName = props.imageUrlField?.trim() || column.field;
  const fieldValue = row.values[fieldName];

  if (mode === "static") {
    return asString(props.imageUrl ?? "");
  }
  if (mode === "prefix") {
    const prefix = asString(props.imageUrlPrefix ?? "");
    const suffix = asString(props.imageUrlSuffix ?? "");
    return `${prefix}${asString(fieldValue)}${suffix}`;
  }
  if (mode === "template") {
    const tpl = props.imageUrlTemplate?.trim();
    if (tpl) return resolveTemplate(tpl, row, displayValue, false);
    return asString(displayValue);
  }
  if (fieldValue != null && fieldValue !== "") return asString(fieldValue);
  return asString(displayValue);
}

function buildColorMap(
  props: NonNullable<NormalizedColumn["widgetProps"]> | undefined
): Record<string, string> | undefined {
  if (!props) return undefined;
  const fromEntries: Record<string, string> = {};
  for (const entry of props.colorMapEntries ?? []) {
    const key = String(entry.value ?? "").trim();
    if (!key || !entry.color) continue;
    fromEntries[key] = entry.color;
  }
  return { ...(props.colorMap ?? {}), ...fromEntries };
}

function pickColor(column: NormalizedColumn, displayText: string, raw: unknown): string | undefined {
  const map = buildColorMap(column.widgetProps);
  if (map) {
    if (map[displayText]) return map[displayText];
    const rawKey = asString(raw);
    if (map[rawKey]) return map[rawKey];
  }
  return column.widgetProps?.color;
}

function resolveProgressPercent(
  column: NormalizedColumn,
  row: NormalizedRow,
  mapped: unknown,
  scope?: unknown
): number {
  const props = column.widgetProps ?? {};
  const max = Math.max(1, asNumber(props.max) ?? 100);
  const mode = props.progressMode ?? "field";
  let n: number | null = null;

  if (mode === "static") {
    n = asNumber(props.progressStatic);
  } else if (mode === "rules" && props.progressRules?.length) {
    const raw = row.values[column.field];
    for (const rule of props.progressRules) {
      if (
        evaluateCondition(rule.when, {
          row: row.values,
          value: raw,
          column: column.field,
          scope,
        })
      ) {
        n = asNumber(rule.value);
        break;
      }
    }
  } else {
    const fieldName = props.progressField?.trim() || column.field;
    const fieldValue = row.values[fieldName];
    n = asNumber(fieldValue);
    if (n == null) n = asNumber(mapped);
  }

  const value = n ?? 0;
  return Math.max(0, Math.min(100, (value / max) * 100));
}

export function resolveCellDisplay(
  row: NormalizedRow,
  column: NormalizedColumn,
  config: PanelTableConfig,
  ctx: CellDisplayContext = {}
): CellDisplay {
  const raw = row.values[column.field];
  const mapped = applyValueMap(column, row, raw, ctx.scope);
  const text = asString(mapped);
  const widget = column.widget ?? "text";

  let style: TableStyleProps = { textAlign: column.align };

  if (column.cellStyleRules?.length) {
    for (const rule of column.cellStyleRules) {
      if (
        evaluateCondition(rule.when, {
          row: row.values,
          value: raw,
          column: column.field,
          scope: ctx.scope,
        })
      ) {
        style = mergeStyle(style, rule.style);
      }
    }
  }

  if (config.cellStyleRules?.length) {
    for (const rule of config.cellStyleRules) {
      if (rule.columns?.length && !rule.columns.includes(column.field)) continue;
      if (
        evaluateCondition(rule.when, {
          row: row.values,
          value: raw,
          column: column.field,
          scope: ctx.scope,
        })
      ) {
        style = mergeStyle(style, rule.style);
      }
    }
  }

  const display: CellDisplay = {
    raw,
    text,
    widget,
    widgetProps: column.widgetProps,
    style,
    color: pickColor(column, text, raw),
  };

  if (widget === "text" && column.widgetProps?.textStyle) {
    const ts = column.widgetProps.textStyle;
    display.style = mergeStyle(display.style, {
      color: ts.color,
      fontSize: ts.fontSize,
      fontWeight: ts.fontWeight,
      textAlign: ts.textAlign,
    });
    // keep extended typography on widgetProps for renderers
  }

  if (widget === "link") {
    display.href = resolveHref(column, row, mapped, ctx.scope);
  }
  if (widget === "progress") {
    display.progress = resolveProgressPercent(column, row, mapped, ctx.scope);
    display.text = `${Math.round(display.progress ?? 0)}%`;
  }
  if (widget === "boolean") {
    display.booleanValue = coerceTableBoolean(mapped);
    if (column.widgetProps?.trueLabel || column.widgetProps?.falseLabel) {
      display.text = display.booleanValue
        ? column.widgetProps.trueLabel ?? "true"
        : column.widgetProps.falseLabel ?? "false";
    }
  }
  if (widget === "image") {
    display.imageUrl = resolveImageUrl(column, row, mapped);
  }

  // Pipeline: raw → valueMap (optional templates) → displayTemplate.
  // {current}/{value} in displayTemplate = mapped result.
  const displayTpl = column.displayTemplate?.trim();
  if (displayTpl) {
    display.text = resolveTemplate(displayTpl, row, mapped, false);
  }

  if (column.tooltipEnabled) {
    const tipTpl = column.tooltipTemplate?.trim();
    const tipText = tipTpl
      ? resolveTemplate(tipTpl, row, mapped, false)
      : display.text;
    if (tipText) {
      display.tooltip = {
        enabled: true,
        text: tipText,
        placement: column.tooltipPlacement ?? "top",
      };
    }
  }

  return display;
}

export function resolveRowDisplay(
  row: NormalizedRow,
  config: PanelTableConfig,
  ctx: CellDisplayContext = {}
): RowDisplay {
  let style: TableStyleProps = {};
  if (config.rowStyleRules?.length) {
    for (const rule of config.rowStyleRules) {
      if (
        evaluateCondition(rule.when, {
          row: row.values,
          value: undefined,
          scope: ctx.scope,
        })
      ) {
        style = mergeStyle(style, rule.style);
      }
    }
  }
  const stripe = Boolean(config.stripe ?? config.tableStyle?.stripe);
  if (stripe && row.index % 2 === 1) {
    style = mergeStyle(style, {
      backgroundColor:
        config.tableStyle?.stripeBackgroundColor ?? "rgba(0,0,0,0.02)",
    });
  }
  return { style, stripe };
}

export function stylePropsToCss(style: TableStyleProps): Record<string, string | number> {
  const css: Record<string, string | number> = {};
  if (style.backgroundColor) css.backgroundColor = style.backgroundColor;
  if (style.color) css.color = style.color;
  if (style.fontSize != null) css.fontSize = style.fontSize;
  if (style.fontWeight != null) css.fontWeight = style.fontWeight;
  if (style.borderColor) css.borderColor = style.borderColor;
  if (style.borderWidth != null) css.borderWidth = style.borderWidth;
  if (style.borderRadius != null) css.borderRadius = style.borderRadius;
  if (style.padding != null) css.padding = style.padding;
  if (style.textAlign) css.textAlign = style.textAlign;
  if (style.opacity != null) css.opacity = style.opacity;
  return css;
}

/** Resolve progress display mode with legacy showLabel fallback. */
export function resolveProgressDisplay(
  props?: TableWidgetProps | null
): TableProgressDisplay {
  if (props?.progressDisplay) return props.progressDisplay;
  if (props?.showLabel === false) return "bar";
  return "barLabel";
}
