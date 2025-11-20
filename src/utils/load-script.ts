export function loadScript(
  src: string,
  options: {
    async?: boolean;
    defer?: boolean;
    type?: string;
  } = {},
): Promise<string> {
  return new Promise((resolve, reject) => {
    const scriptTag = document.createElement("script");
    scriptTag.src = src;

    if (options?.type != null) {
      scriptTag.setAttribute("type", options.type);
    }

    scriptTag.toggleAttribute("async", options?.async === true);
    scriptTag.toggleAttribute("defer", options?.defer === true);

    scriptTag.addEventListener("load", () => {
      resolve(src);
    });
    scriptTag.addEventListener("error", (e) => {
      reject(e);
    });
    document.head.appendChild(scriptTag);
  });
}
