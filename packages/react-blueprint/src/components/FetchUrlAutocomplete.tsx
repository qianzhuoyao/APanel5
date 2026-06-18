import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@arronqzy/ui";
import {
  buildEndpointSuggestions,
  filterEndpointSuggestions,
  resolveFetchRequestUrl,
  type FetchHttpMethod,
  type SwaggerApiEndpoint,
} from "@arronqzy/blueprint-dsl";

export type FetchUrlAutocompleteProps = {
  value: string;
  apiBaseUrl: string;
  endpoints: SwaggerApiEndpoint[];
  placeholder?: string;
  /** 为 true 时仅能从列表选择，不可自由输入 URL */
  selectOnly?: boolean;
  onChange: (value: string) => void;
  onSelectEndpoint?: (endpoint: SwaggerApiEndpoint, fullUrl: string) => void;
};

export function FetchUrlAutocomplete({
  value,
  apiBaseUrl,
  endpoints,
  placeholder,
  selectOnly = false,
  onChange,
  onSelectEndpoint,
}: FetchUrlAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [filterQuery, setFilterQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(
    () => buildEndpointSuggestions(apiBaseUrl, endpoints),
    [apiBaseUrl, endpoints]
  );

  const query = selectOnly ? filterQuery : value;

  const filtered = useMemo(
    () => filterEndpointSuggestions(suggestions, query),
    [suggestions, query]
  );

  const selectedSuggestion = useMemo(
    () => suggestions.find((item) => item.path === value),
    [suggestions, value]
  );

  const inputValue = selectOnly
    ? open
      ? filterQuery
      : selectedSuggestion?.label ?? value
    : value;

  useEffect(() => {
    setActiveIndex(0);
  }, [query, filtered.length]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as globalThis.Node)) {
        setOpen(false);
        setFilterQuery("");
      }
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const showSuggestions = open && endpoints.length > 0;

  const selectSuggestion = (index: number) => {
    const item = filtered[index];
    if (!item) return;
    const nextValue = apiBaseUrl.trim() ? item.path : item.fullUrl;
    onChange(nextValue);
    onSelectEndpoint?.(item, item.fullUrl);
    setFilterQuery("");
    setOpen(false);
  };

  const openDropdown = () => {
    setOpen(true);
    if (selectOnly) {
      setFilterQuery("");
    }
  };

  const closeDropdown = () => {
    setOpen(false);
    setFilterQuery("");
  };

  return (
    <div ref={containerRef} className="relative">
      <input
        value={inputValue}
        readOnly={selectOnly && !open}
        placeholder={placeholder}
        onChange={(e) => {
          if (selectOnly) {
            setFilterQuery(e.target.value);
            setOpen(true);
            return;
          }
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={openDropdown}
        onBlur={() => {
          if (selectOnly) {
            closeDropdown();
          }
        }}
        onKeyDown={(e) => {
          if (!showSuggestions || filtered.length === 0) {
            if (selectOnly && e.key === "Escape") {
              closeDropdown();
            }
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
            closeDropdown();
          }
        }}
        className={cn(
          "flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-[11px] text-foreground shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-primary",
          selectOnly && !open ? "cursor-pointer font-medium" : "font-mono"
        )}
      />
      {showSuggestions ? (
        <div className="absolute z-[10150] mt-1 max-h-52 w-full overflow-auto rounded-md border border-border bg-popover py-1 text-popover-foreground shadow-md">
          {filtered.length === 0 ? (
            <div className="px-2 py-1.5 text-[11px] text-muted-foreground">
              无匹配接口
            </div>
          ) : (
            filtered.map((item, index) => (
              <button
                key={`${item.method}:${item.path}:${item.operationId ?? index}`}
                type="button"
                className={cn(
                  "flex w-full flex-col items-start gap-0.5 px-2 py-1.5 text-left text-[11px] hover:bg-accent",
                  index === activeIndex && "bg-accent"
                )}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectSuggestion(index)}
              >
                <span className="font-medium text-foreground">{item.label}</span>
                <span className="truncate font-mono text-muted-foreground">
                  {item.fullUrl}
                </span>
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}

export function resolveFetchUrlPreview(
  apiBaseUrl: string,
  url: string,
  endpoints: SwaggerApiEndpoint[]
): string {
  const matched = endpoints.find((item) => item.path === url);
  const resolvedPath = matched?.path ?? url;
  try {
    return resolveFetchRequestUrl({ url: resolvedPath, apiBaseUrl });
  } catch {
    return url;
  }
}

export type { FetchHttpMethod };
