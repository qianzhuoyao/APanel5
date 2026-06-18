export type ClockNodeConfig = {
  /** 两次输出之间的间隔秒数 */
  intervalSeconds: number;
  /** 输出值中的时间格式化模板，支持 YYYY、MM、DD、HH、mm、ss */
  timeFormat: string;
  /** 收到真信号后的输出次数，默认 1 */
  outputCount: number;
  /** 收到真信号后立即输出第一次，再按间隔继续；关闭则首次也等待 n 秒 */
  emitImmediately: boolean;
};

export type ClockSignalOutput = {
  /** 按 timeFormat 格式化后的当前时间 */
  formatted: string;
  /** Unix 毫秒时间戳 */
  timestamp: number;
  /** ISO 8601 时间字符串 */
  isoTime: string;
};

export const DEFAULT_CLOCK_NODE_CONFIG: ClockNodeConfig = {
  intervalSeconds: 0,
  timeFormat: "YYYY-MM-DD HH:mm:ss",
  outputCount: 1,
  emitImmediately: true,
};

export function normalizeClockConfig(
  config?: Partial<ClockNodeConfig> | null
): ClockNodeConfig {
  const intervalRaw = Number(config?.intervalSeconds);
  const intervalSeconds =
    Number.isFinite(intervalRaw) && intervalRaw > 0
      ? Math.floor(intervalRaw)
      : 0;

  const outputCountRaw = Number(config?.outputCount);
  const outputCount =
    Number.isFinite(outputCountRaw) && outputCountRaw > 0
      ? Math.floor(outputCountRaw)
      : DEFAULT_CLOCK_NODE_CONFIG.outputCount;

  const timeFormat =
    config?.timeFormat?.trim() || DEFAULT_CLOCK_NODE_CONFIG.timeFormat;

  return {
    intervalSeconds,
    timeFormat,
    outputCount,
    emitImmediately: config?.emitImmediately !== false,
  };
}

export function validateClockScheduleConfig(
  config: ClockNodeConfig
): { ok: true } | { ok: false; error: string } {
  const normalized = normalizeClockConfig(config);

  if (normalized.outputCount <= 0) {
    return { ok: false, error: "输出次数须大于 0" };
  }

  const needsInterval =
    normalized.outputCount > 1 ||
    (normalized.outputCount === 1 && !normalized.emitImmediately);

  if (needsInterval && normalized.intervalSeconds <= 0) {
    return { ok: false, error: "当前配置下时钟信号间隔须大于 0 秒" };
  }

  return { ok: true };
}

const pad2 = (value: number) => String(value).padStart(2, "0");

/** 将 Date 格式化为指定模板（YYYY/MM/DD/HH/mm/ss） */
export function formatClockTime(date: Date, pattern: string): string {
  const tokens: Record<string, string> = {
    YYYY: String(date.getFullYear()).padStart(4, "0"),
    MM: pad2(date.getMonth() + 1),
    DD: pad2(date.getDate()),
    HH: pad2(date.getHours()),
    mm: pad2(date.getMinutes()),
    ss: pad2(date.getSeconds()),
  };

  return pattern.replace(/YYYY|MM|DD|HH|mm|ss/g, (token) => tokens[token] ?? token);
}

export function buildClockSignalValue(
  config: ClockNodeConfig,
  now = new Date()
): ClockSignalOutput {
  const normalized = normalizeClockConfig(config);
  return {
    formatted: formatClockTime(now, normalized.timeFormat),
    timestamp: now.getTime(),
    isoTime: now.toISOString(),
  };
}

function sleep(ms: number, abort: { aborted: boolean }, sessionKey?: string): Promise<void> {
  if (ms <= 0 || abort.aborted) return Promise.resolve();
  return new Promise((resolve) => {
    const timerId = setTimeout(() => {
      clearInterval(pollId);
      resolve();
    }, ms);
    const pollId = setInterval(() => {
      if (
        abort.aborted ||
        (sessionKey !== undefined && isClockSessionAborted(sessionKey))
      ) {
        clearTimeout(timerId);
        clearInterval(pollId);
        resolve();
      }
    }, 50);
  });
}

/**
 * 第 tickIndex 次输出（从 0 起）相对调度起点的目标延迟（毫秒）。
 * - 立即发送且次数 > 1：第 1 次为 0，其余依次为 m、2m…
 * - 未立即发送：依次为 m、2m、3m…
 */
export function getClockTickDelayOffsetMs(
  config: ClockNodeConfig,
  tickIndex: number
): number {
  const normalized = normalizeClockConfig(config);
  const intervalMs = normalized.intervalSeconds * 1000;

  if (tickIndex <= 0) {
    return normalized.emitImmediately ? 0 : intervalMs;
  }

  if (normalized.emitImmediately) {
    return tickIndex * intervalMs;
  }

  return (tickIndex + 1) * intervalMs;
}

/** 距离第 tickIndex 次输出还应等待的毫秒数（基于调度起点） */
export function getClockTickWaitMs(
  config: ClockNodeConfig,
  tickIndex: number,
  scheduleStartMs: number,
  nowMs = Date.now()
): number {
  const targetMs = scheduleStartMs + getClockTickDelayOffsetMs(config, tickIndex);
  return Math.max(0, targetMs - nowMs);
}

const activeSessions = new Map<string, { aborted: boolean }>();
const abortedClockSessions = new Set<string>();

/** 停止指定会话的时钟调度 */
export function stopClockSchedule(sessionKey: string): void {
  const session = activeSessions.get(sessionKey);
  if (!session) return;
  session.aborted = true;
  activeSessions.delete(sessionKey);
}

export function isClockScheduleActive(sessionKey: string): boolean {
  return activeSessions.has(sessionKey);
}

/** 中止时钟：取消剩余 tick，并标记会话供下游传播循环检测 */
export function abortClockSession(sessionKey: string): void {
  stopClockSchedule(sessionKey);
  abortedClockSessions.add(sessionKey);
}

export function isClockSessionAborted(sessionKey: string): boolean {
  return abortedClockSessions.has(sessionKey);
}

export function clearClockSessionAbort(sessionKey: string): void {
  abortedClockSessions.delete(sessionKey);
}

/**
 * 按配置依次触发 onTick；新的调度会取消同 sessionKey 的上一次调度。
 * 返回取消函数。
 */
export function startClockSchedule(options: {
  sessionKey: string;
  config: ClockNodeConfig;
  onTick: () => void | Promise<void>;
  onSettled?: () => void;
}): () => void {
  stopClockSchedule(options.sessionKey);
  clearClockSessionAbort(options.sessionKey);

  const abort = { aborted: false };
  activeSessions.set(options.sessionKey, abort);

  void (async () => {
    try {
      const config = normalizeClockConfig(options.config);
      const total = config.outputCount;
      const scheduleStartMs = Date.now();

      for (let tickIndex = 0; tickIndex < total; tickIndex++) {
        if (abort.aborted || isClockSessionAborted(options.sessionKey)) return;

        const waitMs = getClockTickWaitMs(config, tickIndex, scheduleStartMs);
        if (waitMs > 0) {
          await sleep(waitMs, abort, options.sessionKey);
        }

        if (abort.aborted || isClockSessionAborted(options.sessionKey)) return;
        await options.onTick();
      }
    } finally {
      activeSessions.delete(options.sessionKey);
      options.onSettled?.();
    }
  })();

  return () => stopClockSchedule(options.sessionKey);
}

/** 停止全部时钟调度（如蓝图面板卸载时） */
export function stopAllClockSchedules(): void {
  for (const key of [...activeSessions.keys()]) {
    abortClockSession(key);
  }
}
