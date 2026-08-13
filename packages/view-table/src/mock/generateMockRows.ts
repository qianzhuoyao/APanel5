import type { TableCellWidget, TableColumnConfig } from "../types";

export type TableMockLocale = "zh" | "en";

export type TableMockOptions = {
  /** number of rows to generate (1–200) */
  rowCount?: number;
  /** optional seed for stable output */
  seed?: string;
  /** name/title prefix */
  namePrefix?: string;
  locale?: TableMockLocale;
  /** include `id` even if not in columns */
  includeId?: boolean;
  /** include createdAt ISO timestamp */
  includeTimestamp?: boolean;
  /** add rich extras (email/phone/city/…) beyond columns */
  includeExtras?: boolean;
  /** override status enum values (comma-separated in UI) */
  statusValues?: string[];
  scoreMin?: number;
  scoreMax?: number;
};

const ZH_NAMES = [
  "阿波罗",
  "北辰",
  "沧海",
  "东篱",
  "飞羽",
  "孤舟",
  "寒烟",
  "江月",
  "昆仑",
  "流云",
  "明月",
  "南山",
  "青梧",
  "秋水",
  "若水",
  "霜华",
  "天启",
  "晚风",
  "星河",
  "云舒",
];
const EN_NAMES = [
  "Alpha",
  "Beta",
  "Gamma",
  "Delta",
  "Echo",
  "Foxtrot",
  "Harbor",
  "Iris",
  "Jade",
  "Kite",
  "Luna",
  "Nova",
  "Orion",
  "Pearl",
  "Quest",
  "River",
  "Sage",
  "Tide",
  "Umbra",
  "Vesper",
];
const ZH_CITIES = ["上海", "北京", "深圳", "杭州", "成都", "广州", "苏州", "南京", "武汉", "西安"];
const EN_CITIES = [
  "Shanghai",
  "Beijing",
  "Shenzhen",
  "Hangzhou",
  "Chengdu",
  "Guangzhou",
  "Suzhou",
  "Nanjing",
  "Wuhan",
  "Austin",
];
const ZH_STATUS = ["active", "idle", "pending", "done", "error"];
const EN_STATUS = ["active", "idle", "pending", "done", "error"];
const ZH_REMARKS = [
  "按计划推进中",
  "待复核",
  "已同步蓝图",
  "需要补充材料",
  "本周优先",
  "临时挂起",
];
const EN_REMARKS = [
  "On track",
  "Needs review",
  "Synced with blueprint",
  "Waiting for assets",
  "Priority this week",
  "Temporarily paused",
];

