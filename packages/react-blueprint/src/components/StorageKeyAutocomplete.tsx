import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@arronqzy/ui";
import { useI18n } from "@arronqzy/i18n/react";
import {
  filterStorageKeySuggestions,
  listBrowserStorageKeys,
  type StorageKind,
} from "@arronqzy/blueprint-dsl";

export type StorageKeyAutocompleteProps = {
  value: string;
  /** One or more storage targets whose keys should be suggested. */
  storages: StorageKind | readonly StorageKind[];
  placeholder?: string;
  onChange: (value: string) => void;
};

export function StorageKeyAutocomplete({
  value,
  storages,
  placeholder,
  onChange,
}: StorageKeyAutocompleteProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [keys, setKeys] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const storageSignature = useMemo(() => {
    const list = Array.isArray(storages) ? [...storages] : [storages];
    return list.join(",");
  }, [storages]);

  const refreshKeys = useCallback(() => {
    const list = Array.isArray(storages) ? storages : [storages];
    setKeys(listBrowserStorageKeys(list));
  }, [storages]);

  useEffect(() => {
    refreshKeys();
  }, [refreshKeys, storageSignature]);

  const filtered = useMemo(
    () => filterStorageKeySuggestions(keys, value),
    [keys, value]
  );

  useEffect(() => {
    setActiveIndex(0);
  }, [value, filtered.length]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as globalThis.Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const showSuggestions = open && keys.length > 0;

  const selectSuggestion = (index: number) => {
    const item = filtered[index];
    if (!item) return;
    onChange(item);
    setOpen(false);
  };

  const openDropdown = () => {
    refreshKeys();
    setOpen(true);
  };

  return (
    <div ref={containerRef} className="relative">
      <input
        value={value}
        placeholder={placeholder}
        spellCheck={false}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={openDropdown}
        onClick={openDropdown}
        onKeyDown={(e) => {
          if (!showSuggestions || filtered.length === 0) {
            if (e.key === "Escape") setOpen(false);
            return;
          }
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((prev) => Math.min(prev + 1, filtered.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((prev) => Math.max(prev - 1, 0));
          } else if (e.key === "Enter") {
            e.preventDefault();
            selectSuggestion(activeIndex);
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
        className={cn(
          "flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 font-mono text-[11px] text-foreground shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-primary"
        )}
      />
      {showSuggestions ? (
        <div className="absolute z-[10150] mt-1 max-h-52 w-full overflow-auto rounded-md border border-border bg-popover py-1 text-popover-foreground shadow-md">
          {filtered.length === 0 ? (
            <div className="px-2 py-1.5 text-[11px] text-muted-foreground">
              {t("blueprint.config.noMatchingStorageKey")}
            </div>
          ) : (
            filtered.map((key, index) => (
              <button
                key={key}
                type="button"
                className={cn(
                  "flex w-full items-center px-2 py-1.5 text-left font-mono text-[11px] hover:bg-accent",
                  index === activeIndex && "bg-accent"
                )}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectSuggestion(index)}
              >
                {key}
              </button>
            ))
          )}
        </div>
      ) : open && keys.length === 0 ? (
        <div className="absolute z-[10150] mt-1 w-full rounded-md border border-border bg-popover px-2 py-1.5 text-[11px] text-muted-foreground shadow-md">
          {t("blueprint.config.noStorageKeys")}
        </div>
      ) : null}
    </div>
  );
}
