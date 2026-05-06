// behavior.ts
import { ExecutionToken, Value } from "../type.js"
export type BehaviorContext = {
  token: ExecutionToken

  io: {
    getInput(name: string): Promise<Value>
    setOutput(name: string, value: Value): void
    emitFlow(port?: string): void
  }
}

export type BehaviorFn = (ctx: BehaviorContext) => Promise<void>
