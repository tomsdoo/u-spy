import { getHtmlElementAttribute } from "@/components/dynamic-element/get-html-element-attribute";
import { type deflate, pickPropertyFromDeflatedItem } from "@/utils/deflate";

export function applyIf(node: Node, item: ReturnType<typeof deflate>) {
  const {
    isHTMLElement,
    isHTMLElementNode,
    hasAttribute,
    value: propName,
  } = getHtmlElementAttribute(node, ":if");
  if (
    isHTMLElementNode(node) === false ||
    isHTMLElement === false ||
    hasAttribute === false ||
    propName === null
  ) {
    return false;
  }

  const targetValue = pickPropertyFromDeflatedItem(item, propName);
  // truthy check
  if (!targetValue) {
    node.remove();
    return true;
  }
  return false;
}
