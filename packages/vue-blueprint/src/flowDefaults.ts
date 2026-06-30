import type { DefaultEdgeOptions } from "@vue-flow/core";

import { BP_EDGE_STYLE, BP_FLOW_EDGE_TYPE } from "./graph/sync-edges";

export const BLUEPRINT_DEFAULT_EDGE_OPTIONS = {
  type: BP_FLOW_EDGE_TYPE,
  zIndex: 1000,
  style: { ...BP_EDGE_STYLE },
} satisfies DefaultEdgeOptions;
