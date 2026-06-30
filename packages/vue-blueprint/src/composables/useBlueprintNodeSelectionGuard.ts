import { ref, type Ref } from "vue";

export type PendingBlueprintNodeSwitch = {
  fromNodeId: string;
  toNodeId: string | null;
};

export function useBlueprintNodeSelectionGuard(
  _selectedNodeId: Ref<string | null>,
  onSelectNode: (nodeId: string | null) => void
) {
  const pendingSwitch = ref<PendingBlueprintNodeSwitch | null>(null);

  function requestSelectNode(nodeId: string | null) {
    onSelectNode(nodeId);
  }

  function keepTaskAndSwitch() {
    if (!pendingSwitch.value) return;
    onSelectNode(pendingSwitch.value.toNodeId);
    pendingSwitch.value = null;
  }

  function cancelTaskAndSwitch() {
    if (!pendingSwitch.value) return;
    onSelectNode(pendingSwitch.value.toNodeId);
    pendingSwitch.value = null;
  }

  function stayOnCurrentNode() {
    pendingSwitch.value = null;
  }

  return {
    requestSelectNode,
    pendingSwitch,
    keepTaskAndSwitch,
    cancelTaskAndSwitch,
    stayOnCurrentNode,
  };
}
