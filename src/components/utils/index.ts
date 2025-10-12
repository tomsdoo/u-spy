import { EntryPointElement } from "@/components/entry-point";

const TAG_NAME = "u-spy-utils";

const logTimeFormatter = new Intl.DateTimeFormat("en-US", {
  hour12: false,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  fractionalSecondDigits: 3,
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
});

function download({
  data,
  filename,
}: {
  data: string | object;
  filename: string;
}) {
  const BOM = new Uint8Array([0xef, 0xbb, 0xbf]);
  const blob =
    typeof data === "string"
      ? new Blob([BOM, data], { type: "text/plain" })
      : new Blob([BOM, JSON.stringify(data, null, 2)], {
          type: "application/json",
        });
  const url = URL.createObjectURL(blob);
  const anc = document.body.appendChild(document.createElement("a"));
  anc.setAttribute("download", filename);
  anc.setAttribute("href", url);
  anc.click();
  anc.remove();
}

function loadScript(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const scriptTag = document.createElement("script");
    scriptTag.src = src;
    scriptTag.addEventListener("load", () => {
      resolve(src);
    });
    scriptTag.addEventListener("error", (e) => {
      reject(e);
    });
    document.head.appendChild(scriptTag);
  });
}

async function loadPrettier() {
  return Promise.all([
    loadScript("https://unpkg.com/prettier@3.5.3/standalone.js"),
    loadScript("https://unpkg.com/prettier@3.5.3/plugins/postcss.js"),
    loadScript("https://unpkg.com/prettier@3.5.3/plugins/estree.js"),
    loadScript("https://unpkg.com/prettier@3.5.3/plugins/typescript.js"),
  ]);
}

async function prettierFormat(text: string, parser: string): Promise<string> {
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

export class UtilsElement extends HTMLElement {
  static TAG_NAME = TAG_NAME;

  formatTime(dateValue: Date) {
    return logTimeFormatter.format(dateValue);
  }

  download({ data, filename }: { data: string | object; filename: string }) {
    return download({ data, filename });
  }

  prettierFormat(text: string, parser: string) {
    return prettierFormat(text, parser);
  }

  static create() {
    const ele = document.createElement(UtilsElement.TAG_NAME);
    ele.style.display = "none";
    EntryPointElement.ensure().appendChild(ele);
    return ele as UtilsElement;
  }
  static ensure() {
    const existing = document.querySelector<UtilsElement>(
      UtilsElement.TAG_NAME,
    );
    if (existing != null) {
      return existing;
    }
    return UtilsElement.create();
  }
}

try {
  globalThis.customElements.define(TAG_NAME, UtilsElement);
} catch {}
