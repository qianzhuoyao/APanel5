import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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
import { ConfigHintIcon } from "../ConfigHintIcon";
import { readFileAsDataUrl, runBusyTask } from "../../utils/async-work";
import { getPanelMessages } from "../../constants/messages";
import { type ConfigSectionHelpers, type UpdateElement } from "./helpers";

export function PanelConfigAudioSection({
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
  const [audioStatus, setAudioStatus] = useState("");
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recordStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  useEffect(
    () => () => {
      recordStreamRef.current?.getTracks().forEach((track) => track.stop());
    },
    []
  );

  const updateSelectedAudio = useCallback(
    (patch: Partial<PanelElement>) => {
      if (selectedElement.materialType !== "audio") return;
      updateElement(selectedElement.id, patch);
    },
    [selectedElement, updateElement]
  );
  const handleUploadAudioFile = useCallback(
    async (file: File) => {
      if (selectedElement.materialType !== "audio") return;
      try {
        await runBusyTask(t("common.uploadingFile"), async () => {
          const base64 = await readFileAsDataUrl(file, messages.readAudioFailed, "audio");
          updateSelectedAudio({ audioSrc: base64 });
          setAudioStatus(messages.audioLocalSaved);
          try {
            const form = new FormData();
            form.append("file", file);
            const resp = await fetch("/api/upload", { method: "POST", body: form });
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            const data = (await resp.json()) as { url?: string };
            if (data.url) {
              updateSelectedAudio({ audioRemoteUrl: data.url });
              setAudioStatus(messages.audioRemoteUploaded);
            }
          } catch {
            setAudioStatus(messages.audioServerUploadFailed);
          }
        });
      } catch (error) {
        setAudioStatus(
          error instanceof Error ? error.message : messages.readAudioFailed
        );
      }
    },
    [messages, selectedElement, t, updateSelectedAudio]
  );
  const handleUploadAudioPoster = useCallback(
    async (file: File) => {
      if (selectedElement.materialType !== "audio") return;
      try {
        const base64 = await readFileAsDataUrl(file, messages.readImageFailed, "image");
        updateSelectedAudio({ audioPosterImage: base64 });
        setAudioStatus(messages.audioPosterSet);
      } catch (error) {
        setAudioStatus(
          error instanceof Error ? error.message : messages.readImageFailed
        );
      }
    },
    [messages, selectedElement, updateSelectedAudio]
  );
  const stopRecordingAudio = useCallback(() => {
    recorderRef.current?.stop();
  }, []);
  const startRecordingAudio = useCallback(async () => {
    if (selectedElement.materialType !== "audio") return;
    if (!navigator.mediaDevices?.getUserMedia) {
      setAudioStatus(messages.audioRecordUnsupported);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recordStreamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      audioChunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      recorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType || "audio/webm" });
        try {
          const dataUrl = await readFileAsDataUrl(blob, messages.readRecordAudioFailed, "audio");
          updateSelectedAudio({ audioSrc: dataUrl });
          setAudioStatus(messages.audioRecordSaved);
        } catch (error) {
          setAudioStatus(
            error instanceof Error ? error.message : messages.readRecordAudioFailed
          );
        }
        recordStreamRef.current?.getTracks().forEach((track) => track.stop());
        recordStreamRef.current = null;
        recorderRef.current = null;
        setIsRecordingAudio(false);
      };
      recorder.start();
      setIsRecordingAudio(true);
      setAudioStatus(messages.audioRecording);
    } catch {
      setAudioStatus(messages.audioRecordStartFailed);
      setIsRecordingAudio(false);
    }
  }, [messages, selectedElement, updateSelectedAudio]);

  return (
    <>
      {
            renderSection(
              "audioConfig",
              t("panel.config.sectionAudio"),
              <>
                {renderFieldGroup(
                  t("panel.config.groupAudioSource"),
                  <>
                    <label className="block space-y-1">
                      <div>{t("panel.config.audioUrl")}</div>
                      <Input
                        value={selectedElement.audioRemoteUrl ?? ""}
                        onChange={(e) =>
                          updateSelectedAudio({
                            audioRemoteUrl: e.target.value || undefined,
                            audioSrc: e.target.value || selectedElement.audioSrc,
                          })
                        }
                        placeholder="https://example.com/audio.mp3"
                        className="h-7"
                      />
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="inline-flex cursor-pointer items-center rounded border border-border px-2 py-1 text-[11px] hover:bg-accent">
                        {t("panel.config.uploadAudio")}
                        <Input
                          type="file"
                          accept="audio/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            e.currentTarget.value = "";
                            if (!file) return;
                            await handleUploadAudioFile(file);
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        className="rounded border border-border px-2 py-1 text-[11px] hover:bg-accent disabled:opacity-50"
                        onClick={isRecordingAudio ? stopRecordingAudio : startRecordingAudio}
                      >
                        {isRecordingAudio ? t("panel.config.stopRecord") : t("panel.config.startRecord")}
                      </button>
                    </div>
                    {audioStatus ? (
                      <div className="rounded border border-border/60 bg-background px-2 py-1.5 text-[11px] text-muted-foreground">
                        {audioStatus}
                      </div>
                    ) : null}
                    <audio
                      controls
                      className="h-8 w-full"
                      src={selectedElement.audioSrc || selectedElement.audioRemoteUrl || ""}
                    />
                  </>
                )}
                {renderFieldGroup(
                  t("panel.config.groupDisplayStyle"),
                  <>
                    <label className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedElement.mediaAutoPauseOnEdit !== false}
                        className="h-4 w-4 border-2 border-foreground/80 bg-background ring-1 ring-foreground/40 data-[state=checked]:border-primary data-[state=checked]:ring-primary/40"
                        onCheckedChange={(checked) =>
                          updateSelectedAudio({
                            mediaAutoPauseOnEdit: checked !== false,
                          })
                        }
                      />
                      <span>{t("panel.config.autoPauseMedia")}</span>
                    </label>
                    <label className="block space-y-1">
                      <div>{t("panel.config.audioIconPreset")}</div>
                      <Select
                        value={selectedElement.audioIconPreset ?? "__none__"}
                        onValueChange={(value) =>
                          updateSelectedAudio({
                            audioIconPreset:
                              value === "__none__"
                                ? undefined
                                : (value as "speaker" | "music" | "headphone" | "wave"),
                          })
                        }
                      >
                        <SelectTrigger className="h-7">
                          <SelectValue placeholder={t("panel.config.selectIcon")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__none__">{t("panel.config.iconDefaultProgress")}</SelectItem>
                          <SelectItem value="speaker">{t("panel.config.iconSpeaker")}</SelectItem>
                          <SelectItem value="music">{t("panel.config.iconMusic")}</SelectItem>
                          <SelectItem value="headphone">{t("panel.config.iconHeadphone")}</SelectItem>
                          <SelectItem value="wave">{t("panel.config.iconWave")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </label>
                    <label className="block space-y-1">
                      <div>{t("panel.config.visualEffect")}</div>
                      <Select
                        value={selectedElement.audioVisualEffect ?? "pulse"}
                        onValueChange={(value) =>
                          updateSelectedAudio({
                            audioVisualEffect: value as "none" | "pulse" | "ripple",
                          })
                        }
                      >
                        <SelectTrigger className="h-7">
                          <SelectValue placeholder={t("panel.config.selectEffect")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">{t("panel.config.effectNone")}</SelectItem>
                          <SelectItem value="pulse">{t("panel.config.effectPulse")}</SelectItem>
                          <SelectItem value="ripple">{t("panel.config.effectRipple")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </label>
                    <label className="block space-y-1">
                      <div>{t("panel.config.effectSpeed")}</div>
                      <Select
                        value={selectedElement.audioVisualSpeed ?? "normal"}
                        onValueChange={(value) =>
                          updateSelectedAudio({
                            audioVisualSpeed: value as "slow" | "normal" | "fast",
                          })
                        }
                      >
                        <SelectTrigger className="h-7">
                          <SelectValue placeholder={t("panel.config.selectSpeed")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="slow">{t("panel.config.speedSlow")}</SelectItem>
                          <SelectItem value="normal">{t("panel.config.speedNormal")}</SelectItem>
                          <SelectItem value="fast">{t("panel.config.speedFast")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="inline-flex cursor-pointer items-center rounded border border-border px-2 py-1 text-[11px] hover:bg-accent">
                        {t("panel.config.uploadPoster")}
                        <Input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            e.currentTarget.value = "";
                            if (!file) return;
                            await handleUploadAudioPoster(file);
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        className="rounded border border-border px-2 py-1 text-[11px] hover:bg-accent"
                        onClick={() =>
                          updateSelectedAudio({
                            audioPosterImage: undefined,
                          })
                        }
                      >
                        {t("panel.config.clearPoster")}
                      </button>
                    </div>
                    {selectedElement.audioPosterImage ? (
                      <img
                        src={selectedElement.audioPosterImage}
                        alt={t("panel.config.audioPosterAlt")}
                        className="h-20 w-full rounded border border-border/60 object-cover"
                      />
                    ) : null}
                    <div className="flex items-center gap-1">
                      <div className="text-[11px] text-muted-foreground">{t("panel.config.audioPoster")}</div>
                      <ConfigHintIcon label={t("panel.config.audioPoster")}>
                        {t("panel.config.audioPosterHint")}
                      </ConfigHintIcon>
                    </div>
                  </>,
                  undefined,
                  { groupKey: "audioDisplayStyle", defaultOpen: false }
                )}
              </>,
              true,
              [t("panel.material.audio"), "url", t("panel.config.searchKwUpload"), t("panel.config.searchKwRecord"), "icon", t("panel.config.searchKwPoster"), t("panel.config.effect"), t("panel.config.searchKwAutoPause"), "media"]
            )
      }
    </>
  );
}
