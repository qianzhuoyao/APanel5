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

export type SystemTime = ReturnType<typeof dayjs>;

export type SystemRoot = {
  /** 当前时间的 dayjs 对象（每次 createSystemRoot 取「此刻」） */
  time: SystemTime;
  /** JS Math */
  math: Math;
  /** 当前页 Location；非浏览器环境为只读占位 */
  location: Location | SystemLocationStub;
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
  return {
    time: timeMethods,
    math: mathKeys,
    location: locationKeys,
  };
}

export function isDayjsValue(value: unknown): value is SystemTime {
  return dayjs.isDayjs(value);
}
