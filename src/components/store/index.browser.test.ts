import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  type MockInstance,
  vi,
} from "vitest";
import { ensureStore, getStoreIds, StoreElement } from "@/components/store/";

describe("store", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  describe("getStoreIds", () => {
    let spy: MockInstance;
    beforeEach(() => {
      spy = vi.spyOn(StoreElement.prototype, "freeData", "get").mockReturnValue(
        new Map([
          [
            "dummyKey1",
            {
              _onChangeHandlers: [],
              onChange() {},
              offChange() {},
            },
          ],
          [
            "dummyKey2",
            {
              _onChangeHandlers: [],
              onChange() {},
              offChange() {},
            },
          ],
        ]),
      );
    });
    afterEach(() => {
      vi.restoreAllMocks();
    });
    it("returns correct value", () => {
      expect(getStoreIds()).toEqual(["dummyKey1", "dummyKey2"]);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  it("ensureStore", () => {
    const spyStoreEnsure = vi.spyOn(StoreElement, "ensure");
    expect(getStoreIds()).toHaveLength(0);
    expect(spyStoreEnsure).toHaveBeenCalledTimes(1);
    ensureStore("dummyId1");
    expect(spyStoreEnsure).toHaveBeenCalledTimes(2);
    expect(getStoreIds()).toHaveLength(1);
    expect(spyStoreEnsure).toHaveBeenCalledTimes(3);
  });
});
