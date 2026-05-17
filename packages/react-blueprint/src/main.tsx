import { useState } from "react";
import { createRoot } from "react-dom/client";

import { BlueprintGraph } from "./graph";
import { BluePrintReactRoot } from ".";

function DevApp() {
  const [graph, setGraph] = useState(() => BlueprintGraph.empty());
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  return (
    <BluePrintReactRoot
      graph={graph}
      onGraphChange={setGraph}
      selectedNodeId={selectedNodeId}
      onSelectNode={setSelectedNodeId}
    />
  );
}

createRoot(document.getElementById("app")!).render(<DevApp />);
