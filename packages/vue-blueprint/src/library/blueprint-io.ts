import type { BlueprintDocument } from "../graph/document";
import { createNodeId } from "../graph/document";
import {
  BLUEPRINT_EXPORT_KIND,
  BLUEPRINT_EXPORT_VERSION,
  type BlueprintExportPayload,
  type BlueprintLibraryRecord,
  type BlueprintLibrarySource,
  type BlueprintMetaDraft,
} from "./types";
import { resolveLocale, tForLocale } from "@arronqzy/i18n";

function unnamedBlueprintName() {
  return tForLocale(resolveLocale())("blueprint.dialog.unnamedBlueprint");
}

function importedBlueprintName() {
  return tForLocale(resolveLocale())("blueprint.dialog.importedBlueprint");
}

export function createLibraryBlueprintId() {
  return createNodeId("lib_bp");
}

export function blueprintDocumentsEqual(
  a: BlueprintDocument,
  b: BlueprintDocument
): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function buildBlueprintExportPayload(
  document: BlueprintDocument,
  meta: BlueprintMetaDraft
): BlueprintExportPayload {
  return {
    kind: BLUEPRINT_EXPORT_KIND,
    version: BLUEPRINT_EXPORT_VERSION,
    name: meta.name.trim() || unnamedBlueprintName(),
    remark: meta.remark.trim() || undefined,
    exportedAt: Date.now(),
    document: {
      ...document,
      name: meta.name.trim() || document.name,
    },
  };
}

export function parseBlueprintImportFile(raw: unknown): BlueprintExportPayload {
  if (!raw || typeof raw !== "object") {
    throw new Error("invalid-format");
  }
  const data = raw as Partial<BlueprintExportPayload>;
  if (data.kind !== BLUEPRINT_EXPORT_KIND || data.version !== BLUEPRINT_EXPORT_VERSION) {
    throw new Error("unsupported-version");
  }
  if (!data.document || !Array.isArray(data.document.nodes) || !Array.isArray(data.document.edges)) {
    throw new Error("invalid-document");
  }
  return {
    kind: BLUEPRINT_EXPORT_KIND,
    version: BLUEPRINT_EXPORT_VERSION,
    name: typeof data.name === "string" ? data.name : importedBlueprintName(),
    remark: typeof data.remark === "string" ? data.remark : undefined,
    exportedAt: typeof data.exportedAt === "number" ? data.exportedAt : Date.now(),
    document: data.document,
  };
}

export function downloadBlueprintExport(payload: BlueprintExportPayload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  const safeName = payload.name
    .replace(/[\\/:*?"<>|]/g, "-")
    .replace(/\s+/g, "-");
  anchor.download = `${safeName || "blueprint"}-${Date.now()}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function buildLibraryRecord(args: {
  document: BlueprintDocument;
  meta: BlueprintMetaDraft;
  source: BlueprintLibrarySource;
  id?: string;
  createdAt?: number;
}): BlueprintLibraryRecord {
  const now = Date.now();
  const name = args.meta.name.trim() || unnamedBlueprintName();
  return {
    id: args.id ?? createLibraryBlueprintId(),
    name,
    remark: args.meta.remark.trim() || undefined,
    source: args.source,
    createdAt: args.createdAt ?? now,
    updatedAt: now,
    document: {
      ...args.document,
      name,
    },
  };
}

export function libraryRecordFromImport(payload: BlueprintExportPayload): BlueprintLibraryRecord {
  return buildLibraryRecord({
    document: payload.document,
    meta: {
      name: payload.name,
      remark: payload.remark ?? "",
    },
    source: "imported",
  });
}
