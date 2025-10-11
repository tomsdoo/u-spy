#!/usr/bin/env node
import { mkdir, writeFile, readFile } from "fs/promises";
import { dirname } from "path";
import { promisify } from "util";
import { exec as _exec } from "child_process";
const exec = promisify(_exec);

const DEFINED_SCAFFOLD_TYPES = ["chrome-extension"];

void (async () => {
  const scaffoldType = (() => {
    const [_command, scaffoldType] = process.argv.slice(2);
    return scaffoldType || "chrome-extension";
  })();

  process.stdout.write(`🌱 Scaffolding a new project of type: ${scaffoldType}\n\n`);
  if (!DEFINED_SCAFFOLD_TYPES.includes(scaffoldType)) {
    process.stderr.write(`Unknown scaffold type: ${scaffoldType}\n`);
    process.exit(1);
  }

  const pathRegExp = new RegExp(`^scaffold/${scaffoldType}/`);

  const branchName = "scaffold-chrome-extension";
  const { commit: { commit: { tree: { url: treeUrl }}}} = await fetch(`https://api.github.com/repos/tomsdoo/u-spy/branches/${branchName}`).then(r => r.json());
  const { tree }  = await fetch(`${treeUrl}?recursive=true`).then(r => r.json());
  const files = tree.filter(({ type }) => type === "blob").filter(({ path }) => pathRegExp.test(path));
  for (const { path } of files) {
    const filePath = path.replace(pathRegExp, "");
    const contentText = await fetch(`https://raw.githubusercontent.com/tomsdoo/u-spy/refs/heads/${branchName}/scaffold/${scaffoldType}/${filePath}`).then(r => r.text());
    process.stdout.write(`📁 Creating file: ${filePath}... `);
    const dirPath = dirname(filePath);
    await mkdir(dirPath, { recursive: true });
    await writeFile(filePath, contentText);
    process.stdout.write(`✅\n`);
  }

  process.stdout.write(`📦 Preparing package.json scripts.build... `);
  await exec("npm init -y");
  const packageJson = await readFile("package.json", { encoding: "utf8" }).then(r => JSON.parse(r));
  await writeFile("package.json", JSON.stringify({
    ...packageJson,
    scripts: {
      ...(packageJson.scripts ?? {}),
      build: "tsup",
    },
  }, null, 2));
  process.stdout.write(`✅\n`);
  process.stdout.write(`📦 Installing dependencies... `);
  await exec("npm install -E u-spy");
  await exec("npm install -D -E typescript tsup @tsconfig/node22");
  process.stdout.write(`✅\n`);
  process.stdout.write(`\n`);
  process.stdout.write(`Scaffolding complete🎉 Run "npm run build" to build the project🚀\n`);
  process.stdout.write(`\n`);
  await new Promise(resolve => setTimeout(resolve, 100));
  for (const char of ("npm run build").split("")) {
    process.stdout.write(char);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  process.stdout.write(`🚀🚀\n\n`);
})();
