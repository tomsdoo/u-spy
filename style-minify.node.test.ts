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
    [
      "src/components/log/list/template.ts",
      `
      <div></div>
      <style>
      .test-block {
        color: red;
      }
      </style>
      `,
      `
      <div></div>
      <style> .test-block { color: red; } </style>
      `,
    ],
    [
      "src/components/dialog/template.ts",
      `
      <div></div>
      <style>
      .test-block {
        color: red;
      }
      </style>
      `,
      `
      <div></div>
      <style> .test-block { color: red; } </style>
      `
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
  it("resolves as null if not a target", async () => {
    vi.mocked(readFile).mockResolvedValue("test");
    await expect(transform({
      path: "notATargetFilePath",
    })).resolves.toBeNull();
  });
});
