export type DocLocale = "zh-CN" | "en-US";

export type DocText = Record<DocLocale, string>;

export type DocMember = {
  name: string;
  summary: DocText;
  usage?: string;
};

export type DocSection = {
  id: string;
  title: DocText;
  body: DocText;
  examples?: string[];
  members?: DocMember[];
};

export type TemplateDocRoot = "system" | "scope";

export type DocBook = {
  root: TemplateDocRoot;
  title: DocText;
  intro: DocText;
  sections: DocSection[];
};

export type TemplateDocPiece =
  | { type: "text"; text: string }
  | {
      type: "link";
      text: string;
      root: TemplateDocRoot;
      sectionId: string;
    };

const zh = (zhCN: string, enUS: string): DocText => ({
  "zh-CN": zhCN,
  "en-US": enUS,
});

/** `{scope...}` / `{system...}`，以及不带花括号的 `system?.math`、`scope?.value`。 */
const TEMPLATE_DOC_LINK_RE =
  /\{(?:scope|system)[^}]*\}|\b(?:scope|system)\?\.[\w$]+(?:\?\.[\w$]+)*/g;

const SYSTEM_SECTIONS = new Set(["time", "math", "location"]);
const SCOPE_FIELDS = new Set(["value", "id", "name", "type"]);

export function docText(text: DocText, locale: string): string {
  return locale === "en-US" ? text["en-US"] : text["zh-CN"];
}

export function resolveTemplateDocTarget(token: string): {
  root: TemplateDocRoot;
  sectionId: string;
} {
  const inner = (token.startsWith("{") ? token.slice(1, -1) : token).trim();
  const root: TemplateDocRoot = inner.startsWith("system") ? "system" : "scope";
  const member = /^(?:system|scope)\?\.([A-Za-z_$][\w$]*)/.exec(inner)?.[1];
  if (root === "system") {
    return {
      root,
      sectionId: member && SYSTEM_SECTIONS.has(member) ? member : "overview",
    };
  }
  if (inner.includes("[...")) return { root, sectionId: "spread" };
  if (member && SCOPE_FIELDS.has(member)) return { root, sectionId: "fields" };
  if (member) return { root, sectionId: "multi" };
  return { root, sectionId: "overview" };
}

export function splitTemplateDocLinks(text: string): TemplateDocPiece[] {
  const pieces: TemplateDocPiece[] = [];
  let last = 0;
  for (const match of text.matchAll(TEMPLATE_DOC_LINK_RE)) {
    const index = match.index ?? 0;
    if (index > last) {
      pieces.push({ type: "text", text: text.slice(last, index) });
    }
    const token = match[0];
    const target = resolveTemplateDocTarget(token);
    pieces.push({ type: "link", text: token, ...target });
    last = index + token.length;
  }
  if (last < text.length) {
    pieces.push({ type: "text", text: text.slice(last) });
  }
  if (pieces.length === 0) pieces.push({ type: "text", text });
  return pieces;
}

export const TEMPLATE_DOC_CHROME = {
  searchPlaceholder: zh("搜索名称、用法或例子", "Search name, usage, or examples"),
  empty: zh("没有匹配的说明", "No matching docs"),
  examples: zh("例子", "Examples"),
  members: zh("成员", "Members"),
  current: zh("当前", "Opened from"),
  pluginNote: zh(
    "联想里还会出现 weekday、isoWeek、quarter、fromNow、calendar、utc、isLeapYear、toArray、toObject 等名字。当前打包的是 dayjs 核心，没有挂这些插件，写进模板不会生效。",
    "Autocomplete may also list weekday, isoWeek, quarter, fromNow, calendar, utc, isLeapYear, toArray, and toObject. The bundled dayjs is core-only, so those plugin methods do nothing in templates."
  ),
};

