import React, { useCallback, useMemo, useRef, useState } from "react";
import { useI18n } from "@arronqzy/i18n/react";
import {
  Button,
  Checkbox,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@arronqzy/ui";
import {
  makeScene3dObjectKey,
  mergeScene3dConfig,
  purposePresetPatch,
  inferModelFormat,
  type Scene3dConfig,
  type Scene3dModelAnimationRule,
  type Scene3dCameraAnimationRule,
  type Scene3dObjectTag,
  type Scene3dPivot,
  type Scene3dPurpose,
  type Scene3dEnvironmentPreset,
} from "@arronqzy/view-scene3d";
import type { PanelElement } from "../../types";
import { readFileAsDataUrl } from "../../utils/async-work";
import { randomId } from "../../utils/panelElementDefaults";
import { ConfigHintIcon } from "../ConfigHintIcon";

type UpdateElement = (
  id: string,
  patch: Partial<PanelElement>,
  options?: { batchId?: string; meta?: Record<string, unknown> }
) => void;

export type PanelConfigScene3dSectionProps = {
  element: PanelElement;
  updateElement: UpdateElement;
};

type CameraAnimPreset = "orbit" | "pushIn" | "pullBack" | "truckLeft" | "craneUp";

function patchScene3d(
  element: PanelElement,
  updateElement: UpdateElement,
  patch: Partial<Scene3dConfig>
) {
  updateElement(element.id, {
    scene3d: mergeScene3dConfig({ ...element.scene3d, ...patch }),
  });
}

export function PanelConfigScene3dSection({
  element,
  updateElement,
}: PanelConfigScene3dSectionProps) {
  const { t } = useI18n();
  const config = useMemo(
    () => mergeScene3dConfig(element.scene3d),
    [element.scene3d]
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [nameQuery, setNameQuery] = useState<Record<string, string>>({});
  const [openTagKeys, setOpenTagKeys] = useState<Record<string, boolean>>({});
  const patch = useCallback(
    (next: Partial<Scene3dConfig>) => patchScene3d(element, updateElement, next),
    [element, updateElement]
  );

  const handleUploadModels = async (files: FileList | null) => {
    if (!files?.length) return;
    const nextModels = [...config.models];
    for (const file of Array.from(files)) {
      try {
        const url = await readFileAsDataUrl(file, t("panel.messages.readModelFailed"), "model3d");
        nextModels.push({
          id: randomId("mdl"),
          label: file.name.replace(/\.[^.]+$/, "") || file.name,
          url,
          fileName: file.name,
          format: inferModelFormat(file.name),
        });
      } catch (error) {
        window.alert(error instanceof Error ? error.message : t("panel.messages.readModelFailed"));
      }
    }
    patch({ models: nextModels });
  };

  const updateModelAnimation = (
    id: string,
    next: Partial<Scene3dModelAnimationRule>
  ) => {
    patch({
      modelAnimations: config.modelAnimations.map((rule) =>
        rule.id === id ? { ...rule, ...next } : rule
      ),
    });
  };

  const addModelAnimation = () => {
    const firstModel = config.models[0];
    const firstName = firstModel?.objectNames?.[0] ?? "";
    const rule: Scene3dModelAnimationRule = {
      id: randomId("anim"),
      modelId: firstModel?.id ?? "",
      objectName: firstName,
      axis: "y",
      direction: "clockwise",
      pivot: "right",
      angleDeg: 90,
      durationSec: 1.2,
      loop: false,
    };
    patch({ modelAnimations: [...config.modelAnimations, rule] });
  };

  const updateCameraAnimation = (
    id: string,
    next: Partial<Scene3dCameraAnimationRule>
  ) => {
    patch({
      cameraAnimations: config.cameraAnimations.map((rule) =>
        rule.id === id ? { ...rule, ...next } : rule
      ),
    });
  };

  const addCameraAnimationPreset = (preset: CameraAnimPreset) => {
    const [px, py, pz] = config.camera.position;
    const [tx, ty, tz] = config.camera.target;
    const dx = tx - px;
    const dy = ty - py;
    const dz = tz - pz;
    const dist = Math.max(0.001, Math.hypot(dx, dy, dz));
    const nx = dx / dist;
    const ny = dy / dist;
    const nz = dz / dist;
    let rule: Scene3dCameraAnimationRule;

    if (preset === "pushIn") {
      rule = {
        id: randomId("cam"),
        label: t("panel.config.scene3dCameraAnimPushIn"),
        from: { ...config.camera },
        to: {
          ...config.camera,
          position: [px + nx * dist * 0.28, py + ny * dist * 0.28, pz + nz * dist * 0.28],
        },
        durationSec: 1.6,
        loop: false,
      };
    } else if (preset === "pullBack") {
      rule = {
        id: randomId("cam"),
        label: t("panel.config.scene3dCameraAnimPullBack"),
        from: { ...config.camera },
        to: {
          ...config.camera,
          position: [px - nx * dist * 0.35, py - ny * dist * 0.35, pz - nz * dist * 0.35],
        },
        durationSec: 1.8,
        loop: false,
      };
    } else if (preset === "truckLeft") {
      rule = {
        id: randomId("cam"),
        label: t("panel.config.scene3dCameraAnimTruckLeft"),
        from: { ...config.camera },
        to: {
          ...config.camera,
          position: [px - 1.6, py, pz],
          target: [tx - 1.6, ty, tz],
        },
        durationSec: 1.8,
        loop: false,
      };
    } else if (preset === "craneUp") {
      rule = {
        id: randomId("cam"),
        label: t("panel.config.scene3dCameraAnimCraneUp"),
        from: { ...config.camera },
        to: {
          ...config.camera,
          position: [px, py + 1.5, pz],
          target: [tx, ty + 0.6, tz],
        },
        durationSec: 1.8,
        loop: false,
      };
    } else {
      rule = {
        id: randomId("cam"),
        label: t("panel.config.scene3dCameraAnimDefault"),
        mode: "orbit",
        orbitSpeedDegPerSec: 24,
        from: { ...config.camera },
        to: {
          ...config.camera,
          position: [
            px + Math.max(1.5, dist * 0.32),
            py + Math.max(0.5, dist * 0.08),
            pz + Math.max(1, dist * 0.2),
          ],
        },
        durationSec: 6,
        loop: true,
        pingPong: false,
      };
    }
    patch({ cameraAnimations: [...config.cameraAnimations, rule] });
  };

  const addCameraAnimation = () => {
    addCameraAnimationPreset("orbit");
  };

  const PIVOTS: Scene3dPivot[] = [
    "center",
    "top",
    "bottom",
    "left",
    "right",
    "front",
    "back",
  ];

  const selectObject = (modelId: string, objectName: string) => {
    const key = makeScene3dObjectKey(modelId, objectName);
    patch({ selectedObjectKey: config.selectedObjectKey === key ? null : key });
  };

  const toggleHidden = (modelId: string, objectName: string) => {
    const key = makeScene3dObjectKey(modelId, objectName);
    const hidden = new Set(config.hiddenObjectKeys ?? []);
    if (hidden.has(key)) hidden.delete(key);
    else hidden.add(key);
    patch({
      hiddenObjectKeys: [...hidden],
      soloObjectKey: config.soloObjectKey === key ? null : config.soloObjectKey,
    });
  };

  const toggleSolo = (modelId: string, objectName: string) => {
    const key = makeScene3dObjectKey(modelId, objectName);
    patch({
      soloObjectKey: config.soloObjectKey === key ? null : key,
      selectedObjectKey: key,
    });
  };

  const upsertObjectTag = (
    modelId: string,
    objectName: string,
    next: Partial<Scene3dObjectTag>
  ) => {
    const tags = [...(config.objectTags ?? [])];
    const index = tags.findIndex(
      (tag) => tag.modelId === modelId && tag.objectName === objectName
    );
    if (index >= 0) {
      tags[index] = { ...tags[index], ...next };
    } else {
      tags.push({
        id: randomId("tag"),
        modelId,
        objectName,
        html: "",
        anchor: "top",
        ...next,
      });
    }
    patch({ objectTags: tags });
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <div className="text-[11px] font-medium">{t("panel.config.groupScene3dPurpose")}</div>
        <Select
          value={config.presentation.purpose}
          onValueChange={(value) => {
            const purpose = value as Scene3dPurpose;
            patch(purposePresetPatch(purpose));
          }}
        >
          <SelectTrigger className="h-7 text-[11px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="product">{t("panel.config.scene3dPurposeProduct")}</SelectItem>
            <SelectItem value="twin">{t("panel.config.scene3dPurposeTwin")}</SelectItem>
            <SelectItem value="sandbox">{t("panel.config.scene3dPurposeSandbox")}</SelectItem>
          </SelectContent>
        </Select>
        <div className="text-[10px] text-muted-foreground">
          {t("panel.config.scene3dPurposeHint")}
        </div>
        <label className="block space-y-0.5 text-[10px]">
          <span>{t("panel.config.scene3dEnvironment")}</span>
          <Select
            value={config.presentation.environmentPreset}
            onValueChange={(value) =>
              patch({
                presentation: {
                  ...config.presentation,
                  environmentPreset: value as Scene3dEnvironmentPreset,
                },
              })
            }
          >
            <SelectTrigger className="h-7 text-[11px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">{t("common.none")}</SelectItem>
              <SelectItem value="studio">Studio</SelectItem>
              <SelectItem value="warehouse">Warehouse</SelectItem>
              <SelectItem value="city">City</SelectItem>
              <SelectItem value="sunset">Sunset</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="forest">Forest</SelectItem>
            </SelectContent>
          </Select>
        </label>
        <label className="flex items-center gap-2 text-[11px]">
          <Checkbox
            checked={config.presentation.showContactShadows}
            onCheckedChange={(checked) =>
              patch({
                presentation: {
                  ...config.presentation,
                  showContactShadows: checked === true,
                },
              })
            }
          />
          {t("panel.config.scene3dContactShadows")}
        </label>
        <label className="flex items-center gap-2 text-[11px]">
          <Checkbox
            checked={config.presentation.showGrid}
            onCheckedChange={(checked) =>
              patch({
                presentation: { ...config.presentation, showGrid: checked === true },
              })
            }
          />
          {t("panel.config.scene3dShowGrid")}
        </label>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="text-[11px] font-medium">{t("panel.config.groupScene3dModels")}</div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-7 text-[11px]"
          onClick={() => fileInputRef.current?.click()}
        >
          {t("panel.config.scene3dUploadModels")}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".glb,.gltf,.obj,.fbx,model/gltf-binary,model/gltf+json"
          multiple
          className="hidden"
          onChange={(e) => {
            void handleUploadModels(e.target.files);
            e.currentTarget.value = "";
          }}
        />
      </div>

      {config.models.length === 0 ? (
        <div className="rounded border border-dashed border-border/70 px-2 py-3 text-[11px] text-muted-foreground">
          {t("panel.config.scene3dNoModels")}
        </div>
      ) : (
        <div className="space-y-2">
          {config.models.map((model) => (
            <div key={model.id} className="rounded border border-border/60 p-2 space-y-1.5">
              <div className="flex items-center gap-2">
                <Input
                  value={model.label}
                  className="h-7 text-[11px]"
                  onChange={(e) =>
                    patch({
                      models: config.models.map((m) =>
                        m.id === model.id ? { ...m, label: e.target.value } : m
                      ),
                    })
                  }
                />
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-7 shrink-0 text-[11px]"
                  onClick={() =>
                    patch({
                      models: config.models.filter((m) => m.id !== model.id),
                      hiddenObjectKeys: (config.hiddenObjectKeys ?? []).filter(
                        (key) => !key.startsWith(`${model.id}|||`)
                      ),
                      objectTags: (config.objectTags ?? []).filter(
                        (tag) => tag.modelId !== model.id
                      ),
                      selectedObjectKey: config.selectedObjectKey?.startsWith(
                        `${model.id}|||`
                      )
                        ? null
                        : config.selectedObjectKey,
                      soloObjectKey: config.soloObjectKey?.startsWith(`${model.id}|||`)
                        ? null
                        : config.soloObjectKey,
                    })
                  }
                >
                  {t("common.remove")}
                </Button>
              </div>
              <div className="text-[10px] text-muted-foreground">{model.fileName ?? model.url.slice(0, 48)}</div>
              <div className="grid grid-cols-3 gap-1">
                {(["x", "y", "z"] as const).map((axis, index) => (
                  <Input
                    key={`${model.id}-pos-${axis}`}
                    type="number"
                    className="h-7 text-[10px]"
                    title={axis.toUpperCase()}
                    value={(model.position ?? [0, 0, 0])[index]}
                    onChange={(e) => {
                      const next = [...(model.position ?? [0, 0, 0])] as [number, number, number];
                      next[index] = Number(e.target.value) || 0;
                      patch({
                        models: config.models.map((m) =>
                          m.id === model.id ? { ...m, position: next } : m
                        ),
                      });
                    }}
                  />
                ))}
              </div>
              {model.objectNames?.length ? (
                <Collapsible defaultOpen={model.objectNames.length <= 12}>
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded bg-muted/40 px-1.5 py-1 text-left text-[10px] text-muted-foreground hover:bg-muted/70">
                    <span>
                      {t("panel.config.scene3dObjectNames")} ·{" "}
                      {t("panel.config.scene3dObjectCount", {
                        n: model.objectNames.length,
                      })}
                    </span>
                    <span>▾</span>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-1 space-y-1">
                    <Input
                      className="h-6 text-[10px]"
                      placeholder={t("panel.config.scene3dSearchObject")}
                      value={nameQuery[model.id] ?? ""}
                      onChange={(e) =>
                        setNameQuery((prev) => ({
                          ...prev,
                          [model.id]: e.target.value,
                        }))
                      }
                    />
                    <div className="max-h-44 overflow-auto rounded border border-border/50">
                      {model.objectNames
                        .filter((name) => {
                          const q = (nameQuery[model.id] ?? "").trim().toLowerCase();
                          return !q || name.toLowerCase().includes(q);
                        })
                        .map((name) => {
                          const key = makeScene3dObjectKey(model.id, name);
                          const selected = config.selectedObjectKey === key;
                          const hidden = (config.hiddenObjectKeys ?? []).includes(key);
                          const solo = config.soloObjectKey === key;
                          const tag = (config.objectTags ?? []).find(
                            (item) =>
                              item.modelId === model.id && item.objectName === name
                          );
                          const tagOpen = Boolean(openTagKeys[key]);
                          return (
                            <div
                              key={key}
                              className={[
                                "border-b border-border/40 last:border-b-0",
                                selected ? "bg-sky-500/15" : "",
                                hidden && !solo ? "opacity-50" : "",
                              ].join(" ")}
                            >
                              <div className="flex items-center gap-0.5 px-1 py-0.5">
                                <button
                                  type="button"
                                  className="min-w-0 flex-1 truncate px-1 text-left text-[10px] hover:text-foreground"
                                  title={name}
                                  onClick={() => selectObject(model.id, name)}
                                >
                                  {name}
                                </button>
                                <button
                                  type="button"
                                  className="shrink-0 rounded px-1 text-[10px] text-muted-foreground hover:bg-muted"
                                  title={
                                    hidden
                                      ? t("panel.config.scene3dShowObject")
                                      : t("panel.config.scene3dHideObject")
                                  }
                                  onClick={() => toggleHidden(model.id, name)}
                                >
                                  {hidden
                                    ? t("panel.config.scene3dShowShort")
                                    : t("panel.config.scene3dHideShort")}
                                </button>
                                <button
                                  type="button"
                                  className={[
                                    "shrink-0 rounded px-1 text-[10px] hover:bg-muted",
                                    solo
                                      ? "text-sky-600"
                                      : "text-muted-foreground",
                                  ].join(" ")}
                                  title={
                                    solo
                                      ? t("panel.config.scene3dSoloOff")
                                      : t("panel.config.scene3dSoloObject")
                                  }
                                  onClick={() => toggleSolo(model.id, name)}
                                >
                                  {t("panel.config.scene3dSoloShort")}
                                </button>
                                <button
                                  type="button"
                                  className={[
                                    "shrink-0 rounded px-1 text-[10px] hover:bg-muted",
                                    tagOpen || tag?.html
                                      ? "text-sky-600"
                                      : "text-muted-foreground",
                                  ].join(" ")}
                                  title={t("panel.config.scene3dObjectTag")}
                                  onClick={() => {
                                    setOpenTagKeys((prev) => ({
                                      ...prev,
                                      [key]: !prev[key],
                                    }));
                                    if (!tag) upsertObjectTag(model.id, name, {});
                                  }}
                                >
                                  {t("panel.config.scene3dTagShort")}
                                </button>
                              </div>
                              {tagOpen ? (
                                <div className="space-y-1 px-1 pb-1.5">
                                  <Select
                                    value={tag?.anchor ?? "top"}
                                    onValueChange={(value) =>
                                      upsertObjectTag(model.id, name, {
                                        anchor: value as Scene3dPivot,
                                      })
                                    }
                                  >
                                    <SelectTrigger className="h-6 text-[10px]">
                                      <SelectValue
                                        placeholder={t(
                                          "panel.config.scene3dObjectTagAnchor"
                                        )}
                                      />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {PIVOTS.map((pivot) => (
                                        <SelectItem key={pivot} value={pivot}>
                                          {t(`panel.config.scene3dPivot_${pivot}`)}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <Textarea
                                    className="min-h-[64px] text-[10px]"
                                    placeholder={t(
                                      "panel.config.scene3dObjectTagPlaceholder"
                                    )}
                                    value={tag?.html ?? ""}
                                    onChange={(e) =>
                                      upsertObjectTag(model.id, name, {
                                        html: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                              ) : null}
                            </div>
                          );
                        })}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <div className="text-[10px] text-muted-foreground">
                  {t("panel.config.scene3dNoObjectNames")}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2">
        <div className="text-[11px] font-medium">{t("panel.config.groupScene3dCamera")}</div>
        <div className="grid grid-cols-3 gap-1.5">
          {(["x", "y", "z"] as const).map((axis, index) => (
            <label key={`pos-${axis}`} className="space-y-0.5 text-[10px]">
              <span>{t("panel.config.scene3dCameraPos")} {axis.toUpperCase()}</span>
              <Input
                type="number"
                className="h-7"
                value={config.camera.position[index]}
                onChange={(e) => {
                  const next = [...config.camera.position] as [number, number, number];
                  next[index] = Number(e.target.value) || 0;
                  patch({ camera: { ...config.camera, position: next } });
                }}
              />
            </label>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {(["x", "y", "z"] as const).map((axis, index) => (
            <label key={`tgt-${axis}`} className="space-y-0.5 text-[10px]">
              <span>{t("panel.config.scene3dCameraTarget")} {axis.toUpperCase()}</span>
              <Input
                type="number"
                className="h-7"
                value={config.camera.target[index]}
                onChange={(e) => {
                  const next = [...config.camera.target] as [number, number, number];
                  next[index] = Number(e.target.value) || 0;
                  patch({ camera: { ...config.camera, target: next } });
                }}
              />
            </label>
          ))}
        </div>
        <label className="block space-y-0.5 text-[10px]">
          <span>{t("panel.config.scene3dCameraFov")}</span>
          <Input
            type="number"
            className="h-7"
            value={config.camera.fov}
            onChange={(e) =>
              patch({ camera: { ...config.camera, fov: Number(e.target.value) || 45 } })
            }
          />
        </label>
        <div className="text-[10px] text-muted-foreground">{t("panel.config.scene3dCameraEditDesc")}</div>
      </div>

      <div className="space-y-2">
        <div className="text-[11px] font-medium">{t("panel.config.groupScene3dInteraction")}</div>
        <label className="flex items-center gap-2 text-[11px]">
          <Checkbox
            checked={config.orbit.enableMouseControl}
            onCheckedChange={(checked) =>
              patch({ orbit: { ...config.orbit, enableMouseControl: checked === true } })
            }
          />
          {t("panel.config.scene3dEnableMouseControl")}
          <ConfigHintIcon label={t("panel.config.scene3dEnableMouseControl")}>
            {t("panel.config.scene3dEnableMouseControlHint")}
          </ConfigHintIcon>
        </label>
        <label className="flex items-center gap-2 text-[11px]">
          <Checkbox
            checked={config.orbit.autoRotate}
            onCheckedChange={(checked) =>
              patch({ orbit: { ...config.orbit, autoRotate: checked === true } })
            }
          />
          {t("panel.config.scene3dAutoRotate")}
        </label>
        <label className="flex items-center gap-2 text-[11px]">
          <Checkbox
            checked={config.presentation.clickToFocus}
            onCheckedChange={(checked) =>
              patch({
                presentation: { ...config.presentation, clickToFocus: checked === true },
              })
            }
          />
          {t("panel.config.scene3dClickToFocus")}
        </label>
        <label className="flex items-center gap-2 text-[11px]">
          <Checkbox
            checked={config.presentation.highlightOnHover}
            onCheckedChange={(checked) =>
              patch({
                presentation: { ...config.presentation, highlightOnHover: checked === true },
              })
            }
          />
          {t("panel.config.scene3dHighlightHover")}
        </label>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-medium">{t("panel.config.groupScene3dModelAnim")}</div>
          <Button type="button" size="sm" variant="outline" className="h-7 text-[11px]" onClick={addModelAnimation}>
            {t("common.add")}
          </Button>
        </div>
        {config.modelAnimations.map((rule) => (
          <div key={rule.id} className="space-y-1.5 rounded border border-border/60 p-2">
            <div className="grid grid-cols-2 gap-1.5">
              <label className="space-y-0.5 text-[10px]">
                <span>{t("panel.config.scene3dAnimModel")}</span>
                <Select
                  value={rule.modelId}
                  onValueChange={(value) => updateModelAnimation(rule.id, { modelId: value })}
                >
                  <SelectTrigger className="h-7 text-[11px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {config.models.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
              <label className="space-y-0.5 text-[10px]">
                <span>{t("panel.config.scene3dAnimObjectName")}</span>
                <Select
                  value={rule.objectName}
                  onValueChange={(value) => updateModelAnimation(rule.id, { objectName: value })}
                >
                  <SelectTrigger className="h-7 text-[11px]">
                    <SelectValue placeholder={t("panel.config.scene3dSelectObject")} />
                  </SelectTrigger>
                  <SelectContent>
                    {(config.models.find((m) => m.id === rule.modelId)?.objectNames ?? []).map(
                      (name) => (
                        <SelectItem key={name} value={name}>
                          {name}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </label>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <label className="space-y-0.5 text-[10px]">
                <span>{t("panel.config.scene3dAnimAxis")}</span>
                <Select value={rule.axis} onValueChange={(v) => updateModelAnimation(rule.id, { axis: v as typeof rule.axis })}>
                  <SelectTrigger className="h-7"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="x">X</SelectItem>
                    <SelectItem value="y">Y</SelectItem>
                    <SelectItem value="z">Z</SelectItem>
                  </SelectContent>
                </Select>
              </label>
              <label className="space-y-0.5 text-[10px]">
                <span>{t("panel.config.scene3dAnimPivot")}</span>
                <Select value={rule.pivot} onValueChange={(v) => updateModelAnimation(rule.id, { pivot: v as typeof rule.pivot })}>
                  <SelectTrigger className="h-7"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(["center", "left", "right", "front", "back", "top", "bottom"] as const).map((p) => (
                      <SelectItem key={p} value={p}>{t(`panel.config.scene3dPivot_${p}`)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
              <label className="space-y-0.5 text-[10px]">
                <span>{t("panel.config.scene3dAnimDirection")}</span>
                <Select value={rule.direction} onValueChange={(v) => updateModelAnimation(rule.id, { direction: v as typeof rule.direction })}>
                  <SelectTrigger className="h-7"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clockwise">{t("panel.config.scene3dDirClockwise")}</SelectItem>
                    <SelectItem value="counterclockwise">{t("panel.config.scene3dDirCounter")}</SelectItem>
                  </SelectContent>
                </Select>
              </label>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <label className="space-y-0.5 text-[10px]">
                <span>{t("panel.config.scene3dAnimAngle")}</span>
                <Input type="number" className="h-7" value={rule.angleDeg} onChange={(e) => updateModelAnimation(rule.id, { angleDeg: Number(e.target.value) || 0 })} />
              </label>
              <label className="space-y-0.5 text-[10px]">
                <span>{t("panel.config.scene3dAnimDuration")}</span>
                <Input type="number" className="h-7" value={rule.durationSec} onChange={(e) => updateModelAnimation(rule.id, { durationSec: Number(e.target.value) || 0.1 })} />
              </label>
              <label className="flex items-end gap-2 pb-1 text-[11px]">
                <Checkbox checked={rule.loop} onCheckedChange={(c) => updateModelAnimation(rule.id, { loop: c === true })} />
                {t("panel.config.scene3dAnimLoop")}
              </label>
            </div>
            <Button type="button" size="sm" variant="ghost" className="h-7 text-[11px]" onClick={() => patch({ modelAnimations: config.modelAnimations.filter((a) => a.id !== rule.id) })}>
              {t("common.remove")}
            </Button>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-medium">{t("panel.config.groupScene3dCameraAnim")}</div>
          <Button type="button" size="sm" variant="outline" className="h-7 text-[11px]" onClick={addCameraAnimation}>
            {t("common.add")}
          </Button>
        </div>
        <div className="flex flex-wrap gap-1">
          <Button type="button" size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => addCameraAnimationPreset("orbit")}>{t("panel.config.scene3dCameraAnimDefault")}</Button>
          <Button type="button" size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => addCameraAnimationPreset("pushIn")}>{t("panel.config.scene3dCameraAnimPushIn")}</Button>
          <Button type="button" size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => addCameraAnimationPreset("pullBack")}>{t("panel.config.scene3dCameraAnimPullBack")}</Button>
          <Button type="button" size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => addCameraAnimationPreset("truckLeft")}>{t("panel.config.scene3dCameraAnimTruckLeft")}</Button>
          <Button type="button" size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => addCameraAnimationPreset("craneUp")}>{t("panel.config.scene3dCameraAnimCraneUp")}</Button>
        </div>
        {config.cameraAnimations.map((rule) => (
          <div key={rule.id} className="rounded border border-border/60 p-2 text-[10px] space-y-1">
            <div>{rule.label ?? rule.id}</div>
            <div className="text-muted-foreground">{t("panel.config.scene3dCameraAnimDuration", { sec: rule.durationSec })}</div>
            {rule.mode === "orbit" ? (
              <label className="space-y-0.5 text-[10px] block">
                <span>{t("panel.config.scene3dCameraAnimSpeed")}</span>
                <Input
                  type="number"
                  className="h-7"
                  value={rule.orbitSpeedDegPerSec ?? 24}
                  onChange={(e) =>
                    updateCameraAnimation(rule.id, {
                      orbitSpeedDegPerSec: Number(e.target.value) || 0,
                    })
                  }
                />
              </label>
            ) : (
              <div className="grid grid-cols-3 gap-1.5">
                {(["x", "y", "z"] as const).map((axis, index) => (
                  <label key={axis} className="space-y-0.5 text-[10px]">
                    <span>{t("panel.config.scene3dCameraAnimOffset")} {axis.toUpperCase()}</span>
                    <Input
                      type="number"
                      className="h-7"
                      value={Number((rule.to.position[index] - rule.from.position[index]).toFixed(3))}
                      onChange={(e) => {
                        const nextPos = [...rule.to.position] as [number, number, number];
                        nextPos[index] = rule.from.position[index] + (Number(e.target.value) || 0);
                        updateCameraAnimation(rule.id, { to: { ...rule.to, position: nextPos } });
                      }}
                    />
                  </label>
                ))}
              </div>
            )}
            <Button type="button" size="sm" variant="ghost" className="h-7 text-[11px]" onClick={() => patch({ cameraAnimations: config.cameraAnimations.filter((a) => a.id !== rule.id) })}>
              {t("common.remove")}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
