import dayjs from "../vendor/dayjs/esm/index.js";

/** 模版根：`scope` 为流程数据，`system` 为系统内置工具 */
export type TemplateRootName = "scope" | "system";

export const TEMPLATE_ROOT_NAMES: TemplateRootName[] = ["scope", "system"];

/** dayjs 实例常用方法（用于联想；运行时走真实 dayjs 原型） */
export const SYSTEM_TIME_METHOD_NAMES = [
  "add",
  "subtract",
  "set",
  "get",
  "millisecond",
  "second",
  "minute",
  "hour",
  "date",
  "day",
  "weekday",
  "isoWeekday",
  "dayOfYear",
  "week",
  "isoWeek",
  "month",
  "quarter",
  "year",
  "weekYear",
  "isoWeekYear",
  "startOf",
  "endOf",
  "format",
  "fromNow",
  "toNow",
  "from",
  "to",
  "calendar",
  "diff",
  "valueOf",
  "unix",
  "daysInMonth",
  "toDate",
  "toArray",
  "toJSON",
  "toISOString",
  "toObject",
  "toString",
  "isBefore",
  "isSame",
  "isAfter",
  "isSameOrBefore",
  "isSameOrAfter",
  "isBetween",
  "isLeapYear",
  "isValid",
  "clone",
  "locale",
  "utcOffset",
  "local",
  "utc",
  "isUTC",
] as const;

/** Math 静态成员（联想用） */
export const SYSTEM_MATH_KEYS = [
  "E",
  "LN10",
  "LN2",
  "LOG10E",
  "LOG2E",
  "PI",
  "SQRT1_2",
  "SQRT2",
  "abs",
  "acos",
  "acosh",
  "asin",
  "asinh",
  "atan",
  "atan2",
  "atanh",
  "cbrt",
  "ceil",
  "clz32",
  "cos",
  "cosh",
  "exp",
  "expm1",
  "floor",
  "fround",
  "hypot",
  "imul",
  "log",
  "log10",
  "log1p",
  "log2",
  "max",
  "min",
  "pow",
  "random",
  "round",
  "sign",
  "sin",
  "sinh",
  "sqrt",
  "tan",
  "tanh",
  "trunc",
] as const;

/** Location 常用属性 / 方法（联想用） */
export const SYSTEM_LOCATION_KEYS = [
  "href",
  "protocol",
  "host",
  "hostname",
  "port",
  "pathname",
  "search",
  "hash",
  "origin",
  "ancestorOrigins",
  "assign",
  "reload",
  "replace",
  "toString",
] as const;

/** system.tools 常用方法（联想用） */
export const SYSTEM_TOOLS_KEYS = [
  "str",
  "int",
  "sum",
  "len",
  "pick",
  "replace",
  "replaceAll",
  "exclude",
] as const;

export type SystemTime = ReturnType<typeof dayjs>;

export type SystemTools = {
  /** 转为字符串 */
  str: (value?: unknown) => string;
  /** 转为数字（Number） */
  int: (value?: unknown) => number;
  /**
   * 求和 / 拼接。
   * - 参数可展平嵌套数组（如 `sum([...arr])`、`sum([[1,2],[3]])`）
   * - 全是数字（或可转成有效数字）→ 数值求和
   * - 任一项是字符串 → 按 JS `+` 从左到右拼接，结果为字符串
   */
  sum: (...values: unknown[]) => number | string;
  /** 返回字符串长度；数组则返回 length；其余先转字符串再取长度 */
  len: (value?: unknown) => number;
  /**
   * 按 0 基下标取出若干项。
   * - 数组 → 新数组；字符串 → 新字符串
   * - 后续下标支持展开，如 `pick(scope?.arr, ...scope?.idxs)` / `pick(scope?.arr, [...scope?.idxs])`
   */
  pick: (value: unknown, ...indices: unknown[]) => unknown[] | string;
  /**
   * 只替换第一个匹配项。
   * - 数组按元素值相等替换；字符串按子串替换
   */
  replace: (value: unknown, target?: unknown, source?: unknown) => unknown[] | string;
  /**
   * 替换全部匹配项（规则同 replace）。
   */
  replaceAll: (value: unknown, target?: unknown, source?: unknown) => unknown[] | string;
  /**
   * 按 0 基下标删除若干项，返回新数组 / 新字符串。
   * - 后续下标支持展开，如 `exclude(scope?.arr, ...scope?.idxs)`
   */
  exclude: (value: unknown, ...indices: unknown[]) => unknown[] | string;
};

export type SystemRoot = {
  /** 当前时间的 dayjs 对象（每次 createSystemRoot 取「此刻」） */
  time: SystemTime;
  /** JS Math */
  math: Math;
  /** 当前页 Location；非浏览器环境为只读占位 */
  location: Location | SystemLocationStub;
  /** 常用转换 / 聚合工具，可与 scope 嵌套调用 */
  tools: SystemTools;
};

export type SystemLocationStub = {
  href: string;
  protocol: string;
  host: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  origin: string;
  assign: (url: string) => void;
  reload: () => void;
  replace: (url: string) => void;
  toString: () => string;
};

function createLocationStub(): SystemLocationStub {
  return {
    href: "",
    protocol: "",
    host: "",
    hostname: "",
    port: "",
    pathname: "",
    search: "",
    hash: "",
    origin: "",
    assign() {},
    reload() {},
    replace() {},
    toString() {
      return "";
    },
  };
}

function flattenToolArgs(values: unknown[]): unknown[] {
  const out: unknown[] = [];
  for (const value of values) {
    if (Array.isArray(value)) {
      out.push(...flattenToolArgs(value));
    } else {
      out.push(value);
    }
  }
  return out;
}

