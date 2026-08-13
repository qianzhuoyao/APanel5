import type { TranslateFn } from "@arronqzy/i18n";
import { tForLocale } from "@arronqzy/i18n";
import type { PanelElement } from "../types";
import { hasScopeTemplate } from "./scope-template";
import { resolveScopeFieldLabel } from "./scope-field-labels";
import {
  SCOPE_SPREAD_TEMPLATE_RE,
  buildSpreadInvalidExpressionWarningMessage,
  buildSpreadNotArrayWarningMessage,
  formatScopePathSegments,
  isSpreadTemplateBrace,
  parseScopePathSegments,
  resolveSpreadScopePath,
} from "./scope-template-spread";

export type ScopeTemplateWarningKind =
  | "missing-path"
  | "spread-not-array"
  | "spread-invalid-expression";

export type ScopeTemplateWarning = {
  fieldId: string;
  fieldLabel: string;
  template: string;
  expression: string;
  missingPath: string;
  message: string;
  kind: ScopeTemplateWarningKind;
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

function analyzeSpreadTemplateValue(
  fieldId: string,
  value: string,
  scope: unknown,
  t: TranslateFn
): ScopeTemplateWarning[] {
  const warnings: ScopeTemplateWarning[] = [];
  const fieldLabel = resolveScopeFieldLabel(fieldId, t);
  const spreadRe = new RegExp(SCOPE_SPREAD_TEMPLATE_RE.source, "g");
  let match: RegExpExecArray | null;

  while ((match = spreadRe.exec(value)) !== null) {
    const spreadTemplate = match[0];
    const expression = match[1].trim();
    const segments = parseScopePathSegments(expression);

    if (segments === null || segments.length === 0) {
      warnings.push({
        fieldId,
        fieldLabel,
        template: value,
        expression,
        missingPath: "",
        kind: "spread-invalid-expression",
        message: buildSpreadInvalidExpressionWarningMessage(fieldLabel, spreadTemplate, t),
      });
      continue;
    }

    const resolved = resolveSpreadScopePath(expression, scope);
    if (resolved.ok) continue;

    if (resolved.issue === "invalid-expression") {
      warnings.push({
        fieldId,
        fieldLabel,
        template: value,
        expression,
        missingPath: "",
        kind: "spread-invalid-expression",
        message: buildSpreadInvalidExpressionWarningMessage(fieldLabel, spreadTemplate, t),
      });
      continue;
    }

    const arrayPath =
      resolved.arrayPath ?? formatScopePathSegments(segments.slice(0, -1));

    if (resolved.issue === "path-missing") {
      if (!pathExistsInScope(scope, arrayPath)) {
        warnings.push({
          fieldId,
          fieldLabel,
          template: value,
          expression,
          missingPath: arrayPath,
          kind: "missing-path",
          message: t("panel.scope.warnMissingPath", { fieldLabel, path: arrayPath }),
        });
      }
      continue;
    }

    if (resolved.issue === "not-array") {
      warnings.push({
        fieldId,
        fieldLabel,
        template: value,
        expression,
        missingPath: arrayPath,
        kind: "spread-not-array",
        message: buildSpreadNotArrayWarningMessage(
          fieldLabel,
          spreadTemplate,
          expression,
          arrayPath,
          t
        ),
      });
    }
  }

  return warnings;
}

function analyzeTemplateValue(
  fieldId: string,
  value: string,
  scope: unknown,
  t: TranslateFn
): ScopeTemplateWarning[] {
  if (!hasScopeTemplate(value)) return [];

  const warnings: ScopeTemplateWarning[] = [
    ...analyzeSpreadTemplateValue(fieldId, value, scope, t),
  ];
  const fieldLabel = resolveScopeFieldLabel(fieldId, t);
  const expressionRe = /\{([^}]+)\}/g;
  let match: RegExpExecArray | null;

  while ((match = expressionRe.exec(value)) !== null) {
    if (isSpreadTemplateBrace(value, match.index)) continue;
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
        kind: "missing-path",
        message: t("panel.scope.warnMissingPath", { fieldLabel, path }),
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
  warnings: ScopeTemplateWarning[],
  t: TranslateFn
) {
  if (shouldSkipField(fieldId)) return;

  if (typeof value === "string") {
    warnings.push(...analyzeTemplateValue(fieldId, value, scope, t));
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      walkElementStrings(item, `${fieldId}.${index}`, scope, warnings, t);
    });
    return;
  }

  if (value && typeof value === "object") {
    for (const [key, nested] of Object.entries(value)) {
      const nextId = fieldId ? `${fieldId}.${key}` : key;
      walkElementStrings(nested, nextId, scope, warnings, t);
    }
  }
}

export function collectElementScopeWarnings(
  element: PanelElement,
  scope: unknown,
  t: TranslateFn = tForLocale("zh-CN")
): ScopeTemplateWarning[] {
  if (scope === undefined) return [];

  const warnings: ScopeTemplateWarning[] = [];
  walkElementStrings(element, "", scope, warnings, t);

  const seen = new Set<string>();
  return warnings.filter((warning) => {
    const key = `${warning.fieldId}|${warning.kind}|${warning.missingPath}|${warning.expression}`;
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
