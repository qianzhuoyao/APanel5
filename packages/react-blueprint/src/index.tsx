import {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  ConnectionMode,
  addEdge,
  useEdgesState,
  useNodesState,
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
  applyFlowNodePositions,
  BP_EDGE_STYLE,
  BP_FLOW_EDGE_TYPE,
  flowEdgesToGraphEdges,
  graphToFlowEdges,
  graphToFlowNodes,
  mergeMeasuredFlowNodes,
  normalizeFlowEdges,
  edgeListSignature,
  nodeListSignature,
  resolveConnection,
  type BlueprintFlowNodeData,
} from "./graph";

import {
  BlueprintContextMenu,
  type BlueprintContextMenuState,
} from "./BlueprintContextMenu";
import { createBlueprintEdgeTypes } from "./createBlueprintEdgeTypes";
import { createBlueprintNodeTypes } from "./createBlueprintNodeTypes";
import { useBlueprintFlowViewport } from "./hooks/useBlueprintFlowViewport";

export type { BlueprintNodeConfigSidebarProps, BlueprintViewElementOption } from "./BlueprintNodeConfigSidebar";
export { BlueprintNodeConfigSidebar } from "./BlueprintNodeConfigSidebar";

export type BluePrintReactRootProps = {
  style?: React.CSSProperties;
  graph: BlueprintGraph;
  onGraphChange: Dispatch<SetStateAction<BlueprintGraph>>;
  selectedNodeId?: string | null;
  onSelectNode?: (nodeId: string | null) => void;
};

type BlueprintCanvasProps = Omit<BluePrintReactRootProps, "style"> & {
  containerRef: React.RefObject<HTMLDivElement | null>;
};

