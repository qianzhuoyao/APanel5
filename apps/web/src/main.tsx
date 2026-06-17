import { createRoot } from "react-dom/client";
import { useMemo } from "react";

import {
  ReactViewOnlinePreview,
  ReactViewPanel,
  parseOnlinePreviewSearchParams,
} from "@arron/react-view";
import "@arron/ui/styles.css";
import "@arron/react-view/styles.css";
import "./style.css";
import { ThemeProvider } from "@arron/ui";

function App() {
  const previewParams = useMemo(
    () => parseOnlinePreviewSearchParams(window.location.search),
    []
  );

  if (previewParams) {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
    document.documentElement.dataset.theme = "light";

    return (
      <div className="light min-h-[100vh] w-full bg-white text-gray-900" data-theme="light">
        <ReactViewOnlinePreview
          projectId={previewParams.projectId}
          previewInstanceId={previewParams.previewInstanceId}
        />
      </div>
    );
  }

  return (
    <ThemeProvider defaultTheme="dark" enableSystem={false}>
      <ReactViewPanel />
    </ThemeProvider>
  );
}

createRoot(document.getElementById("app")!).render(<App />);
