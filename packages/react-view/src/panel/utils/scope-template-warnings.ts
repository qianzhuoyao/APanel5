import type { PanelElement } from "../types";
import { hasScopeTemplate } from "./scope-template";
import { resolveScopeFieldLabel } from "./scope-field-labels";

export type ScopeTemplateWarning = {
  fieldId: string;
  fieldLabel: string;
  template: string;
  expression: string;
  missingPath: string;
  message: string;
};

const SCOPE_PATH_RE = /scope(?:\?\.|\.)(\w+(?:\?\.\w+)*)/g;

const SKIP_FIELD_PREFIXES = new Set(["refSnapshot", "geometrySketchDataUrl"]);

function extractScopePropertyPaths(expression: string): string[] {
  const paths = new Set<string>();
  let match: RegExpExecArray | null;
  const re = new RegExp(SCOPE_PATH_RE.source, "g");
  while ((match = re.exec(expression)) !== null) {
    paths.add(match[1].replace(/\?\./g, "."));
  }
  return [...paths];
}

function pathExistsInScope(scope: unknown, path: string): boolean {
  if (scope === null || scope === undefined) return false;
  const parts = path.split(".").filter(Boolean);
  let current: unknown = scope;
  for (const part of parts) {
    if (current === null || typeof current !== "object" || Array.isArray(current)) {
      return false;
    }
    if (!Object.prototype.hasOwnProperty.call(current, part)) {
      return false;
    }
    current = (current as Record<string, unknown>)[part];
  }
  return true;
}

function analyzeTemplateValue(
  fieldId: string,
  value: string,
  scope: unknown
): ScopeTemplateWarning[] {
  if (!hasScopeTemplate(value)) return [];

  const warnings: ScopeTemplateWarning[] = [];
  const fieldLabel = resolveScopeFieldLabel(fieldId);
  const expressionRe = /\{([^}]+)\}/g;
  let match: RegExpExecArray | null;

  while ((match = expressionRe.exec(value)) !== null) {
    const expression = match[1].trim();
    const paths = extractScopePropertyPaths(expression);
    for (const path of paths) {
      if (pathExistsInScope(scope, path)) continue;
      warnings.push({
        fieldId,
        fieldLabel,
        template: value,
        expression,
        missingPath: path,
        message: `「${fieldLabel}」引用了 scope.${path}，但当前 scope 数据中并没有「${path}」字段，建议检查一下。`,
      });
    }
  }

  return warnings;
}

function shouldSkipField(fieldId: string): boolean {
  return [...SKIP_FIELD_PREFIXES].some((prefix) => fieldId.startsWith(prefix));
}

function walkElementStrings(
  value: unknown,
  fieldId: string,
  scope: unknown,
  warnings: ScopeTemplateWarning[]
) {
  if (shouldSkipField(fieldId)) return;

  if (typeof value === "string") {
    warnings.push(...analyzeTemplateValue(fieldId, value, scope));
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      walkElementStrings(item, `${fieldId}.${index}`, scope, warnings);
    });
    return;
  }

  if (value && typeof value === "object") {
    for (const [key, nested] of Object.entries(value)) {
      const nextId = fieldId ? `${fieldId}.${key}` : key;
      walkElementStrings(nested, nextId, scope, warnings);
    }
  }
}

export function collectElementScopeWarnings(
  element: PanelElement,
  scope: unknown
): ScopeTemplateWarning[] {
  if (scope === undefined) return [];

  const warnings: ScopeTemplateWarning[] = [];
  walkElementStrings(element, "", scope, warnings);

  const seen = new Set<string>();
  return warnings.filter((warning) => {
    const key = `${warning.fieldId}|${warning.missingPath}|${warning.expression}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function groupScopeWarningsByField(
  warnings: ScopeTemplateWarning[]
): Map<string, ScopeTemplateWarning[]> {
  const map = new Map<string, ScopeTemplateWarning[]>();
  for (const warning of warnings) {
    const list = map.get(warning.fieldId) ?? [];
    list.push(warning);
    map.set(warning.fieldId, list);
  }
  return map;
}
