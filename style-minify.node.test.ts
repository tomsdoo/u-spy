import { beforeEach, describe, it, expect, vi } from "vitest";
import { styleMinify } from "./style-minify";
import { readFile } from "fs/promises";

vi.mock("fs/promises", async () => {
  const originalModule = await vi.importActual("fs/promises");
  return {
    ...originalModule,
    readFile: vi.fn(),
  };
});

describe("styleMinify()", () => {
  let transform: (args: any) => Promise<
    { contents: string; loader: string; } | null
  >;
  beforeEach(() => {
    const { setup } = styleMinify();
    setup({
      onLoad(options, innerTransform) {
        transform = innerTransform;
      },
    });
  });
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
      vi.mocked(readFile).mockResolvedValue(content);
      await expect(transform({
        path,
      })).resolves.toEqual({
        contents: expectedOutputContent,
        loader: "ts",
      });
    },
  );
  it("resolves as null if not a target", async () => {
    vi.mocked(readFile).mockResolvedValue("test");
    await expect(transform({
      path: "notATargetFilePath",
    })).resolves.toBeNull();
  });
});
