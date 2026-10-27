<script lang="ts">
import { defineComponent, type PropType, type VNode } from "vue";

import { linkifyTemplateDocNodes } from "./linkify-template-docs";

export default defineComponent({
  name: "LinkifiedSlot",
  props: {
    render: Function as PropType<() => VNode[]>,
  },
  setup(props) {
    return () => linkifyTemplateDocNodes(props.render?.());
  },
});
</script>
