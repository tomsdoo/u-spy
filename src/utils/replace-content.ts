import { createTrustedHtml } from "@/trusted-policy";

export type Replacer = (text: string) => string;
export function replaceContent(
  selector: string,
  replacers: Replacer | Replacer[],
) {
  const adjustedReplacers = Array.isArray(replacers) ? replacers : [replacers];
  function replaceHtml(text: string) {
    const nextText = adjustedReplacers.reduce((transformedText, replacer) => {
      return replacer(transformedText);
    }, text);
    return {
      nextText,
      changed: nextText !== text,
    };
  }
  document.querySelectorAll(selector).forEach((el) => {
    for (const child of Array.from(el.childNodes)) {
      if (child.nodeType !== child.TEXT_NODE) {
        continue;
      }
      if (child.textContent == null) {
        continue;
      }
      const { nextText, changed } = replaceHtml(child.textContent);
      if (changed === false) {
        continue;
      }
      child.before(
        document
          .createRange()
          .createContextualFragment(createTrustedHtml(nextText)),
      );
      child.remove();
    }
  });
}
