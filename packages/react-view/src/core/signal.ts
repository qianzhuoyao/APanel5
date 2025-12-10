import { BehaviorSubject } from "rxjs";

/**
 * @example
 * 

// 使用示例（符合你的期望调用方式）
const [headerName, setHeaderName] = createSignal<string | number>(123); // 支持混合类型

console.log(headerName()); // 输出: 123，类型: string | number

// 手动订阅（可选）
const unsubManual = headerName.subscribe((value: string | number) => {
  console.log("手动订阅:", value);
});

// effect：自动追踪 headerName，当变化时打印
const disposeEffect = createEffect(() => {
  console.log("effect: headerName =", headerName()); // 初始输出: effect: headerName = 123
});

setHeaderName("新标题"); //
// 输出:
// 手动订阅: 新标题
// effect: headerName = 新标题

setHeaderName(456); //
// 输出:
// 手动订阅: 456
// effect: headerName = 456

 */
// 全局追踪器：当前运行的 effect

// 类型定义
type SignalGetter<T> = (() => T) & {
  subscribe: (cb: (value: T) => void) => () => void;
};

type SignalSetter<T> = (newValue: T) => void;

type Signal<T> = {
  subject: BehaviorSubject<T>;
  subscribers: Set<() => void>;
  get: SignalGetter<T>;
  set: SignalSetter<T>;
};

// 全局追踪器：当前运行的 effect
let currentEffect: (() => void) | null = null;

// createSignal 函数：返回 [getFn, setFn]，支持解构
export function createSignal<T>(
  initialValue: T
): [SignalGetter<T>, SignalSetter<T>] {
  const subject = new BehaviorSubject<T>(initialValue);
  const subscribers = new Set<() => void>(); // 存储 effect 的 run 函数

  // signal 对象：内部管理
  const signal: Signal<T> = {
    subject,
    subscribers,
    get: null as any, // 稍后赋值
    set: null as any, // 稍后赋值
  };

  // getter 函数：调用时读取值，并在 effect 中收集依赖
  const getFn: SignalGetter<T> = function () {
    if (currentEffect) {
      // 收集依赖：将当前 effect 的 run 添加到信号的 subscribers
      signal.subscribers.add(currentEffect);
    }
    return subject.value;
  };

  // 附加 subscribe 方法（手动订阅）
  getFn.subscribe = (cb: (value: T) => void) => {
    cb(subject.value); // 立即触发当前值
    const subscription = subject.subscribe(cb);
    return () => subscription.unsubscribe();
  };

  signal.get = getFn;

  // setter 函数：更新值，触发手动订阅者和 effect
  const setFn: SignalSetter<T> = function (newValue: T) {
    subject.next(newValue);
    // 触发所有 effect subscribers
    subscribers.forEach((run) => run());
  };

  signal.set = setFn;

  // 返回 [getFn, setFn]
  return [getFn, setFn];
}

// createEffect 函数：自动追踪依赖，并在变化时重新运行 fn
export function createEffect(fn: () => void): () => void {
  let disposed = false;
  const signalDeps = new Set<Signal<any>>(); // 存储访问过的信号对象

  const effect = {
    run: () => {
      if (disposed) return;

      // 清除旧依赖
      signalDeps.forEach((sig) => sig.subscribers.delete(effect.run));
      signalDeps.clear();

      // 运行 fn，收集新依赖
      currentEffect = effect.run;
      fn();
      currentEffect = null;

      // 重新订阅新依赖
      signalDeps.forEach((sig) => sig.subscribers.add(effect.run));
    },
  };

  // 初始运行
  effect.run();

  // 返回 dispose 函数
  return () => {
    disposed = true;
    signalDeps.forEach((sig) => sig.subscribers.delete(effect.run));
    signalDeps.clear();
  };
}
