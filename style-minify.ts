export function styleMinify() {
  const targetTemplatePattern = /src\/components\/(log\/list|dialog)\/template\.ts$/;

  return {
    name: "style-minify",
    transform(code: string, id: string) {
      const normalizedId = id.split("?", 1)[0] ?? id;
      if (targetTemplatePattern.test(normalizedId) === false) {
        return null;
      }

      return {
        code: code.replace(
          /((?:\n|.)*)(<style>(?:\n|.)*<\/style>)((?:\n|.)*)/,
          (_match: string, before: string, styleBlock: string, after: string) => `${before}${styleBlock.replace(/\s+/g, " ")}${after}`,
        ),
      };
    },
  };
}