function hashSeed(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function createRng(seed?: string) {
  let state = seed && seed.trim() ? hashSeed(seed.trim()) : (Date.now() >>> 0) ^ 0x9e3779b9;
  return () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function pick<T>(rng: () => number, list: T[]): T {
  return list[Math.floor(rng() * list.length) % list.length]!;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function fieldKind(field: string, widget?: TableCellWidget): string {
  const f = field.toLowerCase();
  if (widget === "boolean") return "boolean";
  if (widget === "progress") return "score";
  if (widget === "image") return "image";
  if (widget === "link") return "url";
  if (widget === "tag" || widget === "badge") {
    if (/(status|state|stage|phase)/.test(f)) return "status";
    return "tag";
  }
  if (/(email|mail)/.test(f)) return "email";
  if (/(phone|mobile|tel)/.test(f)) return "phone";
  if (/(url|href|link|website)/.test(f)) return "url";
  if (/(avatar|img|image|cover|thumb|photo)/.test(f)) return "image";
  if (/(status|state|stage|phase)/.test(f)) return "status";
  if (/(score|progress|percent|pct|rate|ratio)/.test(f)) return "score";
  if (/(price|amount|money|cost|fee)/.test(f)) return "price";
  if (/(age)/.test(f)) return "age";
  if (/(count|qty|quantity|num|number|total)/.test(f)) return "count";
  if (/(date|time|created|updated|at)$/.test(f) || /(created|updated)_?at/.test(f)) return "date";
  if (/(city|region|area)/.test(f)) return "city";
  if (/(address|addr)/.test(f)) return "address";
  if (/(desc|remark|note|content|comment|bio)/.test(f)) return "remark";
  if (/(name|title|label|nick)/.test(f)) return "name";
  if (/(^id$|_id$|uuid)/.test(f)) return "id";
  if (/(enabled|active|ok|flag|bool)/.test(f)) return "boolean";
  return "string";
}

function valueForKind(
  kind: string,
  index: number,
  rng: () => number,
  opts: Required<
    Pick<
      TableMockOptions,
      "locale" | "namePrefix" | "statusValues" | "scoreMin" | "scoreMax"
    >
  >
): unknown {
  const zh = opts.locale === "zh";
  const names = zh ? ZH_NAMES : EN_NAMES;
  const cities = zh ? ZH_CITIES : EN_CITIES;
  const statuses = opts.statusValues.length
    ? opts.statusValues
    : zh
      ? ZH_STATUS
      : EN_STATUS;
  const remarks = zh ? ZH_REMARKS : EN_REMARKS;
  const name = `${opts.namePrefix}${pick(rng, names)}${index + 1}`;

  switch (kind) {
    case "id":
      return `row-${String(index + 1).padStart(3, "0")}`;
    case "name":
      return name;
    case "status":
    case "tag":
      return pick(rng, statuses);
    case "score": {
      const min = opts.scoreMin;
      const max = opts.scoreMax;
      return Math.round(min + rng() * (max - min));
    }
    case "price":
      return Math.round((10 + rng() * 990) * 100) / 100;
    case "age":
      return 18 + Math.floor(rng() * 48);
    case "count":
      return 1 + Math.floor(rng() * 99);
    case "boolean":
      return rng() > 0.45;
    case "email":
      return `${(zh ? "user" : "user")}${index + 1}@example.com`;
    case "phone":
      return zh
        ? `1${3 + Math.floor(rng() * 6)}${String(Math.floor(rng() * 1e9)).padStart(9, "0")}`
        : `+1-555-${String(1000 + Math.floor(rng() * 9000))}`;
    case "url":
      return `https://example.com/item/${index + 1}`;
    case "image":
      return `https://picsum.photos/seed/abuilder${index + 1}/80/80`;
    case "city":
      return pick(rng, cities);
    case "address":
      return zh
        ? `${pick(rng, cities)}·示例路 ${10 + Math.floor(rng() * 90)} 号`
        : `${100 + Math.floor(rng() * 900)} Demo St, ${pick(rng, cities)}`;
    case "remark":
      return pick(rng, remarks);
    case "date": {
      const day = Date.now() - Math.floor(rng() * 30) * 86400000;
      return new Date(day).toISOString();
    }
    case "string":
    default:
      return zh ? `示例值-${index + 1}` : `Sample-${index + 1}`;
  }
}

/**
 * Generate rich mock table rows from column definitions + options.
 */
export function generateMockTableRows(
  columns: TableColumnConfig[] | undefined,
  options: TableMockOptions = {}
): Record<string, unknown>[] {
  const rowCount = clamp(Math.floor(options.rowCount ?? 5), 1, 200);
  const locale: TableMockLocale = options.locale === "en" ? "en" : "zh";
  const namePrefix = options.namePrefix?.trim() ? `${options.namePrefix.trim()}-` : "";
  const statusValues = (options.statusValues ?? [])
    .map((s) => s.trim())
    .filter(Boolean);
  const scoreMin = clamp(options.scoreMin ?? 0, 0, 1000);
  const scoreMax = clamp(options.scoreMax ?? 100, scoreMin, 1000);
  const rng = createRng(options.seed);
  const cols = (columns ?? []).filter((c) => c.field?.trim());

  const fields: Array<{ field: string; kind: string }> =
    cols.length > 0
      ? cols.map((c) => ({
          field: c.field,
          kind: fieldKind(c.field, c.widget),
        }))
      : [
          { field: "name", kind: "name" },
          { field: "status", kind: "status" },
          { field: "score", kind: "score" },
        ];

  const rows: Record<string, unknown>[] = [];
  for (let i = 0; i < rowCount; i++) {
    const row: Record<string, unknown> = {};
    if (options.includeId !== false && !fields.some((f) => f.field === "id")) {
      row.id = `row-${String(i + 1).padStart(3, "0")}`;
    }
    for (const f of fields) {
      row[f.field] = valueForKind(f.kind, i, rng, {
        locale,
        namePrefix,
        statusValues,
        scoreMin,
        scoreMax,
      });
    }
    if (options.includeTimestamp) {
      row.createdAt = new Date(Date.now() - i * 3600000).toISOString();
    }
    if (options.includeExtras) {
      if (row.email == null) row.email = `user${i + 1}@example.com`;
      if (row.phone == null) {
        row.phone =
          locale === "zh"
            ? `138${String(10000000 + Math.floor(rng() * 89999999))}`
            : `+1-555-${1000 + Math.floor(rng() * 9000)}`;
      }
      if (row.city == null) row.city = pick(rng, locale === "zh" ? ZH_CITIES : EN_CITIES);
      if (row.remark == null) row.remark = pick(rng, locale === "zh" ? ZH_REMARKS : EN_REMARKS);
      if (row.priority == null) row.priority = pick(rng, ["P0", "P1", "P2", "P3"]);
      if (row.enabled == null) row.enabled = rng() > 0.3;
    }
    rows.push(row);
  }
  return rows;
}

export function stringifyMockTableRows(rows: Record<string, unknown>[]): string {
  return JSON.stringify(rows, null, 2);
}
