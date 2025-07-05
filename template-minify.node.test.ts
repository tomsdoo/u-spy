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

describe("styleMinify()", () => {
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
    [
      "template.ts",
      `
      \tthis is
       a test 
      `,
      ` this is a test `,
    ],
  ])("file: %s, content: %s", async (path, content, expectedOputputContent) => {
    vi.mocked(readFile).mockResolvedValue(content);
    await expect(transform({
      path,
    })).resolves.toEqual({
      contents: expectedOputputContent,
      loader: "ts",
    });
  });
});
