import { describe, expect, it } from "vitest";
import {
  Direction,
  getEndPointFromDirection,
} from "@/components/wander-game/utils";

describe("getEndPointFromDirection", () => {
  const start = { x: 50, y: 50 };
  const length = 20;
  it.each([
    { direction: Direction.UP, expected: { x: 50, y: 30 } },
    { direction: Direction.DOWN, expected: { x: 50, y: 70 } },
    { direction: Direction.LEFT, expected: { x: 30, y: 50 } },
    { direction: Direction.RIGHT, expected: { x: 70, y: 50 } },
  ])("calculates the end point correctly when moving $direction", ({
    direction,
    expected,
  }) => {
    const endPoint = getEndPointFromDirection({ start, length, direction });
    expect(endPoint).toEqual(expected);
  });
});
