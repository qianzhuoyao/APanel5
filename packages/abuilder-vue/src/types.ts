import type { WorkspaceProjectRecord } from "@arronqzy/vue-view";

export type { WorkspaceProjectRecord };

export type AbuilderVueAppProps = {
  class?: string;
  initialZoom?: number;
  defaultTheme?: "dark" | "light";
  previewSearch?: string;
  /**
   * 是否为预览模式。`true` 时根据 `initialWorkspace` 直接渲染预览页；`false` 为编辑面板。
   * @default false
   */
  preview?: boolean;
  /** 界面语言。省略时按 localStorage → 浏览器语言 → zh-CN 解析。 */
  locale?: "zh-CN" | "en-US" | null;
  /**
   * 隔离 IndexedDB / localStorage / BroadcastChannel。
   * 同一页面挂多个 App 时传入不同值，避免工作区、蓝图库、预览缓存互相覆盖。
   * 省略或空字符串保持历史全局库名。
   */
  nameSpace?: string | null;
  /**
   * 外部传入的完整工作区。省略或空则首次渲染空画布 / 空蓝图，不会自动打开 IndexedDB 中的记录。
   */
  initialWorkspace?: WorkspaceProjectRecord | null;
};