const TIME_MEMBERS: DocMember[] = [
  { name: "format", summary: zh("按格式串输出文本。常用 YYYY-MM-DD HH:mm:ss。", "Format as text. Common pattern: YYYY-MM-DD HH:mm:ss."), usage: "{system?.time?.format('YYYY-MM-DD HH:mm:ss')}" },
  { name: "add", summary: zh("加上一段时间。单位：year、month、week、day、hour、minute、second、millisecond。", "Add a duration. Units: year, month, week, day, hour, minute, second, millisecond."), usage: "{system?.time?.add(1,'hour')}" },
  { name: "subtract", summary: zh("减去一段时间，单位同 add。", "Subtract a duration. Same units as add."), usage: "{system?.time?.subtract(7,'d')}" },
  { name: "startOf", summary: zh("对齐到该单位的起点，如当天 00:00、当月 1 日。", "Snap to the start of a unit, such as today 00:00 or the 1st of the month."), usage: "{system?.time?.startOf('day')}" },
  { name: "endOf", summary: zh("对齐到该单位的终点，如当天 23:59:59.999。", "Snap to the end of a unit, such as today 23:59:59.999."), usage: "{system?.time?.endOf('month')}" },
  { name: "valueOf", summary: zh("毫秒时间戳。", "Unix timestamp in milliseconds."), usage: "{system?.time?.valueOf()}" },
  { name: "unix", summary: zh("秒级时间戳。", "Unix timestamp in seconds."), usage: "{system?.time?.unix()}" },
  { name: "diff", summary: zh("与另一个时间的差值。第三参 true 时保留小数。", "Difference from another time. Pass true as the third argument for a float."), usage: "{system?.time?.diff(scope?.value,'hour',true)}" },
  { name: "set", summary: zh("把某个单位设成指定数字，返回新时间。", "Set one unit to a number and return a new time."), usage: "{system?.time?.set('hour', 8)}" },
  { name: "get", summary: zh("读取某个单位。month 从 0 开始。", "Read one unit. month is 0-based."), usage: "{system?.time?.get('year')}" },
  { name: "year", summary: zh("年。不传参是读取，传数字是设置。", "Year. No argument reads it; a number sets it."), usage: "{system?.time?.year()}" },
  { name: "month", summary: zh("月，0 是一月。", "Month. 0 is January."), usage: "{system?.time?.month()}" },
  { name: "date", summary: zh("日，1–31。", "Day of month, 1–31."), usage: "{system?.time?.date()}" },
  { name: "day", summary: zh("星期，0 是周日。", "Day of week. 0 is Sunday."), usage: "{system?.time?.day()}" },
  { name: "hour", summary: zh("时，0–23。", "Hour, 0–23."), usage: "{system?.time?.hour()}" },
  { name: "minute", summary: zh("分。", "Minute."), usage: "{system?.time?.minute()}" },
  { name: "second", summary: zh("秒。", "Second."), usage: "{system?.time?.second()}" },
  { name: "millisecond", summary: zh("毫秒。", "Millisecond."), usage: "{system?.time?.millisecond()}" },
  { name: "daysInMonth", summary: zh("这个月有多少天。", "How many days are in this month."), usage: "{system?.time?.daysInMonth()}" },
  { name: "toISOString", summary: zh("ISO 8601 字符串。不调用方法、直接写 {system?.time} 时，嵌进字符串也会变成 ISO 时间。", "ISO 8601 string. A bare {system?.time} inside a string also becomes an ISO time."), usage: "{system?.time?.toISOString()}" },
  { name: "toJSON", summary: zh("同 toISOString，便于放进 JSON。", "Same as toISOString, suitable inside JSON."), usage: "{system?.time?.toJSON()}" },
  { name: "toDate", summary: zh("变成 JS Date。继续嵌在字符串里时会变成日期文本。", "Native JS Date. Inside a string it becomes date text."), usage: "{system?.time?.toDate()}" },
  { name: "toString", summary: zh("UTC 日期字符串。", "UTC date string."), usage: "{system?.time?.toString()}" },
  { name: "utcOffset", summary: zh("当前时区相对 UTC 的分钟偏移。", "Local timezone offset from UTC, in minutes."), usage: "{system?.time?.utcOffset()}" },
  { name: "isBefore", summary: zh("是否早于另一个时间。", "Whether this time is before another."), usage: "{system?.time?.isBefore(scope?.value)}" },
  { name: "isAfter", summary: zh("是否晚于另一个时间。", "Whether this time is after another."), usage: "{system?.time?.isAfter(scope?.value)}" },
  { name: "isSame", summary: zh("是否同一时刻。第二参可指定比较到哪一级，如 'day'。", "Whether two times match. The second argument can limit the unit, such as 'day'."), usage: "{system?.time?.isSame(scope?.value,'day')}" },
  { name: "isValid", summary: zh("当前时间对象是否有效。", "Whether this time is valid."), usage: "{system?.time?.isValid()}" },
  { name: "clone", summary: zh("复制一份，避免后续修改影响原值。", "Copy so later changes do not affect the original."), usage: "{system?.time?.clone()}" },
  { name: "locale", summary: zh("读取或切换 dayjs 语言。当前只内置了 en。", "Read or switch the dayjs locale. Only en is bundled."), usage: "{system?.time?.locale()}" },
];

