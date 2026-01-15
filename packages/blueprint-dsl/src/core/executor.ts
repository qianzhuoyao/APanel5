// executor.ts
import { BehaviorRegistry } from "./behavior-registry";
import { NodeDefinition, ExecutionToken, Value } from "../type";

export type ExecutorDeps = {
  getNodeDefinition(type: string): NodeDefinition;
  behaviors: BehaviorRegistry;

  // 蓝图 runner（给 blueprint behavior 用）
  runBlueprint: (args: {
    blueprintId: string;
    token: ExecutionToken;
  }) => Promise<void>;

  // 图能力（flow / data）
  getInputValue: (token: ExecutionToken, port: string) => Promise<Value>;
  setNodeOutput: (token: ExecutionToken, port: string, value: Value) => void;
  emitFlow: (token: ExecutionToken, outPort: string) => void;
};
export class Executor {
  constructor(private deps: ExecutorDeps) {}

  async executeToken(token: ExecutionToken): Promise<void> {
    const def = this.deps.getNodeDefinition(token.nodeType)
    const behavior = this.deps.behaviors.get(def.behavior.ref)

    const io = {
      getInput: (name: string) =>
        this.deps.getInputValue(token, name),

      setOutput: (name: string, value: Value) =>
        this.deps.setNodeOutput(token, name, value),

      emitFlow: (port = "out") =>
        this.deps.emitFlow(token, port),
    }

    if (behavior.kind === "js") {
      await behavior.run({ token, io })
      return
    }

    if (behavior.kind === "blueprint") {
      await this.deps.runBlueprint({
        blueprintId: behavior.blueprintId,
        token,
      })
      return
    }
  }
}
