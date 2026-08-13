import type { PanelTableConfig, NormalizedColumn, NormalizedRow, NormalizedTable } from "../types";

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

function getByPath(root: unknown, path?: string): unknown {
  if (!path || !path.trim()) return root;
  const parts = path.split(".").filter(Boolean);
  let cur: unknown = root;
  for (const p of parts) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[p];
  }
  return cur;
}

function parseRowsText(text: string): unknown {
  const trimmed = text.trim();
  if (!trimmed) return undefined;
  try {
    return JSON.parse(trimmed);
  } catch {
    return undefined;
  }
}

/** True when raw can be used as table input (non-empty). */
export function isUsableTableRawData(raw: unknown): boolean {
  if (raw === undefined || raw === null) return false;
  if (Array.isArray(raw)) return raw.length > 0;
  if (typeof raw === "string") return raw.trim().length > 0;
  if (typeof raw === "object") return Object.keys(raw as object).length > 0;
  return true;
}

/**
 * Resolve table data with priority:
 * 1. dynamic / scope-bound (`scopeBoundSource` or injected `config.rows`)
 * 2. static `rowsText` (and legacy `rows` already covered above)
 * 3. `source` as plain JSON (non-template)
 * Empty dynamic falls through to static.
 */
export function resolveRawTableInput(
  config: PanelTableConfig,
  scopeBoundSource?: unknown
): unknown {
  if (isUsableTableRawData(scopeBoundSource)) return scopeBoundSource;
  if (isUsableTableRawData(config.rows)) return config.rows;
  if (typeof config.rowsText === "string" && config.rowsText.trim()) {
    const parsed = parseRowsText(config.rowsText);
    if (isUsableTableRawData(parsed)) return parsed;
  }
  if (typeof config.source === "string" && config.source.trim()) {
    const src = config.source.trim();
    // Only treat as static JSON when it is not a Scope template
    if (!src.includes("{")) {
      try {
        const parsed = JSON.parse(src);
        if (isUsableTableRawData(parsed)) return parsed;
      } catch {
        /* ignore */
      }
    }
  }
  return undefined;
}

function recordsFromMatrix(matrix: unknown[][]): Record<string, unknown>[] {
  if (matrix.length === 0) return [];
  const headerRow = matrix[0];
  if (!Array.isArray(headerRow)) return [];
  const header = headerRow.map((h, i) => {
    const s = h == null ? "" : String(h).trim();
    return s || `col${i + 1}`;
  });
  return matrix.slice(1).map((row) => {
    const obj: Record<string, unknown> = {};
    const cells = Array.isArray(row) ? row : [];
    header.forEach((key, i) => {
      obj[key] = cells[i];
    });
    return obj;
  });
}

function isMatrixShape(data: unknown[]): data is unknown[][] {
  return data.length > 0 && Array.isArray(data[0]);
}

function toRecordArray(raw: unknown, mode: PanelTableConfig["transform"]): Record<string, unknown>[] {
  const m = mode?.mode ?? "auto";
  let data = raw;
  if ((m === "path" || m === "auto") && mode?.path) {
    data = getByPath(raw, mode.path);
  }

  if (Array.isArray(data)) {
    if (data.length === 0) return [];
    // Matrix mode only when rows are actual arrays. Object[] must stay as records
    // (selecting "matrix" on demo object JSON used to crash via [].map on an object).
    if ((m === "matrix" || m === "auto") && isMatrixShape(data)) {
      return recordsFromMatrix(data);
    }
    if (typeof data[0] === "object" && data[0] != null) {
      return data.map((item, i) =>
        isPlainObject(item) ? item : { value: item, index: i }
      );
    }
    return data.map((value, index) => ({ value, index }));
  }

  if (isPlainObject(data)) {
    // object-of-arrays → zip
    const keys = Object.keys(data);
    if (keys.length === 0) return [];
    const maybeArrays = keys.every((k) => Array.isArray(data[k]));
    if (maybeArrays) {
      const len = Math.max(...keys.map((k) => (data[k] as unknown[]).length));
      const rows: Record<string, unknown>[] = [];
      for (let i = 0; i < len; i++) {
        const row: Record<string, unknown> = {};
        for (const k of keys) row[k] = (data[k] as unknown[])[i];
        rows.push(row);
      }
      return rows;
    }
    // single record
    return [data];
  }

  if (data == null) return [];
  return [{ value: data }];
}

