import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  type ReactNode,
  type RefObject,
} from "react";

import type { ScopeTemplateWarning } from "../../utils/scope-template-warnings";
import { scopeFieldDomId } from "../../utils/scope-field-labels";
import { groupScopeWarningsByField } from "../../utils/scope-template-warnings";

type ScopeConfigContextValue = {
  warnings: ScopeTemplateWarning[];
  warningsByField: Map<string, ScopeTemplateWarning[]>;
  scrollToField: (fieldId: string) => void;
};

const ScopeConfigContext = createContext<ScopeConfigContextValue | null>(null);

const INLINE_HINT_ATTR = "data-scope-inline-hint";

function findFieldAnchor(
  container: HTMLElement,
  fieldId: string,
  fieldWarnings: ScopeTemplateWarning[]
): HTMLElement | null {
  const existing = document.getElementById(scopeFieldDomId(fieldId));
  if (existing) return existing;

  const inputs = container.querySelectorAll("input, textarea");
  for (const input of inputs) {
    if (
      !(input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement)
    ) {
      continue;
    }
    const matched = fieldWarnings.some(
      (warning) =>
        input.value === warning.template ||
        input.value.includes(warning.expression)
    );
    if (!matched) continue;
    const host = input.closest("label") ?? input.parentElement;
    if (host instanceof HTMLElement) {
      host.id = scopeFieldDomId(fieldId);
      return host;
    }
  }

  return null;
}

function attachInlineHints(
  container: HTMLElement,
  warningsByField: Map<string, ScopeTemplateWarning[]>
) {
  container
    .querySelectorAll(`[${INLINE_HINT_ATTR}]`)
    .forEach((node) => node.remove());

  for (const [fieldId, fieldWarnings] of warningsByField) {
    const anchor = findFieldAnchor(container, fieldId, fieldWarnings);
    if (!anchor || anchor.querySelector(`[${INLINE_HINT_ATTR}]`)) continue;

    const hint = document.createElement("div");
    hint.setAttribute(INLINE_HINT_ATTR, "1");
    hint.className = "space-y-0.5";
    for (const warning of fieldWarnings) {
      const line = document.createElement("p");
      line.className =
        "text-[10px] leading-relaxed text-amber-700 dark:text-amber-300";
      line.textContent = warning.message;
      hint.appendChild(line);
    }
    anchor.appendChild(hint);
  }
}

export function ScopeConfigProvider({
  warnings,
  scrollContainerRef,
  children,
}: {
  warnings: ScopeTemplateWarning[];
  scrollContainerRef?: RefObject<HTMLElement | null>;
  children: ReactNode;
}) {
  const warningsByField = useMemo(
    () => groupScopeWarningsByField(warnings),
    [warnings]
  );

  const scrollToField = useCallback(
    (fieldId: string) => {
      const container = scrollContainerRef?.current;
      const fieldWarnings = warningsByField.get(fieldId);
      if (container && fieldWarnings?.length) {
        findFieldAnchor(container, fieldId, fieldWarnings);
      }

      const target = document.getElementById(scopeFieldDomId(fieldId));
      if (!target) return;

      if (container && container.contains(target)) {
        const containerRect = container.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const offset =
          targetRect.top -
          containerRect.top +
          container.scrollTop -
          container.clientHeight / 2 +
          targetRect.height / 2;
        container.scrollTo({ top: Math.max(0, offset), behavior: "smooth" });
      } else {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      target.classList.add("scope-field--highlight");
      window.setTimeout(() => {
        target.classList.remove("scope-field--highlight");
      }, 1600);
    },
    [scrollContainerRef, warningsByField]
  );

  useLayoutEffect(() => {
    const container = scrollContainerRef?.current;
    if (!container || warnings.length === 0) {
      return () => undefined;
    }

    attachInlineHints(container, warningsByField);
    return () => {
      container
        .querySelectorAll(`[${INLINE_HINT_ATTR}]`)
        .forEach((node) => node.remove());
    };
  }, [scrollContainerRef, warnings, warningsByField]);

  const value = useMemo(
    () => ({ warnings, warningsByField, scrollToField }),
    [warnings, warningsByField, scrollToField]
  );

  return (
    <ScopeConfigContext.Provider value={value}>{children}</ScopeConfigContext.Provider>
  );
}

export function useScopeConfig() {
  return useContext(ScopeConfigContext);
}

export function useScopeFieldWarnings(fieldId: string) {
  const ctx = useScopeConfig();
  return ctx?.warningsByField.get(fieldId) ?? [];
}
