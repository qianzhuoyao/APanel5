import type { BlueprintDocument } from "../graph/document";

export type BlueprintLibrarySource = "saved" | "imported";

export type BlueprintLibraryRecord = {
  id: string;
  name: string;
  remark?: string;
  source: BlueprintLibrarySource;
  createdAt: number;
  updatedAt: number;
  document: BlueprintDocument;
};

export type BlueprintLibraryListItem = Pick<
  BlueprintLibraryRecord,
  "id" | "name" | "remark" | "source" | "updatedAt"
>;

export const BLUEPRINT_EXPORT_KIND = "arron-blueprint" as const;
export const BLUEPRINT_EXPORT_VERSION = 1 as const;

export type BlueprintExportPayload = {
  kind: typeof BLUEPRINT_EXPORT_KIND;
  version: typeof BLUEPRINT_EXPORT_VERSION;
  name: string;
  remark?: string;
  exportedAt: number;
  document: BlueprintDocument;
};

export type BlueprintMetaDraft = {
  name: string;
  remark: string;
};
