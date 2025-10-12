import { loadScript } from "@/utils";

async function loadPrettier() {
  return Promise.all([
    loadScript("https://unpkg.com/prettier@3.5.3/standalone.js"),
    loadScript("https://unpkg.com/prettier@3.5.3/plugins/postcss.js"),
    loadScript("https://unpkg.com/prettier@3.5.3/plugins/estree.js"),
    loadScript("https://unpkg.com/prettier@3.5.3/plugins/typescript.js"),
  ]);
}

export async function prettierFormat(
  text: string,
  parser: string,
): Promise<string> {
  try {
    await loadPrettier();
    // @ts-expect-error prettier cannot be found since it will be loaded dynamically
    return prettier.format(text, { parser, plugins: prettierPlugins });
  } catch (_) {
    function getNewLineChar(nl: number = 10) {
      return String.fromCharCode(nl);
    }
    const formatted = text
      .replace(/;\s*/g, `;${getNewLineChar()}`)
      .replace(/\s+{\s*/g, ` {${getNewLineChar()}`)
      .replace(/\s*}\s*/g, `${getNewLineChar()}}${getNewLineChar()}`);
    const lines = formatted.split(/\n/);
    const nextLines: string[] = [];
    const indentChars: string[] = [];
    for (const line of lines) {
      if (line.replace(/\s/g, "") === "") {
        continue;
      }
      const isClose = /}/.test(line);
      if (isClose) {
        indentChars.splice(-2, 2);
      }
      const isOpen = /{/.test(line);
      if (isOpen && nextLines.length > 0) {
        nextLines.push("");
      }
      nextLines.push(`${indentChars.join("")}${line}`);
      if (isOpen) {
        indentChars.splice(-1, 0, " ", " ");
      }
    }
    return nextLines.join(getNewLineChar()) + getNewLineChar();
  }
}
