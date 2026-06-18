import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";

import type { PanelElement } from "../../types";
import { hasScopeTemplate } from "../../utils/scope-template";
import {
  collectElementScopeTemplateFields,
  formatScopeTemplatePreview,
  matchScopeTemplateFieldId,
  resolveScopeTemplatePreview,
} from "../../utils/scope-template-preview";

const PREVIEW_SLOT_ATTR = "data-scope-preview-slot";
const PREVIEW_KEY_ATTR = "data-scope-preview-key";

type PreviewAnchor = {
  key: string;
  template: string;
  fieldId?: string;
  slot: HTMLElement;
};

function isPreviewTarget(
  node: Element
): node is HTMLInputElement | HTMLTextAreaElement {
  if (node instanceof HTMLTextAreaElement) {
    return node.dataset.scopeAutocomplete !== "off";
  }
  if (node instanceof HTMLInputElement) {
    if (node.dataset.scopeAutocomplete === "off") return false;
    const type = node.type;
    return (
      !type ||
      type === "text" ||
      type === "search" ||
      type === "url" ||
      type === "password"
    );
  }
  return false;
}

function ensurePreviewKey(
  input: HTMLInputElement | HTMLTextAreaElement,
  keySeed: string
): string {
  const existing = input.getAttribute(PREVIEW_KEY_ATTR);
  if (existing) return existing;
  const key = `${keySeed}-${Math.random().toString(36).slice(2, 9)}`;
  input.setAttribute(PREVIEW_KEY_ATTR, key);
  return key;
}

function ensurePreviewSlot(
  input: HTMLInputElement | HTMLTextAreaElement
): HTMLElement {
  const host = input.closest("label") ?? input.parentElement;
  if (!host) return input;

  const existing = host.querySelector(`[${PREVIEW_SLOT_ATTR}]`);
  if (existing instanceof HTMLElement) return existing;

  const slot = document.createElement("div");
  slot.setAttribute(PREVIEW_SLOT_ATTR, "1");
  input.insertAdjacentElement("afterend", slot);
  return slot;
}

function removeOrphanPreviewSlots(container: HTMLElement) {
  container.querySelectorAll(`[${PREVIEW_SLOT_ATTR}]`).forEach((slot) => {
    const host = slot.parentElement;
    const input = host?.querySelector("input, textarea");
    if (
      !input ||
      !(input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) ||
      !hasScopeTemplate(input.value)
    ) {
      slot.remove();
    }
  });
}

function inferFieldIdFromDom(
  input: HTMLInputElement | HTMLTextAreaElement
): string | undefined {
  const label = input.closest("label");
  const labelText = label?.textContent ?? "";
  if (labelText.includes("类目")) return "chart.labelsText";
  if (labelText.includes("数值")) return "chart.valuesText";
  return undefined;
}

function ScopeTemplatePreviewPanel({
  template,
  scope,
  fieldId,
}: {
  template: string;
  scope: unknown;
  fieldId?: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const previewValue = resolveScopeTemplatePreview(template, scope, fieldId);
  const previewText = formatScopeTemplatePreview(previewValue);
  const previewType = Array.isArray(previewValue)
    ? `数组 · ${previewValue.length} 项`
    : typeof previewValue;

  return (
    <div className="mt-1 rounded border border-border/60 bg-muted/30">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-2 py-1 text-left text-[10px] text-muted-foreground hover:bg-accent/40"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <span className="font-medium text-foreground/80">解析预览</span>
        <span className="shrink-0 text-[10px]">
          {previewType} · {isExpanded ? "收起" : "展开"}
        </span>
      </button>
      {isExpanded ? (
        <pre className="max-h-28 overflow-auto border-t border-border/50 px-2 py-1.5 font-mono text-[10px] leading-relaxed text-foreground/90 whitespace-pre-wrap break-all">
          {previewText}
        </pre>
      ) : null}
    </div>
  );
}

export function ScopeTemplatePreviewHost({
  scope,
  element,
  containerRef,
}: {
  scope: unknown;
  element: PanelElement | null;
  containerRef?: RefObject<HTMLElement | null>;
}) {
  const keySeed = useId();
  const [anchors, setAnchors] = useState<PreviewAnchor[]>([]);

  const templateFields = useMemo(
    () => (element ? collectElementScopeTemplateFields(element) : []),
    [element]
  );

  const scanAnchors = useCallback(() => {
    const container = containerRef?.current;
    if (!container || scope === undefined) {
      setAnchors((prev) => (prev.length === 0 ? prev : []));
      return;
    }

    const next: PreviewAnchor[] = [];
    const inputs = container.querySelectorAll("input, textarea");
    for (const node of inputs) {
      if (!isPreviewTarget(node)) continue;
      const template = node.value;
      if (!hasScopeTemplate(template)) continue;

      const fieldId =
        matchScopeTemplateFieldId(template, templateFields) ??
        inferFieldIdFromDom(node);
      next.push({
        key: ensurePreviewKey(node, keySeed),
        template,
        fieldId,
        slot: ensurePreviewSlot(node),
      });
    }

    removeOrphanPreviewSlots(container);
    setAnchors((prev) => {
      if (
        prev.length === next.length &&
        prev.every(
          (item, index) =>
            item.key === next[index]?.key &&
            item.template === next[index]?.template &&
            item.fieldId === next[index]?.fieldId
        )
      ) {
        return prev;
      }
      return next;
    });
  }, [containerRef, keySeed, scope, templateFields]);

  useEffect(() => {
    scanAnchors();
  }, [scanAnchors, element, scope]);

  useEffect(() => {
    const container = containerRef?.current;
    if (!container || scope === undefined) return;

    const onInput = () => {
      window.requestAnimationFrame(scanAnchors);
    };

    container.addEventListener("input", onInput, true);
    const observer = new MutationObserver(onInput);
    observer.observe(container, { childList: true, subtree: true });

    return () => {
      container.removeEventListener("input", onInput, true);
      observer.disconnect();
      container
        .querySelectorAll(`[${PREVIEW_SLOT_ATTR}]`)
        .forEach((node) => node.remove());
    };
  }, [containerRef, scanAnchors, scope]);

  if (scope === undefined || anchors.length === 0) return null;

  return (
    <>
      {anchors.map((anchor) =>
        createPortal(
          <ScopeTemplatePreviewPanel
            key={anchor.key}
            template={anchor.template}
            scope={scope}
            fieldId={anchor.fieldId}
          />,
          anchor.slot
        )
      )}
    </>
  );
}
