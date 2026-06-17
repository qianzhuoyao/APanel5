import type { Value } from "./type.js";

/** 真信号：节点正常执行完成时的输出 */
export type TrueSignal<T = Value> = {
  kind: "true";
  value: T;
  timestamp: number;
  isoTime: string;
};

/** 假信号：节点执行出错时的输出 */
export type FalseSignal = {
  kind: "false";
  error: string;
  timestamp: number;
  isoTime: string;
};

export type NodeSignal<T = Value> = TrueSignal<T> | FalseSignal;

export function isTrueSignal<T = Value>(
  signal: unknown
): signal is TrueSignal<T> {
  return (
    !!signal &&
    typeof signal === "object" &&
    (signal as TrueSignal).kind === "true"
  );
}

export function isFalseSignal(signal: unknown): signal is FalseSignal {
  return (
    !!signal &&
    typeof signal === "object" &&
    (signal as FalseSignal).kind === "false"
  );
}

export function createTrueSignal<T = Value>(value: T): TrueSignal<T> {
  const timestamp = Date.now();
  return {
    kind: "true",
    value,
    timestamp,
    isoTime: new Date(timestamp).toISOString(),
  };
}

export function createFalseSignal(error: string): FalseSignal {
  const timestamp = Date.now();
  return {
    kind: "false",
    error,
    timestamp,
    isoTime: new Date(timestamp).toISOString(),
  };
}

/**
 * 同一输入端口连 n 条线时的「或」语义：任一为真则端口为真；
 * 若无真且存在假信号则合并为假；全无连线则为 undefined。
 */
export function combinePortSignalsOr(
  values: Array<Value | undefined>
): Value | undefined {
  const defined = values.filter((value) => value !== undefined);
  if (defined.length === 0) return undefined;

  for (const value of defined) {
    if (isTrueSignal(value)) {
      return createTrueSignal(value.value);
    }
  }

  const falseSignals = defined.filter(isFalseSignal);
  if (falseSignals.length > 0) {
    return createFalseSignal(
      falseSignals.map((signal) => signal.error).join("；")
    );
  }

  return undefined;
}
