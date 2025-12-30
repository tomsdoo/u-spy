export enum Direction {
  UP = "up",
  DOWN = "down",
  LEFT = "left",
  RIGHT = "right",
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
