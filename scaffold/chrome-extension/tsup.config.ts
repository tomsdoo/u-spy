import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  clean: true,
  dts: false,
  splitting: false,
  minify: true,
  format: "iife",
  outDir: "dist",
  publicDir: "public",
});
