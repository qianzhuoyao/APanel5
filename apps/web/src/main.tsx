import { createRoot } from "react-dom/client";
import { BluePrintReactRoot } from "@arron/react-blueprint";

const App = () => (
  <div>
    <BluePrintReactRoot></BluePrintReactRoot>
  </div>
);

createRoot(document.getElementById("app")!).render(<App />);
