import { beforeEach, describe, expect, it } from "vitest";
import { download } from "@/utils/download";

describe("download()", () => {
  it.each([
    {
      type: "string",
      data: "test data",
    },
    {
      type: "object",
      data: {
        test: 1,
      },
    },
  ])("download() type: $type", ({ data }) => {
    const FILENAME = "dummyFileName";
    const observer = new MutationObserver((mutationList) => {
      for (const mutation of mutationList) {
        if (mutation.type !== "childList") {
          continue;
        }
        for (const addedNode of Array.from(mutation.addedNodes)) {
          if (
            ((addedNode): addedNode is HTMLAnchorElement =>
              /a/i.test(addedNode.nodeName))(addedNode) === false
          ) {
            continue;
          }

          expect(addedNode.getAttribute("download")).toBe(FILENAME);
          observer.disconnect();
        }
      }
    });
    observer.observe(document.body, { childList: true });
    download({ data, filename: FILENAME });
  });
});
