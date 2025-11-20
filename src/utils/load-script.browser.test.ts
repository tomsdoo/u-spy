import { afterEach, describe, expect, it, vi } from "vitest";
import { loadScript } from "@/utils/load-script";

const { jsUrl } = vi.hoisted(() => ({
  jsUrl: "http://localhost:3333/dummy.js",
}));

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
    const result = await loadScript(jsUrl);
    expect(result).toBe(jsUrl);
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it("error", async () => {
    const spy = vi
      .spyOn(document.head, "appendChild")
      .mockImplementation((scriptTag) => {
        scriptTag.dispatchEvent(new Event("error"));
        return scriptTag;
      });
    expect(loadScript(jsUrl)).rejects.toThrowError();
    expect(spy).toHaveBeenCalledTimes(1);
  });
  describe.for([
    {
      isAsync: undefined,
    },
    {
      isAsync: true,
    },
    {
      isAsync: false,
    },
  ])("async: $isAsync", ({ isAsync }) => {
    describe.for([
      {
        isDefer: undefined,
      },
      {
        isDefer: true,
      },
      {
        isDefer: false,
      },
    ])("defer: $isDefer", ({ isDefer }) => {
      describe.for([
        {
          type: undefined,
        },
        {
          type: "module",
        },
      ])("type: $type", ({ type }) => {
        it("reflects params correctly", async () => {
          const spy = vi
            .spyOn(document.head, "appendChild")
            .mockImplementation((scriptTag) => {
              expect(scriptTag).toSatisfy(function aa(scriptTag) {
                return (
                  scriptTag.getAttribute("type") === (type ?? null) &&
                  ((scriptTag.getAttribute("async") == null) === isAsync) !==
                    true &&
                  ((scriptTag.getAttribute("defer") == null) === isDefer) !==
                    true &&
                  scriptTag.getAttribute("src") === jsUrl
                );
              });
              scriptTag.dispatchEvent(new Event("load"));
              return scriptTag;
            });
          await loadScript(jsUrl, {
            type,
            async: isAsync,
            defer: isDefer,
          });
          expect(spy).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});
