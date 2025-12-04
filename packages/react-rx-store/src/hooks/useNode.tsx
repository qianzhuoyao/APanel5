import { store } from "@arron/rx-store";
import { useStore } from "./useStore";

/**
 * 
 * @param id 
 * @param selector 
 * @returns 
 * @example
 * // 使用示例
function ButtonViewer({ id }: { id: string }) {
  // 订阅整个 props
  const props = useNode(id);

  // 或只订阅 x（精炼）
  const x = useNode(id, p => p.x);

  return (
    <div style={{ left: props.x, top: props.y }}>
      {props.text} (X: {x})
    </div>
  );
}
 */
export function useNode<T = any>(id: string, selector?: (props: any) => T): T {
  return useStore(state => {
    const node = store.findNodeById(state.root, id);  // 递归找节点
    const props = node?.props || {};
    return selector ? selector(props) : (props as T);
  });
}