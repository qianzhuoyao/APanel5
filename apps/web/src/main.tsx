import { createRoot } from "react-dom/client";

import {
  App,
  addEventSubscription,
  AbuilderEvents,
} from "@arronqzy/abuilder";
import "@arronqzy/abuilder/styles.css";
import { useEffect } from "react";

const Main = () => {
  useEffect(() => {
    const { unsubscribe } = addEventSubscription(
      AbuilderEvents.workspaceSync,
      (payload) => {
        console.log("workspaceAdd", payload);
      },
    );
    return () => {
      unsubscribe();
    };
  }, []);

  return <App />;
};

createRoot(document.getElementById("app")!).render(<Main />);
