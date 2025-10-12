import { describe, expect, it, vi } from "vitest";
import { replaceContent } from "@/utils/replace-content";

describe("replaceContent()", () => {
  it("replaces correctly", () => {
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
    replaceContent("*", [
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

});
