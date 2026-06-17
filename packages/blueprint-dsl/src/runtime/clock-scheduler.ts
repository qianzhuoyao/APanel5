import {
  buildClockSignalValue,
  normalizeClockConfig,
  startClockSchedule,
  stopAllClockSchedules,
  stopClockSchedule,
  validateClockScheduleConfig,
  type ClockNodeConfig,
} from "../clock-config.js";

export function buildClockSessionKey(scopeId: string, nodeId: string): string {
  return `${scopeId}:${nodeId}`;
}

export function scheduleClockOutputs(options: {
  sessionKey: string;
  config: ClockNodeConfig;
  onTick: () => void | Promise<void>;
}): () => void {
  return startClockSchedule(options);
}

export { stopClockSchedule, stopAllClockSchedules, validateClockScheduleConfig };

export function createClockOutputValue(config: ClockNodeConfig) {
  return buildClockSignalValue(normalizeClockConfig(config));
}
