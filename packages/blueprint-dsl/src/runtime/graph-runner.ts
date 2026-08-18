import type { FetchRequestConfig } from "../fetch-config.js";
import {
  executeFetch,
  normalizeFetchRequestConfig,
  resolveFetchRequestUrl,
} from "../fetch-config.js";
import {
  applyFetchConfigScope,
  getFetchBodyValidationError,
  getFetchHeadersValidationError,
  resolveFetchIncomingScope,
} from "../incoming-node-scope.js";
import type { JsonNodeConfig } from "../json-config.js";
import {
  DEFAULT_JSON_NODE_CONFIG,
  parseJsonConfig,
} from "../json-config.js";
import type { LogicNodeConfig } from "../logic-config.js";
import {
  DEFAULT_LOGIC_NODE_CONFIG,
  executeLogicConfig,
} from "../logic-config.js";
import type { ClockNodeConfig } from "../clock-config.js";
import {
  buildClockSignalValue,
  DEFAULT_CLOCK_NODE_CONFIG,
  getClockTickWaitMs,
  normalizeClockConfig,
  validateClockScheduleConfig,
} from "../clock-config.js";
import type { ViewEventNodeConfig, ViewEventSignal } from "../event-config.js";
import { normalizeViewEventConfig } from "../event-config.js";
import {
  buildClockSessionKey,
  scheduleClockOutputs,
  stopAllClockSchedules,
  abortClockNode as abortClockNodeSession,
  isClockSessionAborted,
  clearClockSessionAbort,
} from "./clock-scheduler.js";
import {
  markClockNodeActive,
  markClockNodeInactive,
} from "./clock-active-registry.js";
import {
  registerDefaultBehaviors,
  BLUEPRINT_ACTIVATION_INPUT_KEY,
  LIFECYCLE_SIGNAL_KEY,
  UI_EVENT_PAYLOAD_KEY,
  VIEW_EVENT_SIGNAL_KEY,
} from "../behaviors/default.js";
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
  combinePortSignalsOr,
  isFalseSignal,
  isTrueSignal,
} from "../node-signal.js";
import {
  BLUEPRINT_NODE_TYPE,
  CLOCK_NODE_TYPE,
  EVENT_NODE_TYPE,
  getNodeDefinition,
  LIFECYCLE_NODE_TYPE,
  VIEW_NODE_TYPE,
} from "../nodes/definitions.js";
import type { BlueprintRefOutput, BlueprintNodeOutputs } from "../blueprint-signal.js";
import {
  createTraceEntryId,
  serializeTraceValue,
  type ExecutionTraceEntry,
} from "./execution-trace.js";
import type { ExecutionToken, Scope, Value } from "../type.js";
import {
  assertNoBlueprintReferenceCycle,
  BLUEPRINT_CALL_STACK_KEY,
  detectRuntimeBlueprintCycle,
  resolveBlueprintCallStack,
} from "./blueprint-cycle.js";

export type RunnableGraphNode = {
  id: string;
  nodeType: string;
  label?: string;
  role?: string;
  lifecyclePhase?: PageLifecyclePhase;
  /** 蓝图库记录 id，Blueprint 节点引用嵌套蓝图时使用 */
  libraryBlueprintId?: string;
  blueprintName?: string;
  /** 视图绑定节点关联的视图画布元素 id */
  viewElementIds?: string[];
  fetchConfig?: FetchRequestConfig;
  jsonConfig?: JsonNodeConfig;
  logicConfig?: LogicNodeConfig;
  clockConfig?: ClockNodeConfig;
  eventConfig?: ViewEventNodeConfig;
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
  /** 为 true 时调试/执行不因假信号阻塞队列 */
  allowFalseSignalPropagation?: boolean;
};

export type LibraryBlueprintResolver = (
  libraryBlueprintId: string
) => Promise<RunnableGraph | null>;

export type ViewScopeUpdateCallback = (
  viewElementIds: string[],
  scope: unknown
) => void;

type NodeOutputStore = Map<string, Map<string, Value>>;

type DebugSessionSnapshot = {
  outputs: NodeOutputStore;
  queue: ExecutionToken[];
  traceEntries: ExecutionTraceEntry[];
};

