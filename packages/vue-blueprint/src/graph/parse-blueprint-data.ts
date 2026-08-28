import {
  sanitizeBlueprintDocument,
  type BlueprintDocument,
  type BlueprintGraphEdge,
  type BlueprintGraphNode,
  type BlueprintNodeRole,
} from "./document";

export type ParseCheckResult = {
  ok: boolean;
  error?: string;
};

const NODE_ROLES = new Set<BlueprintNodeRole>([
  "blueprint",
  "logic",
  "and",
  "lifecycle",
  "fetch",
  "json",
  "storage",
  "clock",
  "event",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function extractBlueprintDocument(data: unknown): unknown {
  if (!isRecord(data)) return data;
  if (isRecord(data.blueprintDocument)) return data.blueprintDocument;
  if (isRecord(data.document) && Array.isArray(data.document.nodes)) {
    return data.document;
  }
  return data;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isBlueprintNode(value: unknown): value is BlueprintGraphNode {
  if (!isRecord(value)) return false;
  if (typeof value.id !== "string" || !value.id) return false;
  if (typeof value.role !== "string" || !NODE_ROLES.has(value.role as BlueprintNodeRole)) {
    return false;
  }
  if (!isRecord(value.position) || !isFiniteNumber(value.position.x) || !isFiniteNumber(value.position.y)) {
    return false;
  }
  return true;
}

function isBlueprintEdge(value: unknown): value is BlueprintGraphEdge {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    value.id.length > 0 &&
    typeof value.source === "string" &&
    value.source.length > 0 &&
    typeof value.target === "string" &&
    value.target.length > 0
  );
}

/**
 * 校验数据能否被蓝图解析（工作区 `blueprintDocument`、蓝图导出 JSON 或裸文档均可）。
 */
export function parseBlueprintData(
  data: unknown
): ParseCheckResult & { value?: BlueprintDocument } {
  if (data == null) {
    return { ok: false, error: "empty" };
  }
  const raw = extractBlueprintDocument(data);
  if (!isRecord(raw)) {
    return { ok: false, error: "invalid-blueprint-data" };
  }
  if (!Array.isArray(raw.nodes) || !Array.isArray(raw.edges)) {
    return { ok: false, error: "invalid-blueprint-data" };
  }
  if (!raw.nodes.every(isBlueprintNode) || !raw.edges.every(isBlueprintEdge)) {
    return { ok: false, error: "invalid-blueprint-data" };
  }
  try {
    const value = sanitizeBlueprintDocument({
      id: typeof raw.id === "string" && raw.id ? raw.id : "default",
      name: typeof raw.name === "string" ? raw.name : undefined,
      nodes: raw.nodes as BlueprintGraphNode[],
      edges: raw.edges as BlueprintGraphEdge[],
      allowFalseSignalPropagation:
        typeof raw.allowFalseSignalPropagation === "boolean"
          ? raw.allowFalseSignalPropagation
          : undefined,
    });
    return { ok: true, value };
  } catch {
    return { ok: false, error: "invalid-blueprint-data" };
  }
}

export function validateBlueprintData(data: unknown): ParseCheckResult {
  const parsed = parseBlueprintData(data);
  return parsed.ok ? { ok: true } : { ok: false, error: parsed.error };
}
