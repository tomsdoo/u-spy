import { getHtmlElementAttribute } from "@/components/dynamic-element/get-html-element-attribute";
import { type deflate, pickPropertyFromDeflatedItem } from "@/utils/deflate";

export function applyIfNot(node: Node, item: ReturnType<typeof deflate>) {
  const {
    isHTMLElement,
    isHTMLElementNode,
    hasAttribute,
    value: propName,
  } = getHtmlElementAttribute(node, ":if-not");
  if (
    isHTMLElementNode(node) === false ||
    isHTMLElement === false ||
    hasAttribute === false ||
    propName === null
  ) {
    return false;
  }

  const targetValue = pickPropertyFromDeflatedItem(item, propName);
  // falsy check
  if (targetValue) {
    node.remove();
    return true;
  }
  return false;
}
