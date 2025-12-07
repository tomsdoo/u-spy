import { describe, expect, it } from "vitest";
import { embedTextContent } from "@/components/dynamic-element/embed-text-content";

describe("embedTextContent", () => {
  it("embeds text content into element with :text-content attribute", () => {
    const div = document.createElement("div");
    div.setAttribute(":text", "description");
    const item = { description: "This is a test description." };
    const result = embedTextContent(div, item);
    expect(result).toBe(true);
    expect(div.textContent).toBe("This is a test description.");
  });

  it("embeds text content into element with :text-content='.' attribute", () => {
    const span = document.createElement("span");
    span.setAttribute(":text", ".");
    const item = "Direct Text Content";
    // @ts-expect-error Testing with direct string value
    const result = embedTextContent(span, item);
    expect(result).toBe(true);
    expect(span.textContent).toBe("Direct Text Content");
  });

  it("handles missing property gracefully", () => {
    const p = document.createElement("p");
    p.setAttribute(":text", "missingProp");
    const item = { title: "Test Title" };
    const result = embedTextContent(p, item);
    expect(result).toBe(true);
    expect(p.textContent).toBe("");
  });

  it("returns false for non-HTMLElement nodes", () => {
    const textNode = document.createTextNode("Not an element");
    const item = { title: "Test Title" };
    const result = embedTextContent(textNode, item);
    expect(result).toBe(false);
  });

  it("returns false when :text-content attribute is missing", () => {
    const div = document.createElement("div");
    const item = { title: "Test Title" };
    const result = embedTextContent(div, item);
    expect(result).toBe(false);
  });
});
