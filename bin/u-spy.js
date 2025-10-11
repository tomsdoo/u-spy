#!/usr/bin/env node
import packageJson from "../package.json" with { type: "json" };
import { scaffold } from "./scaffold.js";

function showHelp() {
  console.log(
    [
      `u-spy@${packageJson.version}`,
      "",
      "u-spy [command] [...params]",
      "",
      "commands:",
      "\tscaffold",
      "\t\tprepare scaffolding code",
    ].join("\n"),
  );
}

void (async () => {
  const [command] = process.argv.slice(2);

  switch (command) {
    case "scaffold":
      await scaffold(packageJson.version);
      return;
    default:
      showHelp();
      return;
  }
})().finally(() => {
  process.exit();
});
