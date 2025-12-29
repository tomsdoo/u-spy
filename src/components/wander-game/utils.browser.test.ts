import { describe, expect, it } from "vitest";
import {
  createSVGElement,
  Direction,
  getEndPointFromDirection,
} from "@/components/wander-game/utils";

describe("createSVGElement", () => {
  it("creates an SVG element with the correct tag name and attributes", () => {
    const attributes = {
      width: 100,
      height: 100,
      viewBox: "0 0 100 100",
    };
    const svgElement = createSVGElement("svg", attributes);

    expect(svgElement.tagName).toBe("svg");
    expect(svgElement.getAttribute("width")).toBe("100");
    expect(svgElement.getAttribute("height")).toBe("100");
    expect(svgElement.getAttribute("viewBox")).toBe("0 0 100 100");
  });

  it("creates an SVG element without attributes when none are provided", () => {
    const circleElement = createSVGElement("circle");

    expect(circleElement.tagName).toBe("circle");
    expect(circleElement.getAttribute("cx")).toBeNull();
    expect(circleElement.getAttribute("cy")).toBeNull();
    expect(circleElement.getAttribute("r")).toBeNull();
  });
});

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
