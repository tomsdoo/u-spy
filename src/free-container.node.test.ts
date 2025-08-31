import { describe, it, expect, vi } from "vitest";
import { freeContainer } from "@/free-container";

function generateRandomKeyValue() {
  return {
    key: crypto.randomUUID(),
    value: crypto.randomUUID(),
  };
}

describe("freeContainer", () => {
  describe("set()", () => {
    it("succeeds if no matched key", () => {
      const {
        key,
        value,
      } = generateRandomKeyValue();
      freeContainer.set(key, value);
      expect(freeContainer[key]).toBe(value);
    });
    it("throws if key exists", () => {
      const {
        key,
        value,
      } = generateRandomKeyValue();
      freeContainer.set(key, value);
      expect(freeContainer[key]).toBe(value);
      expect(() => freeContainer.set(key, "anotherValue")).throws(`value of ${key} is already set. token is required to overwrite it.`);
    });
    it("throws if token is invalid", () => {
      const {
        key,
        value,
      } = generateRandomKeyValue();
      freeContainer.set(key, value);
      expect(freeContainer[key]).toBe(value);
      expect(() => freeContainer.set(key, "anotherValue", "no-match")).throws(`token:no-match for key:${key} is invalid`);
    });
    it("succeeds if key and token are valid", () => {
      const {
        key,
        value,
      } = generateRandomKeyValue();
      const token = freeContainer.set(key, value);
      expect(freeContainer[key]).toBe(value);
      freeContainer.set(key, "anotherValue", token);
      expect(freeContainer[key]).toBe("anotherValue");
    });
  });
  describe("delete()", () => {
    it("succeeds if no matched key", () => {
      const {
        key,
        value,
      } = generateRandomKeyValue();
      freeContainer.set(key, value);
      expect(freeContainer[key]).toBe(value);
      freeContainer.delete("no-matched-key", "no-matched-token");
      expect(freeContainer[key]).toBe(value);
    });
    it("succeeds if token is invalid, key will be not deleted", () => {
      const {
        key,
        value,
      } = generateRandomKeyValue();
      freeContainer.set(key, value);
      expect(freeContainer[key]).toBe(value);
      freeContainer.delete(key, "no-matched-token");
      expect(freeContainer[key]).toBe(value);
    });
    it("succeeds if key and token are valid, key will be deleted", () => {
      const {
        key,
        value,
      } = generateRandomKeyValue();
      const token = freeContainer.set(key, value);
      expect(freeContainer[key]).toBe(value);
      freeContainer.delete(key, token);
      expect(freeContainer[key]).toBeUndefined();
    });
  });
  describe("getting property", () => {
    it("can get item", () => {
      const {
        key,
        value,
      } = generateRandomKeyValue();
      const token = freeContainer.set(key, value);
      expect(freeContainer[key]).toBe(value);
    });
  });
  describe("setting property affects nothing", () => {
    it("the value will be not changed", () => {
      const {
        key,
        value,
      } = generateRandomKeyValue();
      const token = freeContainer.set(key, value);
      expect(freeContainer[key]).toBe(value);
      freeContainer[key] = "anotherValue";
      expect(freeContainer[key]).toBe(value);
    });
  });
});
