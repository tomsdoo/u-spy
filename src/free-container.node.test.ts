import { describe, expect, it, vi } from "vitest";
import { freeContainer } from "@/free-container";

function generateRandomKeyValue() {
  return {
    key: crypto.randomUUID(),
    value: crypto.randomUUID(),
  };
}

describe("freeContainer", () => {
  describe("new()", () => {
    it("creates new container", () => {
      const { key, value } = generateRandomKeyValue();
      freeContainer.set(key, value);
      const anotherContainer = freeContainer.new();
      expect(freeContainer[key]).toBe(value);
      expect(anotherContainer[key]).toBeUndefined();
      expect(anotherContainer.keys).toEqual([]);
    });
  });
  describe("set()", () => {
    it("succeeds if no matched key", () => {
      const { key, value } = generateRandomKeyValue();
      freeContainer.set(key, value);
      expect(freeContainer[key]).toBe(value);
    });
    it.each([
      "new",
      "set",
      "delete",
      "keys",
      "subscribe",
      "unsubscribe",
    ])("throws if key is reserved, key: %s", (key) => {
      expect(() => freeContainer.set(key, "dummyValue")).throws(
        `${key} is reserved`,
      );
    });
    it("throws if key exists", () => {
      const { key, value } = generateRandomKeyValue();
      freeContainer.set(key, value);
      expect(freeContainer[key]).toBe(value);
      expect(() => freeContainer.set(key, "anotherValue")).throws(
        `value of ${key} is already set. token is required to overwrite it.`,
      );
    });
    it("throws if token is invalid", () => {
      const { key, value } = generateRandomKeyValue();
      freeContainer.set(key, value);
      expect(freeContainer[key]).toBe(value);
      expect(() => freeContainer.set(key, "anotherValue", "no-match")).throws(
        `token:no-match for key:${key} is invalid`,
      );
    });
    it("succeeds if key and token are valid", () => {
      const { key, value } = generateRandomKeyValue();
      const token = freeContainer.set(key, value);
      expect(freeContainer[key]).toBe(value);
      freeContainer.set(key, "anotherValue", token);
      expect(freeContainer[key]).toBe("anotherValue");
    });
    it("not changed if it is overwritten", () => {
      const originalSet = freeContainer.set;
      function dummySet(_key: string, _value: unknown) {
        return "dummy";
      }
      freeContainer.set = dummySet;
      expect(freeContainer.set).toEqual(originalSet);
    });
  });
  describe("delete()", () => {
    it("succeeds if no matched key", () => {
      const { key, value } = generateRandomKeyValue();
      freeContainer.set(key, value);
      expect(freeContainer[key]).toBe(value);
      freeContainer.delete("no-matched-key", "no-matched-token");
      expect(freeContainer[key]).toBe(value);
    });
    it("succeeds if token is invalid, key will be not deleted", () => {
      const { key, value } = generateRandomKeyValue();
      freeContainer.set(key, value);
      expect(freeContainer[key]).toBe(value);
      freeContainer.delete(key, "no-matched-token");
      expect(freeContainer[key]).toBe(value);
    });
    it("succeeds if key and token are valid, key will be deleted", () => {
      const { key, value } = generateRandomKeyValue();
      const token = freeContainer.set(key, value);
      expect(freeContainer[key]).toBe(value);
      freeContainer.delete(key, token);
      expect(freeContainer[key]).toBeUndefined();
    });
    it("not changed if it is overwritten", () => {
      const originalDelete = freeContainer.delete;
      function dummyDelete(_key: string, _token: string) {}
      freeContainer.delete = dummyDelete;
      expect(freeContainer.delete).toEqual(originalDelete);
    });
  });
  describe("subscribe() and unsubscribe()", () => {
    it("callback is called when value is set", () => {
      const { key, value } = generateRandomKeyValue();
      const spy = vi.fn();
      const unsubscribe = freeContainer.subscribe(key, spy);
      expect(spy).toHaveBeenCalledTimes(0);
      const token = freeContainer.set(key, value);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenNthCalledWith(1, value);
      unsubscribe();
      freeContainer.set(key, value, token);
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it("container.unsubscribe() works correctly", () => {
      const { key, value } = generateRandomKeyValue();
      const spy = vi.fn();
      freeContainer.subscribe(key, spy);
      expect(spy).toHaveBeenCalledTimes(0);
      const token = freeContainer.set(key, value);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenNthCalledWith(1, value);
      freeContainer.unsubscribe(key, spy);
      freeContainer.set(key, value, token);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
  describe("keys", () => {
    it("is an array of keys", () => {
      const { key, value } = generateRandomKeyValue();
      freeContainer.set(key, value);
      expect(freeContainer.keys).toSatisfy((keys) => keys.includes(key));
    });
    it("not changed if it is overwritten", () => {
      const originalKeys = freeContainer.keys;
      const dummyKeys = ["dummy"];
      freeContainer.keys = dummyKeys;
      expect(freeContainer.keys).toEqual(originalKeys);
    });
  });
  describe("getting property", () => {
    it("can get item", () => {
      const { key, value } = generateRandomKeyValue();
      freeContainer.set(key, value);
      expect(freeContainer[key]).toBe(value);
    });
  });
  describe("setting property affects nothing", () => {
    it("the value will be not changed", () => {
      const { key, value } = generateRandomKeyValue();
      freeContainer.set(key, value);
      expect(freeContainer[key]).toBe(value);
      freeContainer[key] = "anotherValue";
      expect(freeContainer[key]).toBe(value);
    });
  });
});
