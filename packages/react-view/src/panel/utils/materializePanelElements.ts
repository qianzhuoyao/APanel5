import type { PanelElement } from "../types";
import { isPanelElementNode } from "./panelElementNodes";
import type { Node } from "@arronqzy/rx-store";

/**
 * Shallow-compare all own keys. A fixed field allowlist previously omitted
 * text/audio/geometry fields and caused config edits to keep the old element
 * reference (form rebound / canvas ignored the change).
 */
function isSameMaterializedElement(
  prev: PanelElement,
  next: PanelElement
): boolean {
  if (prev === next) return true;
  const prevKeys = Object.keys(prev);
  const nextKeys = Object.keys(next);
  if (prevKeys.length !== nextKeys.length) return false;
  for (const key of nextKeys) {
    if (
      (prev as Record<string, unknown>)[key] !==
      (next as Record<string, unknown>)[key]
    ) {
      return false;
    }
  }
  return true;
}

/**
 * Preserve Immer structural sharing: unchanged nodes keep the same props
 * object reference so React.memo / Vue can skip re-rendering them.
 */
export function materializePanelElements(
  nodes: Node[] | undefined,
  previous?: readonly PanelElement[] | null
): PanelElement[] {
  const list = nodes ?? [];
  const prevById = previous?.length
    ? new Map(previous.map((el) => [el.id, el] as const))
    : null;
  const next: PanelElement[] = [];

  for (const n of list) {
    if (!isPanelElementNode(n) || !n.props) continue;
    const props = n.props as PanelElement;
    const normalized: PanelElement =
      typeof props.zIndex === "number" ? props : { ...props, zIndex: 1 };

    const prev = prevById?.get(normalized.id);
    if (prev && isSameMaterializedElement(prev, normalized)) {
      next.push(prev);
      continue;
    }
    next.push(normalized);
  }

  if (
    previous &&
    previous.length === next.length &&
    previous.every((el, i) => el === next[i])
  ) {
    return previous as PanelElement[];
  }
  return next;
}

/** Keep previous array identity when item references are unchanged (order-sensitive). */
export function stabilizeElementList(
  next: PanelElement[],
  previous?: readonly PanelElement[] | null
): PanelElement[] {
  if (
    previous &&
    previous.length === next.length &&
    previous.every((el, i) => el === next[i])
  ) {
    return previous as PanelElement[];
  }
  return next;
}
