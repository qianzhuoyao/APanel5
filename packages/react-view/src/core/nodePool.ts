import { BehaviorSubject } from "rxjs";
import { produce } from "immer";
export type NodeId = string;

export interface NodeData {
  id: NodeId;
  type: string;
  props?: Record<string, any>;
  meta?: Record<string, any>;
}

export interface NodeState {
  root: NodeId | null;
  nodes: Record<NodeId, NodeData>;
  tree: Record<NodeId, NodeId[]>;
}

export class NodePool {
  private static instance: NodePool;

  static get() {
    if (!NodePool.instance) NodePool.instance = new NodePool();
    return NodePool.instance;
  }

  // 🌟 BehaviorSubject 保存整个“文档状态”
  private state$ = new BehaviorSubject<NodeState>({
    root: null,
    nodes: {},
    tree: {},
  });

  // ---------------------------
  // 获取最新状态（快照）
  // ---------------------------
  get value() {
    return this.state$.value;
  }

  // 监听变化
  subscribe(fn: (state: NodeState) => void) {
    return this.state$.subscribe(fn);
  }

  // 内部更新（immer）
  private update(mutator: (draft: NodeState) => void) {
    const nextState = produce(this.value, mutator);
    this.state$.next(nextState);
  }

  // ---------------------------
  // 创建节点
  // ---------------------------
  createNode(id: string, props: any = {}) {
    this.update((draft) => {
      draft.nodes[id] = { id, type: "default", props };
      draft.tree[id] = [];
    });
  }

  // 设置根节点
  setRoot(id: NodeId) {
    this.update((draft) => {
      draft.root = id;
    });
  }

  // ---------------------------
  // 添加子节点
  // ---------------------------
  appendChild(parentId: NodeId, childId: NodeId) {
    this.update((draft) => {
      draft.tree[parentId].push(childId);
    });
  }

  // ---------------------------
  // 删除节点（连子树）
  // ---------------------------
  deleteNode(id: NodeId) {
    const removeRecursively = (draft: NodeState, nodeId: NodeId) => {
      for (const child of draft.tree[nodeId] || []) {
        removeRecursively(draft, child);
      }
      delete draft.nodes[nodeId];
      delete draft.tree[nodeId];

      // 从所有父节点中删除
      for (const parent in draft.tree) {
        draft.tree[parent] = draft.tree[parent].filter((c) => c !== nodeId);
      }
    };

    this.update((draft) => {
      removeRecursively(draft, id);
      if (draft.root === id) draft.root = null;
    });
  }

  // ---------------------------
  // 移动节点
  // ---------------------------
  moveNode(nodeId: NodeId, newParentId: NodeId) {
    this.update((draft) => {
      for (const parent in draft.tree) {
        draft.tree[parent] = draft.tree[parent].filter((c) => c !== nodeId);
      }
      draft.tree[newParentId].push(nodeId);
    });
  }

  // ---------------------------
  // 导出快照
  // ---------------------------
  exportSnapshot() {
    return JSON.parse(JSON.stringify(this.value));
  }

  // ---------------------------
  // 导入快照
  // ---------------------------
  importSnapshot(snapshot: NodeState) {
    this.state$.next(snapshot);
  }
}

export const pool = NodePool.get();