const MATH_MEMBERS: DocMember[] = [
  { name: "E", summary: zh("自然对数的底，约 2.718。", "Base of the natural logarithm, about 2.718."), usage: "{system?.math?.E}" },
  { name: "LN10", summary: zh("10 的自然对数。", "Natural log of 10."), usage: "{system?.math?.LN10}" },
  { name: "LN2", summary: zh("2 的自然对数。", "Natural log of 2."), usage: "{system?.math?.LN2}" },
  { name: "LOG10E", summary: zh("以 10 为底，e 的对数。", "Base-10 log of e."), usage: "{system?.math?.LOG10E}" },
  { name: "LOG2E", summary: zh("以 2 为底，e 的对数。", "Base-2 log of e."), usage: "{system?.math?.LOG2E}" },
  { name: "PI", summary: zh("圆周率。", "Pi."), usage: "{system?.math?.PI}" },
  { name: "SQRT1_2", summary: zh("1/2 的平方根，约 0.707。", "Square root of 1/2, about 0.707."), usage: "{system?.math?.SQRT1_2}" },
  { name: "SQRT2", summary: zh("2 的平方根，约 1.414。", "Square root of 2, about 1.414."), usage: "{system?.math?.SQRT2}" },
  { name: "abs", summary: zh("绝对值。", "Absolute value."), usage: "{system?.math?.abs(scope?.value||-3)}" },
  { name: "acos", summary: zh("反余弦，结果是弧度。", "Arc cosine, in radians."), usage: "{system?.math?.acos(0.5)}" },
  { name: "acosh", summary: zh("反双曲余弦。", "Inverse hyperbolic cosine."), usage: "{system?.math?.acosh(2)}" },
  { name: "asin", summary: zh("反正弦，结果是弧度。", "Arc sine, in radians."), usage: "{system?.math?.asin(0.5)}" },
  { name: "asinh", summary: zh("反双曲正弦。", "Inverse hyperbolic sine."), usage: "{system?.math?.asinh(1)}" },
  { name: "atan", summary: zh("反正切，结果是弧度。", "Arc tangent, in radians."), usage: "{system?.math?.atan(1)}" },
  { name: "atan2", summary: zh("由 y、x 计算方位角（弧度）。", "Angle from y and x, in radians."), usage: "{system?.math?.atan2(1, 1)}" },
  { name: "atanh", summary: zh("反双曲正切。", "Inverse hyperbolic tangent."), usage: "{system?.math?.atanh(0.5)}" },
  { name: "cbrt", summary: zh("立方根。", "Cube root."), usage: "{system?.math?.cbrt(8)}" },
  { name: "ceil", summary: zh("向上取整。", "Round up."), usage: "{system?.math?.ceil(1.2)}" },
  { name: "clz32", summary: zh("32 位整数的前导零个数。", "Leading zero bits of a 32-bit integer."), usage: "{system?.math?.clz32(1)}" },
  { name: "cos", summary: zh("余弦，参数是弧度。", "Cosine. Argument is radians."), usage: "{system?.math?.cos(system?.math?.PI)}" },
  { name: "cosh", summary: zh("双曲余弦。", "Hyperbolic cosine."), usage: "{system?.math?.cosh(0)}" },
  { name: "exp", summary: zh("e 的 x 次方。", "e raised to x."), usage: "{system?.math?.exp(1)}" },
  { name: "expm1", summary: zh("e^x - 1，x 接近 0 时更精确。", "e^x - 1, more accurate when x is near 0."), usage: "{system?.math?.expm1(1)}" },
  { name: "floor", summary: zh("向下取整。", "Round down."), usage: "{system?.math?.floor(system?.math?.random()*100)}" },
  { name: "fround", summary: zh("舍入到最接近的 32 位浮点数。", "Round to the nearest 32-bit float."), usage: "{system?.math?.fround(1.337)}" },
  { name: "hypot", summary: zh("各参数平方和的平方根。", "Square root of the sum of squares."), usage: "{system?.math?.hypot(3, 4)}" },
  { name: "imul", summary: zh("32 位整数相乘。", "32-bit integer multiplication."), usage: "{system?.math?.imul(2, 4)}" },
  { name: "log", summary: zh("自然对数。", "Natural logarithm."), usage: "{system?.math?.log(system?.math?.E)}" },
  { name: "log10", summary: zh("以 10 为底的对数。", "Base-10 logarithm."), usage: "{system?.math?.log10(100)}" },
  { name: "log1p", summary: zh("ln(1 + x)，x 接近 0 时更精确。", "ln(1 + x), more accurate when x is near 0."), usage: "{system?.math?.log1p(1)}" },
  { name: "log2", summary: zh("以 2 为底的对数。", "Base-2 logarithm."), usage: "{system?.math?.log2(8)}" },
  { name: "max", summary: zh("取更大的数，可传多个。", "The larger number. Accepts several arguments."), usage: "{system?.math?.max(scope?.value||0, 0)}" },
  { name: "min", summary: zh("取更小的数，可传多个。", "The smaller number. Accepts several arguments."), usage: "{system?.math?.min(scope?.value||0, 100)}" },
  { name: "pow", summary: zh("x 的 y 次方。", "x raised to y."), usage: "{system?.math?.pow(2, 8)}" },
  { name: "random", summary: zh("大于等于 0、小于 1 的随机数。", "A random number, 0 inclusive and 1 exclusive."), usage: "{system?.math?.random()}" },
  { name: "round", summary: zh("四舍五入到整数。", "Round to the nearest integer."), usage: "{system?.math?.round(1.5)}" },
  { name: "sign", summary: zh("正数 1，负数 -1，零 0。", "1, -1, or 0 according to the sign."), usage: "{system?.math?.sign(-4)}" },
  { name: "sin", summary: zh("正弦，参数是弧度。", "Sine. Argument is radians."), usage: "{system?.math?.sin(0)}" },
  { name: "sinh", summary: zh("双曲正弦。", "Hyperbolic sine."), usage: "{system?.math?.sinh(1)}" },
  { name: "sqrt", summary: zh("平方根。", "Square root."), usage: "{system?.math?.sqrt(9)}" },
  { name: "tan", summary: zh("正切，参数是弧度。", "Tangent. Argument is radians."), usage: "{system?.math?.tan(0)}" },
  { name: "tanh", summary: zh("双曲正切。", "Hyperbolic tangent."), usage: "{system?.math?.tanh(1)}" },
  { name: "trunc", summary: zh("去掉小数，向 0 取整。", "Drop the fraction toward 0."), usage: "{system?.math?.trunc(-1.9)}" },
];

