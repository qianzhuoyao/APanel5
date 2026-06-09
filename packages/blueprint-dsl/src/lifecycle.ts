/** 页面生命周期阶段 */
export const PAGE_LIFECYCLE_PHASES = [
  "created",
  "beforeMount",
  "mounted",
  "updated",
  "beforeDestroy",
  "destroy",
  "activated",
  "deactivated",
] as const;

export type PageLifecyclePhase = (typeof PAGE_LIFECYCLE_PHASES)[number];

export type LifecycleSignal = {
  /** 触发的生命周期枚举 */
  phase: PageLifecyclePhase;
  /** 触发时刻（Unix 毫秒时间戳） */
  timestamp: number;
  /** ISO 8601 时间字符串，便于下游节点展示或日志 */
  isoTime: string;
};

export const PAGE_LIFECYCLE_LABELS: Record<PageLifecyclePhase, string> = {
  created: "已创建 (created)",
  beforeMount: "挂载前 (beforeMount)",
  mounted: "已挂载 (mounted)",
  updated: "已更新 (updated)",
  beforeDestroy: "销毁前 (beforeDestroy)",
  destroy: "已销毁 (destroy)",
  activated: "已激活 (activated)",
  deactivated: "已停用 (deactivated)",
};

export function createLifecycleSignal(phase: PageLifecyclePhase): LifecycleSignal {
  const timestamp = Date.now();
  return {
    phase,
    timestamp,
    isoTime: new Date(timestamp).toISOString(),
  };
}
