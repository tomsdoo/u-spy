import { describe, it, expect } from "vitest";
import { styleMinify } from "./style-minify";

describe("styleMinify()", () => {
  const plugin = styleMinify();

  it.each([
    {
      path: "src/components/log/list/template.ts",
      content: `
      <div></div>
      <style>
      .test-block {
        color: red;
      }
      </style>
      `,
      expectedOutputContent: `
      <div></div>
      <style> .test-block { color: red; } </style>
      `,
    },
    {
      path: "src/components/dialog/template.ts",
      content: `
      <div></div>
      <style>
      .test-block {
        color: red;
      }
      </style>
      `,
      expectedOutputContent: `
      <div></div>
      <style> .test-block { color: red; } </style>
      `
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
    expect(plugin.transform?.("test", "notATargetFilePath")).toBeNull();
  });
});
