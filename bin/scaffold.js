import { exec as _exec } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { promisify } from "node:util";

const exec = promisify(_exec);

const DEFINED_SCAFFOLD_TYPES = ["chrome-extension"];

async function logWithStatus(title, callback) {
  process.stdout.write(title);
  await callback();
  process.stdout.write(`✅\n`);
}

function logBlankLine() {
  process.stdout.write("\n");
}

export async function scaffold(packageVersion) {
  const scaffoldType = (() => {
    const [_command, scaffoldType] = process.argv.slice(2);
    return scaffoldType || "chrome-extension";
  })();

  process.stdout.write(
    `🌱 Scaffolding a new project of type: ${scaffoldType}\n`,
  );
  if (!DEFINED_SCAFFOLD_TYPES.includes(scaffoldType)) {
    process.stderr.write(`Unknown scaffold type: ${scaffoldType}\n`);
    process.exit(1);
  }

  logBlankLine();

  const pathRegExp = new RegExp(`^scaffold/${scaffoldType}/`);

  const tagName = `v${packageVersion}`;
  const {
    object: { url: tagReferenceUrl },
  } = await fetch(
    `https://api.github.com/repos/tomsdoo/u-spy/git/ref/tags/${tagName}`,
  ).then((r) => r.json());
  const {
    object: { url: tagCommitUrl },
  } = await fetch(tagReferenceUrl).then((r) => r.json());
  const {
    tree: { url: treeUrl },
  } = await fetch(tagCommitUrl).then((r) => r.json());
  const { tree } = await fetch(`${treeUrl}?recursive=true`).then((r) =>
    r.json(),
  );
  const files = tree
    .filter(({ type }) => type === "blob")
    .filter(({ path }) => pathRegExp.test(path));
  for (const { path } of files) {
    const filePath = path.replace(pathRegExp, "");
    const contentText = await fetch(
      `https://raw.githubusercontent.com/tomsdoo/u-spy/refs/tags/${tagName}/scaffold/${scaffoldType}/${filePath}`,
    ).then((r) => r.text());
    await logWithStatus(`📁 Creating file: ${filePath}... `, async () => {
      const dirPath = dirname(filePath);
      await mkdir(dirPath, { recursive: true });
      await writeFile(filePath, contentText);
    });
  }

  await logWithStatus(
    `📦 Preparing package.json scripts.build... `,
    async () => {
      await exec("npm init -y");
      const packageJson = await readFile("package.json", {
        encoding: "utf8",
      }).then((r) => JSON.parse(r));
      await writeFile(
        "package.json",
        JSON.stringify(
          {
            ...packageJson,
            scripts: {
              ...(packageJson.scripts ?? {}),
              build: "tsup",
            },
          },
          null,
          2,
        ),
      );
    },
  );

  await logWithStatus(`📦 Installing dependencies... `, async () => {
    await exec("npm install -E u-spy");
    await exec("npm install -D -E typescript tsup @tsconfig/node22");
  });

  logBlankLine();

  process.stdout.write(
    `🎉 Scaffolding complete 🎉 Run "npm run build" to build the project 🚀\n`,
  );
  process.stdout.write(`\n`);
  await new Promise((resolve) => setTimeout(resolve, 100));
  for (const char of "npm run build".split("")) {
    process.stdout.write(char);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  process.stdout.write(` 🚀🚀\n\n`);
}
