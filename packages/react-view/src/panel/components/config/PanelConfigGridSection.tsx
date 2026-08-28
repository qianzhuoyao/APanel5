import { useI18n } from "@arronqzy/i18n/react";
import { Input } from "@arronqzy/ui";
import type { PanelElement } from "../../types";
import { type ConfigSectionHelpers, type UpdateElement } from "./helpers";

export function PanelConfigGridSection({
  element,
  helpers,
  updateElement,
}: {
  element: PanelElement;
  helpers: ConfigSectionHelpers;
  updateElement: UpdateElement;
}) {
  const { t } = useI18n();
  const { renderSection, renderFieldGroup } = helpers;
  const selectedElement = element;
  return (
    <>
      {
            renderSection(
              "gridConfig",
              t("panel.config.sectionGrid"),
              <>
                {renderFieldGroup(
                  t("panel.config.groupGridParams"),
                  <div className="grid grid-cols-2 gap-2">
                    <label className="block space-y-1">
                      <div>{t("panel.config.rowCount")}</div>
                      <Input
                        type="number"
                        min={1}
                        max={12}
                        value={selectedElement.gridRows ?? 2}
                        onChange={(e) =>
                          updateElement(selectedElement.id, {
                            gridRows: Math.max(1, Math.min(12, Number(e.target.value) || 2)),
                          })
                        }
                        className="h-7"
                      />
                    </label>
                    <label className="block space-y-1">
                      <div>{t("panel.config.colCount")}</div>
                      <Input
                        type="number"
                        min={1}
                        max={12}
                        value={selectedElement.gridCols ?? 3}
                        onChange={(e) =>
                          updateElement(selectedElement.id, {
                            gridCols: Math.max(1, Math.min(12, Number(e.target.value) || 3)),
                          })
                        }
                        className="h-7"
                      />
                    </label>
                    <label className="block space-y-1">
                      <div>{t("panel.config.gapPx")}</div>
                      <Input
                        type="number"
                        min={0}
                        max={80}
                        value={selectedElement.gridGap ?? 8}
                        onChange={(e) =>
                          updateElement(selectedElement.id, {
                            gridGap: Math.max(0, Math.min(80, Number(e.target.value) || 0)),
                          })
                        }
                        className="h-7"
                      />
                    </label>
                    <label className="block space-y-1">
                      <div>{t("panel.config.paddingPx")}</div>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={selectedElement.gridPadding ?? 10}
                        onChange={(e) =>
                          updateElement(selectedElement.id, {
                            gridPadding: Math.max(0, Math.min(100, Number(e.target.value) || 0)),
                          })
                        }
                        className="h-7"
                      />
                    </label>
                    <label className="block space-y-1">
                      <div>{t("panel.config.snapThresholdPx")}</div>
                      <Input
                        type="number"
                        min={8}
                        max={120}
                        value={selectedElement.gridSnapThreshold ?? 36}
                        onChange={(e) =>
                          updateElement(selectedElement.id, {
                            gridSnapThreshold: Math.max(
                              8,
                              Math.min(120, Number(e.target.value) || 36)
                            ),
                          })
                        }
                        className="h-7"
                      />
                    </label>
                  </div>
                )}
              </>,
              true,
              [t("panel.config.searchKwGrid"), "grid", t("panel.config.rows"), t("panel.config.cols"), t("panel.config.searchKwGap"), t("panel.config.searchKwPadding"), t("panel.config.searchKwSnap"), t("panel.config.searchKwThreshold")],
              <>
                {t("panel.config.gridHint")}
              </>
            )
      }
    </>
  );
}
