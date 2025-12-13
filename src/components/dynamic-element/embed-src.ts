import { getHtmlElementAttribute } from "@/components/dynamic-element/get-html-element-attribute";
import type { deflate } from "@/utils/deflate";

export function embedSrc(node: Node, item: ReturnType<typeof deflate>) {
  const {
    isHTMLElement,
    hasAttribute,
    value: propName,
  } = getHtmlElementAttribute(node, ":src");
  if (isHTMLElement === false || hasAttribute === false) {
    return false;
  }
  if (propName == null) {
    return true;
  }
  if (propName === ".") {
    (node as HTMLElement).setAttribute("src", String(item));
    return true;
  }
  if (propName in item === false) {
    (node as HTMLElement).removeAttribute("src");
    return true;
  }
  const embeddingValue = item[propName];
  (node as HTMLElement).setAttribute("src", String(embeddingValue));
  return true;
}
