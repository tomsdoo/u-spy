import { describe, expect, it } from "vitest";
import { embedHref } from "@/components/dynamic-element/embed-href";

const url = "https://dummy.com/";

describe("embedSrc", () => {
  it("embeds href into element with :href attribute", () => {
    const anchor = document.createElement("a");
    anchor.setAttribute(":href", "url");
    const item = { url };
    const result = embedHref(anchor, item);
    expect(result).toBe(true);
    expect(anchor.href).toBe(url);
  });

  it("embeds href into element with :href='.' attribute", () => {
    const anchor = document.createElement("a");
    anchor.setAttribute(":href", ".");
    const item = url;
    const result = embedHref(anchor, item);
    expect(result).toBe(true);
    expect(anchor.href).toBe(url);
  });

  it("handles missing property gracefully", () => {
    const anchor = document.createElement("a");
    anchor.setAttribute(":href", "missingProp");
    const item = { url };
    const result = embedHref(anchor, item);
    expect(result).toBe(true);
    expect(anchor.href).toBe("");
  });

  it("returns false for non-HTMLElement nodes", () => {
    const textNode = document.createTextNode("Not an element");
    const item = { url };
    const result = embedHref(textNode, item);
    expect(result).toBe(false);
  });

  it("returns false when :src attribute is missing", () => {
    const anchor = document.createElement("a");
    const item = { url };
    const result = embedHref(anchor, item);
    expect(result).toBe(false);
  });
});
