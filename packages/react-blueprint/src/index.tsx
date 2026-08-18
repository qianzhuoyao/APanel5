import {
  FC,
  useCallback,
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
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./blueprint.css";

import { BlueprintGraph, type BlueprintFlowNodeData } from "./graph";
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
import { clientToFlowNodePosition } from "./flowCoordinates";
import type { BlueprintExecutionOverlay } from "./runtime/execution-overlay";

export type { BlueprintExecutionOverlay } from "./runtime/execution-overlay";

export type { BlueprintNodeConfigSidebarProps, BlueprintViewElementOption, BlueprintLibraryOption } from "./BlueprintNodeConfigSidebar";
export { BlueprintNodeConfigSidebar } from "./BlueprintNodeConfigSidebar";

export type BluePrintReactRootProps = {
  style?: React.CSSProperties;
  graph: BlueprintGraph;
  onGraphChange: Dispatch<SetStateAction<BlueprintGraph>>;
  selectedNodeId?: string | null;
  onSelectNode?: (nodeId: string | null) => void;
  /** 中止正在运行的时钟节点 */
  onAbortClock?: (nodeId: string) => void;
  /** 调试执行时的画布高亮（节点 + 边线信号色） */
  executionOverlay?: BlueprintExecutionOverlay | null;
  /** 蓝图库 id -> 名称，用于画布节点展示引用蓝图名 */
  libraryNameById?: ReadonlyMap<string, string>;
};

type BlueprintCanvasProps = Omit<BluePrintReactRootProps, "style"> & {
  containerRef: React.RefObject<HTMLDivElement | null>;
};

const blueprintEdgeTypes = createBlueprintEdgeTypes();

function BlueprintCanvas({
  graph,
  onGraphChange,
  selectedNodeId = null,
  executionOverlay = null,
  onSelectNode,
  onAbortClock,
  libraryNameById,
  containerRef,
}: BlueprintCanvasProps) {
  const { screenToFlowPosition } = useReactFlow();
  const [menu, setMenu] = useState<BlueprintContextMenuState | null>(null);

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
    onConnectEnd,
    isValidConnection,
  } = useBlueprintFlowState({
    graph,
    selectedNodeId,
    executionOverlay,
    libraryNameById,
    onGraphChange: applyGraphChange,
    onSelectNode,
  });

  const flowColorMode = useBlueprintFlowColorMode();

  useBlueprintFlowViewport(containerRef, true);

  const onPaneContextMenu = useCallback(
    (event: MouseEvent | React.MouseEvent) => {
      event.preventDefault();
      setMenu({
        kind: "pane",
        clientX: event.clientX,
        clientY: event.clientY,
      });
    },
    []
  );

  const onNodeContextMenu = useCallback(
    (
      event: MouseEvent | React.MouseEvent,
      node: Node<BlueprintFlowNodeData>
    ) => {
      event.preventDefault();
      onSelectNode?.(node.id);
      setMenu({
        kind: "node",
        clientX: event.clientX,
        clientY: event.clientY,
        nodeId: node.id,
        role: node.data.role,
      });
    },
    [onSelectNode]
  );

  const onEdgeContextMenu = useCallback(
    (event: MouseEvent | React.MouseEvent, edge: Edge) => {
      event.preventDefault();
      setMenu({
        kind: "edge",
        clientX: event.clientX,
        clientY: event.clientY,
        edgeId: edge.id,
      });
    },
    []
  );

  const onEdgeClick = useCallback(() => {
    setMenu(null);
  }, []);

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

  const handleAddBlueprintNode = useCallback(
    (clientX: number, clientY: number) => {
      const position = clientToFlowNodePosition(
        (point) => screenToFlowPosition(point, { snapToGrid: false }),
        clientX,
        clientY
      );
      setGraph((prev) => prev.addBlueprintNode(position));
    },
    [screenToFlowPosition, setGraph]
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

  const handleDeleteEdge = useCallback(
    (edgeId: string) => {
      setGraph((prev) => prev.removeEdge(edgeId));
    },
    [setGraph]
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
        onConnectEnd={onConnectEnd}
        isValidConnection={isValidConnection}
        onPaneContextMenu={onPaneContextMenu}
        onNodeContextMenu={onNodeContextMenu}
        onEdgeContextMenu={onEdgeContextMenu}
        onEdgeClick={onEdgeClick}
        onNodeDragStop={onNodeDragStop}
        onPaneClick={onPaneClick}
        nodesConnectable
        elementsSelectable
        edgesFocusable
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
        onDeleteNode={handleDeleteNode}
        onDeleteEdge={handleDeleteEdge}
      />
    </>
  );
}

export const BluePrintReactRoot: FC<BluePrintReactRootProps> = ({
  style,
  graph,
  onGraphChange,
  selectedNodeId,
  executionOverlay,
  onSelectNode,
  onAbortClock,
  libraryNameById,
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
      <BlueprintCanvasProvider
        onSelectNode={onSelectNode}
        onAbortClock={onAbortClock}
      >
        <ReactFlowProvider>
          <BlueprintCanvas
            containerRef={containerRef}
            graph={graph}
            onGraphChange={onGraphChange}
            selectedNodeId={selectedNodeId}
            executionOverlay={executionOverlay}
            onSelectNode={onSelectNode}
            libraryNameById={libraryNameById}
          />
        </ReactFlowProvider>
      </BlueprintCanvasProvider>
    </div>
  );
};