function toIndexList(values: unknown[]): number[] {
  const out: number[] = [];
  for (const value of flattenToolArgs(values)) {
    const n = typeof value === "number" ? value : Number(value);
    if (Number.isInteger(n) && n >= 0) {
      out.push(n);
    }
  }
  return out;
}

function valuesEqual(a: unknown, b: unknown): boolean {
  return Object.is(a, b);
}

function replaceInArray(list: unknown[], target: unknown, source: unknown, all: boolean): unknown[] {
  if (all) {
    return list.map((item) => (valuesEqual(item, target) ? source : item));
  }
  const out = list.slice();
  const idx = out.findIndex((item) => valuesEqual(item, target));
  if (idx >= 0) {
    out[idx] = source;
  }
  return out;
}

function replaceInString(text: string, target: unknown, source: unknown, all: boolean): string {
  const from = target === undefined || target === null ? "" : String(target);
  const to = source === undefined || source === null ? "" : String(source);
  if (from.length === 0) {
    return text;
  }
  if (!all) {
    const at = text.indexOf(from);
    if (at < 0) return text;
    return text.slice(0, at) + to + text.slice(at + from.length);
  }
  return text.split(from).join(to);
}

export function createSystemTools(): SystemTools {
  return {
    str(value?: unknown) {
      if (value === undefined || value === null) return "";
      if (typeof value === "string") return value;
      if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
        return String(value);
      }
      if (dayjs.isDayjs(value)) {
        return value.toISOString();
      }
      try {
        return JSON.stringify(value);
      } catch {
        return String(value);
      }
    },
    int(value?: unknown) {
      if (typeof value === "number") return value;
      if (typeof value === "bigint") return Number(value);
      if (typeof value === "boolean") return value ? 1 : 0;
      if (value === undefined || value === null || value === "") return NaN;
      return Number(value);
    },
    sum(...values: unknown[]) {
      const flat = flattenToolArgs(values);
      if (flat.length === 0) return 0;
      const hasString = flat.some((item) => typeof item === "string");
      if (hasString) {
        // 与 JS `+` 一致：从左到右，有字符串则整体倾向字符串拼接
        let result: unknown = flat[0];
        for (let i = 1; i < flat.length; i += 1) {
          result = (result as never) + (flat[i] as never);
        }
        return result as number | string;
      }
      return flat.reduce<number>((acc, item) => {
        const n = typeof item === "number" ? item : Number(item);
        return acc + (Number.isFinite(n) ? n : 0);
      }, 0);
    },
    len(value?: unknown) {
      if (typeof value === "string") return value.length;
      if (Array.isArray(value)) return value.length;
      if (value === undefined || value === null) return 0;
      if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
        return String(value).length;
      }
      try {
        return JSON.stringify(value).length;
      } catch {
        return String(value).length;
      }
    },
    pick(value: unknown, ...indices: unknown[]) {
      const idxs = toIndexList(indices);
      if (Array.isArray(value)) {
        return idxs.filter((i) => i < value.length).map((i) => value[i]);
      }
      const text = typeof value === "string" ? value : value == null ? "" : String(value);
      return idxs
        .filter((i) => i < text.length)
        .map((i) => text[i])
        .join("");
    },
    replace(value: unknown, target?: unknown, source?: unknown) {
      if (Array.isArray(value)) {
        return replaceInArray(value, target, source, false);
      }
      const text = typeof value === "string" ? value : value == null ? "" : String(value);
      return replaceInString(text, target, source, false);
    },
    replaceAll(value: unknown, target?: unknown, source?: unknown) {
      if (Array.isArray(value)) {
        return replaceInArray(value, target, source, true);
      }
      const text = typeof value === "string" ? value : value == null ? "" : String(value);
      return replaceInString(text, target, source, true);
    },
    exclude(value: unknown, ...indices: unknown[]) {
      const remove = new Set(toIndexList(indices));
      if (Array.isArray(value)) {
        return value.filter((_, i) => !remove.has(i));
      }
      const text = typeof value === "string" ? value : value == null ? "" : String(value);
      let out = "";
      for (let i = 0; i < text.length; i += 1) {
        if (!remove.has(i)) {
          out += text[i];
        }
      }
      return out;
    },
  };
}

/** 每次求值新建，保证 `time` 为当前时刻 */
export function createSystemRoot(): SystemRoot {
  const locationValue =
    typeof globalThis !== "undefined" &&
    "location" in globalThis &&
    (globalThis as { location?: Location }).location
      ? (globalThis as { location: Location }).location
      : createLocationStub();

  return {
    time: dayjs(),
    math: Math,
    location: locationValue,
    tools: createSystemTools(),
  };
}

/** 联想用静态树（不依赖运行时实例） */
export function getSystemAutocompleteTree(): Record<string, unknown> {
  const timeMethods: Record<string, unknown> = {};
  for (const name of SYSTEM_TIME_METHOD_NAMES) {
    timeMethods[name] = Object.create(null);
  }
  const mathKeys: Record<string, unknown> = {};
  for (const name of SYSTEM_MATH_KEYS) {
    mathKeys[name] = Object.create(null);
  }
  const locationKeys: Record<string, unknown> = {};
  for (const name of SYSTEM_LOCATION_KEYS) {
    locationKeys[name] = Object.create(null);
  }
  const toolsKeys: Record<string, unknown> = {};
  for (const name of SYSTEM_TOOLS_KEYS) {
    toolsKeys[name] = Object.create(null);
  }
  return {
    time: timeMethods,
    math: mathKeys,
    location: locationKeys,
    tools: toolsKeys,
  };
}

export function isDayjsValue(value: unknown): value is SystemTime {
  return dayjs.isDayjs(value);
}
