import { describe, it, expect } from "vitest";
import { templateMinify } from "./template-minify";

describe("templateMinify()", () => {
  const plugin = templateMinify();

  it.each([
    {
      path: "src/components/any/template.ts",
      content: `
      \tthis is
       a test 
      `,
      expectedOutputContent: ` this is a test `,
    },
  ])(
    "file: $path, content: $content",
    async ({ path, content, expectedOutputContent }) => {
      expect(plugin.transform?.(content, path)).toEqual({
        code: expectedOutputContent,
      });
    },
  );

  it("resolves as null if not a target", async () => {
    expect(plugin.transform?.("const a = 1", "src/index.ts")).toBeNull();
  });
});
