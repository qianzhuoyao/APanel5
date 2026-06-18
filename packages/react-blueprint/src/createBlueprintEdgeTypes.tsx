import type { EdgeTypes } from "@xyflow/react";

import { BlueprintSmoothEdge } from "./edges/BlueprintSmoothEdge";
import { BP_FLOW_EDGE_TYPE } from "./graph/sync-edges";

export function createBlueprintEdgeTypes(): EdgeTypes {
  return {
    [BP_FLOW_EDGE_TYPE]: BlueprintSmoothEdge,
  };
}
