import { describe, expect, it } from "vitest";
import { applyIfNot } from "@/components/dynamic-element/apply-if-not";

describe("applyIf", () => {
  it("should remove the node if :if-not attribute is truthy", () => {
    const parentDiv = document.createElement("div");
    const div = document.createElement("div");
    parentDiv.appendChild(div);
    div.setAttribute(":if-not", "isNotVisible");
    const item = { isNotVisible: true };

    const result = applyIfNot(div, item);

    expect(result).toBe(true);
    expect(div.parentNode).toBeNull();
  });

  it("should not remove the node if :if-not attribute is falsy", () => {
    const parentDiv = document.createElement("div");
    const div = document.createElement("div");
    parentDiv.appendChild(div);
    div.setAttribute(":if-not", "isNotVisible");
    const item = { isNotVisible: false };

    const result = applyIfNot(div, item);

    expect(result).toBe(false);
    expect(div.parentNode).not.toBeNull();
  });

  it("should return false if node is not an HTMLElement", () => {
    const textNode = document.createTextNode("Hello");
    const item = { isVisible: true };

    const result = applyIfNot(textNode, item);

    expect(result).toBe(false);
  });

  it("should return false if :if-not attribute is not present", () => {
    const div = document.createElement("div");
    const item = { isNotVisible: true };

    const result = applyIfNot(div, item);

    expect(result).toBe(false);
  });
  it('should handle :if-not attribute with value "."', () => {
    const parentDiv = document.createElement("div");
    const div = document.createElement("div");
    parentDiv.appendChild(div);
    div.setAttribute(":if-not", ".");
    const itemTruthy = { someProp: "value" };
    const itemFalsy = null;

    const resultTruthy = applyIfNot(div, itemTruthy);
    expect(resultTruthy).toBe(true);
    expect(div.parentNode).toBeNull();

    const div2 = document.createElement("div");
    div2.setAttribute(":if-not", ".");
    parentDiv.appendChild(div2);
    // @ts-expect-error testing null case
    const resultFalsy = applyIfNot(div2, itemFalsy);
    expect(resultFalsy).toBe(false);
    expect(div2.parentNode).not.toBeNull();
  });

  it("should return false if :if-not attribute value is null", () => {
    const parentDiv = document.createElement("div");
    const div = document.createElement("div");
    parentDiv.appendChild(div);
    div.toggleAttribute(":if-not", true);
    const item = { "": false };

    const result = applyIfNot(div, item);

    expect(result).toBe(false);
    expect(div.parentNode).not.toBeNull();
  });
});
