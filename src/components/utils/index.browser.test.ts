import { beforeEach, describe, expect, it, vi } from "vitest";
import { UtilsElement } from "@/components/utils";

const { spyDateTimeFormatResolvedOptions } = vi.hoisted(() => {
  const spyDateTimeFormatResolvedOptions = vi
    .spyOn(Intl.DateTimeFormat.prototype, "resolvedOptions")
    .mockReturnValue({
      locale: "ja",
      calendar: "gregory",
      numberingSystem: "latn",
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  return {
    spyDateTimeFormatResolvedOptions,
  };
});

describe("UtilsElement", () => {
  beforeEach(() => {
    document.body.appendChild(document.createElement(UtilsElement.TAG_NAME));
  });
  it("formatTime()", () => {
    const formattedTime = UtilsElement.ensure().formatTime(
      new Date("2025-01-01T12:34:56.789+09:00"),
    );
    expect(formattedTime).toBe("12:34:56.789");
    expect(spyDateTimeFormatResolvedOptions).toHaveBeenCalledTimes(1);
  });
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
    UtilsElement.ensure().download({ data, filename: FILENAME });
  });
  it("replaceContent()", () => {
    document.body.innerHTML = `
    <header>
      <h1>header text toBeLinkText</h1>
    </header>
    <article>
      <section>
        <div data-test-id="test1">
          this is a test toBeReplaced this is a test
        </div>
        <div data-test-id="test2">
          this is a test2 toBeReplaced this is a test2
        </div>
      </section>
    </article>
    `;
    UtilsElement.ensure().replaceContent("*", [
      (s) =>
        s.replace(/toBeLinkText/g, ($0) => `<a href="https://${$0}">${$0}</a>`),
      (s) => s.replace(/toBeReplaced/g, "!!!replaced!!!"),
    ]);
    expect(document.querySelector("header > h1 > a")).toSatisfy((anchor) => {
      expect(anchor).not.toBeNull();
      expect(anchor.getAttribute("href")).toBe("https://toBeLinkText");
      expect(anchor).toHaveProperty("textContent", "toBeLinkText");
      return true;
    });
    expect(document.querySelector("[data-test-id='test1']")).toSatisfy((el) => {
      expect(el.textContent.trim()).toBe(
        "this is a test !!!replaced!!! this is a test",
      );
      return true;
    });
    expect(document.querySelector("[data-test-id='test2']")).toSatisfy((el) => {
      expect(el.textContent.trim()).toBe(
        "this is a test2 !!!replaced!!! this is a test2",
      );
      return true;
    });
  });
  describe("prettierFormat()", () => {
    describe("when can load script", () => {
      it("can proceed", async () => {
        const result = await UtilsElement.ensure().prettierFormat(
          ".some { display: grid; }",
          "css",
        );
        expect(result).toBe(".some {\n  display: grid;\n}\n");
      });
    });
    describe("when cannot load script", () => {
      beforeEach(() => {
        vi.spyOn(document.head, "appendChild").mockImplementation(
          (scriptTag) => {
            scriptTag.dispatchEvent(new Event("error"));
            return scriptTag;
          },
        );
      });
      it("can proceed", async () => {
        const result = await UtilsElement.ensure().prettierFormat(
          ".some { display: grid; .other { display: grid; }}",
          "css",
        );
        expect(result).toBe(
          ".some {\n  display: grid;\n\n  .other {\n    display: grid;\n  }\n}\n",
        );
      });
    });
  });
});
