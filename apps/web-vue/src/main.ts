import { createApp } from "vue";
import { createRoot } from "react-dom/client";
import { setVeauryOptions } from "veaury";

import { App } from "@arronqzy/abuilder-vue";
import "@arronqzy/abuilder/styles.css";

setVeauryOptions({
  react: {
    createRoot,
  },
});

createApp(App, {
  plugins: ["ai"],
  pTitle: "ABUILDER",
  pIcon: "/favicon.svg",
}).mount("#app");
