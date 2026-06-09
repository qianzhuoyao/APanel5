import type { FetchRequestConfig } from "../fetch-config.js";
import { executeFetch, DEFAULT_FETCH_REQUEST_CONFIG } from "../fetch-config.js";
import type { JsonNodeConfig } from "../json-config.js";
import {
  DEFAULT_JSON_NODE_CONFIG,
  parseJsonConfig,
} from "../json-config.js";
import { registerDefaultBehaviors, LIFECYCLE_SIGNAL_KEY } from "../behaviors/default.js";
import { BehaviorRegistry } from "../core/behavior-registry.js";
import { Executor } from "../core/executor.js";
import {
  createLifecycleSignal,
  type LifecycleSignal,
  type PageLifecyclePhase,
} from "../lifecycle.js";
import {
  createFalseSignal,
  createTrueSignal,
  isTrueSignal,
} from "../node-signal.js";
import {
  BLUEPRINT_NODE_TYPE,
  getNodeDefinition,
  LIFECYCLE_NODE_TYPE,
} from "../nodes/definitions.js";
import type { BlueprintRefOutput, BlueprintNodeOutputs } from "../blueprint-signal.js";
import type { ExecutionToken, Scope, Value } from "../type.js";

export type RunnableGraphNode = {
  id: string;
  nodeType: string;
  lifecyclePhase?: PageLifecyclePhase;
  /** 蓝图库记录 id，Blueprint 节点引用嵌套蓝图时使用 */
  libraryBlueprintId?: string;
  blueprintName?: string;
  fetchConfig?: FetchRequestConfig;
  jsonConfig?: JsonNodeConfig;
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

export type LibraryBlueprintResolver = (
  libraryBlueprintId: string
) => Promise<RunnableGraph | null>;

type NodeOutputStore = Map<string, Map<string, Value>>;

function createTokenId() {
  return `token_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function cloneScope(scope?: Scope): Scope {
  return {
    parent: scope?.parent,
    vars: new Map(scope?.vars ?? []),
  };
}

export class BlueprintGraphRunner {
  private behaviors: BehaviorRegistry;
  private outputs: NodeOutputStore = new Map();
  private resolveLibraryBlueprint?: LibraryBlueprintResolver;

  constructor(
    private graph: RunnableGraph,
    options?: { resolveLibraryBlueprint?: LibraryBlueprintResolver }
  ) {
    this.resolveLibraryBlueprint = options?.resolveLibraryBlueprint;
    this.behaviors = new BehaviorRegistry();
    registerDefaultBehaviors(this.behaviors);
    this.registerBlueprintRefBehavior();
    this.registerFetchBehavior();
    this.registerJsonBehavior();
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

  /** 从所有无入流 signal 的节点开始执行（嵌套蓝图调用） */
  async runFromFlowEntries(parentScope?: Scope): Promise<BlueprintNodeOutputs> {
    this.outputs.clear();
    const entries = this.findSignalEntryNodes();
    for (const node of entries) {
      await this.runFromNode(node.id, undefined, parentScope);
    }
    return this.collectOutputs();
  }

  getNodeOutputs(): BlueprintNodeOutputs {
    return this.collectOutputs();
  }

  private registerBlueprintRefBehavior() {
    const runner = this;
    this.behaviors.registerJS("blueprint-ref-run", async ({ token, io }) => {
      const node = runner.requireNode(token.nodeId);

      try {
        const input = await io.getInput("in");
        if (!isTrueSignal(input)) {
          io.setOutput(
            "out",
            createFalseSignal("蓝图节点需要收到真信号后才会执行")
          );
          io.emitFlow("out");
          return;
        }

        const libraryId = node.libraryBlueprintId;
        if (!libraryId) {
          io.setOutput("out", createFalseSignal("未选择蓝图库中的蓝图"));
          io.emitFlow("out");
          return;
        }

        if (!runner.resolveLibraryBlueprint) {
          io.setOutput("out", createFalseSignal("蓝图库解析器未配置"));
          io.emitFlow("out");
          return;
        }

        const nestedGraph = await runner.resolveLibraryBlueprint(libraryId);
        if (!nestedGraph) {
          io.setOutput(
            "out",
            createFalseSignal(`蓝图库记录不存在: ${libraryId}`)
          );
          io.emitFlow("out");
          return;
        }

        const subRunner = new BlueprintGraphRunner(nestedGraph, {
          resolveLibraryBlueprint: runner.resolveLibraryBlueprint,
        });
        const nestedOutputs = await subRunner.runFromFlowEntries(token.scope);

        const payload: BlueprintRefOutput = {
          nodeId: token.nodeId,
          nodeType: node.nodeType,
          libraryBlueprintId: libraryId,
          blueprintName:
            node.blueprintName ?? nestedGraph.nodes[0]?.blueprintName,
          nestedOutputs,
        };

        io.setOutput("out", createTrueSignal(payload));
      } catch (error) {
        io.setOutput(
          "out",
          createFalseSignal(
            error instanceof Error ? error.message : String(error)
          )
        );
      }
      io.emitFlow("out");
    });
  }

  private registerFetchBehavior() {
    const runner = this;
    this.behaviors.registerJS("fetch-run", async ({ token, io }) => {
      const node = runner.requireNode(token.nodeId);

      try {
        const input = await io.getInput("in");
        if (!isTrueSignal(input)) {
          io.setOutput(
            "out",
            createFalseSignal("数据源节点需要收到真信号后才会发起请求")
          );
          io.emitFlow("out");
          return;
        }

        const config: FetchRequestConfig = {
          ...DEFAULT_FETCH_REQUEST_CONFIG,
          ...node.fetchConfig,
        };

        const result = await executeFetch(config);
        io.setOutput("out", createTrueSignal(result));
      } catch (error) {
        io.setOutput(
          "out",
          createFalseSignal(
            error instanceof Error ? error.message : String(error)
          )
        );
      }
      io.emitFlow("out");
    });
  }

  private registerJsonBehavior() {
    const runner = this;
    this.behaviors.registerJS("json-parse-run", async ({ token, io }) => {
      const node = runner.requireNode(token.nodeId);

      try {
        const input = await io.getInput("in");
        if (!isTrueSignal(input)) {
          io.setOutput(
            "out",
            createFalseSignal("JSON 节点需要收到真信号后才会解析")
          );
          io.emitFlow("out");
          return;
        }

        const config: JsonNodeConfig = {
          ...DEFAULT_JSON_NODE_CONFIG,
          ...node.jsonConfig,
        };
        const value = parseJsonConfig(config);
        io.setOutput("out", createTrueSignal(value));
      } catch (error) {
        io.setOutput(
          "out",
          createFalseSignal(
            error instanceof Error ? error.message : String(error)
          )
        );
      }
      io.emitFlow("out");
    });
  }

  private async runFromNode(
    nodeId: string,
    lifecycleSignal?: LifecycleSignal,
    parentScope?: Scope
  ) {
    const queue: ExecutionToken[] = [
      {
        tokenId: createTokenId(),
        nodeId,
        nodeType: this.requireNode(nodeId).nodeType,
        inPort: "in",
        scope: cloneScope(parentScope),
      },
    ];

    if (lifecycleSignal) {
      queue[0]!.scope.vars.set(LIFECYCLE_SIGNAL_KEY, lifecycleSignal);
    }

    const executor = new Executor({
      getNodeDefinition,
      behaviors: this.behaviors,
      runBlueprint: async () => {
        // 由 blueprint-ref-run 行为处理
      },
      getInputValue: async (token, port) => {
        const inbound = this.findInboundSignalEdge(token.nodeId, port);
        if (!inbound) return undefined;
        return this.getNodeOutput(inbound.source, inbound.sourceHandle ?? "out");
      },
      setNodeOutput: (token, port, value) => {
        this.setNodeOutput(token.nodeId, port, value);
      },
      emitFlow: (token, outPort) => {
        const nextNodes = this.findSignalTargets(token.nodeId, outPort);
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
      try {
        await executor.executeToken(token);
      } catch (error) {
        this.setNodeOutput(
          token.nodeId,
          "out",
          createFalseSignal(
            error instanceof Error ? error.message : String(error)
          )
        );
        const nextNodes = this.findSignalTargets(token.nodeId, "out");
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
      }
    }
  }

  private findSignalEntryNodes() {
    const hasIncoming = new Set<string>();
    for (const edge of this.graph.edges) {
      const handle = edge.targetHandle ?? "in";
      if (handle === "in") {
        hasIncoming.add(edge.target);
      }
    }
    return this.graph.nodes.filter(
      (node) =>
        node.nodeType !== LIFECYCLE_NODE_TYPE && !hasIncoming.has(node.id)
    );
  }

  private collectOutputs(): BlueprintNodeOutputs {
    const result: BlueprintNodeOutputs = {};
    for (const [nodeId, ports] of this.outputs.entries()) {
      result[nodeId] = Object.fromEntries(ports.entries());
    }
    return result;
  }

  private requireNode(nodeId: string): RunnableGraphNode {
    const node = this.graph.nodes.find((n) => n.id === nodeId);
    if (!node) {
      throw new Error(`Graph node not found: ${nodeId}`);
    }
    return node;
  }

  private findSignalTargets(nodeId: string, outPort: string) {
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

  private findInboundSignalEdge(nodeId: string, port: string) {
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

export { BLUEPRINT_NODE_TYPE };
