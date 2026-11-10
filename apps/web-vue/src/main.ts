import { createApp } from "vue";

import { App } from "@arronqzy/abuilder-vue";
import "@arronqzy/abuilder-vue/styles.css";

createApp(App, {
  plugins: ["ai"],
  pTitle: "ABUILDER",
  pIcon: "/favicon.svg",
}).mount("#app");
