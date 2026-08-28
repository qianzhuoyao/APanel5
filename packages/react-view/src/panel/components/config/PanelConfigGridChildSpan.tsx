import { useI18n } from "@arronqzy/i18n/react";
import { Input } from "@arronqzy/ui";
import type { PanelElement } from "../../types";
import { type ConfigSectionHelpers, type UpdateElement } from "./helpers";

export function PanelConfigGridChildSpan({
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
          {selectedElement
            ? selectedElement.parentGridId
              ? renderSection(
                "gridChildSpan",
                t("panel.config.sectionGridChildSpan"),
                <>
                  {renderFieldGroup(
                    t("panel.config.groupCrossSlots"),
                    <div className="grid grid-cols-2 gap-2">
                      <label className="block space-y-1">
                        <div>{t("panel.config.colSpan")}</div>
                        <Input
                          type="number"
                          min={1}
                          max={12}
                          value={selectedElement.gridColSpan ?? 1}
                          onChange={(e) =>
                            updateElement(selectedElement.id, {
                              gridColSpan: Math.max(1, Math.min(12, Number(e.target.value) || 1)),
                            })
                          }
                          className="h-7"
                        />
                      </label>
                      <label className="block space-y-1">
                        <div>{t("panel.config.rowSpan")}</div>
                        <Input
                          type="number"
                          min={1}
                          max={12}
                          value={selectedElement.gridRowSpan ?? 1}
                          onChange={(e) =>
                            updateElement(selectedElement.id, {
                              gridRowSpan: Math.max(1, Math.min(12, Number(e.target.value) || 1)),
                            })
                          }
                          className="h-7"
                        />
                      </label>
                    </div>
                  )}
                </>,
                true,
                [t("panel.config.searchKwGrid"), t("panel.config.searchKwCrossCol"), t("panel.config.searchKwCrossRow"), "span", "slot"],
                <>{t("panel.config.gridChildHint")}</>
              )
              : null
            : null}
    </>
  );
}
