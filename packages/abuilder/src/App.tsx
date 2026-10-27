import { forwardRef, useEffect, useMemo, useState, type ReactNode } from "react";
import { ThemeProvider } from "@arronqzy/ui";
import type { Locale } from "@arronqzy/i18n";
import {
  ReactViewOnlinePreview,
  ReactViewPanel,
  parseOnlinePreviewSearchParams,
  type AbuilderViewHandle,
} from "@arronqzy/react-view";
import type { WorkspaceProjectRecord } from "@arronqzy/react-view";
import { ABUILDER_PACKAGE_NAME, ABUILDER_VERSION } from "./version";

/** 可选功能插件。目前仅 `ai`（离线 WebLLM 助手）。 */
export type AbuilderPlugin = "ai";

export type AbuilderAppProps = {
  className?: string;
  initialZoom?: number;
  /** 编辑器默认主题 */
  defaultTheme?: "dark" | "light";
  /**
   * 界面语言。省略时按 localStorage → 浏览器语言 → zh-CN 解析。
   */
  locale?: Locale | null;
  /**
   * 在线预览模式的 URL 查询串。
   * 默认读取 `window.location.search`；含 `?preview=online&projectId=...` 时进入预览页。
   */
  previewSearch?: string;
  /**
   * 是否为预览模式。`true` 时根据 `initialWorkspace` 直接渲染预览页；`false` 为编辑面板。
   * @default false
   */
  preview?: boolean;
  /**
   * 外部传入的完整工作区数据（面板 + 蓝图）。
   * 编辑模式：挂载后按这份数据完整渲染；预览模式：直接渲染预览页。
   * 省略或空：首次显示空画布 / 空蓝图，不会自动选中 IndexedDB 中的工作区。
   */
  initialWorkspace?: WorkspaceProjectRecord | null;
  /**
   * 按 IndexedDB id 打开工作区（不 remount）。
   * 与 `initialWorkspace` 同时存在时：首次优先完整记录；之后 id 变化从 IndexedDB 打开。
   */
  workspaceId?: string | null;
  /**
   * 隔离 IndexedDB / localStorage / BroadcastChannel。
   * 同一页面挂多个 App 时传入不同值，避免工作区、蓝图库、预览缓存互相覆盖。
   * 省略或空字符串保持历史全局库名。
   */
  nameSpace?: string | null;
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

function isSvgMarkup(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.startsWith("<svg") || trimmed.startsWith("<?xml");
}

function useProjectChrome(pTitle?: string | null, pIcon?: string | null) {
  useEffect(() => {
    if (typeof document === "undefined") return;
    const title = pTitle?.trim();
    if (!title) return;
    const previous = document.title;
    document.title = title;
    return () => {
      document.title = previous;
    };
  }, [pTitle]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const icon = pIcon?.trim();
    if (!icon) return;

    let href = icon;
    let revoke: (() => void) | undefined;
    if (isSvgMarkup(icon)) {
      const blob = new Blob([icon], { type: "image/svg+xml" });
      href = URL.createObjectURL(blob);
      revoke = () => URL.revokeObjectURL(href);
    }

    const stashed = [
      ...document.querySelectorAll<HTMLLinkElement>(
        "link[rel='icon'], link[rel='shortcut icon'], link[rel='apple-touch-icon']"
      ),
    ].map((el) => ({ el, rel: el.rel }));
    stashed.forEach(({ el }) => {
      el.rel = "abuilder-icon-stash";
    });

    const link = document.createElement("link");
    link.rel = "icon";
    link.href = href;
    if (isSvgMarkup(icon) || /\.svg($|\?)/i.test(href)) {
      link.type = "image/svg+xml";
    }
    link.dataset.abuilderPicon = "true";
    document.head.appendChild(link);

    return () => {
      link.remove();
      stashed.forEach(({ el, rel }) => {
        el.rel = rel;
      });
      revoke?.();
    };
  }, [pIcon]);
}

function PreviewShell({ children }: { children: ReactNode }) {
  if (typeof document !== "undefined") {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
    document.documentElement.dataset.theme = "light";
  }

  return (
    <div
      className="light min-h-[100vh] w-full bg-white text-gray-900"
      data-theme="light"
    >
      {children}
    </div>
  );
}

export const App = forwardRef<AbuilderViewHandle, AbuilderAppProps>(function App(
  {
    className,
    initialZoom,
    defaultTheme = "dark",
    locale = null,
    previewSearch,
    preview = false,
    initialWorkspace = null,
    workspaceId = null,
    nameSpace = null,
    plugins = [],
    pIcon = null,
    pTitle = null,
  },
  ref
) {
  const [localeState, setLocaleState] = useState<Locale | null>(locale);
  const effectiveLocale = locale ?? localeState;
  const enableAi = plugins.includes("ai");
  const projectIcon = pIcon?.trim() || null;
  useProjectChrome(pTitle, projectIcon);

  const search =
    previewSearch ??
    (typeof window !== "undefined" ? window.location.search : "");

  const previewParams = useMemo(
    () => parseOnlinePreviewSearchParams(search),
    [search]
  );

  if (preview) {
    return (
      <PreviewShell>
        <ReactViewOnlinePreview
          workspace={initialWorkspace}
          projectId={initialWorkspace?.id}
          locale={effectiveLocale}
          onLocaleChange={setLocaleState}
          nameSpace={nameSpace}
        />
      </PreviewShell>
    );
  }

  if (previewParams) {
    return (
      <PreviewShell>
        <ReactViewOnlinePreview
          projectId={previewParams.projectId}
          previewInstanceId={previewParams.previewInstanceId}
          locale={effectiveLocale}
          onLocaleChange={setLocaleState}
          nameSpace={previewParams.nameSpace ?? nameSpace}
        />
      </PreviewShell>
    );
  }

  return (
    <ThemeProvider defaultTheme={defaultTheme} enableSystem={false}>
      <ReactViewPanel
        ref={ref}
        className={className}
        initialZoom={initialZoom}
        initialWorkspace={initialWorkspace}
        workspaceId={workspaceId}
        locale={effectiveLocale}
        onLocaleChange={setLocaleState}
        nameSpace={nameSpace}
        packageName={ABUILDER_PACKAGE_NAME}
        packageVersion={ABUILDER_VERSION}
        enableAi={enableAi}
        projectIcon={projectIcon}
      />
    </ThemeProvider>
  );
});
