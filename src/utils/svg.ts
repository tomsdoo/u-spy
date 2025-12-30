export const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

export function createSVGElement<K extends keyof SVGElementTagNameMap>(
  tagName: K,
  attributes: Record<string, string | number> = {},
) {
  const svgElement = document.createElementNS(SVG_NAMESPACE, tagName);
  for (const [key, value] of Object.entries(attributes)) {
    svgElement.setAttribute(key, `${value}`);
  }
  return svgElement;
}
