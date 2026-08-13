import { useState } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@arronqzy/ui";
import { I18nProvider, useI18n } from "@arronqzy/i18n/react";
import "@arronqzy/ui/styles.css";
import "@xyflow/react/dist/style.css";
import "./dev.css";
import "./blueprint.css";

import { BluePrintReactRoot } from ".";
import { createDevBlueprintGraph } from "./dev-seed";

function DevApp() {
  const { t } = useI18n();
  const [graph, setGraph] = useState(() => createDevBlueprintGraph());
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  return (
    <>
      <header className="bp-dev-toolbar">
        <strong>Blueprint Dev</strong>
        <span className="text-muted-foreground">
          {t("blueprint.dev.hint")}
        </span>
        <span className="text-muted-foreground">
          {t("blueprint.dev.stats", {
            nodes: graph.document.nodes.length,
            edges: graph.document.edges.length,
          })}
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

createRoot(document.getElementById("app")!).render(
  <I18nProvider>
    <ThemeProvider defaultTheme="light" enableSystem={false}>
      <DevApp />
    </ThemeProvider>
  </I18nProvider>
);
