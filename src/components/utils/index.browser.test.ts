import { beforeEach, describe, expect, it, vi } from "vitest";
import { UtilsElement } from "@/components/utils";

describe("UtilsElement", () => {
  beforeEach(() => {
    document.body.appendChild(document.createElement(UtilsElement.TAG_NAME));
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
