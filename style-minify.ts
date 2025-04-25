import { readFile } from "fs/promises";

export function styleMinify() {
  return {
    name: "style-minify",
    setup(build) {
      build.onLoad({
        filter: /\.ts$/,
      },
        async (args) => {
          const isTargetTemplate = /src\/components\/(log\/list|dialog)\/template\.ts/.test(args.path);
          if (isTargetTemplate === false) {
            return null;
          }
          const fileContent = await readFile(args.path, { encoding: "utf8" });
          return {
            contents: fileContent.replace(
              /((?:\n|.)*)(<style>(?:\n|.)*<\/style>)((?:\n|.)*)/,
              ($0, $1, $2, $3) => `${$1}${$2.replace(/\s+/g, ' ')}${$3}`,
            ),
            loader: "ts",
          };
        },
      )
    },
  };
}
