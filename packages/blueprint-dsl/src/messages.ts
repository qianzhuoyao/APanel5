export type BlueprintDslLocale = "zh-CN" | "en-US";

const ZH_CN = {
  invalidJson: "不是有效 JSON：{reason}",
  invalidFormat: "格式无效",
  jsonInvalid: "JSON 格式无效",
  jsonEmpty: "JSON 不能为空",
  jsonRootMustBeContainer: "JSON 根节点必须是 object 或 array",
  contentEmpty: "内容为空",
  contentRequired: "内容不能为空",
  codeRequired: "代码不能为空",
  javascriptSyntaxError: "JavaScript 语法错误",
  logicUpdateRequired: "需要定义 update(input) 函数",

  apiItemMustBeObject: "apis[{index}] 必须是对象",
  apiItemFieldRequired: "apis[{index}].{field} 必填且为非空字符串",
  apiItemMethodInvalid: "apis[{index}].method 必须是 {methods} 之一",
  apiItemFieldStringMap: "apis[{index}].{field} 必须是 string 字典",
  apiItemFieldString: "apis[{index}].{field} 必须是字符串",
  apiRootMustBeObject: "根节点必须是对象",
  apiVersionMismatch: "version 必须为 {version}",
  apiNameRequired: "name 必填且为非空字符串",
  apiBaseUrlString: "baseUrl 必须是字符串",
  apiListMustBeArray: "apis 必须是数组",
  apiListEmpty: "apis 至少包含一条接口",
  apiNameDuplicated: "接口名称重复：{name}",
  apiTemplateName: "示例接口集合",
  apiTemplateListUsers: "获取用户列表",
  apiTemplateListUsersDesc: "分页查询用户；page / tenant / token 可用 Scope 模版",
  apiTemplateCreateUser: "创建用户",
  apiTemplateCreateUserDesc: "创建用户；URL 与 body 均支持 Scope 模版",
  apiTemplateGetUser: "获取用户详情",
  apiTemplateGetUserDesc: "按 id 查询；路径里可直接写 Scope 模版",

  fetchUrlMissing: "请求 URL 未配置",
  fetchBodyInvalidJson: "请求体不是有效 JSON：{reason}",
  fetchResponseInvalidJson: "响应不是有效的 JSON",
  fetchAborted: "请求已中止",
  fetchTimeout: "请求超时（{ms}ms）",
  headersTemplateNotObject: "请求头模板解析后不是有效的 JSON 对象",
  headersNotObject: "请求头不是有效的 JSON 对象",

  swaggerInvalid: "Swagger 文档格式无效",
  openApiNoOperations: "未在 OpenAPI 文档中找到接口",
  swagger2NoOperations: "未在 Swagger 2.0 文档中找到接口",
  swaggerUnsupported: "仅支持 OpenAPI 3.x 与 Swagger 2.0 文档",

  storageUnsupported: "当前环境不支持 {storage}",
  storageKeyEmpty: "存储写入 key 解析为空",

  clockCountPositive: "输出次数须大于 0",
  clockIntervalPositive: "当前配置下时钟信号间隔须大于 0 秒",

  lifecycleSignalMissing: "生命周期信号缺失",
  blueprintCycle: "蓝图引用存在死循环：{path}",
  debugMustStartFromLifecycle: "调试会话只能从生命周期节点开始",
  nodeRemoved: "节点已从蓝图中移除",
  clockNeedsTrue: "时钟节点需要收到真信号后才会启动",
  blueprintNeedsTrue: "蓝图节点需要收到真信号后才会执行",
  blueprintNotSelected: "未选择蓝图库中的蓝图",
  blueprintResolverMissing: "蓝图库解析器未配置",
  blueprintRecordMissing: "蓝图库记录不存在: {id}",
  fetchNoUpstream: "数据源节点未收到上游输出，请确认连线与上游节点已执行",
  fetchNeedsTrue: "数据源节点需要收到真信号后才会发起请求",
  jsonNeedsTrue: "JSON 节点需要收到真信号后才会解析",
  storageNeedsTrue: "存储节点需要收到真信号后才会读写缓存",
  andNeedsBothTrue: "并运算：两个输入须均为真信号",
} as const;

export type BlueprintDslMessageKey = keyof typeof ZH_CN;

