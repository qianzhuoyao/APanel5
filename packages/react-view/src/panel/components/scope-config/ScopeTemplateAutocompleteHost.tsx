import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@arronqzy/ui";

import {
  applyScopeAutocompleteSelection,
  buildScopeExpression,
  getScopeAutocompleteSuggestions,
  parseScopeAutocomplete,
  type ScopeAutocompleteState,
} from "../../utils/scope-autocomplete";

function isAutocompleteTarget(
  target: EventTarget | null
): target is HTMLInputElement | HTMLTextAreaElement {
  if (target instanceof HTMLTextAreaElement) {
    return target.dataset.scopeAutocomplete !== "off";
  }
  if (target instanceof HTMLInputElement) {
    if (target.dataset.scopeAutocomplete === "off") return false;
    const type = target.type;
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

function setNativeInputValue(
  element: HTMLInputElement | HTMLTextAreaElement,
  value: string
) {
  const proto =
    element instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype;
  const descriptor = Object.getOwnPropertyDescriptor(proto, "value");
  descriptor?.set?.call(element, value);
  element.dispatchEvent(new Event("input", { bubbles: true }));
}

type DropdownState = {
  input: HTMLInputElement | HTMLTextAreaElement;
  state: ScopeAutocompleteState;
  suggestions: string[];
  activeIndex: number;
  rect: DOMRect;
};

export function ScopeTemplateAutocompleteHost({
  scope,
  containerRef,
}: {
  scope: unknown;
  containerRef?: RefObject<HTMLElement | null>;
}) {
  const [dropdown, setDropdown] = useState<DropdownState | null>(null);
  const dropdownRef = useRef<DropdownState | null>(null);
  dropdownRef.current = dropdown;

  const closeDropdown = useCallback(() => {
    setDropdown(null);
  }, []);

  const refreshForInput = useCallback(
    (input: HTMLInputElement | HTMLTextAreaElement) => {
      if (scope === undefined) {
        closeDropdown();
        return;
      }
      const cursor = input.selectionStart ?? input.value.length;
      const parsed = parseScopeAutocomplete(input.value, cursor, scope);
      if (!parsed) {
        closeDropdown();
        return;
      }
      const suggestions = getScopeAutocompleteSuggestions(scope, parsed);
      if (suggestions.length === 0) {
        closeDropdown();
        return;
      }
      setDropdown({
        input,
        state: parsed,
        suggestions,
        activeIndex: 0,
        rect: input.getBoundingClientRect(),
      });
    },
    [closeDropdown, scope]
  );

  const applySuggestion = useCallback(
    (index: number) => {
      const current = dropdownRef.current;
      if (!current) return;
      const selected = current.suggestions[index];
      if (!selected) return;

      const { value, cursor } = applyScopeAutocompleteSelection(
        current.input.value,
        current.state,
        selected
      );
      setNativeInputValue(current.input, value);
      current.input.focus();
      current.input.setSelectionRange(cursor, cursor);
      closeDropdown();
      window.requestAnimationFrame(() => {
        refreshForInput(current.input);
      });
    },
    [closeDropdown, refreshForInput]
  );

  useEffect(() => {
    const container = containerRef?.current;
    if (!container || scope === undefined) return;

    const onFocusIn = (event: FocusEvent) => {
      if (!isAutocompleteTarget(event.target)) return;
      refreshForInput(event.target);
    };

    const onInput = (event: Event) => {
      if (!isAutocompleteTarget(event.target)) return;
      refreshForInput(event.target);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const current = dropdownRef.current;
      if (!current || event.target !== current.input) return;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setDropdown((prev) =>
          prev
            ? {
                ...prev,
                activeIndex: Math.min(
                  prev.activeIndex + 1,
                  prev.suggestions.length - 1
                ),
              }
            : prev
        );
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setDropdown((prev) =>
          prev
            ? { ...prev, activeIndex: Math.max(prev.activeIndex - 1, 0) }
            : prev
        );
        return;
      }
      if (event.key === "Enter" || event.key === "Tab") {
        if (current.suggestions.length > 0) {
          event.preventDefault();
          applySuggestion(current.activeIndex);
        }
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        closeDropdown();
      }
    };

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (
        dropdownRef.current?.input.contains(target ?? null) ||
        (target instanceof Element && target.closest("[data-scope-ac-list]"))
      ) {
        return;
      }
      if (!container.contains(target)) {
        closeDropdown();
      }
    };

    container.addEventListener("focusin", onFocusIn);
    container.addEventListener("input", onInput, true);
    container.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("scroll", closeDropdown, true);
    window.addEventListener("resize", closeDropdown);

    return () => {
      container.removeEventListener("focusin", onFocusIn);
      container.removeEventListener("input", onInput, true);
      container.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("scroll", closeDropdown, true);
      window.removeEventListener("resize", closeDropdown);
    };
  }, [
    applySuggestion,
    closeDropdown,
    containerRef,
    refreshForInput,
    scope,
  ]);

  if (!dropdown || scope === undefined) return null;

  return createPortal(
    <div
      data-scope-ac-list
      className="fixed z-[10120] max-h-44 min-w-[140px] overflow-auto rounded-md border border-border bg-popover py-1 text-popover-foreground shadow-md"
      style={{
        left: dropdown.rect.left,
        top: dropdown.rect.bottom + 4,
        width: Math.max(dropdown.rect.width, 160),
      }}
    >
      {dropdown.suggestions.map((key, index) => {
        const preview = buildScopeExpression(dropdown.state.path, key);
        return (
          <button
            key={key}
            type="button"
            className={cn(
              "flex w-full flex-col items-start gap-0.5 px-2 py-1.5 text-left text-[11px] hover:bg-accent",
              index === dropdown.activeIndex && "bg-accent"
            )}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => applySuggestion(index)}
          >
            <span className="font-medium text-foreground">{key}</span>
            <span className="font-mono text-[10px] text-muted-foreground">{`{${preview}}`}</span>
          </button>
        );
      })}
    </div>,
    document.body
  );
}
