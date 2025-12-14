import { decodeToRecord } from "@/components/dynamic-element/decode-to-record";
import { getHtmlElementAttribute } from "@/components/dynamic-element/get-html-element-attribute";
import { type deflate, pickPropertyFromDeflatedItem } from "@/utils/deflate";

export function addClasses(node: Node, item: ReturnType<typeof deflate>) {
  const {
    isHTMLElement,
    isHTMLElementNode,
    hasAttribute,
    value: classObjectExpression,
  } = getHtmlElementAttribute(node, ":class");
  if (
    isHTMLElementNode(node) === false ||
    isHTMLElement === false ||
    hasAttribute === false
  ) {
    return false;
  }

  if (classObjectExpression == null) {
    return false;
  }
  const classObject = (() => {
    try {
      return decodeToRecord(classObjectExpression);
    } catch {
      return null;
    }
  })();
  if (classObject == null) {
    return false;
  }
  let isAdded = false;
  for (const [className, propName] of Object.entries(classObject)) {
    const targetValue = pickPropertyFromDeflatedItem(item, propName);
    if (targetValue) {
      node.classList.add(className);
      isAdded = true;
    }
  }
  return isAdded;
}
