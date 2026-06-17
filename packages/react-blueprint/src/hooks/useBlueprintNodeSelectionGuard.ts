import { useCallback, useRef, useState } from "react";

import {
  cancelFetchDebugTask,
  cancelSwaggerLoadTask,
  findActiveFetchConfigTaskNodeId,
} from "../fetch-config-task-store";

export type PendingBlueprintNodeSwitch = {
  fromNodeId: string;
  toNodeId: string | null;
};

export function useBlueprintNodeSelectionGuard(
  selectedNodeId: string | null,
  onSelectNode: (nodeId: string | null) => void
) {
  const [pendingSwitch, setPendingSwitch] =
    useState<PendingBlueprintNodeSwitch | null>(null);
  const selectedNodeIdRef = useRef(selectedNodeId);
  const onSelectNodeRef = useRef(onSelectNode);
  selectedNodeIdRef.current = selectedNodeId;
  onSelectNodeRef.current = onSelectNode;

  const requestSelectNode = useCallback((nodeId: string | null) => {
    const activeTaskNodeId = findActiveFetchConfigTaskNodeId();
    if (
      activeTaskNodeId &&
      selectedNodeIdRef.current === activeTaskNodeId &&
      nodeId !== activeTaskNodeId
    ) {
      setPendingSwitch({ fromNodeId: activeTaskNodeId, toNodeId: nodeId });
      return;
    }
    onSelectNodeRef.current(nodeId);
  }, []);

  const keepTaskAndSwitch = useCallback(() => {
    if (!pendingSwitch) return;
    onSelectNodeRef.current(pendingSwitch.toNodeId);
    setPendingSwitch(null);
  }, [pendingSwitch]);

  const cancelTaskAndSwitch = useCallback(() => {
    if (!pendingSwitch) return;
    cancelSwaggerLoadTask(pendingSwitch.fromNodeId);
    cancelFetchDebugTask(pendingSwitch.fromNodeId);
    onSelectNodeRef.current(pendingSwitch.toNodeId);
    setPendingSwitch(null);
  }, [pendingSwitch]);

  const stayOnCurrentNode = useCallback(() => {
    setPendingSwitch(null);
  }, []);

  return {
    requestSelectNode,
    pendingSwitch,
    keepTaskAndSwitch,
    cancelTaskAndSwitch,
    stayOnCurrentNode,
  };
}
