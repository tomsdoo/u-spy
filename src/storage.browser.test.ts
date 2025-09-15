import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { storage } from "@/storage";

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {});

  describe("delete()", () => {
    it("succeeds if no matched key", () => {
      expect(localStorage.length).toBe(0);
      storage.delete("dummy");
      expect(localStorage.length).toBe(0);
    });
    it("succeeds if matched key existed", () => {
      localStorage.setItem("dummy", "dummy");
      localStorage.setItem("uss_dummy", "dummy");
      expect(localStorage.length).toBe(2);
      storage.delete("dummy");
      expect(localStorage.length).toBe(1);
    });
  });

  describe("keys", () => {
    it("is an array of keys", () => {
      localStorage.setItem("uss_dummy", "dummy");
      expect(storage.keys).toSatisfy((keys) => {
        if (Array.isArray(keys) === false) {
          return false;
        }
        return keys.every((key) => typeof key === "string");
      });
    });
    it("prefix is not added", () => {
      localStorage.setItem("uss_dummy", "dummyData");
      localStorage.setItem("dummy2", "dummy2");
      expect(storage.keys).toEqual(["dummy"]);
    });
  });

  describe("getting property", () => {
    it("can get value", () => {
      localStorage.setItem("uss_dummy", "dummyData");
      expect(storage.dummy).toBe("dummyData");
    });
  });
  describe("setting property", () => {
    it("can set value", () => {
      localStorage.setItem("uss_dummy", "dummyData");
      expect(storage.keys).toHaveLength(1);
      storage.dummy = "dummyDataUpdated";
      expect(storage.keys).toHaveLength(1);
      expect(localStorage.getItem("uss_dummy")).toBe("dummyDataUpdated");
      expect(storage.dummy).toBe("dummyDataUpdated");
    });
    it("affects nothing if prop is reserved", () => {
      localStorage.setItem("uss_dummy", "dummyData");
      expect(storage.keys).toHaveLength(1);
      storage.keys = "dummyDelete";
      expect(storage.keys).toHaveLength(1);
    });
  });
});
