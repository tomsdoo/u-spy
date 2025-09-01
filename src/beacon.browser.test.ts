import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { interceptSendBeacon } from "@/beacon";
import { ControlElement } from "@/components/control-element";

const { spySendBeacon, controlId, dummyUrl, dummyData } = vi.hoisted(() => ({
  spySendBeacon: vi.fn(),
  controlId: "control-id",
  dummyUrl: "http://dummy.com",
  dummyData: "dummyData",
}));

describe("interceptSendBeacon", () => {
  beforeEach(() => {
    vi.spyOn(globalThis.navigator, "sendBeacon").mockImplementation(
      spySendBeacon,
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("intercept and restore", () => {
    const spyEnsure = vi.spyOn(ControlElement, "ensure");
    const { restoreSendBeacon } = interceptSendBeacon(controlId);

    navigator.sendBeacon(dummyUrl, dummyData);
    expect(spyEnsure).toHaveBeenCalledTimes(1);
    expect(spyEnsure).toHaveBeenCalledWith(controlId);
    expect(spySendBeacon).toHaveBeenCalledTimes(1);
    expect(spySendBeacon).toHaveBeenCalledWith(dummyUrl, dummyData);

    restoreSendBeacon();

    navigator.sendBeacon(dummyUrl, dummyData);
    expect(spyEnsure).toHaveBeenCalledTimes(1);
    expect(spySendBeacon).toHaveBeenCalledTimes(2);
    expect(spySendBeacon).toHaveBeenCalledWith(dummyUrl, dummyData);
  });
});
