import { useI18n } from "@arronqzy/i18n/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@arronqzy/ui";
import type { PanelElement, PanelLayer, ReferenceCopyMode } from "../../types";
import { VIEWPORT_OVERFLOW_MODES, normalizeViewportOverflow, type ViewportOverflowMode } from "../../utils/viewportPlacement";
import { type ConfigSectionHelpers, type UpdateElement } from "./helpers";

export function PanelConfigViewportSection({
  element,
  helpers,
  updateElement,
  layers,
  setReferenceCopyMode,
}: {
  element: PanelElement;
  helpers: ConfigSectionHelpers;
  updateElement: UpdateElement;
  layers: PanelLayer[];
  setReferenceCopyMode?: (id: string, mode: ReferenceCopyMode) => void;
}) {
  const { t } = useI18n();
  const { renderSection, renderFieldGroup } = helpers;
  const selectedElement = element;
  return (
    <>
      {
            renderSection(
              "viewportConfig",
              t("panel.config.sectionViewport"),
              <>
                {renderFieldGroup(
                  t("panel.config.groupRefSource"),
                  <label className="block space-y-1">
                    <div>{t("panel.config.refLayer")}</div>
                    <Select
                      value={selectedElement.refLayerId ?? "__none__"}
                      onValueChange={(value) =>
                        updateElement(selectedElement.id, {
                          refLayerId: value === "__none__" ? undefined : value,
                        })
                      }
                    >
                      <SelectTrigger className="h-7">
                        <SelectValue placeholder={t("panel.config.pleaseSelectLayer")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">{t("panel.config.noneNoRef")}</SelectItem>
                        {layers
                          .filter((l) => l.id !== selectedElement.layerId)
                          .map((l) => (
                            <SelectItem key={l.id} value={l.id}>
                              {l.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </label>
                )}
                {renderFieldGroup(
                  t("panel.config.groupCopyStrategy"),
                  <>
                    <label className="block space-y-1">
                      <div>{t("panel.config.copyMode")}</div>
                      <Select
                        value={selectedElement.refCopyMode ?? "shallow"}
                        onValueChange={(value) =>
                          setReferenceCopyMode?.(
                            selectedElement.id,
                            value as ReferenceCopyMode
                          )
                        }
                      >
                        <SelectTrigger className="h-7">
                          <SelectValue placeholder={t("panel.config.selectCopyMode")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="shallow">{t("panel.config.shallowFollow")}</SelectItem>
                          <SelectItem value="deep">{t("panel.config.deepFreeze")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </label>
                  </>,
                  <>{t("panel.config.copyStrategyHint")}</>,
                  { groupKey: "viewportCopyStrategy", defaultOpen: false }
                )}
                {renderFieldGroup(
                  t("panel.config.groupViewportOverflow"),
                  <label className="block space-y-1">
                    <div>{t("panel.config.viewportOverflow")}</div>
                    <Select
                      value={normalizeViewportOverflow(selectedElement.viewportOverflow)}
                      onValueChange={(value) =>
                        updateElement(selectedElement.id, {
                          viewportOverflow: value as ViewportOverflowMode,
                        })
                      }
                    >
                      <SelectTrigger className="h-7">
                        <SelectValue placeholder={t("panel.config.viewportOverflow")} />
                      </SelectTrigger>
                      <SelectContent>
                        {VIEWPORT_OVERFLOW_MODES.map((mode) => (
                          <SelectItem key={mode} value={mode}>
                            {mode === "scroll-x"
                              ? t("panel.config.viewportOverflowScrollX")
                              : mode === "scroll-y"
                                ? t("panel.config.viewportOverflowScrollY")
                                : mode === "scroll"
                                  ? t("panel.config.viewportOverflowScroll")
                                  : t("panel.config.viewportOverflowClip")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </label>
                )}
              </>,
              true,
              [
                t("panel.config.searchKwViewport"),
                "viewport",
                t("panel.config.refLayer"),
                t("panel.config.viewportOverflow"),
                t("panel.config.viewportOverflowScrollX"),
                t("panel.config.viewportOverflowClip"),
                t("panel.material.shallowCopy"),
                t("panel.material.deepCopy"),
              ],
              <>{t("panel.config.viewportHint")}</>
            )
      }
    </>
  );
}
