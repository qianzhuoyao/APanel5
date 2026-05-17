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
  ConnectionMode,
  useReactFlow,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./blueprint.css";

import { BlueprintGraph, nodeListSignature, type BlueprintFlowNodeData } from "./graph";
import {
  BlueprintContextMenu,
  type BlueprintContextMenuState,
} from "./BlueprintContextMenu";
import { BlueprintCanvasProvider } from "./BlueprintCanvasContext";
import { blueprintNodeTypes } from "./blueprintNodeTypes";
import { createBlueprintEdgeTypes } from "./createBlueprintEdgeTypes";
import { BLUEPRINT_DEFAULT_EDGE_OPTIONS } from "./flowDefaults";
import { useBlueprintFlowColorMode } from "./hooks/useBlueprintFlowColorMode";
import { useBlueprintFlowState } from "./hooks/useBlueprintFlowState";
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

const blueprintEdgeTypes = createBlueprintEdgeTypes();

function BlueprintCanvas({
  graph,
  onGraphChange,
  selectedNodeId = null,
  onSelectNode,
  containerRef,
}: BlueprintCanvasProps) {
  const { screenToFlowPosition } = useReactFlow();
  const [menu, setMenu] = useState<BlueprintContextMenuState | null>(null);
  const flowPositionRef = useRef({ x: 0, y: 0 });

  const applyGraphChange = useCallback(
    (updater: (prev: BlueprintGraph) => BlueprintGraph) => {
      onGraphChange((prev) => updater(prev));
    },
    [onGraphChange]
  );

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onNodeDragStop,
    onConnect,
    isValidConnection,
  } = useBlueprintFlowState({
    graph,
    selectedNodeId,
    onGraphChange: applyGraphChange,
    onSelectNode,
  });

  const flowColorMode = useBlueprintFlowColorMode();
  const nodeIdSig = useMemo(
    () => nodeListSignature(graph.document.nodes),
    [graph.document.nodes]
  );

  useBlueprintFlowViewport(containerRef, nodeIdSig, true);

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
    (
      event: MouseEvent | React.MouseEvent,
      node: Node<BlueprintFlowNodeData>
    ) => {
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

  const onPaneClick = useCallback(() => {
    setMenu(null);
    onSelectNode?.(null);
  }, [onSelectNode]);

  const setGraph = useCallback(
    (updater: (prev: BlueprintGraph) => BlueprintGraph) => {
      applyGraphChange(updater);
    },
    [applyGraphChange]
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
        colorMode={flowColorMode}
        nodes={nodes}
        edges={edges}
        nodeTypes={blueprintNodeTypes}
        edgeTypes={blueprintEdgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
        onPaneContextMenu={onPaneContextMenu}
        onNodeContextMenu={onNodeContextMenu}
        onNodeDragStop={onNodeDragStop}
        onPaneClick={onPaneClick}
        nodesConnectable
        elementsSelectable
        connectionMode={ConnectionMode.Strict}
        defaultEdgeOptions={BLUEPRINT_DEFAULT_EDGE_OPTIONS}
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
      className="bp-canvas h-full w-full bg-background text-foreground"
      style={{
        width: "100%",
        height: "100%",
        minHeight: 0,
        ...style,
      }}
    >
      <BlueprintCanvasProvider onSelectNode={onSelectNode}>
        <ReactFlowProvider>
          <BlueprintCanvas
            containerRef={containerRef}
            graph={graph}
            onGraphChange={onGraphChange}
            selectedNodeId={selectedNodeId}
            onSelectNode={onSelectNode}
          />
        </ReactFlowProvider>
      </BlueprintCanvasProvider>
    </div>
  );
};
