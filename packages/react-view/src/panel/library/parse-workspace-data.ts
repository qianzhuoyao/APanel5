import {
  BlueprintGraph,
  parseBlueprintData,
  validateBlueprintData,
  type BlueprintDocument,
  type BlueprintMetaDraft,
  type ParseCheckResult,
} from "@arronqzy/react-blueprint";
import type { State } from "@arronqzy/rx-store";
import { createEmptyPanelState, normalizeImportedPanelState } from "../utils/panelStateIO";
import {
  createWorkspaceProjectId,
  type WorkspaceProjectRecord,
} from "./workspace-project-db";

export type { ParseCheckResult };

export type WorkspaceParseCheckResult = ParseCheckResult & {
  view: ParseCheckResult;
  blueprint: ParseCheckResult;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function extractPanelState(data: unknown): unknown {
  if (isRecord(data) && data.panelState !== undefined) return data.panelState;
  return data;
}

function readBlueprintMeta(raw: unknown): BlueprintMetaDraft {
  if (!isRecord(raw)) return { name: "", remark: "" };
  return {
    name: typeof raw.name === "string" ? raw.name : "",
    remark: typeof raw.remark === "string" ? raw.remark : "",
  };
}

/**
 * 校验数据能否被视图解析（工作区 `panelState` 或裸面板状态均可）。
 */
export function parseViewData(
  data: unknown
): ParseCheckResult & { value?: State } {
  if (data == null) {
    return { ok: false, error: "empty" };
  }
  const normalized = normalizeImportedPanelState(extractPanelState(data));
  if (!normalized) {
    return { ok: false, error: "invalid-view-data" };
  }
  return { ok: true, value: normalized };
}

export function validateViewData(data: unknown): ParseCheckResult {
  const parsed = parseViewData(data);
  return parsed.ok ? { ok: true } : { ok: false, error: parsed.error };
}

export { parseBlueprintData, validateBlueprintData };

/**
 * 构造一份可交给 `initialWorkspace` 的空工作区。
 */
export function createEmptyWorkspace(
  init?: Partial<WorkspaceProjectRecord>
): WorkspaceProjectRecord {
  const now = Date.now();
  return {
    id: init?.id || createWorkspaceProjectId(),
    name: init?.name ?? "",
    createdAt: init?.createdAt ?? now,
    updatedAt: init?.updatedAt ?? now,
    panelState: init?.panelState ?? createEmptyPanelState(),
    blueprintDocument: init?.blueprintDocument ?? BlueprintGraph.empty().document,
    blueprintMeta: init?.blueprintMeta ?? { name: "", remark: "" },
    productName: init?.productName ?? "",
    titleIconDataUrl: init?.titleIconDataUrl,
  };
}

/**
 * 校验完整工作区数据：视图 `panelState` 与蓝图 `blueprintDocument` 都要能解析。
 */
export function validateWorkspaceData(data: unknown): WorkspaceParseCheckResult {
  if (data == null) {
    const empty = { ok: false, error: "empty" } satisfies ParseCheckResult;
    return { ok: false, error: "empty", view: empty, blueprint: empty };
  }
  if (!isRecord(data)) {
    const invalid = { ok: false, error: "invalid-workspace-data" } satisfies ParseCheckResult;
    return {
      ok: false,
      error: "invalid-workspace-data",
      view: invalid,
      blueprint: invalid,
    };
  }
  const view = validateViewData(data);
  const blueprint = validateBlueprintData(data);
  const ok = view.ok && blueprint.ok;
  return {
    ok,
    error: ok ? undefined : "invalid-workspace-data",
    view,
    blueprint,
  };
}

/**
 * 解析并规范化工作区。成功时 `value` 可直接作为 `initialWorkspace`。
 */
export function parseWorkspaceData(
  data: unknown
): WorkspaceParseCheckResult & { value?: WorkspaceProjectRecord } {
  const check = validateWorkspaceData(data);
  if (!check.ok || !isRecord(data)) {
    return check;
  }
  const view = parseViewData(data);
  const blueprint = parseBlueprintData(data);
  if (!view.value || !blueprint.value) {
    return check;
  }
  const now = Date.now();
  return {
    ...check,
    value: {
      id: typeof data.id === "string" && data.id ? data.id : createWorkspaceProjectId(),
      name: typeof data.name === "string" ? data.name : "",
      createdAt: typeof data.createdAt === "number" ? data.createdAt : now,
      updatedAt: typeof data.updatedAt === "number" ? data.updatedAt : now,
      panelState: view.value,
      blueprintDocument: blueprint.value as BlueprintDocument,
      blueprintMeta: readBlueprintMeta(data.blueprintMeta),
      productName: typeof data.productName === "string" ? data.productName : "",
      titleIconDataUrl:
        typeof data.titleIconDataUrl === "string" ? data.titleIconDataUrl : undefined,
    },
  };
}