function inferColumns(
  records: Record<string, unknown>[],
  config: PanelTableConfig
): NormalizedColumn[] {
  if (config.columns?.length) {
    return config.columns.map((col, i) => ({
      id: col.id || col.field || `col-${i}`,
      field: col.field,
      title: (typeof col.title === "string" && col.title.trim()) || col.field || `col-${i}`,
      width: col.width,
      minWidth: col.minWidth,
      align: col.align ?? "left",
      hidden: Boolean(col.hidden),
      widget: col.widget ?? "text",
      widgetProps: col.widgetProps,
      valueMap: col.valueMap,
      cellStyleRules: col.cellStyleRules,
      displayTemplate: col.displayTemplate,
      tooltipEnabled: col.tooltipEnabled,
      tooltipPlacement: col.tooltipPlacement,
      tooltipTemplate: col.tooltipTemplate,
    }));
  }

  const from = config.transform?.columnsFrom ?? "keys";
  const keySet = new Set<string>();
  if (from === "firstRow" && records[0]) {
    Object.keys(records[0]).forEach((k) => keySet.add(k));
  } else {
    for (const r of records.slice(0, 50)) {
      Object.keys(r).forEach((k) => keySet.add(k));
    }
  }

  return Array.from(keySet).map((field) => ({
    id: field,
    field,
    title: field,
    align: "left" as const,
    hidden: false,
    widget: "text" as const,
  }));
}

export function transformToTable(
  raw: unknown,
  config: PanelTableConfig = {}
): NormalizedTable {
  const records = toRecordArray(raw, config.transform);
  const columns = inferColumns(records, config).filter((c) => !c.hidden);
  const idField = config.transform?.rowIdField;

  const rows: NormalizedRow[] = records.map((values, index) => {
    const idRaw = idField ? values[idField] : undefined;
    const id =
      idRaw != null && String(idRaw)
        ? String(idRaw)
        : `row-${index}`;
    return { id, values, index };
  });

  return { columns, rows };
}

export function createDefaultTableConfig(): PanelTableConfig {
  const demoRows = [
    { name: "Alpha", status: "active", score: 86 },
    { name: "Beta", status: "idle", score: 42 },
    { name: "Gamma", status: "active", score: 93 },
  ];
  return {
    showHeader: true,
    stripe: true,
    rowHeight: 36,
    emptyText: "",
    tableStyle: {
      stickyHeader: true,
      borderWidth: 1,
      borderColor: "rgba(0,0,0,0.08)",
      color: "#111827",
      fontSize: 12,
    },
    headerStyle: {
      backgroundColor: "rgba(0,0,0,0.04)",
      fontWeight: 600,
      fontSize: 12,
      color: "#111827",
    },
    columns: [
      { field: "name", title: "Name", width: 140, widget: "text" },
      {
        field: "status",
        title: "Status",
        width: 100,
        widget: "tag",
        valueMap: [
          { when: { op: "eq", value: "active" }, value: "Active" },
          { when: { op: "eq", value: "idle" }, value: "Idle" },
        ],
        widgetProps: {
          colorMap: { Active: "#16a34a", Idle: "#ca8a04", active: "#16a34a", idle: "#ca8a04" },
        },
        cellStyleRules: [
          {
            when: { op: "eq", value: "active" },
            style: { fontWeight: 600 },
          },
        ],
      },
      { field: "score", title: "Score", width: 120, widget: "progress", widgetProps: { max: 100 } },
    ],
    // Demo data lives in static rowsText so the config panel shows it;
    // Scope `source` takes priority when it resolves to non-empty data.
    rowsText: JSON.stringify(demoRows, null, 2),
    transform: { mode: "records", columnsFrom: "explicit" },
  };
}
