import { BehaviorSubject } from "rxjs";

// 指令函数类型
type Handler = (...args: any[]) => any;

// 指令对象
interface Instruction {
  name: string;
  handler: Handler;
}

// 指令执行事件
interface InstructionEvent {
  name: string;
  args: any[];
  result?: any;
}

// 指令集类
export class InstructionSet {
  // 存储指令：键 = name, 值 = handler
  private instructions: Record<string, Handler> = {};

  // 全局 BehaviorSubject，通知每次指令执行
  public events$ = new BehaviorSubject<InstructionEvent | null>(null);

  /** 注册指令 */
  register(name: string, handler: Handler) {
    this.instructions[name] = handler;
  }

  /** 执行指令 */
  execute(name: string, ...args: any[]) {
    const fn = this.instructions[name];
    if (!fn) {
      console.warn(`指令不存在: ${name}`);
      return;
    }
    const result = fn(...args);

    // 发射事件
    this.events$.next({ name, args, result });
    return result;
  }

  /** 获取指令 */
  get(name: string): Handler | undefined {
    return this.instructions[name];
  }

  /** 查看所有指令 */
  getAll(): string[] {
    return Object.keys(this.instructions);
  }
}
export const instructions = new InstructionSet();
 