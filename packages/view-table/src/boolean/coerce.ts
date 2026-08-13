import type { Condition, TableValueMapRule } from "../types";

const TRUE_TOKENS = new Set([
  "true",
  "1",
  "yes",
  "y",
  "on",
  "是",
  "真",
  "开",
]);
const FALSE_TOKENS = new Set([
  "false",
  "0",
  "no",
  "n",
  "off",
  "否",
  "假",
  "关",
]);

/** Runtime coercion for boolean cell display. */
export function coerceTableBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0 && Number.isFinite(value);
  if (typeof value === "string") {
    const s = value.trim().toLowerCase();
    if (FALSE_TOKENS.has(s) || FALSE_TOKENS.has(value.trim())) return false;
    if (TRUE_TOKENS.has(s) || TRUE_TOKENS.has(value.trim())) return true;
    return s.length > 0;
  }
  return Boolean(value);
}

/**
 * Strict parse for valueMap targets when widget is boolean.
 * Returns null when the mapped value is not clearly yes/no.
 */
export function coerceBooleanMapTarget(value: unknown): boolean | null {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") {
    if (value === 1) return true;
    if (value === 0) return false;
    return null;
  }
  if (typeof value === "string") {
    const raw = value.trim();
    const s = raw.toLowerCase();
    if (TRUE_TOKENS.has(s) || TRUE_TOKENS.has(raw)) return true;
    if (FALSE_TOKENS.has(s) || FALSE_TOKENS.has(raw)) return false;
  }
  return null;
}

function whenConflictKey(when: Condition): string {
  if (!when || typeof when !== "object") return "eq||\"\"";
  if ("op" in when && (when.op === "and" || when.op === "or" || when.op === "not")) {
    return `group:${when.op}:${JSON.stringify(when.items ?? [])}`;
  }
  if ("op" in when && when.op === "expr") {
    return `expr:${when.expr ?? ""}`;
  }
  const leaf = when as { op?: string; field?: string; value?: unknown };
  let valueKey = "";
  try {
    valueKey = JSON.stringify(leaf.value ?? "");
  } catch {
    valueKey = String(leaf.value ?? "");
  }
  return `${leaf.op ?? "eq"}|${leaf.field ?? ""}|${valueKey}`;
}

export type BooleanValueMapConflict = {
  /** Stable key for the conflicting condition */
  key: string;
  /** 1-based rule indexes involved */
  ruleIndexes: number[];
};

/**
 * Same condition mapped to both true and false → conflict.
 * Multiple rules mapping to the same side are fine.
 */
export function findBooleanValueMapConflicts(
  valueMap: TableValueMapRule[] | undefined
): BooleanValueMapConflict[] {
  if (!valueMap?.length) return [];
  const byKey = new Map<string, { trues: number[]; falses: number[] }>();
  valueMap.forEach((rule, index) => {
    const target = coerceBooleanMapTarget(rule.value);
    if (target == null) return;
    const key = whenConflictKey(rule.when);
    let bucket = byKey.get(key);
    if (!bucket) {
      bucket = { trues: [], falses: [] };
      byKey.set(key, bucket);
    }
    if (target) bucket.trues.push(index + 1);
    else bucket.falses.push(index + 1);
  });
  const conflicts: BooleanValueMapConflict[] = [];
  for (const [key, bucket] of byKey) {
    if (bucket.trues.length && bucket.falses.length) {
      conflicts.push({
        key,
        ruleIndexes: [...bucket.trues, ...bucket.falses].sort((a, b) => a - b),
      });
    }
  }
  return conflicts;
}
