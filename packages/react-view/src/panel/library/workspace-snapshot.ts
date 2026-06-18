import { blueprintDocumentsEqual } from "@arronqzy/react-blueprint";
import type { BlueprintDocument, BlueprintMetaDraft } from "@arronqzy/react-blueprint";
import type { State } from "@arronqzy/rx-store";

export type WorkspaceSnapshot = {
  panelState: State;
  blueprintDocument: BlueprintDocument;
  blueprintMeta: BlueprintMetaDraft;
  productName: string;
  titleIconDataUrl: string;
};

export function workspaceSnapshotsEqual(
  a: WorkspaceSnapshot,
  b: WorkspaceSnapshot
): boolean {
  if (a.productName !== b.productName) return false;
  if (a.titleIconDataUrl !== b.titleIconDataUrl) return false;
  if (a.blueprintMeta.name !== b.blueprintMeta.name) return false;
  if ((a.blueprintMeta.remark ?? "") !== (b.blueprintMeta.remark ?? "")) return false;
  if (!blueprintDocumentsEqual(a.blueprintDocument, b.blueprintDocument)) return false;
  return JSON.stringify(a.panelState) === JSON.stringify(b.panelState);
}

export function cloneWorkspaceSnapshot(snapshot: WorkspaceSnapshot): WorkspaceSnapshot {
  return JSON.parse(JSON.stringify(snapshot)) as WorkspaceSnapshot;
}
