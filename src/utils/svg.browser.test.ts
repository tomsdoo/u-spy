import { describe, expect, it } from "vitest";
import { createSVGElement } from "@/utils/svg";

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
