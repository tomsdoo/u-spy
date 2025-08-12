import { beforeEach, describe, it, expect, vi } from "vitest";
import { templateMinify } from "./template-minify";
import { readFile } from "fs/promises";

vi.mock("fs/promises", async () => {
  const originalModule = await vi.importActual("fs/promises");
  return {
    ...originalModule,
    readFile: vi.fn(),
  };
});

describe("templateMinify()", () => {
  let transform: (args: any) => Promise<
    { contents: string; loader: string; } | null
  >;
  beforeEach(() => {
    const { setup } = templateMinify();
    setup({
      onLoad(options, innerTransform) {
        transform = innerTransform;
      },
    });
  });
  it.each([
    {
      path: "template.ts",
      content: `
      \tthis is
       a test 
      `,
      expectedOutputContent: ` this is a test `,
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
});
