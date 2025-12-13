import { describe, expect, it } from "vitest";
import { decodeToRecord } from "@/components/dynamic-element/decode-to-record";

describe("decodeToRecord", () => {
  it.each([
    { input: "{ a: 'b', c: 'd' }", expected: { a: "b", c: "d" } },
    {
      input: `{
      x:'y',
      z:'w',
    }`,
      expected: { x: "y", z: "w" },
    },
    { input: " { a: 'b', c: 'd' } ", expected: { a: "b", c: "d" } },
    { input: "{a:'b',c:'d'}", expected: { a: "b", c: "d" } },
    {
      input: " { a: 'b', c: function() {} } ",
      expected: { a: "b", c: "function() {}" },
    },
    {
      input: " { a: 'b', c: function(){} } ",
      expected: { a: "b", c: "function(){}" },
    },
    {
      input: " { a: 'b.c', c: 'd[0].e' } ",
      expected: { a: "b.c", c: "d[0].e" },
    },
    {
      input: " { a: b.c, c: d[0].e } ",
      expected: { a: "b.c", c: "d[0].e" },
    },
    {
      input: "{ key1 : 'value1' , key2 : 'value2' }",
      expected: { key1: "value1", key2: "value2" },
    },
    {
      input: "{ -key: 'value', key_two: 'value2' }",
      expected: { "-key": "value", key_two: "value2" },
    },
    { input: "{}", expected: {} },
    { input: "{ invalid json }", expected: null },
    { input: "not a json", expected: null },
  ])("should decode string to record case input: $input", ({
    input,
    expected,
  }) => {
    const result = decodeToRecord(input);
    expect(result).toEqual(expected);
  });
});
