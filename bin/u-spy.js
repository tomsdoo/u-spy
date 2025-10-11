#!/usr/bin/env node
import { scaffold } from "./scaffold.js";

void (async () => {
  const [command] = process.argv.slice(2);

  switch (command) {
    case "scaffold":
      await scaffold();
      process.exit();
    default:
      process.exit();
  }
})();
