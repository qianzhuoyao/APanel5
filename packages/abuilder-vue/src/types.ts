import type { AbuilderPlugin } from "@arronqzy/abuilder";
import type { Locale, WorkspaceProjectRecord } from "@arronqzy/abuilder";

export type { WorkspaceProjectRecord, AbuilderPlugin };

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
  locale?: Locale | null;
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
  /**
   * 按 IndexedDB id 打开工作区（不 remount）。
   * 与 `initialWorkspace` 同时存在时：首次优先完整记录；之后 id 变化从 IndexedDB 打开。
   */
  workspaceId?: string | null;
  /**
   * 启用的可选插件。例如 `plugins={['ai']}` 开启离线 AI 助手。
   * 默认不启用任何插件。
   */
  plugins?: AbuilderPlugin[];
  /**
   * 当前项目图标。URL、打包后的资源地址，或一段 `<svg>` 标记。
   * 显示在编辑器左上角，并作为浏览器标签页图标。
   * 省略或空字符串则不显示、不改标签页图标。
   */
  pIcon?: string | null;
  /**
   * 当前项目名称，写入浏览器标签页标题。
   * 省略或空字符串则不改 `document.title`。
   */
  pTitle?: string | null;
};
