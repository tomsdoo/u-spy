import { getHtmlElementAttribute } from "@/components/dynamic-element/get-html-element-attribute";
import { type deflate, pickPropertyFromDeflatedItem } from "@/utils/deflate";

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
  const embeddingText = pickPropertyFromDeflatedItem(item, propName);
  if (embeddingText == null) {
    node.textContent = "";
    return true;
  }
  node.textContent = String(embeddingText);
  return true;
}
