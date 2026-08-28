import React from "react";
import {
  Empty,
  EmptyDescription,
  EmptyIcon,
  EmptyTitle,
  Input,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@arronqzy/ui";
import { PANEL_Z_INDEX } from "../constants/zIndex";
import { IconHistory } from "../icons";
import type { PanelHistoryItem } from "../types";
import { formatRelativeTime } from "../utils/panelSelection";

export type PanelHistoryPopoverProps = {
  t: (key: string, params?: Record<string, string | number>) => string;
  isHistoryPanelExpanded: boolean;
  setIsHistoryPanelExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  history: PanelHistoryItem[];
  historyCursor: number;
  historyKeyword: string;
  setHistoryKeyword: React.Dispatch<React.SetStateAction<string>>;
  normalizedHistoryKeyword: string;
  goToHistory: (index: number) => void;
  historyNow: number;
  themedScrollbarClass: string;
};

export function PanelHistoryPopover({
  t,
  isHistoryPanelExpanded,
  setIsHistoryPanelExpanded,
  history,
  historyCursor,
  historyKeyword,
  setHistoryKeyword,
  normalizedHistoryKeyword,
  goToHistory,
  historyNow,
  themedScrollbarClass,
}: PanelHistoryPopoverProps) {
  return (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsHistoryPanelExpanded((prev) => !prev)}
                          className={[
                            "rounded border border-border p-1 hover:bg-accent",
                            isHistoryPanelExpanded ? "bg-accent/60" : "",
                          ].join(" ")}
                          aria-label={isHistoryPanelExpanded ? t("panel.history.collapse") : t("panel.history.expand")}
                        >
                          <IconHistory />
                        </button>
                        {isHistoryPanelExpanded ? (
                          <div
                            className="absolute left-1/2 top-[calc(100%+6px)] w-[280px] -translate-x-1/2 rounded-lg border border-border bg-card/95 p-2 shadow-lg backdrop-blur"
                            style={{ zIndex: PANEL_Z_INDEX.historyPopover }}
                          >
                            <div className="mb-1 flex items-center justify-between">
                              <span className="text-[11px] font-semibold text-muted-foreground">{t("panel.history.title")}</span>
                              <span className="text-[11px] text-muted-foreground">
                                {history.length > 0 ? `${historyCursor + 1}/${history.length}` : "0/0"}
                              </span>
                            </div>
                            <Input
                              value={historyKeyword}
                              onChange={(e) => setHistoryKeyword(e.target.value)}
                              placeholder={t("panel.history.searchPlaceholder")}
                              className="mb-2 h-7 text-xs"
                            />
                            <div
                              className={`max-h-52 space-y-1 overflow-auto pr-1 text-[11px] ${themedScrollbarClass}`}
                            >
                              {history.length === 0 ? (
                                <Empty className="py-4">
                                  <EmptyIcon className="h-8 w-8">
                                    <IconHistory />
                                  </EmptyIcon>
                                  <EmptyTitle className="text-xs">{t("panel.history.emptyTitle")}</EmptyTitle>
                                  <EmptyDescription className="text-[11px]">
                                    {t("panel.history.emptyDesc")}
                                  </EmptyDescription>
                                </Empty>
                              ) : (
                                history
                                  .slice(Math.max(0, history.length - 20))
                                  .reverse()
                                  .filter((item) =>
                                    !normalizedHistoryKeyword
                                      ? true
                                      : item.label.toLowerCase().includes(normalizedHistoryKeyword)
                                  )
                                  .map((item) => (
                                    <button
                                      key={`${item.index}-${item.timestamp}`}
                                      type="button"
                                      className={[
                                        "w-full rounded border px-2 py-1 text-left transition-colors",
                                        item.active
                                          ? "border-primary/50 bg-primary/10 text-foreground"
                                          : "border-border/60 bg-background/70 text-muted-foreground hover:bg-accent/50",
                                      ].join(" ")}
                                      title={new Date(item.timestamp).toLocaleString()}
                                      onClick={() => {
                                        if (item.active) return;
                                        goToHistory(item.index);
                                      }}
                                    >
                                      <div className="flex items-center justify-between gap-2">
                                        <span className="truncate">{item.label}</span>
                                        <span className="shrink-0 text-[10px] text-muted-foreground">
                                          {formatRelativeTime(item.timestamp, historyNow, t)}
                                        </span>
                                      </div>
                                    </button>
                                  ))
                              )}
                              {history.length > 0 &&
                              history
                                .slice(Math.max(0, history.length - 20))
                                .reverse()
                                .filter((item) =>
                                  !normalizedHistoryKeyword
                                    ? true
                                    : item.label.toLowerCase().includes(normalizedHistoryKeyword)
                                ).length === 0 ? (
                                <Empty className="py-4">
                                  <EmptyIcon className="h-8 w-8">
                                    <svg
                                      viewBox="0 0 24 24"
                                      className="h-4 w-4"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="1.8"
                                      aria-hidden="true"
                                    >
                                      <circle cx="11" cy="11" r="7" />
                                      <path d="m20 20-3.5-3.5" />
                                    </svg>
                                  </EmptyIcon>
                                  <EmptyTitle className="text-xs">{t("panel.history.noMatchTitle")}</EmptyTitle>
                                  <EmptyDescription className="text-[11px]">
                                    {t("panel.history.noMatchDesc")}
                                  </EmptyDescription>
                                </Empty>
                              ) : null}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="z-[10000]">
                      {isHistoryPanelExpanded ? t("panel.history.collapse") : t("panel.history.expand")}
                    </TooltipContent>
                  </Tooltip>

  );
}
