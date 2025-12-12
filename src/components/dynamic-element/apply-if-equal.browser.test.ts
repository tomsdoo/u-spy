import { describe, expect, it } from "vitest";
import { applyIfEqual } from "@/components/dynamic-element/apply-if-equal";

describe("applyIfEqual", () => {
  it("does nothing when :if-equal attribute is missing", () => {
    const div = document.createElement("div");
    div.setAttribute(":equal-value", "Alice");
    document.body.appendChild(div);

    const item = { name: "Bob" };
    const result = applyIfEqual(div, item);

    expect(result).toBe(false);
    expect(div.parentNode).not.toBeNull();
  });

  it("does nothing when :equal-value attribute is missing", () => {
    const div = document.createElement("div");
    div.setAttribute(":if-equal", "name");
    document.body.appendChild(div);

    const item = { name: "Bob" };
    const result = applyIfEqual(div, item);

    expect(result).toBe(false);
    expect(div.parentNode).not.toBeNull();
  });

  it.each([
    { type: "boolean, true", expectedValue: true, item: { name: true } },
    { type: "boolean, false", expectedValue: false, item: { name: false } },
    { type: "number", expectedValue: 1, item: { name: 1 } },
    { type: "string", expectedValue: "Alice", item: { name: "Alice" } },
  ])("keeps node when values are equal: type=$type", ({
    expectedValue,
    item,
  }) => {
    const div = document.createElement("div");
    div.setAttribute(":if-equal", "name");
    div.setAttribute(":equal-value", expectedValue.toString());
    document.body.appendChild(div);

    const result = applyIfEqual(div, item);

    expect(result).toBe(false);
    expect(div.parentNode).not.toBeNull();
  });

  it("removes node when values are not equal", () => {
    const div = document.createElement("div");
    div.setAttribute(":if-equal", "name");
    div.setAttribute(":equal-value", "Alice");
    document.body.appendChild(div);

    const item = { name: "Bob" };
    const result = applyIfEqual(div, item);

    expect(result).toBe(true);
    expect(div.parentNode).toBeNull();
  });

  it("removes node when using '.' and values are not equal", () => {
    const div = document.createElement("div");
    div.setAttribute(":if-equal", ".");
    div.setAttribute(":equal-value", "expectedValue");
    document.body.appendChild(div);

    const item = "actualValue";
    // @ts-expect-error testing with string item
    const result = applyIfEqual(div, item);

    expect(result).toBe(true);
    expect(div.parentNode).toBeNull();
  });

  it("keeps node when using '.' and values are equal", () => {
    const div = document.createElement("div");
    div.setAttribute(":if-equal", ".");
    div.setAttribute(":equal-value", "expectedValue");
    document.body.appendChild(div);

    const item = "expectedValue";
    // @ts-expect-error testing with string item
    const result = applyIfEqual(div, item);

    expect(result).toBe(false);
    expect(div.parentNode).not.toBeNull();
  });
});
