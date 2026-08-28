import React, { useCallback, useState } from "react";
import { useI18n } from "@arronqzy/i18n/react";
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@arronqzy/ui";
import type { PanelElement, PanelElementStyle } from "../../types";
import { readFileAsDataUrl, runBusyTask } from "../../utils/async-work";
import { getPanelMessages } from "../../constants/messages";
import { type ConfigSectionHelpers, type UpdateElement } from "./helpers";

export function PanelConfigStyleSections({
  element,
  helpers,
  updateElement,
}: {
  element: PanelElement;
  helpers: ConfigSectionHelpers;
  updateElement: UpdateElement;
}) {
  const { t } = useI18n();
  const messages = React.useMemo(() => getPanelMessages(t), [t]);
  const { renderSection, renderFieldGroup, renderColorField } = helpers;
  const selectedElement = element;
  const [uploadStatus, setUploadStatus] = useState("");

  const updateSelectedStyle = useCallback(
    (patch: Partial<PanelElementStyle>) => {
      updateElement(selectedElement.id, {
        style: { ...(selectedElement.style ?? {}), ...patch },
      });
    },
    [selectedElement, updateElement]
  );

  const handleUploadBackgroundImage = useCallback(
    async (file: File) => {
      try {
        await runBusyTask(t("common.uploadingFile"), async () => {
          const base64 = await readFileAsDataUrl(file, messages.readImageFailed, "image");
          updateSelectedStyle({
            backgroundImage: `url("${base64}")`,
          });
          setUploadStatus(t("panel.config.uploadWrittenBase64"));
          try {
            const form = new FormData();
            form.append("file", file);
            const resp = await fetch("/api/upload", { method: "POST", body: form });
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            const data = (await resp.json()) as { url?: string };
            if (data.url) {
              updateSelectedStyle({ backgroundImageRemoteUrl: data.url });
              setUploadStatus(t("panel.config.uploadServerAndBase64"));
            }
          } catch {
            setUploadStatus(t("panel.config.uploadServerFailedKeepBase64"));
          }
        });
      } catch (error) {
        setUploadStatus(
          error instanceof Error ? error.message : messages.readImageFailed
        );
      }
    },
    [messages.readImageFailed, t, updateSelectedStyle]
  );

  return (
    <>
          {renderSection(
            "styleBackground",
            t("panel.config.sectionStyleBackground"),
            <>
              {renderFieldGroup(
                t("panel.config.groupBgFill"),
                <>
                  {renderColorField(
                    t("panel.config.backgroundColor"),
                    selectedElement.style?.backgroundColor ?? "",
                    (next) => updateSelectedStyle({ backgroundColor: next || undefined })
                  )}
                </>
              )}
              {renderFieldGroup(
                t("panel.config.groupBgLayout"),
                <>
                  <label className="block space-y-1">
                    <div>{t("panel.config.backgroundImage")}</div>
                    <Input
                      value={selectedElement.style?.backgroundImage ?? ""}
                      onChange={(e) => updateSelectedStyle({ backgroundImage: e.target.value || undefined })}
                      placeholder='url("https://...") / linear-gradient(...)'
                      className="h-7"
                    />
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="inline-flex cursor-pointer items-center rounded border border-border px-2 py-1 text-[11px] hover:bg-accent">
                      {t("panel.config.uploadImage")}
                      <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          e.currentTarget.value = "";
                          if (!file) return;
                          await handleUploadBackgroundImage(file);
                        }}
                      />
                    </label>
                    {uploadStatus ? (
                      <span className="text-[11px] text-muted-foreground">{uploadStatus}</span>
                    ) : null}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                  <label className="block space-y-1">
                    <div>{t("panel.config.backgroundSize")}</div>
                    <Select
                      value={selectedElement.style?.backgroundSize ?? "__none__"}
                      onValueChange={(value) =>
                        updateSelectedStyle({
                          backgroundSize: value === "__none__" ? undefined : value,
                        })
                      }
                    >
                      <SelectTrigger className="h-7">
                        <SelectValue placeholder={t("panel.config.selectBackgroundSize")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">{t("common.default")}</SelectItem>
                        <SelectItem value="cover">cover</SelectItem>
                        <SelectItem value="contain">contain</SelectItem>
                        <SelectItem value="100% 100%">100% 100%</SelectItem>
                        <SelectItem value="auto">auto</SelectItem>
                      </SelectContent>
                    </Select>
                  </label>
                  <label className="block space-y-1">
                    <div>{t("panel.config.backgroundPosition")}</div>
                    <Select
                      value={selectedElement.style?.backgroundPosition ?? "__none__"}
                      onValueChange={(value) =>
                        updateSelectedStyle({
                          backgroundPosition: value === "__none__" ? undefined : value,
                        })
                      }
                    >
                      <SelectTrigger className="h-7">
                        <SelectValue placeholder={t("panel.config.selectBackgroundPosition")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">{t("common.default")}</SelectItem>
                        <SelectItem value="center">center</SelectItem>
                        <SelectItem value="top">top</SelectItem>
                        <SelectItem value="bottom">bottom</SelectItem>
                        <SelectItem value="left">left</SelectItem>
                        <SelectItem value="right">right</SelectItem>
                        <SelectItem value="top left">top left</SelectItem>
                        <SelectItem value="top right">top right</SelectItem>
                        <SelectItem value="bottom left">bottom left</SelectItem>
                        <SelectItem value="bottom right">bottom right</SelectItem>
                      </SelectContent>
                    </Select>
                  </label>
                </div>
                </>,
                undefined,
                { groupKey: "styleBgLayout", defaultOpen: false }
              )}
            </>,
            false,
            [t("panel.config.backgroundColor"), t("panel.config.backgroundImage"), "background", "backgroundSize", "backgroundPosition", t("panel.config.searchKwLayout")]
          )}
          {renderSection(
            "styleBorder",
            t("panel.config.sectionStyleBorder"),
            <>
              {renderFieldGroup(
                t("panel.config.groupBorderGeometry"),
                <div className="grid grid-cols-2 gap-2">
                  <label className="block space-y-1">
                    <div>{t("panel.config.borderWidth")}</div>
                    <Input
                      type="number"
                      min={0}
                      value={selectedElement.style?.borderWidth ?? 0}
                      onChange={(e) =>
                        updateSelectedStyle({ borderWidth: Math.max(0, Number(e.target.value) || 0) })
                      }
                      className="h-7"
                    />
                  </label>
                  <label className="block space-y-1">
                    <div>{t("panel.config.borderRadius")}</div>
                    <Input
                      type="number"
                      min={0}
                      value={selectedElement.style?.borderRadius ?? 0}
                      onChange={(e) =>
                        updateSelectedStyle({ borderRadius: Math.max(0, Number(e.target.value) || 0) })
                      }
                      className="h-7"
                    />
                  </label>
                </div>
              )}
              {renderFieldGroup(
                t("panel.config.groupBorderVisual"),
                <div className="grid grid-cols-2 gap-2">
                  <label className="block space-y-1">
                    <div>{t("panel.config.borderStyle")}</div>
                    <Select
                      value={selectedElement.style?.borderStyle ?? "solid"}
                      onValueChange={(value) =>
                        updateSelectedStyle({
                          borderStyle: value as NonNullable<PanelElementStyle["borderStyle"]>,
                        })
                      }
                    >
                      <SelectTrigger className="h-7">
                        <SelectValue placeholder={t("panel.config.selectBorderStyle")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">none</SelectItem>
                        <SelectItem value="solid">solid</SelectItem>
                        <SelectItem value="dashed">dashed</SelectItem>
                        <SelectItem value="dotted">dotted</SelectItem>
                        <SelectItem value="double">double</SelectItem>
                      </SelectContent>
                    </Select>
                  </label>
                  {renderColorField(
                    t("panel.config.borderColor"),
                    selectedElement.style?.borderColor ?? "",
                    (next) => updateSelectedStyle({ borderColor: next || undefined })
                  )}
                </div>
              )}
            </>,
            false,
            [t("panel.config.searchKwBorder"), "border", t("panel.config.searchKwWidth"), t("panel.config.searchKwRadius"), t("panel.config.color"), t("panel.config.searchKwStyle")]
          )}
    </>
  );
}
