import {
  buildClockSignalValue,
  normalizeClockConfig,
  startClockSchedule,
  stopAllClockSchedules,
  stopClockSchedule,
  abortClockSession,
  isClockScheduleActive,
  isClockSessionAborted,
  clearClockSessionAbort,
  validateClockScheduleConfig,
  type ClockNodeConfig,
} from "../clock-config.js";
import {
  markClockNodeActive,
  markClockNodeInactive,
} from "./clock-active-registry.js";

export function buildClockSessionKey(scopeId: string, nodeId: string): string {
  return `${scopeId}:${nodeId}`;
}

export function abortClockNode(scopeId: string, nodeId: string): void {
  abortClockSession(buildClockSessionKey(scopeId, nodeId));
  markClockNodeInactive(nodeId);
}

export function scheduleClockOutputs(options: {
  sessionKey: string;
  config: ClockNodeConfig;
  onTick: () => void | Promise<void>;
  onSettled?: () => void;
}): () => void {
  return startClockSchedule(options);
}

export {
  stopClockSchedule,
  stopAllClockSchedules,
  abortClockSession,
  isClockScheduleActive,
  isClockSessionAborted,
  clearClockSessionAbort,
  validateClockScheduleConfig,
};

export function createClockOutputValue(config: ClockNodeConfig) {
  return buildClockSignalValue(normalizeClockConfig(config));
}
