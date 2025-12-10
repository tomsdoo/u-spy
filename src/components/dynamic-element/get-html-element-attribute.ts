export function getHtmlElementAttribute(node: Node, attributeName: string) {
  function isHTMLElementNode(node: Node): node is HTMLElement {
    return node instanceof HTMLElement;
  }
  const isHTMLElement = isHTMLElementNode(node);
  if (isHTMLElement === false) {
    return {
      isHTMLElement,
      isHTMLElementNode,
      hasAttribute: false,
      value: undefined,
    };
  }
  const hasAttribute = node.hasAttribute(attributeName);
  if (hasAttribute === false) {
    return {
      isHTMLElement,
      isHTMLElementNode,
      hasAttribute,
      value: undefined,
    };
  }
  const value = node.getAttribute(attributeName);
  return {
    isHTMLElement,
    isHTMLElementNode,
    hasAttribute,
    value,
  };
}
