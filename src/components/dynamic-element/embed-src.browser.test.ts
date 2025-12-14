import { describe, expect, it } from "vitest";
import { embedSrc } from "@/components/dynamic-element/embed-src";

const imageUrl = "https://dummy.com/image.webp";

describe("embedSrc", () => {
  it("embeds src into element with :src attribute", () => {
    const img = document.createElement("img");
    img.setAttribute(":src", "imageUrl");
    const item = { imageUrl };
    const result = embedSrc(img, item);
    expect(result).toBe(true);
    expect(img.src).toBe(imageUrl);
  });

  it("embeds src into element with :src='.' attribute", () => {
    const img = document.createElement("img");
    img.setAttribute(":src", ".");
    const item = imageUrl;
    const result = embedSrc(img, item);
    expect(result).toBe(true);
    expect(img.src).toBe(imageUrl);
  });

  it("handles missing property gracefully", () => {
    const img = document.createElement("img");
    img.setAttribute(":src", "missingProp");
    const item = { imageUrl };
    const result = embedSrc(img, item);
    expect(result).toBe(true);
    expect(img.src).toBe("");
  });

  it("returns false for non-HTMLElement nodes", () => {
    const textNode = document.createTextNode("Not an element");
    const item = { imageUrl };
    const result = embedSrc(textNode, item);
    expect(result).toBe(false);
  });

  it("returns false when :src attribute is missing", () => {
    const img = document.createElement("img");
    const item = { imageUrl };
    const result = embedSrc(img, item);
    expect(result).toBe(false);
  });
});
