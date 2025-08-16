import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import { interceptFetch } from "@/fetch";
import { ControlElement } from "@/components/control-element";

const {
  spyFetch,
  controlId,
  dummyUrl,
  dummyData,
  dummyData2,
} = vi.hoisted(() => ({
  spyFetch: vi.fn(async () => await new Response(JSON.stringify({ value: "dummyResponse" }))),
  controlId: "control-id",
  dummyUrl: "http://dummy.com",
  dummyData: "dummyData",
  dummyData2: "dummyData2",
}));

describe("interceptFetch", () => {
  beforeEach(() => {
    vi.spyOn(globalThis, "fetch").mockImplementation(spyFetch);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("intercept and restore", async () => {
    const spyEnsure = vi.spyOn(ControlElement, "ensure");
    const {
      restoreFetch,
    } = interceptFetch(controlId, [
        async (input: RequestInfo | URL) => await Promise.resolve(null),
      ],
    );
    await fetch(dummyUrl, {
      method: "POST",
      body: dummyData,
    });
    expect(spyEnsure).toHaveBeenCalledTimes(1);
    expect(spyEnsure).toHaveBeenCalledWith(controlId);
    expect(spyFetch).toHaveBeenCalledTimes(1);
    expect(spyFetch).toHaveBeenNthCalledWith(1, dummyUrl, {
      method: "POST",
      body: dummyData,
    });

    restoreFetch();

    await fetch(dummyUrl, {
      method: "POST",
      body: dummyData2,
    });
    expect(spyEnsure).toHaveBeenCalledTimes(1);
    expect(spyFetch).toHaveBeenCalledTimes(2);
    expect(spyFetch).toHaveBeenNthCalledWith(2, dummyUrl, {
      method: "POST",
      body: dummyData2,
    });
  });
});

