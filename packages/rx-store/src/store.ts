// packages/rx-store/src/store.ts
import { BehaviorSubject, Observable } from "rxjs";
import { map, distinctUntilChanged } from "rxjs/operators";
import { produce, Draft } from "immer";
import { HistoryManager } from "./history";
import type { State, Path, Node, EventAction, EventName } from "./types";

export interface Plugin {
  name: string;
  init?(store: RxStore): void;
  onBeforeUpdate?(oldState: State, newState: State): void;
  shouldSkipHistory?(oldState: State, newState: State): boolean;
  onUpdate?(oldState: State, newState: State): void;
  onEvent?(action: EventAction, context: any): void;
}

export class RxStore {
  private state$: BehaviorSubject<State>;
  private history = new HistoryManager();
  private plugins: Plugin[] = [];
  private batchDepth = 0;
  private currentBatchId: string | null = null;

  constructor(initialState: State) {
    this.state$ = new BehaviorSubject<State>(initialState);
    // 初始状态直接入栈
    this.history.push({
      state: initialState,
      timestamp: Date.now(),
      meta: { type: "initial" },
    });
  }

  // ==================== 核心 API ====================
  getState(): State {
    return this.state$.value;
  }

  select(): Observable<State> {
    return this.state$.asObservable();
  }
  // 新增：用 ID 更新节点属性（免疫路径变化）
  updateById(
    nodeId: string,
    updater: (node: Draft<Node>) => void,
    options?: { skipHistory?: boolean; meta?: any; batchId?: string }
  ) {
    this.update((draft) => {
      const node = this.findNodeById(draft.root, nodeId);
      if (node) updater(node);
    }, options);
  }

  // selectPath<T = any>(path: Path): Observable<T> {
  //   const segments = path.split(".");
  //   return this.state$.pipe(
  //     map((state) => {
  //       let cur: any = state;
  //       for (const seg of segments) {
  //         const match = seg.match(/(.+?)\[(\d+)\]/);
  //         if (match) {
  //           cur = cur?.[match[1]]?.[Number(match[2])];
  //         } else {
  //           cur = cur?.[seg];
  //         }
  //       }
  //       return cur as T;
  //     }),
  //     distinctUntilChanged()
  //   );
  // }
  // 新增：判断是否是节点 ID（而非路径字符串）
  private isNodeId(value: string): boolean {
    // 简单判断：ID 无 [ ]，以字母开头
    return (
      !value.includes("[") && !value.includes("]") && /^[a-zA-Z]/.test(value)
    );
  }

  public findNodeById(root: Node, id: string): Node | null {
    if (root.id === id) return root;
    if (root.children) {
      for (const child of root.children) {
        const found = this.findNodeById(child, id);
        if (found) return found;
      }
    }
    return null;
  }

  // 扩展：订阅事件
  selectEvents(id: string): Observable<EventAction[]> {
    return this.selectPath(id).pipe(
      map(
        () => this.findNodeById(this.getState().root, id)?.events?.onClick || []
      )
    );
  }

  selectPath<T = any>(pathOrId: string): Observable<T> {
    return this.state$.pipe(
      map((state) => {
        if (this.isNodeId(pathOrId)) {
          // ID 模式：递归找节点
          const node = this.findNodeById(state.root, pathOrId);
          return (node?.props || {}) as T; // 默认返回 props
        }
        // 传统路径模式（variables 等）
        let cur: any = state;
        const segments = pathOrId.split(".");
        for (const seg of segments) {
          const match = seg.match(/(.+?)\[(\d+)\]/);
          if (match) {
            cur = cur?.[match[1]]?.[Number(match[2])];
          } else {
            cur = cur?.[seg];
          }
        }
        return cur as T;
      }),
      distinctUntilChanged() // 只在真正变化时触发
    );
  }

