export type AbuilderVueAppProps = {
  class?: string;
  initialZoom?: number;
  defaultTheme?: "dark" | "light";
  previewSearch?: string;
  /** 界面语言。省略时按 localStorage → 浏览器语言 → zh-CN 解析。 */
  locale?: "zh-CN" | "en-US" | null;
};

