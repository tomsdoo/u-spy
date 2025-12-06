import { describe, it, expect } from "vitest";
import { combineSimpleReducers } from "@/components/dynamic-element/reducers";

describe("combineSimpleReducers", () => {
  it("should combine reducers correctly", () => {
    const reducer1 = (state: number) => state + 1;
    const reducer2 = (state: number) => state * 2;
    const reducer3 = (state: number) => state - 3;

    const combinedReducer = combineSimpleReducers([
      reducer1,
      reducer2,
      reducer3,
    ]);

    expect(combinedReducer(5)).toBe(((5 + 1) * 2) - 3);
  });

  it("should work with different types", () => {
    const stringReducer = (state: string) => state + " World";
    const lengthReducer = (state: string) => state.length;

    const combinedReducer = combineSimpleReducers([
      stringReducer,
      lengthReducer,
    ]);

    expect(combinedReducer("Hello")).toBe("Hello World".length);
  });

  it("should return the initial value if no reducers are provided", () => {
    const combinedReducer = combineSimpleReducers([]);
    expect(combinedReducer(42)).toBe(42);
    expect(combinedReducer("Test")).toBe("Test");
  });
});

