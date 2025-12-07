import type { deflate } from "@/utils/deflate";

export function applyIf(node: Node, item: ReturnType<typeof deflate>) {
  if (node instanceof HTMLElement === false) {
    return false;
  }
  if (node.hasAttribute(":if") === false) {
    return false;
  }
  const propName = node.getAttribute(":if");
  if (propName == null) {
    return false;
  }
  if (propName === ".") {
    const targetValue = item;
    // truthy check
    if (!targetValue) {
      node.remove();
      return true;
    }
    return false;
  }
  const targetValue = item[propName];
  // truthy check
  if (!targetValue) {
    node.remove();
    return true;
  }
  return false;
}