function BlueprintCanvas({
  graph,
  onGraphChange,
  selectedNodeId = null,
  onSelectNode,
  containerRef,
}: BlueprintCanvasProps) {
  const { screenToFlowPosition, getNodes } = useReactFlow();
  const [menu, setMenu] = useState<BlueprintContextMenuState | null>(null);
  const flowPositionRef = useRef({ x: 0, y: 0 });
  const nodeSigRef = useRef(nodeListSignature(graph.document.nodes));
  const edgeSigRef = useRef(edgeListSignature(graph.document.edges));

  const [nodes, setNodes, onNodesChangeRf] = useNodesState(
    graphToFlowNodes(graph, selectedNodeId)
  );

  const structuralEdges = useMemo(() => graphToFlowEdges(graph), [graph]);
  const [edges, setEdges, onEdgesChangeRf] = useEdgesState(structuralEdges);

  const nodeIdSig = useMemo(
    () => nodeListSignature(graph.document.nodes),
    [graph.document.nodes]
  );
  const edgeIdSig = useMemo(
    () => edgeListSignature(graph.document.edges),
    [graph.document.edges]
  );
  useBlueprintFlowViewport(containerRef, nodeIdSig);

  useEffect(() => {
    if (edgeSigRef.current === edgeIdSig) return;
    edgeSigRef.current = edgeIdSig;
    setEdges(structuralEdges);
  }, [edgeIdSig, structuralEdges, setEdges]);

  const setGraph = useCallback(
    (updater: (prev: BlueprintGraph) => BlueprintGraph) => {
      onGraphChange((prev) => updater(prev));
    },
    [onGraphChange]
  );

  useEffect(() => {
    const sig = nodeListSignature(graph.document.nodes);
    if (sig === nodeSigRef.current) return;
    nodeSigRef.current = sig;
    setNodes((prev) =>
      mergeMeasuredFlowNodes(
        graphToFlowNodes(graph, selectedNodeId),
        prev as Node<BlueprintFlowNodeData>[]
      )
    );
  }, [graph.document.nodes, selectedNodeId, setNodes, graph]);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: {
          ...(n.data as BlueprintFlowNodeData),
          isSelected: selectedNodeId === n.id,
        },
      }))
    );
  }, [selectedNodeId, setNodes]);

  const nodeTypes = useMemo(
    () => createBlueprintNodeTypes(onSelectNode),
    [onSelectNode]
  );
  const edgeTypes = useMemo(() => createBlueprintEdgeTypes(), []);

  const onNodesChange = useCallback(
    (changes: NodeChange<Node<BlueprintFlowNodeData>>[]) => {
      onNodesChangeRf(changes);

      const actionable = changes.filter(
        (c) => c.type !== "select" && c.type !== "dimensions"
      );
      if (actionable.length === 0) return;

      const removals = actionable.filter((c) => c.type === "remove");
      const shouldPersistGraph =
        removals.length > 0 ||
        actionable.some(
          (c) => c.type === "position" && "dragging" in c && c.dragging === false
        );
      if (!shouldPersistGraph) return;

      setNodes((nds) => {
        queueMicrotask(() => {
          onGraphChange((prev) => {
            let doc = prev;
            for (const change of removals) {
              if (change.type === "remove") {
                if (change.id === selectedNodeId) {
                  onSelectNode?.(null);
                }
                doc = doc.removeNode(change.id);
              }
            }
            return applyFlowNodePositions(doc, nds);
          });
        });
        return nds;
      });
    },
    [onNodesChangeRf, onSelectNode, selectedNodeId, onGraphChange, setNodes]
  );

  const onNodeDragStop = useCallback(() => {
    const rfNodes = getNodes();
    onGraphChange((prev) => applyFlowNodePositions(prev, rfNodes));
  }, [getNodes, onGraphChange]);

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      if (changes.length === 0) return;

      /** select 等 UI 态只更新本地 edges，不写 graph，避免受控边死循环 */
      onEdgesChangeRf(changes);

      const removals = changes.filter(
        (c): c is EdgeChange & { type: "remove"; id: string } => c.type === "remove"
      );
      if (removals.length === 0) return;

      onGraphChange((prev) => {
        let next = prev;
        for (const { id } of removals) {
          next = next.removeEdge(id);
        }
        return next;
      });
    },
    [onEdgesChangeRf, onGraphChange]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      const resolved = resolveConnection(
        connection,
        getNodes() as Node<BlueprintFlowNodeData>[]
      );
      if (!resolved?.source || !resolved.target) return;

      onGraphChange((prev) => {
        const current = graphToFlowEdges(prev);
        const exists = current.some(
          (e) =>
            e.source === resolved.source &&
            e.target === resolved.target &&
            (e.sourceHandle ?? "out") === (resolved.sourceHandle ?? "out") &&
            (e.targetHandle ?? "in") === (resolved.targetHandle ?? "in")
        );
        if (exists) return prev;

        const next = normalizeFlowEdges(
          addEdge(
            {
              ...resolved,
              type: BP_FLOW_EDGE_TYPE,
              zIndex: 1000,
              style: { ...BP_EDGE_STYLE },
            },
            current
          )
        );
        return prev.replaceEdges(flowEdgesToGraphEdges(next));
      });
    },
    [getNodes, onGraphChange]
  );

  const isValidConnection = useCallback(
    (connection: Edge | Connection) => {
      if (!connection.source || !connection.target) return false;
      if (connection.source === connection.target) return false;
      const nodeIds = new Set(nodes.map((n) => n.id));
      return nodeIds.has(connection.source) && nodeIds.has(connection.target);
    },
    [nodes]
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

  return (
    <>
      <ReactFlow
        className="bp-flow h-full w-full"
        colorMode="system"
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
        onPaneContextMenu={onPaneContextMenu}
        onNodeContextMenu={onNodeContextMenu}
        onNodeDragStop={onNodeDragStop}
        onPaneClick={() => {
          setMenu(null);
          onSelectNode?.(null);
        }}
        nodesConnectable
        elementsSelectable
        connectionMode={ConnectionMode.Strict}
        defaultEdgeOptions={{
          type: BP_FLOW_EDGE_TYPE,
          zIndex: 1000,
          style: { ...BP_EDGE_STYLE },
        }}
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
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      data-workspace-region="blueprint"
      className="bp-canvas h-full w-full"
      style={{
        width: "100%",
        height: "100%",
        minHeight: 0,
        ...style,
      }}
    >
      <ReactFlowProvider>
        <BlueprintCanvas
          containerRef={containerRef}
          graph={graph}
          onGraphChange={onGraphChange}
          selectedNodeId={selectedNodeId}
          onSelectNode={onSelectNode}
        />
      </ReactFlowProvider>
    </div>
  );
};
