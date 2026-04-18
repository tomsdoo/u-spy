export function templateMinify() {
  const templateFilePattern = /\/template\.ts$/;

  return {
    name: "template-minify",
    transform(code: string, id: string) {
      const normalizedId = id.split("?", 1)[0] ?? id;
      if (templateFilePattern.test(normalizedId) === false) {
        return null;
      }

      return {
        code: code.replace(
          /\s+/g,
          " ",
        ),
      };
    },
  };
}
