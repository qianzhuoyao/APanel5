import { AGENT_TOOL_CATALOG } from "../tools/catalog";
import { ABUILDER_HANDBOOK } from "./handbook";
import { PANEL_MATERIAL_TYPES, parseAssistantAction } from "../actions/schema";

export const DEFAULT_MODEL_ID = "Qwen2.5-1.5B-Instruct-q4f16_1-MLC";

export const OPTIONAL_LARGER_MODEL_ID = "Qwen2.5-3B-Instruct-q4f16_1-MLC";

export const QWEN3_8B_MODEL_ID = "Qwen3-8B-q4f16_1-MLC";

export const ASSISTANT_MODEL_OPTIONS = [
  {
    id: DEFAULT_MODEL_ID,
    labelKey: "panel.ai.model15b",
    hintKey: "panel.ai.model15bHint",
  },
  {
    id: OPTIONAL_LARGER_MODEL_ID,
    labelKey: "panel.ai.model3b",
    hintKey: "panel.ai.model3bHint",
  },
  {
    id: QWEN3_8B_MODEL_ID,
    labelKey: "panel.ai.model8b",
    hintKey: "panel.ai.model8bHint",
  },
] as const;

export function isQwen3ModelId(modelId: string): boolean {
  return modelId.startsWith("Qwen3");
}

export const DEFAULT_AGENT_MAX_STEPS = 8;

export function buildSystemPrompt(editorContextJson: string): string {
  return `你是 Abuilder 可视化编辑器的本地离线助手。先理解用户在说什么，再决定闲聊还是改页面。

${ABUILDER_HANDBOOK}

${AGENT_TOOL_CATALOG}

可用 materialType：${PANEL_MATERIAL_TYPES.join(", ")}。

【意图判断】
- 打招呼 / 测试 / 谢谢：用 reply 正常回问候，不要问「要不要改页面」。
- 明确提问：reply 回答，不要改页面。
- 明确要改页面（添加、删除、改颜色、改大小等）：立刻输出工具 JSON 执行。禁止只用文字说「已经改好了」。
- 只有当话里像在描述页面改动、但没说清要不要改时，才 reply 问一句「要我改当前页面吗？」。
- 用户回答「是 / 要改」时，按上一轮目标执行工具。

【改颜色】图表颜色在 chart.color，不是 style.backgroundColor。
例：{"type":"panel.update","id":"<selectedId>","patch":{"chart":{"color":"#eab308","colorMode":"solid"}},"message":"已把饼图改成黄色"}

【多步规则】
1. 每步只输出一个 JSON（可包在 \`\`\`json），禁止额外文字。
2. 本轮 userGoal 优先；上文只用于指代。
3. 改「选中/它」用 selectedIds。
4. message 必须和真实执行一致。

样例：
问候：{"type":"reply","message":"你好，我是本地离线助手，可以提问或改页面。"}
加表：{"type":"panel.add","materialType":"table","x":200,"y":160,"message":"已添加表格"}
改色：{"type":"panel.update","id":"<selectedId>","patch":{"chart":{"color":"#eab308","colorMode":"solid"}},"message":"已改成黄色"}
完成：{"type":"agent.done","message":"已完成"}

当前观察（JSON）：
${editorContextJson}`;
}

export function buildForceActionPrompt(): string {
  return `若用户在打招呼或提问：reply 正常回答，不要问要不要改页面。若明确要改页面：立刻输出工具 JSON。只有描述了改动却没说清时，才问要不要改页面。禁止口头假装已改好。`;
}

/** Conversational chat — no tools, no JSON. */
export function buildChatSystemPrompt(): string {
  return `你是 Abuilder 可视化编辑器的本地离线助手。
用中文自然回复用户。打招呼就回问候，并可顺便说可以提问或帮他改页面。
不要问「你是要我改当前页面吗」，不要输出 JSON，不要复述规则。`;
}

export function buildForceReplyPrompt(): string {
  return `请直接用中文回答用户的问题，不要输出 JSON。`;
}

const LEAKED_REPLY_RE =
  /^(用中文\s*Markdown\s*回答|\.\.\.|…|直接用中文回答.*)$/i;

