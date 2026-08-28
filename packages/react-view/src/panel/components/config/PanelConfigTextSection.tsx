import { useCallback, useEffect, useRef } from "react";
import { useI18n } from "@arronqzy/i18n/react";
import {
  Checkbox,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@arronqzy/ui";
import type { PanelElement } from "../../types";
import { cssTextLineHeight, cssTextAlignStyle } from "../../utils/panelElementDefaults";
import { type ConfigSectionHelpers, type UpdateElement } from "./helpers";

export function PanelConfigTextSection({
  element,
  helpers,
  updateElement,
}: {
  element: PanelElement;
  helpers: ConfigSectionHelpers;
  updateElement: UpdateElement;
}) {
  const { t } = useI18n();
  const { renderSection, renderFieldGroup, renderColorField } = helpers;
  const selectedElement = element;
  const textEditorRef = useRef<HTMLDivElement | null>(null);

  const updateSelectedText = useCallback(
    (patch: Partial<PanelElement>) => {
      if (selectedElement.materialType !== "text") return;
      updateElement(selectedElement.id, patch);
    },
    [selectedElement, updateElement]
  );

  useEffect(() => {
    if (selectedElement.materialType !== "text") return;
    const nextHtml =
      selectedElement.textHtml ?? `<p>${t("panel.defaults.doubleClickTextHtml")}</p>`;
    if (textEditorRef.current && textEditorRef.current.innerHTML !== nextHtml) {
      textEditorRef.current.innerHTML = nextHtml;
    }
  }, [selectedElement.id, selectedElement.materialType, selectedElement.textHtml]);

  const execTextCommand = (cmd: "bold" | "italic" | "underline") => {
    textEditorRef.current?.focus();
    document.execCommand(cmd);
    const next = textEditorRef.current?.innerHTML ?? "";
    if (selectedElement.materialType === "text") {
      updateElement(selectedElement.id, { textHtml: next || "<p><br/></p>" });
    }
  };

  return (
    <>
      {
            renderSection(
              "textConfig",
              t("panel.config.sectionText"),
              <>
                {renderFieldGroup(
                  t("panel.config.groupTextContent"),
                  <>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        className="rounded border border-border px-2 py-1 text-[11px] hover:bg-accent"
                        onClick={() => execTextCommand("bold")}
                      >
                        B
                      </button>
                      <button
                        type="button"
                        className="rounded border border-border px-2 py-1 text-[11px] italic hover:bg-accent"
                        onClick={() => execTextCommand("italic")}
                      >
                        I
                      </button>
                      <button
                        type="button"
                        className="rounded border border-border px-2 py-1 text-[11px] underline hover:bg-accent"
                        onClick={() => execTextCommand("underline")}
                      >
                        U
                      </button>
                    </div>
                    <div
                      ref={textEditorRef}
                      data-config-field="textHtml"
                      data-panel-user-text=""
                      className="min-h-[120px] rounded border border-border bg-background px-2 py-1.5 leading-6 outline-none"
                      style={{
                        fontFamily: selectedElement.textFontFamily || undefined,
                        fontSize: selectedElement.textFontSize
                          ? `${selectedElement.textFontSize}px`
                          : undefined,
                        fontWeight: selectedElement.textFontWeight || undefined,
                        color: selectedElement.textColor || undefined,
                        lineHeight: cssTextLineHeight(selectedElement.textLineHeight),
                        ...cssTextAlignStyle(selectedElement.textAlign),
                      }}
                      contentEditable
                      suppressContentEditableWarning
                      onInput={(e) => {
                        const nextHtml = (e.currentTarget as HTMLDivElement).innerHTML;
                        updateSelectedText({
                          textHtml: nextHtml || "<p><br/></p>",
                        });
                      }}
                    />
                  </>
                )}
                {renderFieldGroup(
                  t("panel.config.groupTextStyle"),
                  <>
                    <label className="block space-y-1">
                      <div>{t("panel.config.fontFamily")}</div>
                      <Input
                        value={selectedElement.textFontFamily ?? ""}
                        onChange={(e) =>
                          updateSelectedText({
                            textFontFamily: e.target.value || undefined,
                          })
                        }
                        placeholder={t("panel.config.fontFamilyPlaceholder")}
                        className="h-7"
                      />
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="block space-y-1">
                        <div>{t("panel.config.fontSizePx")}</div>
                        <Input
                          type="number"
                          min={8}
                          max={200}
                          step={1}
                          value={selectedElement.textFontSize ?? 14}
                          onChange={(e) =>
                            updateSelectedText({
                              textFontSize: Math.max(8, Number(e.target.value) || 14),
                            })
                          }
                          className="h-7"
                        />
                      </label>
                      <label className="block space-y-1">
                        <div>{t("panel.config.fontWeight")}</div>
                        <Select
                          value={selectedElement.textFontWeight ?? "400"}
                          onValueChange={(value) =>
                            updateSelectedText({
                              textFontWeight: value,
                            })
                          }
                        >
                          <SelectTrigger className="h-7">
                            <SelectValue placeholder={t("panel.config.selectFontWeight")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="300">300</SelectItem>
                            <SelectItem value="400">400</SelectItem>
                            <SelectItem value="500">500</SelectItem>
                            <SelectItem value="600">600</SelectItem>
                            <SelectItem value="700">700</SelectItem>
                          </SelectContent>
                        </Select>
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="block space-y-1">
                        <div>{t("panel.config.textAlign")}</div>
                        <Select
                          value={selectedElement.textAlign ?? "left"}
                          onValueChange={(value) =>
                            updateSelectedText({
                              textAlign: value as PanelElement["textAlign"],
                            })
                          }
                        >
                          <SelectTrigger className="h-7">
                            <SelectValue placeholder={t("panel.config.selectTextAlign")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="left">{t("panel.config.alignLeft")}</SelectItem>
                            <SelectItem value="center">{t("panel.config.alignCenter")}</SelectItem>
                            <SelectItem value="middle">{t("panel.config.alignMiddle")}</SelectItem>
                            <SelectItem value="right">{t("panel.config.alignRight")}</SelectItem>
                            <SelectItem value="justify">{t("panel.config.alignJustify")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </label>
                      <label className="block space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span>{t("panel.config.lineHeight")}</span>
                          <label className="flex items-center gap-1 font-normal">
                            <Checkbox
                              checked={selectedElement.textLineHeight === "auto"}
                              className="h-3.5 w-3.5 border-2 border-foreground/80 bg-background ring-1 ring-foreground/40 data-[state=checked]:border-primary data-[state=checked]:ring-primary/40"
                              onCheckedChange={(checked) =>
                                updateSelectedText({
                                  textLineHeight: checked === true ? "auto" : 1.6,
                                })
                              }
                            />
                            <span>{t("panel.config.lineHeightAuto")}</span>
                          </label>
                        </div>
                        <Input
                          type="number"
                          min={1}
                          max={3}
                          step={0.1}
                          disabled={selectedElement.textLineHeight === "auto"}
                          placeholder={t("panel.config.lineHeightAuto")}
                          value={
                            selectedElement.textLineHeight === "auto"
                              ? ""
                              : (selectedElement.textLineHeight ?? 1.6)
                          }
                          onChange={(e) =>
                            updateSelectedText({
                              textLineHeight: Math.min(
                                3,
                                Math.max(1, Number(e.target.value) || 1.6)
                              ),
                            })
                          }
                          className="h-7"
                        />
                      </label>
                    </div>
                    {renderColorField(
                      t("panel.config.textColor"),
                      selectedElement.textColor ?? "",
                      (next) =>
                        updateSelectedText({
                          textColor: next || undefined,
                        })
                    )}
                  </>
                )}
                {renderFieldGroup(
                  t("panel.config.groupInputAbility"),
                  <label className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedElement.textAllowInput ?? true}
                      className="h-4 w-4 border-2 border-foreground/80 bg-background ring-1 ring-foreground/40 data-[state=checked]:border-primary data-[state=checked]:ring-primary/40"
                      onCheckedChange={(checked) =>
                        updateSelectedText({
                          textAllowInput: checked !== false,
                        })
                      }
                    />
                    <span>{t("panel.config.allowCanvasInput")}</span>
                  </label>,
                  undefined,
                  { groupKey: "textInputAbility", defaultOpen: false }
                )}
              </>,
              true,
              [t("panel.material.text"), t("panel.config.searchKwRichText"), t("panel.config.fontFamily"), t("panel.config.color"), t("panel.config.textAlign"), t("panel.config.lineHeight"), t("panel.config.searchKwInput")]
            )
      }
    </>
  );
}
