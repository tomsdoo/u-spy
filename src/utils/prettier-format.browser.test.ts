import { beforeEach, describe, expect, it, vi } from "vitest";
import { loadScript } from "@/utils";
import { prettierFormat } from "@/utils/prettier-format";

vi.mock("@/utils/load-script");

describe("prettierFormat()", () => {
  describe("when can load script", () => {
    it("can proceed", async () => {
      const result = await prettierFormat(".some { display: grid; }", "css");
      expect(result).toBe(".some {\n  display: grid;\n}\n");
    });
  });
  describe("when cannot load script", () => {
    beforeEach(() => {
      vi.mocked(loadScript).mockRejectedValue(new Error("error"));
    });
    it("can proceed", async () => {
      const result = await prettierFormat(
        ".some { display: grid; .other { display: grid; }}",
        "css",
      );
      expect(result).toBe(
        ".some {\n  display: grid;\n\n  .other {\n    display: grid;\n  }\n}\n",
      );
    });
  });
});
