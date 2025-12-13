import { describe, expect, it } from "vitest";
import { addClasses } from "@/components/dynamic-element/add-classes";

describe("addClasses", () => {
  it("should add classes based on item properties", () => {
    const div = document.createElement("div");
    const item = {
      isActive: true,
      isDisabled: false,
      isHighlighted: 1,
      isHidden: 0,
      isVisible: true,
    };
    div.setAttribute(
      ":class",
      `{
        active: isActive,
        disabled: isDisabled,
        highlighted: isHighlighted,
        hidden: isHidden,
        -visible: isVisible,
      }`,
    );
    console.log(div.outerHTML);

    const result = addClasses(div, item);

    expect(result).toBe(true);
    expect(div.classList.contains("active")).toBe(true);
    expect(div.classList.contains("disabled")).toBe(false);
    expect(div.classList.contains("highlighted")).toBe(true);
    expect(div.classList.contains("hidden")).toBe(false);
    expect(div.classList.contains("-visible")).toBe(true);
  });

  it("should return false if :class attribute is missing", () => {
    const div = document.createElement("div");
    const item = {};

    const result = addClasses(div, item);

    expect(result).toBe(false);
    expect(div.classList.length).toBe(0);
  });

  it("should return false if :class attribute is invalid", () => {
    const div = document.createElement("div");
    const item = {};
    div.setAttribute(":class", "invalid");

    const result = addClasses(div, item);

    expect(result).toBe(false);
    expect(div.classList.length).toBe(0);
  });

  it("should return false if no classes are added", () => {
    const div = document.createElement("div");
    const item = {
      isActive: false,
      isDisabled: 0,
    };
    div.setAttribute(
      ":class",
      `{
        active: isActive,
        disabled: isDisabled,
      }`,
    );

    const result = addClasses(div, item);

    expect(result).toBe(false);
    expect(div.classList.length).toBe(0);
  });

  it("should add class when propName is '.' and item is truthy", () => {
    const div = document.createElement("div");
    const item = true;
    div.setAttribute(
      ":class",
      `{
        active: .,
      }`,
    );

    // @ts-expect-error testing purpose
    const result = addClasses(div, item);

    expect(result).toBe(true);
    expect(div.classList.contains("active")).toBe(true);
  });

  it("should not add class when propName is '.' and item is falsy", () => {
    const div = document.createElement("div");
    const item = false;
    div.setAttribute(
      ":class",
      `{
        active: .,
      }`,
    );

    // @ts-expect-error testing purpose
    const result = addClasses(div, item);

    expect(result).toBe(false);
    expect(div.classList.contains("active")).toBe(false);
  });
});
