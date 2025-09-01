import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ControlElement } from "@/components/control-element";

const {
  controlId,
  controlId2,
  dummyOrigin,
  dummyLastEventId,
  dummyUrl,
  dummyData,
  dummyMethod,
  dummyRequestHeaders,
  dummyRequestBody,
  dummyResponseStatus,
  dummyResponseHeaders,
  dummyResponseType,
  dummyResponseUrl,
  dummyReadyState,
  dummyResponseText,
  dummyResponseXML,
  dummyResponse,
} = vi.hoisted(() => ({
  controlId: "control-id",
  controlId2: "control-id2",
  dummyOrigin: "dummyOrigin",
  dummyLastEventId: "dummyLastEventId",
  dummyUrl: "dummyUrl",
  dummyData: "dummyData",
  dummyMethod: "dummyMethod",
  dummyRequestHeaders: {
    "content-type": "application/json",
  } as Record<string, string>,
  dummyRequestBody: "",
  dummyResponseStatus: 200,
  dummyResponseHeaders: {
    "content-type": "application/json",
  } as Record<string, string>,
  dummyResponseType: "json" as const,
  dummyResponseUrl: "dummyResponseUrl",
  dummyReadyState: 4,
  dummyResponseText: "",
  dummyResponseXML: null,
  dummyResponse: new Response(JSON.stringify({ value: 1 })),
}));

