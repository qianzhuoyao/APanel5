import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useI18n } from "@arronqzy/i18n/react";
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@arronqzy/ui";
import type { PanelElement } from "../../types";
import { type ConfigSectionHelpers, type UpdateElement } from "./helpers";

export function PanelConfigGeometrySection({
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
  const [geometryDrawPenColor, setGeometryDrawPenColor] = useState("#111827");
  const [geometryDrawPenWidth, setGeometryDrawPenWidth] = useState(3);
  const [isGeometryDrawing, setIsGeometryDrawing] = useState(false);
  const geometryDrawCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const geometryLastPointRef = useRef<{ x: number; y: number } | null>(null);

  const updateSelectedGeometry = useCallback(
    (patch: Partial<PanelElement>) => {
      if (selectedElement.materialType !== "geometry") return;
      updateElement(selectedElement.id, patch);
    },
    [selectedElement, updateElement]
  );

  const redrawGeometryPadFromElement = useCallback(() => {
    const canvas = geometryDrawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    const sketch = selectedElement.geometrySketchDataUrl;
    if (!sketch) return;
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
    };
    img.src = sketch;
  }, [selectedElement.geometrySketchDataUrl]);

  useEffect(() => {
    if (selectedElement.materialType !== "geometry") return;
    redrawGeometryPadFromElement();
  }, [redrawGeometryPadFromElement, selectedElement.id, selectedElement.materialType]);

  return (
    <>
      {
            renderSection(
              "geometryConfig",
              t("panel.config.sectionGeometry"),
              <>
                {renderFieldGroup(
                  t("panel.config.groupBasicShape"),
                  <>
                    <label className="block space-y-1">
                      <div>{t("panel.config.shape")}</div>
                      <Select
                        value={selectedElement.geometryShape ?? "rect"}
                        onValueChange={(value) =>
                          updateSelectedGeometry({
                            geometryShape: value as PanelElement["geometryShape"],
                          })
                        }
                      >
                        <SelectTrigger className="h-7">
                          <SelectValue placeholder={t("panel.config.selectShape")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rect">{t("panel.config.shapeRect")}</SelectItem>
                          <SelectItem value="circle">{t("panel.config.shapeCircle")}</SelectItem>
                          <SelectItem value="triangle">{t("panel.config.shapeTriangle")}</SelectItem>
                          <SelectItem value="diamond">{t("panel.config.shapeDiamond")}</SelectItem>
                          <SelectItem value="hexagon">{t("panel.config.shapeHexagon")}</SelectItem>
                          <SelectItem value="star">{t("panel.config.shapeStar")}</SelectItem>
                          <SelectItem value="heart">{t("panel.config.shapeHeart")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </label>
                    {renderColorField(
                      t("panel.config.geometryColor"),
                      selectedElement.geometryColor ?? "#3b82f6",
                      (next) => updateSelectedGeometry({ geometryColor: next || "#3b82f6" })
                    )}
                  </>
                )}
                {renderFieldGroup(
                  t("panel.config.groupCanvasScript"),
                  <>
                    <Textarea
                      value={selectedElement.geometryScript ?? ""}
                      onChange={(e) => updateSelectedGeometry({ geometryScript: e.target.value || undefined })}
                      spellCheck={false}
                      className="h-36 font-mono text-[11px]"
                      placeholder={t("panel.config.geometryScriptPlaceholder")}
                    />
                  </>,
                  <>
                    {t("panel.config.canvasScriptHint")}
                  </>,
                  { groupKey: "geometryCanvasScript", defaultOpen: false }
                )}
                {renderFieldGroup(
                  t("panel.config.groupSketchOverlay"),
                  <>
                    <div className="flex items-center gap-2">
                      <label className="block space-y-1">
                        <div className="text-[11px]">{t("panel.config.penColor")}</div>
                        <Input
                          type="color"
                          value={geometryDrawPenColor}
                          onChange={(e) => setGeometryDrawPenColor(e.target.value)}
                          className="h-7 w-10 p-1"
                        />
                      </label>
                      <label className="block space-y-1">
                        <div className="text-[11px]">{t("panel.config.penWidth")}</div>
                        <Input
                          type="number"
                          min={1}
                          max={24}
                          value={geometryDrawPenWidth}
                          onChange={(e) => setGeometryDrawPenWidth(Math.max(1, Math.min(24, Number(e.target.value) || 1)))}
                          className="h-7 w-20"
                        />
                      </label>
                    </div>
                    <div className="rounded border border-border/60 bg-white p-2">
                      <canvas
                        ref={geometryDrawCanvasRef}
                        width={320}
                        height={180}
                        className="h-[180px] w-full cursor-crosshair rounded border border-border/60"
                        onPointerDown={(e) => {
                          const canvas = geometryDrawCanvasRef.current;
                          if (!canvas) return;
                          const ctx = canvas.getContext("2d");
                          if (!ctx) return;
                          const rect = canvas.getBoundingClientRect();
                          const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
                          const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
                          geometryLastPointRef.current = { x, y };
                          setIsGeometryDrawing(true);
                          ctx.lineCap = "round";
                          ctx.lineJoin = "round";
                          ctx.strokeStyle = geometryDrawPenColor;
                          ctx.lineWidth = geometryDrawPenWidth;
                          ctx.beginPath();
                          ctx.moveTo(x, y);
                        }}
                        onPointerMove={(e) => {
                          if (!isGeometryDrawing) return;
                          const canvas = geometryDrawCanvasRef.current;
                          const last = geometryLastPointRef.current;
                          if (!canvas || !last) return;
                          const ctx = canvas.getContext("2d");
                          if (!ctx) return;
                          const rect = canvas.getBoundingClientRect();
                          const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
                          const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
                          ctx.lineTo(x, y);
                          ctx.stroke();
                          geometryLastPointRef.current = { x, y };
                        }}
                        onPointerUp={() => {
                          setIsGeometryDrawing(false);
                          geometryLastPointRef.current = null;
                        }}
                        onPointerLeave={() => {
                          setIsGeometryDrawing(false);
                          geometryLastPointRef.current = null;
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="rounded border border-border px-2 py-1 text-[11px] hover:bg-accent"
                        onClick={() => {
                          const canvas = geometryDrawCanvasRef.current;
                          if (!canvas) return;
                          updateSelectedGeometry({ geometrySketchDataUrl: canvas.toDataURL("image/png") });
                        }}
                      >
                        {t("panel.config.applySketch")}
                      </button>
                      <button
                        type="button"
                        className="rounded border border-border px-2 py-1 text-[11px] hover:bg-accent"
                        onClick={() => {
                          updateSelectedGeometry({ geometrySketchDataUrl: undefined });
                          redrawGeometryPadFromElement();
                        }}
                      >
                        {t("panel.config.clearSketch")}
                      </button>
                    </div>
                  </>,
                  undefined,
                  { groupKey: "geometrySketch", defaultOpen: false }
                )}
              </>,
              true,
              [t("panel.material.geometry"), "geometry", t("panel.config.shape"), "canvas", t("panel.config.searchKwScript"), t("panel.config.searchKwSketch")]
            )
      }
    </>
  );
}
