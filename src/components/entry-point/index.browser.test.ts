import { beforeEach, describe, it, expect, vi } from "vitest";
import { EntryPointElement } from "@/components/entry-point";

const {
  dummyName,
  dummyVersion,
} = vi.hoisted(() => ({
  dummyName: "dummyName",
  dummyVersion: "dummyVersion",
}));

vi.mock("@@/package.json", () => ({
  name: dummyName,
  version: dummyVersion,
}));

describe("EntryPointElement", () => {
  beforeEach(() => {
    document.body.innerHTML ="";
  });
  it("renders correctly", () => {
    const entryPointElement = document.body.appendChild(
      document.createElement(EntryPointElement.TAG_NAME),
    );
    expect(entryPointElement.shadowRoot).toSatisfy(({ innerHTML }) => {
      const matched = innerHTML.match(/dummyName@dummyVersion/);
      return matched != null;
    });
  });
  describe("ensure", () => {
    it("element will be returned as regardless of the tag already exists or nor", () => {
      const element = EntryPointElement.ensure();
      expect(element).toHaveProperty("nodeName", EntryPointElement.TAG_NAME.toUpperCase());
      const element2 = EntryPointElement.ensure();
      expect(element === element2).toBe(true);
    });
  });
});
