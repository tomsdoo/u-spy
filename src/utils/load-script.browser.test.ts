import { afterEach, describe, expect, it, vi } from "vitest";
import { loadScript } from "@/utils/load-script";

describe("loadScript()", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("success", async () => {
    const spy = vi
      .spyOn(document.head, "appendChild")
      .mockImplementation((scriptTag) => {
        scriptTag.dispatchEvent(new Event("load"));
        return scriptTag;
      });
    const result = await loadScript("http://localhost:3333/dummy.js");
    expect(result).toBe("http://localhost:3333/dummy.js");
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it("error", async () => {
    const spy = vi
      .spyOn(document.head, "appendChild")
      .mockImplementation((scriptTag) => {
        scriptTag.dispatchEvent(new Event("error"));
        return scriptTag;
      });
    expect(loadScript("http://localhost:3333/dummy.js")).rejects.toThrowError();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
