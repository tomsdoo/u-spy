import type { deflate } from "@/utils/deflate";

export function applyIfNot(node: Node, item: ReturnType<typeof deflate>) {
  if (node instanceof HTMLElement === false) {
    return false;
  }
  if (node.hasAttribute(":if-not") === false) {
    return false;
  }
  const propName = node.getAttribute(":if-not");
  if (propName == null) {
    return false;
  }
  if (propName === ".") {
    const targetValue = item;
    // falsy check
    if (targetValue) {
      node.remove();
      return true;
    }
    return false;
  }
  const targetValue = item[propName];
  // falsy check
  if (targetValue) {
    node.remove();
    return true;
  }
  return false;
}
