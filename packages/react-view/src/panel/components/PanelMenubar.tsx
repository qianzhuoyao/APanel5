import React from "react";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@arronqzy/ui";
import type { Locale } from "@arronqzy/i18n";

export type PanelMenubarProps = {
  t: (key: string, params?: Record<string, string | number>) => string;
  handleExport: () => void;
  importInputRef: React.RefObject<HTMLInputElement | null>;
  blueprintImportInputRef: React.RefObject<HTMLInputElement | null>;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  hasUnlockedSelection: boolean;
  selectedIds: string[];
  bringElementsForward: (ids: string[]) => void;
  sendElementsBackward: (ids: string[]) => void;
  bringElementsToFront: (ids: string[]) => void;
  sendElementsToBack: (ids: string[]) => void;
  adjustUniformZoom: (updater: (value: number) => number) => void;
  applyTheme: (dark: boolean) => void;
  isDark: boolean;
  openBlueprintExportDialog: () => void;
  panelFontSize: "sm" | "md" | "lg";
  setPanelFontSize: (value: "sm" | "md" | "lg") => void;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  outputScale: boolean;
  setOutputScale: (value: boolean) => void;
  /** 产品包名（可选，关于二级菜单不展示） */
  packageName?: string | null;
  /** 产品版本号，如 1.1.32 */
  packageVersion?: string | null;
};

export function PanelMenubar({
  t,
  handleExport,
  importInputRef,
  blueprintImportInputRef,
  canUndo,
  canRedo,
  undo,
  redo,
  hasUnlockedSelection,
  selectedIds,
  bringElementsForward,
  sendElementsBackward,
  bringElementsToFront,
  sendElementsToBack,
  adjustUniformZoom,
  applyTheme,
  isDark,
  openBlueprintExportDialog,
  panelFontSize,
  setPanelFontSize,
  locale,
  setLocale,
  outputScale,
  setOutputScale,
  packageVersion,
}: PanelMenubarProps) {
  const versionOnly =
    packageVersion && packageVersion.trim()
      ? t("panel.menubar.versionValue", { version: packageVersion.trim() })
      : t("panel.menubar.versionUnavailable");

  return (
        <Menubar className="h-8 border-0 bg-transparent p-0 shadow-none">
          <MenubarMenu>
            <MenubarTrigger className="px-2 py-1 text-xs font-normal">{t("panel.menubar.file")}</MenubarTrigger>
            <MenubarContent className="z-[10100]">
              <MenubarItem onClick={handleExport}>{t("panel.menubar.export")}</MenubarItem>
              <MenubarItem onClick={() => importInputRef.current?.click()}>{t("panel.menubar.import")}</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger className="px-2 py-1 text-xs font-normal">{t("panel.menubar.edit")}</MenubarTrigger>
            <MenubarContent className="z-[10100]">
              <MenubarItem disabled={!canUndo} onClick={undo}>{t("panel.menubar.undo")}</MenubarItem>
              <MenubarItem disabled={!canRedo} onClick={redo}>{t("panel.menubar.redo")}</MenubarItem>
              <MenubarSeparator />
              <MenubarItem disabled={!hasUnlockedSelection} onClick={() => bringElementsForward(selectedIds)}>{t("panel.menubar.bringForward")}</MenubarItem>
              <MenubarItem disabled={!hasUnlockedSelection} onClick={() => sendElementsBackward(selectedIds)}>{t("panel.menubar.sendBackward")}</MenubarItem>
              <MenubarItem disabled={!hasUnlockedSelection} onClick={() => bringElementsToFront(selectedIds)}>{t("panel.menubar.bringToFront")}</MenubarItem>
              <MenubarItem disabled={!hasUnlockedSelection} onClick={() => sendElementsToBack(selectedIds)}>{t("panel.menubar.sendToBack")}</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger className="px-2 py-1 text-xs font-normal">{t("panel.menubar.view")}</MenubarTrigger>
            <MenubarContent className="z-[10100]">
              <MenubarItem onClick={() => adjustUniformZoom((z) => z - 0.1)}>{t("panel.menubar.zoomOut")}</MenubarItem>
              <MenubarItem onClick={() => adjustUniformZoom((z) => z + 0.1)}>{t("panel.menubar.zoomIn")}</MenubarItem>
              <MenubarSeparator />
              <MenubarItem
                onClick={() => {
                  applyTheme(!isDark);
                }}
              >
                {isDark ? t("panel.menubar.switchToLight") : t("panel.menubar.switchToDark")}
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger className="px-2 py-1 text-xs font-normal">{t("panel.menubar.blueprint")}</MenubarTrigger>
            <MenubarContent className="z-[10100]">
              <MenubarItem onClick={openBlueprintExportDialog}>{t("panel.menubar.export")}</MenubarItem>
              <MenubarItem onClick={() => blueprintImportInputRef.current?.click()}>
                {t("panel.menubar.import")}
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger className="px-2 py-1 text-xs font-normal">{t("panel.menubar.settings")}</MenubarTrigger>
            <MenubarContent className="z-[10100] min-w-[180px]">
              <MenubarRadioGroup
                value={panelFontSize}
                onValueChange={(value) => setPanelFontSize(value as "sm" | "md" | "lg")}
              >
                <MenubarRadioItem value="sm">{t("panel.menubar.fontSmall")}</MenubarRadioItem>
                <MenubarRadioItem value="md">{t("panel.menubar.fontMedium")}</MenubarRadioItem>
                <MenubarRadioItem value="lg">{t("panel.menubar.fontLarge")}</MenubarRadioItem>
              </MenubarRadioGroup>
              <MenubarSeparator />
              <div className="px-2 py-1.5 text-[11px] text-muted-foreground">
                {t("panel.theme.language")}
              </div>
              <MenubarRadioGroup
                value={locale}
                onValueChange={(value) => setLocale(value as "zh-CN" | "en-US")}
              >
                <MenubarRadioItem value="zh-CN">{t("panel.theme.zhCN")}</MenubarRadioItem>
                <MenubarRadioItem value="en-US">{t("panel.theme.enUS")}</MenubarRadioItem>
              </MenubarRadioGroup>
              <MenubarSeparator />
              <MenubarCheckboxItem
                checked={outputScale}
                onCheckedChange={(checked) => setOutputScale(checked === true)}
                title={t("panel.menubar.outputScaleHint")}
              >
                {t("panel.menubar.outputScale")}
              </MenubarCheckboxItem>
              <MenubarSeparator />
              <MenubarSub>
                <MenubarSubTrigger>{t("panel.menubar.about")}</MenubarSubTrigger>
                <MenubarSubContent className="z-[10100] min-w-[100px]">
                  <MenubarItem
                    className="cursor-default select-text"
                    onSelect={(e) => e.preventDefault()}
                    data-abuilder-version={packageVersion ?? undefined}
                    title={`${t("panel.menubar.versionLabel")} ${versionOnly}`}
                  >
                    {versionOnly}
                  </MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>

  );
}
