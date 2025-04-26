import { readFile } from "fs/promises";

export function templateMinify() {
  return {
    name: "template-minify",
    setup(build) {
      build.onLoad({
        filter: /\/template\.ts$/,
      }, async (args) => {
        const fileContent = await readFile(args.path, { encoding: "utf8" });
        return {
          contents: fileContent.replace(
            /\s+/g,
            " ",
          ),
          loader: "ts",
        };
      });
    },
  };
}
