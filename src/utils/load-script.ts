export function loadScript(
  src: string,
  {
    type = undefined,
  }: {
    type?: string;
  } = {},
): Promise<string> {
  return new Promise((resolve, reject) => {
    const scriptTag = document.createElement("script");
    scriptTag.src = src;

    if (type != null) {
      scriptTag.setAttribute("type", type);
    }

    scriptTag.addEventListener("load", () => {
      resolve(src);
    });
    scriptTag.addEventListener("error", (e) => {
      reject(e);
    });
    document.head.appendChild(scriptTag);
  });
}
