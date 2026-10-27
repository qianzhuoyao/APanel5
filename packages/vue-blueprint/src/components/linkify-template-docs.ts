import { Comment, Fragment, Text, cloneVNode, h, type VNode } from "vue";

import TemplateConceptText from "./TemplateConceptText.vue";

function hasDocToken(text: string) {
  return /\{(?:scope|system)|\b(?:scope|system)\?\./.test(text);
}

function withChildren(node: VNode, children: VNode["children"]): VNode {
  const next = cloneVNode(node);
  next.children = children;
  return next;
}

function linkifyNode(node: VNode): VNode {
  if (node.type === Comment || node.type === Fragment) {
    if (Array.isArray(node.children)) {
      return withChildren(
        node,
        node.children.map((child) =>
          typeof child === "object" && child && "type" in child
            ? linkifyNode(child)
            : child
        )
      );
    }
    return node;
  }
  if (node.type === Text) {
    const text = typeof node.children === "string" ? node.children : "";
    if (!text || !hasDocToken(text)) return node;
    return h(TemplateConceptText, { text });
  }
  if (typeof node.children === "string") {
    if (!hasDocToken(node.children)) return node;
    return withChildren(node, [h(TemplateConceptText, { text: node.children })]);
  }
  if (Array.isArray(node.children)) {
    return withChildren(
      node,
      node.children.map((child) => {
        if (typeof child === "string") {
          return hasDocToken(child) ? h(TemplateConceptText, { text: child }) : child;
        }
        if (child && typeof child === "object" && "type" in child) return linkifyNode(child);
        return child;
      })
    );
  }
  return node;
}

export function linkifyTemplateDocNodes(nodes: VNode[] | undefined): VNode[] {
  if (!nodes) return [];
  return nodes.map((node) => linkifyNode(node));
}
