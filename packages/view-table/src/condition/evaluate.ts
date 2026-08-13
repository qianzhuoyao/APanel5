import type { Condition, ConditionGroup, ConditionLeaf } from "../types";

export type ConditionContext = {
  row: Record<string, unknown>;
  value?: unknown;
  column?: string;
  scope?: unknown;
};

function readField(
  row: Record<string, unknown>,
  field: string | undefined,
  fallback: unknown
): unknown {
  if (!field) return fallback;
  if (Object.prototype.hasOwnProperty.call(row, field)) return row[field];
  // support dotted path lightly
  const parts = field.split(".");
  let cur: unknown = row;
  for (const p of parts) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[p];
  }
  return cur;
}

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

function evalExpr(expr: string, ctx: ConditionContext): unknown {
  try {
    const fn = new Function(
      "row",
      "value",
      "column",
      "scope",
      `"use strict"; return (${expr});`
    );
    return fn(ctx.row, ctx.value, ctx.column, ctx.scope);
  } catch {
    return undefined;
  }
}

function evalLeaf(cond: ConditionLeaf, ctx: ConditionContext): boolean {
  const left = readField(ctx.row, cond.field, ctx.value);
  const right = cond.value;
  switch (cond.op) {
    case "eq":
      return left === right || asString(left) === asString(right);
    case "neq":
      return !(left === right || asString(left) === asString(right));
    case "gt": {
      const a = asNumber(left);
      const b = asNumber(right);
      return a != null && b != null && a > b;
    }
    case "gte": {
      const a = asNumber(left);
      const b = asNumber(right);
      return a != null && b != null && a >= b;
    }
    case "lt": {
      const a = asNumber(left);
      const b = asNumber(right);
      return a != null && b != null && a < b;
    }
    case "lte": {
      const a = asNumber(left);
      const b = asNumber(right);
      return a != null && b != null && a <= b;
    }
    case "contains":
      return asString(left).includes(asString(right));
    case "startsWith":
      return asString(left).startsWith(asString(right));
    case "endsWith":
      return asString(left).endsWith(asString(right));
    case "in": {
      if (Array.isArray(right)) return right.some((x) => x === left || asString(x) === asString(left));
      return asString(right)
        .split(",")
        .map((s) => s.trim())
        .includes(asString(left));
    }
    case "empty":
      return left == null || left === "" || (Array.isArray(left) && left.length === 0);
    case "notEmpty":
      return !(left == null || left === "" || (Array.isArray(left) && left.length === 0));
    case "regex": {
      try {
        return new RegExp(asString(right)).test(asString(left));
      } catch {
        return false;
      }
    }
    case "truthy":
      return Boolean(left);
    case "falsy":
      return !left;
    default:
      return false;
  }
}

export function evaluateCondition(cond: Condition | undefined, ctx: ConditionContext): boolean {
  if (!cond) return false;
  if (cond.op === "and" || cond.op === "or" || cond.op === "not") {
    const group = cond as ConditionGroup;
    const items = group.items ?? [];
    if (items.length === 0) return false;
    if (group.op === "and") {
      return items.every((c) => evaluateCondition(c, ctx));
    }
    if (group.op === "or") {
      return items.some((c) => evaluateCondition(c, ctx));
    }
    // not: negate the conjunction of items (single item → simple negation)
    return !items.every((c) => evaluateCondition(c, ctx));
  }
  if (cond.op === "expr") {
    const result = evalExpr(cond.expr, ctx);
    return Boolean(result);
  }
  return evalLeaf(cond as ConditionLeaf, ctx);
}