const LOCATION_MEMBERS: DocMember[] = [
  { name: "href", summary: zh("完整地址，含协议、路径、查询和哈希。", "Full URL, including protocol, path, query, and hash."), usage: "{system?.location?.href}" },
  { name: "origin", summary: zh("源：协议 + 主机 + 端口。", "Origin: protocol, host, and port."), usage: "{system?.location?.origin}" },
  { name: "protocol", summary: zh("协议，带冒号，如 https:。", "Protocol with a colon, such as https:."), usage: "{system?.location?.protocol}" },
  { name: "host", summary: zh("主机，包含端口（默认端口会省略）。", "Host, including a non-default port."), usage: "{system?.location?.host}" },
  { name: "hostname", summary: zh("主机名，不含端口。", "Hostname, without the port."), usage: "{system?.location?.hostname}" },
  { name: "port", summary: zh("端口。默认端口时是空字符串。", "Port. Empty when it is the default port."), usage: "{system?.location?.port}" },
  { name: "pathname", summary: zh("路径，以 / 开头。", "Path, starting with /."), usage: "{system?.location?.pathname}" },
  { name: "search", summary: zh("查询串，以 ? 开头；没有查询时是空字符串。", "Query string, starting with ?. Empty when there is no query."), usage: "{system?.location?.search}" },
  { name: "hash", summary: zh("哈希，以 # 开头；没有哈希时是空字符串。", "Hash, starting with #. Empty when there is no hash."), usage: "{system?.location?.hash}" },
  { name: "ancestorOrigins", summary: zh("页面被嵌入时，祖先页面的源列表。普通打开时通常为空。", "Origins of ancestor pages when this page is embedded. Usually empty otherwise."), usage: "{system?.location?.ancestorOrigins}" },
  { name: "toString", summary: zh("同 href。", "Same as href."), usage: "{system?.location?.toString()}" },
  { name: "assign", summary: zh("跳转到新地址，并留下历史记录。会离开当前页，模板里一般不要调用。", "Navigate and keep history. This leaves the page, so avoid it in templates."), usage: "{system?.location?.assign('https://example.com')}" },
  { name: "replace", summary: zh("跳转到新地址，并替换当前历史。会离开当前页，模板里一般不要调用。", "Navigate and replace the current history entry. This leaves the page."), usage: "{system?.location?.replace('https://example.com')}" },
  { name: "reload", summary: zh("刷新当前页。模板里一般不要调用。", "Reload the page. Avoid calling it from a template."), usage: "{system?.location?.reload()}" },
];

