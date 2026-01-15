import { ExecutionToken } from "../type"
import { Executor } from "./executor"

// scheduler-loop.ts
async function schedulerLoop(
  queue: ExecutionToken[],
  executor: Executor
) {
  while (queue.length > 0) {
    const token = queue.shift()!
    await executor.executeToken(token)
  }
}
