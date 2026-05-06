import { createRoot } from "react-dom/client";

import { ReactViewPanel } from "@arron/react-view";
const App = () => (
  <div>
    <ReactViewPanel />
  </div>
);

createRoot(document.getElementById("app")!).render(<App />);
