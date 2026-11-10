import { isWholeScopeExpression } from "./incoming-node-scope.js";
import {
  evaluateScopeExpression,
  evaluateScopeTemplate,
  hasScopeTemplate,
} from "./scope-template.js";

export type BranchNodeConfig = {
  /**
   * 条件表达式。支持：
   * - `{scope...}` / `{system...}` 整段表达式
   * - 含 `{scope...}` 的字符串模板
   * - 以 scope / system 为根的 JS 表达式（如 `scope?.value?.ok`）
   */
  expression: string;
};

export const DEFAULT_BRANCH_NODE_CONFIG: BranchNodeConfig = {
  expression: "",
};

export function normalizeBranchConfig(
  config?: Partial<BranchNodeConfig> | null
): BranchNodeConfig {
  return {
    expression: typeof config?.expression === "string" ? config.expression : "",
  };
}

/** 求值条件：结果按 JS truthy 判定。 */
export function evaluateBranchCondition(
  expression: string,
  scope: unknown
): boolean {
  const raw = expression ?? "";
  const trimmed = raw.trim();
  if (!trimmed) return false;

  let value: unknown;
  if (isWholeScopeExpression(trimmed)) {
    value = evaluateScopeExpression(trimmed.slice(1, -1), scope);
  } else if (hasScopeTemplate(raw)) {
    value = evaluateScopeTemplate(raw, scope);
  } else {
    value = evaluateScopeExpression(trimmed, scope);
  }

  return Boolean(value);
}
