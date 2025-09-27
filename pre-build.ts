import { readdir, readFile, writeFile } from "node:fs/promises";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const componentsDir = fileURLToPath(
  new URL("./src/components", import.meta.url),
);
const files = await readdir(componentsDir, {
  withFileTypes: true,
  recursive: true,
});
const templateTsFiles = files.filter(
  (file) => file.isFile() && file.name === "template.ts",
);
for (const file of templateTsFiles) {
  const importedFunctions: string[] = [];
  const filePath = path.join(file.parentPath, file.name);
  const content = await readFile(filePath, { encoding: "utf8" });
  const definitions = [
    {
      regExp: /(\s*)(align-items:\s+center;)(\s*)/gm,
      replacer: (_$0, $1, _$2, $3) =>
        `${$1}\${alignItemsCenterStyle()}${$3 ?? ""}`,
      usedFunctionName: "alignItemsCenterStyle",
    },
    {
      regExp: /(\s*)(background:\s+transparent;)(\s*)/gm,
      replacer: (_$0, $1, _$2, $3) =>
        `${$1}\${backgroundTransparentStyle()}${$3 ?? ""}`,
      usedFunctionName: "backgroundTransparentStyle",
    },
    {
      regExp: /(\s*)(background:\s+inherit;)(\s*)/gm,
      replacer: (_$0, $1, _$2, $3) =>
        `${$1}\${backgroundInheritStyle()}${$3 ?? ""}`,
      usedFunctionName: "backgroundInheritStyle",
    },
    {
      regExp: /(\s*)(cursor:\s+pointer;)(\s*)/gm,
      replacer: (_$0, $1, _$2, $3) =>
        `${$1}\${cursorPointerStyle()}${$3 ?? ""}`,
      usedFunctionName: "cursorPointerStyle",
    },
    {
      regExp: /(\s*)(color:\s+inherit;)(\s*)/gm,
      replacer: (_$0, $1, _$2, $3) => `${$1}\${colorInheritStyle()}${$3 ?? ""}`,
      usedFunctionName: "colorInheritStyle",
    },
    {
      regExp: /(\s*)(display:\s+grid;)(\s*)/gm,
      replacer: (_$0, $1, _$2, $3) => `${$1}\${displayGridStyle()}${$3 ?? ""}`,
      usedFunctionName: "displayGridStyle",
    },
    {
      regExp: /(\s*)(display:\s+none;)(\s*)/gm,
      replacer: (_$0, $1, _$2, $3) => `${$1}\${displayNoneStyle()}${$3 ?? ""}`,
      usedFunctionName: "displayNoneStyle",
    },
    {
      regExp: /(\s*)(justify-content:\s+center;)(\s*)/gm,
      replacer: (_$0, $1, _$2, $3) =>
        `${$1}\${justifyContentCenterStyle()}${$3 ?? ""}`,
      usedFunctionName: "justifyContentCenterStyle",
    },
    {
      regExp: /(\s*)(justify-content:\s+end;)(\s*)/gm,
      replacer: (_$0, $1, _$2, $3) =>
        `${$1}\${justifyContentEndStyle()}${$3 ?? ""}`,
      usedFunctionName: "justifyContentEndStyle",
    },
    {
      regExp: /(\s*)(position:\s+relative;)(\s*)/gm,
      replacer: (_$0, $1, _$2, $3) =>
        `${$1}\${positionRelativeStyle()}${$3 ?? ""}`,
      usedFunctionName: "positionRelativeStyle",
    },
    {
      regExp: /(\s*)(position:\s+absolute;)(\s*)/gm,
      replacer: (_$0, $1, _$2, $3) =>
        `${$1}\${positionAbsoluteStyle()}${$3 ?? ""}`,
      usedFunctionName: "positionAbsoluteStyle",
    },
    {
      regExp: /(\s*)(position:\s+fixed;)(\s*)/gm,
      replacer: (_$0, $1, _$2, $3) =>
        `${$1}\${positionFixedStyle()}${$3 ?? ""}`,
      usedFunctionName: "positionFixedStyle",
    },
    {
      regExp: /(\s*)(box-sizing:\s+border-box;)(\s*)/gm,
      replacer: (_$0, $1, _$2, $3) =>
        `${$1}\${boxSizingBorderBoxStyle()}${$3 ?? ""}`,
      usedFunctionName: "boxSizingBorderBoxStyle",
    },
    {
      regExp: /(\s*)(margin-block-start:\s+0;)(\s*)/gm,
      replacer: (_$0, $1, _$2, $3) =>
        `${$1}\${marginBlockStartZeroStyle()}${$3 ?? ""}`,
      usedFunctionName: "marginBlockStartZeroStyle",
    },
    {
      regExp: /(\s*)(margin-block-end:\s+0;)(\s*)/gm,
      replacer: (_$0, $1, _$2, $3) =>
        `${$1}\${marginBlockEndZeroStyle()}${$3 ?? ""}`,
      usedFunctionName: "marginBlockEndZeroStyle",
    },
    {
      regExp: /(\s*)(padding-inline-start:\s+0;)(\s*)/gm,
      replacer: (_$0, $1, _$2, $3) =>
        `${$1}\${paddingInlineStartZeroStyle()}${$3 ?? ""}`,
      usedFunctionName: "paddingInlineStartZeroStyle",
    },
    {
      regExp: /(\s*)(list-style-type:\s+none;)(\s*)/gm,
      replacer: (_$0, $1, _$2, $3) =>
        `${$1}\${listStyleTypeNoneStyle()}${$3 ?? ""}`,
      usedFunctionName: "listStyleTypeNoneStyle",
    },
    {
      regExp: /(\s*)(z-index:\s+calc\(infinity\);)(\s*)/gm,
      replacer: (_$0, $1, _$2, $3) =>
        `${$1}\${zIndexInfinityStyle()}${$3 ?? ""}`,
      usedFunctionName: "zIndexInfinityStyle",
    },
    // property names goes below
    {
      regExp: /(\s*)(text-align:)(\s+.+?;\s*)/gm,
      replacer: (_$0, $1, _$2, $3) =>
        `${$1}\${textAlignPropertyStyle()}${$3 ?? ""}`,
      usedFunctionName: "textAlignPropertyStyle",
    },
    {
      regExp: /(\s*)(box-shadow:)(\s+.+?;\s*)/gm,
      replacer: (_$0, $1, _$2, $3) =>
        `${$1}\${boxShadowPropertyStyle()}${$3 ?? ""}`,
      usedFunctionName: "boxShadowPropertyStyle",
    },
    {
      regExp: /(\s*)(border-radius:)(\s+.+?;\s*)/gm,
      replacer: (_$0, $1, _$2, $3) =>
        `${$1}\${borderRadiusPropertyStyle()}${$3 ?? ""}`,
      usedFunctionName: "borderRadiusPropertyStyle",
    },
    {
      regExp: /(\s*)(font-size:)(\s+.+?;\s*)/gm,
      replacer: (_$0, $1, _$2, $3) =>
        `${$1}\${fontSizePropertyStyle()}${$3 ?? ""}`,
      usedFunctionName: "fontSizePropertyStyle",
    },
    {
      regExp: /(\s*)(grid-template-columns:)(\s+.+?;\s*)/gm,
      replacer: (_$0, $1, _$2, $3) =>
        `${$1}\${gridTemplateColumnsPropertyStyle()}${$3 ?? ""}`,
      usedFunctionName: "gridTemplateColumnsPropertyStyle",
    },
    {
      regExp: /(\s*)(grid-template-rows:)(\s+.+?;\s*)/gm,
      replacer: (_$0, $1, _$2, $3) =>
        `${$1}\${gridTemplateRowsPropertyStyle()}${$3 ?? ""}`,
      usedFunctionName: "gridTemplateRowsPropertyStyle",
    },
    {
      regExp: /(\s*)(justify-content:)(\s+.+?;\s*)/gm,
      replacer: (_$0, $1, _$2, $3) =>
        `${$1}\${justifyContentPropertyStyle()}${$3 ?? ""}`,
      usedFunctionName: "justifyContentPropertyStyle",
    },
    {
      regExp: /(\s*)(align-items:)(\s+.+?;\s*)/gm,
      replacer: (_$0, $1, _$2, $3) =>
        `${$1}\${alignItemsPropertyStyle()}${$3 ?? ""}`,
      usedFunctionName: "alignItemsPropertyStyle",
    },
    {
      regExp: /(\s*)(max-width:)(\s+.+?;\s*)/gm,
      replacer: (_$0, $1, _$2, $3) =>
        `${$1}\${maxWidthPropertyStyle()}${$3 ?? ""}`,
      usedFunctionName: "maxWidthPropertyStyle",
    },
    {
      regExp: /(\s*)(max-height:)(\s+.+?;\s*)/gm,
      replacer: (_$0, $1, _$2, $3) =>
        `${$1}\${maxHeightPropertyStyle()}${$3 ?? ""}`,
      usedFunctionName: "maxHeightPropertyStyle",
    },
    {
      regExp: /(\s*)(min-width:)(\s+.+?;\s*)/gm,
      replacer: (_$0, $1, _$2, $3) =>
        `${$1}\${minWidthPropertyStyle()}${$3 ?? ""}`,
      usedFunctionName: "minWidthPropertyStyle",
    },
    {
      regExp: /(\s*)(min-height:)(\s+.+?;\s*)/gm,
      replacer: (_$0, $1, _$2, $3) =>
        `${$1}\${minHeightPropertyStyle()}${$3 ?? ""}`,
      usedFunctionName: "minHeightPropertyStyle",
    },
    {
      regExp: /(\s*)(line-height:)(\s+.+?;\s*)/gm,
      replacer: (_$0, $1, _$2, $3) =>
        `${$1}\${lineHeightPropertyStyle()}${$3 ?? ""}`,
      usedFunctionName: "lineHeightPropertyStyle",
    },
  ];
  let currentContent = content;
  for (const { regExp, replacer, usedFunctionName } of definitions) {
    const matched = currentContent.match(regExp);
    if (matched == null) {
      continue;
    }
    currentContent = currentContent.replace(regExp, replacer);
    importedFunctions.push(usedFunctionName);
  }
  if (importedFunctions.length === 0) {
    continue;
  }
  const nextContent = [
    `import { ${importedFunctions.join(", ")} } from "@/style-utils";`,
    currentContent,
  ].join("\n");
  await writeFile(filePath, nextContent, { encoding: "utf8" });
}
