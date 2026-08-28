import { createRoot } from "react-dom/client";

import {
  App,
  // addEventSubscription,
  // getPreviewSnapshot,
  // AbuilderEvents,
} from "@arronqzy/abuilder";
import "@arronqzy/abuilder/styles.css";
// import { useEffect } from "react";

const Main = () => {
  // useEffect(() => {
  //   const { unsubscribe } = addEventSubscription(
  //     AbuilderEvents.workspaceSync,
  //     (payload) => {
  //       getPreviewSnapshot().then((snapshot) => {
  //         console.log("snapshot", snapshot);
  //       });
  //       console.log("workspaceAdd", payload);
  //     },
  //   );
  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);

  return <App />;
};

createRoot(document.getElementById("app")!).render(<Main />);
