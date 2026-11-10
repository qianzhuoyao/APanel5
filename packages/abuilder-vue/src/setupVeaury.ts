import { createRoot } from "react-dom/client";
import { setVeauryOptions } from "veaury";

let configured = false;

/** 宿主无需再调 Veaury；App 挂载前确保 React 18+/19 createRoot 已注入。 */
export function ensureVeauryConfigured(): void {
  if (configured) return;
  setVeauryOptions({
    react: {
      createRoot,
    },
  });
  configured = true;
}

ensureVeauryConfigured();
