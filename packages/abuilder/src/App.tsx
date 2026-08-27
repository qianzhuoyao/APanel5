import { useMemo, useState, type ReactNode } from "react";
import { ThemeProvider } from "@arronqzy/ui";
import { I18nProvider } from "@arronqzy/i18n/react";
import type { Locale } from "@arronqzy/i18n";
import {
  ReactViewOnlinePreview,
  ReactViewPanel,
  parseOnlinePreviewSearchParams,
} from "@arronqzy/react-view";
import type { WorkspaceProjectRecord } from "@arronqzy/react-view";

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
   * 编辑模式：挂载后加载到面板；预览模式：直接渲染预览页。
   */
  initialWorkspace?: WorkspaceProjectRecord | null;
};

function PreviewShell({
  locale,
  onLocaleChange,
  children,
}: {
  locale: Locale | null;
  onLocaleChange: (locale: Locale) => void;
  children: ReactNode;
}) {
  if (typeof document !== "undefined") {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
    document.documentElement.dataset.theme = "light";
  }

  return (
    <I18nProvider locale={locale} onLocaleChange={onLocaleChange}>
      <div
        className="light min-h-[100vh] w-full bg-white text-gray-900"
        data-theme="light"
      >
        {children}
      </div>
    </I18nProvider>
  );
}

export function App({
  className,
  initialZoom,
  defaultTheme = "dark",
  locale = null,
  previewSearch,
  preview = false,
  initialWorkspace = null,
}: AbuilderAppProps) {
  const [localeState, setLocaleState] = useState<Locale | null>(locale);
  const effectiveLocale = locale ?? localeState;

  const search =
    previewSearch ??
    (typeof window !== "undefined" ? window.location.search : "");

  const previewParams = useMemo(
    () => parseOnlinePreviewSearchParams(search),
    [search]
  );

  if (preview) {
    return (
      <PreviewShell locale={effectiveLocale} onLocaleChange={setLocaleState}>
        <ReactViewOnlinePreview
          workspace={initialWorkspace}
          projectId={initialWorkspace?.id}
        />
      </PreviewShell>
    );
  }

  if (previewParams) {
    return (
      <PreviewShell locale={effectiveLocale} onLocaleChange={setLocaleState}>
        <ReactViewOnlinePreview
          projectId={previewParams.projectId}
          previewInstanceId={previewParams.previewInstanceId}
        />
      </PreviewShell>
    );
  }

  return (
    <I18nProvider locale={effectiveLocale} onLocaleChange={setLocaleState}>
      <ThemeProvider defaultTheme={defaultTheme} enableSystem={false}>
        <ReactViewPanel
          className={className}
          initialZoom={initialZoom}
          initialWorkspace={initialWorkspace}
        />
      </ThemeProvider>
    </I18nProvider>
  );
}
