import type { deflate } from "@/utils/deflate";

export function embedTextContent(node: Node, item: ReturnType<typeof deflate>) {
  if (node instanceof HTMLElement === false) {
    return false;
  }
  if (node.hasAttribute(":text") === false) {
    return false;
  }
  const propName = node.getAttribute(":text");
  if (propName == null) {
    return true;
  }
  if (propName === ".") {
    node.textContent = String(item);
    return true;
  }
  if (propName in item === false) {
    node.textContent = "";
    return true;
  }
  const embeddingValue = item[propName];
  node.textContent = String(embeddingValue);
  return true;
}
