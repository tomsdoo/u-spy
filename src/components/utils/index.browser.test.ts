import { beforeEach, describe, it, expect } from "vitest";
import { UtilsElement } from "@/components/utils";
import { FILE } from "dns";

describe("UtilsElement", () => {
  beforeEach(() => {
    document.body.appendChild(document.createElement(UtilsElement.TAG_NAME));
  });
  it("formatTime()", () => {
    const formattedTime = UtilsElement.ensure().formatTime(new Date("2025-01-01T12:34:56.789+09:00"));
    expect(formattedTime).toBe("12:34:56.789");
  });
  it("download()", () => {
    const FILENAME = "dummyFileName";
    const observer = new MutationObserver((mutationList) => {
      for(const mutation of mutationList) {
        if (mutation.type !== "childList") {
          continue;
        }
        for (const addedNode of Array.from(mutation.addedNodes)) {
          if (
            ((addedNode): addedNode is HTMLAnchorElement => /a/i.test(addedNode.nodeName))(addedNode) === false
          ) {
            continue;
          }
          
          expect(addedNode.getAttribute("download")).toBe(FILENAME);
          observer.disconnect();
        }
      }
    });
    observer.observe(document.body, { childList: true });
    UtilsElement.ensure().download({data: { test: 1 }, filename: FILENAME });
  });
});

