import type { deflate } from "@/utils/deflate";

export function registerEventHandlers(
  node: Node,
  item: ReturnType<typeof deflate>,
  eventHandlers: Record<
    string,
    (
      e: Event,
      item?: ReturnType<typeof deflate>,
      wholeItem?: unknown,
      reflux?: (nextItem: unknown) => void,
    ) => void
  >,
  wholeItem: unknown,
  reflux: (nextItem: unknown) => void,
) {
  if (node instanceof HTMLElement === false) {
    return false;
  }
  let isRegistered = false;
  const handledEventNames = node
    .getAttributeNames()
    .filter((attributeName) => /^@/.test(attributeName))
    .map((attributeName) => attributeName.replace(/^@/, ""));
  for (const handledEventName of handledEventNames) {
    const handlerName = node.getAttribute(`@${handledEventName}`);
    if (handlerName == null || handlerName in eventHandlers === false) {
      continue;
    }
    node.addEventListener(handledEventName, (e) => {
      eventHandlers[handlerName](e, item, wholeItem, reflux);
    });
    isRegistered = true;
  }
  return isRegistered;
}
