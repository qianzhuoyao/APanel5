import { registerDefaultBehaviors, LIFECYCLE_SIGNAL_KEY } from "../behaviors/default.js";
import { BehaviorRegistry } from "../core/behavior-registry.js";
import { Executor } from "../core/executor.js";
import {
  createLifecycleSignal,
  type LifecycleSignal,
  type PageLifecyclePhase,
} from "../lifecycle.js";
import { getNodeDefinition, LIFECYCLE_NODE_TYPE } from "../nodes/definitions.js";
import type { ExecutionToken, Value } from "../type.js";

export type RunnableGraphNode = {
  id: string;
  nodeType: string;
  lifecyclePhase?: PageLifecyclePhase;
};

export type RunnableGraphEdge = {
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
};

export type RunnableGraph = {
  nodes: RunnableGraphNode[];
  edges: RunnableGraphEdge[];
};

type NodeOutputStore = Map<string, Map<string, Value>>;

function createTokenId() {
  return `token_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export class BlueprintGraphRunner {
  private behaviors: BehaviorRegistry;
  private outputs: NodeOutputStore = new Map();

  constructor(private graph: RunnableGraph) {
    this.behaviors = new BehaviorRegistry();
    registerDefaultBehaviors(this.behaviors);
  }

  async emitLifecycle(phase: PageLifecyclePhase): Promise<void> {
    const signal = createLifecycleSignal(phase);
    const targets = this.graph.nodes.filter(
      (node) =>
        node.nodeType === LIFECYCLE_NODE_TYPE && node.lifecyclePhase === phase
    );

    for (const node of targets) {
      await this.runFromNode(node.id, signal);
    }
  }

  private async runFromNode(nodeId: string, lifecycleSignal?: LifecycleSignal) {
    const queue: ExecutionToken[] = [
      {
        tokenId: createTokenId(),
        nodeId,
        nodeType: this.requireNode(nodeId).nodeType,
        inPort: "in",
        scope: {
          vars: new Map(
            lifecycleSignal
              ? [[LIFECYCLE_SIGNAL_KEY, lifecycleSignal]]
              : undefined
          ),
        },
      },
    ];

    const executor = new Executor({
      getNodeDefinition,
      behaviors: this.behaviors,
      runBlueprint: async () => {
        // 嵌套蓝图暂未接入
      },
      getInputValue: async (token, port) => {
        const inbound = this.findInboundDataEdge(token.nodeId, port);
        if (!inbound) return undefined;
        return this.getNodeOutput(inbound.source, inbound.sourceHandle ?? port);
      },
      setNodeOutput: (token, port, value) => {
        this.setNodeOutput(token.nodeId, port, value);
      },
      emitFlow: (token, outPort) => {
        const nextNodes = this.findFlowTargets(token.nodeId, outPort);
        for (const target of nextNodes) {
          queue.push({
            tokenId: createTokenId(),
            nodeId: target.nodeId,
            nodeType: target.nodeType,
            inPort: target.inPort,
            scope: token.scope,
            correlationId: token.correlationId ?? token.tokenId,
          });
        }
      },
    });

    while (queue.length > 0) {
      const token = queue.shift()!;
      await executor.executeToken(token);
    }
  }

  private requireNode(nodeId: string): RunnableGraphNode {
    const node = this.graph.nodes.find((n) => n.id === nodeId);
    if (!node) {
      throw new Error(`Graph node not found: ${nodeId}`);
    }
    return node;
  }

  private findFlowTargets(nodeId: string, outPort: string) {
    return this.graph.edges
      .filter(
        (edge) =>
          edge.source === nodeId && (edge.sourceHandle ?? "out") === outPort
      )
      .map((edge) => {
        const target = this.requireNode(edge.target);
        return {
          nodeId: target.id,
          nodeType: target.nodeType,
          inPort: edge.targetHandle ?? "in",
        };
      });
  }

  private findInboundDataEdge(nodeId: string, port: string) {
    return this.graph.edges.find(
      (edge) =>
        edge.target === nodeId && (edge.targetHandle ?? port) === port
    );
  }

  private getNodeOutput(nodeId: string, port: string): Value {
    return this.outputs.get(nodeId)?.get(port);
  }

  private setNodeOutput(nodeId: string, port: string, value: Value) {
    let nodeOutputs = this.outputs.get(nodeId);
    if (!nodeOutputs) {
      nodeOutputs = new Map();
      this.outputs.set(nodeId, nodeOutputs);
    }
    nodeOutputs.set(port, value);
  }
}
