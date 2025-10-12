export function loadScript(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const scriptTag = document.createElement("script");
    scriptTag.src = src;
    scriptTag.addEventListener("load", () => {
      resolve(src);
    });
    scriptTag.addEventListener("error", (e) => {
      reject(e);
    });
    document.head.appendChild(scriptTag);
  });
}
