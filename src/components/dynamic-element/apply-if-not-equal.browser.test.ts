import { describe, expect, it } from "vitest";
import { applyIfNotEqual } from "@/components/dynamic-element/apply-if-not-equal";

describe("applyIfNotEqual", () => {
  it("does nothing when :if-not-equal attribute is missing", () => {
    const div = document.createElement("div");
    div.setAttribute(":equal-value", "Alice");
    document.body.appendChild(div);

    const item = { name: "Bob" };
    const result = applyIfNotEqual(div, item);

    expect(result).toBe(false);
    expect(div.parentNode).not.toBeNull();
  });

  it("does nothing when :equal-value attribute is missing", () => {
    const div = document.createElement("div");
    div.setAttribute(":if-not-equal", "name");
    document.body.appendChild(div);

    const item = { name: "Bob" };
    const result = applyIfNotEqual(div, item);

    expect(result).toBe(false);
    expect(div.parentNode).not.toBeNull();
  });

  it.each([
    {
      type: "boolean, value is true",
      expectedValue: true,
      item: { name: false },
    },
    {
      type: "boolean, value is false",
      expectedValue: false,
      item: { name: true },
    },
    { type: "number", expectedValue: 1, item: { name: 2 } },
    { type: "string", expectedValue: "Alice", item: { name: "Bob" } },
    { type: "string vs number", expectedValue: "Alice", item: { name: 1 } },
  ])("keeps node when values are not equal: type=$type", ({
    expectedValue,
    item,
  }) => {
    const div = document.createElement("div");
    div.setAttribute(":if-not-equal", "name");
    div.setAttribute(":equal-value", expectedValue.toString());
    document.body.appendChild(div);

    const result = applyIfNotEqual(div, item);

    expect(result).toBe(false);
    expect(div.parentNode).not.toBeNull();
  });

  it("removes node when values are equal", () => {
    const div = document.createElement("div");
    div.setAttribute(":if-not-equal", "name");
    div.setAttribute(":equal-value", "Alice");
    document.body.appendChild(div);

    const item = { name: "Alice" };
    const result = applyIfNotEqual(div, item);

    expect(result).toBe(true);
    expect(div.parentNode).toBeNull();
  });

  it("removes node when using '.' and values are not equal", () => {
    const div = document.createElement("div");
    div.setAttribute(":if-not-equal", ".");
    div.setAttribute(":equal-value", "expectedValue");
    document.body.appendChild(div);

    const item = "expectedValue";
    // @ts-expect-error testing with string item
    const result = applyIfNotEqual(div, item);

    expect(result).toBe(true);
    expect(div.parentNode).toBeNull();
  });

  it("keeps node when using '.' and values are equal", () => {
    const div = document.createElement("div");
    div.setAttribute(":if-not-equal", ".");
    div.setAttribute(":equal-value", "expectedValue");
    document.body.appendChild(div);

    const item = "actualValue";
    // @ts-expect-error testing with string item
    const result = applyIfNotEqual(div, item);

    expect(result).toBe(false);
    expect(div.parentNode).not.toBeNull();
  });
});
