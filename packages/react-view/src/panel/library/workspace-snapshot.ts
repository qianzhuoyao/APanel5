import { blueprintDocumentsEqual } from "@arronqzy/react-blueprint";
import type { BlueprintDocument, BlueprintMetaDraft } from "@arronqzy/react-blueprint";

export type WorkspaceSnapshot = {
  blueprintDocument: BlueprintDocument;
  blueprintMeta: BlueprintMetaDraft;
  productName: string;
  titleIconDataUrl: string;
};

function cloneBlueprintDocument(document: BlueprintDocument): BlueprintDocument {
  if (typeof structuredClone === "function") {
    try {
      return structuredClone(document);
    } catch {
      /* fall through */
    }
  }
  return JSON.parse(JSON.stringify(document)) as BlueprintDocument;
}

export function workspaceSnapshotsEqual(
  a: WorkspaceSnapshot,
  b: WorkspaceSnapshot
): boolean {
  if (a.productName !== b.productName) return false;
  if (a.titleIconDataUrl !== b.titleIconDataUrl) return false;
  if (a.blueprintMeta.name !== b.blueprintMeta.name) return false;
  if ((a.blueprintMeta.remark ?? "") !== (b.blueprintMeta.remark ?? "")) return false;
  if (!blueprintDocumentsEqual(a.blueprintDocument, b.blueprintDocument)) return false;
  return true;
}

export function cloneWorkspaceSnapshot(snapshot: WorkspaceSnapshot): WorkspaceSnapshot {
  return {
    blueprintDocument: cloneBlueprintDocument(snapshot.blueprintDocument),
    blueprintMeta: {
      name: snapshot.blueprintMeta.name,
      remark: snapshot.blueprintMeta.remark ?? "",
    },
    productName: snapshot.productName,
    titleIconDataUrl: snapshot.titleIconDataUrl,
  };
}
