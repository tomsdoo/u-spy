import { defineConfig } from "tsdown";
import { styleMinify } from "./style-minify.ts";
import { templateMinify } from "./template-minify.ts";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    clean: true,
    dts: false,
    minify: true,
    format: "iife",
    outDir: "dist",
    plugins: [templateMinify(),styleMinify()],
    outputOptions: {
      codeSplitting: false,
    },
  },
  {
    entry: ["src/template-view.ts"],
    clean: false,
    dts: false,
    minify: true,
    format: "iife",
    outDir: "dist",
    plugins: [templateMinify(),styleMinify()],
    outputOptions: {
      codeSplitting: false,
    },
  },
  {
    entry: ["src/lib/index.ts"],
    clean: true,
    dts: false,
    minify: true,
    format: ["esm"],
    outDir: "dist/lib",
  },
]);
