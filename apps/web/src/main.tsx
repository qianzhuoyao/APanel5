import { createRoot } from "react-dom/client";

import { ReactViewPanel } from "@arron/react-view";
import "@arron/ui/styles.css";
import "@arron/react-view/styles.css";
import "./style.css";
import { ThemeProvider } from "@arron/ui";
const App = () => (
  <ThemeProvider defaultTheme="light">
    <ReactViewPanel />
  </ThemeProvider>
);

createRoot(document.getElementById("app")!).render(<App />);
