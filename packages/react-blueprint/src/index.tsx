import {
  FC,
  useCallback,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  applyEdgeChanges,
  applyNodeChanges,
  useReactFlow,
  type Connection,
  type Edge,
  type Node,
  type NodeChange,
  type EdgeChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./blueprint.css";

import {
  BlueprintGraph,
  collectPositionUpdates,
  syncEdgesFromFlow,
  toReactFlowEdges,
  toReactFlowNodes,
  type BlueprintFlowNodeData,
} from "./graph";

import {
  BlueprintContextMenu,
  type BlueprintContextMenuState,
} from "./BlueprintContextMenu";
import { createBlueprintNodeTypes } from "./createBlueprintNodeTypes";

export type { BlueprintNodeConfigSidebarProps, BlueprintViewElementOption } from "./BlueprintNodeConfigSidebar";
export { BlueprintNodeConfigSidebar } from "./BlueprintNodeConfigSidebar";

export type BluePrintReactRootProps = {
  style?: React.CSSProperties;
  graph: BlueprintGraph;
  onGraphChange: Dispatch<SetStateAction<BlueprintGraph>>;
  selectedNodeId?: string | null;
  onSelectNode?: (nodeId: string | null) => void;
};

type BlueprintCanvasProps = Omit<BluePrintReactRootProps, "style">;

function BlueprintCanvas({
  graph,
  onGraphChange,
  selectedNodeId = null,
  onSelectNode,
}: BlueprintCanvasProps) {
  const { screenToFlowPosition, fitView } = useReactFlow();
  const [menu, setMenu] = useState<BlueprintContextMenuState | null>(null);
  const flowPositionRef = useRef({ x: 0, y: 0 });
  const hasFitViewRef = useRef(false);

  const setGraph = useCallback(
    (updater: (prev: BlueprintGraph) => BlueprintGraph) => {
      onGraphChange((prev) => updater(prev));
    },
    [onGraphChange]
  );

  const nodes = useMemo(() => {
    const base = toReactFlowNodes(graph.document) as Node<BlueprintFlowNodeData>[];
    return base.map((n) => ({
      ...n,
      selected: false,
      data: {
        ...n.data,
        isSelected: selectedNodeId === n.id,
      },
    }));
  }, [graph.document, selectedNodeId]);

  const edges = useMemo(
    () => toReactFlowEdges(graph.document) as Edge[],
    [graph.document]
  );

  const nodeTypes = useMemo(
    () => createBlueprintNodeTypes(onSelectNode),
    [onSelectNode]
  );

  const onNodesChange = useCallback(
    (changes: NodeChange<Node<BlueprintFlowNodeData>>[]) => {
      const actionable = changes.filter(
        (c) => c.type !== "select" && c.type !== "dimensions"
      );
      if (actionable.length === 0) return;

      setGraph((prev) => {
        let next = prev;
        const removals = actionable.filter((c) => c.type === "remove");
        for (const change of removals) {
          if (change.type === "remove") {
            if (change.id === selectedNodeId) {
              onSelectNode?.(null);
            }
            next = next.removeNode(change.id);
          }
        }

        const flowNodes = toReactFlowNodes(next.document) as Node<BlueprintFlowNodeData>[];
        const nextFlowNodes = applyNodeChanges(actionable, flowNodes);
        return next.applyNodePositions(collectPositionUpdates(nextFlowNodes));
      });
    },
    [onSelectNode, selectedNodeId, setGraph]
  );

  const onNodeDragStop = useCallback(
    (_: React.MouseEvent, node: Node<BlueprintFlowNodeData>) => {
      setGraph((prev) =>
        prev.updateNodePosition(node.id, {
          x: node.position.x,
          y: node.position.y,
        })
      );
    },
    [setGraph]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setGraph((prev) => {
        const flowEdges = toReactFlowEdges(prev.document) as Edge[];
        const nextFlowEdges = applyEdgeChanges(changes, flowEdges);
        return prev.replaceEdges(
          syncEdgesFromFlow(
            nextFlowEdges.map((e) => ({
              id: e.id,
              source: e.source,
              target: e.target,
              sourceHandle: e.sourceHandle,
              targetHandle: e.targetHandle,
            }))
          )
        );
      });
    },
    [setGraph]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return;
      setGraph((prev) =>
        prev.addEdge({
          source: connection.source,
          target: connection.target,
          sourceHandle: connection.sourceHandle ?? undefined,
          targetHandle: connection.targetHandle ?? undefined,
        })
      );
    },
    [setGraph]
  );

  const onPaneContextMenu = useCallback(
    (event: MouseEvent | React.MouseEvent) => {
      event.preventDefault();
      flowPositionRef.current = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      setMenu({
        kind: "pane",
        clientX: event.clientX,
        clientY: event.clientY,
      });
    },
    [screenToFlowPosition]
  );

  const onNodeContextMenu = useCallback(
    (event: MouseEvent | React.MouseEvent, node: Node<BlueprintFlowNodeData>) => {
      event.preventDefault();
      onSelectNode?.(node.id);
      flowPositionRef.current = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      setMenu({
        kind: "node",
        clientX: event.clientX,
        clientY: event.clientY,
        nodeId: node.id,
        role: node.data.role,
      });
    },
    [onSelectNode, screenToFlowPosition]
  );

  const handleAddBlueprintNode = useCallback(() => {
    setGraph((prev) => prev.addBlueprintNode(flowPositionRef.current));
  }, [setGraph]);

  const handleAddLogicNode = useCallback(
    (parentBlueprintId: string) => {
      setGraph((prev) => {
        const parent = prev.getNode(parentBlueprintId);
        const base = parent?.position ?? flowPositionRef.current;
        return prev.addLogicNode(parentBlueprintId, {
          x: base.x + 40,
          y: base.y + 80,
        });
      });
    },
    [setGraph]
  );

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      if (nodeId === selectedNodeId) {
        onSelectNode?.(null);
      }
      setGraph((prev) => prev.removeNode(nodeId));
    },
    [onSelectNode, selectedNodeId, setGraph]
  );

  const onInit = useCallback(() => {
    if (hasFitViewRef.current) return;
    hasFitViewRef.current = true;
    requestAnimationFrame(() => {
      fitView({ padding: 0.2, duration: 0 });
    });
  }, [fitView]);

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneContextMenu={onPaneContextMenu}
        onNodeContextMenu={onNodeContextMenu}
        onNodeDragStop={onNodeDragStop}
        onPaneClick={() => {
          setMenu(null);
          onSelectNode?.(null);
        }}
        onInit={onInit}
        selectNodesOnDrag={false}
        elevateNodesOnSelect={false}
        nodeClickDistance={8}
        proOptions={{ hideAttribution: true }}
      />
      <BlueprintContextMenu
        menu={menu}
        onClose={() => setMenu(null)}
        onAddBlueprintNode={handleAddBlueprintNode}
        onAddLogicNode={handleAddLogicNode}
        onDeleteNode={handleDeleteNode}
      />
    </>
  );
}

export const BluePrintReactRoot: FC<BluePrintReactRootProps> = ({
  style,
  graph,
  onGraphChange,
  selectedNodeId,
  onSelectNode,
}) => {
  return (
    <div
      data-workspace-region="blueprint"
      style={{
        width: "100%",
        height: "100%",
        minHeight: 0,
        ...style,
      }}
    >
      <ReactFlowProvider>
        <BlueprintCanvas
          graph={graph}
          onGraphChange={onGraphChange}
          selectedNodeId={selectedNodeId}
          onSelectNode={onSelectNode}
        />
      </ReactFlowProvider>
    </div>
  );
};