describe("ControlElement", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("ensure", () => {
    it("case the element exists and not exists", () => {
      ControlElement.ensure(controlId);
      expect(document.querySelectorAll(ControlElement.TAG_NAME)).toHaveLength(
        1,
      );

      ControlElement.ensure(controlId);
      expect(document.querySelectorAll(ControlElement.TAG_NAME)).toHaveLength(
        1,
      );

      ControlElement.ensure(controlId2);
      expect(document.querySelectorAll(ControlElement.TAG_NAME)).toHaveLength(
        2,
      );
    });
  });

  describe("list", () => {
    it("returns correctly", () => {
      expect(ControlElement.list()).toHaveLength(0);
      ControlElement.ensure(controlId);
      expect(ControlElement.list()).toHaveLength(1);
    });
  });

  describe("beacon event", () => {
    it("on, off", () => {
      const controlElement = ControlElement.ensure(controlId);
      const spyHandler = vi.fn();
      // nop if not registered
      controlElement.off(controlElement.events.BEACON, spyHandler);

      controlElement.on(controlElement.events.BEACON, spyHandler);
      // avoid registering duplicated handlers
      controlElement.on(controlElement.events.BEACON, spyHandler);
      controlElement.dispatchBeacon({
        url: dummyUrl,
        data: dummyData,
      });
      // no actions for fetch
      controlElement.dispatchFetch({
        input: dummyUrl,
        response: dummyResponse,
      });
      expect(spyHandler).toHaveBeenCalledTimes(1);
      expect(spyHandler).toHaveBeenNthCalledWith(1, {
        url: dummyUrl,
        data: dummyData,
      });

      controlElement.off(controlElement.events.BEACON, spyHandler);

      controlElement.dispatchBeacon({
        url: dummyUrl,
        data: dummyData,
      });
      expect(spyHandler).toHaveBeenCalledTimes(1);
    });

    it("logItems", () => {
      const mockedTime = new Date("2025-01-23T12:34:56.789Z");
      vi.spyOn(crypto, "randomUUID").mockReturnValue(
        "dummy-random-universally-unique-identifier",
      );
      vi.useFakeTimers();
      vi.setSystemTime(mockedTime);
      const controlElement = ControlElement.ensure(controlId);
      controlElement.dispatchBeacon({
        url: dummyUrl,
        data: dummyData,
      });
      expect(controlElement.logItems).toEqual([
        {
          id: "log-item-beacon-dummy-random-universally-unique-identifier",
          time: mockedTime,
          type: "beacon",
          data: {
            url: dummyUrl,
            data: dummyData,
          },
        },
      ]);
      vi.useRealTimers();
    });
  });

  describe("fetch event", () => {
    it("on, off", () => {
      const controlElement = ControlElement.ensure(controlId);
      const spyHandler = vi.fn();
      controlElement.on(controlElement.events.FETCH, spyHandler);
      controlElement.dispatchFetch({
        input: dummyUrl,
        response: dummyResponse,
      });
      expect(spyHandler).toHaveBeenCalledTimes(1);
      expect(spyHandler).toHaveBeenNthCalledWith(1, {
        input: dummyUrl,
        response: dummyResponse,
      });

      controlElement.off(controlElement.events.FETCH, spyHandler);

      controlElement.dispatchFetch({
        input: dummyUrl,
        response: dummyResponse,
      });
      expect(spyHandler).toHaveBeenCalledTimes(1);
    });

    it("logItems", () => {
      const mockedTime = new Date("2025-01-23T12:34:56.789Z");
      vi.spyOn(crypto, "randomUUID").mockReturnValue(
        "dummy-random-universally-unique-identifier",
      );
      vi.useFakeTimers();
      vi.setSystemTime(mockedTime);
      const controlElement = ControlElement.ensure(controlId);
      controlElement.dispatchFetch({
        input: dummyUrl,
        response: dummyResponse,
      });
      expect(controlElement.logItems).toEqual([
        {
          id: "log-item-fetch-dummy-random-universally-unique-identifier",
          time: mockedTime,
          type: "fetch",
          data: {
            input: dummyUrl,
            response: dummyResponse,
          },
        },
      ]);
      vi.useRealTimers();
    });
  });

  describe.for([
    {
      eventData: {
        method: dummyMethod,
        url: dummyUrl,
        requestHeaders: dummyRequestHeaders,
        requestBody: dummyRequestBody,
        response: dummyResponse,
        status: dummyResponseStatus,
        responseHeaders: dummyResponseHeaders,
        responseType: dummyResponseType,
        responseURL: dummyResponseUrl,
        readyState: dummyReadyState,
        responseText: dummyResponseText,
        responseXML: dummyResponseXML,
      },
    },
  ])("xhr event", ({ eventData }) => {
    it("on, off", () => {
      const controlElement = ControlElement.ensure(controlId);
      const spyHandler = vi.fn();
      controlElement.on(controlElement.events.XHR_LOAD, spyHandler);
      controlElement.dispatchXhrLoad(eventData);
      expect(spyHandler).toHaveBeenCalledTimes(1);
      expect(spyHandler).toHaveBeenNthCalledWith(1, eventData);

      controlElement.off(controlElement.events.XHR_LOAD, spyHandler);

      controlElement.dispatchXhrLoad(eventData);
      expect(spyHandler).toHaveBeenCalledTimes(1);
    });

    it("logItems", () => {
      const mockedTime = new Date("2025-01-23T12:34:56.789Z");
      vi.spyOn(crypto, "randomUUID").mockReturnValue(
        "dummy-random-universally-unique-identifier",
      );
      vi.useFakeTimers();
      vi.setSystemTime(mockedTime);
      const controlElement = ControlElement.ensure(controlId);
      controlElement.dispatchXhrLoad(eventData);
      expect(controlElement.logItems).toEqual([
        {
          id: "log-item-xhr-dummy-random-universally-unique-identifier",
          time: mockedTime,
          type: "xhr",
          data: eventData,
        },
      ]);
      vi.useRealTimers();
    });
  });

  describe("window message event", () => {
    it("on, off", () => {
      const controlElement = ControlElement.ensure(controlId);
      const spyHandler = vi.fn();
      controlElement.on(controlElement.events.WINDOW_MESSAGE, spyHandler);
      controlElement.dispatchWindowMessage({
        data: dummyData,
        origin: dummyOrigin,
        lastEventId: dummyLastEventId,
      });
      expect(spyHandler).toHaveBeenCalledTimes(1);
      expect(spyHandler).toHaveBeenNthCalledWith(1, {
        data: dummyData,
        origin: dummyOrigin,
        lastEventId: dummyLastEventId,
      });

      controlElement.off(controlElement.events.WINDOW_MESSAGE, spyHandler);

      controlElement.dispatchWindowMessage({
        data: dummyData,
        origin: dummyOrigin,
        lastEventId: dummyLastEventId,
      });
      expect(spyHandler).toHaveBeenCalledTimes(1);
    });

    it("logItems", () => {
      const mockedTime = new Date("2025-01-23T12:34:56.789Z");
      vi.spyOn(crypto, "randomUUID").mockReturnValue(
        "dummy-random-universally-unique-identifier",
      );
      vi.useFakeTimers();
      vi.setSystemTime(mockedTime);
      const controlElement = ControlElement.ensure(controlId);
      controlElement.dispatchWindowMessage({
        data: dummyData,
        origin: dummyOrigin,
        lastEventId: dummyLastEventId,
      });
      expect(controlElement.logItems).toEqual([
        {
          id: "log-item-window-message-dummy-random-universally-unique-identifier",
          time: mockedTime,
          type: "windowMessage",
          data: {
            data: dummyData,
            origin: dummyOrigin,
            lastEventId: dummyLastEventId,
          },
        },
      ]);
      vi.useRealTimers();
    });
  });
});
