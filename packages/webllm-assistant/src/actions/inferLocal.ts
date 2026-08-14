import type { AssistantAction } from "./schema";

export type LocalInferContext = {
  selectedIds: string[];
};

export type LocalEditorPlan = {
  /** Actions to apply in order (no model). */
  actions: AssistantAction[];
  doneMessage: string;
};

/**
 * Only unambiguous workspace commands. Page edits go to the model
 * so it can understand intent or ask whether to change the page.
 */
export function inferLocalEditorPlan(
  text: string,
  _ctx: LocalInferContext
): LocalEditorPlan | null {
  const s = text.trim();
  if (!s) return null;

  if (/^(撤销|undo)$/i.test(s) || /^撤销一下$/.test(s)) {
    return {
      actions: [{ type: "history.undo", message: "已撤销" }],
      doneMessage: "已撤销",
    };
  }
  if (/^(重做|redo)$/i.test(s) || /^重做一下$/.test(s)) {
    return {
      actions: [{ type: "history.redo", message: "已重做" }],
      doneMessage: "已重做",
    };
  }
  if (/^(保存|保存一下|保存项目|保存工作区|保存当前项目)$/.test(s)) {
    return {
      actions: [{ type: "workspace.save", message: "已保存" }],
      doneMessage: "已保存工作区",
    };
  }
  if (/^(预览|打开预览|预览一下)$/i.test(s)) {
    return {
      actions: [{ type: "workspace.preview", message: "已打开预览" }],
      doneMessage: "已打开预览",
    };
  }
  if (/^(深色|暗色|夜间|dark\s*mode)$/i.test(s) || /切换(到)?深色/.test(s)) {
    return {
      actions: [{ type: "ui.setTheme", theme: "dark", message: "已切换深色" }],
      doneMessage: "已切换到深色主题",
    };
  }
  if (/^(浅色|亮色|日间|light\s*mode)$/i.test(s) || /切换(到)?浅色/.test(s)) {
    return {
      actions: [{ type: "ui.setTheme", theme: "light", message: "已切换浅色" }],
      doneMessage: "已切换到浅色主题",
    };
  }
  if (/^(放大|放大一点|zoom\s*in)$/i.test(s)) {
    return {
      actions: [
        {
          type: "viewport.zoom",
          value: 0.1,
          mode: "delta",
          message: "已放大",
        },
      ],
      doneMessage: "已放大画布",
    };
  }
  if (/^(缩小|缩小一点|zoom\s*out)$/i.test(s)) {
    return {
      actions: [
        {
          type: "viewport.zoom",
          value: -0.1,
          mode: "delta",
          message: "已缩小",
        },
      ],
      doneMessage: "已缩小画布",
    };
  }
  if (/^(适应画布|适应窗口|fit)$/i.test(s)) {
    return {
      actions: [{ type: "viewport.fit", message: "已适应画布" }],
      doneMessage: "已适应画布",
    };
  }

  return null;
}
