export const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

export enum Direction {
  UP = "up",
  DOWN = "down",
  LEFT = "left",
  RIGHT = "right",
}

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

export function getEndPointFromDirection({
  start,
  length,
  direction,
}: {
  start: { x: number; y: number };
  length: number;
  direction: Direction;
}) {
  let x = start.x;
  let y = start.y;
  switch (direction) {
    case Direction.UP:
      y -= length;
      break;
    case Direction.DOWN:
      y += length;
      break;
    case Direction.LEFT:
      x -= length;
      break;
    case Direction.RIGHT:
      x += length;
      break;
  }
  return { x, y };
}
