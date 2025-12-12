import { getHtmlElementAttribute } from "@/components/dynamic-element/get-html-element-attribute";
import type { deflate } from "@/utils/deflate";

export function applyIfEqual(node: Node, item: ReturnType<typeof deflate>) {
  const {
    isHTMLElement,
    isHTMLElementNode,
    hasAttribute,
    value: propName,
  } = getHtmlElementAttribute(node, ":if-equal");
  if (
    isHTMLElement === false ||
    isHTMLElementNode(node) === false ||
    hasAttribute === false ||
    propName == null
  ) {
    return false;
  }
  const { hasAttribute: hasEqualValueAttribute, value: expectedValue } =
    getHtmlElementAttribute(node, ":equal-value");
  if (hasEqualValueAttribute === false || expectedValue == null) {
    return false;
  }

  const targetValue = propName === "." ? item : item[propName];
  if (String(targetValue) !== String(expectedValue)) {
    node.remove();
    return true;
  }
  return false;
}