function createTokenId() {
  return `token_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function cloneScope(scope?: Scope): Scope {
  return {
    parent: scope?.parent,
    vars: new Map(scope?.vars ?? []),
  };
}

function cloneOutputs(outputs: NodeOutputStore): NodeOutputStore {
  const next = new Map<string, Map<string, Value>>();
  for (const [nodeId, ports] of outputs.entries()) {
    next.set(nodeId, new Map(ports));
  }
  return next;
}

function cloneToken(token: ExecutionToken): ExecutionToken {
  return {
    tokenId: token.tokenId,
    nodeId: token.nodeId,
    nodeType: token.nodeType,
    inPort: token.inPort,
    scope: cloneScope(token.scope),
    correlationId: token.correlationId,
  };
}

function cloneQueue(queue: ExecutionToken[]): ExecutionToken[] {
  return queue.map(cloneToken);
}

type DebugProgressCallback = (entries: ExecutionTraceEntry[]) => void;

export class BlueprintGraphRunner {
  private behaviors: BehaviorRegistry;
  private outputs: NodeOutputStore = new Map();
  private resolveLibraryBlueprint?: LibraryBlueprintResolver;
  private debugQueue: ExecutionToken[] | null = null;
  private debugExecutor: Executor | null = null;
  private traceEntries: ExecutionTraceEntry[] = [];
  private debugHistory: DebugSessionSnapshot[] = [];
  private rootLibraryBlueprintId?: string | null;
  private resolveBlueprintName?: (libraryBlueprintId: string) => string;
  private cycleValidated = false;
  private debugProgressCallback: DebugProgressCallback | null = null;
  private onViewScopeUpdate?: ViewScopeUpdateCallback;

  constructor(
    private graph: RunnableGraph,
    options?: {
      resolveLibraryBlueprint?: LibraryBlueprintResolver;
      rootLibraryBlueprintId?: string | null;
      resolveBlueprintName?: (libraryBlueprintId: string) => string;
      onViewScopeUpdate?: ViewScopeUpdateCallback;
    }
  ) {
    this.resolveLibraryBlueprint = options?.resolveLibraryBlueprint;
    this.rootLibraryBlueprintId = options?.rootLibraryBlueprintId ?? null;
    this.resolveBlueprintName = options?.resolveBlueprintName;
    this.onViewScopeUpdate = options?.onViewScopeUpdate;
    this.behaviors = new BehaviorRegistry();
    registerDefaultBehaviors(this.behaviors);
    this.registerBlueprintRefBehavior();
    this.registerFetchBehavior();
    this.registerJsonBehavior();
    this.registerLogicBehavior();
    this.registerClockBehavior();
    this.registerAndBehavior();
    this.registerViewBindBehavior();
  }

  async ensureNoBlueprintCycle(): Promise<void> {
    if (this.cycleValidated || !this.resolveLibraryBlueprint) {
      return;
    }
    await assertNoBlueprintReferenceCycle({
      rootGraph: this.graph,
      rootLibraryBlueprintId: this.rootLibraryBlueprintId,
      resolveLibraryBlueprint: this.resolveLibraryBlueprint,
      resolveBlueprintName: this.resolveBlueprintName,
    });
    this.cycleValidated = true;
  }

  private injectedInputs = new Map<string, Value>();

  /**
   * 从视图交互触发指定蓝图节点：向该节点 in 口注入真信号并执行下游。
   * payload 写入 scope（UI_EVENT_PAYLOAD_KEY）供 Logic 等节点读取。
   */
  async triggerNode(nodeId: string, inputValue?: unknown): Promise<void> {
    await this.ensureNoBlueprintCycle();
    this.requireNode(nodeId);
    const key = `${nodeId}:in`;
    this.injectedInputs.set(key, createTrueSignal(inputValue ?? true));
    try {
      await this.runFromNodeWithUiPayload(nodeId, inputValue);
    } finally {
      this.injectedInputs.delete(key);
    }
  }

  private async runFromNodeWithUiPayload(
    nodeId: string,
    inputValue?: unknown
  ) {
    const queue: ExecutionToken[] = [
      {
        tokenId: createTokenId(),
        nodeId,
        nodeType: this.requireNode(nodeId).nodeType,
        inPort: "in",
        scope: cloneScope(),
      },
    ];
    queue[0]!.scope.vars.set(UI_EVENT_PAYLOAD_KEY, inputValue);

    const executor = this.createExecutor(queue);

    while (queue.length > 0) {
      const token = queue.shift()!;
      if (!this.syncTokenFromGraph(token)) continue;
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

  async emitLifecycle(phase: PageLifecyclePhase): Promise<void> {
    await this.ensureNoBlueprintCycle();
    const signal = createLifecycleSignal(phase);
    const targets = this.graph.nodes.filter(
      (node) =>
        node.nodeType === LIFECYCLE_NODE_TYPE && node.lifecyclePhase === phase
    );

    for (const node of targets) {
      await this.runFromNode(node.id, signal);
    }
  }

  /**
   * 嵌套蓝图被引用且父级传入真信号时，触发 blueprintActivated 生命周期节点，
   * 并将父级输入值写入 scope 供节点输出。
   */
  async emitBlueprintActivated(
    inputValue: unknown,
    parentScope?: Scope
  ): Promise<void> {
    const signal = createLifecycleSignal("blueprintActivated");
    const targets = this.graph.nodes.filter(
      (node) =>
        node.nodeType === LIFECYCLE_NODE_TYPE &&
        node.lifecyclePhase === "blueprintActivated"
    );

    for (const node of targets) {
      await this.runFromNode(node.id, signal, parentScope, inputValue);
    }
  }

  /**
   * 视图节点触发事件时，匹配已注册（上游生命周期已触发）且绑定了该元素、事件类型的事件节点，发出真信号。
   */
  async emitViewEvent(
    payload: ViewEventSignal,
    armedNodeIds?: ReadonlySet<string>
  ): Promise<void> {
    await this.ensureNoBlueprintCycle();
    const targets = this.graph.nodes.filter((node) => {
      if (node.nodeType !== EVENT_NODE_TYPE) return false;
      if (armedNodeIds && !armedNodeIds.has(node.id)) return false;
      if (!(node.viewElementIds ?? []).includes(payload.node.id)) return false;
      return normalizeViewEventConfig(node.eventConfig).eventTypes.includes(
        payload.eventType
      );
    });

    for (const node of targets) {
      await this.runFromNode(node.id, undefined, undefined, undefined, payload);
    }
  }

  /** 时钟节点单次输出：向下游传播含当前时间的真信号 */
  async propagateClockOutput(
    nodeId: string,
    parentScope?: Scope,
    sessionKey?: string
  ): Promise<void> {
    const resolvedSessionKey =
      sessionKey ?? buildClockSessionKey(this.clockScopeId(), nodeId);
    if (isClockSessionAborted(resolvedSessionKey)) return;

    await this.ensureNoBlueprintCycle();
    const node = this.requireNode(nodeId);
    if (node.nodeType !== CLOCK_NODE_TYPE) return;

    const config = normalizeClockConfig({
      ...DEFAULT_CLOCK_NODE_CONFIG,
      ...node.clockConfig,
    });
    const value = buildClockSignalValue(config);
    this.setNodeOutput(nodeId, "out", createTrueSignal(value));

    const queue: ExecutionToken[] = [];
    for (const target of this.findSignalTargets(nodeId, "out")) {
      queue.push({
        tokenId: createTokenId(),
        nodeId: target.nodeId,
        nodeType: target.nodeType,
        inPort: target.inPort,
        scope: cloneScope(parentScope),
      });
    }

    const executor = this.createExecutor(queue);
    while (queue.length > 0) {
      if (isClockSessionAborted(resolvedSessionKey)) {
        queue.length = 0;
        return;
      }
      const token = queue.shift()!;
      if (!this.syncTokenFromGraph(token)) continue;
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

  private clockScopeId(): string {
    return this.rootLibraryBlueprintId ?? "local";
  }

  private startClockSchedule(nodeId: string, config: ClockNodeConfig, scope?: Scope) {
    const sessionKey = buildClockSessionKey(this.clockScopeId(), nodeId);
    markClockNodeActive(nodeId);
    scheduleClockOutputs({
      sessionKey,
      config,
      onTick: async () => {
        if (isClockSessionAborted(sessionKey)) return;
        await this.propagateClockOutput(nodeId, scope, sessionKey);
      },
      onSettled: () => markClockNodeInactive(nodeId),
    });
  }

  /** 中止指定时钟节点：停止剩余 tick 与正在执行的下游任务 */
  abortClockNode(nodeId: string): void {
    abortClockNodeSession(this.clockScopeId(), nodeId);
  }

  /** 从所有无入流 signal 的节点开始执行（嵌套蓝图调用） */
  async runFromFlowEntries(
    parentScope?: Scope,
    options?: { preserveOutputs?: boolean }
  ): Promise<BlueprintNodeOutputs> {
    if (!options?.preserveOutputs) {
      this.outputs.clear();
    }
    const entries = this.findSignalEntryNodes();
    for (const node of entries) {
      await this.runFromNode(node.id, undefined, parentScope);
    }
    return this.collectOutputs();
  }

  getNodeOutputs(): BlueprintNodeOutputs {
    return this.collectOutputs();
  }

  getTraceEntries(): ExecutionTraceEntry[] {
    return [...this.traceEntries];
  }

  isDebugSessionActive(): boolean {
    return this.debugQueue !== null;
  }

  isDebugQueueEmpty(): boolean {
    return !this.debugQueue || this.debugQueue.length === 0;
  }

  /** 调试过程中同步最新蓝图拓扑与节点配置 */
  updateGraph(graph: RunnableGraph): void {
    this.graph = graph;
    this.syncDebugQueueWithLatestGraph();
  }

  /**
   * 按当前图结构重建待执行队列。
   * 已有 trace 时，从最后执行的节点按最新出边重新入队；便于编辑连线后继续单步调试。
   */
  refreshPendingQueueFromLatestGraph(): void {
    if (!this.debugQueue) return;

    if (this.traceEntries.length === 0) {
      this.syncDebugQueueWithLatestGraph();
      return;
    }

    const lastEntry = this.traceEntries[this.traceEntries.length - 1]!;
    const lastOutput = this.getNodeOutput(lastEntry.nodeId, "out");
    if (
      lastOutput !== undefined &&
      isFalseSignal(lastOutput) &&
      !this.graph.allowFalseSignalPropagation
    ) {
      this.debugQueue = [];
      return;
    }

    const scope =
      this.debugQueue[0]?.scope ??
      this.debugHistory[0]?.queue[0]?.scope ??
      cloneScope();

    const node = this.graph.nodes.find((n) => n.id === lastEntry.nodeId);
    if (!node) {
      this.debugQueue = [];
      return;
    }

    let def;
    try {
      def = getNodeDefinition(node.nodeType);
    } catch {
      this.debugQueue = [];
      return;
    }

    const newQueue: ExecutionToken[] = [];
    for (const port of def.outputs) {
      if (this.getNodeOutput(lastEntry.nodeId, port.name) === undefined) {
        continue;
      }
      for (const target of this.findSignalTargets(lastEntry.nodeId, port.name)) {
        newQueue.push({
          tokenId: createTokenId(),
          nodeId: target.nodeId,
          nodeType: target.nodeType,
          inPort: target.inPort,
          scope: cloneScope(scope),
        });
      }
    }
    if (newQueue.length > 0 || this.debugQueue.length === 0) {
      this.debugQueue = newQueue;
    }
  }

  canDebugStepBack(): boolean {
    return this.debugHistory.length > 1;
  }

  debugStepBack(): boolean {
    if (!this.debugQueue || this.debugHistory.length <= 1) {
      return false;
    }
    this.debugHistory.pop();
    const snapshot = this.debugHistory[this.debugHistory.length - 1]!;
    this.restoreDebugSnapshot(snapshot);
    return true;
  }

  private captureDebugSnapshot(): DebugSessionSnapshot {
    return {
      outputs: cloneOutputs(this.outputs),
      queue: cloneQueue(this.debugQueue ?? []),
      traceEntries: [...this.traceEntries],
    };
  }

  private restoreDebugSnapshot(snapshot: DebugSessionSnapshot): void {
    this.outputs = cloneOutputs(snapshot.outputs);
    this.debugQueue = cloneQueue(snapshot.queue);
    this.traceEntries = [...snapshot.traceEntries];
  }

  private pushDebugSnapshot(): void {
    this.debugHistory.push(this.captureDebugSnapshot());
  }

  beginDebugSession(lifecycleNodeId: string): void {
    stopAllClockSchedules();
    const node = this.requireNode(lifecycleNodeId);
    if (node.nodeType !== LIFECYCLE_NODE_TYPE) {
      throw new Error("调试会话只能从生命周期节点开始");
    }

    this.outputs.clear();
    this.traceEntries = [];
    this.debugQueue = [
      {
        tokenId: createTokenId(),
        nodeId: lifecycleNodeId,
        nodeType: node.nodeType,
        inPort: "in",
        scope: cloneScope(),
      },
    ];

    this.applyLifecycleScopeForNode(lifecycleNodeId);

    this.debugExecutor = this.createExecutor(this.debugQueue, {
      emitToActiveDebugQueue: true,
    });
    this.debugHistory = [this.captureDebugSnapshot()];
  }

  /** 调试中修改生命周期阶段后，同步队列头部的 scope 信号 */
  refreshDebugLifecycleScope(lifecycleNodeId: string): void {
    const head = this.debugQueue?.[0];
    if (!head || head.nodeId !== lifecycleNodeId) return;
    this.applyLifecycleScopeForNode(lifecycleNodeId);
  }

  private applyLifecycleScopeForNode(lifecycleNodeId: string): void {
    const head = this.debugQueue?.[0];
    if (!head || head.nodeId !== lifecycleNodeId) return;

    const node = this.graph.nodes.find((n) => n.id === lifecycleNodeId);
    if (!node?.lifecyclePhase) {
      head.scope.vars.delete(LIFECYCLE_SIGNAL_KEY);
      head.scope.vars.delete(BLUEPRINT_ACTIVATION_INPUT_KEY);
      return;
    }

    head.scope.vars.set(
      LIFECYCLE_SIGNAL_KEY,
      createLifecycleSignal(node.lifecyclePhase)
    );
    if (node.lifecyclePhase === "blueprintActivated") {
      head.scope.vars.set(BLUEPRINT_ACTIVATION_INPUT_KEY, undefined);
    } else {
      head.scope.vars.delete(BLUEPRINT_ACTIVATION_INPUT_KEY);
    }
  }

  clearDebugSession(): void {
    stopAllClockSchedules();
    this.debugQueue = null;
    this.debugExecutor = null;
    this.traceEntries = [];
    this.outputs.clear();
    this.debugHistory = [];
  }

  async debugStep(
    nodeLabelById?: Record<string, string>,
    onProgress?: DebugProgressCallback
  ): Promise<{
    done: boolean;
    entry?: ExecutionTraceEntry;
    haltedByFalseSignal?: boolean;
  }> {
    if (!this.debugQueue || !this.debugExecutor) {
      return { done: true };
    }
    if (this.debugQueue.length === 0) {
      return { done: true };
    }

    const prevCallback = this.debugProgressCallback;
    this.debugProgressCallback = onProgress ?? null;

    try {
      this.pushDebugSnapshot();
      const token = this.debugQueue.shift()!;
      if (!this.syncTokenFromGraph(token)) {
        this.pushDebugSnapshot();
        return {
          done: this.debugQueue.length === 0,
          haltedByFalseSignal: false,
        };
      }

      if (token.nodeType === CLOCK_NODE_TYPE) {
        const node = this.requireNode(token.nodeId);
        const config = normalizeClockConfig({
          ...DEFAULT_CLOCK_NODE_CONFIG,
          ...node.clockConfig,
        });
        const halted = await this.executeClockScheduleForDebug(
          token,
          config,
          nodeLabelById
        );
        this.haltDebugQueueOnFalseOutput(token.nodeId);
        this.pushDebugSnapshot();
        return {
          done: this.debugQueue.length === 0,
          entry: this.traceEntries[this.traceEntries.length - 1],
          haltedByFalseSignal:
            halted || this.isDebugHaltedByFalseOutput(token.nodeId),
        };
      }

      const entry = await this.executeDebugToken(token, nodeLabelById);
      this.haltDebugQueueOnFalseOutput(token.nodeId);
      this.pushDebugSnapshot();

      return {
        done: this.debugQueue.length === 0,
        entry,
        haltedByFalseSignal: this.isDebugHaltedByFalseOutput(token.nodeId),
      };
    } finally {
      this.debugProgressCallback = prevCallback;
    }
  }

  private notifyDebugProgress(): void {
    this.debugProgressCallback?.([...this.traceEntries]);
  }

  private async awaitClockDelay(ms: number, sessionKey?: string): Promise<void> {
    if (ms <= 0) return;
    const step = 50;
    let elapsed = 0;
    while (elapsed < ms) {
      if (sessionKey && isClockSessionAborted(sessionKey)) return;
      const chunk = Math.min(step, ms - elapsed);
      await new Promise<void>((resolve) => setTimeout(resolve, chunk));
      elapsed += chunk;
    }
  }

  private buildTraceInputsForNode(
    nodeId: string,
    nodeType: string
  ): Record<string, unknown> {
    const def = getNodeDefinition(nodeType);
    const inputs: Record<string, unknown> = {};
    for (const port of def.inputs) {
      inputs[port.name] = serializeTraceValue(
        this.resolvePortInputValue(nodeId, port.name)
      );
    }
    return inputs;
  }

  private appendDebugTraceEntry(
    token: ExecutionToken,
    nodeLabelById: Record<string, string> | undefined,
    startedAt: number,
    options?: {
      tickLabel?: string;
      clockTickIndex?: number;
      clockTickTotal?: number;
      inputs?: Record<string, unknown>;
      error?: string;
    }
  ): ExecutionTraceEntry {
    const def = getNodeDefinition(token.nodeType);
    const outputs: Record<string, unknown> = {};
    for (const port of def.outputs) {
      outputs[port.name] = serializeTraceValue(
        this.getNodeOutput(token.nodeId, port.name)
      );
    }

    const entry: ExecutionTraceEntry = {
      id: createTraceEntryId(),
      nodeId: token.nodeId,
      nodeLabel: options?.tickLabel ?? nodeLabelById?.[token.nodeId],
      nodeType: token.nodeType,
      startedAt,
      finishedAt: Date.now(),
      isoTime: new Date(startedAt).toISOString(),
      inputs:
        options?.inputs ??
        this.buildTraceInputsForNode(token.nodeId, token.nodeType),
      outputs,
      error: options?.error,
      clockTickIndex: options?.clockTickIndex,
      clockTickTotal: options?.clockTickTotal,
    };
    this.traceEntries.push(entry);
    this.notifyDebugProgress();
    return entry;
  }

  private enqueueDebugTargets(
    sourceNodeId: string,
    outPort: string,
    scope: Scope
  ): ExecutionToken[] {
    return this.findSignalTargets(sourceNodeId, outPort).map((target) => ({
      tokenId: createTokenId(),
      nodeId: target.nodeId,
      nodeType: target.nodeType,
      inPort: target.inPort,
      scope: cloneScope(scope),
    }));
  }

  private async runDebugTokenSubqueue(
    queue: ExecutionToken[],
    nodeLabelById?: Record<string, string>,
    abortSessionKey?: string
  ): Promise<boolean> {
    const executor = this.createExecutor(queue);

    while (queue.length > 0) {
      if (abortSessionKey && isClockSessionAborted(abortSessionKey)) {
        queue.length = 0;
        return false;
      }

      const token = queue.shift()!;

      if (token.nodeType === CLOCK_NODE_TYPE) {
        const node = this.requireNode(token.nodeId);
        const config = normalizeClockConfig({
          ...DEFAULT_CLOCK_NODE_CONFIG,
          ...node.clockConfig,
        });
        const halted = await this.executeClockScheduleForDebug(
          token,
          config,
          nodeLabelById
        );
        if (halted) return true;
        continue;
      }

      await this.executeDebugToken(token, nodeLabelById, executor, queue);
      if (abortSessionKey && isClockSessionAborted(abortSessionKey)) {
        queue.length = 0;
        return false;
      }
      if (this.isDebugHaltedByFalseOutput(token.nodeId)) {
        return true;
      }
      this.pushDebugSnapshot();
    }

    return false;
  }

  private async executeDebugToken(
    token: ExecutionToken,
    nodeLabelById?: Record<string, string>,
    executor?: Executor,
    emitQueue?: ExecutionToken[]
  ): Promise<ExecutionTraceEntry> {
    const startedAt = Date.now();
    let error: string | undefined;

    const runExecutor =
      executor ??
      this.debugExecutor ??
      this.createExecutor(this.debugQueue ?? []);

    if (!this.syncTokenFromGraph(token)) {
      return this.appendDebugTraceEntry(token, nodeLabelById, startedAt, {
        error: "节点已从蓝图中移除",
      });
    }

    try {
      await runExecutor.executeToken(token);
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
      this.setNodeOutput(
        token.nodeId,
        "out",
        createFalseSignal(error)
      );
      const targets = emitQueue ?? this.debugQueue;
      if (targets) {
        for (const next of this.enqueueDebugTargets(
          token.nodeId,
          "out",
          token.scope
        )) {
          targets.push(next);
        }
      }
    }

    return this.appendDebugTraceEntry(token, nodeLabelById, startedAt, {
      error,
    });
  }

  /**
   * 调试模式下执行完整时钟序列：等待 n 次输出（含间隔），
   * 每次更新 trace / 画布高亮，并同步跑完当次下游链。
   */
  private async executeClockScheduleForDebug(
    token: ExecutionToken,
    config: ClockNodeConfig,
    nodeLabelById?: Record<string, string>
  ): Promise<boolean> {
    const sessionKey = buildClockSessionKey(this.clockScopeId(), token.nodeId);
    clearClockSessionAbort(sessionKey);
    markClockNodeActive(token.nodeId);
    try {
      const normalized = normalizeClockConfig(config);
      const baseInputs = this.buildTraceInputsForNode(
        token.nodeId,
        token.nodeType
      );
      const input = this.resolvePortInputValue(token.nodeId, "in");

      const finishWithOutput = async (
        output: Value,
        tickLabel?: string
      ): Promise<boolean> => {
        this.setNodeOutput(token.nodeId, "out", output);
        this.appendDebugTraceEntry(token, nodeLabelById, Date.now(), {
          tickLabel,
          inputs: baseInputs,
        });
        this.pushDebugSnapshot();
        const subQueue = this.enqueueDebugTargets(
          token.nodeId,
          "out",
          token.scope
        );
        return this.runDebugTokenSubqueue(subQueue, nodeLabelById, sessionKey);
      };

      if (isFalseSignal(input)) {
        return finishWithOutput(input);
      }

      if (!isTrueSignal(input)) {
        return finishWithOutput(
          createFalseSignal("时钟节点需要收到真信号后才会启动")
        );
      }

      const validation = validateClockScheduleConfig(normalized);
      if (!validation.ok) {
        return finishWithOutput(createFalseSignal(validation.error));
      }

      const baseLabel = nodeLabelById?.[token.nodeId] ?? token.nodeId;
      const scheduleStartMs = Date.now();

      for (let i = 0; i < normalized.outputCount; i++) {
        if (isClockSessionAborted(sessionKey)) return false;

        const waitMs = getClockTickWaitMs(normalized, i, scheduleStartMs);
        if (waitMs > 0) {
          await this.awaitClockDelay(waitMs, sessionKey);
        }
        if (isClockSessionAborted(sessionKey)) return false;

        const tickStarted = Date.now();
        const value = buildClockSignalValue(normalized);
        this.setNodeOutput(token.nodeId, "out", createTrueSignal(value));

        const tickLabel =
          normalized.outputCount > 1
            ? `${baseLabel} (${i + 1}/${normalized.outputCount})`
            : baseLabel;

        this.appendDebugTraceEntry(token, nodeLabelById, tickStarted, {
          tickLabel,
          inputs: baseInputs,
          clockTickIndex: i + 1,
          clockTickTotal: normalized.outputCount,
        });
        this.pushDebugSnapshot();

        const subQueue = this.enqueueDebugTargets(
          token.nodeId,
          "out",
          token.scope
        );
        const halted = await this.runDebugTokenSubqueue(
          subQueue,
          nodeLabelById,
          sessionKey
        );
        if (halted || isClockSessionAborted(sessionKey)) return halted;
      }

      return false;
    } finally {
      markClockNodeInactive(token.nodeId);
    }
  }

  isDebugHaltedByFalseOutput(nodeId?: string): boolean {
    if (this.graph.allowFalseSignalPropagation) return false;
    const targetId = nodeId ?? this.traceEntries[this.traceEntries.length - 1]?.nodeId;
    if (!targetId) return false;
    return this.isFalseOutputNode(targetId);
  }

  private isFalseOutputNode(nodeId: string): boolean {
    const out = this.getNodeOutput(nodeId, "out");
    return out !== undefined && isFalseSignal(out);
  }

  private haltDebugQueueOnFalseOutput(nodeId: string): void {
    if (!this.debugQueue || this.graph.allowFalseSignalPropagation) return;
    if (this.isFalseOutputNode(nodeId)) {
      this.debugQueue = [];
    }
  }

  async debugRunAll(
    nodeLabelById?: Record<string, string>,
    onProgress?: DebugProgressCallback
  ): Promise<ExecutionTraceEntry[]> {
    while (this.debugQueue && this.debugQueue.length > 0) {
      await this.debugStep(nodeLabelById, onProgress);
    }
    return this.getTraceEntries();
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

        const scopeStack = token.scope.vars.get(BLUEPRINT_CALL_STACK_KEY) as
          | string[]
          | undefined;
        const callStack = resolveBlueprintCallStack(
          scopeStack,
          runner.rootLibraryBlueprintId
        );
        const runtimeCycle = detectRuntimeBlueprintCycle(
          callStack,
          libraryId,
          runner.resolveBlueprintName
        );
        if (!runtimeCycle.ok) {
          io.setOutput("out", createFalseSignal(runtimeCycle.message));
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

        const nestedScope = cloneScope(token.scope);
        nestedScope.vars.set(BLUEPRINT_CALL_STACK_KEY, [...callStack, libraryId]);

        const subRunner = new BlueprintGraphRunner(nestedGraph, {
          resolveLibraryBlueprint: runner.resolveLibraryBlueprint,
          rootLibraryBlueprintId: libraryId,
          resolveBlueprintName: runner.resolveBlueprintName,
          onViewScopeUpdate: runner.onViewScopeUpdate,
        });
        await subRunner.emitBlueprintActivated(input.value, nestedScope);
        const nestedOutputs = await subRunner.runFromFlowEntries(nestedScope, {
          preserveOutputs: true,
        });

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
        const inputPort = token.inPort || "in";
        const input = await io.getInput(inputPort);
        if (isFalseSignal(input)) {
          io.setOutput("out", input);
          io.emitFlow("out");
          return;
        }
        if (!isTrueSignal(input)) {
          io.setOutput(
            "out",
            createFalseSignal(
              input === undefined
                ? "数据源节点未收到上游输出，请确认连线与上游节点已执行"
                : "数据源节点需要收到真信号后才会发起请求"
            )
          );
          io.emitFlow("out");
          return;
        }

        const incomingScope = runner.buildFetchIncomingScope(
          token.nodeId,
          inputPort,
          input
        );
        const config = applyFetchConfigScope(
          normalizeFetchRequestConfig(node.fetchConfig),
          incomingScope
        );
        const headersError = getFetchHeadersValidationError(config, incomingScope);
        if (headersError) {
          throw new Error(headersError);
        }
        const bodyError = getFetchBodyValidationError(config.body, config.body);
        if (bodyError) {
          throw new Error(`请求体不是有效 JSON：${bodyError}`);
        }
        resolveFetchRequestUrl(config);

        const result = await executeFetch(config, {
          allowHttpError: runner.isDebugSessionActive(),
        });
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

  private registerLogicBehavior() {
    const runner = this;
    this.behaviors.registerJS("logic-run", async ({ token, io }) => {
      const node = runner.requireNode(token.nodeId);

      try {
        const input = await io.getInput("in");
        if (isFalseSignal(input)) {
          io.setOutput("out", input);
          io.emitFlow("out");
          return;
        }

        const inputValue = isTrueSignal(input) ? input.value : undefined;
        const config: LogicNodeConfig = {
          ...DEFAULT_LOGIC_NODE_CONFIG,
          ...node.logicConfig,
        };
        const result = executeLogicConfig(config, inputValue);
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

  private registerClockBehavior() {
    const runner = this;
    this.behaviors.registerJS("clock-run", async ({ token, io }) => {
      const node = runner.requireNode(token.nodeId);
      const config = normalizeClockConfig({
        ...DEFAULT_CLOCK_NODE_CONFIG,
        ...node.clockConfig,
      });

      try {
        const input = await io.getInput("in");
        if (isFalseSignal(input)) {
          io.setOutput("out", input);
          io.emitFlow("out");
          return;
        }
        if (!isTrueSignal(input)) {
          io.setOutput(
            "out",
            createFalseSignal("时钟节点需要收到真信号后才会启动")
          );
          io.emitFlow("out");
          return;
        }

        const validation = validateClockScheduleConfig(config);
        if (!validation.ok) {
          io.setOutput("out", createFalseSignal(validation.error));
          io.emitFlow("out");
          return;
        }

        if (runner.isDebugSessionActive()) {
          return;
        }

        runner.startClockSchedule(token.nodeId, config, token.scope);
      } catch (error) {
        io.setOutput(
          "out",
          createFalseSignal(
            error instanceof Error ? error.message : String(error)
          )
        );
        io.emitFlow("out");
      }
    });
  }

  private registerAndBehavior() {
    this.behaviors.registerJS("and-run", async ({ io }) => {
      const inA = await io.getInput("inA");
      const inB = await io.getInput("inB");

      if (isTrueSignal(inA) && isTrueSignal(inB)) {
        io.setOutput(
          "out",
          createTrueSignal({ inA: inA.value, inB: inB.value })
        );
      } else {
        io.setOutput(
          "out",
          createFalseSignal("并运算：两个输入须均为真信号")
        );
      }
      io.emitFlow("out");
    });
  }

  private registerViewBindBehavior() {
    const runner = this;
    this.behaviors.registerJS("view-bind-run", async ({ token, io }) => {
      const node = runner.requireNode(token.nodeId);
      const input = await io.getInput("in");

      if (isTrueSignal(input) && node.viewElementIds?.length) {
        runner.onViewScopeUpdate?.(node.viewElementIds, input.value);
      }

      if (isFalseSignal(input)) {
        io.setOutput("out", input);
      } else if (isTrueSignal(input)) {
        io.setOutput("out", createTrueSignal(input.value));
      } else {
        io.setOutput("out", createTrueSignal(undefined));
      }
      io.emitFlow("out");
    });
  }

  private async runFromNode(
    nodeId: string,
    lifecycleSignal?: LifecycleSignal,
    parentScope?: Scope,
    activationInput?: unknown,
    viewEvent?: ViewEventSignal
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
    if (lifecycleSignal?.phase === "blueprintActivated") {
      queue[0]!.scope.vars.set(
        BLUEPRINT_ACTIVATION_INPUT_KEY,
        activationInput
      );
    }
    if (viewEvent) {
      queue[0]!.scope.vars.set(VIEW_EVENT_SIGNAL_KEY, viewEvent);
      queue[0]!.scope.vars.set(UI_EVENT_PAYLOAD_KEY, viewEvent);
    }

    const executor = this.createExecutor(queue);

    while (queue.length > 0) {
      const token = queue.shift()!;
      if (!this.syncTokenFromGraph(token)) continue;
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

  private createExecutor(
    queue: ExecutionToken[],
    options?: { emitToActiveDebugQueue?: boolean }
  ) {
    return new Executor({
      getNodeDefinition,
      behaviors: this.behaviors,
      runBlueprint: async () => {
        // 由 blueprint-ref-run 行为处理
      },
      getInputValue: async (token, port) => {
        const resolvedPort = port || token.inPort || "in";
        return this.resolvePortInputValue(token.nodeId, resolvedPort);
      },
      setNodeOutput: (token, port, value) => {
        this.setNodeOutput(token.nodeId, port, value);
      },
      emitFlow: (token, outPort) => {
        const targetQueue =
          options?.emitToActiveDebugQueue && this.debugQueue
            ? this.debugQueue
            : queue;
        const nextNodes = this.findSignalTargets(token.nodeId, outPort);
        for (const target of nextNodes) {
          targetQueue.push({
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
  }

  private findSignalEntryNodes() {
    const hasIncoming = new Set<string>();
    for (const edge of this.graph.edges) {
      hasIncoming.add(edge.target);
    }
    return this.graph.nodes.filter(
      (node) =>
        node.nodeType !== LIFECYCLE_NODE_TYPE &&
        node.nodeType !== EVENT_NODE_TYPE &&
        !hasIncoming.has(node.id)
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

  /** 队列中的 token 可能是在节点改类型（如视图绑定）之前入队的，执行前与最新图对齐 */
  private syncTokenFromGraph(token: ExecutionToken): boolean {
    const node = this.graph.nodes.find((n) => n.id === token.nodeId);
    if (!node) return false;
    token.nodeType = node.nodeType;
    return true;
  }

  private syncDebugQueueWithLatestGraph(): void {
    if (!this.debugQueue) return;
    this.debugQueue = this.debugQueue.filter((token) =>
      this.syncTokenFromGraph(token)
    );
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

  private findInboundSignalEdges(nodeId: string, port: string) {
    return this.graph.edges.filter(
      (edge) =>
        edge.target === nodeId && (edge.targetHandle ?? "in") === port
    );
  }

  private buildFetchIncomingScope(
    nodeId: string,
    port: string,
    fallbackInput: Value | undefined
  ) {
    return resolveFetchIncomingScope({
      fetchNodeId: nodeId,
      inputPort: port,
      nodes: this.graph.nodes.map((node) => ({
        id: node.id,
        label: node.label,
        nodeType: node.nodeType,
        role: node.role,
      })),
      edges: this.graph.edges,
      getOutput: (sourceId, sourcePort) =>
        this.getNodeOutput(sourceId, sourcePort),
      fallbackInput,
    });
  }

  /** 单端口多连线：任一为真则视为真（或语义）；支持 triggerNode 注入的入口信号 */
  private resolvePortInputValue(nodeId: string, port: string): Value | undefined {
    const injected = this.injectedInputs.get(`${nodeId}:${port}`);
    if (injected !== undefined) return injected;

    const inboundEdges = this.findInboundSignalEdges(nodeId, port);
    if (inboundEdges.length === 0) return undefined;

    const values = inboundEdges.map((edge) =>
      this.getNodeOutput(edge.source, edge.sourceHandle ?? "out")
    );
    return combinePortSignalsOr(values);
  }

  private findInboundSignalEdge(nodeId: string, port: string) {
    return this.findInboundSignalEdges(nodeId, port)[0];
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

export { BLUEPRINT_NODE_TYPE, VIEW_NODE_TYPE };
