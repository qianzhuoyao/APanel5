import { useMemo, useState } from "react";
import { ThemeProvider } from "@arronqzy/ui";
import { I18nProvider } from "@arronqzy/i18n/react";
import type { Locale } from "@arronqzy/i18n";
import {
  ReactViewOnlinePreview,
  ReactViewPanel,
  parseOnlinePreviewSearchParams,
} from "@arronqzy/react-view";

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
};

export function App({
  className,
  initialZoom,
  defaultTheme = "dark",
  locale = null,
  previewSearch,
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

  if (previewParams) {
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      document.documentElement.dataset.theme = "light";
    }

    return (
      <I18nProvider locale={effectiveLocale} onLocaleChange={setLocaleState}>
        <div
          className="light min-h-[100vh] w-full bg-white text-gray-900"
          data-theme="light"
        >
          <ReactViewOnlinePreview
            projectId={previewParams.projectId}
            previewInstanceId={previewParams.previewInstanceId}
          />
        </div>
      </I18nProvider>
    );
  }

  return (
    <I18nProvider locale={effectiveLocale} onLocaleChange={setLocaleState}>
      <ThemeProvider defaultTheme={defaultTheme} enableSystem={false}>
        <ReactViewPanel className={className} initialZoom={initialZoom} />
      </ThemeProvider>
    </I18nProvider>
  );
}
