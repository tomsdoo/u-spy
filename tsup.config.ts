import { defineConfig } from "tsup";
import { styleMinify } from "./style-minify";
import { templateMinify } from "./template-minify";

export default defineConfig({
  entry: ["src/index.ts"],
  clean: true,
  dts: true,
  splitting: false,
  minify: true,
  format: "iife",
  outDir: "dist",
  esbuildPlugins: [templateMinify(),styleMinify()],
});
