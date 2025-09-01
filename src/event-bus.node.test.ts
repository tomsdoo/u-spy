import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { eventBus } from "@/event-bus";

const { DUMMY_EVENT, dummyData, dummyData2, spy } = vi.hoisted(() => ({
  DUMMY_EVENT: "dummy-event",
  dummyData: {
    value: "dummyValue",
  },
  dummyData2: {
    value: "dummyValue2",
  },
  spy: vi.fn(),
}));

describe("eventBus", () => {
  describe("on", () => {
    beforeEach(() => {
      eventBus.clear();
      eventBus.on(DUMMY_EVENT, spy);
    });
    afterEach(() => {
      vi.clearAllMocks();
    });
    it("not calls callback if no handlers are registered", () => {
      eventBus.clear();
      eventBus.emit(DUMMY_EVENT, dummyData);
      expect(spy).toHaveBeenCalledTimes(0);
    });
    it("calls callback", () => {
      eventBus.emit(DUMMY_EVENT, dummyData);
      expect(spy).toHaveBeenCalledTimes(1);
      eventBus.emit(DUMMY_EVENT, dummyData2);
      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenNthCalledWith(1, dummyData);
      expect(spy).toHaveBeenNthCalledWith(2, dummyData2);
    });
  });

  describe("once", () => {
    beforeEach(() => {
      eventBus.clear();
      eventBus.once(DUMMY_EVENT, spy);
    });
    afterEach(() => {
      vi.clearAllMocks();
    });
    it("calls callback once", () => {
      eventBus.emit(DUMMY_EVENT, dummyData);
      expect(spy).toHaveBeenCalledTimes(1);
      eventBus.emit(DUMMY_EVENT, dummyData2);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenNthCalledWith(1, dummyData);
    });
  });

  describe("off", () => {
    beforeEach(() => {
      eventBus.clear();
      eventBus.on(DUMMY_EVENT, spy);
    });
    afterEach(() => {
      vi.clearAllMocks();
    });
    describe("not calls callback if off has been called", () => {
      it("case if some handlers are registered", () => {
        eventBus.emit(DUMMY_EVENT, dummyData);
        expect(spy).toHaveBeenCalledTimes(1);

        eventBus.off(DUMMY_EVENT, spy);

        eventBus.emit(DUMMY_EVENT, dummyData2);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenNthCalledWith(1, dummyData);
      });
      it("case no handlers are registered", () => {
        eventBus.clear();

        eventBus.emit(DUMMY_EVENT, dummyData);
        expect(spy).toHaveBeenCalledTimes(0);

        eventBus.off(DUMMY_EVENT, spy);

        eventBus.emit(DUMMY_EVENT, dummyData2);
        expect(spy).toHaveBeenCalledTimes(0);
      });
    });
  });
});
