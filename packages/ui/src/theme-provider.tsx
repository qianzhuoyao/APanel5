"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import { buildThemePaletteCss, type ThemePaletteOptions } from "./lib/theme-palette";

export type AppTheme = "light" | "dark";

export type ArronqzyThemeProviderProps = Omit<
  ThemeProviderProps,
  "attribute" | "defaultTheme" | "enableSystem"
> & {
  defaultTheme?: AppTheme;
  enableSystem?: boolean;
  /** Contrast-checked theme variables generated with chroma-js; `false` keeps the static CSS. */
  palette?: ThemePaletteOptions | false;
};

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  enableSystem = true,
  palette = {},
  ...props
}: ArronqzyThemeProviderProps) {
  const paletteKey = palette ? JSON.stringify(palette) : "";
  const paletteCss = React.useMemo(
    () => (paletteKey ? buildThemePaletteCss(JSON.parse(paletteKey) as ThemePaletteOptions) : ""),
    [paletteKey],
  );

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      {...props}
    >
      {paletteCss ? (
        <style data-arronqzy-theme-palette="" dangerouslySetInnerHTML={{ __html: paletteCss }} />
      ) : null}
      {children}
    </NextThemesProvider>
  );
}

export { useTheme } from "next-themes";
