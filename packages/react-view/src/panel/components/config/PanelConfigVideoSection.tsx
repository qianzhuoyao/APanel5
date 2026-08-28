import React, { useCallback, useState } from "react";
import { useI18n } from "@arronqzy/i18n/react";
import { Checkbox, Input } from "@arronqzy/ui";
import type { PanelElement } from "../../types";
import { readFileAsDataUrl, runBusyTask } from "../../utils/async-work";
import { getPanelMessages } from "../../constants/messages";
import { type ConfigSectionHelpers, type UpdateElement } from "./helpers";

export function PanelConfigVideoSection({
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
  const { renderSection, renderFieldGroup } = helpers;
  const selectedElement = element;
  const [videoStatus, setVideoStatus] = useState("");

  const updateSelectedVideo = useCallback(
    (patch: Partial<PanelElement>) => {
      if (selectedElement.materialType !== "video") return;
      updateElement(selectedElement.id, patch);
    },
    [selectedElement, updateElement]
  );
  const handleUploadVideoFile = useCallback(
    async (file: File) => {
      if (selectedElement.materialType !== "video") return;
      try {
        await runBusyTask(t("common.uploadingFile"), async () => {
          const base64 = await readFileAsDataUrl(file, messages.readVideoFailed, "video");
          updateSelectedVideo({ videoSrc: base64 });
          setVideoStatus(messages.videoLocalSaved);
          try {
            const form = new FormData();
            form.append("file", file);
            const resp = await fetch("/api/upload", { method: "POST", body: form });
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            const data = (await resp.json()) as { url?: string };
            if (data.url) {
              updateSelectedVideo({ videoRemoteUrl: data.url });
              setVideoStatus(messages.videoRemoteUploaded);
            }
          } catch {
            setVideoStatus(messages.videoServerUploadFailed);
          }
        });
      } catch (error) {
        setVideoStatus(
          error instanceof Error ? error.message : messages.readVideoFailed
        );
      }
    },
    [messages, selectedElement, t, updateSelectedVideo]
  );

  return (
    <>
      {
            renderSection(
              "videoConfig",
              t("panel.config.sectionVideo"),
              <>
                {renderFieldGroup(
                  t("panel.config.groupVideoSource"),
                  <>
                    <label className="block space-y-1">
                      <div>{t("panel.config.videoUrl")}</div>
                      <Input
                        value={selectedElement.videoRemoteUrl ?? ""}
                        onChange={(e) =>
                          updateSelectedVideo({
                            videoRemoteUrl: e.target.value || undefined,
                            videoSrc: e.target.value || selectedElement.videoSrc,
                          })
                        }
                        placeholder="https://example.com/video.mp4"
                        className="h-7"
                      />
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="inline-flex cursor-pointer items-center rounded border border-border px-2 py-1 text-[11px] hover:bg-accent">
                        {t("panel.config.uploadVideo")}
                        <Input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            e.currentTarget.value = "";
                            if (!file) return;
                            await handleUploadVideoFile(file);
                          }}
                        />
                      </label>
                    </div>
                    {videoStatus ? (
                      <div className="rounded border border-border/60 bg-background px-2 py-1.5 text-[11px] text-muted-foreground">
                        {videoStatus}
                      </div>
                    ) : null}
                    <video
                      controls
                      className="h-36 w-full rounded border border-border/60 bg-black/80 object-contain"
                      src={selectedElement.videoSrc || selectedElement.videoRemoteUrl || ""}
                    />
                    <label className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedElement.mediaAutoPauseOnEdit !== false}
                        className="h-4 w-4 border-2 border-foreground/80 bg-background ring-1 ring-foreground/40 data-[state=checked]:border-primary data-[state=checked]:ring-primary/40"
                        onCheckedChange={(checked) =>
                          updateSelectedVideo({
                            mediaAutoPauseOnEdit: checked !== false,
                          })
                        }
                      />
                      <span>{t("panel.config.autoPauseMedia")}</span>
                    </label>
                  </>
                )}
              </>,
              true,
              [t("panel.material.video"), "url", t("panel.config.searchKwUpload"), t("panel.config.searchKwPreview"), t("panel.config.searchKwAutoPause"), "media"]
            )
      }
    </>
  );
}
