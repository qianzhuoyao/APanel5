import { useState } from "react";
import { createRoot } from "react-dom/client";
import "@xyflow/react/dist/style.css";
import "./dev.css";
import "./blueprint.css";

import { BluePrintReactRoot } from ".";
import { createDevBlueprintGraph } from "./dev-seed";

function DevApp() {
  const [graph, setGraph] = useState(() => createDevBlueprintGraph());
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  return (
    <>
      <header className="bp-dev-toolbar">
        <strong>Blueprint Dev</strong>
        <span className="text-muted-foreground">
          右键画布添加节点 · 从右侧圆点拖到左侧圆点连线 · 初始应看到 A→B 蓝线
        </span>
        <span className="text-muted-foreground">
          节点 {graph.document.nodes.length} · 边 {graph.document.edges.length}
        </span>
      </header>
      <div className="bp-dev-canvas">
        <BluePrintReactRoot
          graph={graph}
          onGraphChange={setGraph}
          selectedNodeId={selectedNodeId}
          onSelectNode={setSelectedNodeId}
        />
      </div>
    </>
  );
}

createRoot(document.getElementById("app")!).render(<DevApp />);
