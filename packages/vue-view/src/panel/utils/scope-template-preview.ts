import type { PanelElement } from "../types";
import {
  materializeChartLabelsText,
  materializeChartValuesText,
} from "./scope-template-chart";
import { hasScopeTemplate, evaluateScopeTemplate } from "./scope-template";
import { SCOPE_SPREAD_TEMPLATE_RE } from "./scope-template-spread";
import { resolveScopeFieldLabel } from "./scope-field-labels";

export type ScopeTemplateField = {
  fieldId: string;
  fieldLabel: string;
  template: string;
};

const SKIP_FIELD_PREFIXES = new Set(["refSnapshot", "geometrySketchDataUrl"]);

function shouldSkipField(fieldId: string): boolean {
  return [...SKIP_FIELD_PREFIXES].some((prefix) => fieldId.startsWith(prefix));
}

function walkElementTemplateFields(
  value: unknown,
  fieldId: string,
  results: ScopeTemplateField[]
) {
  if (shouldSkipField(fieldId)) return;

  if (typeof value === "string") {
    if (!hasScopeTemplate(value)) return;
    results.push({
      fieldId,
      fieldLabel: resolveScopeFieldLabel(fieldId),
      template: value,
    });
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      walkElementTemplateFields(item, `${fieldId}.${index}`, results);
    });
    return;
  }

  if (value && typeof value === "object") {
    for (const [key, nested] of Object.entries(value)) {
      const nextId = fieldId ? `${fieldId}.${key}` : key;
      walkElementTemplateFields(nested, nextId, results);
    }
  }
}

export function collectElementScopeTemplateFields(
  element: PanelElement
): ScopeTemplateField[] {
  const results: ScopeTemplateField[] = [];
  walkElementTemplateFields(element, "", results);
  return results;
}

export function matchScopeTemplateFieldId(
  template: string,
  fields: ScopeTemplateField[]
): string | undefined {
  const exact = fields.find((field) => field.template === template);
  if (exact) return exact.fieldId;

  if (!hasScopeTemplate(template)) return undefined;

  const partial = fields.filter(
    (field) =>
      field.template.includes(template) || template.includes(field.template)
  );
  if (partial.length === 1) return partial[0].fieldId;
  return undefined;
}

export function resolveScopeTemplatePreview(
  template: string,
  scope: unknown,
  fieldId?: string
): unknown {
  if (!hasScopeTemplate(template)) return template;
  if (scope === undefined) return undefined;

  const leafFieldId = fieldId?.split(".").pop();

  if (
    fieldId === "chart.labelsText" ||
    leafFieldId === "labelsText"
  ) {
    return materializeChartLabelsText(template, scope);
  }

  if (
    fieldId === "chart.valuesText" ||
    leafFieldId === "valuesText"
  ) {
    return materializeChartValuesText(template, scope);
  }

  if (SCOPE_SPREAD_TEMPLATE_RE.test(template)) {
    return materializeChartLabelsText(template, scope);
  }

  const evaluated = evaluateScopeTemplate(template, scope);
  try {
    return JSON.parse(evaluated);
  } catch {
    return evaluated;
  }
}

export function formatScopeTemplatePreview(value: unknown): string {
  if (value === undefined) return "undefined";
  if (value === null) return "null";
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}
