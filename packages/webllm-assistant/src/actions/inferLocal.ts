import type { AssistantAction } from "./schema";
import { inferPanelAddFromUserText } from "./schema";

export type LocalInferContext = {
  selectedIds: string[];
};

export type LocalEditorPlan = {
  /** Actions to apply in order (no model). */
  actions: AssistantAction[];
  doneMessage: string;
};

/**
 * High-confidence editor intents handled without WebLLM.
 * Small local models are unreliable; prefer deterministic tools here.
 */
export function inferLocalEditorPlan(
  text: string,
  ctx: LocalInferContext
): LocalEditorPlan | null {
  const s = text.trim();
  if (!s) return null;

  // --- global one-shot tools ---
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

  const selectedId = ctx.selectedIds[0];
  const needsSelection =
    /删|删除|移除|复制|宽度|高度|宽|高|改名|命名|锁住|解锁|置顶|置底/.test(s) &&
    !/(加|添加|新建|创建)/.test(s);

  if (needsSelection && !selectedId) {
    // Clear size/delete/rename intents without selection — don't let the model guess.
    if (
      /(?:宽度|宽|width|高度|高|height)/i.test(s) ||
      /删|删除|移除|复制|改名|命名|置顶|置底|锁/.test(s)
    ) {
      return {
        actions: [
          {
            type: "reply",
            message:
              "请先在画布上选中一个组件，再说具体操作（例如「宽度改成 400」或「删除」）。",
          },
        ],
        doneMessage: "需要先选中组件",
      };
    }
  }

  if (selectedId) {
    if (/^(删除|删掉|移除)(它|这个|选中)?$/.test(s) || /^把(它|这个|选中的?)?(删|删除|移除)/.test(s)) {
      return {
        actions: [
          {
            type: "panel.remove",
            id: selectedId,
            message: "已删除选中组件",
          },
        ],
        doneMessage: "已删除选中组件",
      };
    }
    if (/^(复制|拷贝)(它|这个|选中)?$/.test(s)) {
      return {
        actions: [
          {
            type: "panel.duplicate",
            id: selectedId,
            message: "已复制选中组件",
          },
        ],
        doneMessage: "已复制选中组件",
      };
    }
    if (/置顶|到最前|bring\s*to\s*front/i.test(s)) {
      return {
        actions: [
          {
            type: "panel.zOrder",
            action: "front",
            ids: [selectedId],
            message: "已置顶",
          },
        ],
        doneMessage: "已置顶选中组件",
      };
    }
    if (/置底|到最后|send\s*to\s*back/i.test(s)) {
      return {
        actions: [
          {
            type: "panel.zOrder",
            action: "back",
            ids: [selectedId],
            message: "已置底",
          },
        ],
        doneMessage: "已置底选中组件",
      };
    }

    const width = matchSize(s, "width");
    const height = matchSize(s, "height");
    const name = matchRename(s);
    const patch: Record<string, unknown> = {};
    const parts: string[] = [];
    if (width != null) {
      patch.width = width;
      parts.push(`宽度 ${width}`);
    }
    if (height != null) {
      patch.height = height;
      parts.push(`高度 ${height}`);
    }
    if (name != null) {
      patch.name = name;
      parts.push(`名称「${name}」`);
    }
    if (Object.keys(patch).length) {
      return {
        actions: [
          {
            type: "panel.update",
            id: selectedId,
            patch,
            message: `已更新：${parts.join("、")}`,
          },
        ],
        doneMessage: `已更新选中组件：${parts.join("、")}`,
      };
    }
  }

  // Simple add-only (existing heuristic).
  const add = inferPanelAddFromUserText(s);
  if (add && looksLikeSimpleAddOnly(s)) {
    return {
      actions: [add],
      doneMessage: add.message ?? "已添加组件",
    };
  }

  return null;
}

function matchSize(text: string, kind: "width" | "height"): number | null {
  const re =
    kind === "width"
      ? /(?:宽度|宽|width)\s*(?:改成|设为|设置为|设置成|调成|调到|为|到|=|:)?\s*(\d{2,4})/i
      : /(?:高度|高|height)\s*(?:改成|设为|设置为|设置成|调成|调到|为|到|=|:)?\s*(\d{2,4})/i;
  const m = re.exec(text);
  if (!m) return null;
  const n = Number(m[1]);
  if (!Number.isFinite(n) || n < 8 || n > 4000) return null;
  return Math.round(n);
}

function matchRename(text: string): string | null {
  const m =
    /(?:改名|命名|名字|名称)\s*(?:改成|设为|设置为|为|叫|:)?\s*[「"']?([^「」"'\n]{1,32})[」"']?/.exec(
      text
    );
  if (!m?.[1]) return null;
  const name = m[1].trim();
  if (!name || /^(它|这个|组件)$/.test(name)) return null;
  return name;
}

function looksLikeSimpleAddOnly(text: string): boolean {
  if (!inferPanelAddFromUserText(text)) return false;
  return !/然后|并且|再|保存|选中|改成|设置|宽度|高度|蓝图|图层|预览|主题/.test(
    text
  );
}
