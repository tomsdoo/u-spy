import { getHtmlElementAttribute } from "@/components/dynamic-element/get-html-element-attribute";
import type { deflate } from "@/utils/deflate";

export function embedTextContent(node: Node, item: ReturnType<typeof deflate>) {
  const {
    isHTMLElement,
    hasAttribute,
    value: propName,
  } = getHtmlElementAttribute(node, ":text");
  if (isHTMLElement === false || hasAttribute === false) {
    return false;
  }

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
