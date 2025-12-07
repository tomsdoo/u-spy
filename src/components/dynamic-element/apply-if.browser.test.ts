import { describe, expect, it } from "vitest";
import { applyIf } from "@/components/dynamic-element/apply-if";

describe("applyIf", () => {
  it("should remove the node if :if attribute is falsy", () => {
    const parentDiv = document.createElement("div");
    const div = document.createElement("div");
    parentDiv.appendChild(div);
    div.setAttribute(":if", "isVisible");
    const item = { isVisible: false };

    const result = applyIf(div, item);

    expect(result).toBe(true);
    expect(div.parentNode).toBeNull();
  });

  it("should not remove the node if :if attribute is truthy", () => {
    const parentDiv = document.createElement("div");
    const div = document.createElement("div");
    parentDiv.appendChild(div);
    div.setAttribute(":if", "isVisible");
    const item = { isVisible: true };

    const result = applyIf(div, item);

    expect(result).toBe(false);
    expect(div.parentNode).not.toBeNull();
  });

  it("should return false if node is not an HTMLElement", () => {
    const textNode = document.createTextNode("Hello");
    const item = { isVisible: true };

    const result = applyIf(textNode, item);

    expect(result).toBe(false);
  });

  it("should return false if :if attribute is not present", () => {
    const div = document.createElement("div");
    const item = { isVisible: true };

    const result = applyIf(div, item);

    expect(result).toBe(false);
  });
  it('should handle :if attribute with value "."', () => {
    const parentDiv = document.createElement("div");
    const div = document.createElement("div");
    parentDiv.appendChild(div);
    div.setAttribute(":if", ".");
    const itemTruthy = { someProp: "value" };
    const itemFalsy = null;

    const resultTruthy = applyIf(div, itemTruthy);
    expect(resultTruthy).toBe(false);
    expect(div.parentNode).not.toBeNull();

    const div2 = document.createElement("div");
    div2.setAttribute(":if", ".");
    parentDiv.appendChild(div2);
    // @ts-expect-error testing null case
    const resultFalsy = applyIf(div2, itemFalsy);
    expect(resultFalsy).toBe(true);
    expect(div2.parentNode).toBeNull();
  });

  it("should return false if :if attribute value is null", () => {
    const parentDiv = document.createElement("div");
    const div = document.createElement("div");
    parentDiv.appendChild(div);
    div.setAttribute(":if", "");
    const item = { "": true };

    const result = applyIf(div, item);

    expect(result).toBe(false);
    expect(div.parentNode).not.toBeNull();
  });
});
