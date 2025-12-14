import { getHtmlElementAttribute } from "@/components/dynamic-element/get-html-element-attribute";
import { type deflate, pickPropertyFromDeflatedItem } from "@/utils/deflate";

export function embedHref(node: Node, item: ReturnType<typeof deflate>) {
  const {
    isHTMLElement,
    hasAttribute,
    value: propName,
  } = getHtmlElementAttribute(node, ":href");
  if (isHTMLElement === false || hasAttribute === false) {
    return false;
  }
  if (propName == null) {
    return true;
  }
  const embeddingValue = pickPropertyFromDeflatedItem(item, propName);
  if (embeddingValue == null) {
    (node as HTMLElement).removeAttribute("href");
    return true;
  }

  (node as HTMLElement).setAttribute("href", String(embeddingValue));
  return true;
}
