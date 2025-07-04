import { beforeEach, describe, it, expect } from "vitest";
import { KeyWaiter } from "@/key-event";

describe("KeyWaiter", () => {
  const WANTED_TEXT = "iwantit";

  describe.for([
    ["a", "i", false],
    ["i", "w", false],
    ["iw", "a", false],
    ["iwa", "n", false],
    ["iwan", "t", false],
    ["iwant", "i", false],
    ["iwanti", "t", false],
    ["iwantit", "", true],
    ["iwantia", "i", false],
  ])(`wanted: ${WANTED_TEXT}, input: %s`, ([inputText, expectedWantedKey, expectedSatisfied]) => {
    let keyWaiter: KeyWaiter;
    beforeEach(() => {
      function isString(s: string | boolean): s is string {
        return typeof s === "string";
      }
      keyWaiter = new KeyWaiter(WANTED_TEXT);
      const isInputTextString = isString(inputText);
      if (isInputTextString) {
        for(const key of inputText.split("")) {
          keyWaiter.feed(key);
        }
      }
    });

    it(`wantedKey will be ${expectedWantedKey}`, () => {
      expect(keyWaiter).toHaveProperty("wantedKey", expectedWantedKey);
    });

    it(`isSatisfied will be ${expectedSatisfied}`, () => {
      expect(keyWaiter).toHaveProperty("isSatisfied", expectedSatisfied);
    });

    it("clear() will clears", () => {
      keyWaiter.clear();
      expect(keyWaiter).toHaveProperty("wantedKey", "i");
      expect(keyWaiter).toHaveProperty("isSatisfied", false);
    });
  });
});
