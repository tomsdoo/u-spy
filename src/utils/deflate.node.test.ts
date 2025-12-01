import { describe, expect, it } from "vitest";
import { deflate } from "@/utils/deflate";

describe("deflate", () => {
  describe("success", () => {
    it.each([
      {
        value: ["a", 1],
        expectedValue: {
          "": ["a", 1],
          "[0]": "a",
          "[1]": 1,
        },
      },
      {
        value: { a: 1 },
        expectedValue: { a: 1 },
      },
      {
        value: { a: null },
        expectedValue: { a: null },
      },
      {
        value: { a: ["a", 1] },
        expectedValue: { a: ["a", 1], "a[0]": "a", "a[1]": 1 },
      },
      {
        value: { a: new Date("2000-01-23T01:23:45Z") },
        expectedValue: { a: new Date("2000-01-23T01:23:45Z") },
      },
      {
        value: { a: /abc/ },
        expectedValue: { a: /abc/ },
      },
      {
        value: new Map([
          ["a", 1],
          ["b", 2],
        ]),
        expectedValue: { a: 1, b: 2 },
      },
      {
        value: {
          a: new Map([["b", 1]]),
          b: 2,
          c: new Map([["d", { e: 3 }]]),
          d: [{ e: 1 }, { f: { g: [2] } }],
        },
        expectedValue: {
          "a.b": 1,
          b: 2,
          "c.d.e": 3,
          d: [{ e: 1 }, { f: { g: [2] } }],
          "d[0].e": 1,
          "d[1].f.g": [2],
          "d[1].f.g[0]": 2,
        },
      },
    ])("$value", ({ value, expectedValue }) => {
      expect(deflate(value)).toEqual(expectedValue);
    });
  });
  describe("error", () => {
    it.each([
      {
        value: "a",
      },
      {
        value: 1,
      },
      {
        value: null,
      },
      {
        value: new Date(),
      },
      {
        value: /abc/,
      },
      {
        value: Math,
      },
      {
        value: JSON,
      },
      {
        value: Intl,
      },
      {
        value: Promise.resolve(),
      },
      {
        value: new Set(),
      },
      {
        value: new WeakSet(),
      },
      {
        value: new WeakMap(),
      },
    ])("$value", ({ value }) => {
      expect(() => deflate(value)).toThrowError();
    });
  });
});
