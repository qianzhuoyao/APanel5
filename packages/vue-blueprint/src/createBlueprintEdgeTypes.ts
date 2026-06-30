import { markRaw, type Component } from "vue";

import BlueprintSmoothEdge from "./edges/BlueprintSmoothEdge.vue";
import { BP_FLOW_EDGE_TYPE } from "./graph/sync-edges";

export function createBlueprintEdgeTypes(): Record<string, Component> {
  return {
    [BP_FLOW_EDGE_TYPE]: markRaw(BlueprintSmoothEdge),
  };
}
