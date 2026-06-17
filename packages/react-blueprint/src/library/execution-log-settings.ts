export type ExecutionLogSettings = {
  retentionDays: number;
  autoSave: boolean;
  /** IndexedDB 中最多保留的日志条数 */
  maxSavedRuns: number;
};

const SETTINGS_KEY = "arron-blueprint-execution-log-settings";

export const DEFAULT_EXECUTION_LOG_SETTINGS: ExecutionLogSettings = {
  retentionDays: 7,
  autoSave: true,
  maxSavedRuns: 80,
};

export function readExecutionLogSettings(): ExecutionLogSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_EXECUTION_LOG_SETTINGS };
    const parsed = JSON.parse(raw) as Partial<ExecutionLogSettings>;
    return {
      retentionDays:
        typeof parsed.retentionDays === "number" && parsed.retentionDays > 0
          ? parsed.retentionDays
          : DEFAULT_EXECUTION_LOG_SETTINGS.retentionDays,
      autoSave:
        typeof parsed.autoSave === "boolean"
          ? parsed.autoSave
          : DEFAULT_EXECUTION_LOG_SETTINGS.autoSave,
      maxSavedRuns:
        typeof parsed.maxSavedRuns === "number" && parsed.maxSavedRuns > 0
          ? Math.floor(parsed.maxSavedRuns)
          : DEFAULT_EXECUTION_LOG_SETTINGS.maxSavedRuns,
    };
  } catch {
    return { ...DEFAULT_EXECUTION_LOG_SETTINGS };
  }
}

export function writeExecutionLogSettings(settings: ExecutionLogSettings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // ignore storage errors
  }
}

export function retentionCutoffMs(retentionDays: number) {
  return Date.now() - retentionDays * 24 * 60 * 60 * 1000;
}
