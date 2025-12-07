import type { deflate } from "@/utils/deflate";

export function embedValue(node: Node, item: ReturnType<typeof deflate>) {
  if (node instanceof HTMLElement === false) {
    return false;
  }

  if (node.hasAttribute(":value") === false) {
    return false;
  }
  const propName = node.getAttribute(":value");
  if (propName == null) {
    return false;
  }

  const isValueTypeNumber =
    node instanceof HTMLProgressElement ||
    node instanceof HTMLMeterElement ||
    node instanceof HTMLLIElement;

  if (propName === ".") {
    if (isValueTypeNumber) {
      (node as HTMLProgressElement).value = typeof item === "number" ? item : 0;
      return true;
    }
    (node as HTMLInputElement).value = String(item);
    return true;
  }
  if (propName in item === false) {
    (node as HTMLInputElement).value = "";
    return true;
  }
  const embeddingValue = item[propName];
  if (isValueTypeNumber) {
    (node as HTMLProgressElement).value =
      typeof embeddingValue === "number" ? embeddingValue : 0;
    return true;
  }
  (node as HTMLInputElement).value = String(embeddingValue);
  return true;
}
