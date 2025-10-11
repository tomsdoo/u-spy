#!/usr/bin/env node
import { mkdir, writeFile, readFile } from "fs/promises";
import { dirname } from "path";
import { promisify } from "util";
import { exec as _exec } from "child_process";
const exec = promisify(_exec);

void (async () => {
  const scaffoldType = (() => {
    const [_command, scaffoldType] = process.argv.slice(2);
    return scaffoldType || "chrome-extension";
  })();
  const pathRegExp = new RegExp(`^scaffold/${scaffoldType}/`);

  const branchName = "scaffold-chrome-extension";
  const { commit: { commit: { tree: { url: treeUrl }}}} = await fetch(`https://api.github.com/repos/tomsdoo/u-spy/branches/${branchName}`).then(r => r.json());
  const { tree }  = await fetch(`${treeUrl}?recursive=true`).then(r => r.json());
  const files = tree.filter(({ type }) => type === "blob").filter(({ path }) => pathRegExp.test(path));
  for (const { path, url } of files) {
    const { encoding, content } = await fetch(url).then(r => r.json());
    if (encoding !== "base64") {
      continue;
    }
    const contentText = atob(content);
    const filePath = path.replace(pathRegExp, "");
    const dirPath = dirname(filePath);
    await mkdir(dirPath, { recursive: true });
    await writeFile(filePath, contentText);
  }
  await exec("npm init -y");
  const packageJson = await readFile("package.json", { encoding: "utf8" }).then(r => JSON.parse(r));
  await writeFile("package.json", JSON.stringify({
    ...packageJson,
    scripts: {
      ...(packageJson.scripts ?? {}),
      build: "tsup",
    },
  }, null, 2));
  packageJson.scripts.build = "tsup";
  await exec("npm install -E u-spy");
  await exec("npm install -D -E typescript tsup @tsconfig/node22");
})();
