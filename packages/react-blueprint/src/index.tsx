import { FC, useState } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

interface IBlueprintProps {
  style?: React.CSSProperties;
}

// const initialNodes = [
//   { id: "n1", position: { x: 0, y: 0 }, data: { label: "Node 1" } },
//   { id: "n2", position: { x: 0, y: 100 }, data: { label: "Node 2" } },
// ];
// const initialEdges = [{ id: "n1-n2", source: "n1", target: "n2" }];

export const BluePrintReactRoot: FC<IBlueprintProps> = ({ style }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const onNodesChange = (changes) =>
    setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot));

  const onEdgesChange = (changes) =>
    setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot));

  const onConnect = (params) =>
    setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot));

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        ...style,
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      />
    </div>
  );
};
