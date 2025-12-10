import { describe, expect, it } from "vitest";
import { getHtmlElementAttribute } from "@/components/dynamic-element/get-html-element-attribute";

describe("getHtmlElementProperty", () => {
  it("should return with false as isHTMLElement if the node is not an HTMLElement", () => {
    const textNode = document.createTextNode("Hello");

    const result = getHtmlElementAttribute(textNode, "nodeValue");

    expect(result).toEqual({
      isHTMLElement: false,
      isHTMLElementNode: expect.any(Function),
      hasAttribute: false,
      value: undefined,
    });
  });

  it("should return false as hasAttribute if the property does not exist on the HTMLElement", () => {
    const div = document.createElement("div");

    const result = getHtmlElementAttribute(div, "nonExistentProp");

    expect(result).toEqual({
      isHTMLElement: true,
      isHTMLElementNode: expect.any(Function),
      hasAttribute: false,
      value: undefined,
    });
  });

  it("should return the attribute value if it exists on the HTMLElement", () => {
    const div = document.createElement("div");
    div.id = "test-id";

    const result = getHtmlElementAttribute(div, "id");

    expect(result).toEqual({
      isHTMLElement: true,
      isHTMLElementNode: expect.any(Function),
      hasAttribute: true,
      value: "test-id",
    });
  });
});
