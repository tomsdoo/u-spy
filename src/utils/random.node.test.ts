import { describe, expect, it, vi } from "vitest";
import { chooseRandomlyFromArray } from "@/utils/random";

describe("chooseRandomlyFromArray", () => {
  it("returns an element from the array", () => {
    const array = [1, 2, 3, 4, 5];
    const result = chooseRandomlyFromArray(array);
    expect(array).toContain(result);
  });

  it("works with an array of strings", () => {
    const array = ["apple", "banana", "cherry"];
    const result = chooseRandomlyFromArray(array);
    expect(array).toContain(result);
  });

  it("works with an array of objects", () => {
    const array = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const result = chooseRandomlyFromArray(array);
    expect(array).toContain(result);
  });

  it("returns undefined for an empty array", () => {
    const array: number[] = [];
    const result = chooseRandomlyFromArray(array);
    expect(result).toBeUndefined();
  });

  it("returns the only element for a single-element array", () => {
    const array = [42];
    const result = chooseRandomlyFromArray(array);
    expect(result).toBe(42);
  });

  it.each([
    {
      array: ["red", "green", "blue"],
      mockedRandomValue: 0.2,
      expected: "red",
    },
    {
      array: ["red", "green", "blue"],
      mockedRandomValue: 0.35,
      expected: "green",
    },
    {
      array: ["red", "green", "blue"],
      mockedRandomValue: 0.7,
      expected: "blue",
    },
  ])("index is correctly calculated: case if array length is 3 and Math.random() returns $mockedRandomValue", ({
    array,
    mockedRandomValue,
    expected,
  }) => {
    vi.spyOn(Math, "random").mockReturnValueOnce(mockedRandomValue);
    const result = chooseRandomlyFromArray(array);
    expect(result).toBe(expected);
  });
});