const EN_US: Record<BlueprintDslMessageKey, string> = {
  invalidJson: "Invalid JSON: {reason}",
  invalidFormat: "invalid format",
  jsonInvalid: "Invalid JSON",
  jsonEmpty: "JSON cannot be empty",
  jsonRootMustBeContainer: "JSON root must be an object or array",
  contentEmpty: "Content is empty",
  contentRequired: "Content cannot be empty",
  codeRequired: "Code cannot be empty",
  javascriptSyntaxError: "JavaScript syntax error",
  logicUpdateRequired: "An update(input) function is required",

  apiItemMustBeObject: "apis[{index}] must be an object",
  apiItemFieldRequired: "apis[{index}].{field} is required and must be a non-empty string",
  apiItemMethodInvalid: "apis[{index}].method must be one of {methods}",
  apiItemFieldStringMap: "apis[{index}].{field} must be a string map",
  apiItemFieldString: "apis[{index}].{field} must be a string",
  apiRootMustBeObject: "Root must be an object",
  apiVersionMismatch: "version must be {version}",
  apiNameRequired: "name is required and must be a non-empty string",
  apiBaseUrlString: "baseUrl must be a string",
  apiListMustBeArray: "apis must be an array",
  apiListEmpty: "apis must contain at least one API",
  apiNameDuplicated: "Duplicate API name: {name}",
  apiTemplateName: "Sample API collection",
  apiTemplateListUsers: "List users",
  apiTemplateListUsersDesc: "Paged user query; page / tenant / token accept Scope templates",
  apiTemplateCreateUser: "Create user",
  apiTemplateCreateUserDesc: "Create a user; URL and body both accept Scope templates",
  apiTemplateGetUser: "Get user detail",
  apiTemplateGetUserDesc: "Query by id; Scope templates can be used directly in the path",

  fetchUrlMissing: "Request URL is not configured",
  fetchBodyInvalidJson: "Request body is not valid JSON: {reason}",
  fetchResponseInvalidJson: "Response is not valid JSON",
  fetchAborted: "Request aborted",
  fetchTimeout: "Request timed out ({ms}ms)",
  headersTemplateNotObject: "Headers template does not resolve to a JSON object",
  headersNotObject: "Headers are not a valid JSON object",

  swaggerInvalid: "Invalid Swagger document",
  openApiNoOperations: "No operations found in the OpenAPI document",
  swagger2NoOperations: "No operations found in the Swagger 2.0 document",
  swaggerUnsupported: "Only OpenAPI 3.x and Swagger 2.0 documents are supported",

  storageUnsupported: "{storage} is not available in this environment",
  storageKeyEmpty: "Storage write key resolved to empty",

  clockCountPositive: "Output count must be greater than 0",
  clockIntervalPositive: "Clock interval must be greater than 0 seconds with the current config",

  lifecycleSignalMissing: "Lifecycle signal is missing",
  blueprintCycle: "Blueprint references form a cycle: {path}",
  debugMustStartFromLifecycle: "A debug session can only start from a lifecycle node",
  nodeRemoved: "Node was removed from the blueprint",
  clockNeedsTrue: "Clock node starts only after receiving a true signal",
  blueprintNeedsTrue: "Blueprint node runs only after receiving a true signal",
  blueprintNotSelected: "No blueprint selected from the library",
  blueprintResolverMissing: "Blueprint library resolver is not configured",
  blueprintRecordMissing: "Blueprint library record not found: {id}",
  fetchNoUpstream: "Data source node received no upstream output; check the connection and that upstream nodes ran",
  fetchNeedsTrue: "Data source node sends the request only after receiving a true signal",
  jsonNeedsTrue: "JSON node parses only after receiving a true signal",
  storageNeedsTrue: "Storage node reads/writes only after receiving a true signal",
  andNeedsBothTrue: "AND: both inputs must be true signals",
};

const CATALOGS: Record<BlueprintDslLocale, Record<BlueprintDslMessageKey, string>> = {
  "zh-CN": ZH_CN,
  "en-US": EN_US,
};

let currentLocale: BlueprintDslLocale = "zh-CN";

/** UI layers call this when the app locale changes; DSL errors are produced in this locale. */
export function setBlueprintDslLocale(locale: BlueprintDslLocale): void {
  currentLocale = locale;
}

export function getBlueprintDslLocale(): BlueprintDslLocale {
  return currentLocale;
}

export function dslMessage(
  key: BlueprintDslMessageKey,
  params?: Record<string, string | number>
): string {
  const template = CATALOGS[currentLocale][key];
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match
  );
}