export const TEMPLATE_DOC_BOOKS: Record<TemplateDocRoot, DocBook> = {
  system: {
    root: "system",
    title: zh("系统变量 system", "System variable system"),
    intro: zh(
      "system 是模板里的工具箱，每次求值都会重新取当前时间和当前页面地址。它和 scope 可以写在同一个表达式里。",
      "system is the template toolbox. Each evaluation reads the current time and the current page URL again. It can share an expression with scope."
    ),
    sections: [
      {
        id: "overview",
        title: zh("是什么", "What it is"),
        body: zh(
          "写在花括号里才会求值，例如 {system?.time}。三个入口：time 是当前时间（dayjs），math 是 JavaScript 的 Math，location 是当前页的地址。非浏览器环境里 location 是空的占位，不会抛错。",
          "Values are computed only inside braces, for example {system?.time}. There are three entries: time is the current dayjs time, math is JavaScript Math, and location is the current page URL. Outside a browser, location is an empty stub and does not throw."
        ),
        examples: ["{system?.time}", "{system?.math?.PI}", "{system?.location?.origin}"],
      },
      {
        id: "syntax",
        title: zh("怎么写", "How to write it"),
        body: zh(
          "?. 表示这一截没有值就停下来，不再往下取。|| 表示左边是空值时改用右边，例如 scope?.value?.days||7。括号可以调用方法。花括号里面不能再写 }。放进普通字符串时，结果会变成文本；dayjs 会变成 ISO 时间。放在 JSON 的值位置（引号外面）时，数字、对象、数组会按 JSON 插入。",
          "?. stops when a step is missing. || uses the right-hand value when the left is empty, for example scope?.value?.days||7. Parentheses call methods. A brace expression cannot contain another }. Inside a plain string the result becomes text, and a dayjs value becomes an ISO time. In a JSON value position, outside quotes, numbers, objects, and arrays are inserted as JSON."
        ),
        examples: [
          "{system?.time?.format('YYYY-MM-DD')}",
          "{system?.time?.subtract(scope?.value?.days||7,'d')}",
          "{system?.math?.floor(system?.math?.random()*100)}",
          "{system?.time?.subtract(system?.math?.random(),'d')}",
        ],
      },
      {
        id: "time",
        title: zh("time 当前时间", "time, the current time"),
        body: zh(
          "system?.time 是求值这一刻的 dayjs 对象。单位可以用全称，也可以用简写：year/y、month/M、week/w、day/d、hour/h、minute/m、second/s、millisecond/ms。month 从 0 开始。format 里 YYYY 是年，MM 是月，DD 是日，HH 是 24 小时，mm 是分，ss 是秒，SSS 是毫秒。",
          "system?.time is a dayjs object for the moment of evaluation. Units accept full names or short forms: year/y, month/M, week/w, day/d, hour/h, minute/m, second/s, millisecond/ms. month is 0-based. In format, YYYY is the year, MM the month, DD the day, HH the hour (24), mm the minute, ss the second, and SSS the millisecond."
        ),
        examples: [
          "{system?.time}",
          "{system?.time?.format('YYYY-MM-DD HH:mm:ss')}",
          "{system?.time?.subtract(7,'d')?.format('YYYY-MM-DD')}",
          "{system?.time?.add(1,'hour')?.startOf('hour')}",
          "{system?.time?.startOf('day')?.valueOf()}",
        ],
        members: TIME_MEMBERS,
      },
      {
        id: "math",
        title: zh("math 数学", "math"),
        body: zh(
          "system?.math 就是 JavaScript 的 Math。常数直接取，函数要加括号。三角函数的参数是弧度，不是角度。",
          "system?.math is JavaScript Math. Read constants directly, and call functions with parentheses. Trig functions take radians, not degrees."
        ),
        examples: [
          "{system?.math?.PI}",
          "{system?.math?.random()}",
          "{system?.math?.floor(1.8)}",
          "{system?.math?.max(scope?.value||0, 0)}",
          "{system?.math?.round(system?.math?.random()*10)}",
        ],
        members: MATH_MEMBERS,
      },
      {
        id: "location",
        title: zh("location 当前页面地址", "location, the page URL"),
        body: zh(
          "system?.location 是当前页的 Location。模板里用它来拼地址、读路径和查询串。assign、replace、reload 会跳转或刷新页面，不要写进会反复求值的模板。",
          "system?.location is the current page Location. Use it to build URLs or read the path and query. assign, replace, and reload navigate or reload the page, so do not put them in a template that evaluates repeatedly."
        ),
        examples: [
          "{system?.location?.origin}",
          "{system?.location?.pathname}",
          "{system?.location?.href}",
          "https://api.example.com{system?.location?.pathname}",
        ],
        members: LOCATION_MEMBERS,
      },
    ],
  },
  scope: {
    root: "scope",
    title: zh("流程数据 scope", "Workflow data scope"),
    intro: zh(
      "scope 是蓝图里节点之间传递的业务数据。上游还没连上或还没跑过时，对应字段是空的，用 ?. 和 || 可以避免整段表达式断掉。",
      "scope is the business data passed between blueprint nodes. Before an upstream node is connected or has run, fields are empty. ?. and || keep the expression from breaking."
    ),
    sections: [
      {
        id: "overview",
        title: zh("是什么", "What it is"),
        body: zh(
          "scope 只在花括号表达式里生效，例如 {scope?.value}。它描述的是这条连线传下来的数据，不是全局变量。可以和 system 写在一起，用系统时间、数学或地址去加工上游数据。",
          "scope works inside brace expressions, for example {scope?.value}. It is the data on this connection, not a global variable. Combine it with system when the upstream data needs the current time, math, or the page URL."
        ),
        examples: ["{scope?.value}", "{scope?.name||''}", "{scope?.a||0}"],
      },
      {
        id: "fields",
        title: zh("单路上游", "One upstream node"),
        body: zh(
          "只有一条上游连线时，数据直接挂在 scope 上。value 是上游输出；id、name、type 是上游节点自己的信息，节点还没执行时这三项也已经有值。value 如果是对象，可以继续往下取，例如 token、headers。",
          "With a single upstream connection, data sits directly on scope. value is the upstream output. id, name, and type describe that node and are available before it runs. When value is an object, keep reading into it, for example token or headers."
        ),
        examples: [
          "{scope?.value}",
          "{scope?.id}",
          "{scope?.name}",
          "{scope?.type}",
          "{scope?.value?.token}",
          "{scope?.value?.headers}",
          "Bearer {scope?.value?.token}",
        ],
        members: [
          { name: "value", summary: zh("上游节点的输出。对象可以继续用 ?. 取字段。", "Output of the upstream node. Use ?. to read fields when it is an object."), usage: "{scope?.value}" },
          { name: "id", summary: zh("上游节点 id。", "Upstream node id."), usage: "{scope?.id}" },
          { name: "name", summary: zh("上游节点名称。", "Upstream node name."), usage: "{scope?.name}" },
          { name: "type", summary: zh("上游节点类型。", "Upstream node type."), usage: "{scope?.type}" },
        ],
      },
      {
        id: "multi",
        title: zh("多路上游", "Several upstream nodes"),
        body: zh(
          "有多条上游连线时，按上游节点 id 分组，不再把 value 直接放在 scope 根上。先写节点 id，再取 value 或节点信息。",
          "With several upstream connections, values are grouped by upstream node id. value is no longer on the scope root. Write the node id first, then value or the node fields."
        ),
        examples: [
          "{scope?.node_abc?.value}",
          "{scope?.node_abc?.name}",
          "{scope?.node_abc?.value?.id}",
        ],
      },
      {
        id: "fallback",
        title: zh("缺省和占位", "Missing values"),
        body: zh(
          "?. 在中间任何一截没有值时停止，整段结果为空。|| 在左边是 null、undefined、0 或空字符串时采用右边。数字缺省常用 ||0，文本缺省常用 ||''。",
          "?. stops when any step is missing, and the whole result is empty. || uses the right side when the left is null, undefined, 0, or an empty string. ||0 is the usual number fallback, and ||'' is the usual text fallback."
        ),
        examples: ["{scope?.a||0}", "{scope?.name||''}", "{scope?.value?.days||7}"],
      },
      {
        id: "nesting",
        title: zh("和 system 一起用", "Using it with system"),
        body: zh(
          "同一个花括号里可以同时出现 scope 和 system。scope 提供业务数字或文本，system 提供时间、数学和地址。",
          "scope and system can share one brace expression. scope supplies the business value, and system supplies time, math, and the page URL."
        ),
        examples: [
          "{system?.time?.subtract(scope?.value?.days||7,'d')}",
          "{system?.math?.max(scope?.value||0, 0)}",
          "{system?.location?.origin}{scope?.value?.path}",
        ],
      },
      {
        id: "spread",
        title: zh("数组展开", "Array spread"),
        body: zh(
          "[...{scope?.路径}] 用来展开数组。写在普通文本里时，各项用逗号拼成一个字符串。写在图表类目这类数组字段里时，会展开成多项，例如 3 条数据变成 3 个类目。system 不能这样展开。",
          "[...{scope?.path}] spreads an array. In plain text, items are joined with commas. In an array field such as chart categories, they become separate items, so 3 rows become 3 categories. system cannot be spread this way."
        ),
        examples: ["[...{scope?.a?.b}]", "[...{scope?.data?.data?.statusName}]", "[...{scope?.labels}]"],
      },
      {
        id: "json",
        title: zh("写进 JSON", "Inside JSON"),
        body: zh(
          "请求头、请求体、JSON 节点都按这段规则处理。模板在引号里面时，只替换成文本。模板在值的位置、引号外面时，对象和数组会变成 JSON。整段字段也可以直接写成一个 scope 表达式，用上游对象充当请求头或请求体。花括号里的引号请用英文 \"。",
          "Headers, bodies, and JSON nodes follow this rule. A template inside quotes is replaced as text. A template in a value position, outside quotes, inserts objects and arrays as JSON. A whole field can also be one scope expression, so an upstream object becomes the headers or body. Use straight \" quotes inside braces."
        ),
        examples: [
          '{"Authorization":"Bearer {scope?.value?.token}"}',
          '{"id":"{scope?.value?.id}"}',
          "{scope?.value?.headers}",
          '{"at":"{system?.time?.toISOString()}"}',
        ],
      },
    ],
  },
};

export function sectionSearchText(section: DocSection): string {
  return [
    section.title["zh-CN"],
    section.title["en-US"],
    section.body["zh-CN"],
    section.body["en-US"],
    ...(section.examples ?? []),
    ...(section.members ?? []).flatMap((member) => [
      member.name,
      member.summary["zh-CN"],
      member.summary["en-US"],
      member.usage ?? "",
    ]),
  ]
    .join("\n")
    .toLowerCase();
}

export type TemplateDocRequest = {
  root: TemplateDocRoot;
  sectionId: string;
  token: string;
  nonce: number;
};

let request: TemplateDocRequest | null = null;
let nonce = 0;
const listeners = new Set<() => void>();

function emitTemplateDoc() {
  listeners.forEach((listener) => listener());
}

export function getTemplateDocRequest(): TemplateDocRequest | null {
  return request;
}

export function subscribeTemplateDoc(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function openTemplateDoc(input: {
  root: TemplateDocRoot;
  sectionId: string;
  token: string;
}): void {
  nonce += 1;
  request = { ...input, nonce };
  emitTemplateDoc();
}

export function closeTemplateDoc(): void {
  if (!request) return;
  request = null;
  emitTemplateDoc();
}
