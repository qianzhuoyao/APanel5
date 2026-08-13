import { AGENT_TOOL_CATALOG } from "../tools/catalog";
import { ABUILDER_HANDBOOK } from "./handbook";
import { PANEL_MATERIAL_TYPES } from "../actions/schema";

export const DEFAULT_MODEL_ID = "Qwen2.5-1.5B-Instruct-q4f16_1-MLC";

export const OPTIONAL_LARGER_MODEL_ID = "Qwen2.5-3B-Instruct-q4f16_1-MLC";

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
] as const;

export const DEFAULT_AGENT_MAX_STEPS = 8;

export function buildSystemPrompt(editorContextJson: string): string {
  return `你是 Abuilder 多步 Agent：通过语义工具操作整个可视化编辑器（面板、图层、蓝图、工作区、视口、主题等）。
本地离线 WebLLM，不能调用云端。

${ABUILDER_HANDBOOK}

${AGENT_TOOL_CATALOG}

可用 materialType：${PANEL_MATERIAL_TYPES.join(", ")}。

【多步规则】
1. 每步只输出【一个】JSON 对象（可包在 \`\`\`json），禁止额外文字。
2. 【本轮 userGoal 最高优先】上文只用于指代；禁止重复执行旧任务。
3. 操作任务：工具 JSON；完成用 agent.done。
4. 问答/能力介绍：只能 reply，严禁改页面。
5. 听不懂：reply 说明，不要瞎猜 panel.add。
6. 改「选中/它」用 selectedIds；刚创建的用 lastActionResult.createdIds。
7. message 中文简短。

少样例（照抄结构）：
reply：{"type":"reply","message":"..."}
加表：{"type":"panel.add","materialType":"table","x":200,"y":160,"message":"已添加表格"}
改宽：{"type":"panel.update","id":"<selectedId>","patch":{"width":400},"message":"已改宽"}
完成：{"type":"agent.done","message":"已完成"}

当前观察（JSON）：
${editorContextJson}`;
}

export function buildForceActionPrompt(): string {
  return `上一步无效。若当前用户目标是明确的改页面操作，请立刻输出可执行工具 JSON；若目标是问答或你听不懂，请输出 {"type":"reply","message":"..."} 说明，不要瞎执行 panel.add。`;
}

export function buildForceReplyPrompt(): string {
  return `用户在纯问答。请只输出 {"type":"reply","message":"用中文 Markdown 回答"}，不要执行任何改页面动作。`;
}

/** Capability / meta questions — never mutate the page. */
const CAPABILITY_RE =
  /你能做什么|能做什么|能干嘛|可以做什么|你会什么|有什么功能|怎么用你|你会干嘛|你是谁|你能帮我|你能做啥|有什么用|帮助说明|^help$|^帮助$/i;

const QUESTION_RE =
  /是什么|怎么用|如何用|有哪些|介绍|讲讲|什么意思|为什么|吗$|呢$|\?|？/;

export function looksLikeCapabilityQuestion(text: string): boolean {
  return CAPABILITY_RE.test(text.trim());
}

export function looksLikeEditIntent(text: string): boolean {
  const s = text.trim();
  if (!s) return false;
  if (looksLikeCapabilityQuestion(s)) return false;
  // Short follow-ups that rely on prior chat / current selection.
  if (
    /^(继续|接着做|接着|再来|再改|再调|改一下|调一下|那个|这个|它|刚才那个|刚加的|把它|给它|同上)/.test(
      s
    ) ||
    /^(继续|接着|再改一下|刚才那个|刚加的)/.test(s) ||
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
  return /改|设置|配置|修改|更新|添加|加一|加个|删除|移除|换成|改成|做成|生成|写入|填充|样式|颜色|宽度|高度|表格|数据|蓝图|节点|连接|保存|预览|撤销|图层|缩放|主题|语言/.test(
    s
  );
}

/** Pure Q&A should skip the multi-step agent loop and just reply once. */
export function looksLikePureQuestion(text: string): boolean {
  const s = text.trim();
  if (!s) return false;
  if (looksLikeCapabilityQuestion(s)) return true;
  if (looksLikeEditIntent(s)) return false;
  return QUESTION_RE.test(s);
}

/**
 * Vague text that is neither a clear edit nor a clear question.
 * Prefer asking for clarification over mutating the page.
 */
export function looksLikeUnclearIntent(text: string): boolean {
  const s = text.trim();
  if (!s) return true;
  if (looksLikeCapabilityQuestion(s)) return false;
  if (looksLikePureQuestion(s)) return false;
  if (looksLikeEditIntent(s)) return false;
  if (/^(你好|您好|在吗|嗨|哈喽|hello|hi|嗯|哦|好的|谢谢|ok)$/i.test(s)) {
    return true;
  }
  // Short leftover with no clear verb — ask instead of guessing.
  if (s.length <= 10 && !/[，。,.!！；;]/.test(s)) return true;
  return false;
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