/** Turn model output into a user-visible chat reply (plain text preferred). */
export function unwrapChatReply(raw: string): string {
  const text = (raw ?? "").trim();
  if (!text) return "";
  const parsed = parseAssistantAction(text);
  if (parsed.ok && parsed.action.type === "reply") {
    const msg = parsed.action.message.trim();
    if (!msg || LEAKED_REPLY_RE.test(msg)) return "";
    return msg;
  }
  if (LEAKED_REPLY_RE.test(text)) return "";
  if (/^\s*\{/.test(text)) return "";
  return text;
}

/** Capability / meta questions — never mutate the page. */
const CAPABILITY_RE =
  /你能做什么|能做什么|能干嘛|可以做什么|你会什么|有什么功能|怎么用你|你会干嘛|你是谁|你能帮我|你能做啥|有什么用|帮助说明|^help$|^帮助$/i;

const QUESTION_RE =
  /是什么|怎么用|如何用|有哪些|介绍|讲讲|什么意思|为什么|吗$|呢$|\?|？/;

const CONFIRM_EDIT_RE =
  /^(是|是的|对|要|要改|改吧|确认|可以|好的|嗯)(的|啊|呀)?[!！。.]?$/i;

export function looksLikeCapabilityQuestion(text: string): boolean {
  return CAPABILITY_RE.test(text.trim());
}

const SMALL_TALK_RE =
  /^(你好|您好|嗨|哈喽|hello|hi|hey|在吗|在不在|测试一下?|试一下|谢谢|感谢)[!！。.?？~～、，\s]*$/i;

export function looksLikeSmallTalk(text: string): boolean {
  return SMALL_TALK_RE.test(text.trim());
}

export function looksLikeEditIntent(text: string): boolean {
  const s = text.trim();
  if (!s) return false;
  if (looksLikeCapabilityQuestion(s)) return false;
  if (looksLikeSmallTalk(s)) return false;
  if (CONFIRM_EDIT_RE.test(s)) return true;
  // Short follow-ups that rely on prior chat / current selection.
  if (
    /^(继续|接着做|接着|再来|再改|再调|改一下|调一下|那个|这个|它|刚才那个|刚加的|把它|给它|同上)/.test(
      s
    ) ||
    /把它|给它|刚才那个|刚加的/.test(s)
  ) {
    return true;
  }
  if (
    /是什么|怎么用|如何用|有哪些|介绍一下|讲讲|什么意思|能干嘛|可以做什么|能做什么/.test(
      s
    ) &&
    !/帮我改|帮我加|帮我删|帮我做|改成|设置成|修改成/.test(s)
  ) {
    return false;
  }
  return /改|设置|配置|修改|更新|添加|加一|加个|删除|移除|换成|改成|做成|生成|写入|填充|样式|颜色|宽度|高度|期望/.test(
    s
  );
}

/** Clear chat: questions, greetings. Ambiguous page-change talk goes to the agent. */
export function looksLikePureQuestion(text: string): boolean {
  const s = text.trim();
  if (!s) return false;
  if (looksLikeSmallTalk(s)) return true;
  if (looksLikeCapabilityQuestion(s)) return true;
  if (looksLikeEditIntent(s)) return false;
  if (CONFIRM_EDIT_RE.test(s)) return false;
  return QUESTION_RE.test(s);
}

/**
 * Empty input only. Non-empty chat that is not an edit is handled by the model.
 */
export function looksLikeUnclearIntent(text: string): boolean {
  return !text.trim();
}

/**
 * Deterministic FAQ answers for high-frequency questions so small local models
 * don't incorrectly run page mutations (e.g. 「有哪些组件」→ panel.add).
 */
export function tryLocalFaqReply(text: string): string | null {
  const s = text.trim();
  if (!s) return null;
  if (looksLikeCapabilityQuestion(s)) {
    return [
      "我是本地离线助手，可以：",
      "",
      "- **问答**：组件、配置、蓝图等怎么用",
      "- **改页面**：添加 / 修改 / 删除组件",
      "- **图层 · 蓝图 · 保存 · 预览**",
      "",
      "直接说具体需求即可，例如「加一个表格」。听不懂我会直说。",
    ].join("\n");
  }
  if (/有哪些组件|有什么组件|组件有哪些|支持哪些组件|物料有哪些/.test(s)) {
    return [
      "常用组件：",
      "",
      "- **text** 文本 · **table** 表格 · **grid** 网格",
      "- **image / video / audio** 媒体 · **geometry** 几何",
      "- **图表** bar / line / pie / area / scatter / radar / gauge / funnel",
      "",
      "左侧物料库拖入即可；选中后在右侧配置。",
    ].join("\n");
  }
  if (/表格怎么配|怎么配表格|表格如何配置/.test(s)) {
    return [
      "表格配置要点：",
      "",
      "- 静态：`table.rowsText`（JSON）",
      "- 动态：`table.source`（如 `{scope?.list}`）",
      "- 列：`table.columns`；映射后再用 displayTemplate",
      "",
      "选中表格 → 右侧「表格」配置区。",
    ].join("\n");
  }
  if (/蓝图怎么用|怎么用蓝图|蓝图是什么|如何用蓝图/.test(s)) {
    return [
      "蓝图用于编排逻辑：",
      "",
      "- 底部打开蓝图面板",
      "- 常用节点：lifecycle / clock / logic / fetch / json",
      "- 用连线把节点串起来，再运行",
      "",
      "也可让我说「蓝图加定时器」来自动添加。",
    ].join("\n");
  }
  if (/图层怎么用|怎么用图层|图层是什么/.test(s)) {
    return [
      "图层用于分隔画布内容：",
      "",
      "- 可新建 / 重命名 / 锁定 / 删除图层",
      "- 锁定后该层不能添加或修改组件",
      "- 切换活动图层后再添加组件会落到该层",
    ].join("\n");
  }
  return null;
}

export const UNCLEAR_INTENT_REPLY = [
  "我没听懂你的意思。",
  "",
  "请说清楚是要**提问**还是**改页面**，例如：",
  "- 「你能做什么」",
  "- 「有哪些组件」",
  "- 「加一个表格」",
  "- 「把选中组件宽度改成 400」",
].join("\n");

