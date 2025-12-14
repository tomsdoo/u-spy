import { describe, expect, it } from "vitest";
import { deflate, pickPropertyFromDeflatedItem } from "@/utils/deflate";

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
      {
        value: 1,
        expectedValue: 1,
      },
      {
        value: "a",
        expectedValue: "a",
      },
      {
        value: null,
        expectedValue: null,
      },
      {
        value: undefined,
        expectedValue: undefined,
      },
      {
        value: new Date("2000-01-23T01:23:45Z"),
        expectedValue: new Date("2000-01-23T01:23:45Z"),
      },
      {
        value: /abc/,
        expectedValue: /abc/,
      },
      { value: true, expectedValue: true },
      { value: false, expectedValue: false },
    ])("$value", ({ value, expectedValue }) => {
      expect(deflate(value)).toEqual(expectedValue);
    });
  });
  describe("error", () => {
    it.each([
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

describe("pickPropertyFromDeflatedItem", () => {
  it.each([
    {
      deflatedItem: { a: 1, b: 2 },
      propName: ".",
      expectedValue: { a: 1, b: 2 },
    },
    {
      deflatedItem: { a: 1, b: 2 },
      propName: "a",
      expectedValue: 1,
    },
    {
      deflatedItem: { a: 1, b: 2 },
      propName: "b",
      expectedValue: 2,
    },
    {
      deflatedItem: { a: 1, b: 2 },
      propName: "c",
      expectedValue: null,
    },
    {
      deflatedItem: 1,
      propName: "a",
      expectedValue: 1,
    },
    {
      deflatedItem: new Date("2000-01-23T01:23:45Z"),
      propName: "a",
      expectedValue: new Date("2000-01-23T01:23:45Z"),
    },
    {
      deflatedItem: /abc/,
      propName: "a",
      expectedValue: /abc/,
    },
    {
      deflatedItem: null,
      propName: "a",
      expectedValue: null,
    },
    {
      deflatedItem: undefined,
      propName: "a",
      expectedValue: undefined,
    },
  ])("$deflatedItem, $propName", ({
    deflatedItem,
    propName,
    expectedValue,
  }) => {
    expect(pickPropertyFromDeflatedItem(deflatedItem, propName)).toEqual(
      expectedValue,
    );
  });
});
