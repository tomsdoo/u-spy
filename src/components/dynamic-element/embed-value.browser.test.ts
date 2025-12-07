import { describe, expect, it } from "vitest";
import { embedValue } from "@/components/dynamic-element/embed-value";

describe("embedValue", () => {
  it("embeds value into element with :value attribute", () => {
    const input = document.createElement("input");
    input.setAttribute(":value", "name");
    const item = { name: "Test Name", age: 30 };
    const result = embedValue(input, item);
    expect(result).toBe(true);
    expect(input.value).toBe("Test Name");
  });

  it("embeds value into element with :value='.' attribute", () => {
    const input = document.createElement("input");
    input.setAttribute(":value", ".");
    const item = "Direct Value";
    // @ts-expect-error Testing with direct string value
    const result = embedValue(input, item);
    expect(result).toBe(true);
    expect(input.value).toBe("Direct Value");
  });

  it("handles missing property gracefully", () => {
    const input = document.createElement("input");
    input.setAttribute(":value", "missingProp");
    const item = { name: "Test Name" };
    const result = embedValue(input, item);
    expect(result).toBe(true);
    expect(input.value).toBe("");
  });

  it("returns false for non-HTMLElement nodes", () => {
    const textNode = document.createTextNode("Not an element");
    const item = { name: "Test Name" };
    const result = embedValue(textNode, item);
    expect(result).toBe(false);
  });

  it("returns false when :value attribute is missing", () => {
    const div = document.createElement("div");
    const item = { name: "Test Name" };
    const result = embedValue(div, item);
    expect(result).toBe(false);
  });

  it("embeds numeric value into progress element", () => {
    const progress = document.createElement("progress");
    progress.setAttribute(":value", "progressValue");
    progress.max = 100;
    const item = { progressValue: 75 };
    const result = embedValue(progress, item);
    expect(result).toBe(true);
    expect(progress.value).toBe(75);
  });

  it("embeds numeric value into progress element with :value='.'", () => {
    const progress = document.createElement("progress");
    progress.setAttribute(":value", ".");
    progress.max = 100;
    const item = 50;
    // @ts-expect-error Testing with direct value
    const result = embedValue(progress, item);
    expect(result).toBe(true);
    expect(progress.value).toBe(50);
  });
});