  update(
    updater: (draft: Draft<State>) => void,
    options: {
      skipHistory?: boolean;
      meta?: any;
      batchId?: string;
    } = {}
  ) {
    const oldState = this.state$.value;
    const newState = produce(oldState, updater);

    if (oldState === newState) return;

    this.plugins.forEach((p) => p.onBeforeUpdate?.(oldState, newState));

    const skipHistory =
      options.skipHistory ||
      this.plugins.some((p) => p.shouldSkipHistory?.(oldState, newState));

    this.state$.next(newState);

    if (!skipHistory) {
      this.history.push({
        state: newState,
        timestamp: Date.now(),
        groupId: options.batchId ?? this.currentBatchId ?? undefined,
        meta: options.meta,
      });
    }

    this.plugins.forEach((p) => p.onUpdate?.(oldState, newState));
  }

  replaceState(newState: State, meta?: any) {
    this.state$.next(newState);
    this.history.push({
      state: newState,
      timestamp: Date.now(),
      groupId: this.currentBatchId ?? undefined,
      meta,
    });
  }

  // ==================== Undo / Redo ====================
  undo() {
    const state = this.history.undo();
    if (state) this.state$.next(state);
  }

  redo() {
    const state = this.history.redo();
    if (state) this.state$.next(state);
  }

  canUndo$ = this.history.canUndo$;
  canRedo$ = this.history.canRedo$;
  getHistoryEntries() {
    return this.history.entries;
  }

  getHistoryCursorIndex() {
    return this.history.cursorIndex;
  }

  // ==================== Batch ====================
  startBatch(id?: string) {
    if (this.batchDepth === 0) {
      this.currentBatchId = id ?? `batch-${Date.now()}`;
    }
    this.batchDepth++;
  }

  endBatch() {
    this.batchDepth = Math.max(0, this.batchDepth - 1);
    if (this.batchDepth === 0) this.currentBatchId = null;
  }

  // ==================== 事件系统（UI 与事件完全分离） ====================
  trigger(nodeId: string, eventName: EventName, context: any = {}) {
    const node = this.findNode(nodeId);
    const actions = node?.events?.[eventName];
    if (Array.isArray(actions)) {
      actions.forEach((action) =>
        this.executeAction(action, { nodeId, ...context })
      );
    }
  }

  private findNode(id: string, root: Node = this.getState().root): Node | null {
    if (root.id === id) return root;
    if (root.children) {
      for (const child of root.children) {
        const found = this.findNode(id, child);
        if (found) return found;
      }
    }
    return null;
  }
  /**
 * 
 * @param nodeId    
 * @param targetParentId 
 * @param index 
 * @param options 
function onDragEnd(nodeId: string, targetParentId: string, insertIndex: number) {
  batch(() => {  // 拖拽只记一次历史
    store.moveNode(nodeId, targetParentId, insertIndex, {
      meta: { type: 'dragMove', node: nodeId }
    });
  });
}

// 示例：从根 a (root) 拖到组 b ('group-2')
onDragEnd('btn-1', 'group-2', 0);  // 插到 group-2 的开头

// 多选批量移动
selectedIds.forEach(id => {
  store.moveNode(id, 'group-b', undefined);  // 全插到末尾
});
 */
  // 新增：移动节点到新父级/位置（免疫路径变化）
  moveNode(
    nodeId: string,
    targetParentId: string, // b 的 ID（或 'root' 表示根）
    index?: number, // 插入位置（undefined = 末尾）
    options?: { meta?: any }
  ) {
    this.update((draft) => {
      // 1. 找源节点（在 a 下）
      const sourceNode = this.findNodeById(draft.root, nodeId);
      if (!sourceNode) return;

      // 2. 找源父级（a）
      const sourceParent = this.findParentById(draft.root, nodeId);
      if (!sourceParent || !sourceParent.children) return;

      // 3. 移除源节点
      const sourceIndex = sourceParent.children.findIndex(
        (child) => child.id === nodeId
      );
      if (sourceIndex > -1) {
        sourceParent.children.splice(sourceIndex, 1);
      }

      // 4. 找目标父级（b）
      const targetParent =
        targetParentId === "root"
          ? draft.root
          : this.findNodeById(draft.root, targetParentId);
      if (!targetParent || !targetParent.children) return;

      // 5. 插入到目标位置
      const insertIndex = index ?? targetParent.children.length;
      targetParent.children.splice(insertIndex, 0, sourceNode);
    }, options);
  }

