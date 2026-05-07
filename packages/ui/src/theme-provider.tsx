"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

export type AppTheme = "light" | "dark";

export type ArronThemeProviderProps = Omit<
  ThemeProviderProps,
  "attribute" | "defaultTheme" | "enableSystem"
> & {
  defaultTheme?: AppTheme;
  enableSystem?: boolean;
};

export function ThemeProvider({
  children,
  defaultTheme = "light",
  enableSystem = true,
  ...props
}: ArronThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

