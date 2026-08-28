import { useI18n } from "@arronqzy/i18n/react";
import { Input } from "@arronqzy/ui";
import type { PanelElement } from "../../types";
import { type ConfigSectionHelpers, type UpdateElement } from "./helpers";

export function PanelConfigNodeInfo({
  element,
  helpers,
  updateElement,
  nodeZOrderLabel,
  onAdjustNodeZOrder,
}: {
  element: PanelElement;
  helpers: ConfigSectionHelpers;
  updateElement: UpdateElement;
  nodeZOrderLabel?: string;
  onAdjustNodeZOrder?: (
    nodeId: string,
    action: "bringForward" | "sendBackward" | "bringToFront" | "sendToBack"
  ) => void;
}) {
  const { t } = useI18n();
  const { renderSection, renderFieldGroup } = helpers;
  const selectedElement = element;
  return (
    <>
              {renderSection(
            "nodeInfo",
            t("panel.config.sectionNodeInfo"),
            <>
              <label className="block space-y-1" data-config-field="name">
                <div>{t("panel.config.nodeName")}</div>
                <Input
                  value={selectedElement.name ?? ""}
                  onChange={(e) =>
                    updateElement(selectedElement.id, {
                      name: e.target.value || undefined,
                    })
                  }
                  placeholder={t("panel.config.nodeNamePlaceholder")}
                  className="h-7"
                />
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className="block space-y-1" data-config-field="x">
                  <div>X</div>
                  <Input
                    type="number"
                    value={selectedElement.x}
                    onChange={(e) =>
                      updateElement(selectedElement.id, {
                        x: Number(e.target.value) || 0,
                      })
                    }
                    className="h-7"
                  />
                </label>
                <label className="block space-y-1" data-config-field="y">
                  <div>Y</div>
                  <Input
                    type="number"
                    value={selectedElement.y}
                    onChange={(e) =>
                      updateElement(selectedElement.id, {
                        y: Number(e.target.value) || 0,
                      })
                    }
                    className="h-7"
                  />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label className="block space-y-1" data-config-field="width">
                  <div>{t("panel.config.width")}</div>
                  <Input
                    type="number"
                    min={1}
                    value={selectedElement?.width ?? 1}
                    onChange={(e) => {
                      if (!selectedElement) return;
                      updateElement(selectedElement.id, {
                        width: Math.max(1, Number(e.target.value) || 1),
                      });
                    }}
                    className="h-7"
                  />
                </label>
                <label className="block space-y-1" data-config-field="height">
                  <div>{t("panel.config.height")}</div>
                  <Input
                    type="number"
                    min={1}
                    value={selectedElement.height}
                    onChange={(e) =>
                      updateElement(selectedElement.id, {
                        height: Math.max(1, Number(e.target.value) || 1),
                      })
                    }
                    className="h-7"
                  />
                </label>
              </div>
              {renderFieldGroup(
                t("panel.config.groupNodeMore"),
                <>
              <div className="grid grid-cols-2 gap-2">
                <label className="block space-y-1" data-config-field="rotate">
                  <div>{t("panel.config.rotate")}</div>
                  <Input
                    type="number"
                    value={selectedElement.rotate ?? 0}
                    onChange={(e) =>
                      updateElement(selectedElement.id, {
                        rotate: Number(e.target.value) || 0,
                      })
                    }
                    className="h-7"
                  />
                </label>
              </div>
              <div className="space-y-1.5">
                <div className="text-[11px] text-muted-foreground">{t("panel.config.nodeZOrder")}</div>
                <div className="text-[11px] text-muted-foreground/90">
                  {t("panel.config.currentZIndex", { value: nodeZOrderLabel ?? "-" })}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className="rounded border border-border bg-background px-2 py-1 text-[11px] hover:bg-accent"
                    onClick={() => onAdjustNodeZOrder?.(selectedElement.id, "bringForward")}
                  >
                    {t("panel.menubar.bringForward")}
                  </button>
                  <button
                    type="button"
                    className="rounded border border-border bg-background px-2 py-1 text-[11px] hover:bg-accent"
                    onClick={() => onAdjustNodeZOrder?.(selectedElement.id, "sendBackward")}
                  >
                    {t("panel.menubar.sendBackward")}
                  </button>
                  <button
                    type="button"
                    className="rounded border border-border bg-background px-2 py-1 text-[11px] hover:bg-accent"
                    onClick={() => onAdjustNodeZOrder?.(selectedElement.id, "bringToFront")}
                  >
                    {t("panel.menubar.bringToFront")}
                  </button>
                  <button
                    type="button"
                    className="rounded border border-border bg-background px-2 py-1 text-[11px] hover:bg-accent"
                    onClick={() => onAdjustNodeZOrder?.(selectedElement.id, "sendToBack")}
                  >
                    {t("panel.menubar.sendToBack")}
                  </button>
                </div>
              </div>
              <div className="truncate text-muted-foreground">ID: {selectedElement.id}</div>
              <div className="text-muted-foreground">{t("panel.config.type")}: {selectedElement.materialType ?? selectedElement.id}</div>
                </>,
                undefined,
                { groupKey: "nodeMore", defaultOpen: false }
              )}
            </>,
            true,
            [t("panel.config.name"), "id", t("panel.config.type"), t("panel.config.rotate"), t("panel.config.nodeZOrder"), t("panel.layers.lockShort"), "locked", "name"]
          )}
    </>
  );
}
