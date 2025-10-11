#!/usr/bin/env node
import { scaffold } from "./scaffold.js";

function showHelp() {
  console.log([
    "u-spy [command] [...params]",
    "",
    "commands:",
    "\tscaffold",
    "\t\tprepare scaffolding code",
  ].join("\n"));
}

void (async () => {
  const [command] = process.argv.slice(2);

  switch (command) {
    case "scaffold":
      await scaffold();
      process.exit();
    default:
      showHelp();
      process.exit();
  }
})();
