import { describe, expect, it } from "vitest";
import { range } from "@/utils/array";

describe("range", () => {
  it("generates a range of integers from start to end inclusive", () => {
    expect(range(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(range(3, 3)).toEqual([3]);
    expect(range(-2, 2)).toEqual([-2, -1, 0, 1, 2]);
  });
});