  private findParentById(
    root: Draft<Node>,
    childId: string
  ): Draft<Node> | null {
    function recurse(node: Draft<Node>): Draft<Node> | null {
      if (node.children) {
        for (const child of node.children) {
          if (child.id === childId) return node;
          const found = recurse(child);
          if (found) return found;
        }
      }
      return null;
    }
    return recurse(root);
  }

  /**
   * 
   * @param action {
  events: {
    onClick: [
      { 
        type: 'setState', 
        targetId: 'counter-display',  // 指定目标节点 ID
        path: 'props.value', 
        value: '+=1' 
      }
    ]
  }
}
   * @param context 
   */
  private executeAction(action: EventAction, context: any) {
    switch (action.type) {
      case "setState":
        const targetId = action.targetId ?? context.nodeId; // 用 ID 找节点
        this.updateById(targetId, (draftNode) => {
          const current = this.getIn(draftNode.props, action.path); // 只改 props 内路径
          let value = action.value;
          // ... 你的 += 逻辑
          this.setIn(draftNode.props, action.path, value);
        });
        break;

      case "navigate":
        window.location.href = action.to;
        break;

      case "openUrl":
        window.open(action.url, action.target ?? "_blank");
        break;

      case "runPlugin":
        const plugin = this.plugins.find((p) => p.name === action.plugin);
        plugin?.onEvent?.(action, context);
        break;

      case "log":
        console.log("[DSL Event]", action.value, context);
        break;

      case "toggle":
        this.update((draft) => {
          const current = this.getIn(draft, action.path) ?? false;
          this.setIn(draft, action.path, !current);
        });
        break;

      case "increment":
      case "decrement":
        this.update((draft) => {
          const current = this.getIn(draft, action.path) ?? 0;
          const step = action.step ?? 1;
          const newVal =
            action.type === "increment" ? current + step : current - step;
          this.setIn(draft, action.path, newVal);
        });
        break;
    }
  }

  // 通用路径读取（支持 root.children[2].props.x）
  private getIn(obj: any, path: string): any {
    return path.split(".").reduce((o, k) => {
      const match = k.match(/(.+?)\[(\d+)\]/);
      if (match) {
        return o?.[match[1]]?.[Number(match[2])];
      }
      return o?.[k];
    }, obj);
  }

  // 通用路径写入
  private setIn(obj: any, path: string, value: any): void {
    const parts = path.split(".");
    let current = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      const match = part.match(/(.+?)\[(\d+)\]/);
      if (match) {
        const key = match[1];
        const idx = Number(match[2]);
        current[key] = current[key] || [];
        current = current[key];
        if (i === parts.length - 2) {
          current[idx] = value;
          return;
        }
        current = current[idx] = current[idx] || {};
      } else {
        current[part] = current[part] || {};
        current = current[part];
      }
    }
    const last = parts[parts.length - 1];
    const match = last.match(/(.+?)\[(\d+)\]/);
    if (match) {
      current[match[1]] = current[match[1]] || [];
      current[match[1]][Number(match[2])] = value;
    } else {
      current[last] = value;
    }
  }

  // ==================== 插件系统 ====================
  registerPlugin(plugin: Plugin) {
    this.plugins.push(plugin);
    plugin.init?.(this);
  }
}

// 单例导出
export const store = new RxStore({
  root: {
    id: "root",
    type: "root",
    props: {},
    children: [],
  },
  selectedIds: [],
  variables: { counter: 0, isOpen: false },
});
